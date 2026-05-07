import { task } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/db/prisma";
import { resend } from "@/lib/email/resend";
import { findMatchingSubscriptions } from "@/lib/email/notification-matching";
import { RegulationChangeEmail } from "@/lib/email/templates/regulation-change";
import * as Sentry from "@sentry/nextjs";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://checkorbit.com";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Check Orbit <alerts@checkorbit.com>";

type RegulationChangePayload = {
  compoundId: string;
  compoundName: string;
  countryCode: string;
  countryName: string;
  previousStatus: string;
  newStatus: string;
  sourceDocument: string;
  sourceUrl: string;
};

export const dispatchRegulationChange = task({
  id: "dispatch-regulation-change",
  retry: { maxAttempts: 3 },
  run: async (payload: RegulationChangePayload) => {
    const {
      compoundId,
      countryCode,
      countryName,
      previousStatus,
      newStatus,
      sourceDocument,
      sourceUrl,
    } = payload;

    // Find all active subscriptions matching this compound-country pair
    const subscriptions = await findMatchingSubscriptions(
      compoundId,
      countryCode
    );

    if (subscriptions.length === 0) {
      return { sent: 0, total: 0 };
    }

    // Look up user emails from Clerk (batch to avoid N+1)
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const userIds = [...new Set(subscriptions.map((s) => s.userId))];

    const userEmails = new Map<string, string>();
    for (const userId of userIds) {
      try {
        const user = await client.users.getUser(userId);
        const email = user.emailAddresses.find(
          (e) => e.id === user.primaryEmailAddressId
        )?.emailAddress;
        if (email) userEmails.set(userId, email);
      } catch (err) {
        Sentry.captureException(err, {
          extra: { userId, context: "dispatch-regulation-change" },
        });
      }
    }

    // Resolve medication brand names for saved searches
    const medSlugs = [...new Set(subscriptions.map((s) => s.medicationSlug))];
    const medications = await prisma.medication.findMany({
      where: { slug: { in: medSlugs } },
      select: { slug: true, brandName: true },
    });
    const medNameMap = new Map(medications.map((m) => [m.slug, m.brandName]));

    let sent = 0;
    const changeDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Send emails in batches of 50 for throughput
    const BATCH_SIZE = 50;
    for (let i = 0; i < subscriptions.length; i += BATCH_SIZE) {
      const batch = subscriptions.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (sub) => {
          const email = userEmails.get(sub.userId);
          if (!email) return;

          const medicationName =
            medNameMap.get(sub.medicationSlug) ?? sub.medicationSlug;
          const resultUrl = `${BASE_URL}/check/${sub.medicationSlug}/${countryCode.toLowerCase()}`;
          const unsubscribeUrl = `${BASE_URL}/api/notifications/unsubscribe?token=${sub.unsubscribeToken}`;

          try {
            await resend.emails.send({
              from: FROM_EMAIL,
              to: email,
              subject: `Regulation change: ${medicationName} in ${countryName} is now ${newStatus}`,
              react: RegulationChangeEmail({
                medicationName,
                countryName,
                previousStatus,
                newStatus,
                changeDate,
                sourceDocument,
                sourceUrl,
                resultUrl,
                unsubscribeUrl,
              }),
              headers: {
                "List-Unsubscribe": `<${unsubscribeUrl}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
              },
            });
            sent++;
          } catch (err) {
            Sentry.captureException(err, {
              extra: {
                subscriptionId: sub.subscriptionId,
                userId: sub.userId,
                context: "regulation-change-email",
              },
            });
          }
        })
      );
    }

    return { sent, total: subscriptions.length };
  },
});

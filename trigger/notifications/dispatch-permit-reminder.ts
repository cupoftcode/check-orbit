import { schedules, task } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/db/prisma";
import { resend } from "@/lib/email/resend";
import {
  findDuePermitReminders,
  shouldSendReminder,
} from "@/lib/email/notification-matching";
import { PermitReminderEmail } from "@/lib/email/templates/permit-reminder";
import * as Sentry from "@sentry/nextjs";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://checkorbit.com";
const FROM_EMAIL =
  process.env.EMAIL_FROM ?? "Check Orbit <reminders@checkorbit.com>";

/**
 * Send a single permit reminder email. Used as a sub-task for
 * retry isolation — one failure doesn't block others.
 */
export const sendPermitReminder = task({
  id: "send-permit-reminder",
  retry: { maxAttempts: 3 },
  run: async (payload: {
    subscriptionId: string;
    userId: string;
    medicationSlug: string;
    countryCode: string;
    departureDate: string;
    unsubscribeToken: string;
    daysUntilDeparture: number;
    window: string;
  }) => {
    const {
      userId,
      medicationSlug,
      countryCode,
      departureDate,
      unsubscribeToken,
      daysUntilDeparture,
    } = payload;

    // Look up user email
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!email) return { sent: false, reason: "no-email" };

    // Resolve medication + regulation details
    const medication = await prisma.medication.findUnique({
      where: { slug: medicationSlug },
      select: { brandName: true, compounds: { select: { compoundId: true } } },
    });

    if (!medication) return { sent: false, reason: "medication-not-found" };

    const country = await prisma.country.findUnique({
      where: { code: countryCode.toUpperCase() },
    });

    if (!country) return { sent: false, reason: "country-not-found" };

    // Find permit details from regulation
    const compoundIds = medication.compounds.map((c) => c.compoundId);
    const regulation = await prisma.regulation.findFirst({
      where: {
        compoundId: { in: compoundIds },
        countryId: country.id,
        permitAuthority: { not: null },
        permitLeadTimeDays: { not: null },
      },
      select: {
        permitAuthority: true,
        permitApplicationUrl: true,
        permitLeadTimeDays: true,
      },
    });

    if (!regulation?.permitAuthority || !regulation.permitLeadTimeDays) {
      return { sent: false, reason: "no-permit-required" };
    }

    const isPastDeadline = daysUntilDeparture < regulation.permitLeadTimeDays;
    const resultUrl = `${BASE_URL}/check/${medicationSlug}/${countryCode.toLowerCase()}`;
    const unsubscribeUrl = `${BASE_URL}/api/notifications/unsubscribe?token=${unsubscribeToken}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: isPastDeadline
        ? `Permit deadline passed — ${medication.brandName} for ${country.name}`
        : `Permit reminder: ${daysUntilDeparture} days until departure — ${medication.brandName}`,
      react: PermitReminderEmail({
        medicationName: medication.brandName,
        countryName: country.name,
        permitAuthority: regulation.permitAuthority,
        applicationUrl: regulation.permitApplicationUrl,
        daysUntilDeparture,
        permitLeadTimeDays: regulation.permitLeadTimeDays,
        isPastDeadline,
        resultUrl,
        unsubscribeUrl,
      }),
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    return {
      sent: true,
      departure: departureDate,
      daysUntil: daysUntilDeparture,
    };
  },
});

/**
 * Daily scheduled task that checks for permit deadlines
 * and dispatches reminder emails at 4w, 2w, 1w intervals.
 */
export const dailyPermitReminderCheck = schedules.task({
  id: "daily-permit-reminder-check",
  run: async () => {
    const dueReminders = await findDuePermitReminders();
    let dispatched = 0;

    for (const reminder of dueReminders) {
      const { shouldSend, daysUntilDeparture, window } = shouldSendReminder(
        reminder.departureDate
      );

      if (!shouldSend) continue;

      try {
        await sendPermitReminder.trigger({
          subscriptionId: reminder.subscriptionId,
          userId: reminder.userId,
          medicationSlug: reminder.medicationSlug,
          countryCode: reminder.countryCode,
          departureDate: reminder.departureDate.toISOString(),
          unsubscribeToken: reminder.unsubscribeToken,
          daysUntilDeparture,
          window,
        });
        dispatched++;
      } catch (err) {
        Sentry.captureException(err, {
          extra: {
            subscriptionId: reminder.subscriptionId,
            context: "daily-permit-reminder-check",
          },
        });
      }
    }

    return { checked: dueReminders.length, dispatched };
  },
});

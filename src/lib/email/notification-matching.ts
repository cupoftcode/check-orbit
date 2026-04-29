import { prisma } from "@/lib/db/prisma";
import crypto from "crypto";

/**
 * Create a one-way hash of a compound-country pair for privacy-preserving matching.
 * The system never reverse-engineers hashes to medication names (FR24).
 */
export function hashCompoundCountryPair(
  compoundId: string,
  countryCode: string
): string {
  return crypto
    .createHash("sha256")
    .update(`${compoundId}:${countryCode}`)
    .digest("hex");
}

/**
 * Given a compound-country regulation change, find all active notification
 * subscriptions that match. We match by looking up saved searches whose
 * medication contains the affected compound in the affected country.
 */
export async function findMatchingSubscriptions(
  compoundId: string,
  countryCode: string
): Promise<
  {
    subscriptionId: string;
    userId: string;
    savedSearchId: string;
    medicationSlug: string;
    unsubscribeToken: string;
  }[]
> {
  // Find medications that contain this compound
  const medicationCompounds = await prisma.medicationCompound.findMany({
    where: { compoundId },
    select: { medication: { select: { slug: true } } },
  });

  const slugs = medicationCompounds.map((mc) => mc.medication.slug);
  if (slugs.length === 0) return [];

  // Find active notification subscriptions for saved searches
  // matching any of these medications in this country
  const subscriptions = await prisma.notificationSubscription.findMany({
    where: {
      isActive: true,
      regulationAlerts: true,
      savedSearch: {
        medicationSlug: { in: slugs },
        countryCode: countryCode.toUpperCase(),
      },
    },
    select: {
      id: true,
      userId: true,
      savedSearchId: true,
      unsubscribeToken: true,
      savedSearch: {
        select: { medicationSlug: true },
      },
    },
  });

  return subscriptions.map((sub) => ({
    subscriptionId: sub.id,
    userId: sub.userId,
    savedSearchId: sub.savedSearchId,
    medicationSlug: sub.savedSearch.medicationSlug,
    unsubscribeToken: sub.unsubscribeToken,
  }));
}

/**
 * Find saved searches with upcoming permit deadlines that need reminders.
 * Returns searches where:
 * - The medication is RESTRICTED at the destination
 * - There's a departure date in the future
 * - Permit reminders are enabled
 * - The departure date falls within a reminder window (4w, 2w, 1w)
 */
export async function findDuePermitReminders(): Promise<
  {
    subscriptionId: string;
    userId: string;
    savedSearchId: string;
    medicationSlug: string;
    countryCode: string;
    departureDate: Date;
    unsubscribeToken: string;
  }[]
> {
  const now = new Date();
  // Look for departures within the next 28 days (4 weeks)
  const maxDate = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);

  const subscriptions = await prisma.notificationSubscription.findMany({
    where: {
      isActive: true,
      permitReminders: true,
      savedSearch: {
        departureDate: {
          gte: now,
          lte: maxDate,
        },
      },
    },
    select: {
      id: true,
      userId: true,
      savedSearchId: true,
      unsubscribeToken: true,
      savedSearch: {
        select: {
          medicationSlug: true,
          countryCode: true,
          departureDate: true,
        },
      },
    },
  });

  return subscriptions
    .filter((sub) => sub.savedSearch.departureDate !== null)
    .map((sub) => ({
      subscriptionId: sub.id,
      userId: sub.userId,
      savedSearchId: sub.savedSearchId,
      medicationSlug: sub.savedSearch.medicationSlug,
      countryCode: sub.savedSearch.countryCode,
      departureDate: sub.savedSearch.departureDate!,
      unsubscribeToken: sub.unsubscribeToken,
    }));
}

/**
 * Check if a reminder should be sent based on the departure date
 * and standard reminder intervals (4 weeks, 2 weeks, 1 week).
 */
export function shouldSendReminder(
  departureDate: Date,
  now: Date = new Date()
): { shouldSend: boolean; daysUntilDeparture: number; window: string } {
  const msUntil = departureDate.getTime() - now.getTime();
  const daysUntil = Math.ceil(msUntil / (1000 * 60 * 60 * 24));

  // Reminder windows: 28 days (4w), 14 days (2w), 7 days (1w)
  const windows = [
    { days: 28, label: "4 weeks", range: [27, 28] },
    { days: 14, label: "2 weeks", range: [13, 14] },
    { days: 7, label: "1 week", range: [6, 7] },
  ];

  for (const w of windows) {
    if (daysUntil >= w.range[0] && daysUntil <= w.range[1]) {
      return { shouldSend: true, daysUntilDeparture: daysUntil, window: w.label };
    }
  }

  return { shouldSend: false, daysUntilDeparture: daysUntil, window: "" };
}

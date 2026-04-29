import { prisma } from "@/lib/db/prisma";

export type SavedSearchWithNotificationPrefs = {
  savedSearchId: string;
  medicationSlug: string;
  countryCode: string;
  departureDate: string | null;
  regulationAlerts: boolean;
  permitReminders: boolean;
};

/**
 * Fetch all saved searches for a user with their notification preferences.
 * Returns both the saved search data and the subscription toggles.
 */
export async function getSavedSearchesWithNotificationPrefs(
  userId: string
): Promise<SavedSearchWithNotificationPrefs[]> {
  const searches = await prisma.savedSearch.findMany({
    where: { userId },
    include: {
      notifications: {
        where: { userId },
        take: 1,
      },
    },
    orderBy: { savedAt: "desc" },
  });

  return searches.map((search) => {
    const sub = search.notifications[0];
    return {
      savedSearchId: search.id,
      medicationSlug: search.medicationSlug,
      countryCode: search.countryCode,
      departureDate: search.departureDate?.toISOString() ?? null,
      regulationAlerts: sub?.regulationAlerts ?? true,
      permitReminders: sub?.permitReminders ?? true,
    };
  });
}

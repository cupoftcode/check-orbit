import { prisma } from "@/lib/db/prisma";
import { getComplianceResult } from "@/lib/compliance/get-compliance-result";
import type { ComplianceResult } from "@/types/compliance";

export async function getSavedSearchForUser(
  userId: string,
  medicationSlug: string,
  countryCode: string
) {
  return prisma.savedSearch.findUnique({
    where: {
      userId_medicationSlug_countryCode: {
        userId,
        medicationSlug,
        countryCode: countryCode.toUpperCase(),
      },
    },
  });
}

export async function getSavedSearchesForUser(userId: string) {
  return prisma.savedSearch.findMany({
    where: { userId },
    orderBy: { savedAt: "desc" },
  });
}

export type SavedSearchWithChangeStatus = {
  id: string;
  medicationSlug: string;
  countryCode: string;
  savedAt: Date;
  lastCheckedAt: Date;
  snapshot: ComplianceResult;
  currentStatus: string | null;
  hasChanged: boolean;
};

export async function getSavedSearchesWithChangeStatus(
  userId: string
): Promise<SavedSearchWithChangeStatus[]> {
  const searches = await getSavedSearchesForUser(userId);

  const results = await Promise.all(
    searches.map(async (search) => {
      const snapshot = search.resultSnapshot as unknown as ComplianceResult;
      let currentStatus: string | null = null;
      let hasChanged = false;

      try {
        const current = await getComplianceResult(
          search.medicationSlug,
          search.countryCode
        );
        if (current.success) {
          currentStatus = current.data.overallStatus;
          hasChanged = current.data.overallStatus !== snapshot.overallStatus;
        }
      } catch {
        // If we can't fetch current data, show as unchanged
      }

      return {
        id: search.id,
        medicationSlug: search.medicationSlug,
        countryCode: search.countryCode,
        savedAt: search.savedAt,
        lastCheckedAt: search.lastCheckedAt,
        snapshot,
        currentStatus,
        hasChanged,
      };
    })
  );

  return results;
}

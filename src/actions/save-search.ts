"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getUserTier } from "@/lib/payments/subscription";
import type { Prisma } from "@prisma/client";
import type { ComplianceResult } from "@/types/compliance";

type Result =
  | { success: true }
  | { success: false; error: string; code?: string };

export async function saveSearch(
  medicationSlug: string,
  countryCode: string,
  resultSnapshot: ComplianceResult
): Promise<Result> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in to save a search." };
  }

  try {
    // Check free-tier save slot limit
    const tier = await getUserTier(userId);
    if (tier === "free") {
      const existingCount = await prisma.savedSearch.count({
        where: { userId },
      });
      // Free users get one save slot. Check if this is a new search (not an update).
      const existingForThisPair = await prisma.savedSearch.findUnique({
        where: {
          userId_medicationSlug_countryCode: {
            userId,
            medicationSlug,
            countryCode: countryCode.toUpperCase(),
          },
        },
      });
      if (existingCount >= 1 && !existingForThisPair) {
        return {
          success: false,
          error: "Free accounts can save one search. Upgrade to Pro for unlimited saves.",
          code: "SAVE_LIMIT_REACHED",
        };
      }
    }

    await prisma.savedSearch.upsert({
      where: {
        userId_medicationSlug_countryCode: {
          userId,
          medicationSlug,
          countryCode: countryCode.toUpperCase(),
        },
      },
      update: {
        resultSnapshot: JSON.parse(JSON.stringify(resultSnapshot)) as Prisma.InputJsonValue,
        savedAt: new Date(),
        lastCheckedAt: new Date(),
      },
      create: {
        userId,
        medicationSlug,
        countryCode: countryCode.toUpperCase(),
        resultSnapshot: JSON.parse(JSON.stringify(resultSnapshot)) as Prisma.InputJsonValue,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

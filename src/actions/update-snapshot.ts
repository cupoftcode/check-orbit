"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import type { ComplianceResult } from "@/types/compliance";

type Result =
  | { success: true }
  | { success: false; error: string };

export async function updateSnapshot(
  searchId: string,
  currentResult: ComplianceResult
): Promise<Result> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in." };
  }

  try {
    const search = await prisma.savedSearch.findUnique({
      where: { id: searchId },
    });

    if (!search || search.userId !== userId) {
      return { success: false, error: "Search not found." };
    }

    await prisma.savedSearch.update({
      where: { id: searchId },
      data: {
        resultSnapshot: JSON.parse(JSON.stringify(currentResult)) as Prisma.InputJsonValue,
        lastCheckedAt: new Date(),
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

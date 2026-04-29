"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { isCurator } from "@/lib/auth/roles";
import type { Prisma } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

type Result =
  | { success: true }
  | { success: false; error: string };

/**
 * Reject a staging regulation. Marks as REJECTED, writes audit trail.
 */
export async function rejectChange(
  stagingId: string,
  reason: string
): Promise<Result> {
  const { userId } = await auth();
  if (!userId || !(await isCurator())) {
    return { success: false, error: "Unauthorized" };
  }

  if (!reason || reason.trim().length === 0) {
    return { success: false, error: "A rejection reason is required." };
  }

  try {
    const staging = await prisma.stagingRegulation.findUnique({
      where: { id: stagingId },
    });

    if (!staging || staging.reviewStatus !== "PENDING") {
      return { success: false, error: "Change not found or already reviewed." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.stagingRegulation.update({
        where: { id: stagingId },
        data: {
          reviewStatus: "REJECTED",
          reviewedBy: userId,
          reviewedAt: new Date(),
          reviewNotes: reason,
        },
      });

      await tx.auditTrail.create({
        data: {
          stagingId: staging.id,
          action: "REJECTED",
          previousData: {
            proposedStatus: staging.proposedStatus,
            compoundId: staging.compoundId,
            countryId: staging.countryId,
          } as Prisma.InputJsonValue,
          sourceCitation: `${staging.sourceDocumentTitle} — ${staging.sourceDocumentUrl}`,
          performedBy: userId,
          notes: reason,
        },
      });
    });

    return { success: true };
  } catch (err) {
    Sentry.captureException(err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

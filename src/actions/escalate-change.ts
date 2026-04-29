"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { isCurator } from "@/lib/auth/roles";
import { triggerRevalidation } from "@/lib/compliance/revalidation";
import type { Prisma } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

type Result =
  | { success: true }
  | { success: false; error: string };

/**
 * Escalate a staging regulation. Marks as ESCALATED, applies the
 * conservative (most restrictive) interpretation immediately, and
 * writes audit trail.
 */
export async function escalateChange(
  stagingId: string,
  notes: string
): Promise<Result> {
  const { userId } = await auth();
  if (!userId || !(await isCurator())) {
    return { success: false, error: "Unauthorized" };
  }

  if (!notes || notes.trim().length < 20) {
    return {
      success: false,
      error: "Escalation notes must be at least 20 characters.",
    };
  }

  try {
    const staging = await prisma.stagingRegulation.findUnique({
      where: { id: stagingId },
    });

    if (!staging || staging.reviewStatus !== "PENDING") {
      return { success: false, error: "Change not found or already reviewed." };
    }

    // Determine the most restrictive status (conservative interpretation)
    const existingRegulation = await prisma.regulation.findFirst({
      where: {
        compoundId: staging.compoundId,
        countryId: staging.countryId,
      },
    });

    const severity: Record<string, number> = {
      LEGAL: 0,
      PRESCRIPTION_ONLY: 1,
      RESTRICTED: 2,
      BANNED: 3,
    };

    const currentSeverity = severity[existingRegulation?.status ?? "LEGAL"] ?? 0;
    const proposedSeverity = severity[staging.proposedStatus] ?? 0;
    const conservativeStatus =
      proposedSeverity > currentSeverity
        ? staging.proposedStatus
        : existingRegulation?.status ?? staging.proposedStatus;

    await prisma.$transaction(async (tx) => {
      // Apply conservative interpretation to live data if more restrictive
      if (proposedSeverity > currentSeverity && existingRegulation) {
        await tx.regulation.update({
          where: { id: existingRegulation.id },
          data: {
            status: conservativeStatus,
            notes: `[ESCALATED — pending review] ${notes}`,
            lastVerifiedAt: new Date(),
            verifiedBy: userId,
          },
        });
      }

      // Mark staging as escalated
      await tx.stagingRegulation.update({
        where: { id: stagingId },
        data: {
          reviewStatus: "ESCALATED",
          reviewedBy: userId,
          reviewedAt: new Date(),
          escalationNotes: notes,
        },
      });

      // Write audit trail
      await tx.auditTrail.create({
        data: {
          stagingId: staging.id,
          regulationId: existingRegulation?.id,
          action: "ESCALATED",
          previousData: existingRegulation
            ? (JSON.parse(JSON.stringify(existingRegulation)) as Prisma.InputJsonValue)
            : undefined,
          newData: {
            conservativeStatus,
            proposedStatus: staging.proposedStatus,
            compoundId: staging.compoundId,
            countryId: staging.countryId,
          } as Prisma.InputJsonValue,
          sourceCitation: `${staging.sourceDocumentTitle} — ${staging.sourceDocumentUrl}`,
          performedBy: userId,
          notes,
        },
      });
    });

    // Revalidate if we changed the live data
    if (proposedSeverity > currentSeverity) {
      triggerRevalidation(staging.compoundId, staging.countryId).catch((err) =>
        Sentry.captureException(err)
      );
    }

    return { success: true };
  } catch (err) {
    Sentry.captureException(err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

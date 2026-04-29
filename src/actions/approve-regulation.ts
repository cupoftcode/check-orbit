"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { isCurator } from "@/lib/auth/roles";
import { triggerRevalidation } from "@/lib/compliance/revalidation";
import { regulationApproved } from "../../trigger/events/regulation-approved";
import type { Prisma } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

type Result =
  | { success: true }
  | { success: false; error: string };

/**
 * Approve a staging regulation: copy to live table, write audit trail,
 * trigger ISR revalidation, and emit regulation.approved event.
 */
export async function approveRegulation(
  stagingId: string,
  edits?: {
    proposedStatus?: string;
    requiredDocuments?: string | null;
    quantityLimits?: string | null;
    permitAuthority?: string | null;
    permitApplicationUrl?: string | null;
    permitLeadTimeDays?: number | null;
    dosageThreshold?: string | null;
    biosecurityFlag?: boolean;
    biosecurityDetails?: string | null;
  }
): Promise<Result> {
  const { userId } = await auth();
  if (!userId || !(await isCurator())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const staging = await prisma.stagingRegulation.findUnique({
      where: { id: stagingId },
      include: {
        compound: { select: { name: true } },
        country: { select: { code: true, name: true } },
      },
    });

    if (!staging || staging.reviewStatus !== "PENDING") {
      return { success: false, error: "Change not found or already reviewed." };
    }

    // Capture previous state for audit
    const existingRegulation = await prisma.regulation.findFirst({
      where: {
        compoundId: staging.compoundId,
        countryId: staging.countryId,
        regulatoryAuthority: staging.regulatoryAuthority ?? "Unknown",
      },
    });

    const previousData = existingRegulation
      ? JSON.parse(JSON.stringify(existingRegulation))
      : null;
    const previousStatus = existingRegulation?.status ?? "NEW";

    // Apply edits if provided
    const finalStatus =
      (edits?.proposedStatus as "LEGAL" | "PRESCRIPTION_ONLY" | "RESTRICTED" | "BANNED") ??
      staging.proposedStatus;

    // Atomic transaction: update live table + audit + mark staging
    await prisma.$transaction(async (tx) => {
      // Upsert to live regulations table
      await tx.regulation.upsert({
        where: {
          compoundId_countryId_regulatoryAuthority: {
            compoundId: staging.compoundId,
            countryId: staging.countryId,
            regulatoryAuthority: staging.regulatoryAuthority ?? "Unknown",
          },
        },
        update: {
          status: finalStatus,
          requiredDocuments: edits?.requiredDocuments ?? staging.requiredDocuments,
          quantityLimits: edits?.quantityLimits ?? staging.quantityLimits,
          permitAuthority: edits?.permitAuthority ?? staging.permitAuthority,
          permitApplicationUrl: edits?.permitApplicationUrl ?? staging.permitApplicationUrl,
          permitLeadTimeDays: edits?.permitLeadTimeDays ?? staging.permitLeadTimeDays,
          dosageThreshold: edits?.dosageThreshold ?? staging.dosageThreshold,
          biosecurityFlag: edits?.biosecurityFlag ?? staging.biosecurityFlag,
          biosecurityDetails: edits?.biosecurityDetails ?? staging.biosecurityDetails,
          sourceDocumentTitle: staging.sourceDocumentTitle,
          sourceDocumentUrl: staging.sourceDocumentUrl,
          lastVerifiedAt: new Date(),
          verifiedBy: userId,
        },
        create: {
          compoundId: staging.compoundId,
          countryId: staging.countryId,
          status: finalStatus,
          regulatoryAuthority: staging.regulatoryAuthority ?? "Unknown",
          requiredDocuments: edits?.requiredDocuments ?? staging.requiredDocuments,
          quantityLimits: edits?.quantityLimits ?? staging.quantityLimits,
          permitAuthority: edits?.permitAuthority ?? staging.permitAuthority,
          permitApplicationUrl: edits?.permitApplicationUrl ?? staging.permitApplicationUrl,
          permitLeadTimeDays: edits?.permitLeadTimeDays ?? staging.permitLeadTimeDays,
          dosageThreshold: edits?.dosageThreshold ?? staging.dosageThreshold,
          biosecurityFlag: edits?.biosecurityFlag ?? staging.biosecurityFlag,
          biosecurityDetails: edits?.biosecurityDetails ?? staging.biosecurityDetails,
          sourceDocumentTitle: staging.sourceDocumentTitle,
          sourceDocumentUrl: staging.sourceDocumentUrl,
          lastVerifiedAt: new Date(),
          verifiedBy: userId,
        },
      });

      // Write audit trail entry (append-only)
      await tx.auditTrail.create({
        data: {
          stagingId: staging.id,
          action: "APPROVED",
          previousData: previousData as Prisma.InputJsonValue ?? undefined,
          newData: {
            status: finalStatus,
            compoundId: staging.compoundId,
            countryId: staging.countryId,
            sourceDocumentTitle: staging.sourceDocumentTitle,
            sourceDocumentUrl: staging.sourceDocumentUrl,
          } as Prisma.InputJsonValue,
          sourceCitation: `${staging.sourceDocumentTitle} — ${staging.sourceDocumentUrl}`,
          performedBy: userId,
        },
      });

      // Mark staging as approved
      await tx.stagingRegulation.update({
        where: { id: stagingId },
        data: {
          reviewStatus: "APPROVED",
          reviewedBy: userId,
          reviewedAt: new Date(),
        },
      });
    });

    // Trigger ISR revalidation (non-blocking)
    triggerRevalidation(staging.compoundId, staging.countryId).catch((err) =>
      Sentry.captureException(err)
    );

    // Fire regulation.approved event (fire-and-forget)
    regulationApproved.trigger({
      compoundId: staging.compoundId,
      compoundName: staging.compound.name,
      countryId: staging.countryId,
      countryCode: staging.country.code,
      countryName: staging.country.name,
      previousStatus: String(previousStatus),
      newStatus: finalStatus,
      sourceDocument: staging.sourceDocumentTitle,
      sourceUrl: staging.sourceDocumentUrl,
      approvedAt: new Date().toISOString(),
    }).catch((e: unknown) => Sentry.captureException(e));

    return { success: true };
  } catch (err) {
    Sentry.captureException(err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Quick approve from the queue (high-confidence items only).
 */
export async function quickApprove(stagingId: string): Promise<Result> {
  return approveRegulation(stagingId);
}

/**
 * Quick reject from the queue.
 */
export async function quickReject(
  stagingId: string,
  reason: string
): Promise<Result> {
  const { rejectChange } = await import("@/actions/reject-change");
  return rejectChange(stagingId, reason);
}

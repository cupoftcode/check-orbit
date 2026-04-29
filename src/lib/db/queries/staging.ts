import { prisma } from "@/lib/db/prisma";
import type { AiConfidence, ReviewStatus } from "@prisma/client";

export type StagingRegulationWithRelations = {
  id: string;
  compoundId: string;
  compoundName: string;
  countryId: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  proposedStatus: string;
  regulatoryAuthority: string | null;
  sourceDocumentTitle: string;
  sourceDocumentUrl: string;
  aiConfidence: AiConfidence;
  aiExtractedText: string;
  aiTranslation: string | null;
  flaggedAt: Date;
  reviewStatus: ReviewStatus;
  requiredDocuments: string | null;
  quantityLimits: string | null;
  permitAuthority: string | null;
  permitApplicationUrl: string | null;
  permitLeadTimeDays: number | null;
  dosageThreshold: string | null;
  biosecurityFlag: boolean;
  biosecurityDetails: string | null;
};

/**
 * Fetch pending staging regulations for the curator queue.
 * Sorted by confidence (HIGH first) then by flaggedAt (newest first).
 */
export async function getPendingStagingRegulations(filters?: {
  confidence?: AiConfidence;
  countryCode?: string;
  compoundName?: string;
}): Promise<StagingRegulationWithRelations[]> {
  const where: Record<string, unknown> = {
    reviewStatus: "PENDING",
  };

  if (filters?.confidence) {
    where.aiConfidence = filters.confidence;
  }

  if (filters?.countryCode) {
    where.country = { code: filters.countryCode.toUpperCase() };
  }

  if (filters?.compoundName) {
    where.compound = {
      name: { contains: filters.compoundName, mode: "insensitive" },
    };
  }

  const items = await prisma.stagingRegulation.findMany({
    where,
    include: {
      compound: { select: { name: true } },
      country: { select: { code: true, name: true, flagEmoji: true } },
    },
    orderBy: [
      { aiConfidence: "asc" }, // HIGH < LOW alphabetically — we'll re-sort
      { flaggedAt: "desc" },
    ],
  });

  // Re-sort: HIGH > MEDIUM > LOW
  const confidenceOrder: Record<AiConfidence, number> = {
    HIGH: 0,
    MEDIUM: 1,
    LOW: 2,
  };

  items.sort(
    (a, b) =>
      confidenceOrder[a.aiConfidence] - confidenceOrder[b.aiConfidence] ||
      b.flaggedAt.getTime() - a.flaggedAt.getTime()
  );

  return items.map((item) => ({
    id: item.id,
    compoundId: item.compoundId,
    compoundName: item.compound.name,
    countryId: item.countryId,
    countryCode: item.country.code,
    countryName: item.country.name,
    countryFlag: item.country.flagEmoji,
    proposedStatus: item.proposedStatus,
    regulatoryAuthority: item.regulatoryAuthority,
    sourceDocumentTitle: item.sourceDocumentTitle,
    sourceDocumentUrl: item.sourceDocumentUrl,
    aiConfidence: item.aiConfidence,
    aiExtractedText: item.aiExtractedText,
    aiTranslation: item.aiTranslation,
    flaggedAt: item.flaggedAt,
    reviewStatus: item.reviewStatus,
    requiredDocuments: item.requiredDocuments,
    quantityLimits: item.quantityLimits,
    permitAuthority: item.permitAuthority,
    permitApplicationUrl: item.permitApplicationUrl,
    permitLeadTimeDays: item.permitLeadTimeDays,
    dosageThreshold: item.dosageThreshold,
    biosecurityFlag: item.biosecurityFlag,
    biosecurityDetails: item.biosecurityDetails,
  }));
}

/**
 * Fetch a single staging regulation by ID with full details.
 */
export async function getStagingRegulationById(
  id: string
): Promise<StagingRegulationWithRelations | null> {
  const item = await prisma.stagingRegulation.findUnique({
    where: { id },
    include: {
      compound: { select: { name: true } },
      country: { select: { code: true, name: true, flagEmoji: true } },
    },
  });

  if (!item) return null;

  return {
    id: item.id,
    compoundId: item.compoundId,
    compoundName: item.compound.name,
    countryId: item.countryId,
    countryCode: item.country.code,
    countryName: item.country.name,
    countryFlag: item.country.flagEmoji,
    proposedStatus: item.proposedStatus,
    regulatoryAuthority: item.regulatoryAuthority,
    sourceDocumentTitle: item.sourceDocumentTitle,
    sourceDocumentUrl: item.sourceDocumentUrl,
    aiConfidence: item.aiConfidence,
    aiExtractedText: item.aiExtractedText,
    aiTranslation: item.aiTranslation,
    flaggedAt: item.flaggedAt,
    reviewStatus: item.reviewStatus,
    requiredDocuments: item.requiredDocuments,
    quantityLimits: item.quantityLimits,
    permitAuthority: item.permitAuthority,
    permitApplicationUrl: item.permitApplicationUrl,
    permitLeadTimeDays: item.permitLeadTimeDays,
    dosageThreshold: item.dosageThreshold,
    biosecurityFlag: item.biosecurityFlag,
    biosecurityDetails: item.biosecurityDetails,
  };
}

/**
 * Get data freshness status per country.
 */
export async function getDataFreshness(): Promise<
  {
    countryCode: string;
    countryName: string;
    flagEmoji: string;
    oldestVerification: Date | null;
    daysSinceVerification: number | null;
    freshnessStatus: "current" | "aging" | "stale";
  }[]
> {
  const countries = await prisma.country.findMany({
    where: { isCovered: true },
    include: {
      regulations: {
        select: { lastVerifiedAt: true },
        orderBy: { lastVerifiedAt: "asc" },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });

  const now = new Date();

  return countries.map((c) => {
    const oldest = c.regulations[0]?.lastVerifiedAt ?? null;
    const daysSince = oldest
      ? Math.floor((now.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    let freshnessStatus: "current" | "aging" | "stale" = "current";
    if (daysSince === null || daysSince > 180) {
      freshnessStatus = "stale";
    } else if (daysSince > 90) {
      freshnessStatus = "aging";
    }

    return {
      countryCode: c.code,
      countryName: c.name,
      flagEmoji: c.flagEmoji,
      oldestVerification: oldest,
      daysSinceVerification: daysSince,
      freshnessStatus,
    };
  });
}

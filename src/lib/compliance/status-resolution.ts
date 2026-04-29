import {
  ComplianceStatus,
  STATUS_SEVERITY,
  type ComplianceResultCompound,
} from "@/types/compliance";
import type { Regulation } from "@prisma/client";
import { calculateFreshness } from "./data-freshness";

// Prisma generates its own ComplianceStatus enum that is structurally
// identical but nominally distinct. This helper bridges the two.
function toAppStatus(prismaStatus: Regulation["status"]): ComplianceStatus {
  return prismaStatus as unknown as ComplianceStatus;
}

/**
 * Given multiple regulations for the same compound in the same country
 * (from different regulatory authorities), apply the most restrictive
 * interpretation per FR36.
 */
export function resolveMultiAuthorityConflict(
  regulations: Regulation[]
): Regulation {
  return regulations.reduce((mostRestrictive, reg) =>
    STATUS_SEVERITY[toAppStatus(reg.status)] >
    STATUS_SEVERITY[toAppStatus(mostRestrictive.status)]
      ? reg
      : mostRestrictive
  );
}

/**
 * Determine the overall compliance status for a medication by taking
 * the most restrictive status across all its compounds.
 */
export function resolveOverallStatus(
  compoundStatuses: ComplianceStatus[]
): ComplianceStatus {
  return compoundStatuses.reduce((worst, status) =>
    STATUS_SEVERITY[status] > STATUS_SEVERITY[worst] ? status : worst
  );
}

/**
 * Build a ComplianceResultCompound from a set of regulations for one
 * compound in one country. Handles multi-authority conflicts.
 */
export function buildCompoundResult(
  compoundName: string,
  regulations: Regulation[]
): ComplianceResultCompound {
  // Apply most restrictive interpretation across authorities
  const primary = resolveMultiAuthorityConflict(regulations);

  return {
    compoundName,
    status: toAppStatus(primary.status),
    dosageThreshold: primary.dosageThreshold,
    documentation: primary.requiredDocuments,
    quantityLimit: primary.quantityLimits,
    permitRequirement: primary.requiredDocuments,
    permitLeadTimeDays: primary.permitLeadTimeDays,
    permitAuthority: primary.permitAuthority,
    permitApplicationUrl: primary.permitApplicationUrl,
    sourceDocument: primary.sourceDocumentTitle,
    sourceUrl: primary.sourceDocumentUrl,
    lastVerifiedAt: primary.lastVerifiedAt.toISOString(),
    freshnessStatus: calculateFreshness(primary.lastVerifiedAt),
  };
}

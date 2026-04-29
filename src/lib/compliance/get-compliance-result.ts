import { prisma } from "@/lib/db/prisma";
import { decomposeMedication } from "./compound-decomposition";
import {
  buildCompoundResult,
  resolveOverallStatus,
} from "./status-resolution";
import { ComplianceStatus } from "@/types/compliance";
import type { ComplianceResult } from "@/types/compliance";

const DISCLAIMER =
  "This information is provided for informational purposes only and does not constitute legal or medical advice. Always verify with destination country authorities before traveling.";

export type ComplianceQueryResult =
  | { success: true; data: ComplianceResult }
  | { success: false; code: string; message: string };

/**
 * Server-side compliance query — used by the result page for ISR.
 * Bypasses the API route (no rate limiting / auth) since it's
 * called during static generation and on-demand revalidation.
 */
export async function getComplianceResult(
  medSlug: string,
  countryCode: string
): Promise<ComplianceQueryResult> {
  const decomposition = await decomposeMedication(medSlug);
  if (!decomposition) {
    return {
      success: false,
      code: "MEDICATION_NOT_FOUND",
      message: `Medication "${medSlug}" not found in our database.`,
    };
  }

  const country = await prisma.country.findUnique({
    where: { code: countryCode.toUpperCase() },
  });

  if (!country || !country.isCovered) {
    return {
      success: false,
      code: "COUNTRY_NOT_COVERED",
      message: `Country "${countryCode}" is not in our database.`,
    };
  }

  if (
    decomposition.compounds.length === 0 ||
    decomposition.disclosureLevel === "UNDISCLOSED"
  ) {
    return {
      success: false,
      code: "UNABLE_TO_VERIFY",
      message: `Unable to verify "${decomposition.brandName}" — this product has undisclosed ingredients. Consult destination country customs authorities before traveling.`,
    };
  }

  const regulations = await prisma.regulation.findMany({
    where: {
      countryId: country.id,
      compoundId: { in: decomposition.compounds.map((c) => c.id) },
    },
  });

  const regsByCompound = new Map<string, typeof regulations>();
  for (const reg of regulations) {
    const existing = regsByCompound.get(reg.compoundId) ?? [];
    existing.push(reg);
    regsByCompound.set(reg.compoundId, existing);
  }

  const compoundResults = decomposition.compounds.map((compound) => {
    const compoundRegs = regsByCompound.get(compound.id);
    if (!compoundRegs || compoundRegs.length === 0) {
      return {
        compoundName: compound.name,
        status: ComplianceStatus.LEGAL,
        dosageThreshold: null,
        documentation: null,
        quantityLimit: null,
        permitRequirement: null,
        permitLeadTimeDays: null,
        permitAuthority: null,
        permitApplicationUrl: null,
        sourceDocument: "No specific regulation found",
        sourceUrl: "",
        lastVerifiedAt: new Date().toISOString(),
        freshnessStatus: "current" as const,
      };
    }
    return buildCompoundResult(compound.name, compoundRegs);
  });

  const overallStatus = resolveOverallStatus(
    compoundResults.map((c) => c.status)
  );

  const hasBiosecurityWarning = regulations.some((r) => r.biosecurityFlag);
  const biosecurityReg = regulations.find(
    (r) => r.biosecurityFlag && r.biosecurityDetails
  );
  const hasProprietaryBlendWarning =
    decomposition.proprietaryBlend &&
    decomposition.disclosureLevel === "PARTIAL";

  return {
    success: true,
    data: {
      medication: decomposition.brandName,
      country: country.name,
      countryCode: country.code,
      overallStatus,
      compounds: compoundResults,
      disclaimer: DISCLAIMER,
      hasBiosecurityWarning,
      biosecurityDetails: biosecurityReg?.biosecurityDetails ?? null,
      hasProprietaryBlendWarning,
    },
  };
}

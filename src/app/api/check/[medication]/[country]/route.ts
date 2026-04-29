import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { decomposeMedication } from "@/lib/compliance/compound-decomposition";
import {
  buildCompoundResult,
  resolveOverallStatus,
} from "@/lib/compliance/status-resolution";
import { success, error, ErrorCode } from "@/lib/utils/response";
import { checkRateLimit } from "@/lib/rate-limit/rate-limit";
import { ComplianceStatus } from "@/types/compliance";
import type { ComplianceResult } from "@/types/compliance";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

const DISCLAIMER =
  "This information is provided for informational purposes only and does not constitute legal or medical advice. Always verify with destination country authorities before traveling.";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ medication: string; country: string }> }
) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const rateLimitResponse = await checkRateLimit(ip);
  if (rateLimitResponse) return rateLimitResponse;

  const { medication: medSlug, country: countryCode } = await params;

  try {
    // 1. Decompose medication into compounds (FR9)
    const decomposition = await decomposeMedication(medSlug);
    if (!decomposition) {
      return NextResponse.json(
        error(
          ErrorCode.MEDICATION_NOT_FOUND,
          `Medication "${medSlug}" not found in our database.`
        ),
        { status: 404 }
      );
    }

    // 2. Look up country
    const country = await prisma.country.findUnique({
      where: { code: countryCode.toUpperCase() },
    });

    if (!country) {
      return NextResponse.json(
        error(
          ErrorCode.COUNTRY_NOT_COVERED,
          `Country "${countryCode}" is not in our database.`
        ),
        { status: 404 }
      );
    }

    if (!country.isCovered) {
      return NextResponse.json(
        error(
          ErrorCode.COUNTRY_NOT_COVERED,
          `${country.name} is not yet covered. We currently have data for covered countries only.`
        ),
        { status: 404 }
      );
    }

    // 3. Check for proprietary blend / unable to verify (FR13)
    if (
      decomposition.compounds.length === 0 ||
      decomposition.disclosureLevel === "UNDISCLOSED"
    ) {
      return NextResponse.json(
        error(
          ErrorCode.UNABLE_TO_VERIFY,
          `Unable to verify "${decomposition.brandName}" — this product has undisclosed ingredients. Consult destination country customs authorities before traveling.`
        ),
        { status: 422 }
      );
    }

    // 4. Fetch regulations for all compounds in this country (FR10)
    const regulations = await prisma.regulation.findMany({
      where: {
        countryId: country.id,
        compoundId: { in: decomposition.compounds.map((c) => c.id) },
      },
    });

    // 5. Group regulations by compound
    const regsByCompound = new Map<string, typeof regulations>();
    for (const reg of regulations) {
      const existing = regsByCompound.get(reg.compoundId) ?? [];
      existing.push(reg);
      regsByCompound.set(reg.compoundId, existing);
    }

    // 6. Build per-compound results with multi-authority conflict resolution (FR36)
    const compoundResults = decomposition.compounds.map((compound) => {
      const compoundRegs = regsByCompound.get(compound.id);

      if (!compoundRegs || compoundRegs.length === 0) {
        // No regulation data for this compound — mark as unable to verify
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

    // 7. Determine overall status — most restrictive across all compounds (FR12, FR36)
    const overallStatus = resolveOverallStatus(
      compoundResults.map((c) => c.status)
    );

    // 8. Check for biosecurity flags
    const hasBiosecurityWarning = regulations.some((r) => r.biosecurityFlag);
    const biosecurityReg = regulations.find(
      (r) => r.biosecurityFlag && r.biosecurityDetails
    );
    const hasProprietaryBlendWarning =
      decomposition.proprietaryBlend &&
      decomposition.disclosureLevel === "PARTIAL";

    const result: ComplianceResult = {
      medication: decomposition.brandName,
      country: country.name,
      countryCode: country.code,
      overallStatus,
      compounds: compoundResults,
      disclaimer: DISCLAIMER,
      hasBiosecurityWarning,
      biosecurityDetails: biosecurityReg?.biosecurityDetails ?? null,
      hasProprietaryBlendWarning,
    };

    return NextResponse.json(success(result));
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json(
      error("INTERNAL_ERROR", "Something went wrong. Please try again."),
      { status: 500 }
    );
  }
}

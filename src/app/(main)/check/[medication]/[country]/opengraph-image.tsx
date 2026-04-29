import { ImageResponse } from "next/og";
import { getComplianceResult } from "@/lib/compliance/get-compliance-result";
import { prisma } from "@/lib/db/prisma";
import {
  renderRiskCard,
  renderFallback,
  buildAltText,
} from "@/lib/sharing/risk-card-renderer";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateAlt({
  params,
}: {
  params: Promise<{ medication: string; country: string }>;
}) {
  const { medication, country } = await params;
  const result = await getComplianceResult(medication, country);
  return result.success
    ? buildAltText(result.data)
    : "Check Orbit — Medication Compliance";
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ medication: string; country: string }>;
}) {
  const { medication, country } = await params;
  const result = await getComplianceResult(medication, country);

  if (!result.success) {
    return new ImageResponse(renderFallback(), size);
  }

  const { data } = result;

  const countryRecord = await prisma.country.findUnique({
    where: { code: data.countryCode },
    select: { flagEmoji: true },
  });

  return new ImageResponse(
    renderRiskCard({
      data,
      flagEmoji: countryRecord?.flagEmoji ?? "",
      format: "landscape",
    }),
    size
  );
}

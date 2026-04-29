import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { getComplianceResult } from "@/lib/compliance/get-compliance-result";
import { prisma } from "@/lib/db/prisma";
import {
  renderRiskCard,
  renderFallback,
} from "@/lib/sharing/risk-card-renderer";

export const runtime = "nodejs";

const SIZES = {
  square: { width: 1080, height: 1080 },
  landscape: { width: 1200, height: 630 },
} as const;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const med = searchParams.get("med");
  const country = searchParams.get("country");
  const format = searchParams.get("format") === "square" ? "square" : "landscape";
  const size = SIZES[format];

  if (!med || !country) {
    return new ImageResponse(renderFallback(), size);
  }

  const result = await getComplianceResult(med, country);

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
      format,
    }),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    }
  );
}

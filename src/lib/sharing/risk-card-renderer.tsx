import type { ComplianceResult } from "@/types/compliance";
import type { ReactElement } from "react";

const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; accent: string; label: string }
> = {
  LEGAL: {
    bg: "#d1fae5",
    text: "#065f46",
    accent: "#10b981",
    label: "Legal",
  },
  PRESCRIPTION_ONLY: {
    bg: "#e0f2fe",
    text: "#0c4a6e",
    accent: "#0ea5e9",
    label: "Prescription Only",
  },
  RESTRICTED: {
    bg: "#fef3c7",
    text: "#92400e",
    accent: "#f59e0b",
    label: "Restricted",
  },
  BANNED: {
    bg: "#ffe4e6",
    text: "#9f1239",
    accent: "#f43f5e",
    label: "Banned",
  },
};

function getKeyDetail(data: ComplianceResult): string {
  const primary = data.compounds[0];
  if (data.overallStatus === "BANNED") {
    return "Prohibited regardless of prescription";
  }
  if (primary?.permitLeadTimeDays) {
    return `Permit required — ${primary.permitLeadTimeDays} days lead time`;
  }
  if (primary?.documentation) {
    return primary.documentation;
  }
  if (data.overallStatus === "PRESCRIPTION_ONLY") {
    return "Valid prescription required at entry";
  }
  return "No restrictions found";
}

export function buildAltText(data: ComplianceResult): string {
  const primary = data.compounds[0];
  const verified = primary?.lastVerifiedAt
    ? `, verified ${new Date(primary.lastVerifiedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
    : "";
  return `${data.medication} is ${data.overallStatus} in ${data.country}. Source: ${primary?.sourceDocument ?? "Check Orbit"}${verified}.`;
}

type RiskCardOptions = {
  data: ComplianceResult;
  flagEmoji: string;
  format: "landscape" | "square";
};

export function renderRiskCard({
  data,
  flagEmoji,
  format,
}: RiskCardOptions): ReactElement {
  const status = STATUS_COLORS[data.overallStatus] ?? STATUS_COLORS.LEGAL;
  const detail = getKeyDetail(data);
  const isSquare = format === "square";

  const padding = isSquare ? 64 : 60;
  const medFontSize = isSquare ? 56 : 64;
  const countryFontSize = isSquare ? 32 : 36;
  const badgeFontSize = isSquare ? 28 : 32;
  const detailFontSize = isSquare ? 22 : 24;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        padding,
      }}
    >
      {/* Top: accent bar + status badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 48,
            height: 6,
            backgroundColor: status.accent,
            borderRadius: 3,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: status.bg,
            color: status.text,
            padding: "10px 24px",
            borderRadius: 12,
            fontSize: badgeFontSize,
            fontWeight: 700,
          }}
        >
          {status.label}
        </div>
      </div>

      {/* Center: medication + flag + country */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: medFontSize,
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.1,
          }}
        >
          {data.medication}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: countryFontSize,
            color: "#64748b",
          }}
        >
          <span>{flagEmoji}</span>
          <span>in {data.country}</span>
        </div>
        <div
          style={{
            fontSize: detailFontSize,
            color: status.text,
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          {detail}
        </div>
      </div>

      {/* Bottom: branding + CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          Check Orbit
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          checkorbit.com
        </div>
      </div>
    </div>
  );
}

export function renderFallback(): ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#f8fafc",
        fontSize: 48,
        fontWeight: 700,
        color: "#1e293b",
      }}
    >
      Check Orbit
    </div>
  );
}

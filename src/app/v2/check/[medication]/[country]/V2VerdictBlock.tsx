import { Check, CircleSlash, AlertTriangle, Calendar } from "lucide-react";
import { ComplianceStatus } from "@/types/compliance";
import type { ComplianceResult } from "@/types/compliance";
import VerdictBanner from "@/components/v2/ds/VerdictBanner";
import type { Status } from "@/components/v2/ds/StatusBadge";

const VERDICT_CONFIG: Record<
  ComplianceStatus,
  {
    status: Status;
    icon: typeof Check;
    label: string;
    suffix: string;
  }
> = {
  [ComplianceStatus.LEGAL]: {
    status: "legal",
    icon: Check,
    label: "Legal",
    suffix: "Pack as you normally would.",
  },
  [ComplianceStatus.PRESCRIPTION_ONLY]: {
    status: "rx",
    icon: Calendar,
    label: "Prescription-only",
    suffix: "",
  },
  [ComplianceStatus.RESTRICTED]: {
    status: "restricted",
    icon: AlertTriangle,
    label: "Restricted",
    suffix: "— permit required.",
  },
  [ComplianceStatus.BANNED]: {
    status: "banned",
    icon: CircleSlash,
    label: "Banned",
    suffix: "— do not carry.",
  },
};

export function V2VerdictBlock({ result }: { result: ComplianceResult }) {
  const config = VERDICT_CONFIG[result.overallStatus];
  const Icon = config.icon;
  const primary = result.compounds[0];

  let subtext = "";
  if (primary?.documentation) {
    subtext = primary.documentation;
  } else if (primary?.permitRequirement) {
    subtext = primary.permitRequirement;
  }

  const title = config.suffix
    ? `${config.label} ${config.suffix}`
    : config.label;

  return (
    <div className="bg-paper border border-rule rounded-[18px] p-6 shadow-card">
      <VerdictBanner
        status={config.status}
        title={title}
        icon={<Icon size={22} />}
      >
        {subtext || null}
      </VerdictBanner>

      {/* Quick meta row */}
      <div className="mt-4 flex flex-wrap items-center gap-4 font-display font-semibold text-[12px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="8" width="18" height="8" rx="4" />
            <path d="M12 8v8" />
          </svg>
          {result.compounds.length} compound
          {result.compounds.length !== 1 ? "s" : ""} checked
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Source-verified result
        </span>
      </div>
    </div>
  );
}

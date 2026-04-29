import type { ComplianceResult } from "@/types/compliance";
import { ComplianceStatus } from "@/types/compliance";

type Props = {
  result: ComplianceResult;
};

const STATUS_STYLE: Record<ComplianceStatus, { bg: string; text: string; label: string }> = {
  [ComplianceStatus.LEGAL]: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Legal" },
  [ComplianceStatus.PRESCRIPTION_ONLY]: { bg: "bg-sky-100", text: "text-sky-800", label: "Prescription Only" },
  [ComplianceStatus.RESTRICTED]: { bg: "bg-amber-100", text: "text-amber-800", label: "Restricted" },
  [ComplianceStatus.BANNED]: { bg: "bg-rose-100", text: "text-rose-800", label: "Banned" },
};

function getKeyDetail(result: ComplianceResult): string {
  const primary = result.compounds[0];
  if (result.overallStatus === ComplianceStatus.BANNED) {
    return "Prohibited regardless of prescription";
  }
  if (primary?.permitLeadTimeDays) {
    return `Permit required — ${primary.permitLeadTimeDays} days lead time`;
  }
  if (primary?.documentation) {
    return primary.documentation;
  }
  if (result.overallStatus === ComplianceStatus.PRESCRIPTION_ONLY) {
    return "Valid prescription required at entry";
  }
  return "No restrictions found";
}

export function RiskCard({ result }: Props) {
  const status = STATUS_STYLE[result.overallStatus];
  const detail = getKeyDetail(result);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4 aspect-[1200/630]">
      <div className="flex items-center justify-between">
        <div className="h-1.5 w-10 rounded-full bg-slate-300" />
        <span
          className={`inline-block rounded-md px-3 py-1 text-xs font-bold ${status.bg} ${status.text}`}
        >
          {status.label}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-lg font-extrabold text-slate-900 leading-tight">
          {result.medication}
        </p>
        <p className="text-sm text-slate-500">in {result.country}</p>
      </div>

      <p className={`text-xs font-semibold ${status.text}`}>{detail}</p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-slate-700">Check Orbit</span>
        <span className="rounded-md bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white">
          checkorbit.com
        </span>
      </div>
    </div>
  );
}

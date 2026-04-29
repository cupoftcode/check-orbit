import type { FreshnessStatus } from "@/types/compliance";
import { Clock, AlertCircle } from "lucide-react";

type Props = {
  status: FreshnessStatus;
};

const FRESHNESS_CONFIG: Record<
  FreshnessStatus,
  { label: string; className: string }
> = {
  current: { label: "Current", className: "text-emerald-600" },
  aging: { label: "Aging", className: "text-amber-600" },
  stale: { label: "Stale", className: "text-rose-600" },
};

export function DataFreshnessIndicator({ status }: Props) {
  const config = FRESHNESS_CONFIG[status];
  const Icon = status === "stale" ? AlertCircle : Clock;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${config.className}`}
    >
      <Icon size={12} aria-hidden="true" />
      <span>Data: {config.label}</span>
    </span>
  );
}

import { ComplianceStatus } from "@/types/compliance";
import { Check, FileText, AlertTriangle, Ban } from "lucide-react";

type Variant = "default" | "compact" | "large";

type Props = {
  status: ComplianceStatus;
  variant?: Variant;
};

const STATUS_CONFIG: Record<
  ComplianceStatus,
  {
    label: string;
    bg: string;
    border: string;
    text: string;
    icon: typeof Check;
  }
> = {
  [ComplianceStatus.LEGAL]: {
    label: "Legal",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    icon: Check,
  },
  [ComplianceStatus.PRESCRIPTION_ONLY]: {
    label: "Prescription Only",
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    icon: FileText,
  },
  [ComplianceStatus.RESTRICTED]: {
    label: "Restricted",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    icon: AlertTriangle,
  },
  [ComplianceStatus.BANNED]: {
    label: "Banned",
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    icon: Ban,
  },
};

const VARIANT_CLASSES: Record<Variant, { wrapper: string; icon: number; text: string }> = {
  compact: { wrapper: "px-2 py-0.5 text-xs gap-1", icon: 12, text: "text-xs" },
  default: { wrapper: "px-3 py-1.5 text-sm gap-1.5", icon: 14, text: "text-sm" },
  large: { wrapper: "px-4 py-2 text-base gap-2", icon: 18, text: "text-base" },
};

export function ComplianceStatusBadge({ status, variant = "default" }: Props) {
  const config = STATUS_CONFIG[status];
  const variantStyle = VARIANT_CLASSES[variant];
  const Icon = config.icon;

  return (
    <span
      role="status"
      aria-label={`Compliance status: ${config.label}`}
      className={`inline-flex items-center rounded-full border font-bold ${config.bg} ${config.border} ${config.text} ${variantStyle.wrapper}`}
    >
      <Icon size={variantStyle.icon} aria-hidden="true" />
      <span className={variantStyle.text}>{config.label}</span>
    </span>
  );
}

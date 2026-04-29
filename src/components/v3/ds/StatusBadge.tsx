export type Status = "legal" | "rx" | "restricted" | "banned";

const STATUS_STYLES: Record<Status, { bg: string; fg: string; label: string }> = {
  legal: {
    bg: "bg-[var(--color-status-legal-bg)]",
    fg: "text-[var(--color-status-legal-ink)]",
    label: "Legal",
  },
  rx: {
    bg: "bg-[var(--color-status-rx-bg)]",
    fg: "text-[var(--color-status-rx-ink)]",
    label: "Prescription-only",
  },
  restricted: {
    bg: "bg-[var(--color-status-rest-bg)]",
    fg: "text-[var(--color-status-rest-ink)]",
    label: "Restricted",
  },
  banned: {
    bg: "bg-[var(--color-status-banned-bg)]",
    fg: "text-[var(--color-status-banned-ink)]",
    label: "Banned",
  },
};

type Props = {
  status: Status;
  label?: string;
  className?: string;
};

export default function StatusBadge({ status, label, className = "" }: Props) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-[5px] font-display font-extrabold text-[11px] tracking-[0.04em] uppercase ${s.bg} ${s.fg} ${className}`}
    >
      <span
        className="h-[7px] w-[7px] rounded-full bg-current"
        aria-hidden="true"
      />
      {label ?? s.label}
    </span>
  );
}

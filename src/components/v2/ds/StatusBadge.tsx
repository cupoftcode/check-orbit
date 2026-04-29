export type Status = "legal" | "rx" | "restricted" | "banned";

const LABELS: Record<Status, string> = {
  legal:      "Legal",
  rx:         "Prescription-only",
  restricted: "Restricted",
  banned:     "Banned",
};

const TONE: Record<Status, string> = {
  legal:      "bg-status-legal-bg  text-status-legal-ink",
  rx:         "bg-status-rx-bg     text-status-rx-ink",
  restricted: "bg-status-rest-bg   text-status-rest-ink",
  banned:     "bg-status-banned-bg text-status-banned-ink",
};

export default function StatusBadge({ status, label }: { status: Status; label?: string }) {
  return (
    <span
      role="status"
      aria-label={`Compliance status: ${label ?? LABELS[status]}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-display font-extrabold text-[11px] tracking-[0.04em] uppercase ${TONE[status]}`}
    >
      <span className="w-[7px] h-[7px] rounded-full bg-current" aria-hidden />
      {label ?? LABELS[status]}
    </span>
  );
}

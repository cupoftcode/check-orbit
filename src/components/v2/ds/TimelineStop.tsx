import type { ReactNode } from "react";

export type StopKind = "ok" | "warn" | "danger";

export default function TimelineStop({
  kind,
  type,
  city,
  time,
  children,
}: {
  kind: StopKind;
  type: string;
  city: string;
  time: string;
  children?: ReactNode;
}) {
  const dotClass = {
    ok:     "bg-status-legal-fg  border-status-legal-bg",
    warn:   "bg-status-rest-fg   border-status-rest-bg",
    danger: "bg-status-banned-fg border-status-banned-bg",
  }[kind];

  return (
    <li className="relative bg-paper rounded-[18px] border border-rule px-[26px] py-[22px] mb-4">
      <span
        className={`absolute -left-[34px] top-7 w-4 h-4 rounded-full border-[3px] ${dotClass}`}
        aria-hidden
      />
      <header className="flex justify-between items-start gap-5 mb-2.5">
        <div>
          <div className="font-display font-bold text-[10px] tracking-[0.08em] uppercase text-ink-3">
            {type}
          </div>
          <div className="font-display font-black text-[24px] tracking-tight">{city}</div>
        </div>
        <div className="font-mono text-[13px] text-ink-3">{time}</div>
      </header>
      {children}
    </li>
  );
}

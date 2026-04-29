import type { ReactNode } from "react";
import type { Status } from "./StatusBadge";

const TONE: Record<Status, { wrap: string; ink: string; ico: string }> = {
  legal:      { wrap: "bg-status-legal-bg",  ink: "text-status-legal-ink",  ico: "bg-white/60" },
  rx:         { wrap: "bg-status-rx-bg",     ink: "text-status-rx-ink",     ico: "bg-white/60" },
  restricted: { wrap: "bg-status-rest-bg",   ink: "text-status-rest-ink",   ico: "bg-white/60" },
  banned:     { wrap: "bg-status-banned-bg", ink: "text-status-banned-ink", ico: "bg-white/60" },
};

export default function VerdictBanner({
  status,
  title,
  children,
  icon,
}: {
  status: Status;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  const t = TONE[status];
  return (
    <div className={`flex items-center gap-4 p-5 rounded-2xl ${t.wrap}`}>
      <div className={`w-11 h-11 flex-none rounded-xl grid place-items-center ${t.ico} ${t.ink}`}>
        {icon}
      </div>
      <div>
        <div className={`font-display font-extrabold text-[22px] tracking-tight ${t.ink}`}>{title}</div>
        <div className="text-[14px] text-ink-2">{children}</div>
      </div>
    </div>
  );
}

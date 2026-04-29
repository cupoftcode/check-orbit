type FreshnessEntry = {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  daysSinceVerification: number | null;
  freshnessStatus: "current" | "aging" | "stale";
};

type Props = {
  data: FreshnessEntry[];
};

const FRESHNESS_CONFIG = {
  current: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Current",
    description: "< 90 days",
  },
  aging: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Aging",
    description: "91–180 days",
  },
  stale: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    dot: "bg-rose-500",
    label: "Stale — re-verification needed",
    description: "> 180 days",
  },
};

export function FreshnessDashboard({ data }: Props) {
  const counts = {
    current: data.filter((d) => d.freshnessStatus === "current").length,
    aging: data.filter((d) => d.freshnessStatus === "aging").length,
    stale: data.filter((d) => d.freshnessStatus === "stale").length,
  };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {(["current", "aging", "stale"] as const).map((status) => {
          const config = FRESHNESS_CONFIG[status];
          return (
            <div
              key={status}
              className={`rounded-lg border p-3 ${config.bg} ${config.border}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`size-2.5 rounded-full ${config.dot}`}
                  aria-hidden="true"
                />
                <span className={`text-sm font-semibold ${config.text}`}>
                  {config.label}
                </span>
              </div>
              <p className={`mt-1 text-2xl font-bold ${config.text}`}>
                {counts[status]}
              </p>
              <p className="text-xs text-muted-foreground">
                {config.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stale countries list */}
      {counts.stale > 0 && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-medium text-rose-800 mb-2">
            Countries needing re-verification:
          </p>
          <ul className="space-y-1">
            {data
              .filter((d) => d.freshnessStatus === "stale")
              .map((d) => (
                <li
                  key={d.countryCode}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true">{d.flagEmoji}</span>
                    {d.countryName}
                  </span>
                  <span className="text-xs text-rose-600">
                    {d.daysSinceVerification !== null
                      ? `${d.daysSinceVerification} days ago`
                      : "Never verified"}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

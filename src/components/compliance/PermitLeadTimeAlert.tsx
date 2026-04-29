import { Clock, ExternalLink } from "lucide-react";

type Props = {
  permitLeadTimeDays: number;
  permitAuthority: string | null;
  permitApplicationUrl: string | null;
  departureDate: string | null; // ISO 8601 YYYY-MM-DD or null
};

function calculateDaysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString + "T00:00:00");
  const diffMs = target.getTime() - today.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function calculateApplyByDate(leadTimeDays: number): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(today);
  deadline.setDate(deadline.getDate() + leadTimeDays);
  return deadline.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function PermitLeadTimeAlert({
  permitLeadTimeDays,
  permitAuthority,
  permitApplicationUrl,
  departureDate,
}: Props) {
  if (permitLeadTimeDays <= 0) return null;

  // No departure date provided
  if (!departureDate) {
    return (
      <div
        role="note"
        className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/50 p-3"
      >
        <Clock
          size={16}
          className="text-amber-600 mt-0.5 shrink-0"
          aria-hidden="true"
        />
        <p className="text-sm text-amber-800">
          Minimum {permitLeadTimeDays} days lead time required. Add your
          departure date for a deadline calculation.
        </p>
      </div>
    );
  }

  const daysUntilDeparture = calculateDaysUntil(departureDate);
  const isTooLate = daysUntilDeparture < permitLeadTimeDays;

  // Too late — urgent banner
  if (isTooLate) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex items-start gap-2 rounded-md border border-rose-300 bg-rose-50 p-3"
      >
        <Clock
          size={16}
          className="text-rose-600 mt-0.5 shrink-0"
          aria-hidden="true"
        />
        <p className="text-sm text-rose-800">
          You&apos;re already too late — minimum {permitLeadTimeDays} days
          required. Your departure is in{" "}
          {daysUntilDeparture <= 0
            ? "the past"
            : `${daysUntilDeparture} day${daysUntilDeparture === 1 ? "" : "s"}`}
          .
        </p>
      </div>
    );
  }

  // Enough time — inline informational
  const applyByDate = calculateApplyByDate(permitLeadTimeDays);

  return (
    <div
      role="note"
      className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/50 p-3"
    >
      <Clock
        size={16}
        className="text-amber-600 mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <div className="text-sm text-amber-800">
        <p>
          Apply by {applyByDate} — minimum {permitLeadTimeDays} days required.
          {permitAuthority && <> Authority: {permitAuthority}.</>}
        </p>
        {permitApplicationUrl && (
          <a
            href={permitApplicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-1 text-amber-700 underline hover:text-amber-900"
          >
            Apply for permit
            <ExternalLink size={12} aria-hidden="true" />
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import type { ComplianceResult } from "@/types/compliance";
import { ComplianceStatus } from "@/types/compliance";
import StatusBadge, { type Status } from "./ds/StatusBadge";

const STATUS_TO_LANE: Record<ComplianceStatus, Status> = {
  [ComplianceStatus.LEGAL]: "legal",
  [ComplianceStatus.PRESCRIPTION_ONLY]: "rx",
  [ComplianceStatus.RESTRICTED]: "restricted",
  [ComplianceStatus.BANNED]: "banned",
};

const VERDICT_STYLE: Record<
  ComplianceStatus,
  { bg: string; ink: string; label: string; icon: string }
> = {
  [ComplianceStatus.LEGAL]: {
    bg: "bg-[var(--color-status-legal-bg)]",
    ink: "text-[var(--color-status-legal-ink)]",
    label: "Legal — travel with this as-is.",
    icon: "M20 6L9 17l-5-5",
  },
  [ComplianceStatus.PRESCRIPTION_ONLY]: {
    bg: "bg-[var(--color-status-rx-bg)]",
    ink: "text-[var(--color-status-rx-ink)]",
    label: "Prescription required at the border.",
    icon: "M12 8v4l3 2M12 3a9 9 0 109 9",
  },
  [ComplianceStatus.RESTRICTED]: {
    bg: "bg-[var(--color-status-rest-bg)]",
    ink: "text-[var(--color-status-rest-ink)]",
    label: "Restricted — permit or paperwork required.",
    icon: "M12 9v4m0 4h.01M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.7 3.86a2 2 0 00-3.4 0z",
  },
  [ComplianceStatus.BANNED]: {
    bg: "bg-[var(--color-status-banned-bg)]",
    ink: "text-[var(--color-status-banned-ink)]",
    label: "Banned — do not carry.",
    icon: "M5 5l14 14",
  },
};

const PENALTY_BY_STATUS: Record<ComplianceStatus, string> = {
  [ComplianceStatus.LEGAL]: "None",
  [ComplianceStatus.PRESCRIPTION_ONLY]: "Confiscation",
  [ComplianceStatus.RESTRICTED]: "Fine + confiscation",
  [ComplianceStatus.BANNED]: "Criminal",
};

const PENALTY_HINT_BY_STATUS: Record<ComplianceStatus, string> = {
  [ComplianceStatus.LEGAL]: "No penalty for personal-use quantities.",
  [ComplianceStatus.PRESCRIPTION_ONLY]: "Items confiscated at border without proof of prescription.",
  [ComplianceStatus.RESTRICTED]: "Civil penalty and seizure without the correct permit.",
  [ComplianceStatus.BANNED]: "Detention + prosecution. First-time tourist cases still prosecuted.",
};

function formatVerifiedDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

type Props = {
  result: ComplianceResult;
  medicationSlug: string;
};

export function V3ResultCard({ result, medicationSlug }: Props) {
  const verdict = VERDICT_STYLE[result.overallStatus];
  const primary = result.compounds[0];

  const verifiedDate = primary?.lastVerifiedAt
    ? formatVerifiedDate(primary.lastVerifiedAt)
    : null;

  const dailyCapValue =
    primary?.quantityLimit ??
    (result.overallStatus === ComplianceStatus.BANNED ? "0" : "—");
  const permitValue =
    primary?.permitRequirement ??
    (result.overallStatus === ComplianceStatus.BANNED
      ? "None available"
      : result.overallStatus === ComplianceStatus.LEGAL
      ? "Not required"
      : "See notes");
  const leadTimeValue =
    primary?.permitLeadTimeDays != null
      ? String(primary.permitLeadTimeDays)
      : "N/A";
  const penaltyValue = PENALTY_BY_STATUS[result.overallStatus];
  const penaltyHint = PENALTY_HINT_BY_STATUS[result.overallStatus];

  return (
    <div className="mx-auto max-w-[1280px] px-6 pb-20 pt-10 md:px-14">
      {/* Breadcrumbs */}
      <div className="mb-[18px] flex flex-wrap items-center gap-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.02em] text-ink-3">
        <Link href="/v3" className="text-ink-3 no-underline hover:text-brand">
          Search
        </Link>
        <span className="opacity-50">/</span>
        <span className="text-ink">{result.country}</span>
        <span className="opacity-50">/</span>
        <span className="text-ink">{result.medication}</span>
      </div>

      {/* Main card */}
      <div className="rounded-[24px] border border-rule bg-paper p-9 shadow-card">
        <div className="mb-[30px] flex flex-wrap items-start justify-between gap-[30px]">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.04em] text-ink-3">
              <span className="font-mono text-ink">
                {result.countryCode}
              </span>
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 12h18M14 6l6 6-6 6" />
              </svg>
              <span>{primary?.permitAuthority ?? "Government-sourced"}</span>
              {verifiedDate && (
                <span className="normal-case tracking-normal text-ink-3">
                  · Verified {verifiedDate}
                </span>
              )}
            </div>
            <h1
              className="m-0 mb-3.5 font-display font-black text-ink"
              style={{
                fontSize: "clamp(36px, 4.5vw, 52px)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {result.medication}
              <span className="mx-[10px] font-semibold text-ink-4">/</span>
              {result.country}
            </h1>
            <div className="flex flex-wrap gap-5 text-[13px] text-ink-3">
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="3" y="8" width="18" height="8" rx="4" />
                  <path d="M12 8v8" />
                </svg>
                {result.compounds.length}{" "}
                {result.compounds.length === 1 ? "compound" : "compounds"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                Answered in &lt; 20s
              </span>
              {verifiedDate && (
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Verified {verifiedDate}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-ink bg-transparent px-3.5 py-2 font-display text-[12px] font-bold text-ink hover:bg-ink hover:text-white"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13" />
            </svg>
            Share
          </button>
        </div>

        {/* Verdict block */}
        <div
          className={`mb-7 flex items-center gap-4 rounded-[16px] px-[22px] py-[18px] ${verdict.bg}`}
        >
          <div className="grid h-11 w-11 flex-none place-items-center rounded-[12px] bg-white/60">
            <svg
              className={`h-[22px] w-[22px] ${verdict.ink}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d={verdict.icon} />
            </svg>
          </div>
          <div className="min-w-0">
            <div
              className={`font-display text-[22px] font-extrabold leading-tight ${verdict.ink}`}
              style={{ letterSpacing: "-0.02em" }}
            >
              {verdict.label}
            </div>
            <div className="mt-1 text-[14px] text-ink-2">
              {primary?.documentation ||
                primary?.quantityLimit ||
                result.disclaimer}
            </div>
          </div>
        </div>

        {/* Grid: main + sidebar */}
        <div className="grid gap-[30px] md:grid-cols-[1.6fr_1fr]">
          <div className="space-y-[22px]">
            <Panel title="Compound breakdown" count={result.compounds.length}>
              {result.compounds.map((c, i) => (
                <div
                  key={c.compoundName}
                  className={`grid grid-cols-[1fr_auto] items-center gap-5 py-4 ${
                    i === 0 ? "pt-0" : "border-t border-rule"
                  }`}
                >
                  <div className="min-w-0">
                    <div
                      className="font-display text-[17px] font-extrabold"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {c.compoundName}
                    </div>
                    {c.dosageThreshold && (
                      <div className="mt-0.5 text-[13px] text-ink-3">
                        {c.dosageThreshold}
                      </div>
                    )}
                    {c.permitAuthority && (
                      <div className="mt-1.5 inline-flex gap-1.5 font-mono text-[11px] text-ink-3">
                        <b className="font-semibold text-ink">
                          {result.countryCode}
                        </b>
                        {c.permitAuthority}
                      </div>
                    )}
                  </div>
                  <StatusBadge status={STATUS_TO_LANE[c.status]} />
                </div>
              ))}
            </Panel>

            <Panel title="Quantity & permit thresholds (for context)">
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <QStat
                  label="Daily cap"
                  value={dailyCapValue}
                  hint={
                    result.overallStatus === ComplianceStatus.BANNED
                      ? "No quantity is permitted, including a single dose."
                      : null
                  }
                />
                <QStat
                  label="Permit"
                  value={permitValue}
                  hint={primary?.permitAuthority ?? null}
                />
                <QStat
                  label="Lead time"
                  value={leadTimeValue}
                  valueSuffix={
                    primary?.permitLeadTimeDays != null ? "days" : undefined
                  }
                  hint={
                    primary?.permitApplicationUrl
                      ? "Apply in advance via permit authority."
                      : null
                  }
                />
                <QStat
                  label="Penalty"
                  value={penaltyValue}
                  hint={penaltyHint}
                />
              </div>
              {primary?.permitApplicationUrl && (
                <a
                  href={primary.permitApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-[18px] py-[11px] font-display text-[13px] font-bold text-white no-underline hover:bg-brand-deep"
                >
                  Apply for permit
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </a>
              )}
            </Panel>

            {result.hasBiosecurityWarning && (
              <Panel title="Biosecurity">
                <p className="m-0 text-[14px] text-ink-2">
                  {result.biosecurityDetails ??
                    "This medication is subject to biosecurity controls. Declare at the border and follow the authority's instructions."}
                </p>
              </Panel>
            )}

            {result.hasProprietaryBlendWarning && (
              <Panel title="Proprietary blend">
                <p className="m-0 text-[14px] text-ink-2">
                  Some ingredients in this product are undisclosed. Verify the
                  full formula with the manufacturer before travel — unknown
                  compounds can change the compliance status.
                </p>
              </Panel>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="rounded-[20px] bg-ink p-6 text-[#EFE6D8]">
              <h3 className="m-0 mb-[18px] flex items-center gap-2.5 font-display text-[13px] font-bold uppercase tracking-[0.08em] text-[#8A7E6D]">
                Government sources
                <span className="rounded-full bg-premium px-[7px] py-[2px] font-mono text-[10px] tracking-normal text-ink">
                  {result.compounds.length}
                </span>
              </h3>
              {result.compounds.map((c, i) => (
                <div
                  key={`${c.compoundName}-src`}
                  className={`py-3.5 ${
                    i === 0 ? "pt-0" : "border-t border-white/10"
                  }`}
                >
                  <div
                    className="font-display text-[14px] font-extrabold text-white"
                    style={{ letterSpacing: "-0.005em" }}
                  >
                    {c.sourceDocument || "No specific regulation found"}
                  </div>
                  {c.sourceUrl && (
                    <a
                      href={c.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 block break-all font-mono text-[11px] text-brand-light no-underline hover:underline"
                    >
                      {c.sourceUrl.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  <div className="mt-2.5 inline-flex items-center gap-2 text-[11px] text-[#B4A897]">
                    <span
                      aria-hidden="true"
                      className="h-[7px] w-[7px] rounded-full bg-[#6BAE5A] shadow-[0_0_0_4px_rgba(107,174,90,0.18)]"
                    />
                    Verified{" "}
                    {c.lastVerifiedAt
                      ? formatVerifiedDate(c.lastVerifiedAt)
                      : ""}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <p className="mt-8 border-t border-rule pt-5 text-[12px] leading-[1.55] text-ink-3">
          {result.disclaimer}{" "}
          <Link
            href={`/v3/check/${medicationSlug}/${result.countryCode.toLowerCase()}`}
            className="font-display font-bold text-brand no-underline hover:text-brand-deep"
          >
            Permalink ↗
          </Link>
        </p>
      </div>
    </div>
  );
}

function Panel({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-rule bg-paper p-[26px]">
      <h3 className="m-0 mb-[18px] flex items-center gap-2.5 font-display text-[13px] font-bold uppercase tracking-[0.08em] text-ink-3">
        {title}
        {count != null && (
          <span className="rounded-full bg-ink px-[7px] py-[2px] font-mono text-[10px] tracking-normal text-white">
            {count}
          </span>
        )}
      </h3>
      {children}
    </div>
  );
}

function QStat({
  label,
  value,
  valueSuffix,
  hint,
}: {
  label: string;
  value: string;
  valueSuffix?: string;
  hint: string | null;
}) {
  return (
    <div className="rounded-[14px] border border-rule bg-cream px-4 py-3.5">
      <div className="font-display text-[10px] font-bold uppercase tracking-[0.08em] text-ink-3">
        {label}
      </div>
      <div
        className="mt-0.5 font-display text-[20px] font-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        {value}
        {valueSuffix && (
          <small className="ml-1.5 text-[13px] font-semibold text-ink-3">
            {valueSuffix}
          </small>
        )}
      </div>
      {hint && <div className="mt-1 text-[12px] text-ink-3">{hint}</div>}
    </div>
  );
}

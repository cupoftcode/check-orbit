import { notFound, permanentRedirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ComplianceResultCard } from "@/components/compliance/ComplianceResultCard";
import { ChangeComparisonBanner } from "@/components/compliance/ChangeComparisonBanner";
import { UnableToVerify } from "@/components/errors/UnableToVerify";
import { MedicationNotFound } from "@/components/errors/MedicationNotFound";
import { V2Search } from "../../V2Search";
import { V2VerdictBlock } from "./V2VerdictBlock";
import { getComplianceResult } from "@/lib/compliance/get-compliance-result";
import { resolveCompoundToMedicationSlug } from "@/lib/compliance/canonical-resolution";
import { getSavedSearchForUser } from "@/lib/db/queries/saved-searches";
import type { ComplianceResult } from "@/types/compliance";

export const revalidate = false;

type Props = {
  params: Promise<{ medication: string; country: string }>;
  searchParams: Promise<{ departureDate?: string }>;
};

function Breadcrumbs({
  medication,
  country,
}: {
  medication: string;
  country: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 font-display font-semibold text-[13px] text-ink-3"
    >
      <Link href="/v2/check" className="text-brand no-underline">
        Search
      </Link>
      <span className="text-ink-4">/</span>
      <span>{country}</span>
      <span className="text-ink-4">/</span>
      <span className="text-ink">{medication}</span>
    </nav>
  );
}

function SourceSidebar({
  compounds,
}: {
  compounds: ComplianceResult["compounds"];
}) {
  const seen = new Set<string>();
  const sources = compounds.filter((c) => {
    if (seen.has(c.sourceDocument)) return false;
    seen.add(c.sourceDocument);
    return true;
  });

  return (
    <aside className="space-y-4">
      <div className="bg-ink rounded-[18px] p-[22px] border border-[#3A3024]">
        <h3 className="font-display font-extrabold text-[14px] text-white mb-4">
          Government sources{" "}
          <span className="font-mono font-medium text-[11px] text-[#8A7E6D] ml-1">
            {sources.length}
          </span>
        </h3>
        <div className="space-y-4">
          {sources.map((compound) => (
            <div
              key={compound.sourceDocument}
              className="pb-3.5 border-b border-[#3A3024]"
            >
              <div className="font-display font-bold text-[13px] text-[#EFE6D8] mb-1">
                {compound.sourceDocument}
              </div>
              {compound.sourceUrl && (
                <div className="font-mono text-[11px] text-[#8A7E6D] break-all mb-1.5">
                  {compound.sourceUrl.replace(/^https?:\/\//, "")}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-status-legal-fg inline-block" />
                <span className="text-[#8A7E6D]">
                  Verified &middot;{" "}
                  {new Date(compound.lastVerifiedAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer card */}
      <div className="bg-cream-2 rounded-[14px] p-4 text-[12px] text-ink-3 leading-[1.55]">
        <strong className="font-display font-bold text-ink-2">
          Disclaimer
        </strong>
        <p className="mt-1">
          This is not legal or medical advice. Always verify with destination
          country authorities before traveling.
        </p>
      </div>
    </aside>
  );
}

export default async function V2ComplianceResultPage({
  params,
  searchParams,
}: Props) {
  const { medication, country } = await params;
  const { departureDate } = await searchParams;
  const [response, { userId }] = await Promise.all([
    getComplianceResult(medication, country),
    auth(),
  ]);

  let initialSaved = false;
  let savedSearch: { id: string; snapshot: ComplianceResult } | null = null;
  if (userId && response.success) {
    const existing = await getSavedSearchForUser(userId, medication, country);
    if (existing) {
      initialSaved = true;
      savedSearch = {
        id: existing.id,
        snapshot: existing.resultSnapshot as unknown as ComplianceResult,
      };
    }
  }

  if (!response.success) {
    if (response.code === "MEDICATION_NOT_FOUND") {
      const canonicalSlug = await resolveCompoundToMedicationSlug(medication);
      if (canonicalSlug) {
        permanentRedirect(`/v2/check/${canonicalSlug}/${country.toLowerCase()}`);
      }
      return (
        <main className="mx-auto max-w-2xl px-4 py-12">
          <MedicationNotFound medicationSlug={medication} />
        </main>
      );
    }

    if (response.code === "COUNTRY_NOT_COVERED") {
      notFound();
    }

    if (response.code === "UNABLE_TO_VERIFY") {
      const medName = medication.replace(/-/g, " ");
      return (
        <main className="mx-auto max-w-2xl px-4 py-12">
          <UnableToVerify medicationName={medName} message={response.message} />
        </main>
      );
    }

    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="bg-status-rest-bg border border-rule rounded-2xl p-6 text-center">
          <h2 className="font-display font-extrabold text-[17px] text-status-rest-ink mb-2">
            Something went wrong
          </h2>
          <p className="text-[14px] text-ink-3">
            {response.message}
          </p>
        </div>
      </main>
    );
  }

  const { data } = response;
  const medName = medication.replace(/-/g, " ");

  return (
    <main className="mx-auto max-w-[1200px] space-y-6 px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <Breadcrumbs medication={medName} country={data.country} />

      {/* Compact search for re-running */}
      <div className="bg-paper border border-rule rounded-[18px] p-2.5">
        <V2Search />
      </div>

      {/* Result header */}
      <div>
        <h1 className="font-display font-black text-ink tracking-tighter leading-[1.1]" style={{ fontSize: "clamp(26px, 4vw, 36px)" }}>
          {data.medication}{" "}
          <span className="text-ink-4 font-bold">/</span>{" "}
          {data.country}
        </h1>
      </div>

      {/* Two-column result grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-6">
          <V2VerdictBlock result={data} />

          {savedSearch && (
            <ChangeComparisonBanner
              searchId={savedSearch.id}
              snapshot={savedSearch.snapshot}
              current={data}
              medicationSlug={medication}
            />
          )}

          <ComplianceResultCard
            result={data}
            departureDate={departureDate ?? null}
            medicationSlug={medication}
            initialSaved={initialSaved}
          />
        </div>

        <SourceSidebar compounds={data.compounds} />
      </div>
    </main>
  );
}

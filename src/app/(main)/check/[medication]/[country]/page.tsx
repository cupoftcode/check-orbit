import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ComplianceResultCard } from "@/components/compliance/ComplianceResultCard";
import { ChangeComparisonBanner } from "@/components/compliance/ChangeComparisonBanner";
import { UnableToVerify } from "@/components/errors/UnableToVerify";
import { MedicationNotFound } from "@/components/errors/MedicationNotFound";
import { CompactSearch } from "@/components/search/CompactSearch";
import { ComplianceJsonLd } from "@/components/compliance/ComplianceJsonLd";
import { getComplianceResult } from "@/lib/compliance/get-compliance-result";
import { resolveCompoundToMedicationSlug } from "@/lib/compliance/canonical-resolution";
import { getSavedSearchForUser } from "@/lib/db/queries/saved-searches";
import type { ComplianceResult } from "@/types/compliance";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://checkorbit.com";

/** ISR: only revalidate on-demand via /api/revalidate */
export const revalidate = false;

type Props = {
  params: Promise<{ medication: string; country: string }>;
  searchParams: Promise<{ departureDate?: string }>;
};

function buildDescription(data: ComplianceResult): string {
  const primary = data.compounds[0];
  const parts: string[] = [
    `${data.medication} is ${data.overallStatus} in ${data.country}.`,
  ];

  if (primary?.permitLeadTimeDays) {
    parts.push(`Permit required — minimum ${primary.permitLeadTimeDays} days.`);
  } else if (primary?.documentation) {
    parts.push(primary.documentation);
  }

  if (primary?.lastVerifiedAt) {
    const date = new Date(primary.lastVerifiedAt);
    const month = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    parts.push(`Verified ${month}.`);
  }

  return parts.join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { medication, country } = await params;
  const result = await getComplianceResult(medication, country);

  if (!result.success) {
    const medName = medication.replace(/-/g, " ");
    const countryCode = country.toUpperCase();
    return {
      title: `${medName} in ${countryCode} — Check Orbit`,
      description: `Medication compliance check for ${medName} in ${countryCode}.`,
    };
  }

  const { data } = result;
  const title = `${data.medication} in ${data.country} — ${data.overallStatus} | Check Orbit`;
  const description = buildDescription(data);
  const canonicalUrl = `${BASE_URL}/check/${medication}/${country.toLowerCase()}`;
  const ogImageUrl = `${BASE_URL}/check/${medication}/${country.toLowerCase()}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Check Orbit",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${data.medication} compliance status in ${data.country}: ${data.overallStatus}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ComplianceResultPage({
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
      // Check if slug matches a compound name → 301 redirect to canonical brand URL
      const canonicalSlug = await resolveCompoundToMedicationSlug(medication);
      if (canonicalSlug) {
        permanentRedirect(`/check/${canonicalSlug}/${country.toLowerCase()}`);
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
          <UnableToVerify
            medicationName={medName}
            message={response.message}
          />
        </main>
      );
    }

    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-amber-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-amber-700">{response.message}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <ComplianceJsonLd
        result={response.data}
        url={`${BASE_URL}/check/${medication}/${country.toLowerCase()}`}
      />
      <main className="mx-auto max-w-2xl px-4 py-8 md:py-12 space-y-6">
        <CompactSearch
          initialMedication={response.data.medication}
          initialMedicationSlug={medication}
          initialCountry={response.data.country}
          initialCountryCode={response.data.countryCode}
        />
        {savedSearch && (
          <ChangeComparisonBanner
            searchId={savedSearch.id}
            snapshot={savedSearch.snapshot}
            current={response.data}
            medicationSlug={medication}
          />
        )}
        <ComplianceResultCard
          result={response.data}
          departureDate={departureDate ?? null}
          medicationSlug={medication}
          initialSaved={initialSaved}
        />
      </main>
    </>
  );
}

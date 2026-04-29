import Link from "next/link";
import type { Metadata } from "next";
import { getComplianceResult } from "@/lib/compliance/get-compliance-result";
import { V3ResultCard } from "@/components/v3/V3ResultCard";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ medication: string; country: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { medication, country } = await params;
  return {
    title: `${medication.replace(/-/g, " ")} in ${country.toUpperCase()} — CheckOrbit`,
  };
}

export default async function V3ResultPage({ params }: Props) {
  const { medication, country } = await params;
  const response = await getComplianceResult(medication, country);

  if (!response.success) {
    return (
      <main>
        <div className="mx-auto max-w-[720px] px-6 py-20 text-center md:px-14">
          <div className="rounded-[24px] border border-rule bg-paper p-10 shadow-card">
            <div className="mb-3 font-display text-[12px] font-bold uppercase tracking-[0.08em] text-ink-3">
              {response.code === "MEDICATION_NOT_FOUND" && "Medication unknown"}
              {response.code === "COUNTRY_NOT_COVERED" && "Country not covered"}
              {response.code === "UNABLE_TO_VERIFY" && "Unable to verify"}
            </div>
            <h1
              className="m-0 mb-3 font-display font-black"
              style={{
                fontSize: "clamp(28px, 3.5vw, 40px)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              We couldn&apos;t finish this check.
            </h1>
            <p className="mx-auto mb-7 max-w-[520px] text-[15px] text-ink-3">
              {response.message}
            </p>
            <Link
              href="/v3"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-[22px] py-[14px] font-display text-[14px] font-extrabold text-white no-underline hover:bg-brand-deep"
            >
              Try another search
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <V3ResultCard result={response.data} medicationSlug={medication} />
    </main>
  );
}

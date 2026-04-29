"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Pill, MapPin, ArrowRight } from "lucide-react";
import { MedicationAutocomplete } from "@/components/search/MedicationAutocomplete";
import { CountrySelector } from "@/components/search/CountrySelector";
import { DepartureDateInput } from "@/components/search/DepartureDateInput";

type MedicationSelection = {
  brandName: string;
  genericName: string | null;
  slug: string;
  compoundNames: string[];
};

type CountrySelection = {
  name: string;
  code: string;
  flagEmoji: string;
  isCovered: boolean;
  popularityRank: number;
};

export function V2Search() {
  const router = useRouter();
  const [medication, setMedication] = useState<MedicationSelection | null>(
    null,
  );
  const [country, setCountry] = useState<CountrySelection | null>(null);

  const canCheck = medication && country && country.isCovered;

  function handleCheck() {
    if (!medication || !country) return;
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("departureDate");
    const url = `/v2/check/${medication.slug}/${country.code.toLowerCase()}${
      dateParam ? `?departureDate=${dateParam}` : ""
    }`;
    router.push(url);
  }

  return (
    <div className="space-y-4 text-left">
      {/* Compound search card */}
      <div className="flex flex-col items-stretch gap-2 sm:flex-row bg-paper rounded-[20px] p-2.5 shadow-lift border border-rule">
        {/* Medication field */}
        <SearchField
          icon={
            <div className="w-9 h-9 shrink-0 grid place-items-center rounded-[10px] bg-brand-soft text-brand-deep">
              <Pill size={18} />
            </div>
          }
          label="Medication"
        >
          <MedicationAutocomplete
            variant="hero"
            onSelect={setMedication}
            selectedMedication={medication}
            onClear={() => {
              setMedication(null);
              setCountry(null);
            }}
          />
        </SearchField>

        <div className="hidden sm:block w-px self-stretch bg-rule" />

        {/* Destination field */}
        <SearchField
          icon={
            <div className="w-9 h-9 shrink-0 grid place-items-center rounded-[10px] bg-trust-soft text-trust">
              <MapPin size={18} />
            </div>
          }
          label="Destination"
        >
          <CountrySelector
            onSelect={setCountry}
            selectedCountry={country}
            onClear={() => setCountry(null)}
          />
        </SearchField>

        {/* Check button */}
        <button
          onClick={handleCheck}
          disabled={!canCheck}
          className={`flex items-center justify-center gap-2 rounded-[14px] px-[22px] min-h-[48px] font-display font-extrabold text-[14px] border-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            canCheck
              ? "bg-brand text-white cursor-pointer hover:bg-brand-deep"
              : "bg-cream-2 text-ink-4 cursor-not-allowed"
          }`}
          aria-label="Check medication compliance"
        >
          Check
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Departure date (optional) */}
      {medication && country && country.isCovered && (
        <div className="bg-paper border border-rule rounded-[14px] py-3 px-4">
          <Suspense>
            <DepartureDateInput />
          </Suspense>
        </div>
      )}
    </div>
  );
}

function SearchField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center gap-3 py-3 px-4 rounded-[14px]">
      {icon}
      <div className="min-w-0 flex-1">
        <div className="font-display font-bold text-[10px] tracking-[0.08em] uppercase text-ink-3">
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { MedicationAutocomplete } from "./MedicationAutocomplete";
import { CountrySelector } from "./CountrySelector";
import { DepartureDateInput } from "./DepartureDateInput";
import { Button } from "@/components/ui/button";

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

export function HeroSearch() {
  const router = useRouter();
  const [medication, setMedication] = useState<MedicationSelection | null>(null);
  const [country, setCountry] = useState<CountrySelection | null>(null);

  const canCheck = medication && country && country.isCovered;

  function handleCheck() {
    if (!medication || !country) return;
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("departureDate");
    const url = `/check/${medication.slug}/${country.code.toLowerCase()}${
      dateParam ? `?departureDate=${dateParam}` : ""
    }`;
    router.push(url);
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <MedicationAutocomplete
        variant="hero"
        onSelect={setMedication}
        selectedMedication={medication}
        onClear={() => setMedication(null)}
      />

      {medication && (
        <CountrySelector
          onSelect={setCountry}
          selectedCountry={country}
          onClear={() => setCountry(null)}
        />
      )}

      {medication && country && country.isCovered && (
        <Suspense>
          <DepartureDateInput />
        </Suspense>
      )}

      <Button
        onClick={handleCheck}
        disabled={!canCheck}
        className="w-full md:w-auto h-12 px-8 text-base font-bold bg-brand-500 hover:bg-brand-500/90 text-white"
        aria-label="Check medication compliance"
      >
        Check
      </Button>
    </div>
  );
}

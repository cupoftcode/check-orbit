"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MedicationAutocomplete } from "./MedicationAutocomplete";
import { CountrySelector } from "./CountrySelector";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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

type Props = {
  initialMedication: string;
  initialMedicationSlug: string;
  initialCountry: string;
  initialCountryCode: string;
};

export function CompactSearch({
  initialMedication,
  initialMedicationSlug,
  initialCountry,
  initialCountryCode,
}: Props) {
  const router = useRouter();
  const [medication, setMedication] = useState<MedicationSelection | null>({
    brandName: initialMedication,
    genericName: null,
    slug: initialMedicationSlug,
    compoundNames: [],
  });
  const [country, setCountry] = useState<CountrySelection | null>({
    name: initialCountry,
    code: initialCountryCode,
    flagEmoji: "",
    isCovered: true,
    popularityRank: 0,
  });

  const canCheck = medication && country && country.isCovered;

  function handleCheck() {
    if (!medication || !country) return;
    const url = `/check/${medication.slug}/${country.code.toLowerCase()}`;
    router.push(url);
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
      <div className="flex-1 min-w-0">
        <MedicationAutocomplete
          variant="compact"
          onSelect={setMedication}
          selectedMedication={medication}
          onClear={() => setMedication(null)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <CountrySelector
          onSelect={setCountry}
          selectedCountry={country}
          onClear={() => setCountry(null)}
        />
      </div>
      <Button
        onClick={handleCheck}
        disabled={!canCheck}
        className="h-10 px-4 bg-brand-500 hover:bg-brand-500/90 text-white shrink-0"
        aria-label="Check medication compliance"
      >
        <Search size={16} className="mr-1.5" aria-hidden="true" />
        Check
      </Button>
    </div>
  );
}

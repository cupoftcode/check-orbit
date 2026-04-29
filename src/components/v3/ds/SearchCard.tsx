"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import * as Sentry from "@sentry/nextjs";

type MedicationSuggestion = {
  brandName: string;
  genericName: string | null;
  slug: string;
  compoundNames: string[];
};

type CountrySuggestion = {
  name: string;
  code: string;
  flagEmoji: string;
  isCovered: boolean;
  popularityRank: number;
};

export default function SearchCard() {
  const router = useRouter();

  const [medQuery, setMedQuery] = useState("");
  const [medSuggestions, setMedSuggestions] = useState<MedicationSuggestion[]>(
    []
  );
  const [selectedMed, setSelectedMed] = useState<MedicationSuggestion | null>(
    null
  );
  const [medOpen, setMedOpen] = useState(false);
  const [medLoading, setMedLoading] = useState(false);

  const [destQuery, setDestQuery] = useState("");
  const [destSuggestions, setDestSuggestions] = useState<CountrySuggestion[]>(
    []
  );
  const [selectedDest, setSelectedDest] = useState<CountrySuggestion | null>(
    null
  );
  const [destOpen, setDestOpen] = useState(false);
  const [destLoading, setDestLoading] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const medDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  const destDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  const medAbort = useRef<AbortController>(undefined);
  const destAbort = useRef<AbortController>(undefined);

  const fetchMeds = useCallback(async (q: string) => {
    medAbort.current?.abort();
    const controller = new AbortController();
    medAbort.current = controller;
    setMedLoading(true);
    try {
      const res = await fetch(
        `/api/search/medications?q=${encodeURIComponent(q)}`,
        { signal: controller.signal }
      );
      if (!res.ok) {
        setMedSuggestions([]);
        return;
      }
      const json = await res.json();
      setMedSuggestions(json.data.medications ?? []);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      Sentry.captureException(err);
      setMedSuggestions([]);
    } finally {
      setMedLoading(false);
    }
  }, []);

  const fetchCountries = useCallback(async (q: string) => {
    destAbort.current?.abort();
    const controller = new AbortController();
    destAbort.current = controller;
    setDestLoading(true);
    try {
      const url = q
        ? `/api/search/countries?q=${encodeURIComponent(q)}`
        : `/api/search/countries`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        setDestSuggestions([]);
        return;
      }
      const json = await res.json();
      setDestSuggestions(json.data.countries ?? []);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      Sentry.captureException(err);
      setDestSuggestions([]);
    } finally {
      setDestLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedMed && medQuery === selectedMed.brandName) return;
    if (medQuery.length === 0) {
      setMedSuggestions([]);
      return;
    }
    clearTimeout(medDebounce.current);
    medDebounce.current = setTimeout(() => fetchMeds(medQuery), 150);
    return () => clearTimeout(medDebounce.current);
  }, [medQuery, fetchMeds, selectedMed]);

  useEffect(() => {
    if (selectedDest && destQuery === selectedDest.name) return;
    clearTimeout(destDebounce.current);
    destDebounce.current = setTimeout(() => fetchCountries(destQuery), 150);
    return () => clearTimeout(destDebounce.current);
  }, [destQuery, fetchCountries, selectedDest]);

  function handleMedSelect(med: MedicationSuggestion) {
    setSelectedMed(med);
    setMedQuery(med.brandName);
    setMedOpen(false);
  }

  function handleDestSelect(country: CountrySuggestion) {
    setSelectedDest(country);
    setDestQuery(country.name);
    setDestOpen(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedMed) {
      setSubmitError("Select a medication from the suggestions.");
      return;
    }
    if (!selectedDest) {
      setSubmitError("Select a destination country from the suggestions.");
      return;
    }
    if (!selectedDest.isCovered) {
      setSubmitError(
        `${selectedDest.name} is not yet covered. Try a covered country.`
      );
      return;
    }
    router.push(
      `/v3/check/${selectedMed.slug}/${selectedDest.code.toLowerCase()}`
    );
  }

  return (
    <div className="mx-auto max-w-[720px]">
      <form
        className="flex items-stretch gap-2 rounded-[20px] border border-rule bg-paper p-2.5 text-left shadow-lift"
        onSubmit={handleSubmit}
        role="search"
      >
        {/* Medication field */}
        <div className="relative flex flex-1 items-center gap-3 rounded-[14px] px-4 py-3 hover:bg-cream focus-within:bg-cream">
          <div className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-brand-soft text-brand-deep">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="8" width="18" height="8" rx="4" />
              <path d="M12 8v8" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <label
              htmlFor="v3-med"
              className="block font-display text-[10px] font-bold uppercase tracking-[0.08em] text-ink-3"
            >
              Medication
            </label>
            <input
              id="v3-med"
              type="text"
              placeholder="e.g. Adderall 20mg"
              autoComplete="off"
              value={medQuery}
              onChange={(e) => {
                setMedQuery(e.target.value);
                setSelectedMed(null);
                setMedOpen(true);
              }}
              onFocus={() => {
                if (medQuery.length > 0) setMedOpen(true);
              }}
              onBlur={() => {
                setTimeout(() => setMedOpen(false), 200);
              }}
              role="combobox"
              aria-expanded={medOpen}
              aria-controls="v3-med-suggest"
              aria-autocomplete="list"
              className="w-full border-0 bg-transparent pt-0.5 font-display text-[16px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-ink-4"
            />
          </div>

          {medOpen && (medSuggestions.length > 0 || medLoading) && (
            <SuggestList id="v3-med-suggest">
              {medLoading && medSuggestions.length === 0 && (
                <SuggestLoading label="Searching medications…" />
              )}
              {medSuggestions.map((med) => (
                <button
                  key={med.slug}
                  type="button"
                  role="option"
                  aria-selected={selectedMed?.slug === med.slug}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleMedSelect(med)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-cream"
                >
                  <div className="min-w-0">
                    <div className="font-display text-[14px] font-bold text-ink">
                      {med.brandName}
                    </div>
                    <div className="truncate text-[12px] text-ink-3">
                      {med.genericName ?? med.compoundNames.join(" · ")}
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-ink-3">
                    {med.genericName ? "generic" : "branded"}
                  </span>
                </button>
              ))}
            </SuggestList>
          )}
        </div>

        {/* Destination field */}
        <div className="relative flex flex-1 items-center gap-3 rounded-[14px] border-l border-rule px-4 py-3 hover:bg-cream focus-within:bg-cream">
          <div className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-trust-soft text-trust">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <label
              htmlFor="v3-dest"
              className="block font-display text-[10px] font-bold uppercase tracking-[0.08em] text-ink-3"
            >
              Destination
            </label>
            <input
              id="v3-dest"
              type="text"
              placeholder="Country or airport code"
              autoComplete="off"
              value={destQuery}
              onChange={(e) => {
                setDestQuery(e.target.value);
                setSelectedDest(null);
                setDestOpen(true);
              }}
              onFocus={() => {
                setDestOpen(true);
                if (destSuggestions.length === 0) fetchCountries(destQuery);
              }}
              onBlur={() => {
                setTimeout(() => setDestOpen(false), 200);
              }}
              role="combobox"
              aria-expanded={destOpen}
              aria-controls="v3-dest-suggest"
              aria-autocomplete="list"
              className="w-full border-0 bg-transparent pt-0.5 font-display text-[16px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-ink-4"
            />
          </div>

          {destOpen && (destSuggestions.length > 0 || destLoading) && (
            <SuggestList id="v3-dest-suggest">
              {destLoading && destSuggestions.length === 0 && (
                <SuggestLoading label="Searching countries…" />
              )}
              {destSuggestions.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  role="option"
                  aria-selected={selectedDest?.code === country.code}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleDestSelect(country)}
                  disabled={!country.isCovered}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-cream disabled:cursor-not-allowed ${
                    country.isCovered ? "" : "opacity-55"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span aria-hidden="true" className="text-[18px] leading-none">
                      {country.flagEmoji}
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-[14px] font-bold text-ink">
                        {country.name}
                      </div>
                      {!country.isCovered && (
                        <div className="text-[11px] text-ink-3">
                          Not yet covered
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-ink-3">
                    {country.code}
                  </span>
                </button>
              ))}
            </SuggestList>
          )}
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-[14px] border-0 bg-brand px-[22px] font-display text-[14px] font-extrabold text-white hover:bg-brand-deep"
        >
          Check
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
        </button>
      </form>

      {submitError && (
        <p
          role="alert"
          className="mt-3 text-center text-[13px] font-semibold text-[var(--color-status-banned-ink)]"
        >
          {submitError}
        </p>
      )}
    </div>
  );
}

function SuggestList({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      role="listbox"
      className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[340px] overflow-y-auto rounded-[16px] border border-rule bg-paper py-1.5 shadow-lift"
    >
      {children}
    </div>
  );
}

function SuggestLoading({ label }: { label: string }) {
  return (
    <div className="px-4 py-3 text-[13px] text-ink-3" role="status">
      {label}
    </div>
  );
}

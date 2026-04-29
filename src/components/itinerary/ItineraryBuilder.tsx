"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  Loader2,
  Route,
  Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountrySelector } from "@/components/search/CountrySelector";
import { MedicationAutocomplete } from "@/components/search/MedicationAutocomplete";
import { ItineraryTimeline } from "./ItineraryTimeline";
import { toast } from "sonner";
import type {
  ItineraryCheckResult,
  StopType,
} from "@/lib/compliance/itinerary-check";

type CountrySuggestion = {
  name: string;
  code: string;
  flagEmoji: string;
  isCovered: boolean;
  popularityRank: number;
};

type MedicationSelection = {
  brandName: string;
  genericName: string | null;
  slug: string;
  compoundNames: string[];
};

type ItineraryStop = {
  id: string;
  stopType: StopType;
  country: CountrySuggestion | null;
};

const MAX_STOPS = 6;
const MAX_TRANSIT = 4;
const MAX_MEDICATIONS = 10;

let stopIdCounter = 0;
function nextStopId(): string {
  return `stop-${++stopIdCounter}`;
}

function buildInitialStops(): ItineraryStop[] {
  return [
    { id: nextStopId(), stopType: "origin", country: null },
    { id: nextStopId(), stopType: "destination", country: null },
  ];
}

export function ItineraryBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Medications
  const [medications, setMedications] = useState<MedicationSelection[]>(() => {
    const medsParam = searchParams.get("medications");
    if (medsParam) {
      try {
        return JSON.parse(decodeURIComponent(medsParam));
      } catch {
        return [];
      }
    }
    return [];
  });
  const [addingMed, setAddingMed] = useState<MedicationSelection | null>(null);

  // Stops
  const [stops, setStops] = useState<ItineraryStop[]>(() => {
    const initial = buildInitialStops();
    const dest = searchParams.get("destination");
    const origin = searchParams.get("origin");
    if (dest) {
      initial[initial.length - 1].country = {
        name: searchParams.get("destName") ?? dest,
        code: dest.toUpperCase(),
        flagEmoji: searchParams.get("destFlag") ?? "",
        isCovered: true,
        popularityRank: 0,
      };
    }
    if (origin) {
      initial[0].country = {
        name: searchParams.get("originName") ?? origin,
        code: origin.toUpperCase(),
        flagEmoji: searchParams.get("originFlag") ?? "",
        isCovered: true,
        popularityRank: 0,
      };
    }
    return initial;
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ItineraryCheckResult | null>(null);

  const transitCount = stops.filter((s) => s.stopType === "transit").length;
  const canAddTransit = transitCount < MAX_TRANSIT && stops.length < MAX_STOPS;
  const originSelected = stops[0]?.country !== null;
  const destSelected = stops[stops.length - 1]?.country !== null;
  const canCheck = originSelected && destSelected && medications.length > 0;

  const syncUrlParams = useCallback(
    (updatedStops: ItineraryStop[], updatedMeds?: MedicationSelection[]) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("origin");
      params.delete("originName");
      params.delete("originFlag");
      params.delete("destination");
      params.delete("destName");
      params.delete("destFlag");
      params.delete("transit");

      const originStop = updatedStops[0];
      const destStop = updatedStops[updatedStops.length - 1];

      if (originStop?.country) {
        params.set("origin", originStop.country.code);
        params.set("originName", originStop.country.name);
        params.set("originFlag", originStop.country.flagEmoji);
      }
      if (destStop?.country) {
        params.set("destination", destStop.country.code);
        params.set("destName", destStop.country.name);
        params.set("destFlag", destStop.country.flagEmoji);
      }

      const transitStops = updatedStops.filter(
        (s) => s.stopType === "transit" && s.country
      );
      for (const t of transitStops) {
        params.append("transit", t.country!.code);
      }

      const meds = updatedMeds ?? medications;
      if (meds.length > 0) {
        params.set("medications", encodeURIComponent(JSON.stringify(meds)));
      } else {
        params.delete("medications");
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, medications]
  );

  function handleAddMedication(med: MedicationSelection) {
    if (medications.some((m) => m.slug === med.slug)) {
      toast.error(`${med.brandName} is already in your list.`);
      setAddingMed(null);
      return;
    }
    const updated = [...medications, med];
    setMedications(updated);
    setAddingMed(null);
    setResult(null);
    syncUrlParams(stops, updated);
  }

  function handleRemoveMedication(slug: string) {
    const updated = medications.filter((m) => m.slug !== slug);
    setMedications(updated);
    setResult(null);
    syncUrlParams(stops, updated);
  }

  function handleCountrySelect(stopId: string, country: CountrySuggestion) {
    const updated = stops.map((s) =>
      s.id === stopId ? { ...s, country } : s
    );
    setStops(updated);
    syncUrlParams(updated);
    setResult(null);
  }

  function handleCountryClear(stopId: string) {
    const updated = stops.map((s) =>
      s.id === stopId ? { ...s, country: null } : s
    );
    setStops(updated);
    syncUrlParams(updated);
    setResult(null);
  }

  function addTransitStop() {
    if (!canAddTransit) return;
    const destIndex = stops.length - 1;
    const newStop: ItineraryStop = {
      id: nextStopId(),
      stopType: "transit",
      country: null,
    };
    const updated = [
      ...stops.slice(0, destIndex),
      newStop,
      stops[destIndex],
    ];
    setStops(updated);
    syncUrlParams(updated);
    setResult(null);
  }

  function removeTransitStop(stopId: string) {
    const updated = stops.filter((s) => s.id !== stopId);
    setStops(updated);
    syncUrlParams(updated);
    setResult(null);
  }

  function moveStop(stopId: string, direction: "up" | "down") {
    const idx = stops.findIndex((s) => s.id === stopId);
    if (idx < 0) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx <= 0 || targetIdx >= stops.length - 1) return;
    if (stops[idx].stopType !== "transit") return;

    const updated = [...stops];
    [updated[idx], updated[targetIdx]] = [updated[targetIdx], updated[idx]];
    setStops(updated);
    syncUrlParams(updated);
    setResult(null);
  }

  async function handleCheck() {
    if (!canCheck) return;
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        medications: medications.map((m) => m.slug),
        stops: stops
          .filter((s) => s.country)
          .map((s) => ({
            countryCode: s.country!.code,
            stopType: s.stopType,
          })),
      };

      const res = await fetch("/api/itinerary/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) {
        toast.error(json.error?.message ?? "Failed to check itinerary.");
        return;
      }

      setResult(json.data);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Medications section */}
      <section>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Pill className="size-4 text-muted-foreground" />
          Medications to check
        </h2>

        {/* Selected medications */}
        {medications.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {medications.map((med) => (
              <span
                key={med.slug}
                className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1.5 text-sm"
              >
                {med.brandName}
                {med.genericName && (
                  <span className="text-muted-foreground text-xs">
                    ({med.genericName})
                  </span>
                )}
                <button
                  onClick={() => handleRemoveMedication(med.slug)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                  aria-label={`Remove ${med.brandName}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add medication input */}
        {medications.length < MAX_MEDICATIONS && (
          <MedicationAutocomplete
            variant="compact"
            onSelect={handleAddMedication}
            selectedMedication={addingMed}
            onClear={() => setAddingMed(null)}
          />
        )}

        {medications.length === 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Add at least one medication to check across your route.
          </p>
        )}
      </section>

      {/* Route section */}
      <section>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Route className="size-4 text-muted-foreground" />
          Travel route
        </h2>

        <div className="space-y-3">
          {stops.map((stop, index) => {
            const isOrigin = stop.stopType === "origin";
            const isDest = stop.stopType === "destination";
            const isTransit = stop.stopType === "transit";
            const canMoveUp = isTransit && index > 1;
            const canMoveDown =
              isTransit && index < stops.length - 2;

            return (
              <div
                key={stop.id}
                className="flex items-start gap-3"
              >
                {/* Step indicator */}
                <div className="flex flex-col items-center pt-3">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isOrigin
                        ? "bg-primary text-primary-foreground"
                        : isDest
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Country selector */}
                <div className="flex-1">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    {isOrigin
                      ? "Origin"
                      : isDest
                        ? "Destination"
                        : `Transit stop ${stops.slice(1, index).filter((s) => s.stopType === "transit").length + 1}`}
                  </p>
                  <CountrySelector
                    variant="multi"
                    onSelect={(country) =>
                      handleCountrySelect(stop.id, country)
                    }
                    selectedCountry={stop.country}
                    onClear={() => handleCountryClear(stop.id)}
                  />
                </div>

                {/* Action buttons for transit stops */}
                <div className="flex flex-col gap-1 pt-7">
                  {isTransit && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => moveStop(stop.id, "up")}
                        disabled={!canMoveUp}
                        aria-label={`Move ${stop.country?.name ?? "transit stop"} up`}
                        className="min-h-[48px] min-w-[48px] sm:min-h-0 sm:min-w-0"
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => moveStop(stop.id, "down")}
                        disabled={!canMoveDown}
                        aria-label={`Move ${stop.country?.name ?? "transit stop"} down`}
                        className="min-h-[48px] min-w-[48px] sm:min-h-0 sm:min-w-0"
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeTransitStop(stop.id)}
                        aria-label={`Remove ${stop.country?.name ?? "transit stop"}`}
                        className="min-h-[48px] min-w-[48px] text-destructive hover:text-destructive sm:min-h-0 sm:min-w-0"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add transit stop button */}
      {canAddTransit && (
        <Button
          variant="outline"
          size="sm"
          onClick={addTransitStop}
          className="w-full"
        >
          <Plus className="size-4" data-icon="inline-start" />
          Add transit stop
        </Button>
      )}

      {/* Check itinerary button */}
      <Button
        onClick={handleCheck}
        disabled={!canCheck || loading}
        className="w-full h-12 text-base bg-orange-600 text-white hover:bg-orange-500"
      >
        {loading ? (
          <Loader2 className="size-5 animate-spin" data-icon="inline-start" />
        ) : (
          <Route className="size-5" data-icon="inline-start" />
        )}
        {loading ? "Checking itinerary..." : "Check itinerary"}
      </Button>

      {!canCheck && medications.length === 0 && originSelected && destSelected && (
        <p className="text-center text-sm text-muted-foreground">
          Add at least one medication above to check your itinerary.
        </p>
      )}

      {/* Results timeline */}
      {result && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Itinerary Results</h2>
          <ItineraryTimeline
            itinerary={result.itinerary}
            conflicts={result.conflicts}
            alternatives={result.alternatives}
          />
        </div>
      )}
    </div>
  );
}

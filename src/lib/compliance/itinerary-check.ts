import { getComplianceResult } from "./get-compliance-result";
import { getAlternativeHubs } from "./alternative-hubs";
import { prisma } from "@/lib/db/prisma";
import type { ComplianceResult } from "@/types/compliance";

export type StopType = "origin" | "transit" | "destination";

export type ItineraryStop = {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  stopType: StopType;
  results: ComplianceResult[];
  transitConflict: boolean;
};

export type TransitConflict = {
  stopIndex: number;
  countryCode: string;
  countryName: string;
  medicationSlug: string;
  medicationName: string;
  originStatus: string;
  destinationStatus: string;
  transitStatus: string;
};

export type AlternativeHub = {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  medicationStatus: string;
};

export type ItineraryCheckResult = {
  itinerary: ItineraryStop[];
  conflicts: TransitConflict[];
  alternatives: AlternativeHub[];
};

export async function checkItinerary(
  medications: string[],
  stops: { countryCode: string; stopType: StopType }[]
): Promise<ItineraryCheckResult> {
  // Fetch country data for all stops
  const countryCodes = stops.map((s) => s.countryCode.toUpperCase());
  const countries = await prisma.country.findMany({
    where: { code: { in: countryCodes } },
  });
  const countryMap = new Map(countries.map((c) => [c.code, c]));

  // Run compliance checks for each medication at each stop
  const itinerary: ItineraryStop[] = await Promise.all(
    stops.map(async (stop) => {
      const code = stop.countryCode.toUpperCase();
      const country = countryMap.get(code);

      const results = await Promise.all(
        medications.map((medSlug) => getComplianceResult(medSlug, code))
      );

      const successfulResults = results
        .filter((r) => r.success)
        .map((r) => (r as { success: true; data: ComplianceResult }).data);

      return {
        countryCode: code,
        countryName: country?.name ?? code,
        flagEmoji: country?.flagEmoji ?? "",
        stopType: stop.stopType,
        results: successfulResults,
        transitConflict: false,
      };
    })
  );

  // Detect transit conflicts
  const conflicts: TransitConflict[] = [];
  const originStop = itinerary.find((s) => s.stopType === "origin");
  const destStop = itinerary.find((s) => s.stopType === "destination");
  const transitStops = itinerary.filter((s) => s.stopType === "transit");

  for (const transit of transitStops) {
    for (const transitResult of transit.results) {
      const originResult = originStop?.results.find(
        (r) => r.medication === transitResult.medication
      );
      const destResult = destStop?.results.find(
        (r) => r.medication === transitResult.medication
      );

      const originOk =
        originResult?.overallStatus === "LEGAL" ||
        originResult?.overallStatus === "PRESCRIPTION_ONLY";
      const destOk =
        destResult?.overallStatus === "LEGAL" ||
        destResult?.overallStatus === "PRESCRIPTION_ONLY";
      const transitBad =
        transitResult.overallStatus === "BANNED" ||
        transitResult.overallStatus === "RESTRICTED";

      if (originOk && destOk && transitBad) {
        transit.transitConflict = true;
        const medSlug = medications.find((m) =>
          transitResult.medication.toLowerCase().includes(m.replace(/-/g, " "))
        ) ?? medications[0];

        conflicts.push({
          stopIndex: itinerary.indexOf(transit),
          countryCode: transit.countryCode,
          countryName: transit.countryName,
          medicationSlug: medSlug,
          medicationName: transitResult.medication,
          originStatus: originResult?.overallStatus ?? "UNKNOWN",
          destinationStatus: destResult?.overallStatus ?? "UNKNOWN",
          transitStatus: transitResult.overallStatus,
        });
      }
    }
  }

  // Find alternative hubs for conflicts
  const alternatives: AlternativeHub[] = [];
  if (conflicts.length > 0 && originStop && destStop) {
    const existingCodes = itinerary.map((s) => s.countryCode);
    const conflictCodes = conflicts.map((c) => c.countryCode);

    for (const conflictCode of new Set(conflictCodes)) {
      const hubCodes = getAlternativeHubs(
        originStop.countryCode,
        destStop.countryCode,
        conflictCode,
        existingCodes
      );

      // Check medication status at each alternative hub
      for (const hubCode of hubCodes) {
        const hubCountry = await prisma.country.findUnique({
          where: { code: hubCode },
        });
        if (!hubCountry?.isCovered) continue;

        const firstMed = medications[0];
        const hubResult = await getComplianceResult(firstMed, hubCode);
        if (hubResult.success) {
          alternatives.push({
            countryCode: hubCode,
            countryName: hubCountry.name,
            flagEmoji: hubCountry.flagEmoji,
            medicationStatus: hubResult.data.overallStatus,
          });
        }
      }
    }
  }

  return { itinerary, conflicts, alternatives };
}

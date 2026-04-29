/**
 * Common alternative transit hubs for major airline routing corridors.
 * Maps region pairs to common hub country codes.
 */
const TRANSIT_HUBS: Record<string, string[]> = {
  // Asia-Pacific hubs
  "APAC": ["SG", "JP", "KR", "TH", "MY"],
  // Middle East hubs
  "ME": ["AE", "QA", "BH"],
  // European hubs
  "EU": ["NL", "DE", "FR", "GB", "CH"],
  // Americas hubs
  "AM": ["US", "CA", "PA", "MX"],
};

const COUNTRY_TO_REGION: Record<string, string> = {
  // Asia-Pacific
  SG: "APAC", JP: "APAC", KR: "APAC", TH: "APAC", MY: "APAC",
  CN: "APAC", AU: "APAC", NZ: "APAC", IN: "APAC", ID: "APAC",
  PH: "APAC", VN: "APAC", TW: "APAC", HK: "APAC",
  // Middle East
  AE: "ME", QA: "ME", BH: "ME", SA: "ME", OM: "ME", KW: "ME",
  // Europe
  NL: "EU", DE: "EU", FR: "EU", GB: "EU", CH: "EU", IT: "EU",
  ES: "EU", PT: "EU", AT: "EU", BE: "EU", IE: "EU", SE: "EU",
  NO: "EU", DK: "EU", FI: "EU", PL: "EU", CZ: "EU", GR: "EU",
  // Americas
  US: "AM", CA: "AM", MX: "AM", BR: "AM", AR: "AM", CL: "AM",
  CO: "AM", PE: "AM", PA: "AM",
  // Africa
  ZA: "AF", KE: "AF", EG: "AF", NG: "AF", MA: "AF", ET: "AF",
};

/**
 * Returns common alternative transit hub country codes,
 * excluding the conflicting country and any already in the itinerary.
 */
export function getAlternativeHubs(
  originCode: string,
  destinationCode: string,
  conflictCode: string,
  existingStopCodes: string[]
): string[] {
  const exclude = new Set([
    conflictCode,
    originCode,
    destinationCode,
    ...existingStopCodes,
  ]);

  // Get region of the conflict stop to find relevant alternatives
  const conflictRegion = COUNTRY_TO_REGION[conflictCode];
  const originRegion = COUNTRY_TO_REGION[originCode];
  const destRegion = COUNTRY_TO_REGION[destinationCode];

  const candidateRegions = new Set<string>();
  if (conflictRegion) candidateRegions.add(conflictRegion);
  if (originRegion) candidateRegions.add(originRegion);
  if (destRegion) candidateRegions.add(destRegion);

  // Collect all hubs from relevant regions
  const hubs = new Set<string>();
  for (const region of candidateRegions) {
    const regionHubs = TRANSIT_HUBS[region];
    if (regionHubs) {
      for (const hub of regionHubs) {
        if (!exclude.has(hub)) hubs.add(hub);
      }
    }
  }

  return Array.from(hubs).slice(0, 5);
}

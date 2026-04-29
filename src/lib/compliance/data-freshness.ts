import { FRESHNESS_THRESHOLDS, type FreshnessStatus } from "@/types/compliance";

export function calculateFreshness(lastVerifiedAt: Date): FreshnessStatus {
  const daysSinceVerification = Math.floor(
    (Date.now() - lastVerifiedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceVerification <= FRESHNESS_THRESHOLDS.CURRENT_MAX_DAYS) {
    return "current";
  }
  if (daysSinceVerification <= FRESHNESS_THRESHOLDS.AGING_MAX_DAYS) {
    return "aging";
  }
  return "stale";
}

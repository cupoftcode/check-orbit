/**
 * ComplianceStatus — single source of truth for medication regulatory status.
 * Consumed by Prisma schema, API responses, frontend components,
 * Trigger.dev tasks, and notification logic.
 */
export enum ComplianceStatus {
  LEGAL = "LEGAL",
  PRESCRIPTION_ONLY = "PRESCRIPTION_ONLY",
  RESTRICTED = "RESTRICTED",
  BANNED = "BANNED",
}

/**
 * Severity ordering for compliance statuses.
 * Higher number = more restrictive. Used when resolving multi-authority
 * conflicts (apply most restrictive interpretation per FR36).
 */
export const STATUS_SEVERITY: Record<ComplianceStatus, number> = {
  [ComplianceStatus.LEGAL]: 0,
  [ComplianceStatus.PRESCRIPTION_ONLY]: 1,
  [ComplianceStatus.RESTRICTED]: 2,
  [ComplianceStatus.BANNED]: 3,
};

/** Data freshness thresholds (in days) per architecture spec */
export const FRESHNESS_THRESHOLDS = {
  CURRENT_MAX_DAYS: 90,
  AGING_MAX_DAYS: 180,
} as const;

export type FreshnessStatus = "current" | "aging" | "stale";

export type ComplianceResultCompound = {
  compoundName: string;
  status: ComplianceStatus;
  dosageThreshold: string | null;
  documentation: string | null;
  quantityLimit: string | null;
  permitRequirement: string | null;
  permitLeadTimeDays: number | null;
  permitAuthority: string | null;
  permitApplicationUrl: string | null;
  sourceDocument: string;
  sourceUrl: string;
  lastVerifiedAt: string; // ISO 8601
  freshnessStatus: FreshnessStatus;
};

export type ComplianceResult = {
  medication: string;
  country: string;
  countryCode: string;
  overallStatus: ComplianceStatus;
  compounds: ComplianceResultCompound[];
  disclaimer: string;
  hasBiosecurityWarning: boolean;
  biosecurityDetails: string | null;
  hasProprietaryBlendWarning: boolean;
};

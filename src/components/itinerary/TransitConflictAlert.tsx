"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import { ComplianceStatusBadge } from "@/components/compliance/ComplianceStatusBadge";
import { ComplianceStatus } from "@/types/compliance";
import type { TransitConflict, AlternativeHub } from "@/lib/compliance/itinerary-check";

type Props = {
  conflict: TransitConflict;
  alternatives: AlternativeHub[];
};

function toComplianceStatus(status: string): ComplianceStatus {
  if (status in ComplianceStatus) return status as ComplianceStatus;
  return ComplianceStatus.RESTRICTED;
}

export function TransitConflictAlert({ conflict, alternatives }: Props) {
  const relevantAlternatives = alternatives.filter(
    (a) =>
      toComplianceStatus(a.medicationStatus) === ComplianceStatus.LEGAL ||
      toComplianceStatus(a.medicationStatus) === ComplianceStatus.PRESCRIPTION_ONLY
  );

  return (
    <div
      role="alert"
      aria-live="polite"
      className="my-2 rounded-lg border-2 border-rose-300 bg-rose-50 p-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-rose-600"
          aria-hidden="true"
        />
        <div className="flex-1 space-y-3">
          <div>
            <p className="font-medium text-rose-800">
              Transit conflict at {conflict.countryName}
            </p>
            <p className="mt-1 text-sm text-rose-700">
              {conflict.medicationName} is legal at your origin and destination
              but{" "}
              <span className="font-bold">
                {conflict.transitStatus.toLowerCase()}
              </span>{" "}
              at this layover.
            </p>
          </div>

          {/* Status comparison */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Origin:</span>
            <ComplianceStatusBadge
              status={toComplianceStatus(conflict.originStatus)}
              variant="compact"
            />
            <ArrowRight className="size-3 text-muted-foreground" aria-hidden="true" />
            <span className="text-muted-foreground">Transit:</span>
            <ComplianceStatusBadge
              status={toComplianceStatus(conflict.transitStatus)}
              variant="compact"
            />
            <ArrowRight className="size-3 text-muted-foreground" aria-hidden="true" />
            <span className="text-muted-foreground">Destination:</span>
            <ComplianceStatusBadge
              status={toComplianceStatus(conflict.destinationStatus)}
              variant="compact"
            />
          </div>

          {/* Alternative hubs */}
          {relevantAlternatives.length > 0 && (
            <div className="border-t border-rose-200 pt-3">
              <p className="text-sm font-medium text-rose-800">
                Safe alternative transit hubs:
              </p>
              <ul className="mt-1.5 space-y-1">
                {relevantAlternatives.map((hub) => (
                  <li
                    key={hub.countryCode}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span aria-hidden="true">{hub.flagEmoji}</span>
                    <span>{hub.countryName}</span>
                    <span className="text-muted-foreground">—</span>
                    <ComplianceStatusBadge
                      status={toComplianceStatus(hub.medicationStatus)}
                      variant="compact"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Screen reader summary */}
          <span className="sr-only">
            Transit conflict detected: {conflict.medicationName} is{" "}
            {conflict.transitStatus.toLowerCase()} at {conflict.countryName},
            but legal at origin and destination.
            {relevantAlternatives.length > 0 &&
              ` ${relevantAlternatives.length} safe alternative transit hub${relevantAlternatives.length !== 1 ? "s" : ""} available.`}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plane, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComplianceStatusBadge } from "@/components/compliance/ComplianceStatusBadge";
import { ComplianceStatus } from "@/types/compliance";
import { TransitConflictAlert } from "./TransitConflictAlert";
import type {
  ItineraryStop,
  TransitConflict,
  AlternativeHub,
} from "@/lib/compliance/itinerary-check";

type Props = {
  itinerary: ItineraryStop[];
  conflicts: TransitConflict[];
  alternatives: AlternativeHub[];
};

function toComplianceStatus(status: string): ComplianceStatus {
  if (status in ComplianceStatus) return status as ComplianceStatus;
  return ComplianceStatus.RESTRICTED;
}

const STATUS_DOT_COLORS: Record<ComplianceStatus, string> = {
  [ComplianceStatus.LEGAL]: "bg-emerald-500 ring-emerald-200",
  [ComplianceStatus.PRESCRIPTION_ONLY]: "bg-sky-500 ring-sky-200",
  [ComplianceStatus.RESTRICTED]: "bg-amber-500 ring-amber-200",
  [ComplianceStatus.BANNED]: "bg-rose-500 ring-rose-200",
};

const STATUS_LINE_COLORS: Record<ComplianceStatus, string> = {
  [ComplianceStatus.LEGAL]: "bg-emerald-300",
  [ComplianceStatus.PRESCRIPTION_ONLY]: "bg-sky-300",
  [ComplianceStatus.RESTRICTED]: "bg-amber-300",
  [ComplianceStatus.BANNED]: "bg-rose-300",
};

const STOP_TYPE_ICON = {
  origin: Navigation,
  transit: Plane,
  destination: MapPin,
} as const;

const STOP_TYPE_LABEL = {
  origin: "Origin",
  transit: "Transit",
  destination: "Destination",
} as const;

function getWorstStatus(results: ItineraryStop["results"]): ComplianceStatus {
  if (results.length === 0) return ComplianceStatus.LEGAL;
  let worst = ComplianceStatus.LEGAL;
  const severity: Record<ComplianceStatus, number> = {
    [ComplianceStatus.LEGAL]: 0,
    [ComplianceStatus.PRESCRIPTION_ONLY]: 1,
    [ComplianceStatus.RESTRICTED]: 2,
    [ComplianceStatus.BANNED]: 3,
  };
  for (const r of results) {
    const s = toComplianceStatus(r.overallStatus);
    if (severity[s] > severity[worst]) worst = s;
  }
  return worst;
}

function TimelineStop({
  stop,
  index,
  total,
  conflicts,
  alternatives,
}: {
  stop: ItineraryStop;
  index: number;
  total: number;
  conflicts: TransitConflict[];
  alternatives: AlternativeHub[];
}) {
  const [expanded, setExpanded] = useState(stop.transitConflict);
  const worstStatus = getWorstStatus(stop.results);
  const dotColor = stop.transitConflict
    ? "bg-rose-500 ring-rose-200"
    : STATUS_DOT_COLORS[worstStatus];
  const lineColor = stop.transitConflict
    ? "bg-rose-300"
    : STATUS_LINE_COLORS[worstStatus];
  const StopIcon = STOP_TYPE_ICON[stop.stopType];
  const stopConflicts = conflicts.filter(
    (c) => c.countryCode === stop.countryCode
  );

  return (
    <li
      role="listitem"
      aria-label={`Stop ${index + 1} of ${total}: ${stop.countryName}, ${STOP_TYPE_LABEL[stop.stopType]} — ${worstStatus.toLowerCase().replace("_", " ")}${stop.transitConflict ? ", transit conflict detected" : ""}`}
    >
      <div className="flex gap-4">
        {/* Timeline rail */}
        <div className="flex flex-col items-center">
          <div
            className={`size-4 shrink-0 rounded-full ring-4 ${dotColor}`}
            aria-hidden="true"
          />
          {index < total - 1 && (
            <div
              className={`w-0.5 flex-1 min-h-8 ${lineColor}`}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Stop content */}
        <div className="flex-1 pb-6">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-lg">
                {stop.flagEmoji}
              </span>
              <div>
                <p className="font-medium leading-tight">{stop.countryName}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <StopIcon className="size-3" aria-hidden="true" />
                  {STOP_TYPE_LABEL[stop.stopType]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {stop.results.length > 0 && (
                <ComplianceStatusBadge
                  status={worstStatus}
                  variant="compact"
                />
              )}
              {stop.results.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setExpanded(!expanded)}
                  aria-expanded={expanded}
                  aria-label={`${expanded ? "Collapse" : "Expand"} details for ${stop.countryName}`}
                >
                  {expanded ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Transit conflict alerts */}
          {stopConflicts.map((conflict) => (
            <TransitConflictAlert
              key={`${conflict.countryCode}-${conflict.medicationSlug}`}
              conflict={conflict}
              alternatives={alternatives}
            />
          ))}

          {/* Expanded compound details */}
          {expanded && stop.results.length > 0 && (
            <div className="mt-3 space-y-3">
              {stop.results.map((result) => (
                <div
                  key={result.medication}
                  className="rounded-lg border bg-card p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{result.medication}</p>
                    <ComplianceStatusBadge
                      status={toComplianceStatus(result.overallStatus)}
                      variant="compact"
                    />
                  </div>

                  {result.compounds.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {result.compounds.map((compound) => (
                        <li
                          key={compound.compoundName}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-muted-foreground">
                            {compound.compoundName}
                          </span>
                          <ComplianceStatusBadge
                            status={compound.status}
                            variant="compact"
                          />
                        </li>
                      ))}
                    </ul>
                  )}

                  {result.compounds.some((c) => c.documentation) && (
                    <div className="mt-2 border-t pt-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Required documentation:
                      </p>
                      <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                        {result.compounds
                          .filter((c) => c.documentation)
                          .map((c) => (
                            <li key={c.compoundName}>• {c.documentation}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {result.compounds.some((c) => c.sourceUrl) && (
                    <div className="mt-2 border-t pt-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Sources:
                      </p>
                      <ul className="mt-1 space-y-0.5 text-xs">
                        {result.compounds
                          .filter((c) => c.sourceUrl)
                          .map((c) => (
                            <li key={c.compoundName}>
                              <a
                                href={c.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline-offset-2 hover:underline"
                              >
                                {c.sourceDocument}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export function ItineraryTimeline({
  itinerary,
  conflicts,
  alternatives,
}: Props) {
  return (
    <div className="w-full">
      {conflicts.length > 0 && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
          <p className="text-sm font-medium text-rose-800">
            {conflicts.length} transit conflict
            {conflicts.length !== 1 ? "s" : ""} detected in your itinerary
          </p>
        </div>
      )}

      <ol role="list" className="space-y-0">
        {itinerary.map((stop, i) => (
          <TimelineStop
            key={`${stop.countryCode}-${i}`}
            stop={stop}
            index={i}
            total={itinerary.length}
            conflicts={conflicts}
            alternatives={alternatives}
          />
        ))}
      </ol>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ComplianceStatusBadge } from "./ComplianceStatusBadge";
import { AlertTriangle, RefreshCw, X, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateSnapshot } from "@/actions/update-snapshot";
import { ComplianceStatus } from "@/types/compliance";
import type { ComplianceResult, ComplianceResultCompound } from "@/types/compliance";

type Props = {
  searchId: string;
  snapshot: ComplianceResult;
  current: ComplianceResult;
  medicationSlug: string;
};

function buildDifferences(
  snapshot: ComplianceResult,
  current: ComplianceResult
): string[] {
  const diffs: string[] = [];

  if (snapshot.overallStatus !== current.overallStatus) {
    diffs.push(
      `Status: ${snapshot.overallStatus} \u2192 ${current.overallStatus}`
    );
  }

  const snapshotPrimary = snapshot.compounds[0];
  const currentPrimary = current.compounds[0];

  if (snapshotPrimary && currentPrimary) {
    if (snapshotPrimary.documentation !== currentPrimary.documentation) {
      diffs.push(
        `Documents: ${snapshotPrimary.documentation ?? "None required"} \u2192 ${currentPrimary.documentation ?? "None required"}`
      );
    }
    if (snapshotPrimary.permitLeadTimeDays !== currentPrimary.permitLeadTimeDays) {
      diffs.push(
        `Permit lead time: ${snapshotPrimary.permitLeadTimeDays ?? "N/A"} days \u2192 ${currentPrimary.permitLeadTimeDays ?? "N/A"} days`
      );
    }
    if (snapshotPrimary.quantityLimit !== currentPrimary.quantityLimit) {
      diffs.push(
        `Quantity limits: ${snapshotPrimary.quantityLimit ?? "None"} \u2192 ${currentPrimary.quantityLimit ?? "None"}`
      );
    }
  }

  // Check per-compound status changes
  for (const currentCompound of current.compounds) {
    const snapshotCompound = snapshot.compounds.find(
      (c: ComplianceResultCompound) => c.compoundName === currentCompound.compoundName
    );
    if (snapshotCompound && snapshotCompound.status !== currentCompound.status) {
      diffs.push(
        `${currentCompound.compoundName}: ${snapshotCompound.status} \u2192 ${currentCompound.status}`
      );
    }
  }

  return diffs;
}

export function ChangeComparisonBanner({
  searchId,
  snapshot,
  current,
  medicationSlug,
}: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasChanged = snapshot.overallStatus !== current.overallStatus ||
    JSON.stringify(snapshot.compounds) !== JSON.stringify(current.compounds);

  if (!hasChanged || dismissed || updated) {
    // No changes or already handled — show subtle "current" indicator
    const verifiedDate = current.compounds[0]?.lastVerifiedAt;
    const dateStr = verifiedDate
      ? new Date(verifiedDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

    return (
      <p className="text-sm text-muted-foreground text-center" aria-live="polite">
        {updated
          ? "Snapshot updated to current results"
          : `Current — ${dateStr ? `verified ${dateStr}, ` : ""}no changes since your last check`}
      </p>
    );
  }

  const differences = buildDifferences(snapshot, current);
  const currentPrimary = current.compounds[0];
  const verifiedDate = currentPrimary?.lastVerifiedAt
    ? new Date(currentPrimary.lastVerifiedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Screen reader description
  const srDescription = `Previous: ${snapshot.overallStatus}. Current: ${current.overallStatus}. ${differences.join(". ")}.`;

  function handleUpdateSnapshot() {
    startTransition(async () => {
      const res = await updateSnapshot(searchId, current);
      if (res.success) {
        setUpdated(true);
        toast.success("Snapshot updated to current results");
      } else {
        toast.error(res.error);
      }
    });
  }

  function handleShare() {
    const url = `${window.location.origin}/check/${medicationSlug}/${current.countryCode.toLowerCase()}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  return (
    <div
      role="alert"
      className="rounded-lg border border-amber-300 bg-amber-50 p-4 space-y-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="size-5 text-amber-600 mt-0.5 shrink-0"
          aria-hidden="true"
        />
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-amber-900">Regulation Updated</h3>
            {verifiedDate && (
              <p className="text-xs text-amber-700">Changed as of {verifiedDate}</p>
            )}
          </div>

          {/* Side-by-side status comparison */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="space-y-1">
              <p className="text-xs font-medium text-amber-700">Previous</p>
              <ComplianceStatusBadge
                status={snapshot.overallStatus as ComplianceStatus}
                variant="compact"
              />
            </div>
            <span className="text-amber-400 text-lg" aria-hidden="true">&rarr;</span>
            <div className="space-y-1">
              <p className="text-xs font-medium text-amber-700">Current</p>
              <ComplianceStatusBadge
                status={current.overallStatus as ComplianceStatus}
                variant="compact"
              />
            </div>
          </div>

          {/* Highlighted differences */}
          {differences.length > 0 && (
            <ul className="text-sm text-amber-800 space-y-1">
              {differences.map((diff, i) => (
                <li key={i}>{diff}</li>
              ))}
            </ul>
          )}

          {/* Source citation */}
          {currentPrimary?.sourceDocument && (
            <p className="text-xs text-amber-700">
              Source: {currentPrimary.sourceDocument}
              {currentPrimary.sourceUrl && (
                <>
                  {" "}
                  <a
                    href={currentPrimary.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View document
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                </>
              )}
              {verifiedDate && <> — verified {verifiedDate}</>}
            </p>
          )}

          {/* Screen reader only textual description */}
          <span className="sr-only">{srDescription}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUpdateSnapshot}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
          ) : (
            <RefreshCw className="size-4" data-icon="inline-start" />
          )}
          Update snapshot
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
          <X className="size-4" data-icon="inline-start" />
          Dismiss
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share2 className="size-4" data-icon="inline-start" />
          Share updated risk card
        </Button>
      </div>
    </div>
  );
}

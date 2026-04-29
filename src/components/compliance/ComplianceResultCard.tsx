import type { ComplianceResult } from "@/types/compliance";
import { ComplianceStatusBadge } from "./ComplianceStatusBadge";
import { CompoundDecomposition } from "./CompoundDecomposition";
import { PermitLeadTimeAlert } from "./PermitLeadTimeAlert";
import { BiosecurityWarning } from "./BiosecurityWarning";
import { ProprietaryBlendWarning } from "./ProprietaryBlendWarning";
import { SourceCitation } from "./SourceCitation";
import { DataFreshnessIndicator } from "./DataFreshnessIndicator";
import { SaveForNextTrip } from "./SaveForNextTrip";
import { SaveSearchButton } from "./SaveSearchButton";
import { SendResultEmail } from "@/components/sharing/SendResultEmail";
import { ShareDialog } from "@/components/sharing/ShareDialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Info } from "lucide-react";
import { ComplianceStatus } from "@/types/compliance";

type Props = {
  result: ComplianceResult;
  departureDate: string | null;
  medicationSlug: string;
  initialSaved?: boolean;
};

const STATUS_BAR_COLOR: Record<ComplianceStatus, string> = {
  [ComplianceStatus.LEGAL]: "bg-emerald-400",
  [ComplianceStatus.PRESCRIPTION_ONLY]: "bg-sky-400",
  [ComplianceStatus.RESTRICTED]: "bg-amber-400",
  [ComplianceStatus.BANNED]: "bg-rose-400",
};

export function ComplianceResultCard({ result, departureDate, medicationSlug, initialSaved = false }: Props) {
  const primaryCompound = result.compounds[0];

  return (
    <Card className="overflow-hidden">
      {/* Status bar */}
      <div
        className={`h-1.5 ${STATUS_BAR_COLOR[result.overallStatus]}`}
        aria-hidden="true"
      />

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{result.medication}</h2>
            <p className="text-sm text-muted-foreground">
              {result.country}
            </p>
          </div>
          <ComplianceStatusBadge
            status={result.overallStatus}
            variant="large"
          />
        </div>
        <div className="flex items-center gap-3">
          <SaveSearchButton
            medicationSlug={medicationSlug}
            countryCode={result.countryCode}
            result={result}
            initialSaved={initialSaved}
          />
          <ShareDialog result={result} medicationSlug={medicationSlug} />
          <SendResultEmail result={result} medicationSlug={medicationSlug} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Compound decomposition for multi-ingredient medications */}
        <CompoundDecomposition compounds={result.compounds} />

        {/* Permit / documentation details */}
        {primaryCompound?.documentation && (
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Required Documents</h3>
            <p className="text-sm text-muted-foreground">
              {primaryCompound.documentation}
            </p>
          </div>
        )}

        {primaryCompound?.quantityLimit && (
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Quantity Limits</h3>
            <p className="text-sm text-muted-foreground">
              {primaryCompound.quantityLimit}
            </p>
          </div>
        )}

        {primaryCompound?.permitAuthority && (
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Permit Details</h3>
            <p className="text-sm text-muted-foreground">
              Authority: {primaryCompound.permitAuthority}
            </p>
            {primaryCompound.permitLeadTimeDays && (
              <p className="text-sm text-muted-foreground">
                Lead time: {primaryCompound.permitLeadTimeDays} days
              </p>
            )}
            {primaryCompound.permitApplicationUrl && (
              <p className="text-sm">
                <a
                  href={primaryCompound.permitApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue underline hover:text-brand-blue/80"
                >
                  Apply for permit
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </p>
            )}
          </div>
        )}

        {/* Permit lead time alert (Story 1.9) */}
        {result.overallStatus === ComplianceStatus.RESTRICTED &&
          primaryCompound?.permitLeadTimeDays != null &&
          primaryCompound.permitLeadTimeDays > 0 && (
            <PermitLeadTimeAlert
              permitLeadTimeDays={primaryCompound.permitLeadTimeDays}
              permitAuthority={primaryCompound.permitAuthority}
              permitApplicationUrl={primaryCompound.permitApplicationUrl}
              departureDate={departureDate}
            />
          )}

        {/* Biosecurity warning */}
        {result.hasBiosecurityWarning && (
          <BiosecurityWarning details={result.biosecurityDetails} />
        )}

        {/* Proprietary blend warning */}
        {result.hasProprietaryBlendWarning && <ProprietaryBlendWarning />}

        {/* Source citation */}
        {primaryCompound && (
          <SourceCitation
            documentTitle={primaryCompound.sourceDocument}
            documentUrl={primaryCompound.sourceUrl}
            lastVerifiedAt={primaryCompound.lastVerifiedAt}
          />
        )}

        {primaryCompound && (
          <DataFreshnessIndicator status={primaryCompound.freshnessStatus} />
        )}

        {/* Save for next trip (Story 3.3) */}
        <SaveForNextTrip
          countryCode={result.countryCode}
          countryName={result.country}
        />

        {/* Disclaimer (FR38) */}
        <div className="flex items-start gap-2 rounded-md bg-muted p-3">
          <Info
            size={14}
            className="text-muted-foreground mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
        </div>
      </CardContent>
    </Card>
  );
}

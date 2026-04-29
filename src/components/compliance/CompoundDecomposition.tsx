import type { ComplianceResultCompound } from "@/types/compliance";
import { ComplianceStatusBadge } from "./ComplianceStatusBadge";
import { SourceCitation } from "./SourceCitation";
import { DataFreshnessIndicator } from "./DataFreshnessIndicator";

type Props = {
  compounds: ComplianceResultCompound[];
};

export function CompoundDecomposition({ compounds }: Props) {
  if (compounds.length <= 1) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Active Ingredients</h3>
      <ul className="space-y-2">
        {compounds.map((compound) => (
          <li
            key={compound.compoundName}
            className="flex items-start justify-between gap-3 rounded-md border p-3"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">{compound.compoundName}</p>
              {compound.dosageThreshold && (
                <p className="text-xs text-muted-foreground">
                  Threshold: {compound.dosageThreshold}
                </p>
              )}
              <SourceCitation
                documentTitle={compound.sourceDocument}
                documentUrl={compound.sourceUrl}
                lastVerifiedAt={compound.lastVerifiedAt}
              />
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <ComplianceStatusBadge
                status={compound.status}
                variant="compact"
              />
              <DataFreshnessIndicator status={compound.freshnessStatus} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

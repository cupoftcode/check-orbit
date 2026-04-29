"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AuditAction } from "@prisma/client";

type AuditEntry = {
  id: string;
  action: AuditAction;
  performedBy: string;
  performedAt: string;
  notes: string | null;
  sourceCitation: string | null;
  previousStatus: string | null;
  newStatus: string | null;
  compoundName: string | null;
  countryName: string | null;
};

type Props = {
  entries: AuditEntry[];
  total: number;
};

const ACTION_STYLES: Record<AuditAction, { bg: string; label: string }> = {
  APPROVED: { bg: "bg-emerald-100 text-emerald-800", label: "Approved" },
  REJECTED: { bg: "bg-rose-100 text-rose-800", label: "Rejected" },
  ESCALATED: { bg: "bg-amber-100 text-amber-800", label: "Escalated" },
};

export function AuditTrailTable({ entries, total }: Props) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No audit trail entries yet.</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Compound / Country</TableHead>
            <TableHead>Status Change</TableHead>
            <TableHead>Verifier</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const actionStyle = ACTION_STYLES[entry.action];
            return (
              <TableRow key={entry.id}>
                <TableCell className="text-xs whitespace-nowrap">
                  {new Date(entry.performedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${actionStyle.bg}`}
                  >
                    {actionStyle.label}
                  </span>
                </TableCell>
                <TableCell className="text-sm">
                  {entry.compoundName && entry.countryName
                    ? `${entry.compoundName} — ${entry.countryName}`
                    : "—"}
                </TableCell>
                <TableCell>
                  {entry.previousStatus && entry.newStatus ? (
                    <div className="flex items-center gap-1 text-xs">
                      <Badge variant="outline">{entry.previousStatus}</Badge>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="outline">{entry.newStatus}</Badge>
                    </div>
                  ) : entry.newStatus ? (
                    <Badge variant="outline">{entry.newStatus}</Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  {entry.performedBy}
                </TableCell>
                <TableCell className="text-xs max-w-[200px] truncate">
                  {entry.sourceCitation ?? "—"}
                </TableCell>
                <TableCell className="text-xs max-w-[200px] truncate">
                  {entry.notes ?? "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {total > entries.length && (
        <p className="mt-3 text-sm text-muted-foreground text-center">
          Showing {entries.length} of {total} entries
        </p>
      )}
    </div>
  );
}

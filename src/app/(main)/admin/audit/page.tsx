import { getAuditTrail } from "@/lib/db/queries/audit";
import { prisma } from "@/lib/db/prisma";
import { AuditTrailTable } from "@/components/admin/AuditTrailTable";
import type { AuditAction } from "@prisma/client";

export const metadata = {
  title: "Audit Trail — Curator Dashboard",
};

type Props = {
  searchParams: Promise<{
    action?: string;
    page?: string;
  }>;
};

export default async function AuditPage({ searchParams }: Props) {
  const params = await searchParams;
  const actionFilter =
    params.action && ["APPROVED", "REJECTED", "ESCALATED"].includes(params.action)
      ? (params.action as AuditAction)
      : undefined;

  const page = Math.max(1, parseInt(params.page ?? "1") || 1);
  const limit = 50;
  const offset = (page - 1) * limit;

  const { entries, total } = await getAuditTrail({
    action: actionFilter,
    limit,
    offset,
  });

  // Resolve compound/country names and status changes from JSON data
  const enrichedEntries = await Promise.all(
    entries.map(async (entry) => {
      let compoundName: string | null = null;
      let countryName: string | null = null;
      let previousStatus: string | null = null;
      let newStatus: string | null = null;

      const newData = entry.newData as Record<string, unknown> | null;
      const prevData = entry.previousData as Record<string, unknown> | null;

      const compoundId = (newData?.compoundId ?? prevData?.compoundId) as
        | string
        | undefined;
      const countryId = (newData?.countryId ?? prevData?.countryId) as
        | string
        | undefined;

      if (compoundId) {
        const compound = await prisma.compound.findUnique({
          where: { id: compoundId },
          select: { name: true },
        });
        compoundName = compound?.name ?? null;
      }

      if (countryId) {
        const country = await prisma.country.findUnique({
          where: { id: countryId },
          select: { name: true },
        });
        countryName = country?.name ?? null;
      }

      previousStatus = (prevData?.status as string) ?? null;
      newStatus =
        (newData?.status as string) ??
        (newData?.conservativeStatus as string) ??
        null;

      return {
        id: entry.id,
        action: entry.action,
        performedBy: entry.performedBy,
        performedAt: entry.performedAt.toISOString(),
        notes: entry.notes,
        sourceCitation: entry.sourceCitation,
        previousStatus,
        newStatus,
        compoundName,
        countryName,
      };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Trail</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete record of all regulatory database changes.
        </p>
      </div>

      <AuditTrailTable entries={enrichedEntries} total={total} />
    </div>
  );
}

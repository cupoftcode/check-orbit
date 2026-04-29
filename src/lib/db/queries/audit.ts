import { prisma } from "@/lib/db/prisma";
import type { AuditAction } from "@prisma/client";

export type AuditEntry = {
  id: string;
  action: AuditAction;
  performedBy: string;
  performedAt: Date;
  notes: string | null;
  sourceCitation: string | null;
  previousData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  regulationId: string | null;
  stagingId: string | null;
};

export async function getAuditTrail(filters?: {
  action?: AuditAction;
  performedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}): Promise<{ entries: AuditEntry[]; total: number }> {
  const where: Record<string, unknown> = {};

  if (filters?.action) {
    where.action = filters.action;
  }

  if (filters?.performedBy) {
    where.performedBy = filters.performedBy;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.performedAt = {
      ...(filters.dateFrom && { gte: filters.dateFrom }),
      ...(filters.dateTo && { lte: filters.dateTo }),
    };
  }

  const [entries, total] = await Promise.all([
    prisma.auditTrail.findMany({
      where,
      orderBy: { performedAt: "desc" },
      take: filters?.limit ?? 50,
      skip: filters?.offset ?? 0,
    }),
    prisma.auditTrail.count({ where }),
  ]);

  return {
    entries: entries.map((e) => ({
      id: e.id,
      action: e.action,
      performedBy: e.performedBy,
      performedAt: e.performedAt,
      notes: e.notes,
      sourceCitation: e.sourceCitation,
      previousData: e.previousData as Record<string, unknown> | null,
      newData: e.newData as Record<string, unknown> | null,
      regulationId: e.regulationId,
      stagingId: e.stagingId,
    })),
    total,
  };
}

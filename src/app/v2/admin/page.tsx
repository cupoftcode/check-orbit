import { Suspense } from "react";
import {
  getPendingStagingRegulations,
  getDataFreshness,
} from "@/lib/db/queries/staging";
import { ChangeQueueList } from "@/components/admin/ChangeQueueList";
import { FreshnessDashboard } from "@/components/admin/FreshnessDashboard";
import { QueueFilterBar } from "@/components/admin/QueueFilterBar";
import type { AiConfidence } from "@prisma/client";

export const metadata = {
  title: "Change Queue — Curator Dashboard",
};

type Props = {
  searchParams: Promise<{
    confidence?: string;
    country?: string;
  }>;
};

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const confidenceFilter =
    params.confidence &&
    ["HIGH", "MEDIUM", "LOW"].includes(params.confidence)
      ? (params.confidence as AiConfidence)
      : undefined;

  const [items, freshness] = await Promise.all([
    getPendingStagingRegulations({
      confidence: confidenceFilter,
      countryCode: params.country,
    }),
    getDataFreshness(),
  ]);

  const queueItems = items.map((item) => ({
    id: item.id,
    compoundName: item.compoundName,
    countryName: item.countryName,
    countryFlag: item.countryFlag,
    proposedStatus: item.proposedStatus,
    aiConfidence: item.aiConfidence,
    sourceDocumentTitle: item.sourceDocumentTitle,
    sourceDocumentUrl: item.sourceDocumentUrl,
    flaggedAt: item.flaggedAt.toISOString(),
  }));

  const latestVerification = freshness
    .filter((f) => f.oldestVerification)
    .sort(
      (a, b) =>
        (b.oldestVerification?.getTime() ?? 0) -
        (a.oldestVerification?.getTime() ?? 0)
    )[0]?.oldestVerification;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-display font-bold text-[11px] tracking-[0.12em] uppercase text-brand mb-2">
          Queue
        </p>
        <h1 className="font-display font-black text-[28px] tracking-tighter text-ink mb-1.5">
          Change Queue
        </h1>
        <p className="text-[14px] text-ink-3">
          AI-flagged regulatory changes awaiting curator review.
        </p>
      </div>

      <Suspense>
        <QueueFilterBar
          currentConfidence={params.confidence ?? null}
          currentCountry={params.country ?? null}
        />
      </Suspense>

      <ChangeQueueList
        items={queueItems}
        lastVerifiedAt={latestVerification?.toISOString() ?? null}
      />

      <div className="border-t border-rule pt-8">
        <h2 className="font-display font-extrabold text-[20px] text-ink mb-3">
          Data Freshness
        </h2>
        <FreshnessDashboard data={freshness} />
      </div>
    </div>
  );
}

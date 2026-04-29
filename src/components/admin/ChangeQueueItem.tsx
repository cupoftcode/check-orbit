"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { quickApprove, quickReject } from "@/actions/approve-regulation";
import { toast } from "sonner";
import type { AiConfidence } from "@prisma/client";

type Props = {
  id: string;
  compoundName: string;
  countryName: string;
  countryFlag: string;
  proposedStatus: string;
  aiConfidence: AiConfidence;
  sourceDocumentTitle: string;
  sourceDocumentUrl: string;
  flaggedAt: string;
  onRemove: (id: string) => void;
};

const CONFIDENCE_STYLES: Record<
  AiConfidence,
  { bg: string; text: string; label: string }
> = {
  HIGH: { bg: "bg-emerald-100", text: "text-emerald-800", label: "High confidence" },
  MEDIUM: { bg: "bg-amber-100", text: "text-amber-800", label: "Medium confidence" },
  LOW: { bg: "bg-rose-100", text: "text-rose-800", label: "Low confidence" },
};

const STATUS_LABEL: Record<string, string> = {
  LEGAL: "Legal",
  PRESCRIPTION_ONLY: "Prescription Only",
  RESTRICTED: "Restricted",
  BANNED: "Banned",
};

export function ChangeQueueItem({
  id,
  compoundName,
  countryName,
  countryFlag,
  proposedStatus,
  aiConfidence,
  sourceDocumentTitle,
  sourceDocumentUrl,
  flaggedAt,
  onRemove,
}: Props) {
  const [isApproving, startApprove] = useTransition();
  const [isRejecting, startReject] = useTransition();
  const conf = CONFIDENCE_STYLES[aiConfidence];

  function handleQuickApprove() {
    startApprove(async () => {
      const res = await quickApprove(id);
      if (res.success) {
        toast.success("Change approved and published");
        onRemove(id);
      } else {
        toast.error(res.error);
      }
    });
  }

  function handleQuickReject() {
    startReject(async () => {
      const res = await quickReject(id, "Rejected via quick action");
      if (res.success) {
        toast.success("Change rejected");
        onRemove(id);
      } else {
        toast.error(res.error);
      }
    });
  }

  const isPending = isApproving || isRejecting;

  return (
    <li
      role="listitem"
      className="rounded-lg border p-4 transition-colors hover:bg-muted/30"
    >
      <div className="flex items-start justify-between gap-4">
        <Link
          href={`/admin/review/${id}`}
          className="flex-1 space-y-2"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${conf.bg} ${conf.text}`}
              aria-label={conf.label}
            >
              {conf.label}
            </span>
            <Badge variant="outline">
              {STATUS_LABEL[proposedStatus] ?? proposedStatus}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span aria-hidden="true">{countryFlag}</span>
            <p className="font-medium">
              {compoundName} — {countryName}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <a
              href={sourceDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="size-3" />
              {sourceDocumentTitle}
            </a>
            <span>
              Flagged{" "}
              {new Date(flaggedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </Link>

        {/* Quick actions */}
        <div className="flex items-center gap-1 shrink-0">
          {aiConfidence === "HIGH" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickApprove}
              disabled={isPending}
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
              aria-label={`Quick approve ${compoundName} in ${countryName}`}
            >
              {isApproving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleQuickReject}
            disabled={isPending}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            aria-label={`Quick reject ${compoundName} in ${countryName}`}
          >
            {isRejecting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </li>
  );
}

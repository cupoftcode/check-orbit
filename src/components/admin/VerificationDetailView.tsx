"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Check,
  X,
  AlertTriangle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { approveRegulation } from "@/actions/approve-regulation";
import { rejectChange } from "@/actions/reject-change";
import { escalateChange } from "@/actions/escalate-change";
import { toast } from "sonner";
import type { StagingRegulationWithRelations } from "@/lib/db/queries/staging";

type Props = {
  item: StagingRegulationWithRelations;
  currentRegulation: {
    status: string;
    requiredDocuments: string | null;
    quantityLimits: string | null;
    lastVerifiedAt: string | null;
    verifiedBy: string | null;
  } | null;
};

const STATUS_OPTIONS = [
  { value: "LEGAL", label: "Legal" },
  { value: "PRESCRIPTION_ONLY", label: "Prescription Only" },
  { value: "RESTRICTED", label: "Restricted" },
  { value: "BANNED", label: "Banned" },
];

const REJECTION_REASONS = [
  "Outdated source document",
  "Incorrect compound mapping",
  "AI misinterpretation",
  "Duplicate of existing regulation",
  "Source not authoritative",
  "Other",
];

export function VerificationDetailView({ item, currentRegulation }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Editable fields
  const [editedStatus, setEditedStatus] = useState(item.proposedStatus);
  const [editedDocs, setEditedDocs] = useState(item.requiredDocuments ?? "");
  const [editedQuantity, setEditedQuantity] = useState(item.quantityLimits ?? "");
  const [editedPermitAuth, setEditedPermitAuth] = useState(item.permitAuthority ?? "");
  const [editedPermitUrl, setEditedPermitUrl] = useState(item.permitApplicationUrl ?? "");
  const [editedPermitDays, setEditedPermitDays] = useState(
    item.permitLeadTimeDays?.toString() ?? ""
  );
  const [editedDosage, setEditedDosage] = useState(item.dosageThreshold ?? "");

  // Dialogs
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);

  // Reject/escalate fields
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");
  const [escalateNotes, setEscalateNotes] = useState("");

  const wasEdited = editedStatus !== item.proposedStatus ||
    editedDocs !== (item.requiredDocuments ?? "") ||
    editedQuantity !== (item.quantityLimits ?? "");

  function handleApprove() {
    startTransition(async () => {
      const edits = {
        proposedStatus: editedStatus,
        requiredDocuments: editedDocs || null,
        quantityLimits: editedQuantity || null,
        permitAuthority: editedPermitAuth || null,
        permitApplicationUrl: editedPermitUrl || null,
        permitLeadTimeDays: editedPermitDays ? parseInt(editedPermitDays) : null,
        dosageThreshold: editedDosage || null,
      };
      const res = await approveRegulation(item.id, edits);
      if (res.success) {
        toast.success("Change approved and published");
        router.push("/admin");
      } else {
        toast.error(res.error);
      }
      setApproveOpen(false);
    });
  }

  function handleReject() {
    const reason = rejectNotes
      ? `${rejectReason}: ${rejectNotes}`
      : rejectReason;
    startTransition(async () => {
      const res = await rejectChange(item.id, reason);
      if (res.success) {
        toast.success("Change rejected");
        router.push("/admin");
      } else {
        toast.error(res.error);
      }
      setRejectOpen(false);
    });
  }

  function handleEscalate() {
    startTransition(async () => {
      const res = await escalateChange(item.id, escalateNotes);
      if (res.success) {
        toast.success("Change escalated with conservative interpretation applied");
        router.push("/admin");
      } else {
        toast.error(res.error);
      }
      setEscalateOpen(false);
    });
  }

  const confStyles = {
    HIGH: "bg-emerald-100 text-emerald-800",
    MEDIUM: "bg-amber-100 text-amber-800",
    LOW: "bg-rose-100 text-rose-800",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section aria-label="Change summary">
        <div className="flex items-center gap-3 flex-wrap">
          <span aria-hidden="true" className="text-2xl">{item.countryFlag}</span>
          <h1 className="text-2xl font-bold">
            {item.compoundName} — {item.countryName}
          </h1>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${confStyles[item.aiConfidence]}`}
          >
            {item.aiConfidence} confidence
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Flagged{" "}
          {item.flaggedAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </section>

      {/* Side-by-side comparison */}
      <section aria-label="Current vs proposed comparison" className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4 space-y-3">
          <h2 className="font-semibold">Current (Live)</h2>
          {currentRegulation ? (
            <>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="outline">{currentRegulation.status}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Documents</p>
                <p className="text-sm">{currentRegulation.requiredDocuments ?? "None"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Quantity limits</p>
                <p className="text-sm">{currentRegulation.quantityLimits ?? "None"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last verified</p>
                <p className="text-sm">
                  {currentRegulation.lastVerifiedAt
                    ? new Date(currentRegulation.lastVerifiedAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No existing regulation</p>
          )}
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
          <h2 className="font-semibold">Proposed (Editable)</h2>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="edit-status">
              Status
            </label>
            <select
              id="edit-status"
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="edit-docs">
              Required documents
            </label>
            <Input
              id="edit-docs"
              value={editedDocs}
              onChange={(e) => setEditedDocs(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="edit-qty">
              Quantity limits
            </label>
            <Input
              id="edit-qty"
              value={editedQuantity}
              onChange={(e) => setEditedQuantity(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="edit-permit-auth">
              Permit authority
            </label>
            <Input
              id="edit-permit-auth"
              value={editedPermitAuth}
              onChange={(e) => setEditedPermitAuth(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="edit-permit-url">
              Permit application URL
            </label>
            <Input
              id="edit-permit-url"
              value={editedPermitUrl}
              onChange={(e) => setEditedPermitUrl(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="edit-permit-days">
              Permit lead time (days)
            </label>
            <Input
              id="edit-permit-days"
              type="number"
              value={editedPermitDays}
              onChange={(e) => setEditedPermitDays(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="edit-dosage">
              Dosage threshold
            </label>
            <Input
              id="edit-dosage"
              value={editedDosage}
              onChange={(e) => setEditedDosage(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </section>

      {/* AI extracted text */}
      <section aria-label="AI extraction">
        <h2 className="font-semibold mb-2">AI-Extracted Text</h2>
        <div className="rounded-lg border bg-muted/30 p-4 text-sm max-h-60 overflow-y-auto whitespace-pre-wrap">
          {item.aiExtractedText}
        </div>
        {item.aiTranslation && (
          <>
            <h3 className="font-medium mt-4 mb-2 text-sm">Translation</h3>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm max-h-40 overflow-y-auto whitespace-pre-wrap">
              {item.aiTranslation}
            </div>
          </>
        )}
      </section>

      {/* Source document */}
      <section aria-label="Source document">
        <h2 className="font-semibold mb-2">Source Document</h2>
        <a
          href={item.sourceDocumentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="size-4" />
          {item.sourceDocumentTitle}
        </a>
      </section>

      {/* Action buttons */}
      <section aria-label="Curator actions" className="flex flex-wrap gap-3 border-t pt-6">
        <Button
          onClick={() => setApproveOpen(true)}
          disabled={isPending}
          className="bg-emerald-600 text-white hover:bg-emerald-500"
        >
          <Check className="size-4" data-icon="inline-start" />
          Approve
        </Button>
        <Button
          onClick={() => setRejectOpen(true)}
          disabled={isPending}
          variant="destructive"
        >
          <X className="size-4" data-icon="inline-start" />
          Reject
        </Button>
        <Button
          onClick={() => setEscalateOpen(true)}
          disabled={isPending}
          className="bg-amber-500 text-amber-950 hover:bg-amber-400"
        >
          <AlertTriangle className="size-4" data-icon="inline-start" />
          Escalate
        </Button>
      </section>

      {/* Approve confirmation dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
            <DialogDescription>
              {wasEdited
                ? "You've edited the AI draft — please confirm your changes."
                : "This will publish the change to the live database."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setApproveOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isPending}
              className="bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {isPending && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
              Confirm Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Reject Change</DialogTitle>
            <DialogDescription>
              Select a reason for rejection. This is required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="block w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">Select a reason...</option>
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <textarea
              placeholder="Additional notes (optional)"
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="block w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px] resize-y"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isPending || !rejectReason}
              variant="destructive"
            >
              {isPending && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Escalate dialog */}
      <Dialog open={escalateOpen} onOpenChange={setEscalateOpen}>
        <DialogContent
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Escalate Change</DialogTitle>
            <DialogDescription>
              The most restrictive interpretation will be applied immediately.
              Notes are required (minimum 20 characters).
            </DialogDescription>
          </DialogHeader>
          <textarea
            placeholder="Describe why this needs escalation..."
            value={escalateNotes}
            onChange={(e) => setEscalateNotes(e.target.value)}
            className="block w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[100px] resize-y"
          />
          <p className="text-xs text-muted-foreground">
            {escalateNotes.length}/20 characters minimum
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEscalateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEscalate}
              disabled={isPending || escalateNotes.length < 20}
              className="bg-amber-500 text-amber-950 hover:bg-amber-400"
            >
              {isPending && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
              Confirm Escalate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

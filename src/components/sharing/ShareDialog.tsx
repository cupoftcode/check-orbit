"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RiskCard } from "./RiskCard";
import { Share2, Copy, Download, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { ComplianceResult } from "@/types/compliance";

type Props = {
  result: ComplianceResult;
  medicationSlug: string;
};

export function ShareDialog({ result, medicationSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/check/${medicationSlug}/${result.countryCode.toLowerCase()}`
      : `/check/${medicationSlug}/${result.countryCode.toLowerCase()}`;

  const imageUrl = `/api/share/risk-card?med=${medicationSlug}&country=${result.countryCode.toLowerCase()}&format=landscape`;

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast("Link copied");
    setTimeout(() => setCopied(false), 2000);
  }, [pageUrl]);

  const handleDownload = useCallback(async () => {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.medication}-${result.country}-check-orbit.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Image downloaded");
  }, [imageUrl, result.medication, result.country]);

  const handleNativeShare = useCallback(async () => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File(
        [blob],
        `${result.medication}-${result.country}-check-orbit.png`,
        { type: "image/png" }
      );

      await navigator.share({
        title: `${result.medication} is ${result.overallStatus} in ${result.country}`,
        url: pageUrl,
        files: [file],
      });
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        // Fallback: share without image
        try {
          await navigator.share({
            title: `${result.medication} is ${result.overallStatus} in ${result.country}`,
            url: pageUrl,
          });
        } catch {
          // User cancelled
        }
      }
    }
  }, [imageUrl, pageUrl, result]);

  const supportsShare =
    typeof navigator !== "undefined" && !!navigator.share;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" />
        }
      >
        <Share2 size={14} aria-hidden="true" />
        Share risk card
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share risk card</DialogTitle>
        </DialogHeader>

        <div className="mx-auto w-full max-w-xs">
          <RiskCard result={result} />
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={handleCopyLink} className="w-full justify-start gap-2">
            {copied ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              <Copy size={14} aria-hidden="true" />
            )}
            {copied ? "Copied!" : "Copy link"}
          </Button>

          <Button variant="outline" onClick={handleDownload} className="w-full justify-start gap-2">
            <Download size={14} aria-hidden="true" />
            Download image
          </Button>

          {supportsShare && (
            <Button variant="outline" onClick={handleNativeShare} className="w-full justify-start gap-2">
              <ExternalLink size={14} aria-hidden="true" />
              Share via...
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

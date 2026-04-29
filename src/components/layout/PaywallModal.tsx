"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { createCheckoutSession } from "@/actions/create-checkout";
import { toast } from "sonner";

export type PaywallFeature =
  | "multi-medication"
  | "layover-trap"
  | "unlimited-saves";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: PaywallFeature;
  returnUrl?: string;
};

const FEATURE_CONFIG: Record<
  PaywallFeature,
  { title: string; description: string; bypass: string }
> = {
  "multi-medication": {
    title: "Multi-Medication Search",
    description:
      "Check up to 10 medications at once against any destination. See compound-level conflicts across your entire medication list.",
    bypass: "Or search individually for free",
  },
  "layover-trap": {
    title: "Layover Trap Detection",
    description:
      "Discover hidden medication conflicts at transit countries. Get alternative transit hub suggestions when a layover puts your medication at risk.",
    bypass: "Or search each country individually for free",
  },
  "unlimited-saves": {
    title: "Unlimited Saved Searches",
    description:
      "Save unlimited medication-country pairs and get notified when regulations change. Never be caught off guard before a trip.",
    bypass: "Your free save slot has been used",
  },
};

const PRO_FEATURES = [
  "Multi-medication search (up to 10)",
  "Layover trap with transit conflict detection",
  "Unlimited saved searches",
  "Email notifications for regulation changes",
  "Permit deadline reminders",
];

export function PaywallModal({ open, onOpenChange, feature, returnUrl = "/" }: Props) {
  const [isPending, startTransition] = useTransition();
  const config = FEATURE_CONFIG[feature];

  function handleUpgrade() {
    startTransition(async () => {
      const res = await createCheckoutSession(returnUrl);
      if (res.success) {
        window.location.href = res.url;
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title} is a Pro feature</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm font-medium">Everything in Pro:</p>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-amber-500 shrink-0" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            {config.bypass}
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={isPending}
            className="bg-amber-500 text-amber-950 hover:bg-amber-400"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
            ) : (
              <Sparkles className="size-4" data-icon="inline-start" />
            )}
            Start Pro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

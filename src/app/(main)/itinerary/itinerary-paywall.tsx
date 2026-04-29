"use client";

import { useState } from "react";
import { PaywallModal } from "@/components/layout/PaywallModal";

export function ItineraryPaywall() {
  const [open, setOpen] = useState(true);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Itinerary Checker</h1>
        <p className="mt-1 text-muted-foreground">
          Check medication compliance across your full travel route, including
          layover countries.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <p className="text-muted-foreground">
          Itinerary checking is a Pro feature. Upgrade to discover hidden
          medication conflicts at transit stops.
        </p>
      </div>

      <PaywallModal
        open={open}
        onOpenChange={setOpen}
        feature="layover-trap"
        returnUrl="/itinerary"
      />
    </div>
  );
}

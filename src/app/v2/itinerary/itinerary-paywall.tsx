"use client";

import { useState } from "react";
import { PaywallModal } from "@/components/layout/PaywallModal";

export function V2ItineraryPaywall() {
  const [open, setOpen] = useState(true);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <p className="font-display font-bold text-[11px] tracking-[0.12em] uppercase text-brand mb-2">
          Pro Feature
        </p>
        <h1 className="font-display font-black text-[28px] tracking-tighter text-ink mb-1.5">
          Itinerary Checker
        </h1>
        <p className="text-[15px] text-ink-3 leading-[1.5]">
          Check medication compliance across your full travel route, including
          layover countries.
        </p>
      </div>

      <div className="text-center bg-cream-2 border border-rule rounded-[18px] p-8">
        <p className="text-[14px] text-ink-3">
          Itinerary checking is a Pro feature. Upgrade to discover hidden
          medication conflicts at transit stops.
        </p>
      </div>

      <PaywallModal
        open={open}
        onOpenChange={setOpen}
        feature="layover-trap"
        returnUrl="/v2/itinerary"
      />
    </main>
  );
}

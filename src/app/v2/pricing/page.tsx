import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import Button from "@/components/v2/ds/Button";

export const metadata: Metadata = {
  title: "Pricing — Check Orbit",
  description:
    "Compare Free and Pro plans. Get multi-medication search, layover trap detection, unlimited saved searches, and more.",
};

const FREE_FEATURES = [
  "Single-medication search",
  "Single-country search",
  "One saved search slot",
  "Shareable risk cards",
];

const PRO_FEATURES = [
  "Multi-medication search (up to 10)",
  "Layover trap with transit conflict detection",
  "Unlimited saved searches",
  "Email notifications for regulation changes",
  "Permit deadline reminders",
  "Alternative transit hub suggestions",
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="font-display font-bold text-[11px] tracking-[0.12em] uppercase text-brand mb-3">
          Pricing
        </p>
        <h1 className="font-display font-black text-[34px] tracking-tighter text-ink mb-3">
          Simple, transparent pricing
        </h1>
        <p className="text-[17px] text-ink-3 leading-[1.5]">
          Check any medication for free. Upgrade for advanced travel safety
          features.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Tier */}
        <div className="bg-paper border border-rule rounded-[18px] p-7 shadow-card">
          <h2 className="font-display font-extrabold text-[20px] text-ink mb-1">
            Free
          </h2>
          <p className="mb-6">
            <span className="font-display font-black text-[36px] text-ink">$0</span>
            <span className="text-[14px] text-ink-3">/mo</span>
          </p>
          <ul className="space-y-3">
            {FREE_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-[14px] text-ink-2"
              >
                <Check className="shrink-0 text-trust" size={16} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link href="/v2/sign-up" className="block">
              <Button variant="ghost" size="lg" className="w-full justify-center">
                Get started free
              </Button>
            </Link>
          </div>
        </div>

        {/* Pro Tier */}
        <div className="relative bg-paper border-2 border-premium rounded-[18px] p-7 shadow-card">
          <div className="absolute -top-3 left-4 font-display font-bold text-[11px] tracking-[0.08em] uppercase bg-premium text-white py-1 px-3 rounded-pill">
            Most Popular
          </div>
          <h2 className="font-display font-extrabold text-[20px] text-ink mb-1">
            Pro
          </h2>
          <p className="mb-6">
            <span className="font-display font-black text-[36px] text-ink">$9</span>
            <span className="text-[14px] text-ink-3">/mo</span>
          </p>
          <ul className="space-y-3">
            {PRO_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-[14px] text-ink-2"
              >
                <Sparkles className="shrink-0 text-premium" size={16} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link href="/v2/sign-up" className="block">
              <Button variant="primary" size="lg" className="w-full justify-center gap-2">
                <Sparkles size={16} />
                Start Pro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

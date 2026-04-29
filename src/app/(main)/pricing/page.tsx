import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";

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
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Simple, transparent pricing</h1>
        <p className="text-muted-foreground text-lg">
          Check any medication for free. Upgrade for advanced travel safety
          features.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <p className="text-3xl font-bold">
              $0<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card className="relative">
          <div className="absolute -top-3 left-4">
            <Badge className="bg-amber-500 text-amber-950">Most popular</Badge>
          </div>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <p className="text-3xl font-bold">
              $9<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Sparkles className="size-4 text-amber-500 shrink-0" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className={buttonVariants({
                variant: "default",
                size: "lg",
              }) + " w-full bg-amber-500 text-amber-950 hover:bg-amber-400"}
            >
              <Sparkles className="size-4" data-icon="inline-start" />
              Start Pro
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

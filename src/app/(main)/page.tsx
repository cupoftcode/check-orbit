import Link from "next/link";
import { HeroSearch } from "@/components/search/HeroSearch";
import { buttonVariants } from "@/components/ui/button";
import {
  Shield,
  Globe,
  Bell,
  MapPin,
  Search,
  FileCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Instant compliance check",
    description:
      "Search any medication and destination. Get a clear legal status in seconds — not hours of Googling.",
  },
  {
    icon: FileCheck,
    title: "Document requirements",
    description:
      "Know exactly which permits, prescriptions, and letters you need before you pack.",
  },
  {
    icon: MapPin,
    title: "Layover trap detection",
    description:
      "Your medication may be legal at your destination but banned in transit. We catch that.",
  },
  {
    icon: Bell,
    title: "Regulation change alerts",
    description:
      "Laws change. Get notified when a regulation update affects your saved medications.",
  },
  {
    icon: Globe,
    title: "Growing global coverage",
    description:
      "Verified data across dozens of countries, updated daily by AI and human curators.",
  },
  {
    icon: Shield,
    title: "Conservative by default",
    description:
      "When in doubt, we err on the side of caution. Your safety comes first.",
  },
];

const TRUST_POINTS = [
  "AI-extracted data reviewed by human curators",
  "Sources linked to official government documents",
  "Daily automated regulatory scans",
  "Conservative interpretation on ambiguous regulations",
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-500/5 via-background to-background">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center mb-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
              <Shield className="size-3" />
              Trusted by travelers worldwide
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Know before you go
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Instant, verified medication compliance answers for any
              destination. Don&apos;t risk confiscation at the border.
            </p>
          </div>
          <HeroSearch />
        </div>
      </section>

      {/* Features grid */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Everything you need to travel safely
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Check Orbit covers the full compliance workflow — from initial
              search to ongoing monitoring.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="space-y-3">
                  <div className="inline-flex items-center justify-center size-10 rounded-lg bg-brand-500/10 text-brand-500">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust / Safety */}
      <section className="border-t">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Built for accuracy,
                <br />
                designed for safety
              </h2>
              <p className="text-muted-foreground mb-6">
                Medication regulations are high-stakes. We combine AI extraction
                with human curator review to ensure every answer is sourced,
                verified, and up to date.
              </p>
              <ul className="space-y-3">
                {TRUST_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm">
                    <Shield className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border bg-muted/30 p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">Legal</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Permitted with standard documentation
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-sky-500" />
                <span className="text-sm font-medium">Prescription only</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Requires valid prescription
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-amber-500" />
                <span className="text-sm font-medium">Restricted</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Permit or advance approval needed
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-rose-500" />
                <span className="text-sm font-medium">Banned</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Not allowed under any circumstances
                </span>
              </div>
              <p className="text-xs text-muted-foreground pt-2 border-t">
                Our four-tier status system makes it clear at a glance what
                you&apos;re dealing with.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-brand-500/5">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to check your medications?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Start with a free search. Upgrade to Pro for multi-medication
            checks, layover detection, and regulation alerts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#main-content"
              className={buttonVariants({ size: "lg" }) + " bg-brand-500 text-white hover:bg-brand-500/90 h-11 px-6"}
            >
              Search now
            </Link>
            <Link
              href="/pricing"
              className={buttonVariants({ variant: "outline", size: "lg" }) + " h-11 px-6"}
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

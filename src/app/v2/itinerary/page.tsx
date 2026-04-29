import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { canAccessFeature } from "@/lib/payments/subscription";
import { ItineraryBuilder } from "@/components/itinerary/ItineraryBuilder";
import { V2ItineraryPaywall } from "./itinerary-paywall";

export const metadata = {
  title: "Itinerary Checker — Check Orbit",
  description:
    "Check your medications against every country in your travel route, including transit stops. Discover hidden layover conflicts before you fly.",
};

export default async function ItineraryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/v2/sign-in");
  }

  const hasAccess = await canAccessFeature(userId, "layover-trap");

  if (!hasAccess) {
    return <V2ItineraryPaywall />;
  }

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
          Enter your travel route to check medication compliance at every stop,
          including transit countries.
        </p>
      </div>

      <Suspense>
        <ItineraryBuilder />
      </Suspense>
    </main>
  );
}

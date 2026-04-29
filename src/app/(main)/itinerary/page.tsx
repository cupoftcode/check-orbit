import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { canAccessFeature } from "@/lib/payments/subscription";
import { ItineraryBuilder } from "@/components/itinerary/ItineraryBuilder";
import { ItineraryPaywall } from "./itinerary-paywall";

export const metadata = {
  title: "Itinerary Checker — Check Orbit",
  description:
    "Check your medications against every country in your travel route, including transit stops. Discover hidden layover conflicts before you fly.",
};

export default async function ItineraryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const hasAccess = await canAccessFeature(userId, "layover-trap");

  if (!hasAccess) {
    return <ItineraryPaywall />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Itinerary Checker</h1>
        <p className="mt-1 text-muted-foreground">
          Enter your travel route to check medication compliance at every stop,
          including transit countries.
        </p>
      </div>

      <Suspense>
        <ItineraryBuilder />
      </Suspense>
    </div>
  );
}

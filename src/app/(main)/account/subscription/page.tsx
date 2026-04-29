import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserTier } from "@/lib/payments/subscription";
import { SubscriptionManager } from "@/components/account/SubscriptionManager";

export const metadata = {
  title: "Subscription — Check Orbit",
  description: "Manage your Check Orbit subscription.",
};

export default async function SubscriptionPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const tier = await getUserTier(userId);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Subscription</h2>
      <SubscriptionManager tier={tier} />
    </section>
  );
}

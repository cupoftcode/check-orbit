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
    redirect("/v2/sign-in");
  }

  const tier = await getUserTier(userId);

  return (
    <section>
      <h2
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontWeight: 800,
          fontSize: 20,
          color: "var(--color-ink)",
          marginBottom: 16,
        }}
      >
        Subscription
      </h2>
      <SubscriptionManager tier={tier} />
    </section>
  );
}

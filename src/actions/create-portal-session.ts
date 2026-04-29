"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { stripe } from "@/lib/payments/stripe";

type Result =
  | { success: true; url: string }
  | { success: false; error: string };

export async function createPortalSession(): Promise<Result> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in." };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const stripeCustomerId = (user.privateMetadata as { stripeCustomerId?: string })
      ?.stripeCustomerId;

    if (!stripeCustomerId) {
      return { success: false, error: "No subscription found." };
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/account/subscription`,
    });

    return { success: true, url: session.url };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

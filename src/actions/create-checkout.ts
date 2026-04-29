"use server";

import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/payments/stripe";

type Result =
  | { success: true; url: string }
  | { success: false; error: string };

export async function createCheckoutSession(
  returnUrl: string
): Promise<Result> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in." };
  }

  if (!process.env.STRIPE_PRO_PRICE_ID) {
    return { success: false, error: "Pricing not configured." };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      metadata: { userId },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}${returnUrl}?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}${returnUrl}`,
    });

    if (!session.url) {
      return { success: false, error: "Failed to create checkout session." };
    }

    return { success: true, url: session.url };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

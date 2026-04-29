import type Stripe from "stripe";
import { setUserTier } from "./subscription";
import * as Sentry from "@sentry/nextjs";

/**
 * Find the Clerk userId from Stripe customer metadata or client_reference_id.
 */
function extractUserId(
  session?: Stripe.Checkout.Session | null,
  subscription?: Stripe.Subscription | null
): string | null {
  // From checkout session
  if (session?.client_reference_id) return session.client_reference_id;
  if (session?.metadata?.userId) return session.metadata.userId;

  // From subscription metadata
  if (subscription?.metadata?.userId) return subscription.metadata.userId;

  return null;
}

export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = extractUserId(session);
  if (!userId) {
    Sentry.captureMessage("Checkout completed without userId", {
      extra: { sessionId: session.id },
    });
    return;
  }
  await setUserTier(userId, "pro");
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const userId = extractUserId(null, subscription);
  if (!userId) {
    Sentry.captureMessage("Subscription updated without userId", {
      extra: { subscriptionId: subscription.id },
    });
    return;
  }

  const isActive =
    subscription.status === "active" || subscription.status === "trialing";
  await setUserTier(userId, isActive ? "pro" : "free");
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const userId = extractUserId(null, subscription);
  if (!userId) {
    Sentry.captureMessage("Subscription deleted without userId", {
      extra: { subscriptionId: subscription.id },
    });
    return;
  }
  await setUserTier(userId, "free");
}

export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  Sentry.captureMessage("Invoice payment failed", {
    level: "warning",
    extra: {
      invoiceId: invoice.id,
      customerId: invoice.customer,
    },
  });
}

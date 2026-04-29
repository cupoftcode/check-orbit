import { clerkClient } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";

export type SubscriptionTier = "free" | "pro";

export type Feature =
  | "multi-medication-search"
  | "layover-trap"
  | "unlimited-saves"
  | "email-notifications";

const PRO_FEATURES: Set<Feature> = new Set([
  "multi-medication-search",
  "layover-trap",
  "unlimited-saves",
  "email-notifications",
]);

export async function getUserTier(userId: string): Promise<SubscriptionTier> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata as { tier?: string };
    return metadata?.tier === "pro" ? "pro" : "free";
  } catch (err) {
    Sentry.captureException(err, { extra: { userId, context: "getUserTier" } });
    return "free";
  }
}

export async function isProUser(userId: string): Promise<boolean> {
  return (await getUserTier(userId)) === "pro";
}

export async function canAccessFeature(
  userId: string,
  feature: Feature
): Promise<boolean> {
  if (!PRO_FEATURES.has(feature)) return true;
  return isProUser(userId);
}

export async function setUserTier(
  userId: string,
  tier: SubscriptionTier
): Promise<void> {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { tier },
    });
  } catch (err) {
    Sentry.captureException(err, { extra: { userId, tier, context: "setUserTier" } });
    throw err;
  }
}

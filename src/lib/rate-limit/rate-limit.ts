import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { error } from "@/lib/utils/response";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/** Anonymous users: 30 requests/hour */
export const anonymousLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 h"),
  prefix: "rl:anon",
});

/** Free-tier authenticated users: 60 requests/hour */
export const freeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 h"),
  prefix: "rl:free",
});

/** Paid-tier users: 200 requests/hour */
export const paidLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(200, "1 h"),
  prefix: "rl:paid",
});

type UserTier = "anonymous" | "free" | "paid";

function getLimiterForTier(tier: UserTier) {
  switch (tier) {
    case "paid":
      return paidLimiter;
    case "free":
      return freeLimiter;
    default:
      return anonymousLimiter;
  }
}

/**
 * Apply rate limiting to an API route handler.
 * Returns a NextResponse with 429 if rate limited, or null if allowed.
 */
export async function checkRateLimit(
  ip: string
): Promise<NextResponse | null> {
  if (
    process.env.NODE_ENV === "development" ||
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }

  const { userId, sessionClaims } = await auth();

  let tier: UserTier = "anonymous";
  let identifier = ip;

  if (userId) {
    const metadata = sessionClaims?.publicMetadata as { tier?: string } | undefined;
    tier = metadata?.tier === "paid" ? "paid" : "free";
    identifier = userId;
  }

  const limiter = getLimiterForTier(tier);
  const { success, reset } = await limiter.limit(identifier);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return NextResponse.json(
      error("RATE_LIMITED", "Too many requests. Please try again later."),
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  return null;
}

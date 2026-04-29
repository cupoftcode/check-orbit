import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkRateLimit } from "@/lib/rate-limit/rate-limit";
import { itineraryCheckSchema } from "@/lib/validation/itinerary-params";
import { checkItinerary } from "@/lib/compliance/itinerary-check";
import { canAccessFeature } from "@/lib/payments/subscription";
import { success, error, ErrorCode } from "@/lib/utils/response";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const rateLimitResponse = await checkRateLimit(ip);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Auth & feature gate
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        error(
          ErrorCode.SUBSCRIPTION_REQUIRED,
          "Sign in to use the itinerary checker."
        ),
        { status: 401 }
      );
    }

    const hasAccess = await canAccessFeature(userId, "layover-trap");
    if (!hasAccess) {
      return NextResponse.json(
        error(
          ErrorCode.SUBSCRIPTION_REQUIRED,
          "Itinerary checking is a Pro feature. Upgrade to check your full travel route."
        ),
        { status: 403 }
      );
    }

    // Parse & validate body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        error("VALIDATION_ERROR", "Request body is required."),
        { status: 400 }
      );
    }

    const parsed = itineraryCheckSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      return NextResponse.json(
        error("VALIDATION_ERROR", messages.join("; ")),
        { status: 400 }
      );
    }

    const { medications, stops } = parsed.data;

    // Run itinerary check
    const result = await checkItinerary(medications, stops);

    return NextResponse.json(success(result));
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json(
      error("INTERNAL_ERROR", "Something went wrong. Please try again."),
      { status: 500 }
    );
  }
}

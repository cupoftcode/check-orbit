import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { success, error } from "@/lib/utils/response";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  countryCodes: z
    .array(z.string().length(2).toUpperCase())
    .min(1, "At least one country code is required")
    .max(20, "Too many countries"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        error("VALIDATION_ERROR", parsed.error.issues[0].message),
        { status: 400 }
      );
    }

    const { email, countryCodes } = parsed.data;

    // Verify all country codes exist and are covered
    const countries = await prisma.country.findMany({
      where: { code: { in: countryCodes }, isCovered: true },
      select: { code: true },
    });

    const validCodes = countries.map((c) => c.code);
    if (validCodes.length === 0) {
      return NextResponse.json(
        error("INVALID_COUNTRIES", "None of the provided countries are covered."),
        { status: 400 }
      );
    }

    // Upsert: merge new country codes with any existing subscription
    const existing = await prisma.destinationSubscription.findUnique({
      where: { email },
    });

    const mergedCodes = existing
      ? [...new Set([...existing.countryCodes, ...validCodes])]
      : validCodes;

    const subscription = await prisma.destinationSubscription.upsert({
      where: { email },
      update: { countryCodes: mergedCodes },
      create: { email, countryCodes: mergedCodes },
    });

    return NextResponse.json(
      success({
        subscribed: true,
        countryCodes: subscription.countryCodes,
        unsubscribeToken: subscription.unsubscribeToken,
      }),
      { status: existing ? 200 : 201 }
    );
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json(
      error("INTERNAL_ERROR", "Something went wrong. Please try again."),
      { status: 500 }
    );
  }
}

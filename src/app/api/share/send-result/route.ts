import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { ComplianceResultEmail } from "@/lib/email/templates/compliance-result";
import { success, error } from "@/lib/utils/response";
import { ComplianceStatus } from "@/types/compliance";
import type { ComplianceResult } from "@/types/compliance";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://checkorbit.com";

// --- In-memory rate limiting: 5 sends per email per hour ---
const sendCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const entry = sendCounts.get(email);

  if (!entry || now > entry.resetAt) {
    sendCounts.set(email, { count: 1, resetAt: now + 3600_000 });
    return false;
  }

  if (entry.count >= 5) {
    return true;
  }

  entry.count++;
  return false;
}

// --- Zod schema ---
const compoundSchema = z.object({
  compoundName: z.string(),
  status: z.nativeEnum(ComplianceStatus),
  dosageThreshold: z.string().nullable(),
  documentation: z.string().nullable(),
  quantityLimit: z.string().nullable(),
  permitRequirement: z.string().nullable(),
  permitLeadTimeDays: z.number().nullable(),
  permitAuthority: z.string().nullable(),
  permitApplicationUrl: z.string().nullable(),
  sourceDocument: z.string(),
  sourceUrl: z.string(),
  lastVerifiedAt: z.string(),
  freshnessStatus: z.enum(["current", "aging", "stale"]),
});

const sendResultSchema = z.object({
  email: z.string().email("Invalid email address"),
  result: z.object({
    medication: z.string(),
    country: z.string(),
    countryCode: z.string(),
    overallStatus: z.nativeEnum(ComplianceStatus),
    compounds: z.array(compoundSchema),
    disclaimer: z.string(),
    hasBiosecurityWarning: z.boolean(),
    biosecurityDetails: z.string().nullable(),
    hasProprietaryBlendWarning: z.boolean(),
  }),
  medicationSlug: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendResultSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        error("VALIDATION_ERROR", parsed.error.issues[0].message),
        { status: 400 }
      );
    }

    const { email, result, medicationSlug } = parsed.data;

    // Rate limit: 5 per email per hour
    if (isRateLimited(email)) {
      return NextResponse.json(
        error("RATE_LIMITED", "Too many emails sent. Please try again later."),
        { status: 429 }
      );
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        error("EMAIL_NOT_CONFIGURED", "Email sending is not configured."),
        { status: 503 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const resultUrl = `${BASE_URL}/check/${medicationSlug}/${result.countryCode.toLowerCase()}`;

    const html = await render(
      ComplianceResultEmail({
        result: result as ComplianceResult,
        resultUrl,
      })
    );

    const { error: sendError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Check Orbit <noreply@checkorbit.com>",
      to: email,
      subject: `${result.medication} is ${result.overallStatus.replace(/_/g, " ").toLowerCase()} in ${result.country}`,
      html,
    });

    if (sendError) {
      Sentry.captureMessage("Resend send failed", { extra: { sendError } });
      return NextResponse.json(
        error("SEND_FAILED", "Failed to send email. Please try again."),
        { status: 500 }
      );
    }

    return NextResponse.json(success({ sent: true, email }));
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json(
      error("INTERNAL_ERROR", "Something went wrong. Please try again."),
      { status: 500 }
    );
  }
}

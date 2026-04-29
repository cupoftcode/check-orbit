import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

/**
 * One-click unsubscribe handler for notification emails.
 * Supports both GET (link click) and POST (List-Unsubscribe-Post header).
 * Does not require authentication (FR23).
 */
export async function GET(req: NextRequest) {
  return handleUnsubscribe(req);
}

export async function POST(req: NextRequest) {
  return handleUnsubscribe(req);
}

async function handleUnsubscribe(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse(renderHtml("Missing token", false), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const subscription = await prisma.notificationSubscription.findUnique({
      where: { unsubscribeToken: token },
      include: {
        savedSearch: {
          select: { medicationSlug: true, countryCode: true },
        },
      },
    });

    if (!subscription) {
      return new NextResponse(
        renderHtml("Invalid or expired unsubscribe link.", false),
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    // Deactivate the subscription (don't delete — user can re-enable from settings)
    await prisma.notificationSubscription.update({
      where: { unsubscribeToken: token },
      data: {
        isActive: false,
        regulationAlerts: false,
        permitReminders: false,
      },
    });

    // Resolve display names
    const [medication, country] = await Promise.all([
      prisma.medication.findUnique({
        where: { slug: subscription.savedSearch.medicationSlug },
        select: { brandName: true },
      }),
      prisma.country.findUnique({
        where: { code: subscription.savedSearch.countryCode },
        select: { name: true },
      }),
    ]);

    const medName =
      medication?.brandName ?? subscription.savedSearch.medicationSlug;
    const countryName =
      country?.name ?? subscription.savedSearch.countryCode;

    return new NextResponse(
      renderHtml(
        `You've been unsubscribed from notifications for ${medName} + ${countryName}. You can re-enable notifications from your <a href="/account/settings" style="color: #2563eb;">account settings</a>.`,
        true
      ),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    Sentry.captureException(err);
    return new NextResponse(
      renderHtml("Something went wrong. Please try again.", false),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}

function renderHtml(message: string, isSuccess: boolean): string {
  const color = isSuccess ? "#059669" : "#dc2626";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${isSuccess ? "Unsubscribed" : "Error"} — Check Orbit</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f8fafc; }
    .card { max-width: 440px; padding: 2rem; text-align: center; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
    h1 { font-size: 1.25rem; color: ${color}; margin-bottom: .5rem; }
    p { color: #475569; font-size: .875rem; line-height: 1.6; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${isSuccess ? "Unsubscribed" : "Error"}</h1>
    <p>${message}</p>
    <p style="margin-top:1rem"><a href="/">Back to Check Orbit</a></p>
  </div>
</body>
</html>`;
}

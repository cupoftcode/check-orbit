import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { success, error } from "@/lib/utils/response";
import { checkRateLimit } from "@/lib/rate-limit/rate-limit";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const rateLimitResponse = await checkRateLimit(ip);
  if (rateLimitResponse) return rateLimitResponse;

  const searchParams = req.nextUrl.searchParams;
  const q = searchParams.get("q");

  try {
    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { code: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const countries = await prisma.country.findMany({
      where,
      select: {
        name: true,
        code: true,
        flagEmoji: true,
        isCovered: true,
        popularityRank: true,
      },
      orderBy: [{ isCovered: "desc" }, { popularityRank: "asc" }, { name: "asc" }],
      take: 20,
    });

    return NextResponse.json(success({ countries }));
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json(
      error("INTERNAL_ERROR", "Something went wrong. Please try again."),
      { status: 500 }
    );
  }
}

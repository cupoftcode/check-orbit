import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { medicationSearchSchema } from "@/lib/validation/search-params";
import { success, error } from "@/lib/utils/response";
import { checkRateLimit } from "@/lib/rate-limit/rate-limit";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const rateLimitResponse = await checkRateLimit(ip);
  if (rateLimitResponse) return rateLimitResponse;

  const searchParams = req.nextUrl.searchParams;
  const parsed = medicationSearchSchema.safeParse({
    q: searchParams.get("q"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      error("VALIDATION_ERROR", parsed.error.issues[0].message),
      { status: 400 }
    );
  }

  const { q } = parsed.data;

  try {
    // Fuzzy search: use trigram similarity via ILIKE with wildcards
    // and also search generic names and compound names
    const medications = await prisma.medication.findMany({
      where: {
        OR: [
          { brandName: { contains: q, mode: "insensitive" } },
          { genericName: { contains: q, mode: "insensitive" } },
          {
            compounds: {
              some: {
                compound: { name: { contains: q, mode: "insensitive" } },
              },
            },
          },
        ],
      },
      select: {
        brandName: true,
        genericName: true,
        slug: true,
        compounds: {
          select: {
            compound: {
              select: { name: true },
            },
          },
        },
      },
      take: 8,
      orderBy: { brandName: "asc" },
    });

    const results = medications.map((med) => ({
      brandName: med.brandName,
      genericName: med.genericName,
      slug: med.slug,
      compoundNames: med.compounds.map((mc) => mc.compound.name),
    }));

    return NextResponse.json(success({ medications: results }));
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json(
      error("INTERNAL_ERROR", "Something went wrong. Please try again."),
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { triggerRevalidation } from "@/lib/compliance/revalidation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidation-secret");

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { compoundId, countryId } = body;

  if (!compoundId || !countryId) {
    return NextResponse.json(
      { error: "compoundId and countryId are required" },
      { status: 400 }
    );
  }

  const result = await triggerRevalidation(compoundId, countryId);

  return NextResponse.json({
    revalidated: true,
    paths: result.revalidatedPaths,
  });
}

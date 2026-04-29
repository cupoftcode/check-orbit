import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

/**
 * Centralized ISR revalidation for compliance pages.
 *
 * When a regulation changes for a compound in a country, every medication
 * containing that compound needs its result page revalidated. This function
 * resolves all affected medication slugs and calls revalidatePath for each.
 *
 * Per architecture rule #9: all revalidation logic lives here — never
 * duplicated in Server Actions or API routes.
 */
export async function triggerRevalidation(
  compoundId: string,
  countryId: string
): Promise<{ revalidatedPaths: string[] }> {
  // Find all medications containing this compound
  const medicationCompounds = await prisma.medicationCompound.findMany({
    where: { compoundId },
    include: { medication: true },
  });

  // Find the country code
  const country = await prisma.country.findUnique({
    where: { id: countryId },
  });

  if (!country) {
    return { revalidatedPaths: [] };
  }

  const countryCode = country.code.toLowerCase();
  const paths: string[] = [];

  for (const mc of medicationCompounds) {
    const path = `/check/${mc.medication.slug}/${countryCode}`;
    revalidatePath(path);
    paths.push(path);
  }

  return { revalidatedPaths: paths };
}

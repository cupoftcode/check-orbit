import { prisma } from "@/lib/db/prisma";

/**
 * Given a slug that doesn't match a medication, check if it matches a
 * compound name (slugified). If so, return the canonical medication slug
 * for the first medication containing that compound.
 *
 * This enables compound-name URLs (e.g., /check/amphetamine/jp) to
 * redirect 301 to the canonical brand-name URL (/check/adderall/jp).
 */
export async function resolveCompoundToMedicationSlug(
  slug: string
): Promise<string | null> {
  // Slugify: compound names are stored as-is, so match against
  // a slugified version (lowercase, spaces → hyphens)
  const compounds = await prisma.compound.findMany({
    include: {
      medications: {
        include: {
          medication: { select: { slug: true } },
        },
        take: 1,
      },
    },
  });

  const normalized = slug.toLowerCase().replace(/-/g, " ");

  for (const compound of compounds) {
    const compoundSlug = compound.name.toLowerCase().replace(/\s+/g, " ");
    if (compoundSlug === normalized) {
      const firstMed = compound.medications[0];
      if (firstMed) return firstMed.medication.slug;
    }
  }

  return null;
}

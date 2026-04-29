import { prisma } from "@/lib/db/prisma";

export type DecomposedCompound = {
  id: string;
  name: string;
  atcCode: string | null;
  casNumber: string | null;
};

export type DecompositionResult = {
  medicationId: string;
  brandName: string;
  genericName: string | null;
  slug: string;
  proprietaryBlend: boolean;
  disclosureLevel: string;
  compounds: DecomposedCompound[];
};

/**
 * Decompose a medication (by slug) into its active compounds (FR9).
 * Returns null if the medication is not found.
 */
export async function decomposeMedication(
  slug: string
): Promise<DecompositionResult | null> {
  const medication = await prisma.medication.findUnique({
    where: { slug },
    include: {
      compounds: {
        include: {
          compound: true,
        },
      },
    },
  });

  if (!medication) return null;

  return {
    medicationId: medication.id,
    brandName: medication.brandName,
    genericName: medication.genericName,
    slug: medication.slug,
    proprietaryBlend: medication.proprietaryBlend,
    disclosureLevel: medication.disclosureLevel,
    compounds: medication.compounds.map((mc) => ({
      id: mc.compound.id,
      name: mc.compound.name,
      atcCode: mc.compound.atcCode,
      casNumber: mc.compound.casNumber,
    })),
  };
}

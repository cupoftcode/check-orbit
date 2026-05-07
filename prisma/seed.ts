import { PrismaClient, ComplianceStatus, DisclosureLevel } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Countries ---
  const countries = await Promise.all([
    prisma.country.upsert({
      where: { code: "JP" },
      update: {},
      create: { name: "Japan", code: "JP", isCovered: true, flagEmoji: "🇯🇵", popularityRank: 1 },
    }),
    prisma.country.upsert({
      where: { code: "TH" },
      update: {},
      create: { name: "Thailand", code: "TH", isCovered: true, flagEmoji: "🇹🇭", popularityRank: 2 },
    }),
    prisma.country.upsert({
      where: { code: "AU" },
      update: {},
      create: { name: "Australia", code: "AU", isCovered: true, flagEmoji: "🇦🇺", popularityRank: 3 },
    }),
    prisma.country.upsert({
      where: { code: "SG" },
      update: {},
      create: { name: "Singapore", code: "SG", isCovered: true, flagEmoji: "🇸🇬", popularityRank: 4 },
    }),
    prisma.country.upsert({
      where: { code: "AE" },
      update: {},
      create: { name: "United Arab Emirates", code: "AE", isCovered: true, flagEmoji: "🇦🇪", popularityRank: 5 },
    }),
    prisma.country.upsert({
      where: { code: "FR" },
      update: {},
      create: { name: "France", code: "FR", isCovered: true, flagEmoji: "🇫🇷", popularityRank: 6 },
    }),
    prisma.country.upsert({
      where: { code: "MX" },
      update: {},
      create: { name: "Mexico", code: "MX", isCovered: true, flagEmoji: "🇲🇽", popularityRank: 7 },
    }),
    prisma.country.upsert({
      where: { code: "GB" },
      update: {},
      create: { name: "United Kingdom", code: "GB", isCovered: true, flagEmoji: "🇬🇧", popularityRank: 8 },
    }),
    prisma.country.upsert({
      where: { code: "ID" },
      update: {},
      create: { name: "Indonesia", code: "ID", isCovered: true, flagEmoji: "🇮🇩", popularityRank: 9 },
    }),
    // Uncovered country
    prisma.country.upsert({
      where: { code: "KP" },
      update: {},
      create: { name: "North Korea", code: "KP", isCovered: false, flagEmoji: "🇰🇵", popularityRank: 99 },
    }),
  ]);

  const [japan, thailand, australia, singapore, uae, france, , , indonesia] = countries;

  // --- Compounds ---
  const amphetamine = await prisma.compound.upsert({
    where: { id: "cmp-amphetamine" },
    update: {},
    create: { id: "cmp-amphetamine", name: "Amphetamine", atcCode: "N06BA01", casNumber: "300-62-9" },
  });

  const dextroamphetamine = await prisma.compound.upsert({
    where: { id: "cmp-dextroamphetamine" },
    update: {},
    create: { id: "cmp-dextroamphetamine", name: "Dextroamphetamine", atcCode: "N06BA02", casNumber: "51-64-9" },
  });

  const diazepam = await prisma.compound.upsert({
    where: { id: "cmp-diazepam" },
    update: {},
    create: { id: "cmp-diazepam", name: "Diazepam", atcCode: "N05BA01", casNumber: "439-14-5" },
  });

  const ibuprofen = await prisma.compound.upsert({
    where: { id: "cmp-ibuprofen" },
    update: {},
    create: { id: "cmp-ibuprofen", name: "Ibuprofen", atcCode: "M01AE01", casNumber: "15687-27-1" },
  });

  const pseudoephedrine = await prisma.compound.upsert({
    where: { id: "cmp-pseudoephedrine" },
    update: {},
    create: { id: "cmp-pseudoephedrine", name: "Pseudoephedrine", atcCode: "R01BA02", casNumber: "90-82-4" },
  });

  const codeine = await prisma.compound.upsert({
    where: { id: "cmp-codeine" },
    update: {},
    create: { id: "cmp-codeine", name: "Codeine", atcCode: "R05DA04", casNumber: "76-57-3" },
  });

  const melatonin = await prisma.compound.upsert({
    where: { id: "cmp-melatonin" },
    update: {},
    create: { id: "cmp-melatonin", name: "Melatonin", atcCode: "N05CH01", casNumber: "73-31-4" },
  });

  const cbd = await prisma.compound.upsert({
    where: { id: "cmp-cbd" },
    update: {},
    create: { id: "cmp-cbd", name: "Cannabidiol (CBD)", atcCode: "N03AX24", casNumber: "13956-29-1" },
  });

  const dhea = await prisma.compound.upsert({
    where: { id: "cmp-dhea" },
    update: {},
    create: { id: "cmp-dhea", name: "DHEA (Dehydroepiandrosterone)", atcCode: null, casNumber: "53-43-0" },
  });

  const valerian = await prisma.compound.upsert({
    where: { id: "cmp-valerian" },
    update: {},
    create: { id: "cmp-valerian", name: "Valerian Root Extract", atcCode: "N05CM09", casNumber: "8057-49-6" },
  });

  // --- Medications ---
  const adderall = await prisma.medication.upsert({
    where: { slug: "adderall" },
    update: {},
    create: { id: "med-adderall", brandName: "Adderall", genericName: "Mixed Amphetamine Salts", slug: "adderall" },
  });

  const valium = await prisma.medication.upsert({
    where: { slug: "valium" },
    update: {},
    create: { id: "med-valium", brandName: "Valium", genericName: "Diazepam", slug: "valium" },
  });

  const advil = await prisma.medication.upsert({
    where: { slug: "advil" },
    update: {},
    create: { id: "med-advil", brandName: "Advil", genericName: "Ibuprofen", slug: "advil" },
  });

  const sudafed = await prisma.medication.upsert({
    where: { slug: "sudafed" },
    update: {},
    create: { id: "med-sudafed", brandName: "Sudafed", genericName: "Pseudoephedrine HCl", slug: "sudafed" },
  });

  const tylenol3 = await prisma.medication.upsert({
    where: { slug: "tylenol-3" },
    update: {},
    create: { id: "med-tylenol3", brandName: "Tylenol 3", genericName: "Acetaminophen with Codeine", slug: "tylenol-3" },
  });

  const melatoninSupplement = await prisma.medication.upsert({
    where: { slug: "melatonin" },
    update: {},
    create: { id: "med-melatonin", brandName: "Melatonin", genericName: "Melatonin", slug: "melatonin" },
  });

  const cbdOil = await prisma.medication.upsert({
    where: { slug: "cbd-oil" },
    update: {},
    create: { id: "med-cbd-oil", brandName: "CBD Oil", genericName: "Cannabidiol", slug: "cbd-oil" },
  });

  const dheaSupplement = await prisma.medication.upsert({
    where: { slug: "dhea" },
    update: {},
    create: { id: "med-dhea", brandName: "DHEA 25mg", genericName: "Dehydroepiandrosterone", slug: "dhea" },
  });

  // Supplement with proprietary blend
  const sleepBlend = await prisma.medication.upsert({
    where: { slug: "sleepwell-blend" },
    update: {},
    create: {
      id: "med-sleepblend",
      brandName: "SleepWell Herbal Blend",
      genericName: null,
      slug: "sleepwell-blend",
      proprietaryBlend: true,
      disclosureLevel: DisclosureLevel.PARTIAL,
    },
  });

  // Supplement with undisclosed blend
  await prisma.medication.upsert({
    where: { slug: "energy-max-blend" },
    update: {},
    create: {
      id: "med-energyblend",
      brandName: "Energy Max Proprietary Blend",
      genericName: null,
      slug: "energy-max-blend",
      proprietaryBlend: true,
      disclosureLevel: DisclosureLevel.UNDISCLOSED,
    },
  });

  // --- Medication-Compound Relations ---
  const relations = [
    { medicationId: adderall.id, compoundId: amphetamine.id },
    { medicationId: adderall.id, compoundId: dextroamphetamine.id },
    { medicationId: valium.id, compoundId: diazepam.id },
    { medicationId: advil.id, compoundId: ibuprofen.id },
    { medicationId: sudafed.id, compoundId: pseudoephedrine.id },
    { medicationId: tylenol3.id, compoundId: codeine.id },
    { medicationId: melatoninSupplement.id, compoundId: melatonin.id },
    { medicationId: cbdOil.id, compoundId: cbd.id },
    { medicationId: dheaSupplement.id, compoundId: dhea.id },
    { medicationId: sleepBlend.id, compoundId: melatonin.id },
    { medicationId: sleepBlend.id, compoundId: valerian.id },
  ];

  for (const rel of relations) {
    await prisma.medicationCompound.upsert({
      where: { medicationId_compoundId: rel },
      update: {},
      create: rel,
    });
  }

  // --- Regulations ---
  const now = new Date();

  const regulations = [
    // Adderall (amphetamine) — BANNED in Japan
    {
      compoundId: amphetamine.id, countryId: japan.id,
      status: ComplianceStatus.BANNED, regulatoryAuthority: "Ministry of Health, Labour and Welfare",
      sourceDocumentTitle: "Stimulants Control Act", sourceDocumentUrl: "https://www.mhlw.go.jp",
      lastVerifiedAt: now, verifiedBy: "seed",
      notes: "All amphetamines are strictly prohibited. No import permit available.",
    },
    {
      compoundId: dextroamphetamine.id, countryId: japan.id,
      status: ComplianceStatus.BANNED, regulatoryAuthority: "Ministry of Health, Labour and Welfare",
      sourceDocumentTitle: "Stimulants Control Act", sourceDocumentUrl: "https://www.mhlw.go.jp",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
    // Valium (diazepam) — PRESCRIPTION_ONLY in Japan with permit
    {
      compoundId: diazepam.id, countryId: japan.id,
      status: ComplianceStatus.PRESCRIPTION_ONLY, regulatoryAuthority: "Ministry of Health, Labour and Welfare",
      requiredDocuments: "Yakkan Shoumei (import certificate), prescription, doctor's letter",
      permitAuthority: "Regional Bureau of Health and Welfare",
      permitApplicationUrl: "https://www.mhlw.go.jp/english/policy/health-medical/pharmaceuticals/",
      permitLeadTimeDays: 14,
      quantityLimits: "Up to 1 month supply",
      sourceDocumentTitle: "Narcotics and Psychotropics Control Act", sourceDocumentUrl: "https://www.mhlw.go.jp",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
    // Ibuprofen — LEGAL almost everywhere
    {
      compoundId: ibuprofen.id, countryId: japan.id,
      status: ComplianceStatus.LEGAL, regulatoryAuthority: "Ministry of Health, Labour and Welfare",
      sourceDocumentTitle: "Pharmaceutical and Medical Device Act", sourceDocumentUrl: "https://www.mhlw.go.jp",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
    {
      compoundId: ibuprofen.id, countryId: france.id,
      status: ComplianceStatus.LEGAL, regulatoryAuthority: "ANSM",
      sourceDocumentTitle: "Code de la santé publique", sourceDocumentUrl: "https://www.ansm.sante.fr",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
    // Pseudoephedrine — RESTRICTED in Japan
    {
      compoundId: pseudoephedrine.id, countryId: japan.id,
      status: ComplianceStatus.RESTRICTED, regulatoryAuthority: "Ministry of Health, Labour and Welfare",
      quantityLimits: "Up to 2.4g total pseudoephedrine content",
      requiredDocuments: "Yakkan Shoumei for amounts exceeding OTC limit",
      sourceDocumentTitle: "Pharmaceutical and Medical Device Act", sourceDocumentUrl: "https://www.mhlw.go.jp",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
    // CBD — BANNED in UAE, BANNED in Singapore, RESTRICTED in Australia
    {
      compoundId: cbd.id, countryId: uae.id,
      status: ComplianceStatus.BANNED, regulatoryAuthority: "Ministry of Health and Prevention",
      sourceDocumentTitle: "Federal Law No. 14 of 1995", sourceDocumentUrl: "https://mohap.gov.ae",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
    {
      compoundId: cbd.id, countryId: singapore.id,
      status: ComplianceStatus.BANNED, regulatoryAuthority: "Central Narcotics Bureau",
      sourceDocumentTitle: "Misuse of Drugs Act", sourceDocumentUrl: "https://www.cnb.gov.sg",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
    {
      compoundId: cbd.id, countryId: australia.id,
      status: ComplianceStatus.PRESCRIPTION_ONLY, regulatoryAuthority: "Therapeutic Goods Administration",
      requiredDocuments: "TGA-approved prescription, import permit for Schedule 4",
      permitAuthority: "Office of Drug Control",
      permitLeadTimeDays: 21,
      sourceDocumentTitle: "Therapeutic Goods Act 1989", sourceDocumentUrl: "https://www.tga.gov.au",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
    // Multi-authority conflict example: Codeine in Australia
    // TGA says Schedule 2 (pharmacy-only low-dose) but Border Force treats as controlled import
    {
      compoundId: codeine.id, countryId: australia.id,
      status: ComplianceStatus.LEGAL, regulatoryAuthority: "Therapeutic Goods Administration",
      quantityLimits: "Low-dose OTC formulations (< 15mg per unit)",
      sourceDocumentTitle: "Poisons Standard (SUSMP)", sourceDocumentUrl: "https://www.tga.gov.au",
      lastVerifiedAt: now, verifiedBy: "seed",
      notes: "Low-dose codeine rescheduled to prescription-only in 2018 domestically, but import rules differ.",
    },
    {
      compoundId: codeine.id, countryId: australia.id,
      status: ComplianceStatus.PRESCRIPTION_ONLY, regulatoryAuthority: "Australian Border Force",
      requiredDocuments: "Prescription, doctor's letter, declaration on arrival card",
      quantityLimits: "Up to 3 months supply",
      sourceDocumentTitle: "Customs (Prohibited Imports) Regulations 1956", sourceDocumentUrl: "https://www.abf.gov.au",
      lastVerifiedAt: now, verifiedBy: "seed",
      notes: "Border Force applies PRESCRIPTION_ONLY regardless of domestic TGA scheduling.",
    },
    // Melatonin — PRESCRIPTION_ONLY in Australia, LEGAL in Thailand
    {
      compoundId: melatonin.id, countryId: australia.id,
      status: ComplianceStatus.PRESCRIPTION_ONLY, regulatoryAuthority: "Therapeutic Goods Administration",
      requiredDocuments: "Prescription required",
      sourceDocumentTitle: "Therapeutic Goods Act 1989", sourceDocumentUrl: "https://www.tga.gov.au",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
    {
      compoundId: melatonin.id, countryId: thailand.id,
      status: ComplianceStatus.LEGAL, regulatoryAuthority: "Thai Food and Drug Administration",
      sourceDocumentTitle: "Drug Act B.E. 2510", sourceDocumentUrl: "https://www.fda.moph.go.th",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
    // DHEA — BANNED in Australia (biosecurity + pharmaceutical)
    {
      compoundId: dhea.id, countryId: australia.id,
      status: ComplianceStatus.BANNED, regulatoryAuthority: "Therapeutic Goods Administration",
      biosecurityFlag: true,
      biosecurityDetails: "Classified as anabolic substance; prohibited import without specific authorization",
      sourceDocumentTitle: "Customs (Prohibited Imports) Regulations 1956", sourceDocumentUrl: "https://www.abf.gov.au",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
    // Codeine — RESTRICTED in Indonesia
    {
      compoundId: codeine.id, countryId: indonesia.id,
      status: ComplianceStatus.RESTRICTED, regulatoryAuthority: "BPOM (National Agency of Drug and Food Control)",
      requiredDocuments: "Doctor's letter, prescription, maximum 7-day supply declaration",
      quantityLimits: "7-day supply",
      sourceDocumentTitle: "Government Regulation No. 44/2010", sourceDocumentUrl: "https://www.pom.go.id",
      lastVerifiedAt: now, verifiedBy: "seed",
    },
  ];

  for (const reg of regulations) {
    await prisma.regulation.upsert({
      where: {
        compoundId_countryId_regulatoryAuthority: {
          compoundId: reg.compoundId,
          countryId: reg.countryId,
          regulatoryAuthority: reg.regulatoryAuthority,
        },
      },
      update: {},
      create: reg,
    });
  }

  console.log("Seed complete.");
  console.log(`  Countries: ${countries.length}`);
  console.log(`  Medications: 10`);
  console.log(`  Compounds: 10`);
  console.log(`  Regulations: ${regulations.length}`);
  console.log(`  Multi-authority conflict: Codeine in Australia (TGA vs Border Force)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

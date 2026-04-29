import Database from "better-sqlite3";
import { PrismaClient, ComplianceStatus } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import path from "path";

const INCB_DB_PATH = path.resolve(__dirname, "../../database/incb.db");

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// --- INCB 3-letter code → ISO alpha-2 ---

const INCB_TO_ISO: Record<string, string> = {
  ALG: "DZ", ARG: "AR", ARM: "AM", ASC: "AC", AUL: "AU",
  AUS: "AT", AZE: "AZ", BAH: "BS", BAR: "BB", BEL: "BE",
  BEN: "BJ", BHA: "BH", BHU: "BT", BIH: "BA", BKF: "BF",
  BRA: "BR", BRU: "BN", BUL: "BG", BVI: "VG", BYE: "BY",
  BZE: "BZ", CAN: "CA", CHD: "TD", CHI: "CL", COL: "CO",
  COS: "CR", CPR: "CN", CRO: "HR", CVI: "CV", CYP: "CY",
  CZE: "CZ", DEN: "DK", DMI: "DM", ECU: "EC", ELS: "SV",
  EST: "EE", ETH: "ET", FIN: "FI", FPL: "PF", FRA: "FR",
  GEO: "GE", GER: "DE", GHA: "GH", HAI: "HT", HOK: "HK",
  HUN: "HU", ICE: "IS", IRA: "IR", IRE: "IE", ISR: "IL",
  ITA: "IT", JOR: "JO", JPN: "JP", KAZ: "KZ", KEN: "KE",
  KUW: "KW", KYR: "KG", LAO: "LA", LAT: "LV", LEB: "LB",
  LIT: "LT", LUX: "LU", MAC: "MO", MAL: "MY", MAT: "MR",
  MEX: "MX", MIC: "FM", MNE: "ME", MOL: "MD", MOR: "MA",
  MOT: "MU", MYA: "MM", NAM: "NA", NCA: "NC", NET: "NL",
  NIC: "NI", NOR: "NO", NZE: "NZ", OMA: "OM", PAN: "PA",
  PER: "PE", POL: "PL", POR: "PT", QAT: "QA", ROK: "KR",
  RUS: "RU", SAF: "ZA", SAU: "SA", SEY: "SC", SIN: "SG",
  SLO: "SK", SPA: "ES", SRL: "LK", STL: "LC", SVN: "SI",
  SWE: "SE", SWI: "CH", TAJ: "TJ", THA: "TH", TLE: "TL",
  TOG: "TG", TRC: "TC", TTR: "TT", TUN: "TN", TUR: "TR",
  UAE: "AE", UGA: "UG", UK: "GB", UKR: "UA", URT: "TZ",
  USA: "US", UZB: "UZ", VEN: "VE", YEM: "YE", ZIM: "ZW",
};

const TRAVELLER_RELEVANT_DRUGS = new Set([
  "CODEINE", "HYDROCODONE", "PETHIDINE", "METHADONE", "MORPHINE",
  "OXYCODONE", "FENTANYL", "PHOLCODINE", "DIHYDROCODEINE",
  "ETHYLMORPHINE", "HYDROMORPHONE", "TILIDINE", "DIPHENOXYLATE",
  "DEXTROPROPOXYPHENE", "OPIUM",
]);

const DRUG_NAME_FIXES: Record<string, string> = {
  "CODEIN": "CODEINE",
  "OXYCODON E": "OXYCODONE",
  "CANNABIS EXTRACTS": "CANNABIS",
};

const DOC_TYPE_LABELS: Record<string, string> = {
  a: "Medical prescription",
  b: "Schengen certificate",
  c: "Import/export authorization",
  d: "Customs declaration",
  e: "Additional requirements",
};

// Match prohibited substance names to INCB drug names
const PROHIBITED_TO_DRUG: Record<string, string | null> = {
  "Heroin": "HEROIN",
  "Opium powder": "OPIUM",
  "Cannabis": "CANNABIS",
  "Methamphetamine": null,
  "Amphetamine": null,
  "Dexamphetamine": null,
  "Stimulant raw materials (ephedrine, pseudoephedrine)": null,
  "Abortifacients (mifepristone - RU486)": null,
  "Yohimbe (Yohimbine)": null,
  "Aminophenazone": null,
  "Amidopyrine": null,
  "Aminopyrine": null,
  "Dipyrone": null,
  "Metamizole": null,
  "Amygdalin/laetrile": null,
};

// --- Helpers ---

function flagEmoji(isoCode: string): string {
  return String.fromCodePoint(
    ...isoCode.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

function parseFormDate(dateStr: string | null): Date {
  if (!dateStr) return new Date("2024-01-01");
  // "15/01/2025" format
  const dmy = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) return new Date(`${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`);
  // "02 April 2024" format
  const mdy = dateStr.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/);
  if (mdy) return new Date(`${mdy[2]} ${mdy[1]}, ${mdy[3]}`);
  // Year-only "2024"
  const year = dateStr.match(/^(\d{4})$/);
  if (year) return new Date(`${year[1]}-01-01`);
  return new Date("2024-01-01");
}

function cleanDrugName(raw: string): string | null {
  if (DRUG_NAME_FIXES[raw]) return DRUG_NAME_FIXES[raw];
  // Skip entries with arrows (parsing artifacts)
  if (raw.includes("→") || raw.includes("->")) return null;
  // Skip single-word fragments
  if (raw.startsWith("ALPHA -") || raw.startsWith("BETA -") || raw === "MORAMIDE") return null;
  // Skip entries that look like "DRUGNAME  TradeName" (multi-drug parsing artifacts)
  if (/^[A-Z]+\s{2,}/.test(raw)) return null;
  // Skip lowercase entries (misplaced trade names)
  if (/^[a-z]/.test(raw)) return null;
  // Skip "XP" etc
  if (raw.length <= 2) return null;
  return raw.trim();
}

// --- SQLite row types ---

interface SqliteCountry {
  country_code: string;
  country_name: string;
  form_date: string | null;
  pdf_filename: string;
}

interface SqliteDrug {
  ids_code: string;
  cas_number: string | null;
  drug_name: string;
  chemical_name: string | null;
  is_cps: number;
}

interface SqliteTradeName {
  id: number;
  trade_name: string;
  drug_name: string;
}

interface SqliteRestriction {
  id: number;
  country_code: string;
  substance_type: string;
  days_limit: string | null;
  quantities: string | null;
  notes: string | null;
}

interface SqliteProhibited {
  id: number;
  country_code: string;
  substance_name: string;
}

interface SqliteAuthority {
  country_code: string;
  authority_name: string | null;
  address: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  website: string | null;
  other_info: string | null;
}

interface SqliteDoc {
  country_code: string;
  doc_type: string;
  required: number;
  description: string | null;
}

// --- Main ---

async function main() {
  const db = new Database(INCB_DB_PATH, { readonly: true });
  const warnings: string[] = [];

  // =====================
  // Phase 1: Countries
  // =====================
  console.log("Phase 1: Importing countries...");

  const sqliteCountries = db.prepare("SELECT * FROM countries").all() as SqliteCountry[];
  const authorities = db.prepare("SELECT * FROM country_authority").all() as SqliteAuthority[];
  const authorityMap = new Map(authorities.map((a) => [a.country_code, a]));

  const countryIdMap = new Map<string, string>(); // incbCode → prisma id

  for (const c of sqliteCountries) {
    const isoCode = INCB_TO_ISO[c.country_code];
    if (!isoCode) {
      warnings.push(`Unknown INCB code: ${c.country_code} (${c.country_name})`);
      continue;
    }

    const country = await prisma.country.upsert({
      where: { code: isoCode },
      update: {},
      create: {
        name: c.country_name,
        code: isoCode,
        isCovered: false,
        flagEmoji: flagEmoji(isoCode),
        popularityRank: 0,
      },
    });
    countryIdMap.set(c.country_code, country.id);
  }

  console.log(`  Countries: ${countryIdMap.size} upserted, ${warnings.length} skipped`);

  // Track which countries get regulations — we'll mark them isCovered at the end
  const countriesWithRegulations = new Set<string>();

  // =====================
  // Phase 2: Compounds
  // =====================
  console.log("Phase 2: Importing compounds...");

  const existingCompounds = await prisma.compound.findMany();
  const compoundByCas = new Map<string, string>();
  const compoundByName = new Map<string, string>();
  for (const c of existingCompounds) {
    if (c.casNumber) compoundByCas.set(c.casNumber, c.id);
    compoundByName.set(c.name.toUpperCase(), c.id);
  }

  const sqliteDrugs = db.prepare("SELECT * FROM narcotic_drugs WHERE is_cps = 0").all() as SqliteDrug[];
  const compoundIdMap = new Map<string, string>(); // idsCode → prisma id
  const drugNameToId = new Map<string, string>(); // drug_name → prisma id
  let compoundsCreated = 0;

  for (const drug of sqliteDrugs) {
    let existingId = drug.cas_number ? compoundByCas.get(drug.cas_number) : undefined;
    if (!existingId) existingId = compoundByName.get(drug.drug_name.toUpperCase());

    if (existingId) {
      compoundIdMap.set(drug.ids_code, existingId);
      drugNameToId.set(drug.drug_name, existingId);
      continue;
    }

    const compound = await prisma.compound.create({
      data: {
        name: drug.drug_name,
        casNumber: drug.cas_number,
      },
    });

    compoundIdMap.set(drug.ids_code, compound.id);
    drugNameToId.set(drug.drug_name, compound.id);
    if (drug.cas_number) compoundByCas.set(drug.cas_number, compound.id);
    compoundByName.set(drug.drug_name.toUpperCase(), compound.id);
    compoundsCreated++;
  }

  console.log(`  Compounds: ${compoundIdMap.size} mapped (${compoundsCreated} new)`);

  // =====================
  // Phase 3: Medications + MedicationCompounds
  // =====================
  console.log("Phase 3: Importing medications from trade names...");

  const sqliteTradeNames = db.prepare("SELECT * FROM trade_names").all() as SqliteTradeName[];

  const existingSlugs = new Set(
    (await prisma.medication.findMany({ select: { slug: true } })).map((m) => m.slug)
  );

  const medsToCreate: Array<{ brandName: string; genericName: string; slug: string }> = [];
  const medCompoundLinks: Array<{ slug: string; compoundId: string }> = [];
  const slugSet = new Set(existingSlugs);

  for (const tn of sqliteTradeNames) {
    const cleaned = cleanDrugName(tn.drug_name);
    if (!cleaned) continue;

    const compoundId = drugNameToId.get(cleaned);
    if (!compoundId) {
      // Try case-insensitive match
      const upper = cleaned.toUpperCase();
      const matchedId = compoundByName.get(upper);
      if (!matchedId) continue;
      // found via case-insensitive
      let slug = toSlug(tn.trade_name);
      if (slugSet.has(slug)) slug = `${slug}-${toSlug(cleaned)}`;
      if (slugSet.has(slug)) continue;
      slugSet.add(slug);
      medsToCreate.push({
        brandName: tn.trade_name,
        genericName: cleaned,
        slug,
      });
      medCompoundLinks.push({ slug, compoundId: matchedId });
      continue;
    }

    let slug = toSlug(tn.trade_name);
    if (slugSet.has(slug)) slug = `${slug}-${toSlug(cleaned)}`;
    if (slugSet.has(slug)) continue;
    slugSet.add(slug);

    medsToCreate.push({
      brandName: tn.trade_name,
      genericName: cleaned,
      slug,
    });
    medCompoundLinks.push({ slug, compoundId });
  }

  // Batch create medications
  const CHUNK = 50;
  for (let i = 0; i < medsToCreate.length; i += CHUNK) {
    const chunk = medsToCreate.slice(i, i + CHUNK);
    await prisma.medication.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  console.log(`  Medications: ${medsToCreate.length} created`);

  // Link medications to compounds
  const allMeds = await prisma.medication.findMany({ select: { id: true, slug: true } });
  const slugToMedId = new Map(allMeds.map((m) => [m.slug, m.id]));

  const linksToCreate = medCompoundLinks
    .map((l) => ({
      medicationId: slugToMedId.get(l.slug)!,
      compoundId: l.compoundId,
    }))
    .filter((l) => l.medicationId);

  for (let i = 0; i < linksToCreate.length; i += CHUNK) {
    const chunk = linksToCreate.slice(i, i + CHUNK);
    await prisma.medicationCompound.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  console.log(`  MedicationCompounds: ${linksToCreate.length} linked`);

  // =====================
  // Phase 4: Regulations
  // =====================
  console.log("Phase 4: Deriving regulations...");

  // Load supporting data
  const restrictions = db.prepare(
    "SELECT * FROM country_restrictions WHERE substance_type = 'narcotic'"
  ).all() as SqliteRestriction[];
  const restrictionMap = new Map(restrictions.map((r) => [r.country_code, r]));

  const docs = db.prepare("SELECT * FROM country_documentation WHERE required = 1").all() as SqliteDoc[];
  const docsByCountry = new Map<string, SqliteDoc[]>();
  for (const d of docs) {
    const arr = docsByCountry.get(d.country_code) ?? [];
    arr.push(d);
    docsByCountry.set(d.country_code, arr);
  }

  const prohibited = db.prepare("SELECT * FROM country_prohibited_substances").all() as SqliteProhibited[];

  const countryDates = new Map(sqliteCountries.map((c) => [c.country_code, c.form_date]));

  function buildRequiredDocs(incbCode: string): string | null {
    const countryDocs = docsByCountry.get(incbCode);
    if (!countryDocs || countryDocs.length === 0) return null;
    const parts: string[] = [];
    for (const d of countryDocs) {
      const label = DOC_TYPE_LABELS[d.doc_type] ?? d.doc_type;
      if (d.description) {
        parts.push(`${label}: ${d.description}`);
      } else {
        parts.push(label);
      }
    }
    return parts.join("; ");
  }

  function getAuthority(incbCode: string): string {
    return authorityMap.get(incbCode)?.authority_name ?? "National Competent Authority";
  }

  function buildQuantityLimits(r: SqliteRestriction): string | null {
    const parts: string[] = [];
    if (r.days_limit) parts.push(`${r.days_limit} days supply`);
    if (r.quantities) parts.push(r.quantities);
    if (r.notes) parts.push(r.notes);
    return parts.length > 0 ? parts.join("; ") : null;
  }

  let regulationsCreated = 0;

  // Phase 4a: BANNED — from prohibited substances
  for (const p of prohibited) {
    const drugName = PROHIBITED_TO_DRUG[p.substance_name];
    if (drugName === undefined) {
      warnings.push(`Unknown prohibited substance: "${p.substance_name}" in ${p.country_code}`);
      continue;
    }
    if (drugName === null) continue; // known non-narcotic, skip silently

    const compoundId = drugNameToId.get(drugName);
    if (!compoundId) continue;

    const countryId = countryIdMap.get(p.country_code);
    if (!countryId) continue;

    const authority = getAuthority(p.country_code);
    try {
      await prisma.regulation.upsert({
        where: {
          compoundId_countryId_regulatoryAuthority: {
            compoundId,
            countryId,
            regulatoryAuthority: authority,
          },
        },
        update: {},
        create: {
          compoundId,
          countryId,
          status: ComplianceStatus.BANNED,
          regulatoryAuthority: authority,
          requiredDocuments: buildRequiredDocs(p.country_code),
          sourceDocumentTitle: `INCB Country Report: ${p.country_code}`,
          sourceDocumentUrl: "https://www.incb.org/incb/en/travellers/country-regulations.html",
          lastVerifiedAt: parseFormDate(countryDates.get(p.country_code) ?? null),
          verifiedBy: "incb-import",
          notes: `Prohibited substance: ${p.substance_name}`,
        },
      });
      countriesWithRegulations.add(countryId);
      regulationsCreated++;
    } catch {
      // Duplicate or constraint error — skip
    }
  }

  console.log(`  BANNED regulations: ${regulationsCreated}`);
  const bannedCount = regulationsCreated;

  // Phase 4b: RESTRICTED — countries with narcotic restrictions × traveller-relevant drugs
  let restrictedCount = 0;
  for (const [incbCode, restriction] of restrictionMap) {
    const countryId = countryIdMap.get(incbCode);
    if (!countryId) continue;

    const authority = getAuthority(incbCode);
    const quantityLimits = buildQuantityLimits(restriction);
    const requiredDocs = buildRequiredDocs(incbCode);
    const verifiedAt = parseFormDate(countryDates.get(incbCode) ?? null);

    for (const drugName of TRAVELLER_RELEVANT_DRUGS) {
      const compoundId = drugNameToId.get(drugName);
      if (!compoundId) continue;

      try {
        await prisma.regulation.upsert({
          where: {
            compoundId_countryId_regulatoryAuthority: {
              compoundId,
              countryId,
              regulatoryAuthority: authority,
            },
          },
          update: {},
          create: {
            compoundId,
            countryId,
            status: ComplianceStatus.RESTRICTED,
            regulatoryAuthority: authority,
            quantityLimits,
            requiredDocuments: requiredDocs,
            sourceDocumentTitle: `INCB Country Report: ${incbCode}`,
            sourceDocumentUrl: "https://www.incb.org/incb/en/travellers/country-regulations.html",
            lastVerifiedAt: verifiedAt,
            verifiedBy: "incb-import",
          },
        });
        countriesWithRegulations.add(countryId);
        restrictedCount++;
      } catch {
        // Skip duplicates
      }
    }
  }

  console.log(`  RESTRICTED regulations: ${restrictedCount}`);

  // Phase 4c: PRESCRIPTION_ONLY — countries with doc_type 'a' required, for traveller-relevant drugs not already covered
  let prescriptionCount = 0;
  for (const [incbCode, countryDocs] of docsByCountry) {
    const hasPrescriptionReq = countryDocs.some((d) => d.doc_type === "a" && d.required === 1);
    if (!hasPrescriptionReq) continue;
    if (restrictionMap.has(incbCode)) continue; // already handled as RESTRICTED

    const countryId = countryIdMap.get(incbCode);
    if (!countryId) continue;

    const authority = getAuthority(incbCode);
    const requiredDocs = buildRequiredDocs(incbCode);
    const verifiedAt = parseFormDate(countryDates.get(incbCode) ?? null);

    for (const drugName of TRAVELLER_RELEVANT_DRUGS) {
      const compoundId = drugNameToId.get(drugName);
      if (!compoundId) continue;

      try {
        await prisma.regulation.upsert({
          where: {
            compoundId_countryId_regulatoryAuthority: {
              compoundId,
              countryId,
              regulatoryAuthority: authority,
            },
          },
          update: {},
          create: {
            compoundId,
            countryId,
            status: ComplianceStatus.PRESCRIPTION_ONLY,
            regulatoryAuthority: authority,
            requiredDocuments: requiredDocs,
            sourceDocumentTitle: `INCB Country Report: ${incbCode}`,
            sourceDocumentUrl: "https://www.incb.org/incb/en/travellers/country-regulations.html",
            lastVerifiedAt: verifiedAt,
            verifiedBy: "incb-import",
          },
        });
        countriesWithRegulations.add(countryId);
        prescriptionCount++;
      } catch {
        // Skip duplicates
      }
    }
  }

  console.log(`  PRESCRIPTION_ONLY regulations: ${prescriptionCount}`);

  // =====================
  // Phase 5: Mark countries with regulations as covered
  // =====================
  console.log("Phase 5: Updating country coverage...");

  let coveredCount = 0;
  for (const countryId of countriesWithRegulations) {
    await prisma.country.update({
      where: { id: countryId },
      data: { isCovered: true },
    });
    coveredCount++;
  }

  console.log(`  Countries marked as covered: ${coveredCount}`);

  // =====================
  // Summary
  // =====================
  const totalRegs = bannedCount + restrictedCount + prescriptionCount;
  console.log("\n--- Import Summary ---");
  console.log(`  Countries:            ${countryIdMap.size}`);
  console.log(`  Compounds:            ${compoundIdMap.size} (${compoundsCreated} new)`);
  console.log(`  Medications:          ${medsToCreate.length}`);
  console.log(`  MedicationCompounds:  ${linksToCreate.length}`);
  console.log(`  Regulations:          ${totalRegs} (${bannedCount} banned, ${restrictedCount} restricted, ${prescriptionCount} prescription)`);

  if (warnings.length > 0) {
    console.log(`\n  Warnings (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`    - ${w}`);
    }
  }

  console.log("\nINCB import complete.");
  db.close();
}

main()
  .catch((e) => {
    console.error("INCB import failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

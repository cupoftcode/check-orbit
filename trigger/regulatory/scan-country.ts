import { task } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/db/prisma";
import { extractRegulations } from "./extract-regulations";
import type { ExtractionResult } from "./extract-regulations";
import * as Sentry from "@sentry/nextjs";

type CountrySource = {
  url: string;
  title: string;
  language: string;
};

/**
 * Known government regulatory publication sources per country.
 * Curators can extend this registry as new sources are identified.
 */
const COUNTRY_SOURCES: Record<string, CountrySource[]> = {
  US: [
    {
      url: "https://www.deadiversion.usdoj.gov/schedules/",
      title: "DEA Controlled Substances Schedules",
      language: "en",
    },
    {
      url: "https://www.fda.gov/drugs/drug-safety-and-availability",
      title: "FDA Drug Safety Announcements",
      language: "en",
    },
  ],
  GB: [
    {
      url: "https://www.gov.uk/government/publications/controlled-drugs-list",
      title: "UK Home Office Controlled Drugs List",
      language: "en",
    },
  ],
  JP: [
    {
      url: "https://www.mhlw.go.jp/english/policy/health-medical/pharmaceuticals/",
      title: "Japan MHLW Pharmaceutical Regulations",
      language: "en",
    },
  ],
  SG: [
    {
      url: "https://www.hsa.gov.sg/therapeutic-products/register",
      title: "Singapore HSA Therapeutic Products",
      language: "en",
    },
  ],
  AE: [
    {
      url: "https://mohap.gov.ae/en/services/issue-permit-to-import-medicines",
      title: "UAE MOHAP Controlled Medicine Import",
      language: "en",
    },
  ],
  // Additional countries added by curators via admin interface
};

export type ScanCountryResult = {
  countryCode: string;
  countryName: string;
  sourcesScanned: number;
  extractionsCompleted: number;
  errors: string[];
  extractions: ExtractionResult[];
};

/**
 * Scan a single country's regulatory publications for changes.
 * Fetches and extracts text from known government sources.
 */
export const scanCountry = task({
  id: "scan-country",
  retry: { maxAttempts: 2 },
  run: async (payload: {
    countryCode: string;
  }): Promise<ScanCountryResult> => {
    const { countryCode } = payload;

    const country = await prisma.country.findUnique({
      where: { code: countryCode.toUpperCase() },
    });

    if (!country || !country.isCovered) {
      return {
        countryCode,
        countryName: country?.name ?? countryCode,
        sourcesScanned: 0,
        extractionsCompleted: 0,
        errors: [`Country ${countryCode} not found or not covered`],
        extractions: [],
      };
    }

    const sources = COUNTRY_SOURCES[countryCode.toUpperCase()] ?? [];
    const errors: string[] = [];
    const extractions: ExtractionResult[] = [];

    for (const source of sources) {
      try {
        const result = await extractRegulations.triggerAndWait({
          sourceUrl: source.url,
          sourceTitle: source.title,
          countryCode,
          language: source.language,
        });

        if (result.ok) {
          extractions.push(result.output);
        } else {
          errors.push(`Extraction failed for ${source.title}: task error`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        errors.push(`Extraction failed for ${source.title}: ${message}`);
        Sentry.captureException(err, {
          extra: {
            countryCode,
            sourceUrl: source.url,
            context: "scan-country",
          },
        });
      }
    }

    return {
      countryCode,
      countryName: country.name,
      sourcesScanned: sources.length,
      extractionsCompleted: extractions.length,
      errors,
      extractions,
    };
  },
});

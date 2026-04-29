import { schedules, task } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/db/prisma";
import { scanCountry } from "./scan-country";
import type { ScanCountryResult } from "./scan-country";
import * as Sentry from "@sentry/nextjs";

type ScanAllResult = {
  countriesScanned: number;
  totalExtractions: number;
  totalErrors: number;
  results: ScanCountryResult[];
};

/**
 * Manual trigger: scan all covered countries.
 * Fan-out to scan-country for each, handles partial failures gracefully.
 */
export const scanAllCountries = task({
  id: "scan-all-countries",
  run: async (_payload: Record<string, never>): Promise<ScanAllResult> => {
    const countries = await prisma.country.findMany({
      where: { isCovered: true },
      select: { code: true },
    });

    const results: ScanCountryResult[] = [];
    let totalExtractions = 0;
    let totalErrors = 0;

    // Fan out — process countries in parallel batches of 10
    const BATCH_SIZE = 10;
    for (let i = 0; i < countries.length; i += BATCH_SIZE) {
      const batch = countries.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.allSettled(
        batch.map(async (country) => {
          const result = await scanCountry.triggerAndWait({
            countryCode: country.code,
          });

          if (result.ok) {
            return result.output;
          }
          throw new Error(`Scan failed for ${country.code}`);
        })
      );

      for (const settled of batchResults) {
        if (settled.status === "fulfilled") {
          const r = settled.value;
          results.push(r);
          totalExtractions += r.extractionsCompleted;
          totalErrors += r.errors.length;
        } else {
          totalErrors++;
          Sentry.captureMessage(`Country scan batch failure: ${settled.reason}`, {
            level: "error",
            extra: { context: "scan-all-countries" },
          });
        }
      }
    }

    // Log aggregate status
    Sentry.captureMessage(
      `Regulatory scan complete: ${results.length}/${countries.length} countries, ${totalExtractions} extractions, ${totalErrors} errors`,
      {
        level: "info",
        extra: {
          countriesScanned: results.length,
          totalExtractions,
          totalErrors,
        },
      }
    );

    return {
      countriesScanned: results.length,
      totalExtractions,
      totalErrors,
      results,
    };
  },
});

/**
 * Daily scheduled cron job for regulatory scanning.
 * Runs once per day and fans out to all covered countries.
 */
export const dailyRegulatoryScan = schedules.task({
  id: "daily-regulatory-scan",
  run: async () => {
    const result = await scanAllCountries.triggerAndWait({});

    if (result.ok) {
      return result.output;
    }

    Sentry.captureMessage("Daily regulatory scan failed", {
      level: "error",
    });

    return {
      countriesScanned: 0,
      totalExtractions: 0,
      totalErrors: 1,
      results: [],
    };
  },
});

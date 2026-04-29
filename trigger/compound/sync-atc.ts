import { task } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/db/prisma";
import * as Sentry from "@sentry/nextjs";

/**
 * Sync compound data with WHO ATC classification system.
 * Updates ATC codes for compounds that don't have them yet.
 * Uses the WHO ATC/DDD Index API.
 */
export const syncAtc = task({
  id: "sync-atc",
  retry: { maxAttempts: 2 },
  run: async () => {
    const compounds = await prisma.compound.findMany({
      where: {
        OR: [{ atcCode: null }, { atcCode: "" }],
      },
      take: 50,
    });

    let updated = 0;

    for (const compound of compounds) {
      try {
        // Search ATC by compound name
        const res = await fetch(
          `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(compound.name)}&search=2`
        );

        if (!res.ok) continue;

        const data = await res.json();
        const rxcui = data.idGroup?.rxnormId?.[0];
        if (!rxcui) continue;

        // Get ATC code via RxNorm → ATC mapping
        const atcRes = await fetch(
          `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/allProperties.json?prop=codes`
        );

        if (!atcRes.ok) continue;

        const atcData = await atcRes.json();
        const props = atcData.propConceptGroup?.propConcept ?? [];
        const atcEntry = props.find(
          (p: { propName: string }) => p.propName === "ATC"
        );

        if (atcEntry?.propValue) {
          await prisma.compound.update({
            where: { id: compound.id },
            data: { atcCode: atcEntry.propValue },
          });
          updated++;
        }
      } catch (err) {
        Sentry.captureException(err, {
          extra: { compoundId: compound.id, compoundName: compound.name },
        });
      }
    }

    return { checked: compounds.length, updated };
  },
});

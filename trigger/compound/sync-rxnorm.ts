import { task } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/db/prisma";
import * as Sentry from "@sentry/nextjs";

/**
 * Sync compound data with RxNorm API for identity validation.
 * Periodically updates CAS numbers and validates compound names
 * against the NLM RxNorm database.
 */
export const syncRxnorm = task({
  id: "sync-rxnorm",
  retry: { maxAttempts: 2 },
  run: async () => {
    const compounds = await prisma.compound.findMany({
      where: {
        OR: [{ casNumber: null }, { casNumber: "" }],
      },
      take: 50,
    });

    let updated = 0;

    for (const compound of compounds) {
      try {
        const res = await fetch(
          `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(compound.name)}&search=2`
        );

        if (!res.ok) continue;

        const data = await res.json();
        const rxcui = data.idGroup?.rxnormId?.[0];
        if (!rxcui) continue;

        // Fetch properties for CAS number
        const propsRes = await fetch(
          `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/allProperties.json?prop=codes`
        );

        if (!propsRes.ok) continue;

        const propsData = await propsRes.json();
        const props = propsData.propConceptGroup?.propConcept ?? [];
        const casEntry = props.find(
          (p: { propName: string }) => p.propName === "CAS_REGISTRY_NUMBER"
        );

        if (casEntry?.propValue) {
          await prisma.compound.update({
            where: { id: compound.id },
            data: { casNumber: casEntry.propValue },
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

import { task } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/db/prisma";
import type { AiConfidence } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

type ExtractedChange = {
  compoundName: string;
  proposedStatus: "LEGAL" | "PRESCRIPTION_ONLY" | "RESTRICTED" | "BANNED";
  requiredDocuments: string | null;
  quantityLimits: string | null;
  permitAuthority: string | null;
  permitApplicationUrl: string | null;
  permitLeadTimeDays: number | null;
  dosageThreshold: string | null;
  biosecurityFlag: boolean;
  biosecurityDetails: string | null;
  regulatoryAuthority: string | null;
};

type StructuredExtraction = {
  changes: ExtractedChange[];
  confidence: AiConfidence;
  confidenceFactors: {
    sourceReliability: string;
    extractionClarity: string;
    translationConfidence: string;
    patternAlignment: string;
  };
};

/**
 * Use Claude API to transform raw regulatory text into structured
 * compound-level changes, then map to existing compounds and write
 * to the StagingRegulation table.
 */
export const mapMedication = task({
  id: "map-medication",
  retry: { maxAttempts: 2 },
  run: async (payload: {
    extractedText: string;
    translation: string | null;
    sourceUrl: string;
    sourceTitle: string;
    countryCode: string;
  }) => {
    const {
      extractedText,
      translation,
      sourceUrl,
      sourceTitle,
      countryCode,
    } = payload;

    const country = await prisma.country.findUnique({
      where: { code: countryCode.toUpperCase() },
    });
    if (!country) {
      return { staged: 0, error: "Country not found" };
    }

    // Use Claude to extract structured changes
    const textToAnalyze = translation ?? extractedText;
    const structured = await extractStructuredChanges(textToAnalyze);

    if (!structured || structured.changes.length === 0) {
      return { staged: 0, message: "No regulatory changes detected" };
    }

    let staged = 0;

    for (const change of structured.changes) {
      try {
        // Find matching compound by name
        const compound = await prisma.compound.findFirst({
          where: {
            name: { contains: change.compoundName, mode: "insensitive" },
          },
        });

        if (!compound) {
          Sentry.captureMessage(
            `Compound not found: ${change.compoundName}`,
            {
              level: "warning",
              extra: { countryCode, sourceUrl },
            }
          );
          continue;
        }

        // Check if this change already exists in staging
        const existing = await prisma.stagingRegulation.findFirst({
          where: {
            compoundId: compound.id,
            countryId: country.id,
            reviewStatus: "PENDING",
          },
        });

        if (existing) continue; // Skip duplicate

        await prisma.stagingRegulation.create({
          data: {
            compoundId: compound.id,
            countryId: country.id,
            proposedStatus: change.proposedStatus,
            regulatoryAuthority: change.regulatoryAuthority,
            requiredDocuments: change.requiredDocuments,
            quantityLimits: change.quantityLimits,
            permitAuthority: change.permitAuthority,
            permitApplicationUrl: change.permitApplicationUrl,
            permitLeadTimeDays: change.permitLeadTimeDays,
            dosageThreshold: change.dosageThreshold,
            biosecurityFlag: change.biosecurityFlag,
            biosecurityDetails: change.biosecurityDetails,
            sourceDocumentTitle: sourceTitle,
            sourceDocumentUrl: sourceUrl,
            aiConfidence: structured.confidence,
            aiExtractedText: extractedText.slice(0, 10000),
            aiTranslation: translation?.slice(0, 10000) ?? null,
          },
        });
        staged++;
      } catch (err) {
        Sentry.captureException(err, {
          extra: {
            compoundName: change.compoundName,
            countryCode,
            context: "map-medication-stage",
          },
        });
      }
    }

    return { staged, total: structured.changes.length };
  },
});

async function extractStructuredChanges(
  text: string
): Promise<StructuredExtraction | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `Analyze the following regulatory text and extract any changes to medication/drug/pharmaceutical regulations. Return a JSON object with this structure:

{
  "changes": [
    {
      "compoundName": "string - the active pharmaceutical ingredient name",
      "proposedStatus": "LEGAL | PRESCRIPTION_ONLY | RESTRICTED | BANNED",
      "requiredDocuments": "string or null",
      "quantityLimits": "string or null",
      "permitAuthority": "string or null",
      "permitApplicationUrl": "string or null",
      "permitLeadTimeDays": "number or null",
      "dosageThreshold": "string or null",
      "biosecurityFlag": false,
      "biosecurityDetails": "string or null",
      "regulatoryAuthority": "string or null"
    }
  ],
  "confidence": "HIGH | MEDIUM | LOW",
  "confidenceFactors": {
    "sourceReliability": "brief explanation",
    "extractionClarity": "brief explanation",
    "translationConfidence": "brief explanation",
    "patternAlignment": "brief explanation"
  }
}

Confidence levels:
- HIGH: Clear regulatory text from a reliable primary source
- MEDIUM: Ambiguous language or from a secondary source
- LOW: Indirect reference or low-confidence interpretation

If no regulatory changes are detected, return {"changes": [], "confidence": "LOW", "confidenceFactors": {}}.

Only return valid JSON, nothing else.

Text:
${text.slice(0, 12000)}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Claude API failed: ${res.status}`);
    }

    const data = await res.json();
    const content = data.content?.[0]?.text ?? "";

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]) as StructuredExtraction;
  } catch (err) {
    Sentry.captureException(err, {
      extra: { context: "extract-structured-changes" },
    });
    return null;
  }
}

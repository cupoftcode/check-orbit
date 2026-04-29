import { task } from "@trigger.dev/sdk/v3";
import * as Sentry from "@sentry/nextjs";

export type ExtractionResult = {
  sourceUrl: string;
  sourceTitle: string;
  extractedText: string;
  translation: string | null;
  originalLanguage: string;
  extractedAt: string;
};

/**
 * Extract regulatory text from a government publication URL.
 * Uses LlamaParse for PDF extraction and Claude API for translation.
 */
export const extractRegulations = task({
  id: "extract-regulations",
  retry: { maxAttempts: 2 },
  run: async (payload: {
    sourceUrl: string;
    sourceTitle: string;
    countryCode: string;
    language: string;
  }): Promise<ExtractionResult> => {
    const { sourceUrl, sourceTitle, language } = payload;

    let extractedText: string;

    // Determine extraction method based on URL
    if (sourceUrl.endsWith(".pdf") || sourceUrl.includes("/pdf/")) {
      extractedText = await extractPdf(sourceUrl);
    } else {
      extractedText = await extractHtml(sourceUrl);
    }

    // Translate if non-English
    let translation: string | null = null;
    if (language !== "en" && extractedText.length > 0) {
      translation = await translateText(extractedText, language);
    }

    return {
      sourceUrl,
      sourceTitle,
      extractedText,
      translation,
      originalLanguage: language,
      extractedAt: new Date().toISOString(),
    };
  },
});

/**
 * Extract text from a PDF document using LlamaParse.
 */
async function extractPdf(url: string): Promise<string> {
  const apiKey = process.env.LLAMAPARSE_API_KEY;
  if (!apiKey) {
    throw new Error("LLAMAPARSE_API_KEY is not configured");
  }

  try {
    // Submit PDF for parsing
    const submitRes = await fetch(
      "https://api.cloud.llamaindex.ai/api/parsing/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          parsing_instruction:
            "Extract all regulatory text including tables about medication, drug, pharmaceutical, or controlled substance regulations. Preserve table structure.",
          result_type: "markdown",
        }),
      }
    );

    if (!submitRes.ok) {
      throw new Error(`LlamaParse submit failed: ${submitRes.status}`);
    }

    const { id: jobId } = await submitRes.json();

    // Poll for result
    let attempts = 0;
    const maxAttempts = 60;
    while (attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, 2000));
      attempts++;

      const statusRes = await fetch(
        `https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}/result/markdown`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );

      if (statusRes.ok) {
        const result = await statusRes.json();
        return result.markdown ?? "";
      }

      if (statusRes.status !== 404) {
        throw new Error(`LlamaParse poll failed: ${statusRes.status}`);
      }
    }

    throw new Error("LlamaParse extraction timed out");
  } catch (err) {
    Sentry.captureException(err, {
      extra: { url, context: "extract-pdf" },
    });
    throw err;
  }
}

/**
 * Extract text from an HTML page.
 */
async function extractHtml(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "CheckOrbit-RegulatoryBot/1.0 (+https://checkorbit.com/bot)",
      },
    });

    if (!res.ok) {
      throw new Error(`HTML fetch failed: ${res.status}`);
    }

    const html = await res.text();

    // Strip HTML tags, keep text content
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } catch (err) {
    Sentry.captureException(err, {
      extra: { url, context: "extract-html" },
    });
    throw err;
  }
}

/**
 * Translate text to English using Claude API.
 */
async function translateText(
  text: string,
  sourceLanguage: string
): Promise<string> {
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
            content: `Translate the following ${sourceLanguage} regulatory text to English. Preserve all technical and legal terminology as accurately as possible. Only output the translation, nothing else.\n\n${text.slice(0, 12000)}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Claude API failed: ${res.status}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  } catch (err) {
    Sentry.captureException(err, {
      extra: { sourceLanguage, context: "translate-text" },
    });
    return "";
  }
}

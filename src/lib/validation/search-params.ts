import { z } from "zod";

export const medicationSearchSchema = z.object({
  q: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query too long")
    .trim(),
});

export const countrySearchSchema = z.object({
  q: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query too long")
    .trim(),
});

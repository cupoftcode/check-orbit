import { z } from "zod";

export const itineraryCheckSchema = z.object({
  medications: z
    .array(z.string().min(1))
    .min(1, "At least one medication is required")
    .max(10, "Maximum 10 medications"),
  stops: z
    .array(
      z.object({
        countryCode: z.string().length(2, "Must be a 2-letter country code"),
        stopType: z.enum(["origin", "transit", "destination"]),
      })
    )
    .min(2, "Itinerary must have at least an origin and destination")
    .max(6, "Maximum 6 stops (origin + 4 transit + destination)"),
});

export type ItineraryCheckInput = z.infer<typeof itineraryCheckSchema>;

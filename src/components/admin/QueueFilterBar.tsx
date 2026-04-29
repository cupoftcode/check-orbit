"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { AiConfidence } from "@prisma/client";

const CONFIDENCE_OPTIONS: { value: AiConfidence; label: string }[] = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

type Props = {
  currentConfidence: string | null;
  currentCountry: string | null;
};

export function QueueFilterBar({ currentConfidence, currentCountry }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  }

  function clearAll() {
    router.push("/admin");
  }

  const hasFilters = currentConfidence || currentCountry;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Confidence filter */}
      <div className="flex items-center gap-1">
        {CONFIDENCE_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={currentConfidence === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setFilter(
                "confidence",
                currentConfidence === opt.value ? null : opt.value
              )
            }
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Active filter chips */}
      {currentCountry && (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium">
          Country: {currentCountry}
          <button
            onClick={() => setFilter("country", null)}
            className="ml-1 hover:text-foreground"
            aria-label={`Remove country filter: ${currentCountry}`}
          >
            <X className="size-3" />
          </button>
        </span>
      )}

      {hasFilters && (
        <Button variant="link" size="sm" onClick={clearAll}>
          Clear all
        </Button>
      )}
    </div>
  );
}

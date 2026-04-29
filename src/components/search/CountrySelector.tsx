"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Globe, RotateCcw } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

type CountrySuggestion = {
  name: string;
  code: string;
  flagEmoji: string;
  isCovered: boolean;
  popularityRank: number;
};

type Variant = "single" | "multi";

type Props = {
  variant?: Variant;
  onSelect: (country: CountrySuggestion) => void;
  selectedCountry?: CountrySuggestion | null;
  onClear?: () => void;
};

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: CountrySuggestion[] }
  | { status: "error"; message: string };

export function CountrySelector({
  variant = "single",
  onSelect,
  selectedCountry,
  onClear,
}: Props) {
  const [query, setQuery] = useState("");
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coveredCount, setCoveredCount] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const abortRef = useRef<AbortController>(undefined);

  const suggestions =
    fetchState.status === "success" ? fetchState.data : [];

  const fetchCountries = useCallback(async (q: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFetchState({ status: "loading" });
    setActiveIndex(-1);

    try {
      const url = q
        ? `/api/search/countries?q=${encodeURIComponent(q)}`
        : `/api/search/countries`;
      const res = await fetch(url, { signal: controller.signal });

      if (!res.ok) {
        Sentry.captureMessage(`Country search failed: ${res.status}`, "error");
        setFetchState({
          status: "error",
          message: "Something went wrong. Please try again.",
        });
        return;
      }

      const json = await res.json();
      const countries: CountrySuggestion[] = json.data.countries;
      setFetchState({ status: "success", data: countries });
      setCoveredCount(countries.filter((c) => c.isCovered).length);
      setIsOpen(true);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      Sentry.captureException(err);
      setFetchState({
        status: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }, []);

  const hasFocused = useRef(false);

  useEffect(() => {
    if (!hasFocused.current) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchCountries(query);
    }, 150);

    return () => clearTimeout(debounceRef.current);
  }, [query, fetchCountries]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelect(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  function handleSelect(country: CountrySuggestion) {
    setIsOpen(false);
    setActiveIndex(-1);
    setQuery(country.name);
    onSelect(country);
  }

  function handleClear() {
    setQuery("");
    setFetchState({ status: "idle" });
    setIsOpen(false);
    onClear?.();
    inputRef.current?.focus();
  }

  const isLocked = !!selectedCountry;
  const showDropdown =
    isOpen || fetchState.status === "loading" || fetchState.status === "error";

  const listId = "country-suggestions";

  return (
    <div className="relative w-full">
      <div className="relative">
        <Globe
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
          aria-hidden
        />
        <Input
          ref={inputRef}
          value={
            isLocked
              ? `${selectedCountry.flagEmoji} ${selectedCountry.name}`
              : query
          }
          onChange={(e) => {
            if (!isLocked) setQuery(e.target.value);
          }}
          onFocus={() => {
            if (!isLocked) {
              hasFocused.current = true;
              fetchCountries(query);
            }
          }}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search destination country..."
          disabled={isLocked}
          className="h-12 text-lg pl-10 pr-10"
          role="combobox"
          aria-expanded={showDropdown && !isLocked}
          aria-controls={listId}
          aria-activedescendant={
            activeIndex >= 0 ? `country-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-label="Search destination country"
        />
        {isLocked && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleClear}
            aria-label="Clear country selection"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {showDropdown && !isLocked && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-80 overflow-y-auto">
          {fetchState.status === "loading" && (
            <div className="p-2 space-y-2" role="status" aria-label="Loading countries">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {fetchState.status === "error" && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {fetchState.message}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchCountries(query)}
              >
                <RotateCcw size={14} className="mr-1" />
                Retry
              </Button>
            </div>
          )}

          {fetchState.status === "success" && (
            <>
              <div className="sr-only" role="status" aria-live="polite">
                {suggestions.length} countr{suggestions.length !== 1 ? "ies" : "y"} found
              </div>
              <ul id={listId} role="listbox" className="py-1">
                {suggestions.map((country, i) => (
                  <li
                    key={country.code}
                    id={`country-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    className={`px-3 py-3 min-h-[48px] cursor-pointer text-sm flex items-center gap-3 ${
                      i === activeIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    } ${!country.isCovered ? "opacity-60" : ""}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(country)}
                  >
                    <span aria-hidden="true" className="text-lg">
                      {country.flagEmoji}
                    </span>
                    <span className="flex-1">
                      <span className="font-medium">{country.name}</span>
                      {!country.isCovered && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          Not yet covered
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Uncovered country message */}
      {selectedCountry && !selectedCountry.isCovered && (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800 mb-2">
            We don&apos;t cover {selectedCountry.name} yet. We currently have
            data for {coveredCount ?? "many"} countries.{" "}
            <a href="/coverage" className="underline font-medium">
              View coverage map
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              className="h-9 text-sm flex-1"
              aria-label={`Email for notification when ${selectedCountry.name} coverage is added`}
              onMouseDown={(e) => e.stopPropagation()}
            />
            <Button variant="outline" size="sm" className="h-9 shrink-0">
              Notify me
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

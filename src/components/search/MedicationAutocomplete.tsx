"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Search, RotateCcw } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

type MedicationSuggestion = {
  brandName: string;
  genericName: string | null;
  slug: string;
  compoundNames: string[];
};

type Variant = "hero" | "compact";

type Props = {
  variant?: Variant;
  onSelect: (medication: MedicationSuggestion) => void;
  selectedMedication?: MedicationSuggestion | null;
  onClear?: () => void;
};

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "slow" }
  | { status: "success"; data: MedicationSuggestion[] }
  | { status: "error"; message: string }
  | { status: "timeout" };

export function MedicationAutocomplete({
  variant = "hero",
  onSelect,
  selectedMedication,
  onClear,
}: Props) {
  const [query, setQuery] = useState("");
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const abortRef = useRef<AbortController>(undefined);

  const suggestions =
    fetchState.status === "success" ? fetchState.data : [];

  const fetchSuggestions = useCallback(async (q: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFetchState({ status: "loading" });
    setActiveIndex(-1);

    const slowTimer = setTimeout(() => {
      setFetchState((prev) =>
        prev.status === "loading" ? { status: "slow" } : prev
      );
    }, 300);

    const timeoutTimer = setTimeout(() => {
      controller.abort();
      setFetchState({ status: "timeout" });
    }, 5000);

    try {
      const res = await fetch(
        `/api/search/medications?q=${encodeURIComponent(q)}`,
        { signal: controller.signal }
      );

      clearTimeout(slowTimer);
      clearTimeout(timeoutTimer);

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        Sentry.captureMessage(
          `Medication search failed: ${res.status}`,
          "error"
        );
        setFetchState({
          status: "error",
          message:
            body?.error?.message ??
            "Something went wrong. Please try again.",
        });
        return;
      }

      const json = await res.json();
      setFetchState({ status: "success", data: json.data.medications });
      setIsOpen(true);
    } catch (err) {
      clearTimeout(slowTimer);
      clearTimeout(timeoutTimer);
      if ((err as Error).name === "AbortError") return;
      Sentry.captureException(err);
      setFetchState({
        status: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }, []);

  useEffect(() => {
    if (query.length === 0) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 150);

    return () => clearTimeout(debounceRef.current);
  }, [query, fetchSuggestions]);

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

  function handleSelect(med: MedicationSuggestion) {
    setIsOpen(false);
    setActiveIndex(-1);
    setQuery(med.brandName);
    onSelect(med);
  }

  function handleClear() {
    setQuery("");
    setFetchState({ status: "idle" });
    setIsOpen(false);
    onClear?.();
    inputRef.current?.focus();
  }

  function handleRetry() {
    if (query.length > 0) {
      fetchSuggestions(query);
    }
  }

  const isLocked = !!selectedMedication;
  const showDropdown =
    isOpen ||
    fetchState.status === "loading" ||
    fetchState.status === "slow" ||
    fetchState.status === "error" ||
    fetchState.status === "timeout";

  const inputClasses =
    variant === "hero"
      ? "h-12 text-lg px-4"
      : "h-10 text-sm px-3";

  const listId = "medication-suggestions";

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={variant === "hero" ? 20 : 16}
          aria-hidden
        />
        <Input
          ref={inputRef}
          value={isLocked ? selectedMedication.brandName : query}
          onChange={(e) => {
            if (isLocked) return;
            const value = e.target.value;
            setQuery(value);
            if (value.length === 0) {
              setFetchState({ status: "idle" });
              setIsOpen(false);
            }
          }}
          onFocus={() => {
            if (suggestions.length > 0 && !isLocked) setIsOpen(true);
          }}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setIsOpen(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search medication or supplement..."
          disabled={isLocked}
          className={`${inputClasses} pl-10 pr-10`}
          role="combobox"
          aria-expanded={showDropdown && !isLocked}
          aria-controls={listId}
          aria-activedescendant={
            activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-label="Search medications"
        />
        {isLocked && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleClear}
            aria-label="Clear medication selection"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {showDropdown && !isLocked && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {/* Loading skeleton */}
          {(fetchState.status === "loading" ||
            fetchState.status === "slow") && (
            <div className="p-2 space-y-2" role="status" aria-label="Loading suggestions">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              {fetchState.status === "slow" && (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  Searching...
                </p>
              )}
            </div>
          )}

          {/* Timeout */}
          {fetchState.status === "timeout" && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Search is taking longer than expected. Please try again.
              </p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RotateCcw size={14} className="mr-1" />
                Retry
              </Button>
            </div>
          )}

          {/* Error */}
          {fetchState.status === "error" && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {fetchState.message}
              </p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RotateCcw size={14} className="mr-1" />
                Retry
              </Button>
            </div>
          )}

          {/* Results */}
          {fetchState.status === "success" && (
            <>
              <div className="sr-only" role="status" aria-live="polite">
                {suggestions.length} medication{suggestions.length !== 1 ? "s" : ""} found
              </div>
              {suggestions.length > 0 ? (
                <ul id={listId} ref={listRef} role="listbox" className="py-1">
                  {suggestions.map((med, i) => (
                    <li
                      key={med.slug}
                      id={`suggestion-${i}`}
                      role="option"
                      aria-selected={i === activeIndex}
                      className={`px-3 py-2 cursor-pointer text-sm ${
                        i === activeIndex
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      }`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(med)}
                    >
                      <span className="font-medium">{med.brandName}</span>
                      {med.genericName && (
                        <span className="text-muted-foreground ml-1">
                          ({med.genericName})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    We don&apos;t have &ldquo;{query}&rdquo; in our database yet.
                    Want to be notified when we add it?
                  </p>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="h-9 text-sm"
                    aria-label="Email for medication notification"
                    onMouseDown={(e) => e.preventDefault()}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

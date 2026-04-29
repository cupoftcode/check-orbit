"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Search } from "lucide-react";
import { SavedSearchCard } from "./SavedSearchCard";
import type { SavedSearchWithChangeStatus } from "@/lib/db/queries/saved-searches";

type Props = {
  searches: SavedSearchWithChangeStatus[];
};

export function SavedSearchList({ searches: initialSearches }: Props) {
  const [searches, setSearches] = useState(initialSearches);

  function handleDeleted(id: string) {
    setSearches((prev) => prev.filter((s) => s.id !== id));
  }

  if (searches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground mb-4">
          No saved searches yet. Run a search and save it to track regulation
          changes.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          <Search className="size-4" data-icon="inline-start" />
          Search now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list">
      {searches.map((search) => (
        <div key={search.id} role="listitem">
          <SavedSearchCard search={search} onDeleted={handleDeleted} />
        </div>
      ))}
    </div>
  );
}

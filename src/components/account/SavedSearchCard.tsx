"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComplianceStatusBadge } from "@/components/compliance/ComplianceStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteSearch } from "@/actions/delete-search";
import { ComplianceStatus } from "@/types/compliance";
import type { SavedSearchWithChangeStatus } from "@/lib/db/queries/saved-searches";

type Props = {
  search: SavedSearchWithChangeStatus;
  onDeleted: (id: string) => void;
};

export function SavedSearchCard({ search, onDeleted }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteSearch(search.id);
      if (res.success) {
        onDeleted(search.id);
        toast.success("Search removed");
      } else {
        toast.error(res.error);
      }
    });
  }

  const savedDate = new Date(search.savedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-4">
        <Link
          href={`/check/${search.medicationSlug}/${search.countryCode.toLowerCase()}`}
          className="flex flex-1 items-center gap-4 min-w-0"
        >
          <div className="flex-1 min-w-0 space-y-1">
            <p className="font-medium truncate">
              {search.snapshot.medication}
            </p>
            <p className="text-sm text-muted-foreground">
              {search.snapshot.country}
            </p>
            <p className="text-xs text-muted-foreground">
              Saved {savedDate}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <ComplianceStatusBadge
              status={search.snapshot.overallStatus as ComplianceStatus}
              variant="compact"
            />
            {search.hasChanged ? (
              <Badge variant="destructive">Updated</Badge>
            ) : (
              <span className="text-xs text-muted-foreground">
                Current — no changes
              </span>
            )}
          </div>
        </Link>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDelete}
          disabled={isPending}
          aria-label={`Delete saved search for ${search.snapshot.medication} in ${search.snapshot.country}`}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

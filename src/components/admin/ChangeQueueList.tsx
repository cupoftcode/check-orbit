"use client";

import { useState } from "react";
import { ChangeQueueItem } from "./ChangeQueueItem";
import type { AiConfidence } from "@prisma/client";

type QueueItem = {
  id: string;
  compoundName: string;
  countryName: string;
  countryFlag: string;
  proposedStatus: string;
  aiConfidence: AiConfidence;
  sourceDocumentTitle: string;
  sourceDocumentUrl: string;
  flaggedAt: string;
};

type Props = {
  items: QueueItem[];
  lastVerifiedAt: string | null;
};

export function ChangeQueueList({ items: initialItems, lastVerifiedAt }: Props) {
  const [items, setItems] = useState(initialItems);

  function handleRemove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium text-foreground">
          No pending changes
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          All regulatory data is current.
          {lastVerifiedAt && (
            <>
              {" "}
              Last verified{" "}
              {new Date(lastVerifiedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              .
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <ol role="list" className="space-y-2">
      {items.map((item) => (
        <ChangeQueueItem
          key={item.id}
          {...item}
          flaggedAt={item.flaggedAt}
          onRemove={handleRemove}
        />
      ))}
    </ol>
  );
}

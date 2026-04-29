"use client";

import { useState, useTransition } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveSearch } from "@/actions/save-search";
import { PaywallModal } from "@/components/layout/PaywallModal";
import type { ComplianceResult } from "@/types/compliance";

type Props = {
  medicationSlug: string;
  countryCode: string;
  result: ComplianceResult;
  initialSaved: boolean;
};

export function SaveSearchButton({
  medicationSlug,
  countryCode,
  result,
  initialSaved,
}: Props) {
  const { isSignedIn } = useUser();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [showPaywall, setShowPaywall] = useState(false);

  const returnUrl = `/check/${medicationSlug}/${countryCode.toLowerCase()}`;

  function handleSave() {
    startTransition(async () => {
      const res = await saveSearch(medicationSlug, countryCode, result);
      if (res.success) {
        setSaved(true);
        toast.success("Search saved");
      } else if ("code" in res && res.code === "SAVE_LIMIT_REACHED") {
        setShowPaywall(true);
      } else {
        toast.error(res.error);
      }
    });
  }

  if (saved) {
    return (
      <Button variant="outline" size="sm" disabled>
        <BookmarkCheck className="size-4" data-icon="inline-start" />
        Saved
      </Button>
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button variant="outline" size="sm">
          <Bookmark className="size-4" data-icon="inline-start" />
          Save search
        </Button>
      </SignInButton>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
        ) : (
          <Bookmark className="size-4" data-icon="inline-start" />
        )}
        Save search
      </Button>
      <PaywallModal
        open={showPaywall}
        onOpenChange={setShowPaywall}
        feature="unlimited-saves"
        returnUrl={returnUrl}
      />
    </>
  );
}

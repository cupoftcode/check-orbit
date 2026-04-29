"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCheckoutSession } from "@/actions/create-checkout";
import { createPortalSession } from "@/actions/create-portal-session";
import type { SubscriptionTier } from "@/lib/payments/subscription";

type Props = {
  tier: SubscriptionTier;
};

export function SubscriptionManager({ tier }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleUpgrade() {
    startTransition(async () => {
      const res = await createCheckoutSession("/account/subscription");
      if (res.success) {
        window.location.href = res.url;
      } else {
        toast.error(res.error);
      }
    });
  }

  function handleManage() {
    startTransition(async () => {
      const res = await createPortalSession();
      if (res.success) {
        window.location.href = res.url;
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle>Current Plan</CardTitle>
          <Badge variant={tier === "pro" ? "default" : "secondary"}>
            {tier === "pro" ? "Pro" : "Free"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tier === "pro" ? (
          <>
            <p className="text-sm text-muted-foreground">
              You have access to all Pro features including multi-medication
              search, layover trap detection, and unlimited saved searches.
            </p>
            <Button
              variant="outline"
              onClick={handleManage}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
              ) : (
                <ExternalLink className="size-4" data-icon="inline-start" />
              )}
              Manage subscription
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              You&apos;re on the Free plan. Upgrade to Pro for multi-medication
              search, layover trap, unlimited saves, and email notifications.
            </p>
            <Button
              onClick={handleUpgrade}
              disabled={isPending}
              className="bg-amber-500 text-amber-950 hover:bg-amber-400"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
              ) : (
                <Sparkles className="size-4" data-icon="inline-start" />
              )}
              Upgrade to Pro
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

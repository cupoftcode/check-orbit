"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Calendar, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  toggleRegulationAlerts,
  togglePermitReminders,
  updateDepartureDate,
  toggleGlobalNotifications,
} from "@/actions/update-notification-preferences";

type SavedSearchNotification = {
  savedSearchId: string;
  medicationSlug: string;
  countryCode: string;
  medicationName: string;
  countryName: string;
  departureDate: string | null;
  regulationAlerts: boolean;
  permitReminders: boolean;
};

type Props = {
  searches: SavedSearchNotification[];
  globalPaused: boolean;
};

function ToggleButton({
  enabled,
  onToggle,
  label,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      onToggle();
    });
  }

  return (
    <Button
      variant={enabled ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={enabled}
      aria-label={label}
      className="min-h-[48px] sm:min-h-0"
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
      ) : enabled ? (
        <Bell className="size-3.5" data-icon="inline-start" />
      ) : (
        <BellOff className="size-3.5" data-icon="inline-start" />
      )}
      {enabled ? "On" : "Off"}
    </Button>
  );
}

export function NotificationPreferences({ searches, globalPaused }: Props) {
  const [paused, setPaused] = useState(globalPaused);
  const [searchPrefs, setSearchPrefs] = useState(searches);
  const [isTogglingGlobal, startGlobalTransition] = useTransition();

  function handleGlobalToggle() {
    const newPaused = !paused;
    startGlobalTransition(async () => {
      const res = await toggleGlobalNotifications(newPaused);
      if (res.success) {
        setPaused(newPaused);
        toast.success(
          newPaused
            ? "All notifications paused"
            : "Notifications resumed"
        );
      } else {
        toast.error(res.error);
      }
    });
  }

  async function handleRegulationToggle(savedSearchId: string, current: boolean) {
    const res = await toggleRegulationAlerts(savedSearchId, !current);
    if (res.success) {
      setSearchPrefs((prev) =>
        prev.map((s) =>
          s.savedSearchId === savedSearchId
            ? { ...s, regulationAlerts: !current }
            : s
        )
      );
      toast.success("Preferences updated");
    } else {
      toast.error(res.error);
    }
  }

  async function handlePermitToggle(savedSearchId: string, current: boolean) {
    const res = await togglePermitReminders(savedSearchId, !current);
    if (res.success) {
      setSearchPrefs((prev) =>
        prev.map((s) =>
          s.savedSearchId === savedSearchId
            ? { ...s, permitReminders: !current }
            : s
        )
      );
      toast.success("Preferences updated");
    } else {
      toast.error(res.error);
    }
  }

  async function handleDepartureDateChange(
    savedSearchId: string,
    date: string
  ) {
    const res = await updateDepartureDate(savedSearchId, date || null);
    if (res.success) {
      setSearchPrefs((prev) =>
        prev.map((s) =>
          s.savedSearchId === savedSearchId
            ? { ...s, departureDate: date || null }
            : s
        )
      );
      toast.success("Departure date updated");
    } else {
      toast.error(res.error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Global pause toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-3">
          {paused ? (
            <BellOff className="size-5 text-muted-foreground" />
          ) : (
            <Bell className="size-5 text-foreground" />
          )}
          <div>
            <p className="font-medium">
              {paused ? "Notifications paused" : "Notifications active"}
            </p>
            <p className="text-sm text-muted-foreground">
              {paused
                ? "All email notifications are paused"
                : "You're receiving notifications for your saved searches"}
            </p>
          </div>
        </div>
        <Button
          variant={paused ? "default" : "outline"}
          size="sm"
          onClick={handleGlobalToggle}
          disabled={isTogglingGlobal}
          className="min-h-[48px] sm:min-h-0"
        >
          {isTogglingGlobal && (
            <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
          )}
          {paused ? "Resume all" : "Pause all"}
        </Button>
      </div>

      {/* Per-search preferences */}
      {searchPrefs.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-muted-foreground">
            No saved searches yet. Save a medication-country pair to set up
            notifications.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Per-search notifications
          </h3>
          {searchPrefs.map((search) => (
            <div
              key={search.savedSearchId}
              className="rounded-lg border p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {search.medicationName} — {search.countryName}
                  </p>
                  {search.departureDate && (
                    <Badge variant="secondary" className="mt-1">
                      <Calendar className="size-3" data-icon="inline-start" />
                      Departure:{" "}
                      {new Date(search.departureDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Regulation alerts */}
                <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm">Regulation alerts</span>
                  </div>
                  <ToggleButton
                    enabled={search.regulationAlerts && !paused}
                    onToggle={() =>
                      handleRegulationToggle(
                        search.savedSearchId,
                        search.regulationAlerts
                      )
                    }
                    label={`Toggle regulation alerts for ${search.medicationName} in ${search.countryName}`}
                  />
                </div>

                {/* Permit reminders */}
                <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm">Permit reminders</span>
                  </div>
                  <ToggleButton
                    enabled={search.permitReminders && !paused}
                    onToggle={() =>
                      handlePermitToggle(
                        search.savedSearchId,
                        search.permitReminders
                      )
                    }
                    label={`Toggle permit reminders for ${search.medicationName} in ${search.countryName}`}
                  />
                </div>
              </div>

              {/* Departure date input */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor={`departure-${search.savedSearchId}`}
                  className="text-sm text-muted-foreground whitespace-nowrap"
                >
                  Departure date:
                </label>
                <input
                  id={`departure-${search.savedSearchId}`}
                  type="date"
                  value={search.departureDate?.split("T")[0] ?? ""}
                  onChange={(e) =>
                    handleDepartureDateChange(
                      search.savedSearchId,
                      e.target.value
                    )
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

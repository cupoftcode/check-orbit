"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

export function DepartureDateInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = searchParams.get("departureDate") ?? "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("departureDate", e.target.value);
    } else {
      params.delete("departureDate");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  // Minimum date is today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative w-full">
      <Calendar
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={18}
        aria-hidden="true"
      />
      <Input
        type="date"
        value={currentDate}
        onChange={handleChange}
        min={today}
        className="h-12 text-lg pl-10"
        aria-label="Departure date (optional)"
      />
    </div>
  );
}

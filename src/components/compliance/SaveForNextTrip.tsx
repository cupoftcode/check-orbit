"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { toast } from "sonner";

type Props = {
  countryCode: string;
  countryName: string;
};

export function SaveForNextTrip({ countryCode, countryName }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/subscribe/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          countryCodes: [countryCode.toUpperCase()],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error?.message ?? "Something went wrong.");
        return;
      }

      setSubmitted(true);
      toast("Subscribed! We'll email you if rules change.");
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3">
        <Check size={14} className="text-emerald-600 shrink-0" aria-hidden="true" />
        <p className="text-sm text-emerald-700">
          Subscribed for {countryName} alerts at <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Bell size={14} className="text-slate-600 shrink-0" aria-hidden="true" />
        <p className="text-sm font-medium text-slate-700">
          Get alerts if {countryName} rules change
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address for destination alerts"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Saving..." : "Save for my trip"}
        </button>
      </form>
      {errorMsg && (
        <p className="text-sm text-rose-600">{errorMsg}</p>
      )}
    </div>
  );
}

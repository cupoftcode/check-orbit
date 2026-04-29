"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { toast } from "sonner";
import type { ComplianceResult } from "@/types/compliance";

type Props = {
  result: ComplianceResult;
  medicationSlug: string;
};

export function SendResultEmail({ result, medicationSlug }: Props) {
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/share/send-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, result, medicationSlug }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error?.message ?? "Something went wrong.");
        return;
      }

      setSentTo(email);
      toast("Result sent to your email");
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sentTo) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-700">
        <Check size={14} aria-hidden="true" />
        Sent to {sentTo}
      </div>
    );
  }

  if (!showInput) {
    return (
      <button
        type="button"
        onClick={() => setShowInput(true)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Mail size={14} aria-hidden="true" />
        Send to my email
      </button>
    );
  }

  return (
    <div className="space-y-1">
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address to send result to"
          autoFocus
          className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      {errorMsg && (
        <p className="text-xs text-rose-600">{errorMsg}</p>
      )}
    </div>
  );
}

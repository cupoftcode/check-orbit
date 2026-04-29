"use client";

import { useActionState } from "react";
import { notifySignup } from "@/actions/notify-signup";

type Props = {
  medicationSlug: string;
};

export function MedicationNotFound({ medicationSlug }: Props) {
  const [state, formAction, isPending] = useActionState(
    (_prev: { success: boolean; email?: string; error?: string } | null, formData: FormData) =>
      notifySignup(medicationSlug, formData),
    null
  );

  const medName = medicationSlug.replace(/-/g, " ");

  return (
    <div className="rounded-md border border-slate-200 bg-white p-6 text-center">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">
        We don&apos;t have {medName} in our database yet.
      </h2>

      {state?.success ? (
        <p className="text-sm text-emerald-700">
          Sent to {state.email} — we&apos;ll notify you when we add it.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Want to be notified when we add it?
          </p>
          <form action={formAction} className="flex items-center gap-2 justify-center max-w-sm mx-auto">
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              aria-label="Email address for notification"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {isPending ? "Sending..." : "Notify me"}
            </button>
          </form>
          {state?.error && (
            <p className="text-sm text-rose-600 mt-2">{state.error}</p>
          )}
        </>
      )}
    </div>
  );
}

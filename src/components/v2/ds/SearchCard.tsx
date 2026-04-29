"use client";
import { useState, type FormEvent } from "react";

export default function SearchCard({
  onSearch,
}: {
  onSearch: (med: string, dest: string) => void | Promise<void>;
}) {
  const [med, setMed] = useState("");
  const [dest, setDest] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(med.trim() || "Adderall 20mg", dest.trim() || "Japan");
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-[720px] mx-auto bg-paper rounded-[20px] border border-rule shadow-lift p-2.5 flex items-stretch gap-2"
    >
      <Field
        iconTint="brand"
        label="Medication"
        placeholder="e.g. Adderall 20mg"
        value={med}
        onChange={setMed}
      />
      <div className="w-px bg-rule my-2" aria-hidden />
      <Field
        iconTint="trust"
        label="Destination"
        placeholder="Country or airport code"
        value={dest}
        onChange={setDest}
      />
      <button
        type="submit"
        className="bg-brand hover:bg-brand-deep text-white rounded-[14px] px-[22px] font-display font-extrabold text-[14px] flex items-center gap-2"
      >
        Check
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </button>
    </form>
  );
}

function Field({
  iconTint,
  label,
  placeholder,
  value,
  onChange,
}: {
  iconTint: "brand" | "trust";
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const tint = iconTint === "brand"
    ? "bg-brand-soft text-brand-deep"
    : "bg-trust-soft text-trust";
  return (
    <label className="flex-1 flex items-center gap-3 px-4 py-3 rounded-[14px] cursor-text hover:bg-cream focus-within:bg-cream">
      <span className={`w-9 h-9 flex-none rounded-[10px] grid place-items-center ${tint}`}>
        <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="8" width="18" height="8" rx="4" />
          <path d="M12 8v8" />
        </svg>
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-display font-bold text-[10px] tracking-[0.08em] uppercase text-ink-3">
          {label}
        </span>
        <input
          className="w-full bg-transparent border-0 outline-0 font-display font-semibold text-[16px] text-ink placeholder:text-ink-4 placeholder:font-medium"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
        />
      </span>
    </label>
  );
}

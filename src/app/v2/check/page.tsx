import { V2Search } from "./V2Search";
import { Clock, Shield, Check } from "lucide-react";

export default function V2CheckPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 -z-10 h-[500px]"
          style={{
            background:
              "linear-gradient(135deg, var(--color-brand-soft) 0%, var(--color-cream) 50%, var(--color-trust-soft) 100%)",
          }}
        />
        <div className="mx-auto w-full max-w-3xl px-4 pt-16 pb-24 text-center sm:pt-20">
          <div className="mb-5 inline-flex items-center gap-2 font-display font-bold text-[11px] tracking-[0.12em] uppercase text-brand">
            CheckOrbit
          </div>
          <h1 className="text-balance font-display font-black text-ink" style={{ fontSize: "clamp(48px, 6.5vw, 92px)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            Your meds.{" "}
            <em className="relative inline-block not-italic isolate">
              Their rules.
              <span
                className="absolute inset-x-0 bg-brand-soft rounded-sm"
                style={{ bottom: "0.06em", height: "0.18em", zIndex: -1 }}
                aria-hidden="true"
              />
            </em>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-[17px] text-ink-3 leading-[1.55]">
            Search any medication against any destination and get a verified,
            source-cited compliance answer.
          </p>

          <div className="mt-10">
            <V2Search />
          </div>

          {/* Trust indicators */}
          <div className="mx-auto mt-6 flex max-w-lg flex-wrap items-center justify-center gap-6 font-display font-semibold text-[12px] text-ink-3">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              Results in &lt; 20s
            </span>
            <span className="flex items-center gap-1.5">
              <Shield size={14} />
              214 country authorities
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} />
              12,400+ compounds
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { V2Search } from "./check/V2Search";
import { Clock, Shield, Check } from "lucide-react";
import StatusBadge from "@/components/v2/ds/StatusBadge";
import type { Status } from "@/components/v2/ds/StatusBadge";
import Button from "@/components/v2/ds/Button";

const SOURCES = [
  "MHLW \u65E5\u672C",
  "MoHAP \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A",
  "HSA SG",
  "COFEPRIS MX",
  "TGA AU",
  "Health Canada",
];

export default function V2HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 -z-10 h-[700px]"
          style={{
            background:
              "linear-gradient(135deg, var(--color-brand-soft) 0%, var(--color-cream) 50%, var(--color-trust-soft) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-4 py-16 pb-48 md:py-24 md:pb-64 lg:pb-72">
          <div className="relative z-10 mx-auto mb-10 flex max-w-2xl flex-col items-center text-center">
            {/* Eyebrow with chip */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-pill bg-paper border border-rule py-1.5 pr-3.5 pl-1.5 font-display font-semibold text-[12px] text-ink-2">
              <span className="bg-brand text-white py-0.5 px-2.5 rounded-pill text-[11px] font-bold tracking-[0.04em]">
                NEW
              </span>
              Layover-trap detection now covers 214 countries
            </div>

            <h1 className="text-balance font-display font-black text-ink" style={{ fontSize: "clamp(48px, 6.5vw, 92px)", letterSpacing: "-0.035em", lineHeight: 0.98 }}>
              Your meds.{" "}
              <em className="relative inline-block not-italic isolate">
                Their rules.
                <span
                  className="absolute inset-x-0 bg-brand-soft rounded-sm"
                  style={{ bottom: "0.06em", height: "0.18em", zIndex: -1 }}
                  aria-hidden="true"
                />
              </em>
              <br />
              Answered in 20 seconds.
            </h1>

            <p className="mt-4 max-w-lg text-balance text-[18px] text-ink-3 leading-[1.55]">
              Search any medication against any destination and get a verified,
              source-cited compliance answer &mdash; before customs makes it
              their problem.
            </p>
          </div>

          <div className="relative z-10 mx-auto max-w-3xl">
            <V2Search />
          </div>

          {/* Hero meta row */}
          <div className="relative z-10 mx-auto mt-6 flex max-w-lg flex-wrap items-center justify-center gap-6 font-display font-semibold text-[12px] text-ink-3">
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

          {/* Floating result cards */}
          <div
            className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
            aria-hidden="true"
          >
            <FloaterCard className="left-[-1%] top-[22%] w-[200px] -rotate-3">
              <StatusBadge status="banned" />
              <div className="mt-2 font-display font-extrabold text-[14px] text-ink">
                Adderall &middot; 20mg
              </div>
              <div className="text-[12px] text-ink-3">Japan &middot; MHLW</div>
            </FloaterCard>

            <FloaterCard className="right-[-2%] top-[16%] w-[230px] rotate-2">
              <StatusBadge status="rx" />
              <div className="mt-2 font-display font-extrabold text-[14px] text-ink">
                Tramadol &middot; 50mg
              </div>
              <div className="text-[12px] text-ink-3">
                Spain &middot; AEMPS &mdash; doctor&apos;s note in English
              </div>
            </FloaterCard>

            <FloaterCard className="left-[3%] bottom-[2%] w-[190px] rotate-2">
              <StatusBadge status="restricted" />
              <div className="mt-2 font-display font-extrabold text-[14px] text-ink">
                Pseudoephedrine
              </div>
              <div className="text-[12px] text-ink-3">Mexico &middot; COFEPRIS</div>
            </FloaterCard>

            <FloaterCard className="right-[2%] bottom-[4%] w-[190px] -rotate-1">
              <StatusBadge status="legal" />
              <div className="mt-2 font-display font-extrabold text-[14px] text-ink">
                Ibuprofen &middot; 200mg
              </div>
              <div className="text-[12px] text-ink-3">Germany &middot; BfArM</div>
            </FloaterCard>

            {/* Center card — dark verified */}
            <div
              className="floater-card absolute left-1/2 bottom-[2%] -translate-x-1/2 w-[240px] bg-ink rounded-2xl p-[18px_20px] shadow-lift border border-[#3A3024]"
            >
              <div className="font-display font-extrabold text-[11px] tracking-[0.08em] uppercase text-premium">
                Verified answer
              </div>
              <div className="mt-1.5 flex items-center gap-2 font-display font-black text-[18px] text-white">
                NYC &rarr; DXB
              </div>
              <div className="text-[12px] text-[#B4A897] mt-0.5">
                Codeine &middot; 30mg &middot; Restricted
              </div>
              <div className="mt-3 pt-3 border-t border-[#3A3024] font-mono text-[11px] text-[#8A7E6D] leading-[1.5]">
                MoHAP Federal Decree 14/2020
                <br />
                Verified Apr 11, 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted sources bar */}
      <section className="bg-cream-2 border-y border-rule">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-6 px-4 py-4 md:justify-between">
          <span className="font-display font-bold text-[11px] tracking-[0.06em] uppercase text-ink-4">
            Sourced directly from government authorities
          </span>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 font-mono text-[12px] font-medium text-ink-4">
            {SOURCES.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature triad */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-20">
          <div className="mb-12 text-center">
            {/* Section tabs */}
            <div className="mx-auto mb-6 inline-flex gap-1 bg-cream-2 rounded-xl p-1">
              {["Search", "Trip", "Share"].map((tab, i) => (
                <span
                  key={tab}
                  className={`font-display font-bold text-[13px] py-2 px-[18px] rounded-[10px] ${
                    i === 0
                      ? "bg-paper text-ink shadow-card"
                      : "bg-transparent text-ink-3"
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>
            <h2 className="font-display font-black tracking-tighter text-ink" style={{ fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1.02 }}>
              Ask once. Get the whole answer.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] text-ink-3">
              Compliance isn&apos;t a yes/no &mdash; it&apos;s a stack of
              documents, thresholds, and deadlines. We surface all of it.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard illustrationBg="bg-trust-soft">
              <svg viewBox="0 0 220 130" width="200">
                <rect x="20" y="28" width="180" height="80" rx="10" fill="#fff" stroke="#E6DCCC" />
                <rect x="20" y="66" width="180" height="4" fill="#EFE6D8" />
                <circle cx="20" cy="68" r="6" fill="#F5EEE4" />
                <circle cx="200" cy="68" r="6" fill="#F5EEE4" />
                <text x="40" y="58" fontFamily="Montserrat" fontWeight="900" fontSize="14" fill="#1F1A15">ADDERALL 20MG</text>
                <text x="40" y="92" fontFamily="JetBrains Mono" fontSize="10" fill="#6E6357">MHLW &middot; JPN &middot; APR 11</text>
                <rect x="130" y="80" width="60" height="16" rx="4" fill="#F5DFD8" />
                <text x="160" y="91" textAnchor="middle" fontFamily="Montserrat" fontWeight="800" fontSize="9" fill="#9C3D2A">BANNED</text>
              </svg>
              <h3 className="font-display font-extrabold text-[18px] tracking-tight text-ink mb-2">
                One search, every document.
              </h3>
              <p className="text-[14px] text-ink-3 leading-[1.55]">
                Permit lead times, daily quantity caps, translation requirements,
                and the exact form ID you need &mdash; returned in one page, not
                a 40-link rabbit hole.
              </p>
            </FeatureCard>

            <FeatureCard illustrationBg="bg-brand-soft">
              <svg viewBox="0 0 240 150" width="210">
                <circle cx="30" cy="80" r="8" fill="#5B9BC5" />
                <circle cx="120" cy="80" r="8" fill="#8A5E14" />
                <circle cx="210" cy="80" r="8" fill="#2F6B3F" />
                <path d="M38 80 Q 75 40 112 80" fill="none" stroke="#5B9BC5" strokeWidth="2" strokeDasharray="3,4" />
                <path d="M128 80 Q 165 40 202 80" fill="none" stroke="#8A5E14" strokeWidth="2" strokeDasharray="3,4" />
                <text x="30" y="110" textAnchor="middle" fontFamily="Montserrat" fontWeight="700" fontSize="10" fill="#1F1A15">JFK</text>
                <text x="120" y="110" textAnchor="middle" fontFamily="Montserrat" fontWeight="700" fontSize="10" fill="#1F1A15">DXB</text>
                <text x="210" y="110" textAnchor="middle" fontFamily="Montserrat" fontWeight="700" fontSize="10" fill="#1F1A15">BKK</text>
                <rect x="80" y="120" width="80" height="18" rx="9" fill="#F7ECD4" />
                <text x="120" y="132" textAnchor="middle" fontFamily="Montserrat" fontWeight="800" fontSize="9" fill="#8A5E14">LAYOVER TRAP</text>
              </svg>
              <h3 className="font-display font-extrabold text-[18px] tracking-tight text-ink mb-2">
                The layover trap, defused.
              </h3>
              <p className="text-[14px] text-ink-3 leading-[1.55]">
                Your medication might be legal at origin and destination &mdash;
                but your 3-hour transit country could still confiscate it. We
                catch that, specifically.
              </p>
            </FeatureCard>

            <FeatureCard illustrationBg="bg-cream-2">
              <svg viewBox="0 0 220 150" width="200">
                <rect x="50" y="14" width="120" height="120" rx="14" fill="#fff" stroke="#E6DCCC" />
                <rect x="62" y="26" width="70" height="8" rx="4" fill="#1F1A15" />
                <rect x="62" y="42" width="96" height="6" rx="3" fill="#EFE6D8" />
                <rect x="62" y="56" width="60" height="6" rx="3" fill="#EFE6D8" />
                <rect x="62" y="78" width="96" height="20" rx="6" fill="#F5DFD8" />
                <text x="110" y="92" textAnchor="middle" fontFamily="Montserrat" fontWeight="800" fontSize="9" fill="#9C3D2A">BANNED &middot; JAPAN</text>
                <rect x="62" y="108" width="36" height="14" rx="4" fill="#EFE6D8" />
                <rect x="104" y="108" width="54" height="14" rx="4" fill="#DE6438" />
              </svg>
              <h3 className="font-display font-extrabold text-[18px] tracking-tight text-ink mb-2">
                Proof you can send in a text.
              </h3>
              <p className="text-[14px] text-ink-3 leading-[1.55]">
                A shareable risk card that fits a message bubble &mdash; for the
                friend, the employer, or the customs officer who wants to see the
                source.
              </p>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Dark hero — For teams & pharmacies */}
      <section className="bg-ink text-[#EFE6D8]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          <div>
            <div className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-premium mb-3.5">
              For teams &amp; pharmacies
            </div>
            <h2 className="font-display font-black text-white tracking-tighter leading-none mb-[18px]" style={{ fontSize: "clamp(28px, 5vw, 52px)" }}>
              Give your patients an answer they can trust &mdash; before they
              board.
            </h2>
            <p className="text-[16px] text-[#B4A897] leading-[1.6] mb-7 max-w-[520px]">
              Embed CheckOrbit in your pharmacy consult, travel clinic intake, or
              corporate travel portal. Every result carries your white-label
              footer and our source chain.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/v2/pricing" className="no-underline">
                <Button variant="primary" size="lg">
                  Request API access &rarr;
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="border-[#4a4034] text-white hover:bg-[#4a4034] hover:text-white">
                Book a demo
              </Button>
            </div>
          </div>

          <div className="bg-[#2A231B] rounded-[20px] p-[26px] border border-[#3A3024]">
            <div className="font-mono text-[11px] text-[#8A7E6D] mb-3">
              POST /api/v1/check
            </div>
            <pre className="font-mono text-[12.5px] m-0 leading-[1.7] whitespace-pre-wrap text-brand-light">
              <span className="text-[#B4A897]">{"{"}</span>
              {"\n  "}
              <span className="text-premium">&quot;medication&quot;</span>
              {": "}
              <span className="text-white">&quot;Adderall 20mg&quot;</span>,
              {"\n  "}
              <span className="text-premium">&quot;destination&quot;</span>
              {": "}
              <span className="text-white">&quot;JPN&quot;</span>,{"\n  "}
              <span className="text-premium">&quot;transit&quot;</span>
              {": ["}
              <span className="text-white">&quot;DXB&quot;</span>
              {"],"}
              {"\n  "}
              <span className="text-premium">
                &quot;quantity_days&quot;
              </span>
              {": "}
              <span className="text-trust">30</span>
              {"\n"}
              <span className="text-[#B4A897]">{"}"}</span>
              {"\n\n"}
              <span className="text-[#8A7E6D]">
                &rarr; 200 OK &nbsp;(1.8s)
              </span>
              {"\n"}
              <span className="text-[#B4A897]">{"{"}</span>
              {"\n  "}
              <span className="text-premium">&quot;status&quot;</span>
              {": "}
              <span className="text-white">&quot;BANNED&quot;</span>,{"\n  "}
              <span className="text-premium">&quot;source&quot;</span>
              {": "}
              <span className="text-white">
                &quot;MHLW 1951.14&quot;
              </span>,{"\n  "}
              <span className="text-premium">&quot;verified&quot;</span>
              {": "}
              <span className="text-white">&quot;2026-04-11&quot;</span>
              {"\n"}
              <span className="text-[#B4A897]">{"}"}</span>
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}

function FloaterCard({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div className={`floater-card absolute bg-paper rounded-[14px] p-[14px_16px] shadow-card border border-rule ${className}`}>
      {children}
    </div>
  );
}

function FeatureCard({ illustrationBg, children }: { illustrationBg: string; children: React.ReactNode }) {
  const illustrationChildren: React.ReactNode[] = [];
  const contentChildren: React.ReactNode[] = [];
  let foundNonSvg = false;

  const childArray = Array.isArray(children) ? children : [children];
  for (const child of childArray) {
    if (!foundNonSvg && typeof child === "object" && child !== null && "type" in child && child.type === "svg") {
      illustrationChildren.push(child);
    } else {
      foundNonSvg = true;
      contentChildren.push(child);
    }
  }

  return (
    <div className="bg-paper border border-rule rounded-[18px] p-7 shadow-card">
      <div className={`mb-5 grid place-items-center h-[140px] rounded-xl ${illustrationBg}`}>
        {illustrationChildren}
      </div>
      {contentChildren}
    </div>
  );
}

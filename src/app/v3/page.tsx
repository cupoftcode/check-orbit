import SearchCard from "@/components/v3/ds/SearchCard";
import Button from "@/components/v3/ds/Button";
import StatusBadge from "@/components/v3/ds/StatusBadge";

const SOURCES = [
  "MHLW 日本",
  "MoHAP الإمارات",
  "HSA SG",
  "COFEPRIS MX",
  "TGA AU",
  "Health Canada",
];

export default function V3HomePage() {
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pb-20 pt-10">
        <div className="relative mx-auto max-w-[1280px] px-6 text-center md:px-14">
          {/* Eyebrow pill */}
          <span className="mb-[26px] inline-flex items-center gap-2.5 rounded-full border border-rule bg-paper py-1.5 pr-3.5 pl-1.5 font-display text-[12px] font-semibold text-ink-2">
            <span className="rounded-full bg-brand px-2.5 py-[3px] text-[11px] tracking-[0.04em] text-white">
              NEW
            </span>
            Layover-trap detection now covers 214 countries
          </span>

          <h1
            className="m-0 mb-[22px] font-display font-black text-ink"
            style={{
              fontSize: "clamp(48px, 6.5vw, 92px)",
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
            }}
          >
            Your meds.{" "}
            <em className="relative inline-block isolate not-italic">
              Their rules.
              <span
                aria-hidden
                className="absolute inset-x-0 rounded-[2px] bg-brand-soft"
                style={{ bottom: "0.06em", height: "0.18em", zIndex: -1 }}
              />
            </em>
            <br />
            Answered in 20 seconds.
          </h1>

          <p className="mx-auto mb-10 max-w-[620px] text-[18px] leading-[1.55] text-ink-3">
            Search any medication against any destination and get a verified,
            source-cited compliance answer &mdash; before customs makes it their
            problem.
          </p>

          <SearchCard />

          {/* Hero meta */}
          <div className="mt-[18px] flex flex-wrap items-center justify-center gap-[22px] text-[13px] text-ink-3">
            <span className="inline-flex items-center gap-[7px]">
              <svg
                className="h-[14px] w-[14px] text-trust"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              Results in &lt; 20s
            </span>
            <span className="inline-flex items-center gap-[7px]">
              <svg
                className="h-[14px] w-[14px] text-trust"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
              </svg>
              214 country authorities
            </span>
            <span className="inline-flex items-center gap-[7px]">
              <svg
                className="h-[14px] w-[14px] text-trust"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              12,400+ compounds
            </span>
          </div>

          {/* Floaters */}
          <div
            aria-hidden
            className="relative mt-[70px] hidden h-[360px] md:block"
          >
            <FloaterWrapper
              className="left-[8%] top-0 w-[260px]"
              rotate="-3deg"
            >
              <div className="v3-floater rounded-[16px] border border-rule bg-paper p-4 shadow-card">
                <div className="mb-2.5 flex items-center gap-2.5">
                  <StatusBadge status="banned" />
                </div>
                <div className="font-display text-[15px] font-extrabold leading-[1.2]">
                  Adderall &middot; 20mg
                </div>
                <div className="mt-1 text-[12px] text-ink-3">
                  Japan &middot; MHLW
                </div>
              </div>
            </FloaterWrapper>

            <FloaterWrapper
              className="right-[10%] top-10 w-[280px]"
              rotate="2.5deg"
            >
              <div className="v3-floater v3-floater-b rounded-[16px] border border-rule bg-paper p-4 shadow-card">
                <div className="mb-2.5 flex items-center gap-2.5">
                  <StatusBadge status="rx" />
                </div>
                <div className="font-display text-[15px] font-extrabold leading-[1.2]">
                  Tramadol &middot; 50mg
                </div>
                <div className="mt-1 text-[12px] text-ink-3">
                  Spain &middot; AEMPS &mdash; doctor&apos;s note in English
                </div>
              </div>
            </FloaterWrapper>

            {/* Center dark card */}
            <div className="absolute left-1/2 top-[30px] w-[300px] -translate-x-1/2">
              <div className="rounded-[18px] bg-ink p-[18px] text-white shadow-lift">
                <div className="font-display text-[12px] font-extrabold uppercase tracking-[0.08em] text-premium">
                  Verified answer
                </div>
                <div className="my-1.5 flex items-center gap-2.5 font-display text-[18px] font-extrabold text-white">
                  NYC
                  <svg
                    className="w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 12h18M14 6l6 6-6 6" />
                  </svg>
                  DXB
                </div>
                <div className="mt-0.5 text-[12px] text-[#B4A897]">
                  Codeine &middot; 30mg &middot; Restricted
                </div>
                <div className="mt-3.5 border-t border-[#3A3024] pt-3.5 font-mono text-[11px] text-[#8A7E6D]">
                  MoHAP Federal Decree 14/2020
                  <br />
                  Verified Apr 11, 2026
                </div>
              </div>
            </div>

            <FloaterWrapper
              className="left-[22%] top-[200px] w-[230px]"
              rotate="2deg"
            >
              <div className="v3-floater v3-floater-c rounded-[16px] border border-rule bg-paper p-4 shadow-card">
                <div className="mb-2.5 flex items-center gap-2.5">
                  <StatusBadge status="restricted" />
                </div>
                <div className="font-display text-[15px] font-extrabold leading-[1.2]">
                  Pseudoephedrine
                </div>
                <div className="mt-1 text-[12px] text-ink-3">
                  Mexico &middot; COFEPRIS
                </div>
              </div>
            </FloaterWrapper>

            <FloaterWrapper
              className="right-[22%] top-[180px] w-[250px]"
              rotate="-2deg"
            >
              <div className="v3-floater v3-floater-d rounded-[16px] border border-rule bg-paper p-4 shadow-card">
                <div className="mb-2.5 flex items-center gap-2.5">
                  <StatusBadge status="legal" />
                </div>
                <div className="font-display text-[15px] font-extrabold leading-[1.2]">
                  Ibuprofen &middot; 200mg
                </div>
                <div className="mt-1 text-[12px] text-ink-3">
                  Germany &middot; BfArM
                </div>
              </div>
            </FloaterWrapper>
          </div>
        </div>
      </section>

      {/* ============ TRUSTED ROW ============ */}
      <div className="mt-20 flex flex-wrap items-center justify-between gap-10 border-y border-rule bg-cream-2 px-6 py-[26px] md:px-14">
        <div className="font-display text-[13px] font-bold text-ink-2">
          Sourced directly from government authorities
        </div>
        <div className="flex flex-wrap gap-10 font-display text-[14px] font-extrabold tracking-[0.02em] text-ink-3">
          {SOURCES.map((s) => (
            <span key={s} className="opacity-80">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* ============ THREE CARD FEATURE SECTION ============ */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-14">
          <div className="mb-14 text-center">
            <div className="mb-5 inline-flex gap-[5px] rounded-full border border-rule bg-paper p-[5px]">
              {["Search", "Trip", "Share"].map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  className={`cursor-pointer rounded-full border-0 px-[18px] py-2 font-display text-[13px] font-bold ${
                    i === 0
                      ? "bg-brand text-white"
                      : "bg-transparent text-ink-3"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <h2
              className="m-0 mb-3.5 font-display font-black"
              style={{
                fontSize: "clamp(34px, 4vw, 56px)",
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
              }}
            >
              Ask once. Get the whole answer.
            </h2>
            <p className="mx-auto max-w-[580px] text-[17px] text-ink-3">
              Compliance isn&apos;t a yes/no &mdash; it&apos;s a stack of
              documents, thresholds, and deadlines. We surface all of it.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1 — apricot tint */}
            <TintedCard tint="apricot">
              <div className="-mx-1.5 mb-[18px] grid min-h-[150px] place-items-center">
                <svg viewBox="0 0 220 130" width="220" aria-hidden="true">
                  <rect x="20" y="28" width="180" height="80" rx="10" fill="#fff" stroke="#E6DCCC" />
                  <rect x="20" y="66" width="180" height="4" fill="#EFE6D8" />
                  <circle cx="20" cy="68" r="6" fill="#F5EEE4" />
                  <circle cx="200" cy="68" r="6" fill="#F5EEE4" />
                  <text x="40" y="58" fontFamily="Montserrat" fontWeight="900" fontSize="14" fill="#1F1A15">
                    ADDERALL 20MG
                  </text>
                  <text x="40" y="92" fontFamily="JetBrains Mono" fontSize="10" fill="#6E6357">
                    MHLW · JPN · APR 11
                  </text>
                  <rect x="130" y="80" width="60" height="16" rx="4" fill="#F5DFD8" />
                  <text x="160" y="91" textAnchor="middle" fontFamily="Montserrat" fontWeight="800" fontSize="9" fill="#9C3D2A">
                    BANNED
                  </text>
                </svg>
              </div>
              <h3 className="m-0 mb-2 font-display text-[22px] font-extrabold">
                One search, every document.
              </h3>
              <p className="m-0 text-[14.5px] text-ink-2">
                Permit lead times, daily quantity caps, translation requirements,
                and the exact form ID you need &mdash; returned in one page, not
                a 40-link rabbit hole.
              </p>
            </TintedCard>

            {/* Card 2 — ice tint */}
            <TintedCard tint="ice">
              <div className="-mx-1.5 mb-[18px] grid min-h-[150px] place-items-center">
                <svg viewBox="0 0 240 150" width="240" aria-hidden="true">
                  <circle cx="30" cy="80" r="8" fill="#5B9BC5" />
                  <circle cx="120" cy="80" r="8" fill="#8A5E14" />
                  <circle cx="210" cy="80" r="8" fill="#2F6B3F" />
                  <path d="M38 80 Q 75 40 112 80" fill="none" stroke="#5B9BC5" strokeWidth="2" strokeDasharray="3,4" />
                  <path d="M128 80 Q 165 40 202 80" fill="none" stroke="#8A5E14" strokeWidth="2" strokeDasharray="3,4" />
                  <text x="30" y="110" textAnchor="middle" fontFamily="Montserrat" fontWeight="700" fontSize="10" fill="#1F1A15">
                    JFK
                  </text>
                  <text x="120" y="110" textAnchor="middle" fontFamily="Montserrat" fontWeight="700" fontSize="10" fill="#1F1A15">
                    DXB
                  </text>
                  <text x="210" y="110" textAnchor="middle" fontFamily="Montserrat" fontWeight="700" fontSize="10" fill="#1F1A15">
                    BKK
                  </text>
                  <rect x="80" y="120" width="80" height="18" rx="9" fill="#F7ECD4" />
                  <text x="120" y="132" textAnchor="middle" fontFamily="Montserrat" fontWeight="800" fontSize="9" fill="#8A5E14">
                    LAYOVER TRAP
                  </text>
                </svg>
              </div>
              <h3 className="m-0 mb-2 font-display text-[22px] font-extrabold">
                The layover trap, defused.
              </h3>
              <p className="m-0 text-[14.5px] text-ink-2">
                Your medication might be legal at origin and destination &mdash;
                but your 3-hour transit country could still confiscate it. We
                catch that, specifically.
              </p>
            </TintedCard>

            {/* Card 3 — gold tint */}
            <TintedCard tint="gold">
              <div className="-mx-1.5 mb-[18px] grid min-h-[150px] place-items-center">
                <svg viewBox="0 0 220 150" width="220" aria-hidden="true">
                  <rect x="50" y="14" width="120" height="120" rx="14" fill="#fff" stroke="#E6DCCC" />
                  <rect x="62" y="26" width="70" height="8" rx="4" fill="#1F1A15" />
                  <rect x="62" y="42" width="96" height="6" rx="3" fill="#EFE6D8" />
                  <rect x="62" y="56" width="60" height="6" rx="3" fill="#EFE6D8" />
                  <rect x="62" y="78" width="96" height="20" rx="6" fill="#F5DFD8" />
                  <text x="110" y="92" textAnchor="middle" fontFamily="Montserrat" fontWeight="800" fontSize="9" fill="#9C3D2A">
                    BANNED · JAPAN
                  </text>
                  <rect x="62" y="108" width="36" height="14" rx="4" fill="#EFE6D8" />
                  <rect x="104" y="108" width="54" height="14" rx="4" fill="#DE6438" />
                </svg>
              </div>
              <h3 className="m-0 mb-2 font-display text-[22px] font-extrabold">
                Proof you can send in a text.
              </h3>
              <p className="m-0 text-[14.5px] text-ink-2">
                A shareable risk card that fits a message bubble &mdash; for the
                friend, the employer, or the customs officer who wants to see the
                source.
              </p>
            </TintedCard>
          </div>
        </div>
      </section>

      {/* ============ DARK HERO — FOR TEAMS & PHARMACIES ============ */}
      <section className="bg-ink py-[90px] text-[#EFE6D8]">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 md:grid-cols-[1.2fr_1fr] md:gap-[60px] md:px-14">
          <div>
            <div className="mb-3.5 font-display text-[12px] font-bold uppercase tracking-[0.08em] text-premium">
              For teams &amp; pharmacies
            </div>
            <h2
              className="m-0 mb-[18px] font-display font-black text-white"
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Give your patients an answer they can trust &mdash; before they
              board.
            </h2>
            <p className="m-0 mb-7 max-w-[520px] text-[17px] leading-[1.6] text-[#B4A897]">
              Embed CheckOrbit in your pharmacy consult, travel clinic intake,
              or corporate travel portal. Every result carries your white-label
              footer and our source chain.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Button variant="primary">
                Request API access
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Button>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-[#4a4034] bg-transparent px-[18px] py-[11px] font-display text-[13px] font-bold text-white"
              >
                Book a demo
              </button>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#3A3024] bg-[#2A231B] p-[26px]">
            <div className="mb-3 font-mono text-[11px] text-[#8A7E6D]">
              POST /api/v1/check
            </div>
            <pre className="m-0 whitespace-pre-wrap font-mono text-[12.5px] leading-[1.7] text-brand-light">
              <span className="text-[#B4A897]">{"{"}</span>
              {"\n  "}
              <span className="text-premium">&quot;medication&quot;</span>
              {": "}
              <span className="text-white">&quot;Adderall 20mg&quot;</span>
              {",\n  "}
              <span className="text-premium">&quot;destination&quot;</span>
              {": "}
              <span className="text-white">&quot;JPN&quot;</span>
              {",\n  "}
              <span className="text-premium">&quot;transit&quot;</span>
              {": ["}
              <span className="text-white">&quot;DXB&quot;</span>
              {"],\n  "}
              <span className="text-premium">&quot;quantity_days&quot;</span>
              {": "}
              <span className="text-trust">30</span>
              {"\n"}
              <span className="text-[#B4A897]">{"}"}</span>
              {"\n\n"}
              <span className="text-[#8A7E6D]">{"→ 200 OK  (1.8s)"}</span>
              {"\n"}
              <span className="text-[#B4A897]">{"{"}</span>
              {"\n  "}
              <span className="text-premium">&quot;status&quot;</span>
              {": "}
              <span className="text-white">&quot;BANNED&quot;</span>
              {",\n  "}
              <span className="text-premium">&quot;source&quot;</span>
              {": "}
              <span className="text-white">&quot;MHLW 1951.14&quot;</span>
              {",\n  "}
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

function FloaterWrapper({
  className,
  rotate,
  children,
}: {
  className: string;
  rotate: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      {children}
    </div>
  );
}

type TintedCardProps = {
  tint: "apricot" | "ice" | "gold";
  children: React.ReactNode;
};

function TintedCard({ tint, children }: TintedCardProps) {
  const tints: Record<TintedCardProps["tint"], string> = {
    apricot: "bg-[#FBEADD] border-brand-soft",
    ice: "bg-trust-soft border-trust-light",
    gold: "bg-[#F9EFC9] border-[#ECDA93]",
  };
  return (
    <div
      className={`relative flex min-h-[340px] flex-col overflow-hidden rounded-[20px] border p-[26px] ${tints[tint]}`}
    >
      {children}
    </div>
  );
}

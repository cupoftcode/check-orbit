import Link from "next/link";
import Logo from "./ds/Logo";

type Column = { heading: string; links: { label: string; href: string }[] };

const COLUMNS: Column[] = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#" },
      { label: "Countries", href: "#" },
      { label: "Compounds", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    heading: "For business",
    links: [
      { label: "Pharmacies", href: "#" },
      { label: "Travel clinics", href: "#" },
      { label: "API", href: "#" },
      { label: "White-label", href: "#" },
    ],
  },
  {
    heading: "Sources",
    links: [
      { label: "Verification method", href: "#" },
      { label: "Source registry", href: "#" },
      { label: "Update log", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function V3Footer() {
  return (
    <footer className="mt-[60px] bg-ink px-6 pt-20 pb-10 text-[#EFE6D8] md:px-14">
      <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Link
            href="/v3"
            className="mb-3 flex items-center gap-2.5 font-display text-[22px] font-extrabold tracking-[-0.02em] text-white no-underline"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center">
              <Logo className="h-full w-full block" gradientId="v3LogoFooter" />
            </span>
            Check<span className="font-bold opacity-60">Orbit</span>
          </Link>
          <p className="m-0 mt-3.5 max-w-[320px] text-[13px] leading-[1.55] text-[#8A7E6D]">
            CheckOrbit is not legal or medical advice. Always carry original
            prescriptions and follow the verification steps for your destination.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h4 className="m-0 mb-3.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white">
              {col.heading}
            </h4>
            {col.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="block py-[5px] text-[14px] text-[#C9BFB0] no-underline hover:text-brand-light"
              >
                {l.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-[50px] flex max-w-[1280px] flex-wrap justify-between gap-5 border-t border-[#3A3024] pt-6 text-[12px] text-[#8A7E6D]">
        <div>© 2026 CheckOrbit · Verified by people, served by software.</div>
        <div>Last global source refresh: Apr 11, 2026 · 04:20 UTC</div>
      </div>
    </footer>
  );
}

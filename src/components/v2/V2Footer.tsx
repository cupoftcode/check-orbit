import Link from "next/link";
import { WordMark } from "@/components/v2/ds/Logo";

const COL_PRODUCT = [
  { href: "/v2/check", label: "How it works" },
  { href: "/v2/coverage", label: "Countries" },
  { href: "/v2/check", label: "Compounds" },
  { href: "/v2/pricing", label: "Pricing" },
];

const COL_BUSINESS = [
  { href: "/v2/pricing", label: "Pharmacies" },
  { href: "/v2/pricing", label: "Travel clinics" },
  { href: "/v2/pricing", label: "API" },
  { href: "/v2/pricing", label: "White-label" },
];

const COL_SOURCES = [
  { href: "/v2/check", label: "Verification method" },
  { href: "/v2/check", label: "Source registry" },
  { href: "/v2/check", label: "Update log" },
  { href: "/contact", label: "Contact" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="font-display font-extrabold text-[10px] tracking-[0.1em] uppercase text-[#8A7E6D] mb-3.5">
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[14px] text-[#B4A897] no-underline hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function V2Footer() {
  return (
    <footer className="mt-auto bg-ink text-[#EFE6D8]">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="mb-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/v2" className="no-underline">
              <WordMark className="text-[18px] text-[#F7F1EA]" />
            </Link>
            <p className="mt-3 max-w-xs text-[14px] text-[#8A7E6D] leading-[1.55]">
              CheckOrbit is not legal or medical advice. Always carry original
              prescriptions and follow the verification steps for your
              destination.
            </p>
          </div>

          <FooterColumn title="Product" links={COL_PRODUCT} />
          <FooterColumn title="For business" links={COL_BUSINESS} />
          <FooterColumn title="Sources" links={COL_SOURCES} />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#3A3024]">
          <p className="text-[12px] text-ink-3">
            &copy; {new Date().getFullYear()} CheckOrbit &middot; Verified by
            people, served by software.
          </p>
          <p className="font-mono text-[12px] text-ink-3">
            Last global source refresh: Apr 11, 2026 &middot; 04:20 UTC
          </p>
        </div>
      </div>
    </footer>
  );
}

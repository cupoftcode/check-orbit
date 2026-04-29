import Link from "next/link";
import Logo from "./ds/Logo";
import Button from "./ds/Button";

const LINKS = [
  { label: "Product", href: "#" },
  { label: "Countries", href: "#" },
  { label: "For pharmacists", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Sources", href: "#" },
];

export function V3Header() {
  return (
    <nav className="flex items-center justify-between bg-transparent px-6 py-[22px] md:px-14">
      <Link
        href="/v3"
        className="flex items-center gap-2.5 font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink no-underline"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          <Logo className="h-full w-full block" gradientId="v3LogoHeader" />
        </span>
        Check<span className="font-bold opacity-60">Orbit</span>
      </Link>

      <div className="hidden items-center gap-[30px] font-display text-[14px] font-semibold md:flex">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-ink-2 no-underline hover:text-brand"
          >
            {l.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
          Sign in
        </Button>
        <Button variant="primary" size="sm">
          Start a check
          <svg
            className="h-3 w-3"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Button>
      </div>
    </nav>
  );
}

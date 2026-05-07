"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { WordMark } from "@/components/v2/ds/Logo";
import Button from "@/components/v2/ds/Button";

const NAV_LINKS = [
  { href: "/v2/check", label: "Product" },
  { href: "/v2/coverage", label: "Countries" },
  { href: "/v2/pricing", label: "For pharmacists" },
  { href: "/v2/pricing", label: "Pricing" },
  { href: "/v2/check", label: "Sources" },
];

export function V2Header() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream border-b border-rule backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4">
        {/* Wordmark lockup */}
        <Link href="/v2" className="no-underline">
          <WordMark className="text-[18px]" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-display font-semibold text-[13px] py-1.5 px-3 rounded-lg transition-colors ${
                pathname === link.href
                  ? "text-ink bg-cream-2"
                  : "text-ink-3 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoaded && isSignedIn && (
            <>
              <Link
                href="/v2/account"
                className={`font-display font-semibold text-[13px] py-1.5 px-3 rounded-lg ${
                  pathname.startsWith("/v2/account")
                    ? "text-ink bg-cream-2"
                    : "text-ink-3 hover:text-ink"
                }`}
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          )}
          {isLoaded && !isSignedIn && (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <Link href="/v2/check" className="no-underline">
                <Button variant="primary" size="sm">
                  Start a check
                  <svg width="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 -mr-2 text-ink-3 bg-transparent border-0 cursor-pointer"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-rule bg-paper">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-display font-semibold text-[14px] py-2.5 px-3 rounded-lg no-underline ${
                  pathname === link.href
                    ? "text-ink bg-cream-2"
                    : "text-ink-3"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoaded && isSignedIn && (
              <Link
                href="/v2/account"
                onClick={() => setMobileOpen(false)}
                className="font-display font-semibold text-[14px] py-2.5 px-3 rounded-lg text-ink-3 no-underline"
              >
                Dashboard
              </Link>
            )}
            {isLoaded && !isSignedIn && (
              <div className="mt-2 flex gap-2 px-3">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </SignInButton>
                <Link
                  href="/v2/check"
                  onClick={() => setMobileOpen(false)}
                  className="no-underline"
                >
                  <Button variant="primary" size="sm">
                    Start a check
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

import Link from "next/link";

const PRODUCT_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/coverage", label: "Coverage map" },
  { href: "/itinerary", label: "Itinerary checker" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-[1200px] px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-bold text-brand-500">
              Check Orbit
            </Link>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Instant medication compliance answers for international travelers.
              Know before you go.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-semibold mb-3">Product</p>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold mb-3">Legal</p>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer + copyright */}
        <div className="border-t pt-6 space-y-3">
          <p className="text-xs text-muted-foreground">
            This information is provided for informational purposes only and does
            not constitute legal or medical advice. Always verify with destination
            country authorities before traveling.
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Check Orbit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

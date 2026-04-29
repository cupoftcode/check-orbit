import Link from "next/link";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: "-0.03em",
            color: "var(--color-ink)",
          }}
        >
          My Account
        </h1>
        <nav className="flex gap-1">
          {[
            { href: "/v2/account", label: "Saved Searches" },
            { href: "/v2/account/settings", label: "Settings" },
            { href: "/v2/account/subscription", label: "Subscription" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontWeight: 700,
                fontSize: 13,
                padding: "8px 16px",
                borderRadius: 999,
                color: "var(--color-ink-3)",
                textDecoration: "none",
                transition: "background 0.15s, color 0.15s",
              }}
              className="hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </main>
  );
}

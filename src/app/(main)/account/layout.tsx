import Link from "next/link";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Account</h1>
        <nav className="flex gap-4 text-sm">
          <Link
            href="/account"
            className="text-muted-foreground hover:text-foreground"
          >
            Saved Searches
          </Link>
          <Link
            href="/account/settings"
            className="text-muted-foreground hover:text-foreground"
          >
            Settings
          </Link>
        </nav>
      </div>
      {children}
    </main>
  );
}

import Link from "next/link";
import { ListChecks, History } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Change Queue", icon: ListChecks },
  { href: "/admin/audit", label: "Audit Trail", icon: History },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar — hidden on mobile, shown on md+ */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r bg-muted/30 p-4 gap-1">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Curator Dashboard
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background">
        <nav className="flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center gap-0.5 py-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}

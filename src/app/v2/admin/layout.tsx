import Link from "next/link";
import { ListChecks, History } from "lucide-react";

const NAV_ITEMS = [
  { href: "/v2/admin", label: "Change Queue", icon: ListChecks },
  { href: "/v2/admin/audit", label: "Audit Trail", icon: History },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar -- hidden on mobile, shown on md+ */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col p-4 gap-1 bg-cream-2 border-r border-rule">
        <p className="font-display font-bold text-[11px] tracking-[0.12em] uppercase text-brand py-1 px-2 mb-3">
          Curator Dashboard
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-[10px] font-display font-bold text-[13px] text-ink-3 no-underline transition-colors hover:bg-cream hover:text-ink"
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-rule bg-cream">
        <nav className="flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center gap-0.5 py-2 font-display font-bold text-[11px] text-ink-3 no-underline"
              >
                <Icon size={20} />
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

import { prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "Coverage Map — Check Orbit",
  description: "See which countries Check Orbit covers for medication compliance data.",
};

export const dynamic = "force-dynamic";

export default async function CoveragePage() {
  const countries = await prisma.country.findMany({
    orderBy: [{ isCovered: "desc" }, { popularityRank: "asc" }, { name: "asc" }],
    select: {
      name: true,
      code: true,
      flagEmoji: true,
      isCovered: true,
    },
  });

  const covered = countries.filter((c) => c.isCovered);
  const uncovered = countries.filter((c) => !c.isCovered);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Coverage Map</h1>
      <p className="text-muted-foreground mb-8">
        Check Orbit currently has verified regulatory data for{" "}
        <strong>{covered.length}</strong> countries.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Covered Countries ({covered.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {covered.map((c) => (
            <div
              key={c.code}
              className="flex items-center gap-2 rounded-md border p-3"
            >
              <span aria-hidden="true">{c.flagEmoji}</span>
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {uncovered.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Not Yet Covered ({uncovered.length})
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            We&apos;re working on adding more countries. These are on our
            roadmap.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {uncovered.map((c) => (
              <div
                key={c.code}
                className="flex items-center gap-2 rounded-md border border-dashed p-3 opacity-60"
              >
                <span aria-hidden="true">{c.flagEmoji}</span>
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

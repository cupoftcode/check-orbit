import { prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "Coverage Map — Check Orbit",
  description:
    "See which countries Check Orbit covers for medication compliance data.",
};

export const dynamic = "force-dynamic";

export default async function CoveragePage() {
  const countries = await prisma.country.findMany({
    orderBy: [
      { isCovered: "desc" },
      { popularityRank: "asc" },
      { name: "asc" },
    ],
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
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-20">
      {/* Header */}
      <p className="font-display font-bold text-[11px] tracking-[0.12em] uppercase text-brand mb-2.5">
        Global Reach
      </p>
      <h1 className="font-display font-black text-[34px] tracking-tighter text-ink mb-2">
        Coverage Map
      </h1>
      <p className="text-[16px] text-ink-3 mb-8 leading-[1.5]">
        Check Orbit currently has verified regulatory data for{" "}
        <strong className="text-ink font-semibold">
          {covered.length}
        </strong>{" "}
        countries.
      </p>

      {/* Covered Countries */}
      <section className="mb-12">
        <h2 className="font-display font-extrabold text-[20px] text-ink mb-4">
          Covered Countries ({covered.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {covered.map((c) => (
            <div
              key={c.code}
              className="flex items-center gap-3 bg-paper border border-rule rounded-[14px] py-3 px-4 shadow-card"
            >
              <span aria-hidden="true" className="text-[20px]">
                {c.flagEmoji}
              </span>
              <span className="text-[14px] font-medium text-ink">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Uncovered Countries */}
      {uncovered.length > 0 && (
        <section>
          <h2 className="font-display font-extrabold text-[20px] text-ink mb-2">
            Not Yet Covered ({uncovered.length})
          </h2>
          <p className="text-[14px] text-ink-3 mb-4">
            We&apos;re working on adding more countries. These are on our
            roadmap.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uncovered.map((c) => (
              <div
                key={c.code}
                className="flex items-center gap-3 bg-cream-2 border border-dashed border-rule rounded-[14px] py-3 px-4 opacity-70"
              >
                <span aria-hidden="true" className="text-[20px]">
                  {c.flagEmoji}
                </span>
                <span className="text-[14px] font-medium text-ink-3">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

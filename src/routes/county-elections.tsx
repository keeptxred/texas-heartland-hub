import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { COUNTIES } from "@/data/counties";

export const Route = createFileRoute("/county-elections")({
  head: () => ({
    meta: [
      { title: "County Election Pages — Keep TX Red" },
      { name: "description", content: "Local election information for major Texas counties — Harris, Dallas, Tarrant, Bexar, Travis, Collin, Denton, Williamson, Fort Bend, El Paso." },
      { property: "og:title", content: "County Election Pages" },
    ],
    links: [{ rel: "canonical", href: "/county-elections" }],
  }),
  component: CountyElectionsPage,
});

function CountyElectionsPage() {
  return (
    <>
      <PageHero eyebrow="Local Elections" title="COUNTY" highlight="ELECTION PAGES" description="Texas runs elections at the county level. Find your county elections office, ballot information, and key dates." />
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COUNTIES.map((c) => (
            <div key={c.slug} className="border-2 border-foreground/10 bg-card p-6">
              <h2 className="font-display text-2xl tracking-tight">{c.name}</h2>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{c.region}</p>
              <dl className="mt-4 space-y-1 text-sm text-muted-foreground">
                <div><dt className="inline font-semibold text-foreground">School Districts tracked:</dt> {c.schoolDistricts.length}</div>
                <div><dt className="inline font-semibold text-foreground">County M&amp;O Rate:</dt> ${c.countyRate.toFixed(4)} / $100</div>
              </dl>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(c.name + " Texas elections office polling locations")}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-primary hover:underline"
              >County Elections Office →</a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
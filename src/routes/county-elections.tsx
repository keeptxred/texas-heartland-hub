import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { COUNTIES } from "@/data/counties";

const URL = "https://keeptxred.com/county-elections";

export const Route = createFileRoute("/county-elections")({
  head: () => ({
    meta: [
      { title: "Texas County Election Offices & Ballot Resources | Keep TX Red" },
      {
        name: "description",
        content:
          "Find Texas county election resources, official ballot links, Election Central races, districts, candidates, and voting information.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Texas County Election Offices & Ballot Resources" },
      {
        property: "og:description",
        content:
          "Browse Texas counties and continue to official county election offices, ballot research, and 2026 Election Central coverage.",
      },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: CountyElectionsPage,
});

function CountyElectionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Local Elections"
        title="TEXAS COUNTY"
        highlight="ELECTION RESOURCES"
        description="Texas counties administer elections locally. Find your county and continue to official election-office, ballot, and Election Central resources."
      />
      <div className="mx-auto max-w-6xl px-4 py-14">
        <section className="mb-10 grid gap-5 md:grid-cols-3" aria-label="Election Central resources">
          <ElectionResource
            href="/elections/2026"
            title="2026 Election Central"
            description="Follow verified Texas races, candidates, polling, forecasts, and results."
          />
          <ElectionResource
            href="/elections/districts"
            title="Texas election districts"
            description="Browse congressional, Texas House, and Texas Senate district pages."
          />
          <ElectionResource
            href="/elections/voting"
            title="Texas ballot research"
            description="Browse published races and continue to official voter and ballot tools."
          />
        </section>

        <section aria-labelledby="county-directory-heading">
          <h2 id="county-directory-heading" className="font-display text-3xl tracking-tight">
            Texas county directory
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Select the official Texas county-election-office directory to locate the responsible
            election authority for any of Texas&apos; 254 counties.
          </p>
          <a
            href="https://www.sos.state.tx.us/elections/voter/county.shtml"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground"
          >
            Open the official Texas county election office directory
          </a>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {COUNTIES.map((county) => (
              <article key={county.slug} className="border-2 border-foreground/10 bg-card p-6">
                <h3 className="font-display text-2xl tracking-tight">{county.name} County</h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {county.region}
                </p>
                <a
                  href={`/elections/races?browse=county&area=${encodeURIComponent(`${county.name} County`)}`}
                  className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                >
                  Browse {county.name} County election races →
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function ElectionResource({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a href={href} className="rounded-xl border bg-card p-6 shadow-sm hover:border-primary">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </a>
  );
}

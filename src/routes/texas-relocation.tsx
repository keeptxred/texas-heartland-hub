import { createFileRoute } from "@tanstack/react-router";
import {
  LAUNCH_CALCULATOR_PATHS,
  LAUNCH_COUNTIES,
  LAUNCH_GUIDES,
  RELOCATION_LAUNCH_PATH,
} from "@/data/relocationLaunch";
import { getCalculatorBySlug } from "@/data/calculators";

const BASE_URL = "https://www.keeptxred.com";

export const Route = createFileRoute("/texas-relocation")({
  head: () => ({
    meta: [
      { title: "Moving to Texas: Relocation Calculators, County Guides & Planning Tools" },
      {
        name: "description",
        content:
          "Plan a move to Texas with transparent calculators, county relocation hubs, official local sources, and practical guides for taxes, housing, utilities, and cost of living.",
      },
      { property: "og:title", content: "Texas Relocation Planning Center" },
      {
        property: "og:description",
        content: "Compare costs, explore major Texas counties, and build a practical relocation plan.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}${RELOCATION_LAUNCH_PATH}` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}${RELOCATION_LAUNCH_PATH}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Texas Relocation Planning Center",
          description: "Texas relocation calculators, county hubs, and moving guides.",
          url: `${BASE_URL}${RELOCATION_LAUNCH_PATH}`,
          hasPart: [
            ...LAUNCH_COUNTIES.map((county) => ({
              "@type": "WebPage",
              name: `${county.name} Relocation Guide`,
              url: `${BASE_URL}${RELOCATION_LAUNCH_PATH}/${county.slug}`,
            })),
            ...LAUNCH_CALCULATOR_PATHS.map((path) => ({
              "@type": "WebApplication",
              url: `${BASE_URL}${path}`,
            })),
          ],
        }),
      },
    ],
  }),
  component: TexasRelocationLanding,
});

function TexasRelocationLanding() {
  return (
    <main>
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Texas Relocation Center</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-none tracking-tight md:text-7xl">
            PLAN YOUR MOVE TO TEXAS
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">
            Use transparent calculators, official local sources, and practical county guides to compare housing, property taxes, utilities, transportation, and first-year relocation costs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground" href="/tools/unified-texas-relocation-planner">
              Build my relocation plan
            </a>
            <a className="border border-white/50 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white" href="#counties">
              Explore counties
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl tracking-tight">Start with the essential calculators</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Results are planning estimates. Local tax, insurance, utility, lending, and housing inputs remain editable so you can replace assumptions with exact quotes and official records.
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {LAUNCH_CALCULATOR_PATHS.map((path) => {
            const calculator = getCalculatorBySlug(path);
            return (
              <a key={path} href={path} className="border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="font-display text-2xl">{calculator?.title ?? "Texas planning calculator"}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {calculator?.description ?? "Use adjustable inputs to build a transparent Texas relocation estimate."}
                </p>
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-primary">Open tool →</span>
              </a>
            );
          })}
        </div>
      </section>

      <section id="counties" className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-3xl tracking-tight">Initial Texas county relocation hubs</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Each hub connects you to the county and appraisal district, then points you to the calculators and guides most useful for local planning.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LAUNCH_COUNTIES.map((county) => (
              <a key={county.slug} href={`${RELOCATION_LAUNCH_PATH}/${county.slug}`} className="border border-border bg-card p-5 hover:border-primary">
                <h3 className="font-display text-xl">{county.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{county.metro} metro • County seat: {county.countySeat}</p>
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-primary">County guide →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl tracking-tight">Texas relocation guides</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {LAUNCH_GUIDES.map((guide) => (
            <article key={guide.slug} className="border-l-4 border-primary bg-muted p-6">
              <h3 className="font-display text-2xl">{guide.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
              <p className="mt-4 text-xs text-muted-foreground">Full guide route is part of the next Milestone 2 content batch.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

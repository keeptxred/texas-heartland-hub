import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";

export const Route = createFileRoute("/texas-business")({
  head: () => ({
    meta: [
      { title: "Texas Business News – Economy, Jobs & Growth Updates" },
      { name: "description", content: "Texas business news on the state economy, jobs, energy, corporate relocations, and the policy decisions shaping growth across Houston, Dallas, Austin, and San Antonio." },
      { property: "og:title", content: "Texas Business News – Economy, Jobs & Growth Updates" },
      { property: "og:description", content: "Texas business news on the state economy, jobs, energy, and corporate growth." },
      { property: "og:url", content: "https://www.keeptxred.com/texas-business" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/texas-business" }],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    const t = typeof search.topic === "string" ? search.topic : "";
    const allowed = ["energy", "jobs", "relocations", "real-estate", "policy"];
    return { topic: allowed.includes(t) ? (t as string) : "" };
  },
  component: BusinessPage,
});

function BusinessPage() {
  const { topic } = Route.useSearch();
  const lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const BUSINESS_SLUGS: Record<string, string[]> = {
    energy: [
      "texas-energy-economy-overview",
      "permian-energy",
      "texas-energy-policy-guide",
      "texas-grid-ercot-explained",
    ],
    jobs: [
      "texas-energy-economy-overview",
      "why-texas-has-no-income-tax",
    ],
    relocations: [
      "why-texas-has-no-income-tax",
      "what-local-governments-control",
    ],
    "real-estate": [
      "texas-water-rights-explained",
      "property-tax-relief-package",
      "county-appraisal-districts-explained",
      "texas-property-tax-guide",
      "isd-tax-burdens",
      "how-texas-counties-spend",
    ],
    policy: [
      "texas-energy-policy-guide",
      "property-tax-relief-package",
      "what-local-governments-control",
    ],
  };
  const ALL_SLUGS = Array.from(new Set(Object.values(BUSINESS_SLUGS).flat()));
  const activeSlugs = topic && BUSINESS_SLUGS[topic] ? BUSINESS_SLUGS[topic] : ALL_SLUGS;
  const businessArticles = activeSlugs
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a) && isPublished(a!))
    .sort(sortByDateDesc);
  const SECTIONS = [
    { id: "energy", title: "Energy", description: "Oil and gas, the ERCOT grid, renewables, and Permian production." },
    { id: "jobs", title: "Jobs & Workforce", description: "Hiring trends, wages, and the Texas labor market." },
    { id: "relocations", title: "Relocations", description: "Corporate HQ moves to Austin, Dallas-Fort Worth, and Houston." },
    { id: "real-estate", title: "Real Estate", description: "Commercial development, housing supply, and property taxes." },
    { id: "policy", title: "Policy", description: "Legislative changes that affect Texas businesses and small employers." },
  ];
  const activeSection = SECTIONS.find((s) => s.id === topic);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-6 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Texas Business</span>
            <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">
              Texas Business News &amp; Economy
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
              Coverage of the Texas economy, jobs, and the companies driving growth across the state — oil and gas, manufacturing, technology, finance, and the corporate relocations bringing capital and headcount to Houston, Dallas, Austin, and San Antonio.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
          <div className="shrink-0 lg:max-w-xs">
            <h2 className="font-sans text-lg font-semibold tracking-tight text-foreground">Related Tools</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/tax-calculator" className="text-primary hover:underline">Property tax calculator by county →</Link></li>
              <li><Link to="/texas-economy" className="text-primary hover:underline">Texas economy section →</Link></li>
              <li><Link to="/legislative-updates" className="text-primary hover:underline">Legislative updates →</Link></li>
              <li><Link to="/texas-laws" className="text-primary hover:underline">Texas laws explained →</Link></li>
            </ul>
          </div>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground mb-4">What we cover</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              to="/texas-business"
              search={{ topic: topic === s.id ? "" : s.id }}
              className={`group block border-2 p-5 transition-colors ${
                topic === s.id
                  ? "border-primary bg-primary/5"
                  : "border-foreground/10 bg-card hover:border-primary hover:bg-primary/5"
              }`}
            >
              <h3 className="font-sans text-lg font-semibold tracking-tight group-hover:text-primary">{s.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
              <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-primary">
                {topic === s.id ? "Showing ✓ — clear" : "Filter →"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
              {activeSection ? `${activeSection.title} coverage` : "Latest Texas business coverage"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeSection ? activeSection.description : "Energy, taxes, jobs, and the policy stories shaping the Texas economy."}
            </p>
          </div>
          {activeSection && (
            <Link to="/texas-business" search={{ topic: "" }} className="text-sm text-primary hover:underline">
              Show all business coverage →
            </Link>
          )}
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessArticles.map((a) => (
            <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-muted mb-3">
                <img src={a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{a.category}</span>
              <h3 className="font-serif text-base font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.dek}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">More from Keep Texas Red</h2>
        <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <li><Link to="/texas-news" className="text-primary hover:underline">Texas News →</Link></li>
          <li><Link to="/texas-politics" className="text-primary hover:underline">Texas Politics →</Link></li>
          <li><Link to="/houston" className="text-primary hover:underline">Houston News →</Link></li>
          <li><Link to="/texas-sports" className="text-primary hover:underline">Texas Sports →</Link></li>
          <li><Link to="/elections" className="text-primary hover:underline">Elections →</Link></li>
        </ul>
      </section>
    </div>
  );
}
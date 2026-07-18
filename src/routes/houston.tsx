import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { matchesTopic } from "@/lib/article-filters";

const HOUSTON_TOPICS = [
  { id: "property-taxes", label: "Property Taxes" },
  { id: "energy", label: "Energy" },
  { id: "schools", label: "Schools" },
  { id: "growth", label: "Growth" },
];

export const Route = createFileRoute("/houston")({
  validateSearch: (search: Record<string, unknown>) => ({
    topic: typeof search.topic === "string" ? search.topic : "",
  }),
  head: ({ match }) => {
    const topic = (match.search as { topic?: string } | undefined)?.topic ?? "";
    const canonical = "https://www.keeptxred.com/houston";
    return {
      meta: [
        { title: "Houston News – Local Updates from Across the Metro" },
        { name: "description", content: "Houston news and local updates from across the metro — Katy, Sugar Land, Cypress, The Woodlands, Pearland — covering politics, growth, and Texas issues that hit home." },
        { property: "og:title", content: "Houston News – Local Updates from Across the Metro" },
        { property: "og:description", content: "Houston news and local updates from across the metro and surrounding Texas communities." },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        ...(topic ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: HoustonPage,
});

function HoustonPage() {
  const { topic } = Route.useSearch();
  const lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const HOUSTON_SLUGS = [
    "texas-property-tax-guide",
    "homestead-exemption-explained",
    "appraisal-protest-playbook",
    "texas-school-board-powers",
    "texas-school-finance-explained",
    "texas-energy-economy-overview",
    "texas-energy-policy-guide",
    "texas-grid-ercot-explained",
    "texas-border-policy-full-guide",
    "texas-voting-guide-2026",
    "what-local-governments-control",
    "why-texas-has-no-income-tax",
  ];
  const curated = HOUSTON_SLUGS
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a) && isPublished(a!));
  const houstonArticles = (topic ? curated.filter((a) => matchesTopic(a, topic)) : curated).sort(sortByDateDesc);
  const uniqImg = assignUniqueImages(houstonArticles, (a) => a.slug, (a) => a.image, () => "relocation");
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-6 mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Local · Houston</span>
        <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">
          Houston News &amp; Local Texas Updates
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
          Coverage of the Houston metro and the communities around it — Katy, Sugar Land, Cypress, The Woodlands, Pearland, and Galveston County. Local government, growth, property taxes, transportation, and the policy decisions reshaping the largest metro in Texas.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        <section>
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">What we cover in Houston</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">City Hall &amp; Harris County:</strong> Budget fights, public safety, and the commissioners court.</li>
            <li><strong className="text-foreground">Suburban growth:</strong> Katy ISD, Fort Bend, and the Cypress-Fairbanks corridor.</li>
            <li><strong className="text-foreground">Energy capital:</strong> The companies, jobs, and policy decisions powering the Houston economy.</li>
            <li><strong className="text-foreground">Property taxes:</strong> Appraisal districts, ISD rates, and what homeowners actually pay.</li>
            <li><strong className="text-foreground">Public safety:</strong> HPD, county constables, and the courts.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">Tools for Houston residents</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/tax-calculator" className="text-primary hover:underline">Property tax calculator (Harris, Fort Bend, Montgomery) →</Link></li>
            <li><Link to="/find-representative" className="text-primary hover:underline">Find your Texas representative →</Link></li>
            <li><Link to="/voting-locations" className="text-primary hover:underline">Houston-area voting locations →</Link></li>
            <li><Link to="/register-to-vote" className="text-primary hover:underline">Register to vote in Texas →</Link></li>
            <li><Link to="/contact-legislators" className="text-primary hover:underline">Contact your legislators →</Link></li>
          </ul>
        </section>
      </div>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">Latest Houston-area coverage</h2>
        <p className="mt-2 text-sm text-muted-foreground">Property taxes, energy, growth, and the policy stories driving the Houston metro.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/houston"
            search={{ topic: "" }}
            className={`text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 border ${
              !topic ? "bg-foreground text-background border-foreground" : "border-border hover:border-primary hover:text-primary"
            }`}
          >
            All
          </Link>
          {HOUSTON_TOPICS.map((t) => {
            const active = topic === t.id;
            return (
              <Link
                key={t.id}
                to="/houston"
                search={{ topic: active ? "" : t.id }}
                className={`text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 border ${
                  active ? "bg-foreground text-background border-foreground" : "border-border hover:border-primary hover:text-primary"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {houstonArticles.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No articles currently available in this topic. Browse related Texas coverage.
              </p>
              <Link to="/houston" search={{ topic: "" }} className="mt-3 inline-block text-sm text-primary hover:underline">
                ← Back to all Houston coverage
              </Link>
            </div>
          )}
          {houstonArticles.map((a) => (
            <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-muted mb-3">
                <img src={uniqImg.get(a.slug) ?? a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{a.category}</span>
              <h3 className="font-serif text-base font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.dek}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">Related coverage</h2>
        <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <li><Link to="/texas-news" className="text-primary hover:underline">Statewide Texas News →</Link></li>
          <li><Link to="/texas-politics" className="text-primary hover:underline">Texas Politics →</Link></li>
          <li><Link to="/texas-business" className="text-primary hover:underline">Texas Business →</Link></li>
          <li><Link to="/texas-sports" className="text-primary hover:underline">Texas Sports →</Link></li>
          <li><Link to="/elections" className="text-primary hover:underline">Elections →</Link></li>
          <li><Link to="/county-elections" className="text-primary hover:underline">County Elections →</Link></li>
        </ul>
      </section>
    </div>
  );
}
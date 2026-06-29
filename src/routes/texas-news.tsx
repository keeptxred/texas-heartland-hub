import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { AgedFeedSection } from "@/components/aged-feed-section";
import { assignUniqueImages } from "@/lib/dedupe-images";

export const Route = createFileRoute("/texas-news")({
  head: () => ({
    meta: [
      { title: "Texas News – Breaking News & Statewide Updates" },
      { name: "description", content: "Breaking Texas news and statewide updates on politics, the economy, energy, education, and the stories shaping life in the Lone Star State." },
      { property: "og:title", content: "Texas News – Breaking News & Statewide Updates" },
      { property: "og:description", content: "Breaking Texas news and statewide updates from across the Lone Star State." },
      { property: "og:url", content: "https://www.keeptxred.com/texas-news" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/texas-news" }],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    const t = typeof search.topic === "string" ? search.topic : "";
    const allowed = ["legislature", "border", "elections", "tax-spending", "energy", "education"];
    return { topic: allowed.includes(t) ? (t as string) : "" };
  },
  component: TexasNewsPage,
});

function TexasNewsPage() {
  const { topic } = Route.useSearch();
  const lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const SECTIONS = [
    { id: "legislature", title: "Legislature", category: "Legislature", description: "The Texas House, Senate, and the bills moving through Austin." },
    { id: "border", title: "Border", category: "Border", description: "Border security, immigration enforcement, and the Rio Grande Valley." },
    { id: "elections", title: "Elections", category: "Elections", description: "Campaigns, primaries, and election integrity across Texas." },
    { id: "tax-spending", title: "Tax & Spending", category: "Tax & Spending", description: "Property taxes, the state budget, and how Texas spends your money." },
    { id: "energy", title: "Energy", category: "Energy", description: "Oil and gas, ERCOT, and the policies powering the Texas grid." },
    { id: "education", title: "Education", category: "Education", description: "Public schools, school choice, and curriculum debates." },
  ];
  const activeSection = SECTIONS.find((s) => s.id === topic);
  const all = ARTICLES.filter((a) => isPublished(a)).sort(sortByDateDesc);
  const articles = activeSection ? all.filter((a) => a.category === activeSection.category) : all;
  const uniqImg = assignUniqueImages(articles, (a) => a.slug, (a) => a.image);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-6 mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Texas News</span>
        <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">
          Texas News &amp; Statewide Updates
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
          Independent reporting on breaking Texas news — politics in Austin, energy and the economy, border security, and the policy fights shaping daily life across the state. Updated every morning.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      <section className="mb-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground mb-4">What we cover</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              to="/texas-news"
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

      <section className="border-t border-border pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
              {activeSection ? `${activeSection.title} coverage` : "Latest Texas coverage"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeSection ? activeSection.description : "The newest reporting from across the state."}
            </p>
          </div>
          {activeSection && (
            <Link to="/texas-news" search={{ topic: "" }} className="text-sm text-primary hover:underline">
              Show all Texas news →
            </Link>
          )}
        </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {articles.map((a) => (
          <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block">
            <div className="aspect-[16/10] overflow-hidden bg-muted mb-4 rounded-md">
              <img src={uniqImg.get(a.slug) ?? a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{a.category}</span>
            <h2 className="font-sans text-base font-semibold mt-1.5 leading-snug text-foreground group-hover:text-primary transition-colors">{a.title}</h2>
            {a.dek && <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{a.dek}</p>}
            <p className="mt-2 text-xs text-muted-foreground">{a.author} • {a.date}</p>
          </Link>
        ))}
      </div>
      </section>

      <AgedFeedSection
        section="news"
        title="Latest Statewide Updates"
        blurb="Items from the Happening Now feed are automatically filed here once they're more than 24 hours old."
      />

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">More from Keep Texas Red</h2>
        <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <li><Link to="/texas-politics" className="text-primary hover:underline">Texas Politics →</Link></li>
          <li><Link to="/houston" className="text-primary hover:underline">Houston News →</Link></li>
          <li><Link to="/texas-sports" className="text-primary hover:underline">Texas Sports →</Link></li>
          <li><Link to="/texas-business" className="text-primary hover:underline">Texas Business →</Link></li>
          <li><Link to="/elections" className="text-primary hover:underline">Elections →</Link></li>
          <li><Link to="/tax-calculator" className="text-primary hover:underline">Property Tax Calculator →</Link></li>
        </ul>
      </section>
    </div>
  );
}
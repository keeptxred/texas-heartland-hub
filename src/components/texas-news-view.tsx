import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { getArticlesByCategory } from "@/lib/articles-by-category";
import { assignUniqueImages } from "@/lib/dedupe-images";

export const TEXAS_NEWS_SECTIONS = [
  { id: "economy", title: "Economy", description: "Texas economy trends, jobs, and cost-of-living updates." },
  { id: "housing", title: "Housing", description: "Texas housing market trends, affordability, and suburban growth." },
  { id: "migration", title: "Growth & Migration", description: "Population growth and why people keep moving to Texas." },
  { id: "culture", title: "Culture & Identity", description: "Texas culture, identity, and community life across the state." },
  { id: "education", title: "Education Trends", description: "School performance, education trends, and long-term shifts." },
  { id: "sports-culture", title: "Sports Culture", description: "High school, college, and pro sports as part of Texas life." },
];

// Keyword fallback: when a section has no articles tagged with its exact
// category, surface related published articles by matching keywords in the
// title, dek, and tags. Keeps filter buttons useful even before the AI
// generator has produced lifestyle-tagged evergreens.
const SECTION_KEYWORDS: Record<string, string[]> = {
  economy: ["econom", "job", "wage", "cost of living", "inflation", "business", "tax"],
  housing: ["hous", "home", "rent", "mortgage", "property", "suburb", "real estate"],
  migration: ["migrat", "moving", "population", "growth", "relocat", "newcomer", "census"],
  culture: ["cultur", "identity", "community", "tradition", "heritage", "family", "faith"],
  education: ["school", "educat", "student", "teacher", "district", "university", "college"],
  "sports-culture": ["sport", "football", "baseball", "basketball", "team", "coach", "athlet"],
};

function keywordMatches(section: string) {
  const words = SECTION_KEYWORDS[section] ?? [];
  if (words.length === 0) return [];
  return ARTICLES.filter((a) => {
    if (!isPublished(a)) return false;
    const hay = `${a.title} ${a.dek ?? ""} ${a.category}`.toLowerCase();
    return words.some((w) => hay.includes(w));
  }).sort(sortByDateDesc);
}

export function TexasNewsView({ topic }: { topic: string }) {
  const lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const activeSection = TEXAS_NEWS_SECTIONS.find((s) => s.id === topic);
  let articles = activeSection
    ? getArticlesByCategory(activeSection.id)
    : ARTICLES.filter((a) => isPublished(a)).sort(sortByDateDesc);
  if (activeSection && articles.length === 0) {
    articles = keywordMatches(activeSection.id);
  }
  const uniqImg = assignUniqueImages(articles, (a) => a.slug, (a) => a.image);

  // Scroll to top when the active filter changes so mobile users see the
  // updated header + section title instead of appearing to sit in place.
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [topic]);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-6 mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Texas News &amp; Insights</span>
        <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">
          {activeSection ? `${activeSection.title} — Texas News` : "Texas News, Culture & Economy"}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
          {activeSection
            ? activeSection.description
            : "Ongoing coverage of Texas culture, economy, housing, jobs, and lifestyle trends. Not breaking news — long-term insights into what makes Texas grow. For breaking political and government updates, see Happening Now."}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      <section className="mb-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground mb-4">What we cover</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEXAS_NEWS_SECTIONS.map((s) => {
            const active = topic === s.id;
            const linkProps = active
              ? ({ to: "/texas-news" } as const)
              : ({ to: "/texas-news/$topic", params: { topic: s.id } } as const);
            return (
              <Link
                key={s.id}
                {...linkProps}
                className={`group block border-2 p-5 transition-colors ${
                  active ? "border-primary bg-primary/5" : "border-foreground/10 bg-card hover:border-primary hover:bg-primary/5"
                }`}
              >
                <h3 className="font-sans text-lg font-semibold tracking-tight group-hover:text-primary">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-primary">
                  {active ? "Showing ✓ — clear" : "Filter →"}
                </span>
              </Link>
            );
          })}
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
            <Link to="/texas-news" className="text-sm text-primary hover:underline">
              Show all Texas news →
            </Link>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {articles.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No {activeSection?.title.toLowerCase()} stories published yet. New evergreen coverage is added regularly.
              </p>
              <Link to="/texas-news" className="mt-3 inline-block text-sm text-primary hover:underline">
                ← Back to all Texas news
              </Link>
            </div>
          )}
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

      {!activeSection && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">Texas Pillar Guides</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            The evergreen references we recommend to every new and longtime Texan.
          </p>
          <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <li><Link to="/texas/no-state-income-tax-2026" className="text-primary hover:underline">Why Texas Has No State Income Tax →</Link></li>
            <li><Link to="/texas/property-taxes-2026" className="text-primary hover:underline">Texas Property Taxes in 2026 →</Link></li>
            <li><Link to="/texas/moving-to-texas-2026" className="text-primary hover:underline">Moving to Texas in 2026 →</Link></li>
          </ul>
        </section>
      )}

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
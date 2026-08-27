import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { assignUniqueImages } from "@/lib/dedupe-images";
import type { CategoryFeedItem } from "@/lib/category-feed.functions";
import { resolveArticleImage } from "@/lib/seo-headline";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

const EMPTY_BILLS_SEARCH = { q: "", status: "", legislature: 0, chamber: "", billType: "", page: 1 } as const;

export const TEXAS_NEWS_SECTIONS = [
  {
    id: "government",
    title: "Government",
    description: "State agencies, public officials, local government, and accountability across Texas.",
  },
  {
    id: "economy",
    title: "Economic Policy",
    description: "Jobs, energy, taxes, state spending, and policies affecting the Texas economy.",
  },
  {
    id: "education",
    title: "Education Policy",
    description: "School finance, school choice, boards, universities, and state education decisions.",
  },
  {
    id: "public-safety",
    title: "Public Safety",
    description: "Border enforcement, emergency policy, courts, policing, and public-safety institutions.",
  },
  {
    id: "sports",
    title: "Sports",
    description: "Texas professional, college, and high-school sports coverage.",
  },
];

const TEXAS_NEWS_SLUGS: Record<string, string[]> = {
  government: [
    "what-local-governments-control",
    "how-texas-counties-spend",
    "texas-school-board-powers",
    "how-a-bill-becomes-texas-law",
  ],
  economy: [
    "texas-energy-economy-overview",
    "why-texas-has-no-income-tax",
    "permian-energy",
    "texas-grid-ercot-explained",
    "texas-energy-policy-guide",
    "property-tax-relief-package",
  ],
  education: [
    "school-choice-esa-guide",
    "texas-school-board-powers",
    "texas-school-finance-explained",
  ],
  "public-safety": [
    "texas-border-policy-full-guide",
    "texas-border-geography-101",
    "what-local-governments-control",
  ],
  sports: [],
};

const TEXAS_NEWS_EXCLUDED_SLUGS = new Set(["gracie-the-giraffe"]);
const ALL_TEXAS_NEWS_SLUGS = Array.from(new Set(Object.values(TEXAS_NEWS_SLUGS).flat())).filter(
  (slug) => !TEXAS_NEWS_EXCLUDED_SLUGS.has(slug),
);

function articlesForSlugs(slugs: string[]) {
  return slugs
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter(
      (a): a is NonNullable<typeof a> =>
        Boolean(a)
        && isPublished(a!)
        && isStaticArticleIndexable(a!)
        && !TEXAS_NEWS_EXCLUDED_SLUGS.has(a!.slug),
    )
    .sort(sortByDateDesc);
}

export function TexasNewsView({
  topic,
  liveArticles = [],
}: {
  topic: string;
  liveArticles?: CategoryFeedItem[];
}) {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const activeSection = TEXAS_NEWS_SECTIONS.find((s) => s.id === topic);
  const activeSlugs = activeSection ? TEXAS_NEWS_SLUGS[activeSection.id] : ALL_TEXAS_NEWS_SLUGS;
  const articles = articlesForSlugs(activeSlugs ?? []);
  const uniqImg = assignUniqueImages(
    articles,
    (a) => a.slug,
    (a) => a.image,
    (a) => a.category ?? null,
  );

  const staticSlugSet = new Set(articles.map((a) => a.slug));
  const liveOnly = liveArticles.filter((r) => !staticSlugSet.has(r.slug));
  const liveImg = assignUniqueImages(
    liveOnly,
    (r) => r.slug,
    (r) => resolveArticleImage(r),
    (r) => r.category ?? null,
  );

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [topic]);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-6 mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Statewide reporting
        </span>
        <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">
          {activeSection ? `${activeSection.title} — Texas News` : "Texas News, Government & Public Policy"}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
          {activeSection
            ? activeSection.description
            : "Statewide reporting on Texas government, economic policy, education, public safety, elections, and major institutions. TexasDefined separately owns travel, relocation, lifestyle, household tools, and place guides."}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      <section className="mb-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground mb-4">
          What we cover
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TEXAS_NEWS_SECTIONS.map((s) => {
            const active = topic === s.id;
            return (
              <Link
                key={s.id}
                to={active ? "/news" : "/texas-news/$topic"}
                params={active ? undefined : { topic: s.id }}
                className={`group block border-2 p-5 transition-colors ${
                  active
                    ? "border-primary bg-primary/5"
                    : "border-foreground/10 bg-card hover:border-primary hover:bg-primary/5"
                }`}
              >
                <h3 className="font-sans text-lg font-semibold tracking-tight group-hover:text-primary">
                  {s.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
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
              {activeSection ? `${activeSection.title} coverage` : "Latest statewide coverage"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeSection ? activeSection.description : "The newest reporting from across Texas."}
            </p>
          </div>
          {activeSection && (
            <Link to="/news" className="text-sm text-primary hover:underline">
              Show all Texas news →
            </Link>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {articles.length === 0 && liveOnly.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {topic === "sports"
                  ? "No sports articles are available in this feed yet. Browse Texas teams and league coverage."
                  : "No articles currently available in this topic. Browse related Texas coverage."}
              </p>
              <Link
                to={topic === "sports" ? "/texas-sports" : "/news"}
                className="mt-3 inline-block text-sm text-primary hover:underline"
              >
                {topic === "sports" ? "Browse Texas Sports →" : "← Back to all Texas news"}
              </Link>
            </div>
          )}
          {liveOnly.map((a) => (
            <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block">
              <div className="aspect-[16/10] overflow-hidden bg-muted mb-4 rounded-md">
                <img
                  src={liveImg.get(a.slug) ?? resolveArticleImage(a)}
                  alt={a.title}
                  loading="lazy"
                  className="size-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {a.category}
              </span>
              <h2 className="font-sans text-base font-semibold mt-1.5 leading-snug text-foreground group-hover:text-primary transition-colors">
                {a.title}
              </h2>
              {a.dek && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {a.dek}
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {a.source_name ?? a.author} •{" "}
                {new Date(a.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </p>
            </Link>
          ))}
          {articles.map((a) => (
            <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block">
              <div className="aspect-[16/10] overflow-hidden bg-muted mb-4 rounded-md">
                <img
                  src={uniqImg.get(a.slug) ?? a.image}
                  alt={a.title}
                  loading="lazy"
                  className="size-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {a.category}
              </span>
              <h2 className="font-sans text-base font-semibold mt-1.5 leading-snug text-foreground group-hover:text-primary transition-colors">
                {a.title}
              </h2>
              {a.dek && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {a.dek}
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {a.author} • {a.date}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {!activeSection && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
            Civic reference guides
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            Background resources connecting current reporting to Texas government and public policy.
          </p>
          <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <li><Link to="/bills" search={EMPTY_BILLS_SEARCH} className="text-primary hover:underline">Search Texas bills →</Link></li>
            <li><Link to="/texas-legislature" className="text-primary hover:underline">Texas Legislature →</Link></li>
            <li><Link to="/representatives" className="text-primary hover:underline">Texas representatives →</Link></li>
          </ul>
        </section>
      )}

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
          More from Keep Texas Red
        </h2>
        <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <li><Link to="/texas-politics" className="text-primary hover:underline">Texas Politics →</Link></li>
          <li><Link to="/houston" className="text-primary hover:underline">Houston News →</Link></li>
          <li><Link to="/texas-sports" className="text-primary hover:underline">Texas Sports →</Link></li>
          <li><Link to="/texas-business" className="text-primary hover:underline">Texas Business →</Link></li>
          <li><Link to="/elections/2026" className="text-primary hover:underline">Election Central →</Link></li>
          <li><Link to="/bills" search={EMPTY_BILLS_SEARCH} className="text-primary hover:underline">Texas Bills →</Link></li>
        </ul>
      </section>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlag from "@/assets/hero-flag.jpg";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";
import { AdSlot } from "@/components/ad-slot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Keep TX Red | Texas News, Politics, Economy, Border & Sports" },
      { name: "description", content: "Keep TX Red delivers daily Texas news, politics, business, border security, energy, elections, sports and culture. Independent reporting focused on the issues shaping Texas." },
      { property: "og:title", content: "Keep TX Red | Texas News, Politics, Economy, Border & Sports" },
      { property: "og:description", content: "Keep TX Red delivers daily Texas news, politics, business, border security, energy, elections, sports and culture. Independent reporting focused on the issues shaping Texas." },
      { property: "og:url", content: "/" },
      { property: "og:image", content: heroFlag },
      { name: "twitter:image", content: heroFlag },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroFlag, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Keep TX Red",
          url: "https://www.keeptxred.com/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.keeptxred.com/news?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Keep TX Red",
          url: "https://www.keeptxred.com/",
          logo: "https://www.keeptxred.com/favicon.ico",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          name: "Keep TX Red",
          alternateName: "Keep Texas Red",
          url: "https://www.keeptxred.com/",
          logo: { "@type": "ImageObject", url: "https://www.keeptxred.com/favicon.ico" },
          sameAs: [],
          masthead: "https://www.keeptxred.com/about",
          ethicsPolicy: "https://www.keeptxred.com/editorial-standards",
          publishingPrinciples: "https://www.keeptxred.com/editorial-standards",
          diversityPolicy: "https://www.keeptxred.com/editorial-standards",
          correctionsPolicy: "https://www.keeptxred.com/about",
          contactPoint: {
            "@type": "ContactPoint",
            email: "contact@keeptxred.com",
            contactType: "Editorial",
          },
          areaServed: { "@type": "State", name: "Texas" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.keeptxred.com/" },
          ],
        }),
      },
    ],
  }),
  loader: () => getDailyArticles(),
  component: Index,
});

const SECTION_CARDS = [
  {
    to: "/texas-news" as const,
    eyebrow: "News",
    title: "Texas News",
    desc: "Statewide breaking news and daily updates from across Texas.",
  },
  {
    to: "/texas-politics" as const,
    eyebrow: "Politics",
    title: "Texas Politics",
    desc: "The Legislature, statewide offices, and how Texas government works.",
  },
  {
    to: "/houston" as const,
    eyebrow: "Local",
    title: "Houston News",
    desc: "Houston-area updates covering Katy, Sugar Land, Cypress, and the wider metro.",
  },
  {
    to: "/texas-sports" as const,
    eyebrow: "Sports",
    title: "Texas Sports",
    desc: "Texans, Cowboys, Astros, Rangers, Spurs, and Mavericks coverage and recaps.",
  },
  {
    to: "/texas-business" as const,
    eyebrow: "Business",
    title: "Texas Business",
    desc: "Texas economy, jobs, energy, and the companies reshaping the state.",
  },
  {
    to: "/elections" as const,
    eyebrow: "Elections",
    title: "Texas Elections",
    desc: "Voter guides, candidate information, and upcoming election dates.",
  },
  {
    to: "/tax-calculator" as const,
    eyebrow: "Taxes",
    title: "Property Taxes",
    desc: "Calculate your tax burden by county, including school district rates.",
  },
];

function Index() {
  const { articles: live } = Route.useLoaderData() as { articles: DailyArticle[] };
  const breaking = live.filter((a: DailyArticle) => a.is_breaking).slice(0, 3);
  const trending = live
    .filter((a: DailyArticle) => !a.is_breaking)
    .sort((a: DailyArticle, b: DailyArticle) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 5);

  const sorted = ARTICLES.filter((a) => isPublished(a)).sort(sortByDateDesc);
  const [lead, ...rest] = sorted;
  const featured = rest.slice(0, 4);
  const latest = rest.slice(4, 12);

  return (
    <div className="bg-background">
      {/* BREAKING NEWS — top of homepage when score >= 18 */}
      {breaking.length > 0 ? (
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-[1200px] px-6 py-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-2 rounded-sm bg-primary-foreground/15 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.25em]">
                <span className="size-2 rounded-full bg-primary-foreground animate-pulse" />
                Breaking
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {breaking.map((a: DailyArticle) => (
                <BreakingCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* HERO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-16">
          <div className="max-w-[700px]">
            <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] text-foreground">
              Keep TX Red | Texas News, Politics & Conservative Commentary
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Daily Texas news, politics, business, border, energy, elections, sports and culture — independent reporting focused on the issues shaping Texas.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <Link to="/keep-texas-red" className="text-primary hover:underline font-medium">Read more about Keep Texas Red →</Link>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/texas-news"
                className="inline-flex items-center bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Latest Articles
              </Link>
              <Link
                to="/texas-politics"
                className="inline-flex items-center border border-border px-5 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors text-foreground"
              >
                Texas Politics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING TODAY */}
      {trending.length > 0 ? (
        <section className="mx-auto max-w-[1200px] px-6 py-12 border-b border-border">
          <div className="flex items-end justify-between mb-6">
            <span className="text-xs font-medium uppercase tracking-wider text-primary">Trending Today</span>
            <Link to="/news" className="text-sm font-medium text-primary hover:underline">View all news →</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {trending.map((a: DailyArticle) => (
              <TrendingCard key={a.slug} article={a} />
            ))}
          </div>
          <AdSlot placement="banner" />
        </section>
      ) : null}

      {/* FEATURED STORIES */}
      {lead && (
        <section className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="mb-8">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Featured Stories</span>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            <Link to="/news/$slug" params={{ slug: lead.slug }} className="group block lg:col-span-2">
              <div className="aspect-[16/9] overflow-hidden bg-muted mb-5 rounded-md">
                <img src={lead.image} alt={lead.title} className="size-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{lead.category}</span>
              <h2 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight mt-2 leading-[1.2] text-foreground group-hover:text-primary transition-colors">
                {lead.title}
              </h2>
              {lead.dek && (
                <p className="mt-3 text-base text-muted-foreground leading-relaxed line-clamp-2">{lead.dek}</p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">{lead.author} • {lead.date}</p>
            </Link>
            <div className="flex flex-col divide-y divide-border">
              {featured.map((a) => (
                <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block py-5 first:pt-0 last:pb-0">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{a.category}</span>
                  <h3 className="font-sans text-lg font-semibold mt-1 leading-snug text-foreground group-hover:text-primary transition-colors">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground">{a.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TOPIC HUBS */}
      <section className="bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="mb-8">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sections</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SECTION_CARDS.map((h) => (
              <Link
                key={h.to}
                to={h.to}
                className="group flex flex-col bg-card p-7 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{h.eyebrow}</span>
                <h3 className="font-sans text-xl font-semibold mt-2 text-foreground">{h.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{h.desc}</p>
                <span className="mt-5 text-sm font-medium text-primary group-hover:underline underline-offset-4">View Articles →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST UPDATES */}
      <section className="mx-auto max-w-[1200px] px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Latest Updates</span>
          <Link to="/news" className="text-sm font-medium text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {latest.map((a) => (
            <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block">
              <div className="aspect-[16/10] overflow-hidden bg-muted mb-4 rounded-md">
                <img src={a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{a.category}</span>
              <h3 className="font-sans text-base font-semibold mt-1.5 leading-snug text-foreground group-hover:text-primary transition-colors">{a.title}</h3>
              {a.dek && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{a.dek}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">{a.date}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="max-w-[700px]">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">About</span>
            <h2 className="font-sans text-2xl md:text-3xl font-semibold tracking-tight mt-2 text-foreground">
              Independent Texas reporting.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Keep TX Red is an independent Texas-focused news and analysis platform covering politics, policy, economy, and statewide developments.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/about" className="text-sm font-medium text-primary hover:underline">Our story →</Link>
              <span className="text-muted-foreground/40">·</span>
              <Link to="/contact" className="text-sm font-medium text-primary hover:underline">Contact the newsroom →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function articleHref(a: DailyArticle) {
  return a.kind === "evergreen" ? `/news/${a.slug}` : a.source_url ?? "/news";
}

function BreakingCard({ article }: { article: DailyArticle }) {
  const href = articleHref(article);
  const external = article.kind !== "evergreen";
  const inner = (
    <>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">{article.category}</span>
      <h3 className="font-sans text-base md:text-lg font-semibold leading-snug mt-1">{article.title}</h3>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors p-4">
      {inner}
    </a>
  ) : (
    <Link to="/news/$slug" params={{ slug: article.slug }} className="block rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors p-4">
      {inner}
    </Link>
  );
}

function TrendingCard({ article }: { article: DailyArticle }) {
  const external = article.kind !== "evergreen";
  const inner = (
    <>
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{article.category}</span>
      <h3 className="font-sans text-sm font-semibold mt-1 leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-4">
        {article.title}
      </h3>
    </>
  );
  return external && article.source_url ? (
    <a key={article.slug} href={article.source_url} target="_blank" rel="noopener noreferrer" className="group block">
      {inner}
    </a>
  ) : (
    <Link key={article.slug} to="/news/$slug" params={{ slug: article.slug }} className="group block">
      {inner}
    </Link>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlag from "@/assets/hero-flag.jpg";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Texas News, Politics & Policy Updates — Keep TX Red" },
      { name: "description", content: "Independent coverage of Texas government, elections, economy, and statewide issues — politics, policy, and the stories shaping the Lone Star State." },
      { property: "og:title", content: "Texas News, Politics & Policy Updates That Matter" },
      { property: "og:description", content: "Independent coverage of Texas government, elections, economy, and statewide issues." },
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
    ],
  }),
  component: Index,
});

const SECTION_CARDS = [
  {
    to: "/texas-politics" as const,
    eyebrow: "Politics",
    title: "Texas Politics",
    desc: "The Legislature, statewide offices, and how Texas government works.",
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
  {
    to: "/texas-law-policy" as const,
    eyebrow: "Law",
    title: "Texas Law & Policy",
    desc: "Border security, education, public safety, and the statutes that affect Texans.",
  },
  {
    to: "/representatives" as const,
    eyebrow: "Government",
    title: "Representatives",
    desc: "Find your state and federal elected officials and how to contact them.",
  },
  {
    to: "/news" as const,
    eyebrow: "News",
    title: "Latest News",
    desc: "Daily updates on Texas politics, policy, and statewide developments.",
  },
];

function Index() {
  const sorted = ARTICLES.filter((a) => isPublished(a)).sort(sortByDateDesc);
  const [lead, ...rest] = sorted;
  const featured = rest.slice(0, 4);
  const latest = rest.slice(4, 12);

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-16">
          <div className="max-w-[700px]">
            <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] text-foreground">
              Texas news, policy &amp; politics explained
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Independent coverage of Texas government, economy, elections, and public policy.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Updated daily with analysis and reporting on Texas state issues.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/news"
                className="inline-flex items-center bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Latest Articles
              </Link>
              <Link
                to="/hubs"
                className="inline-flex items-center border border-border px-5 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors text-foreground"
              >
                Explore Topics
              </Link>
            </div>
          </div>
        </div>
      </section>

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
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Topic Hubs</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HUB_CARDS.map((h) => (
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

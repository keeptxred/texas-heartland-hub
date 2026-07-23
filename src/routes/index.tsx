import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlag from "@/assets/hero-flag.jpg";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";
import { AdSlot } from "@/components/ad-slot";
import { BrandIdentity } from "@/components/brand-identity";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { assignUniqueImages } from "@/lib/dedupe-images";

function getLeadImage(): string | null {
  const lead = ARTICLES.filter((article) => isPublished(article)).sort(sortByDateDesc)[0];
  return lead?.image ?? null;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Keep Texas Red | Texas Living, Relocation Tools & News" },
      {
        name: "description",
        content:
          "Keep TX Red helps people move to Texas, live well in Texas, use practical calculators, follow statewide news, and discover products made for proud Texans.",
      },
      { property: "og:title", content: "Keep Texas Red | Your Texas Living Platform" },
      {
        property: "og:description",
        content:
          "Texas relocation guides, resident resources, calculators, daily news, and the Keep TX Red shop in one place.",
      },
      { property: "og:url", content: "/" },
      { property: "og:image", content: heroFlag },
      { name: "twitter:image", content: heroFlag },
    ],
    links: [
      { rel: "canonical", href: "/" },
      ...(getLeadImage()
        ? [{ rel: "preload", as: "image", href: getLeadImage() as string, fetchpriority: "high" }]
        : []),
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Keep Texas Red",
          alternateName: ["Keep TX Red", "KeepTXRed"],
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
          name: "Keep Texas Red",
          alternateName: ["Keep TX Red", "KeepTXRed"],
          url: "https://www.keeptxred.com/",
          logo: "https://www.keeptxred.com/favicon.ico",
          areaServed: { "@type": "State", name: "Texas" },
        }),
      },
    ],
  }),
  loader: () => getDailyArticles(),
  component: Index,
});

const MOVING_LINKS = [
  ["Plan your moving budget", "/texas-moving-cost-calculator"],
  ["Compare Texas living costs", "/texas-cost-of-living-calculator"],
  ["Decide whether to rent or buy", "/texas-rent-vs-buy-calculator"],
  ["Find your school district", "/find-my-school-district"],
] as const;

const LIVING_LINKS = [
  ["Estimate property taxes", "/tax-calculator"],
  ["Plan household utility costs", "/texas-utility-cost-calculator"],
  ["Understand Texas laws", "/laws"],
  ["Find voting resources", "/elections"],
] as const;

const POPULAR_TOOLS = [
  [
    "Property Tax Calculator",
    "/tax-calculator",
    "Estimate taxes by supported county and school district.",
  ],
  [
    "Cost of Living Calculator",
    "/texas-cost-of-living-calculator",
    "Compare common household costs across Texas cities.",
  ],
  [
    "Home Affordability Calculator",
    "/texas-home-affordability-calculator",
    "Estimate a comfortable Texas home-price range.",
  ],
  ["Budget Planner", "/texas-budget-planner", "Build a practical monthly Texas household budget."],
] as const;

function Index() {
  const { articles: live } = Route.useLoaderData() as { articles: DailyArticle[] };
  const breaking = live.filter((article) => article.is_breaking).slice(0, 3);
  const trending = live
    .filter((article) => !article.is_breaking)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 5);
  const latest = ARTICLES.filter((article) => isPublished(article))
    .sort(sortByDateDesc)
    .slice(0, 6);
  const images = assignUniqueImages(
    latest,
    (article) => article.slug,
    (article) => article.image,
    (article) => article.category ?? null,
  );

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-gradient-to-br from-background via-background to-muted/60">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Move here. Live here. Know Texas.
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your guide to moving to and living in Texas
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Keep TX Red brings together relocation guidance, everyday resident resources,
              practical Texas calculators, daily statewide news, and products made for proud Texans.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/moving-to-texas"
                className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Start your move
              </Link>
              <Link
                to="/living-in-texas"
                className="rounded-md border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Explore Texas living
              </Link>
              <Link
                to="/texas-financial-tools"
                className="rounded-md border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Use Texas tools
              </Link>
            </div>
          </div>
          <aside
            className="rounded-2xl border bg-card p-6 shadow-sm"
            aria-labelledby="popular-starting-points"
          >
            <p id="popular-starting-points" className="text-sm font-semibold text-foreground">
              Popular starting points
            </p>
            <ul className="mt-3 divide-y divide-border">
              {[
                ["Compare Texas cities", "/texas-salary-comparison-by-city"],
                ["Estimate a mortgage", "/texas-mortgage-calculator"],
                ["Find your DMV", "/find-my-dmv"],
                ["Read today's Texas news", "/texas-news"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center justify-between gap-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    <span>{label}</span>
                    <span
                      aria-hidden="true"
                      className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section aria-labelledby="latest-texas-news" className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Stay informed
            </p>
            <h2 id="latest-texas-news" className="mt-2 text-3xl font-semibold tracking-tight">
              Latest Texas News
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/happening-now"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Happening Now
            </Link>
            <Link to="/texas-news" className="text-sm font-semibold text-primary hover:underline">
              View all Texas news →
            </Link>
          </div>
        </div>

        {breaking.length > 0 && (
          <div className="mt-8 rounded-xl bg-primary p-5 text-primary-foreground">
            <p className="text-xs font-bold uppercase tracking-[0.2em]">Breaking</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {breaking.map((article) => (
                <DailyNewsLink key={article.slug} article={article} inverted />
              ))}
            </div>
          </div>
        )}

        {trending.length > 0 && (
          <div className="mt-8 grid gap-4 border-b pb-8 sm:grid-cols-2 lg:grid-cols-5">
            {trending.map((article) => (
              <DailyNewsLink key={article.slug} article={article} />
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((article, index) => (
            <Link
              key={article.slug}
              to="/news/$slug"
              params={{ slug: article.slug }}
              className="group block"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-lg bg-muted">
                <img
                  src={images.get(article.slug) ?? article.image}
                  alt=""
                  width={640}
                  height={400}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {article.category}
              </p>
              <h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-primary">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>
        <AdSlot placement="banner" />
      </section>

      <JourneySection
        id="moving-to-texas"
        eyebrow="Relocation"
        title="Moving to Texas"
        description="Make a confident move with guidance for budgeting, comparing communities, finding a home, choosing schools, and getting settled."
        hub="/moving-to-texas"
        links={MOVING_LINKS}
      />

      <JourneySection
        id="living-in-texas"
        eyebrow="Resident resources"
        title="Living in Texas"
        description="Navigate homeownership, property taxes, utilities, voting, state government, Texas laws, and everyday life."
        hub="/living-in-texas"
        links={LIVING_LINKS}
        muted
      />

      <section aria-labelledby="popular-tools" className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Plan with confidence
            </p>
            <h2 id="popular-tools" className="mt-2 text-3xl font-semibold tracking-tight">
              Popular Texas Tools
            </h2>
          </div>
          <Link
            to="/texas-financial-tools"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Explore all Texas Tools →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_TOOLS.map(([title, to, description]) => (
            <Link
              key={to}
              to={to}
              className="rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <span className="mt-4 block text-sm font-semibold text-primary">Open tool →</span>
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="featured-shop"
        className="border-y bg-secondary text-secondary-foreground"
      >
        <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-14 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <img
            src="/og/shop.jpg"
            alt="Keep TX Red patriotic apparel and gifts"
            className="aspect-[16/10] w-full rounded-xl object-cover"
            loading="lazy"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Featured Shop
            </p>
            <h2 id="featured-shop" className="mt-2 text-3xl font-semibold tracking-tight">
              Wear your Texas pride
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/75">
              Shop Texas patriotic shirts, hats, hoodies, stickers, and gifts. Purchases support
              Keep TX Red’s independent Texas coverage and resources.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Shop featured products
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-14">
        <NewsletterSignup sourcePage="/" />
      </section>
      <BrandIdentity />
    </div>
  );
}

function JourneySection({
  id,
  eyebrow,
  title,
  description,
  hub,
  links,
  muted = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  hub: "/moving-to-texas" | "/living-in-texas";
  links: ReadonlyArray<readonly [string, string]>;
  muted?: boolean;
}) {
  return (
    <section aria-labelledby={id} className={muted ? "border-y bg-muted/40" : "border-t"}>
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            <h2 id={id} className="mt-2 text-3xl font-semibold tracking-tight">
              {title}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>
            <Link
              to={hub}
              className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Explore {title} →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {links.map(([label, to]) => (
              <Link
                key={to}
                to={to}
                className="rounded-xl border bg-card p-5 font-semibold transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {label} <span className="mt-3 block text-sm text-primary">Open resource →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function articleHref(article: DailyArticle) {
  if (article.source_url?.startsWith("/")) return article.source_url;
  return `/news/${article.slug}`;
}

function DailyNewsLink({
  article,
  inverted = false,
}: {
  article: DailyArticle;
  inverted?: boolean;
}) {
  return (
    <a
      href={articleHref(article)}
      className={
        inverted
          ? "block rounded-lg bg-white/10 p-4 hover:bg-white/15"
          : "group block rounded-lg border p-4 hover:bg-muted"
      }
    >
      <span
        className={
          inverted
            ? "text-[10px] font-bold uppercase tracking-wider text-white/75"
            : "text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
        }
      >
        {article.category}
      </span>
      <h3
        className={
          inverted
            ? "mt-1 font-semibold leading-snug"
            : "mt-1 font-semibold leading-snug group-hover:text-primary"
        }
      >
        {article.title}
      </h3>
    </a>
  );
}

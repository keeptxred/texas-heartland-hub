import { Link } from "@tanstack/react-router";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { CITY_NAVIGATION, type TexasCityConfig } from "@/data/texas-cities";
import type { CategoryFeedItem } from "@/lib/category-feed.functions";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { resolveArticleImage } from "@/lib/seo-headline";

export function CityPage({
  config,
  liveArticles,
}: {
  config: TexasCityConfig;
  liveArticles: CategoryFeedItem[];
}) {
  const liveSlugs = new Set(liveArticles.map((article) => article.slug));
  const fallbackSlots = Math.max(0, 9 - liveArticles.length);
  const fallbackArticles = config.fallbackSlugs
    .map((slug) => ARTICLES.find((article) => article.slug === slug))
    .filter(
      (article): article is NonNullable<typeof article> =>
        Boolean(article) && isPublished(article!) && !liveSlugs.has(article!.slug),
    )
    .sort(sortByDateDesc)
    .slice(0, fallbackSlots);
  const displayedLive = liveArticles.slice(0, 12);
  const liveImages = assignUniqueImages(
    displayedLive,
    (article) => article.slug,
    (article) => resolveArticleImage(article),
    (article) => article.category ?? null,
  );
  const fallbackImages = assignUniqueImages(
    fallbackArticles,
    (article) => article.slug,
    (article) => article.image,
    (article) => article.category ?? null,
  );
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <main>
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {config.eyebrow}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
            {config.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {config.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {config.communities.map((community) => (
              <span
                key={community}
                className="rounded-full border bg-background px-3 py-1.5 text-xs font-semibold"
              >
                {community}
              </span>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">Coverage updated {lastUpdated}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-bold">What to evaluate before moving</h2>
            <div className="mt-6 grid gap-4">
              {config.coverage.map((item) => (
                <article key={item.title} className="rounded-xl border bg-card p-5">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-xl bg-foreground p-6 text-background">
              <h2 className="text-xl font-bold">Major economic anchors</h2>
              <ul className="mt-4 space-y-2 text-sm text-background/80">
                {config.industries.map((industry) => (
                  <li key={industry}>• {industry}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-xl font-bold">Relocation notes</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {config.relocationNotes.map((note) => (
                  <li key={note}>• {note}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold">Tools for your {config.name} move</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ToolLink href="/moving-to-texas-checklist" label="Interactive moving checklist" />
            <ToolLink href="/tax-calculator" label="Property tax calculator" />
            <ToolLink href="/find-my-dmv" label="Vehicle registration estimator" />
            <ToolLink href="/find-my-school-district" label="School district finder" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold">Latest {config.name} coverage</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              New regional articles appear first. Relevant archive guides fill the page only until
              newer local coverage replaces them.
            </p>
          </div>
          <Link to="/texas-news" className="text-sm font-semibold text-primary hover:underline">
            Browse statewide news →
          </Link>
        </div>
        <div className="mt-7 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {displayedLive.map((article) => (
            <ArticleCard
              key={article.slug}
              slug={article.slug}
              title={article.title}
              dek={article.dek ?? ""}
              category={article.category}
              image={liveImages.get(article.slug) ?? resolveArticleImage(article)}
              date={new Date(article.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              })}
            />
          ))}
          {fallbackArticles.map((article) => (
            <ArticleCard
              key={article.slug}
              slug={article.slug}
              title={article.title}
              dek={article.dek}
              category={article.category}
              image={fallbackImages.get(article.slug) ?? article.image}
              date={article.date}
              archive
            />
          ))}
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold">Compare other Texas destinations</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {CITY_NAVIGATION.filter((city) => city.region !== config.region).map((city) => (
              <a
                key={city.region}
                href={city.slug}
                className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-muted"
              >
                {city.name}
              </a>
            ))}
            <a
              href="/moving-to-texas"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              All moving resources
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ToolLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md">
      {label}
      <span className="mt-3 block text-sm text-primary">Open tool →</span>
    </a>
  );
}

function ArticleCard({
  slug,
  title,
  dek,
  category,
  image,
  date,
  archive = false,
}: {
  slug: string;
  title: string;
  dek: string;
  category: string;
  image: string;
  date: string;
  archive?: boolean;
}) {
  return (
    <Link to="/news/$slug" params={{ slug }} className="group block">
      <div className="aspect-[16/10] overflow-hidden rounded-md bg-muted">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <span>{category}</span>
        {archive && <span className="text-muted-foreground">Archive guide</span>}
      </div>
      <h3 className="mt-2 text-lg font-bold leading-snug group-hover:text-primary">{title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{dek}</p>
      <p className="mt-3 text-xs text-muted-foreground">{date}</p>
    </Link>
  );
}

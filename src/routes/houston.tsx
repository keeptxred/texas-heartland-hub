import { createFileRoute, Link } from "@tanstack/react-router";
import { getArticlesByCategory } from "@/lib/category-feed.functions";
import { buildSeo, SITE_URL } from "@/lib/seo";

const URL = `${SITE_URL}/houston`;
const TITLE = "Houston News, Politics & Business";
const DESCRIPTION =
  "Houston-area news on local government, elections, business, public safety, energy, courts, and state policy affecting Harris County and the Gulf Coast.";

export function houstonHead() {
  const seo = buildSeo({
    title: TITLE,
    description: DESCRIPTION,
    path: "/houston",
    type: "website",
    imageAlt: "Keep TX Red Houston news coverage",
  });

  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Houston News, Politics & Business | Keep TX Red",
          description: DESCRIPTION,
          url: URL,
          about: [
            { "@type": "City", name: "Houston" },
            { "@type": "AdministrativeArea", name: "Harris County" },
          ],
          isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: `${SITE_URL}/` },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Houston", item: URL },
          ],
        }),
      },
    ],
  };
}

export const Route = createFileRoute("/houston")({
  loader: () =>
    getArticlesByCategory({
      data: { region: "houston", limit: 18, order: "newest" },
    }),
  head: houstonHead,
  component: HoustonPage,
});

function HoustonPage() {
  const articles = Route.useLoaderData();

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-8 mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Houston &amp; Gulf Coast</p>
        <h1 className="mt-2 font-display text-4xl md:text-6xl tracking-tight">Houston News, Politics &amp; Business</h1>
        <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground">
          Local government, elections, courts, public safety, energy, business, and state-policy decisions affecting Houston, Harris County, and the Gulf Coast.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/elections/2026" className="text-primary hover:underline">Election Central →</Link>
          <Link to="/texas-business" className="text-primary hover:underline">Texas Business →</Link>
          <Link to="/texas-energy" className="text-primary hover:underline">Texas Energy →</Link>
          <Link to="/laws" className="text-primary hover:underline">Texas Laws →</Link>
        </div>
      </header>

      <section aria-labelledby="latest-houston-news">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Latest coverage</p>
            <h2 id="latest-houston-news" className="mt-1 font-display text-3xl">Houston-area reporting</h2>
          </div>
          <Link to="/news" className="text-sm text-primary hover:underline">All Texas news →</Link>
        </div>

        {articles.length === 0 ? (
          <div className="py-12 text-sm text-muted-foreground">
            No Houston-area stories are available in the current feed. Browse the <Link to="/news" className="text-primary underline">Texas newsroom</Link> for the latest statewide coverage.
          </div>
        ) : (
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const image = article.featured_image_url || article.image_url;
              const headline = article.seo_headline?.trim() || article.title;
              return (
                <article key={article.slug} className="group">
                  <Link to="/news/$slug" params={{ slug: article.slug }} className="block">
                    {image ? (
                      <div className="aspect-[16/9] overflow-hidden bg-muted mb-3">
                        <img
                          src={image}
                          alt={article.image_alt_text?.trim() || headline}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    ) : null}
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{article.category}</p>
                    <h3 className="mt-1 font-serif text-xl font-bold leading-snug group-hover:underline underline-offset-4">{headline}</h3>
                    {article.dek ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{article.dek}</p> : null}
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

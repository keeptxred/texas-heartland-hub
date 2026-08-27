import { createFileRoute, Link } from "@tanstack/react-router";
import { AUTHORS, EDITORIAL_BYLINE_DISCLOSURE, authorSlug } from "@/data/authors";
import { ARTICLES, isPublished } from "@/data/articles";
import { getPublishedAuthorArticles } from "@/lib/daily-news.functions";
import { getDiscoverableStaticArticleSlugs } from "@/lib/static-article-discovery.functions";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

export const Route = createFileRoute("/authors/")({
  loader: async () => {
    const [{ articles }, discoverableStaticSlugs] = await Promise.all([
      getPublishedAuthorArticles(),
      getDiscoverableStaticArticleSlugs(),
    ]);
    const discoverableStatic = new Set(discoverableStaticSlugs);
    const activeSlugs = new Set(
      articles
        .filter((article) => article.slug)
        .map((article) => authorSlug(article.author)),
    );

    for (const article of ARTICLES) {
      if (
        isPublished(article)
        && isStaticArticleIndexable(article)
        && discoverableStatic.has(article.slug)
      ) activeSlugs.add(authorSlug(article.author));
    }

    return { activeSlugs: [...activeSlugs] };
  },
  head: () => ({
    meta: [
      { title: "Editorial Bylines & Desks — Keep TX Red" },
      { name: "description", content: "How Keep TX Red identifies subject-matter editorial bylines for Texas politics, elections, government, energy, education, border, tax, and policy coverage." },
      { property: "og:title", content: "Editorial Bylines & Desks — Keep TX Red" },
      { property: "og:description", content: "How Keep TX Red identifies subject-matter editorial bylines and coverage desks." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://keeptxred.com/authors" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/authors" }],
  }),
  component: AuthorsIndex,
});

function AuthorsIndex() {
  const { activeSlugs } = Route.useLoaderData();
  const activeAuthors = AUTHORS.filter((author) => activeSlugs.includes(author.slug));

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/news" className="hover:text-primary">Newsroom</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Editorial Bylines</span>
      </nav>
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Keep TX Red</span>
      <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-2">Editorial Bylines &amp; Desks</h1>
      <p className="mt-3 font-serif text-muted-foreground max-w-3xl leading-relaxed">
        {EDITORIAL_BYLINE_DISCLOSURE}
      </p>
      <p className="mt-3 text-sm text-muted-foreground max-w-3xl">
        For details on sourcing, aggregation, synthesis, AI assistance, corrections, and review practices, see our <Link to="/editorial-standards" className="text-primary underline underline-offset-2">Editorial Standards</Link>.
      </p>

      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {activeAuthors.map((author) => (
          <li key={author.slug} className="border border-border p-5">
            <Link to="/authors/$slug" params={{ slug: author.slug }} className="group block">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{author.role}</span>
              <h2 className="font-display text-2xl tracking-tight mt-1 group-hover:underline underline-offset-4">{author.name}</h2>
              <p className="font-serif text-sm text-muted-foreground mt-2 line-clamp-3">{author.bio[0]}</p>
              {author.beats.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {author.beats.slice(0, 4).map((beat) => (
                    <span key={beat} className="text-[10px] border border-border px-2 py-0.5">{beat}</span>
                  ))}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

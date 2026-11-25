import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getEditorialDeskGuide } from "@/data/editorial-desk-guides";
import { AUTHORS, EDITORIAL_BYLINE_DISCLOSURE, authorSlug, type Author } from "@/data/authors";
import { ARTICLES, isPublished } from "@/data/articles";
import { getPublishedAuthorArticles, type DailyArticle } from "@/lib/daily-news.functions";
import { getDiscoverableStaticArticleSlugs } from "@/lib/static-article-discovery.functions";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { hasEnoughAuthorArticles, isCompleteAuthorProfile } from "@/lib/author-indexability";
import {
  buildSeo,
  ORGANIZATION_ID,
  SITE_URL,
  WEBSITE_ID,
} from "@/lib/seo";

export const isIndexableAuthor = isCompleteAuthorProfile;

type AuthorLoaderData = {
  author: Author;
  liveArticles: DailyArticle[];
  discoverableStaticSlugs: string[];
  hasEnoughPublishedArticles: boolean;
};

function staticBylineSlugs(author: Author, discoverableStatic: ReadonlySet<string>): string[] {
  return ARTICLES.filter(
    (article) =>
      isPublished(article)
      && isStaticArticleIndexable(article)
      && discoverableStatic.has(article.slug)
      && authorSlug(article.author) === author.slug,
  ).map((article) => article.slug);
}

export const Route = createFileRoute("/authors/$slug")({
  loader: async ({ params }): Promise<AuthorLoaderData> => {
    const author = AUTHORS.find((candidate) => candidate.slug === params.slug);
    if (!isCompleteAuthorProfile(author)) throw notFound();
    const [{ articles }, discoverableStaticSlugs] = await Promise.all([
      getPublishedAuthorArticles(),
      getDiscoverableStaticArticleSlugs(),
    ]);
    const discoverableStatic = new Set(discoverableStaticSlugs);
    const allLiveArticles = articles.filter(
      (article) => article.slug && authorSlug(article.author) === author.slug,
    );
    const publishedSlugs = [
      ...staticBylineSlugs(author, discoverableStatic),
      ...allLiveArticles.map((article) => article.slug),
    ];
    return {
      author,
      liveArticles: allLiveArticles.slice(0, 12),
      discoverableStaticSlugs,
      hasEnoughPublishedArticles: hasEnoughAuthorArticles(publishedSlugs),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Editorial desk not found — Keep TX Red" },
          { name: "robots", content: "noindex,follow" },
        ],
      };
    }

    const { author, hasEnoughPublishedArticles } = loaderData;
    const path = `/authors/${author.slug}`;
    const url = `${SITE_URL}${path}`;
    const deskId = `${url}#desk`;
    const description = `${author.name} is a Keep TX Red editorial byline for ${author.beats.join(", ")}. ${author.bio[0]}`;
    const seo = buildSeo({
      title: `${author.name} | Editorial Byline`,
      description,
      path,
      type: "website",
      noindex: !hasEnoughPublishedArticles,
    });
    const desk = {
      "@type": "Organization",
      "@id": deskId,
      name: author.name,
      url,
      description: `${author.bio.join(" ")} ${EDITORIAL_BYLINE_DISCLOSURE}`,
      parentOrganization: { "@id": ORGANIZATION_ID },
      knowsAbout: author.beats,
    };
    const profilePage = {
      "@type": "ProfilePage",
      "@id": `${url}#webpage`,
      url,
      name: `${author.name} | Keep TX Red`,
      description: seo.description,
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORGANIZATION_ID },
      mainEntity: { "@id": deskId },
      about: { "@id": deskId },
      inLanguage: "en-US",
    };

    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [desk, profilePage],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Newsroom", item: `${SITE_URL}/news` },
              { "@type": "ListItem", position: 3, name: author.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Editorial Desk Not Found</h1>
      <Link to="/news" className="text-primary underline">Back to the newsroom</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Something went wrong</h1>
      <Link to="/news" className="text-primary underline">Back to the newsroom</Link>
    </div>
  ),
  component: AuthorPage,
});

type ProfileArticle = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  publishedAt: string;
};

function AuthorPage() {
  const { author, liveArticles, discoverableStaticSlugs } = Route.useLoaderData() as AuthorLoaderData;
  const discoverableStatic = new Set(discoverableStaticSlugs);
  const guide = getEditorialDeskGuide(author.slug);

  const staticArticles: ProfileArticle[] = ARTICLES.filter(
    (article) =>
      isPublished(article)
      && isStaticArticleIndexable(article)
      && discoverableStatic.has(article.slug)
      && authorSlug(article.author) === author.slug,
  ).map((article) => ({
    slug: article.slug,
    category: article.category,
    title: article.title,
    dek: article.dek,
    publishedAt: article.publishedAt ?? article.date,
  }));

  const currentArticles: ProfileArticle[] = liveArticles.map((article) => ({
    slug: article.slug,
    category: article.category,
    title: article.seo_headline?.trim() || article.title,
    dek: article.dek,
    publishedAt: article.published_at,
  }));

  const byAuthor = [...new Map(
    [...currentArticles, ...staticArticles].map((article) => [article.slug, article]),
  ).values()]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 20);

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/news" className="hover:text-primary">Newsroom</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Editorial Byline</span>
      </nav>
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Keep TX Red</span>
      <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-2">{author.name}</h1>
      <p className="mt-2 font-serif italic text-muted-foreground">{author.role}</p>

      <div className="mt-6 rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
        <strong className="text-foreground">Byline disclosure:</strong> {EDITORIAL_BYLINE_DISCLOSURE}
      </div>

      <div className="mt-6 space-y-4 font-serif text-base leading-relaxed">
        {author.bio.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>

      <div className="mt-6">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">Coverage areas</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {author.beats.map((beat) => (
            <span key={beat} className="text-xs border border-border px-2 py-1">{beat}</span>
          ))}
        </div>
      </div>

      {guide && <section className="mt-10 border-t pt-6" aria-labelledby="desk-verification">
        <h2 id="desk-verification" className="font-display text-2xl tracking-tight">How to verify this coverage</h2>
        <p className="mt-3 leading-7">{guide.focus}</p>
        <h3 className="mt-5 font-semibold">Primary-source research starting points</h3>
        <dl className="mt-3 space-y-4">{guide.sources.map((source) => <div key={source.href}><dt><a href={source.href} className="font-semibold text-primary underline underline-offset-4">{source.label}</a></dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">{source.use}</dd></div>)}</dl>
        <h3 className="mt-5 font-semibold">Related reference guides</h3>
        <ul className="mt-3 space-y-2">{guide.references.map((reference) => <li key={reference.href}><a href={reference.href} className="text-primary underline underline-offset-4">{reference.label}</a></li>)}</ul>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">These resources are research starting points, not a claim that every article cites every listed source. Check the individual article for its evidence and <Link to="/contact" className="text-primary underline">contact Keep TX Red</Link> with a specific correction.</p>
      </section>}

      <section className="mt-12 pt-6 border-t-2 border-foreground">
        <h2 className="font-display text-2xl tracking-tight mb-4">Recent Articles</h2>
        {byAuthor.length === 0 ? (
          <p className="text-muted-foreground">This editorial byline has not published a current article yet.</p>
        ) : (
          <ul className="space-y-5">
            {byAuthor.map((article) => (
              <li key={article.slug}>
                <Link to="/news/$slug" params={{ slug: article.slug }} className="group block">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{article.category}</span>
                  <h3 className="font-serif text-lg font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.dek}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-12 text-xs text-muted-foreground border-t border-border pt-4 leading-5">
        This is an organizational editorial byline, not a personal profile. Source attribution, AI assistance, synthesis, corrections, and other production practices are described in Keep TX Red's <Link to="/editorial-standards" className="text-primary underline underline-offset-2">Editorial Standards</Link>.
      </p>
    </main>
  );
}

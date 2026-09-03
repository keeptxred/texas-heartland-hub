import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ARTICLES, isPublished, sortByDateDesc, type Article } from "@/data/articles";
import { ARTICLE_BODIES, type ArticleBody } from "@/data/article-bodies";
import { authorSlug, getAuthor } from "@/data/authors";
import {
  getEvergreenBySlug,
  resolveArticleSlugByTail,
  resolveArticleSlugRedirect,
  type EvergreenBody,
} from "@/lib/evergreen.functions";
import { getCloudArticleIndexability } from "@/lib/article-indexability.functions";
import { isBadYearSlug, parseArticleSlug } from "@/lib/article-slug-integrity";
import { normalizeCategoryName, type CategoryName } from "@/lib/articles-by-category";
import { AdSlot } from "@/components/ad-slot";
import { NewsletterSignup } from "@/components/newsletter-signup";
import {
  buildSeo,
  imageObjectJsonLd,
  ORGANIZATION_ID,
  personJsonLd,
  SITE_URL,
  WEBSITE_ID,
} from "@/lib/seo";
import { dedupeArticleBody } from "@/lib/article-dedupe";
import { resolveArticleImage } from "@/lib/seo-headline";
import type { HeadlineVariants } from "@/lib/ctr-score";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { visibleArticleDates } from "@/lib/article-visible-dates";

type StructuredArticleBody = ArticleBody & { entities?: EvergreenBody["entities"] };
type RenderedArticle = Omit<Article, "category"> & {
  category: CategoryName;
  noindex?: boolean;
  imageAlt?: string;
};

const GENERIC_FAQ_PATTERNS = [
  /where can i read more/i,
  /where can i learn more/i,
  /how can i stay updated/i,
  /check back for updates/i,
];

function validIsoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function articleDates(article: Pick<RenderedArticle, "publishedAt">, body: ArticleBody) {
  const visible = visibleArticleDates(article.publishedAt, body.updated);
  return {
    published: visible.publishedIso,
    modified: visible.updatedIso ?? visible.publishedIso,
  };
}

function isSpecificFaq(faq: { q: string; a: string }) {
  const question = faq.q.trim();
  const answer = faq.a.trim();
  if (question.length < 12 || answer.length < 30) return false;
  return !GENERIC_FAQ_PATTERNS.some((pattern) => pattern.test(`${question} ${answer}`));
}

function isStaticArticleDiscoverableForRelated(article: Article): boolean {
  return isPublished(article) && isStaticArticleIndexable(article) && Boolean(ARTICLE_BODIES[article.slug]);
}

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }): Promise<{
    article: RenderedArticle;
    body: StructuredArticleBody;
    ctr?: { variants: HeadlineVariants | null; score: number | null } | null;
  }> => {
    const article = ARTICLES.find((a) => a.slug === params.slug);
    if (article && isStaticArticleIndexable(article)) {
      if (!isPublished(article)) throw notFound();
      const explicitBody = ARTICLE_BODIES[params.slug];
      const rawBody = explicitBody ?? buildDefaultBody(article);
      const body = dedupeArticleBody(rawBody) as ArticleBody;
      const renderedArticle: RenderedArticle = {
        ...article,
        // Preserve the retired-content guard and keep generated fallback bodies
        // out of search until they have explicit, substantive article content.
        noindex: !isStaticArticleIndexable(article) || !explicitBody,
      };
      return { article: renderedArticle, body, ctr: null };
    }
    const mapped = await resolveArticleSlugRedirect({ data: { slug: params.slug } });
    if (mapped.slug && mapped.slug !== params.slug) {
      throw redirect({ href: `/news/${encodeURIComponent(mapped.slug)}`, statusCode: 301 });
    }
    const ever = await getEvergreenBySlug({ data: { slug: params.slug } });
    if (!ever || !ever.body) {
      if (article) {
        if (!isPublished(article)) throw notFound();
        const rawBody = ARTICLE_BODIES[params.slug] ?? buildDefaultBody(article);
        const body = dedupeArticleBody(rawBody) as ArticleBody;
        return { article: { ...article, noindex: true }, body, ctr: null };
      }
      const parsed = parseArticleSlug(params.slug);
      if (parsed && isBadYearSlug(params.slug)) {
        const { slug } = await resolveArticleSlugByTail({ data: { tail: parsed.tail } });
        if (slug && slug !== params.slug) {
          throw redirect({ href: `/news/${slug}`, statusCode: 301 });
        }
      }
      throw notFound();
    }
    const stubPattern = /affects Texans and is being tracked by the Keep TX Red newsroom/i;
    const introText = (ever.body.intro ?? []).join(" ").trim();
    const nonStubSections = (ever.body.sections ?? []).filter(
      (s) => !(s.paragraphs ?? []).some((p) => stubPattern.test(p)),
    );
    if (nonStubSections.length === 0 && introText.length < 200) throw notFound();
    if (!meetsArticleMainWordCount(ever.kind, ever.body)) throw notFound();
    const { noindex } = await getCloudArticleIndexability({ data: { slug: params.slug } });
    const cat = normalizeCategoryName(ever.category);
    const displayTitle = (ever.seo_headline ?? "").trim() || ever.title;
    const synth: RenderedArticle = {
      slug: ever.slug,
      category: cat,
      noindex,
      title: displayTitle,
      dek: ever.dek,
      author: ever.author,
      date: new Date(ever.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      publishedAt: ever.published_at,
      image: resolveArticleImage({
        slug: ever.slug,
        title: ever.title,
        dek: ever.dek,
        seo_headline: ever.seo_headline,
        discover_category: ever.discover_category,
        image_url: ever.image_url,
        image_category: ever.image_category,
        category: ever.category,
        keywords: ever.keywords,
        seo_keywords: ever.seo_keywords,
        featured_image_url: ever.featured_image_url,
        image_alt_text: ever.image_alt_text,
      }),
      imageAlt: (ever.image_alt_text ?? "").trim() || displayTitle,
    };
    const rawBody: StructuredArticleBody = {
      updated: ever.body.updated,
      intro: ever.body.intro,
      sections: ever.body.sections,
      faq: ever.body.faq,
      sources: ever.body.sources,
      related: ARTICLES.filter(
        (x) => x.category === ever.category && isStaticArticleDiscoverableForRelated(x),
      ).sort(sortByDateDesc).slice(0, 3).map((x) => x.slug),
      cta: { label: "Browse the Newsroom", href: "/news" },
      keyTakeaways: ever.body.keyTakeaways,
      entities: ever.body.entities,
    };
    return {
      article: synth,
      body: dedupeArticleBody(rawBody) as StructuredArticleBody,
      ctr: { variants: ever.headline_variants, score: ever.ctr_score },
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article not found — Keep TX Red" },
          { name: "robots", content: "noindex,follow" },
        ],
      };
    }
    const { article, body } = loaderData;
    const path = `/news/${article.slug}`;
    const { published, modified } = articleDates(article, body);
    const authorPath = `/authors/${authorSlug(article.author)}`;
    const authorUrl = `${SITE_URL}${authorPath}`;
    const articleFaq = body.faq.filter(isSpecificFaq);
    const articleImageWidth = 1280;
    const articleImageHeight = article.slug === "texas-policing-agencies-compared" ? 672 : 720;
    const imageAlt = article.imageAlt ?? article.title;
    const seo = buildSeo({
      title: article.title,
      description: article.dek,
      path,
      image: article.image,
      imageAlt,
      imageWidth: articleImageWidth,
      imageHeight: articleImageHeight,
      type: "article",
      publishedTime: published,
      modifiedTime: modified,
      section: article.category,
      author: article.author,
      noindex: article.noindex === true,
    });
    const articleImage = imageObjectJsonLd({
      url: seo.image,
      width: articleImageWidth,
      height: articleImageHeight,
      caption: article.title,
      alt: imageAlt,
      representativeOfPage: true,
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "@id": `${seo.url}#article`,
            url: seo.url,
            headline: article.title,
            description: seo.description,
            image: { ...articleImage, "@type": "ImageObject" },
            thumbnailUrl: seo.image,
            datePublished: published,
            dateModified: modified,
            author: personJsonLd({
              name: article.author,
              url: authorUrl,
              id: `${authorUrl}#person`,
            }),
            publisher: { "@id": ORGANIZATION_ID },
            isPartOf: { "@id": WEBSITE_ID },
            mainEntityOfPage: { "@type": "WebPage", "@id": `${seo.url}#webpage` },
            articleSection: article.category,
            inLanguage: "en-US",
            about: body.entities?.map((entity) => ({
              "@type": entity.type,
              name: entity.name,
              ...(entity.identifier ? { identifier: entity.identifier } : {}),
              ...(entity.url ? { url: entity.url } : {}),
              ...(entity.sameAs ? { sameAs: entity.sameAs } : {}),
            })),
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
              { "@type": "ListItem", position: 3, name: article.title, item: seo.url },
            ],
          }),
        },
        articleFaq.length > 0
          ? {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "@id": `${seo.url}#faq`,
                mainEntity: articleFaq.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            }
          : null,
      ].filter(Boolean) as { type: string; children: string }[],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Article Not Found</h1>
      <p className="text-muted-foreground mb-6">That article may have moved or never existed.</p>
      <Link to="/news" className="text-primary underline">Back to the newsroom</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Something went wrong</h1>
      <Link to="/news" className="text-primary underline">Back to the newsroom</Link>
    </div>
  ),
  component: ArticlePage,
});

function buildDefaultBody(a: Article): ArticleBody {
  return _buildDefaultBody(a);
}

function _buildDefaultBody(a: Article): ArticleBody {
  return {
    updated: (a.publishedAt ?? new Date().toISOString()).slice(0, 10),
    intro: [a.dek],
    sections: [
      {
        heading: "What This Means for Texans",
        paragraphs: [
          "Keep TX Red is tracking this story as it develops. Check back for updates and follow our daily newsroom coverage for related reporting.",
        ],
      },
    ],
    faq: [],
    sources: [
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" },
      { label: "Texas Secretary of State", url: "https://www.sos.state.tx.us/" },
    ],
    related: ARTICLES.filter(
      (x) => x.category === a.category && x.slug !== a.slug && isStaticArticleDiscoverableForRelated(x),
    )
      .sort(sortByDateDesc)
      .slice(0, 3)
      .map((x) => x.slug),
    cta: { label: "Browse the Newsroom", href: "/news" },
  };
}

function ArticlePage() {
  const { article, body } = Route.useLoaderData() as {
    article: RenderedArticle;
    body: ArticleBody;
    ctr?: { variants: HeadlineVariants | null; score: number | null } | null;
  };

  const related = body.related
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is Article => Boolean(a) && isStaticArticleDiscoverableForRelated(a as Article));

  const wordCount =
    body.intro.join(" ").split(/\s+/).length +
    body.sections.reduce(
      (n, s) =>
        n +
        (s.paragraphs?.join(" ").split(/\s+/).length ?? 0) +
        (s.bullets?.join(" ").split(/\s+/).length ?? 0),
      0,
    );
  const readingMinutes = Math.max(2, Math.round(wordCount / 230));

  const visibleDates = visibleArticleDates(article.publishedAt, body.updated);
  const publishedDisplay = new Date(visibleDates.publishedIso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Chicago",
  });
  const updatedDisplay = visibleDates.updatedIso
    ? new Date(visibleDates.updatedIso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/Chicago",
      })
    : null;
  const author = getAuthor(article.author);
  const authorHref = author ? `/authors/${author.slug}` : `/authors/${authorSlug(article.author)}`;
  const imageAlt = article.imageAlt ?? article.title;

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/news" className="hover:text-primary">Newsroom</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">{article.category}</span>
      </nav>

      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ {article.category}</span>
      <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05] mt-2">{article.title}</h1>
      <p className="mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground leading-7 md:leading-8 font-serif italic">{article.dek}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-y border-border py-3">
        <Link to={authorHref} className="font-semibold text-foreground hover:text-primary underline-offset-2 hover:underline">
          By {article.author}
        </Link>
        <span>•</span>
        <span>Published <time dateTime={visibleDates.publishedIso}>{publishedDisplay}</time></span>
        {visibleDates.updatedIso && updatedDisplay ? (
          <>
            <span>•</span>
            <span>Updated <time dateTime={visibleDates.updatedIso}>{updatedDisplay}</time></span>
          </>
        ) : null}
        <span>•</span>
        <span>{readingMinutes} min read</span>
        <span>•</span>
        <span className="uppercase tracking-wider text-[10px] font-semibold text-primary">{article.category}</span>
        {article.pillar ? (
          <>
            <span>•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">★ Pillar Guide</span>
          </>
        ) : null}
      </div>

      {body.editorNote ? (
        <p className="mt-5 text-sm bg-accent/10 border-l-4 border-accent px-4 py-3 italic text-foreground/80 leading-6">
          <strong className="not-italic font-semibold text-accent uppercase tracking-wider text-[10px] block mb-1">Editor's Note</strong>
          {body.editorNote}
        </p>
      ) : null}

      <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground border-l-2 border-primary/40 pl-3 leading-5">
        Reporting is based on the sources and public records cited or linked in this article. Opinion and analysis are labeled and follow our <Link to="/editorial-standards" className="text-primary hover:underline">editorial standards</Link>.
      </p>

      <div className={`${article.slug === "texas-policing-agencies-compared" ? "aspect-[40/21]" : "aspect-[16/9]"} overflow-hidden bg-muted my-8 md:my-10 border-2 border-foreground/10`}>
        <img
          src={article.image}
          alt={imageAlt}
          className={`size-full ${article.slug === "texas-policing-agencies-compared" ? "object-contain" : "object-cover"}`}
          width={1280}
          height={article.slug === "texas-policing-agencies-compared" ? 672 : 720}
        />
      </div>

      <div className="prose prose-neutral mx-auto max-w-2xl prose-a:font-medium prose-a:text-primary prose-a:underline prose-a:underline-offset-2 prose-blockquote:my-8 prose-blockquote:border-l-4 prose-blockquote:pl-5 prose-blockquote:font-serif prose-blockquote:text-lg prose-blockquote:leading-8 prose-li:my-1.5">
        {body.intro.map((p, i) => (
          <p key={i} className="font-serif text-[17px] md:text-lg leading-8 text-foreground first:first-letter:text-5xl first:first-letter:font-bold first:first-letter:float-left first:first-letter:mr-2 first:first-letter:leading-none first:first-letter:text-primary mb-7">
            {renderInline(p)}
          </p>
        ))}

        <AdSlot placement="top" />

        {body.sections.map((sec, i) => (
          <section key={i} className="mt-12 md:mt-14 first:mt-10">
            <h2 className="font-display text-2xl md:text-3xl tracking-tight leading-tight mb-6 border-b border-border pb-3 text-balance">{sec.heading}</h2>
            {sec.image ? (
              <figure className="my-7 md:my-8">
                <div className="aspect-[16/9] overflow-hidden bg-muted border border-foreground/10">
                  <img src={sec.image.src} alt={sec.image.alt} loading="lazy" className="size-full object-cover" />
                </div>
                {sec.image.caption ? (
                  <figcaption className="mt-3 text-xs leading-5 text-muted-foreground italic text-center">{sec.image.caption}</figcaption>
                ) : null}
              </figure>
            ) : null}
            {sec.paragraphs?.map((p, j) => (
              <p key={j} className="font-serif text-[17px] md:text-lg leading-8 text-foreground mb-6 last:mb-0">
                {renderInline(p)}
              </p>
            ))}
            {sec.bullets ? (
              <ul className="list-disc pl-6 space-y-3 my-6">
                {sec.bullets.map((b, j) => (
                  <li key={j} className="font-serif text-[17px] md:text-lg leading-8 pl-1">{b}</li>
                ))}
              </ul>
            ) : null}
            {sec.table ? (
              <div className="overflow-x-auto my-7">
                <table className="w-full text-sm border-collapse border border-border">
                  <thead className="bg-secondary text-secondary-foreground">
                    <tr>
                      {sec.table.headers.map((h, j) => (
                        <th key={j} className="text-left font-semibold px-3 py-2 border border-border">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.table.rows.map((row, j) => (
                      <tr key={j} className="odd:bg-muted/40">
                        {row.map((cell, k) => (
                          <td key={k} className="px-3 py-2 border border-border align-top">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        ))}

        <AdSlot placement="in-content" />

        {body.faq.length > 0 ? (
          <section className="mt-14 md:mt-16">
            <h2 className="font-display text-2xl md:text-3xl tracking-tight leading-tight mb-6 border-b border-border pb-3">Frequently Asked Questions</h2>
            <dl className="space-y-7">
              {body.faq.map((f, i) => (
                <div key={i}>
                  <dt className="font-semibold text-foreground mb-2 text-base md:text-lg leading-7">{f.q}</dt>
                  <dd className="font-serif text-[17px] md:text-lg text-muted-foreground leading-8">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {body.sources.length > 0 ? (
          <section className="mt-14 md:mt-16">
            <h2 className="font-display text-xl md:text-2xl tracking-tight mb-4">Sources</h2>
            <ul className="space-y-2 text-sm leading-6">
              {body.sources.map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:no-underline">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {body.keyTakeaways && body.keyTakeaways.length > 0 ? (
          <aside className="mt-14 md:mt-16 border-2 border-primary/60 bg-primary/5 p-5 md:p-6">
            <h2 className="font-display text-xl md:text-2xl tracking-tight mb-4 text-primary">Key Takeaways</h2>
            <ul className="list-disc pl-6 space-y-3">
              {body.keyTakeaways.map((t, i) => (
                <li key={i} className="font-serif text-[17px] md:text-lg leading-8">{t}</li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>

      {body.cta ? (
        <div className="mx-auto max-w-2xl mt-14 border-2 border-primary bg-primary/5 p-6 md:p-8 text-center">
          <p className="font-display text-xl md:text-2xl tracking-tight mb-3">Take the next step</p>
          <Link
            to={body.cta.href}
            className="inline-block bg-primary text-primary-foreground px-6 py-3 font-semibold uppercase tracking-widest text-xs hover:bg-primary/90"
          >
            {body.cta.label} →
          </Link>
        </div>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-14 pt-8 border-t-2 border-foreground">
          <h2 className="font-display text-2xl tracking-tight mb-5">Related Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.slug} to="/news/$slug" params={{ slug: r.slug }} className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-muted mb-3">
                  <img src={r.image} alt={r.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{r.category}</span>
                <h3 className="font-serif font-bold text-base leading-snug mt-1 group-hover:underline underline-offset-4">{r.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <AdSlot placement="footer" />

      <div className="mt-10">
        <NewsletterSignup sourcePage={`/news/${article.slug}`} compact />
      </div>
    </article>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const [, label, href] = match;
    if (href.startsWith("/")) {
      return <Link key={i} to={href} className="text-primary font-medium underline underline-offset-2 hover:no-underline">{label}</Link>;
    }
    return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline underline-offset-2 hover:no-underline">{label}</a>;
  });
}
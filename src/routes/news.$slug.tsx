import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ARTICLES, isPublished, sortByDateDesc, type Article } from "@/data/articles";
import { ARTICLE_BODIES, type ArticleBody } from "@/data/article-bodies";
import { authorSlug, getAuthor } from "@/data/authors";
import { getEvergreenBySlug } from "@/lib/evergreen.functions";
import { AdSlot } from "@/components/ad-slot";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { buildSeo, SITE_URL } from "@/lib/seo";
import { dedupeArticleBody } from "@/lib/article-dedupe";
import { resolveArticleImage } from "@/lib/seo-headline";
import { resolveDisplayHeadline, type HeadlineVariants } from "@/lib/ctr-score";
import { useEffect } from "react";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }): Promise<{
    article: Article;
    body: ArticleBody;
    ctr?: { variants: HeadlineVariants | null; score: number | null } | null;
  }> => {
    const article = ARTICLES.find((a) => a.slug === params.slug);
    if (article) {
      if (!isPublished(article)) throw notFound();
      const rawBody = ARTICLE_BODIES[params.slug] ?? buildDefaultBody(article);
      const body = dedupeArticleBody(rawBody) as ArticleBody;
      return { article, body, ctr: null };
    }
    // Fallback: AI-generated evergreen article stored in daily_articles.
    const ever = await getEvergreenBySlug({ data: { slug: params.slug } });
    if (!ever || !ever.body) throw notFound();
    // Safety net: never render a stub article. If the body is only the
    // "affects Texans and is being tracked" boilerplate with a one-line
    // intro, treat it as missing rather than serve an empty page.
    const stubPattern = /affects Texans and is being tracked by the Keep TX Red newsroom/i;
    const introText = (ever.body.intro ?? []).join(" ").trim();
    const nonStubSections = (ever.body.sections ?? []).filter(
      (s) => !(s.paragraphs ?? []).some((p) => stubPattern.test(p)),
    );
    if (nonStubSections.length === 0 && introText.length < 200) throw notFound();
    const allowed = ["Legislature", "Border", "Elections", "Tax & Spending", "Energy", "Education"] as const;
    const cat = (allowed as readonly string[]).includes(ever.category) ? (ever.category as Article["category"]) : "Legislature";
    const synth: Article = {
      slug: ever.slug,
      category: cat,
      // Prefer AI-rewritten SEO/Discover headline; original stays in DB.
      title: (ever.seo_headline ?? "").trim() || ever.title,
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
      }),
    };
    const rawBody: ArticleBody = {
      updated: ever.body.updated,
      intro: ever.body.intro,
      sections: ever.body.sections,
      faq: ever.body.faq,
      sources: ever.body.sources,
      related: ARTICLES.filter((x) => x.category === ever.category && isPublished(x)).sort(sortByDateDesc).slice(0, 3).map((x) => x.slug),
      cta: { label: "Browse the Newsroom", href: "/news" },
      keyTakeaways: ever.body.keyTakeaways,
    };
    return {
      article: synth,
      body: dedupeArticleBody(rawBody) as ArticleBody,
      ctr: { variants: ever.headline_variants, score: ever.ctr_score },
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { article, body } = loaderData;
    const path = `/news/${article.slug}`;
    const keywords = buildKeywords(article.title, article.dek, article.category);
    const seo = buildSeo({
      title: article.title,
      description: article.dek,
      path,
      image: article.image,
      imageAlt: article.title,
      type: "article",
      publishedTime: body.updated,
      modifiedTime: body.updated,
      section: article.category,
      author: article.author,
      keywords,
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
            headline: article.title,
            description: seo.description,
            image: [seo.image],
            datePublished: body.updated,
            dateModified: body.updated,
            author: { "@type": "Person", name: article.author },
            publisher: {
              "@type": "NewsMediaOrganization",
              name: "Keep TX Red",
              url: `${SITE_URL}/`,
              logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": seo.url },
            articleSection: article.category,
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
              { "@type": "ListItem", position: 3, name: article.category, item: seo.url },
            ],
          }),
        },
        body.faq.length > 0
          ? {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: body.faq.map((f) => ({
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

const TEXAS_KEYWORDS = [
  "Texas",
  "Texas politics",
  "Texas news",
  "Lone Star State",
  "Houston",
  "Dallas",
  "Austin",
  "San Antonio",
  "Fort Worth",
];

function buildKeywords(title: string, dek: string, category: string): string {
  const base = new Set<string>([
    ...TEXAS_KEYWORDS,
    `Texas ${category}`,
    `${category} in Texas`,
  ]);
  // Pull capitalized phrases from title/dek as additional keyword hints.
  const text = `${title} ${dek}`;
  const matches = text.match(/\b[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2}\b/g) ?? [];
  for (const m of matches.slice(0, 8)) base.add(m);
  return Array.from(base).slice(0, 18).join(", ");
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
    faq: [
      {
        q: "Where can I read more on this topic?",
        a: "See our category page for related Texas political news, or explore our evergreen guides linked below.",
      },
    ],
    sources: [
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" },
      { label: "Texas Secretary of State", url: "https://www.sos.state.tx.us/" },
    ],
    related: ARTICLES.filter((x) => x.category === a.category && x.slug !== a.slug && isPublished(x))
      .sort(sortByDateDesc)
      .slice(0, 3)
      .map((x) => x.slug),
    cta: { label: "Browse the Newsroom", href: "/news" },
  };
}

function ArticlePage() {
  const { article, body, ctr } = Route.useLoaderData() as {
    article: Article;
    body: ArticleBody;
    ctr?: { variants: HeadlineVariants | null; score: number | null } | null;
  };

  // A/B variant selection is deterministic per slug + ctr_score.
  const { headline: displayTitle, variant } = resolveDisplayHeadline({
    slug: article.slug,
    title: article.title,
    dek: article.dek,
    seo_headline: article.title, // synth title already prefers seo_headline
    ctr_score: ctr?.score ?? null,
    headline_variants: ctr?.variants ?? null,
  });

  // Fire-and-forget impression track. No PII, no cookies, no blocking.
  useEffect(() => {
    if (!ctr?.variants) return;
    try {
      fetch("/api/public/hooks/track-variant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: article.slug, variant, kind: "impression" }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* noop */
    }
  }, [article.slug, variant, ctr?.variants]);

  const related = body.related
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is Article => Boolean(a) && isPublished(a as Article));

  // Reading time from full body word count (avg 230 wpm).
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


  const formattedDate = new Date(body.updated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Chicago",
  });
  const author = getAuthor(article.author);
  const authorHref = author ? `/authors/${author.slug}` : `/authors/${authorSlug(article.author)}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/news" className="hover:text-primary">Newsroom</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">{article.category}</span>
      </nav>

      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ {article.category}</span>
      <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05] mt-2">{displayTitle}</h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-snug font-serif italic">{article.dek}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-y border-border py-3">
        <Link to={authorHref} className="font-semibold text-foreground hover:text-primary underline-offset-2 hover:underline">
          By {article.author}
        </Link>
        <span>•</span>
        <span>Published <time dateTime={article.publishedAt ?? body.updated}>{new Date(article.publishedAt ?? body.updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time></span>
        <span>•</span>
        <span>Updated <time dateTime={body.updated}>{formattedDate}</time></span>
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
        <p className="mt-5 text-sm bg-accent/10 border-l-4 border-accent px-4 py-3 italic text-foreground/80">
          <strong className="not-italic font-semibold text-accent uppercase tracking-wider text-[10px] block mb-1">Editor's Note</strong>
          {body.editorNote}
        </p>
      ) : null}

      <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground border-l-2 border-primary/40 pl-3">
        Editorial disclaimer: Opinions and analysis on Keep TX Red are editorial content — not statements of fact. See our <Link to="/editorial-standards" className="text-primary hover:underline">editorial standards</Link>.
      </p>

      <div className="aspect-[16/9] overflow-hidden bg-muted my-8 border-2 border-foreground/10">
        <img src={article.image} alt={article.title} className="size-full object-cover" width={1280} height={720} />
      </div>

      <div className="prose prose-neutral max-w-none">
        {body.intro.map((p, i) => (
          <p key={i} className="font-serif text-lg leading-relaxed text-foreground first:first-letter:text-5xl first:first-letter:font-bold first:first-letter:float-left first:first-letter:mr-2 first:first-letter:leading-none first:first-letter:text-primary mb-5">
            {renderInline(p)}
          </p>
        ))}

        {/* SLOT 1 — after first paragraph */}
        <AdSlot placement="top" />

        {body.sections.map((sec, i) => (
          <section key={i} className="mt-10">
            <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">{sec.heading}</h2>
            {sec.image ? (
              <figure className="my-5">
                <div className="aspect-[16/9] overflow-hidden bg-muted border border-foreground/10">
                  <img src={sec.image.src} alt={sec.image.alt} loading="lazy" className="size-full object-cover" />
                </div>
                {sec.image.caption ? (
                  <figcaption className="mt-2 text-xs text-muted-foreground italic text-center">{sec.image.caption}</figcaption>
                ) : null}
              </figure>
            ) : null}
            {sec.paragraphs?.map((p, j) => (
              <p key={j} className="font-serif text-base leading-relaxed text-foreground mb-4">
                {renderInline(p)}
              </p>
            ))}
            {sec.bullets ? (
              <ul className="list-disc pl-6 space-y-2 my-4">
                {sec.bullets.map((b, j) => (
                  <li key={j} className="font-serif text-base leading-relaxed">{b}</li>
                ))}
              </ul>
            ) : null}
            {sec.table ? (
              <div className="overflow-x-auto my-5">
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

        {/* SLOT 2 — between body sections and FAQ */}
        <AdSlot placement="in-content" />

        {body.faq.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Frequently Asked Questions</h2>
            <dl className="space-y-5">
              {body.faq.map((f, i) => (
                <div key={i}>
                  <dt className="font-semibold text-foreground mb-1">{f.q}</dt>
                  <dd className="text-muted-foreground leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {body.sources.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-display text-xl tracking-tight mb-3">Official Sources</h2>
            <ul className="space-y-1 text-sm">
              {body.sources.map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {body.keyTakeaways && body.keyTakeaways.length > 0 ? (
          <aside className="mt-12 border-2 border-primary/60 bg-primary/5 p-5 md:p-6">
            <h2 className="font-display text-xl md:text-2xl tracking-tight mb-3 text-primary">Key Takeaways</h2>
            <ul className="list-disc pl-6 space-y-2">
              {body.keyTakeaways.map((t, i) => (
                <li key={i} className="font-serif text-base leading-relaxed">{t}</li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>

      {body.cta ? (
        <div className="mt-12 border-2 border-primary bg-primary/5 p-6 md:p-8 text-center">
          <p className="font-display text-xl md:text-2xl tracking-tight mb-3">Take the next step</p>
          <Link
            to={body.cta.href}
            className="inline-block bg-primary text-primary-foreground px-6 py-3 font-semibold uppercase tracking-widest text-xs hover:bg-primary/90"
          >
            {body.cta.label} →
          </Link>
        </div>
      ) : null}

      {/* Sitewide pillar CTA — every article links to Keep Texas Red */}
      <div className="mt-8 border-l-4 border-primary bg-muted/40 p-5">
        <p className="font-serif text-base">
          <Link to="/keep-texas-red" className="text-primary font-semibold hover:underline">
            Read more about Keep Texas Red →
          </Link>
          <span className="text-muted-foreground"> Our full guide to what Keep Texas Red means and why Texans support it.</span>
        </p>
      </div>

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

      {/* SLOT 3 — footer, before author bio */}
      <AdSlot placement="footer" />

      <div className="mt-10">
        <NewsletterSignup sourcePage={`/news/${article.slug}`} compact />
      </div>

      {author ? (
        <section className="mt-12 border-t border-border pt-6">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">About the author</span>
          <h3 className="font-display text-2xl tracking-tight mt-1">{author.name}</h3>
          <p className="text-sm italic text-muted-foreground">{author.role}</p>
          <p className="mt-2 font-serif text-sm leading-relaxed text-foreground/90">{author.bio[0]}</p>
          <Link to={authorHref} className="mt-2 inline-block text-xs font-bold uppercase tracking-widest text-primary hover:underline">
            More from {author.name} →
          </Link>
        </section>
      ) : (
        <section className="mt-12 border-t border-border pt-6">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">About the author</span>
          <h3 className="font-display text-2xl tracking-tight mt-1">{article.author}</h3>
          <p className="mt-2 font-serif text-sm leading-relaxed text-foreground/90">
            The Keep Texas Red Editorial Staff produces nonpartisan explainers, policy breakdowns, and educational resources to help Texans understand how their government works. All content is reviewed for accuracy and updated regularly.
          </p>
          <Link to="/about" className="mt-2 inline-block text-xs font-bold uppercase tracking-widest text-primary hover:underline">
            About Keep TX Red →
          </Link>
        </section>
      )}
    </article>
  );
}

// Renders [text](/path) as an internal Link and leaves the rest as text.
function renderInline(text: string) {
  const parts: (string | { label: string; href: string })[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text))) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    parts.push({ label: m[1], href: m[2] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.map((p, i) =>
    typeof p === "string" ? (
      <span key={i}>{p}</span>
    ) : (
      <Link key={i} to={p.href} className="text-primary underline underline-offset-2 hover:no-underline">
        {p.label}
      </Link>
    )
  );
}
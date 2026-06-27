import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ARTICLES, isPublished, sortByDateDesc, type Article } from "@/data/articles";
import { ARTICLE_BODIES, type ArticleBody } from "@/data/article-bodies";
import { authorSlug, getAuthor } from "@/data/authors";

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }): { article: Article; body: ArticleBody } => {
    const article = ARTICLES.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    if (!isPublished(article)) throw notFound();
    const body = ARTICLE_BODIES[params.slug] ?? buildDefaultBody(article);
    return { article, body };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { article, body } = loaderData;
    const suffixed = `${article.title} — Keep TX Red`;
    const title = suffixed.length <= 60 ? suffixed : article.title.slice(0, 60);
    const desc = article.dek;
    const path = `/news/${article.slug}`;
    const keywords = buildKeywords(article.title, article.dek, article.category);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: keywords },
        { property: "og:title", content: article.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: path },
        { property: "og:image", content: article.image },
        { name: "twitter:image", content: article.image },
        { property: "article:published_time", content: body.updated },
        { property: "article:modified_time", content: body.updated },
        { property: "article:section", content: article.category },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            description: desc,
            datePublished: body.updated,
            dateModified: body.updated,
            author: { "@type": "Organization", name: "Keep TX Red Editorial Team" },
            publisher: {
              "@type": "Organization",
              name: "Keep TX Red",
              logo: { "@type": "ImageObject", url: "/favicon.ico" },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": path },
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
  const { article, body } = Route.useLoaderData() as { article: Article; body: ArticleBody };
  const related = body.related
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is Article => Boolean(a) && isPublished(a as Article));

  // Mid-article supplementary image: pick the first related article's image
  // so every published article ships with at least 3 distinct, alt-tagged
  // visuals (hero + mid-article + 3 related thumbnails = 5 total).
  const midImage = related[0]
    ? { src: related[0].image, alt: `Related Texas coverage: ${related[0].title}` }
    : null;
  const midSectionIndex = Math.min(1, Math.max(0, body.sections.length - 1));

  const formattedDate = new Date(body.updated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
      <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05] mt-2">{article.title}</h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-snug font-serif italic">{article.dek}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-y border-border py-3">
        <Link to={authorHref} className="font-semibold text-foreground hover:text-primary underline-offset-2 hover:underline">
          By {article.author}
        </Link>
        <span>•</span>
        <span>
          Last updated <time dateTime={body.updated}>{formattedDate}</time>
        </span>
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
            {p}
          </p>
        ))}

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
            {!sec.image && midImage && i === midSectionIndex ? (
              <figure className="my-6">
                <div className="aspect-[16/9] overflow-hidden bg-muted border border-foreground/10">
                  <img src={midImage.src} alt={midImage.alt} loading="lazy" className="size-full object-cover" />
                </div>
                <figcaption className="mt-2 text-xs text-muted-foreground italic text-center">{midImage.alt}</figcaption>
              </figure>
            ) : null}
          </section>
        ))}

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
      ) : null}
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
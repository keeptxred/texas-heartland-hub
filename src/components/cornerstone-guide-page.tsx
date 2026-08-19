import { Link } from "@tanstack/react-router";
import type { CornerstoneGuide } from "@/data/cornerstone-guides";
import { ARTICLES } from "@/data/articles";
import { SITE_URL } from "@/lib/seo";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

function isRelatedGuideLinkPublic(href: string): boolean {
  const match = /^\/news\/([^/?#]+)$/.exec(href);
  if (!match) return true;
  const article = ARTICLES.find((candidate) => candidate.slug === match[1]);
  return !article || isStaticArticleIndexable(article);
}

export function cornerstoneGuideHead(guide: CornerstoneGuide) {
  const url = `${SITE_URL}/guides/${guide.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: guide.title,
    description: guide.dek,
    datePublished: guide.updated,
    dateModified: guide.updated,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
    about: { "@type": "Thing", name: guide.pillarLabel },
    inLanguage: "en-US",
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Topics", item: `${SITE_URL}/topics` },
      { "@type": "ListItem", position: 3, name: guide.pillarLabel, item: `${SITE_URL}${guide.pillarHref}` },
      { "@type": "ListItem", position: 4, name: guide.title, item: url },
    ],
  };

  return {
    meta: [
      { title: guide.title },
      { name: "description", content: guide.dek },
      { property: "og:title", content: guide.title },
      { property: "og:description", content: guide.dek },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [articleJsonLd, faqJsonLd, breadcrumbJsonLd].map((value) => ({
      type: "application/ld+json",
      children: JSON.stringify(value),
    })),
  };
}

export function CornerstoneGuidePage({ guide }: { guide: CornerstoneGuide }) {
  const wordCount = [
    ...guide.intro,
    ...guide.sections.flatMap((section) => [...(section.paragraphs ?? []), ...(section.bullets ?? [])]),
    ...guide.faq.flatMap((item) => [item.q, item.a]),
  ].join(" ").split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(5, Math.round(wordCount / 230));
  const publicRelated = guide.related.filter((item) => isRelatedGuideLinkPublic(item.href));

  return (
    <article className="mx-auto max-w-4xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-6">
        <Link to="/topics" className="hover:text-primary">Topics</Link>
        <span className="mx-2">/</span>
        <a href={guide.pillarHref} className="hover:text-primary">{guide.pillarLabel}</a>
        <span className="mx-2">/</span>
        <span className="text-primary">Guide</span>
      </nav>

      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Cornerstone Guide</span>
      <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05] mt-2">{guide.title}</h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-snug font-serif italic">{guide.dek}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-border py-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Keep TX Red Editorial Desk</span>
        <span>•</span>
        <span>Updated <time dateTime={guide.updated}>{new Date(`${guide.updated}T12:00:00-05:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time></span>
        <span>•</span>
        <span>About {readingMinutes} min read</span>
      </div>

      <section className="mt-8 border-l-4 border-primary bg-primary/5 p-5 md:p-6">
        <h2 className="font-display text-2xl tracking-tight">Key Takeaways</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed">
          {guide.keyTakeaways.map((item) => <li key={item}>• {item}</li>)}
        </ul>
      </section>

      <div className="mt-8 space-y-5 font-serif text-base md:text-[17px] leading-8 text-foreground/95">
        {guide.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>

      {guide.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="font-display text-3xl tracking-tight border-b border-border pb-2">{section.heading}</h2>
          {section.paragraphs?.length ? (
            <div className="mt-4 space-y-5 font-serif text-base md:text-[17px] leading-8 text-foreground/95">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          ) : null}
          {section.bullets?.length ? (
            <ul className="mt-4 space-y-3 text-base leading-7">
              {section.bullets.map((item) => <li key={item} className="flex gap-3"><span className="text-primary font-bold">•</span><span>{item}</span></li>)}
            </ul>
          ) : null}
        </section>
      ))}

      <section className="mt-12">
        <h2 className="font-display text-3xl tracking-tight border-b border-border pb-2">Frequently Asked Questions</h2>
        <div className="mt-5 space-y-6">
          {guide.faq.map((item) => (
            <div key={item.q}>
              <h3 className="font-serif font-bold text-lg">{item.q}</h3>
              <p className="mt-2 text-sm md:text-base leading-7 text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display text-2xl tracking-tight">Primary Sources</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {guide.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">{source.label}</a>
            </li>
          ))}
        </ul>
      </section>

      {publicRelated.length > 0 ? (
        <section className="mt-10 rounded-xl border bg-muted/20 p-6">
          <h2 className="font-display text-2xl tracking-tight">Continue this topic</h2>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
            {publicRelated.map((item) => <a key={item.href} href={item.href} className="text-primary hover:underline">{item.label} →</a>)}
          </div>
        </section>
      ) : null}
    </article>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { issueGuideBySlug } from "@/data/issue-guides";

const SITE_URL = "https://keeptxred.com";

export const Route = createFileRoute("/issues/$slug")({
  head: ({ params }) => {
    const guide = issueGuideBySlug[params.slug];
    const title = guide ? `${guide.title} | Keep TX Red` : "Texas Policy Guide | Keep TX Red";
    const description = guide?.dek ?? "Keep TX Red Texas policy guide.";
    const pageUrl = `${SITE_URL}/issues/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: pageUrl },
      ],
      links: [{ rel: "canonical", href: pageUrl }],
      scripts: guide ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.dek,
          url: pageUrl,
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          about: guide.category,
          isPartOf: { "@type": "CollectionPage", name: "Texas Issues & Policy Guides", url: `${SITE_URL}/issues` },
        }),
      }] : [],
    };
  },
  component: IssueGuidePage,
});

function IssueGuidePage() {
  const { slug } = Route.useParams();
  const guide = issueGuideBySlug[slug];

  if (!guide) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="font-display text-5xl">Guide not found</h1>
        <p className="mt-4 text-muted-foreground">This Texas policy guide is not available.</p>
        <a href="/issues" className="mt-6 inline-block font-semibold text-primary underline">Browse Texas issue guides</a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0">
          <nav className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" aria-label="Breadcrumb">
            <a href="/issues" className="hover:text-primary">Texas Issues</a> <span aria-hidden="true">/</span> {guide.category}
          </nav>
          <header className="mt-5">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ {guide.category}</span>
            <h1 className="mt-2 font-display text-4xl leading-[0.95] tracking-tight md:text-6xl">{guide.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{guide.dek}</p>
          </header>

          <section className="mt-8 border-l-4 border-primary bg-muted/40 p-5" aria-labelledby="quick-answer">
            <h2 id="quick-answer" className="font-display text-2xl tracking-tight">Quick Answer</h2>
            <p className="mt-2 leading-relaxed">{guide.quickAnswer}</p>
          </section>

          <div className="mt-10 space-y-10">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-3xl tracking-tight">{section.heading}</h2>
                <div className="mt-3 space-y-4 text-base leading-7 text-muted-foreground">
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>

          {guide.toolLinks?.length ? (
            <section className="mt-12 border-y py-7">
              <h2 className="font-display text-3xl tracking-tight">Related KTR tools</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {guide.toolLinks.map((link) => (
                  <a key={link.href} href={link.href} className="border px-4 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary">{link.label} →</a>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-12" aria-labelledby="primary-sources">
            <h2 id="primary-sources" className="font-display text-3xl tracking-tight">Primary sources</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use these official sources to check the law, agency responsibility, or bill text behind this guide. Links to legislation point to official Texas Legislature Online or government sources.</p>
            <ul className="mt-4 space-y-3">
              {guide.sources.map((source) => (
                <li key={source.url} className="border-l-2 pl-4">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2">{source.label}</a>
                  {source.note ? <p className="mt-1 text-sm text-muted-foreground">{source.note}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="space-y-7 lg:sticky lg:top-24 lg:self-start">
          <section className="border p-5">
            <h2 className="font-display text-2xl tracking-tight">Related issue guides</h2>
            <div className="mt-4 space-y-4">
              {guide.relatedSlugs.map((relatedSlug) => {
                const related = issueGuideBySlug[relatedSlug];
                if (!related) return null;
                return (
                  <a key={relatedSlug} href={`/issues/${relatedSlug}`} className="block border-b pb-4 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{related.category}</span>
                    <span className="mt-1 block font-semibold leading-snug hover:text-primary">{related.title}</span>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="border p-5">
            <h2 className="font-display text-2xl tracking-tight">Follow the live story</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Evergreen guides explain the rules. KTR news coverage tracks new bills, lawsuits, agency actions, elections and political fights as they happen.</p>
            <a href="/" className="mt-4 inline-block text-sm font-semibold text-primary">Latest Texas news →</a>
          </section>
        </aside>
      </div>
    </main>
  );
}

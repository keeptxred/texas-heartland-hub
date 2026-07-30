import { Link } from "@tanstack/react-router";
import { buildSeo } from "@/lib/seo";

export type PillarSection = { heading?: string; paragraphs: string[] };
export type PillarLink = { to: string; label: string; description: string };
export type PillarStat = { value: string; label: string; source?: string };
export type PillarEntityLink = PillarLink & { meta?: string };

export type PillarArticleProps = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  image: string;
  imageAlt: string;
  publishedISO: string;
  updatedISO: string;
  intro: string;
  sections: PillarSection[];
  currentLaw?: PillarSection[];
  pendingLegislation?: PillarEntityLink[];
  statistics?: PillarStat[];
  relatedRepresentatives?: PillarEntityLink[];
  relatedBills?: PillarEntityLink[];
  relatedElections?: PillarEntityLink[];
  relatedArticles?: PillarLink[];
  keyTakeaways: string[];
  faq: { q: string; a: string }[];
  related: PillarLink[];
};

export function buildPillarHead(p: PillarArticleProps) {
  const path = `/texas/${p.slug.replace(/^texas\//, "")}`;
  const seo = buildSeo({
    title: p.metaTitle,
    description: p.metaDescription,
    path,
    image: p.image,
    imageAlt: p.imageAlt,
    type: "article",
    publishedTime: p.publishedISO,
    modifiedTime: p.updatedISO,
    section: "Texas Issues",
    author: "Keep Texas Red Editorial Staff",
    keywords: p.focusKeyword,
  });

  const itemList = [
    ...(p.pendingLegislation ?? []),
    ...(p.relatedRepresentatives ?? []),
    ...(p.relatedBills ?? []),
    ...(p.relatedElections ?? []),
    ...(p.relatedArticles ?? []),
  ];

  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["Article", "WebPage"],
          headline: p.title,
          name: p.title,
          description: p.metaDescription,
          image: [seo.image],
          datePublished: p.publishedISO,
          dateModified: p.updatedISO,
          about: { "@type": "Thing", name: p.focusKeyword },
          author: { "@type": "Organization", name: "Keep Texas Red Editorial Staff" },
          publisher: {
            "@type": "NewsMediaOrganization",
            name: "Keep TX Red",
            url: "https://keeptxred.com/",
            logo: { "@type": "ImageObject", url: "https://keeptxred.com/favicon.ico" },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": seo.url },
          keywords: p.focusKeyword,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://keeptxred.com/" },
            { "@type": "ListItem", position: 2, name: "Texas Issues", item: "https://keeptxred.com/texas" },
            { "@type": "ListItem", position: 3, name: p.title, item: seo.url },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: p.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      ...(itemList.length
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: `${p.title} related resources`,
                itemListElement: itemList.map((item, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: item.label,
                  url: new URL(item.to, "https://keeptxred.com").toString(),
                })),
              }),
            },
          ]
        : []),
    ],
  };
}

function ContentSections({ sections }: { sections: PillarSection[] }) {
  return (
    <>
      {sections.map((section, index) => (
        <section key={`${section.heading ?? "section"}-${index}`} className="mt-10">
          {section.heading ? (
            <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">
              {section.heading}
            </h2>
          ) : null}
          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex} className="font-serif text-base md:text-lg leading-relaxed text-foreground mb-4">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </>
  );
}

function ResourceGrid({ title, items }: { title: string; items?: PillarEntityLink[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => (
          <a key={`${title}-${item.to}-${item.label}`} href={item.to} className="group block border-2 border-foreground/10 bg-card p-5 hover:border-primary hover:bg-primary/5 transition-colors">
            {item.meta ? <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{item.meta}</span> : null}
            <h3 className="font-display text-lg tracking-tight group-hover:text-primary mt-1">{item.label}</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-primary">View →</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function PillarArticle(p: PillarArticleProps) {
  const updated = new Date(p.updatedISO).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <article className="mx-auto max-w-4xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/texas" className="hover:text-primary">Texas</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Issue Hub</span>
      </nav>

      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Texas Issue Authority Hub</span>
      <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight mt-3">{p.title}</h1>
      <p className="mt-3 text-xs text-muted-foreground">By Keep Texas Red Editorial Staff · Last updated {updated}</p>

      <div className="mt-6 aspect-[16/9] overflow-hidden border border-foreground/10 bg-muted">
        <img src={p.image} alt={p.imageAlt} width={1024} height={576} fetchPriority="high" className="size-full object-cover" />
      </div>

      <nav aria-label="On this page" className="mt-8 border border-border bg-muted/40 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-3">On this page</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a href="#overview" className="hover:text-primary">Overview</a>
          <a href="#current-law" className="hover:text-primary">Current law</a>
          <a href="#pending-legislation" className="hover:text-primary">Pending legislation</a>
          <a href="#statistics" className="hover:text-primary">Statistics</a>
          <a href="#faq" className="hover:text-primary">FAQ</a>
          <a href="#related-resources" className="hover:text-primary">Related resources</a>
        </div>
      </nav>

      <section id="overview" className="scroll-mt-24">
        <h2 className="sr-only">Overview</h2>
        <p className="mt-8 font-serif text-lg md:text-xl leading-relaxed text-foreground">{p.intro}</p>
        <ContentSections sections={p.sections} />
      </section>

      {p.currentLaw?.length ? (
        <section id="current-law" className="scroll-mt-24">
          <ContentSections sections={[{ heading: "Current Law", paragraphs: [] }, ...p.currentLaw]} />
        </section>
      ) : null}

      <section id="pending-legislation" className="scroll-mt-24">
        <ResourceGrid title="Pending Legislation" items={p.pendingLegislation} />
      </section>

      {p.statistics?.length ? (
        <section id="statistics" className="mt-12 scroll-mt-24">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Statistics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {p.statistics.map((stat) => (
              <div key={`${stat.value}-${stat.label}`} className="border-2 border-foreground/10 bg-card p-5">
                <div className="font-display text-3xl text-primary">{stat.value}</div>
                <div className="mt-1 text-sm font-medium">{stat.label}</div>
                {stat.source ? <div className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">Source: {stat.source}</div> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <aside className="mt-12 border-2 border-primary bg-primary/5 p-6">
        <h2 className="font-display text-xl tracking-tight mb-3">Key Takeaways</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-foreground">
          {p.keyTakeaways.map((takeaway, index) => <li key={index}>{takeaway}</li>)}
        </ul>
      </aside>

      <section id="faq" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Frequently Asked Questions</h2>
        <div className="space-y-5">
          {p.faq.map((item, index) => (
            <div key={index}>
              <h3 className="font-serif font-bold text-base md:text-lg">{item.q}</h3>
              <p className="mt-1 font-serif text-base leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div id="related-resources" className="scroll-mt-24">
        <ResourceGrid title="Related Representatives" items={p.relatedRepresentatives} />
        <ResourceGrid title="Related Bills" items={p.relatedBills} />
        <ResourceGrid title="Related Elections" items={p.relatedElections} />
        <ResourceGrid title="Related Articles" items={p.relatedArticles} />
        <ResourceGrid title="Related Texas Guides" items={p.related} />
      </div>

      <p className="mt-10 text-xs text-muted-foreground italic">
        Editorial note: Keep Texas Red is an independent Texas-focused publisher. This hub is informational and reflects publicly available policy, legislative, election, and economic context as of the last updated date above.
      </p>
    </article>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { TEXAS_CASE_FACTS } from "@/data/texas-case-facts";
import { getTexasCasePosition } from "@/data/texas-case-all";
import { buildSeo, SITE_URL, webPageJsonLd } from "@/lib/seo";

const TITLE = "Texas Policy Facts & Framework | Keep TX Red";
const DESCRIPTION = "Factual companion pages for The Texas Case: laws, agencies, legal frameworks, key questions, and primary sources separated from KTR editorial positions.";

export const Route = createFileRoute("/texas-case/facts")({
  head: () => {
    const seo = buildSeo({ title: TITLE, description: DESCRIPTION, path: "/texas-case/facts" });
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Texas Policy Facts & Framework",
      numberOfItems: TEXAS_CASE_FACTS.length,
      itemListElement: TEXAS_CASE_FACTS.map((facts, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: facts.title,
        url: `${SITE_URL}/texas-case/facts/${facts.slug}`,
      })),
    };
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(webPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/texas-case/facts", type: "CollectionPage" })) },
        { type: "application/ld+json", children: JSON.stringify(itemList) },
      ],
    };
  },
  component: TexasCaseFactsHub,
});

function TexasCaseFactsHub() {
  return (
    <main className="bg-background">
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1100px] px-6 py-16 md:py-20">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">Keep TX Red Reference</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-none tracking-tight md:text-7xl">Facts & Framework</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">The legal, administrative, and source layer underneath The Texas Case.</p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">These pages are deliberately separate from KTR's editorial conclusions. They explain what institutions govern an issue, what records matter, what questions should be verified, and where readers can inspect the primary sources.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TEXAS_CASE_FACTS.map((facts) => {
            const position = getTexasCasePosition(facts.slug);
            return (
              <article key={facts.slug} className="rounded-xl border bg-card p-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Facts & Framework</p>
                <h2 className="mt-2 font-display text-2xl tracking-tight">{position?.shortTitle ?? facts.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{facts.dek}</p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
                  <a href={`/texas-case/facts/${facts.slug}`} className="text-primary hover:underline">Facts →</a>
                  <a href={`/texas-case/${facts.slug}`} className="text-muted-foreground hover:text-primary">Editorial →</a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-[1100px] px-6 py-12 md:flex md:items-center md:justify-between md:gap-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">Separate layers</p>
            <h2 className="mt-2 font-display text-4xl tracking-tight">Facts do not become opinion because KTR has a viewpoint.</h2>
            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">KTR can argue for a policy and still maintain a factual record that accurately describes laws, agencies, court rulings, spending, and competing considerations. The two layers link to each other but are labeled separately.</p>
          </div>
          <Link to="/texas-case" className="mt-6 inline-flex rounded-md border px-4 py-2.5 text-sm font-bold hover:border-primary md:mt-0">Back to The Texas Case</Link>
        </div>
      </section>
    </main>
  );
}

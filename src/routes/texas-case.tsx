import { createFileRoute, Link } from "@tanstack/react-router";
import { TEXAS_CASE_POSITIONS } from "@/data/texas-case";
import { buildSeo, SITE_URL, webPageJsonLd } from "@/lib/seo";

const TITLE = "The Texas Case | Keep TX Red Editorial Positions";
const DESCRIPTION = "Keep TX Red's permanent editorial case for life, gun rights, lower taxes, eliminating property taxes, parental rights, school choice, border security, and limited government.";

export const Route = createFileRoute("/texas-case")({
  head: () => {
    const seo = buildSeo({ title: TITLE, description: DESCRIPTION, path: "/texas-case" });
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "The Texas Case",
      numberOfItems: TEXAS_CASE_POSITIONS.length,
      itemListElement: TEXAS_CASE_POSITIONS.map((position, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: position.title,
        url: `${SITE_URL}/texas-case/${position.slug}`,
      })),
    };
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(webPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/texas-case", type: "CollectionPage" })) },
        { type: "application/ld+json", children: JSON.stringify(itemList) },
      ],
    };
  },
  component: TexasCaseHub,
});

function TexasCaseHub() {
  return (
    <main className="bg-background">
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1100px] px-6 py-16 md:py-20">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">Keep TX Red Editorial</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-none tracking-tight md:text-7xl">The Texas Case</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">Clear arguments about the policies and principles we believe make Texas freer, safer, stronger, and more accountable.</p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">These are permanent editorial positions, not breaking-news articles. Each case states KTR's view plainly, engages the strongest opposing argument, and links to laws, bills, official records, and KTR reference resources so readers can inspect the facts underneath the opinion.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TEXAS_CASE_POSITIONS.map((position) => (
            <a key={position.slug} href={`/texas-case/${position.slug}`} className="group rounded-xl border bg-card p-6 transition hover:border-primary hover:shadow-md">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">The Texas Case for</p>
              <h2 className="mt-2 font-display text-3xl tracking-tight group-hover:text-primary">{position.shortTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{position.dek}</p>
              <span className="mt-5 block text-sm font-bold text-primary">Read the case →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-[1100px] gap-8 px-6 py-14 md:grid-cols-2">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">How this section works</p>
            <h2 className="mt-2 font-display text-4xl tracking-tight">Opinion on top. Evidence underneath.</h2>
            <p className="mt-4 leading-7 text-muted-foreground">KTR does not pretend to be viewpoint-free. The Texas Case is where the editorial position is explicit. But the position does not get to rewrite the statute, invent a vote, alter a budget number, or ignore a court ruling. The factual layer remains independently verifiable.</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-display text-2xl tracking-tight">Our editorial rules</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>• State the KTR position clearly.</li>
              <li>• Make the strongest affirmative case for it.</li>
              <li>• Present the strongest serious counterargument fairly.</li>
              <li>• Separate normative claims from factual claims.</li>
              <li>• Link readers to primary laws, records, data, and KTR reference pages.</li>
              <li>• Update the page when the law or evidence materially changes.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-14">
        <div className="rounded-xl border bg-card p-7 md:flex md:items-center md:justify-between md:gap-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Follow the evidence</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">From argument to public record</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Use KTR's permanent government resources to check the bills, laws, lawmakers, and official actions behind current policy debates.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
            <Link to="/laws" className="rounded-md border px-4 py-2.5 text-sm font-bold hover:border-primary">Texas laws</Link>
            <Link to="/texas-legislature" className="rounded-md border px-4 py-2.5 text-sm font-bold hover:border-primary">Legislature</Link>
            <Link to="/representatives" className="rounded-md border px-4 py-2.5 text-sm font-bold hover:border-primary">Representatives</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

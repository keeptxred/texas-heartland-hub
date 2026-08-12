import { createFileRoute, Link } from '@tanstack/react-router';
import { SITE_URL } from '@/lib/seo';

const URL = `${SITE_URL}/citation-guide`;
const REFERENCE_GROUPS = [
  {
    title: 'Elections',
    description: 'Verified race, candidate, district, voting-date and election-methodology references.',
    links: [
      { label: '2026 Election Central', href: '/elections/2026' },
      { label: 'Texas voting reference', href: '/elections/voting' },
      { label: 'Election methodology', href: '/elections/methodology' },
    ],
  },
  {
    title: 'Legislature & laws',
    description: 'Bill, committee, legislative-session, law and effective-date references tied back to official records.',
    links: [
      { label: 'Texas Legislature', href: '/texas-legislature' },
      { label: 'Texas Bill Tracker', href: '/bills' },
      { label: 'Texas laws explained', href: '/laws' },
      { label: '2026 law effective dates', href: '/laws/effective-dates' },
    ],
  },
  {
    title: 'Government authority',
    description: 'Office powers, limits, agencies, elected officials and authority relationships.',
    links: [
      { label: 'Texas government authority hub', href: '/texas-government' },
      { label: 'Texas state agencies', href: '/texas-government/agencies' },
      { label: 'Texas elected officials', href: '/representatives' },
    ],
  },
] as const;

export const Route = createFileRoute('/citation-guide')({
  head: () => ({
    meta: [
      { title: 'How to Cite Keep TX Red References & Data' },
      { name: 'description', content: 'Citation guidance for Keep TX Red election, legislative, law and Texas government reference pages, including canonical URLs, official-source rules and machine-readable resources.' },
      { property: 'og:title', content: 'How to Cite Keep TX Red References & Data' },
      { property: 'og:description', content: 'Canonical citation guidance and machine-readable reference resources from Keep TX Red.' },
      { property: 'og:url', content: URL },
      { property: 'og:type', content: 'website' },
    ],
    links: [{ rel: 'canonical', href: URL }],
    scripts: [{
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'How to Cite Keep TX Red References & Data',
        url: URL,
        isPartOf: { '@type': 'WebSite', name: 'Keep TX Red', url: `${SITE_URL}/` },
        about: [
          { '@type': 'Thing', name: 'Texas elections' },
          { '@type': 'Thing', name: 'Texas Legislature' },
          { '@type': 'Thing', name: 'Texas law' },
          { '@type': 'Thing', name: 'Texas government' },
        ],
      }),
    }],
  }),
  component: CitationGuidePage,
});

function CitationGuidePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Citation & research guide</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">How to cite Keep TX Red reference pages</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Keep TX Red maintains election, legislative, law and government reference pages designed to be checked against official records. This guide explains which URL to cite, how to preserve source provenance, and when the original government source should be cited alongside our synthesis.</p>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-3" aria-labelledby="citation-rules-heading">
        <h2 id="citation-rules-heading" className="sr-only">Citation rules</h2>
        <Rule title="Use the canonical page" text="Link the clean canonical URL shown by the page. Do not cite preview, search-filter or tracking-parameter URLs as separate resources." />
        <Rule title="Keep the official source attached" text="For legal status, election eligibility, deadlines or agency authority, cite the underlying official record as the controlling source and Keep TX Red for the normalized explanation or comparison." />
        <Rule title="Preserve the date context" text="When a page shows Last verified, data-as-of or modified information, include that context when the underlying fact can change." />
      </section>

      <section className="mt-14 border-y py-10" aria-labelledby="format-heading">
        <h2 id="format-heading" className="font-display text-3xl">Suggested citation format</h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground">For a web citation, use: <strong className="text-foreground">Keep TX Red, “Page title,” canonical page URL, page verification or modification date when shown, accessed on your research date.</strong> If the statement is a legal requirement, official result, deadline or current office record, include the linked government source in the same note or bibliography.</p>
      </section>

      <section className="mt-14" aria-labelledby="references-heading">
        <h2 id="references-heading" className="font-display text-4xl">Maintained reference families</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {REFERENCE_GROUPS.map((group) => (
            <article key={group.title} className="rounded-xl border bg-card p-6">
              <h3 className="text-xl font-bold">{group.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.description}</p>
              <ul className="mt-5 space-y-2 text-sm font-semibold">
                {group.links.map((link) => <li key={link.href}><a href={link.href} className="text-primary hover:underline">{link.label} →</a></li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-muted/30 p-6 md:p-8" aria-labelledby="machine-heading">
        <h2 id="machine-heading" className="font-display text-3xl">Machine-readable reference index</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">The citation-magnet manifest is the machine-readable inventory of maintained factual-reference targets. The llms.txt file provides retrieval guidance and topic entry points. These files are discovery aids; the canonical page and its cited official sources remain the human-readable evidence layer.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/citation-magnets.json" className="rounded-md border px-4 py-2 text-sm font-semibold hover:border-primary">citation-magnets.json</a>
          <a href="/llms.txt" className="rounded-md border px-4 py-2 text-sm font-semibold hover:border-primary">llms.txt</a>
          <Link to="/editorial-standards" className="rounded-md border px-4 py-2 text-sm font-semibold hover:border-primary">Editorial standards</Link>
          <Link to="/authors" className="rounded-md border px-4 py-2 text-sm font-semibold hover:border-primary">Newsroom desks</Link>
        </div>
      </section>
    </main>
  );
}

function Rule({ title, text }: { title: string; text: string }) {
  return <article className="rounded-xl border bg-card p-6"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>;
}

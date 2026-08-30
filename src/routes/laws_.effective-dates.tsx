import { createFileRoute, Link } from '@tanstack/react-router';
import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';
import { publicBillPath } from '@/lib/bill-public-path';

const SITE_URL = 'https://keeptxred.com';
const CANONICAL = `${SITE_URL}/laws/effective-dates`;
const LRL_EFFECTIVE_DATES = 'https://www.lrl.texas.gov/sessions/effDates/billsEffective89.cfm';

const SEPTEMBER_2026 = [
  { bill: 'HB 2', note: 'Specified public-education and school-finance provisions take effect September 1, 2026; other provisions have different effective dates.' },
  { bill: 'HB 8 (89th Legislature, 2nd Called Session)', note: 'Digital electronic equipment diagnosis, maintenance and repair provisions listed for September 1, 2026.' },
  { bill: 'HB 3307', note: 'Continuing-education requirements for certain property-tax arbitration agreement renewals.' },
  { bill: 'HB 5424', note: 'Volunteer firefighter compensation limits.' },
  { bill: 'SB 568', note: 'Specified special-education provisions take effect September 1, 2026; other provisions use different dates.' },
  { bill: 'SB 785', note: 'Regulation of new HUD-code manufactured housing.' },
  { bill: 'SB 1036', note: 'Specified residential-solar retail transaction registration provisions take effect September 1, 2026.' },
  { bill: 'SB 2155', note: 'Section 37 concerning veterinary regulation takes effect September 1, 2026.' },
] as const;

const RECENT_2026 = [
  { date: 'August 1, 2026', bill: 'SB 262', note: 'Eligibility requirements to practice public accountancy.' },
  { date: 'July 1, 2026', bill: 'HB 2844', note: 'Food-service establishment regulation provisions listed for this date; other sections use different dates.' },
  { date: 'June 1, 2026', bill: 'HB 198', note: 'Periodic health screenings for firefighters.' },
  { date: 'June 1, 2026', bill: 'SB 2018', note: 'Strong families credit against certain taxes for qualifying contributions.' },
  { date: 'April 1, 2026', bill: 'SB 9', note: 'Specified pretrial release and bail provisions take effect on this date.' },
] as const;

export const Route = createFileRoute('/laws/effective-dates')({
  head: () => ({
    meta: [
      { title: 'Texas Laws Taking Effect in 2026 | Effective-Date Tracker' },
      { name: 'description', content: 'Track Texas laws and bill provisions taking effect in 2026, including the September 1, 2026 effective-date list from the Texas Legislative Reference Library.' },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:title', content: 'Texas Laws Taking Effect in 2026' },
      { property: 'og:url', content: CANONICAL },
      { property: 'og:type', content: 'website' },
    ],
    links: [{ rel: 'canonical', href: CANONICAL }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Texas Laws Taking Effect in 2026',
      url: CANONICAL,
      dateModified: '2026-08-11',
      isBasedOn: LRL_EFFECTIVE_DATES,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: SEPTEMBER_2026.length,
        itemListElement: SEPTEMBER_2026.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.bill, description: item.note })),
      },
    }).replace(/</g, '\\u003c') }],
  }),
  component: EffectiveDatesTracker,
});

function EffectiveDatesTracker() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/laws">Texas Laws</Link> / Effective Dates</nav>
      <header className="mt-6 border-b pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">89th Legislature effective-date tracker</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Texas Laws Taking Effect in 2026</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">Texas bills do not all take effect on the same day. This tracker organizes 2026 effective dates from the Texas Legislative Reference Library and preserves warnings when only part of a bill takes effect on a listed date.</p>
      </header>

      <section className="mt-8" aria-labelledby="september-2026-laws">
        <div className="rounded-2xl border bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Upcoming reference date</p>
          <h2 id="september-2026-laws" className="mt-2 text-3xl font-bold">September 1, 2026</h2>
          <p className="mt-3 leading-7 text-muted-foreground">The Legislative Reference Library’s 89th Legislature effective-date index currently lists the following bills or specified bill sections for September 1, 2026.</p>
          <div className="mt-6 divide-y rounded-xl border">
            {SEPTEMBER_2026.map((item) => <article key={item.bill} className="p-5"><h3 className="text-xl font-bold">{item.bill}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p><BillLink bill={item.bill} /></article>)}
          </div>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="recent-2026-laws">
        <h2 id="recent-2026-laws" className="text-3xl font-bold">Recent 2026 effective dates</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {RECENT_2026.map((item) => <article key={`${item.date}-${item.bill}`} className="rounded-xl border p-5"><p className="text-xs font-bold uppercase tracking-wide text-primary">{item.date}</p><h3 className="mt-2 text-xl font-bold">{item.bill}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p><BillLink bill={item.bill} /></article>)}
        </div>
      </section>

      <aside className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">A bill can contain multiple effective dates, conditional provisions or sections that do not take effect. Use the official effective-date index and the enrolled bill text before relying on a date for legal or compliance decisions.</aside>

      <CitationTrustPanel
        className="mt-8"
        sources={[{ name: 'Texas Legislative Reference Library — 89th Legislature effective dates', url: LRL_EFFECTIVE_DATES, note: 'Official legislative reference for the dates summarized here.' }]}
        methodology="KeepTXRed groups the Legislative Reference Library’s current effective-date entries by date and labels section-specific or mixed-date bills rather than flattening an entire bill to one date. Internal bill links are provided for additional status, sponsor, action and document context when a matching KeepTXRed bill record exists."
        lastVerified="August 11, 2026"
        title="Effective-date tracker sources and methodology"
      />
    </main>
  );
}

function BillLink({ bill }: { bill: string }) {
  const billMatch = /^(HB|SB)\s+(\d+)/.exec(bill);
  if (!billMatch) return null;
  const legislatureMatch = /(\d+)(?:st|nd|rd|th) Legislature/i.exec(bill);
  const calledSessionMatch = /(\d+)(?:st|nd|rd|th) Called Session/i.exec(bill);
  const legislature = legislatureMatch ? Number(legislatureMatch[1]) : 89;
  const sessionCode = calledSessionMatch ? calledSessionMatch[1] : 'R';
  const href = publicBillPath({
    legislature_number: legislature,
    session_code: sessionCode,
    bill_type: billMatch[1],
    bill_number: Number(billMatch[2]),
  });
  return <a href={href} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Open KeepTXRed bill record →</a>;
}

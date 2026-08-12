import { createFileRoute, Link } from '@tanstack/react-router';
import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';

const SITE_URL = 'https://keeptxred.com';
const CANONICAL = `${SITE_URL}/laws/constitutional-amendments`;
const CURRENT_ELECTION_URL = 'https://www.sos.state.tx.us/elections/laws/2026-november-general-election.shtml';
const HISTORY_URL = 'https://www.sos.state.tx.us/elections/historical/constitutional-amendment-elections.shtml';
const LAST_BALLOT_URL = 'https://www.sos.state.tx.us/about/newsreleases/2025/062525.shtml';

export const Route = createFileRoute('/laws/constitutional-amendments')({
  head: () => ({
    meta: [
      { title: 'Texas Constitutional Amendments Tracker | KeepTXRed' },
      { name: 'description', content: 'Track the current Texas statewide constitutional-amendment ballot status, recent amendment elections and official Texas Secretary of State sources.' },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:title', content: 'Texas Constitutional Amendments Tracker' },
      { property: 'og:description', content: 'Current statewide amendment-ballot status with official Texas election sources and historical context.' },
      { property: 'og:url', content: CANONICAL },
      { property: 'og:type', content: 'website' },
    ],
    links: [{ rel: 'canonical', href: CANONICAL }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Texas Constitutional Amendments Tracker',
      url: CANONICAL,
      dateModified: '2026-08-11',
      isBasedOn: [CURRENT_ELECTION_URL, HISTORY_URL, LAST_BALLOT_URL],
      about: { '@type': 'Thing', name: 'Texas constitutional amendment elections' },
    }).replace(/</g, '\\u003c') }],
  }),
  component: ConstitutionalAmendmentsTracker,
});

function ConstitutionalAmendmentsTracker() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/laws">Texas Laws</Link> / Constitutional Amendments</nav>
      <header className="mt-6 border-b pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Statewide ballot tracker</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Texas Constitutional Amendments Tracker</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">A maintained reference for whether statewide constitutional amendments are on the current Texas ballot, plus the official amendment-election archive.</p>
      </header>

      <section className="mt-8 rounded-2xl border bg-card p-6" aria-labelledby="current-amendment-status">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Current status · verified August 11, 2026</p>
        <h2 id="current-amendment-status" className="mt-2 text-3xl font-bold">No statewide constitutional-amendment slate is currently listed for the November 3, 2026 general election</h2>
        <p className="mt-4 leading-7 text-muted-foreground">The Texas Secretary of State’s current 2026 November General Election page lists the federal, state and county officer election resources. As of this verification date, it does not publish a statewide constitutional-amendment proposition slate. Local political subdivisions may still place local propositions on ballots, so this status should not be read as “no propositions anywhere in Texas.”</p>
        <a href={CURRENT_ELECTION_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-semibold text-primary hover:underline">Check the current official 2026 election page →</a>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border p-6"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Most recent statewide amendment ballot</p><h2 className="mt-2 text-2xl font-bold">November 4, 2025</h2><p className="mt-3 leading-7 text-muted-foreground">Texas lawmakers referred 17 proposed constitutional amendments to voters for the November 4, 2025 election.</p><a href={LAST_BALLOT_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-primary hover:underline">Official 2025 proposition announcement →</a></div>
        <div className="rounded-2xl border p-6"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Historical archive</p><h2 className="mt-2 text-2xl font-bold">Past amendment elections</h2><p className="mt-3 leading-7 text-muted-foreground">Use the Secretary of State archive to research prior statewide constitutional-amendment election dates, ballot language and related official materials.</p><a href={HISTORY_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-primary hover:underline">Open the official amendment archive →</a></div>
      </section>

      <section className="mt-8 rounded-2xl bg-muted/40 p-6"><h2 className="text-2xl font-bold">How proposed amendments reach Texas voters</h2><p className="mt-3 leading-7 text-muted-foreground">A proposed amendment is referred by a joint resolution approved by at least two-thirds of each chamber of the Texas Legislature. Voters then decide whether the proposed constitutional change is adopted. This tracker separates statewide constitutional amendments from ordinary local bond, tax, charter and other propositions.</p></section>

      <CitationTrustPanel
        className="mt-8"
        sources={[
          { name: 'Texas Secretary of State — 2026 November General Election', url: CURRENT_ELECTION_URL },
          { name: 'Texas Secretary of State — Constitutional Amendment Data', url: HISTORY_URL },
          { name: 'Texas Secretary of State — 2025 ballot-order announcement', url: LAST_BALLOT_URL },
        ]}
        methodology="KeepTXRed treats the Secretary of State’s current election page as the controlling public indicator for a currently published statewide amendment slate and separately uses the historical constitutional-amendment archive for prior elections. The tracker does not infer local propositions or future statewide measures that have not been officially published."
        lastVerified="August 11, 2026"
        title="Amendment tracker sources and methodology"
      />
    </main>
  );
}

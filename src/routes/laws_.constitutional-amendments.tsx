import { createFileRoute, Link } from '@tanstack/react-router';
import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';

const SITE_URL = 'https://keeptxred.com';
const CANONICAL = `${SITE_URL}/laws/constitutional-amendments`;
const CURRENT_ELECTION_URL = 'https://www.sos.state.tx.us/elections/laws/advisory2026-21-november-3-election-law-calendar.shtml';
const HISTORY_URL = 'https://www.sos.state.tx.us/elections/historical/constitutional-amendment-elections.shtml';
const EFFECTIVE_DATES_URL = 'https://www.sos.state.tx.us/elections/historical/canvasdt.shtml';
const ARTICLE_XVII_URL = 'https://statutes.capitol.texas.gov/SOTWDocs/CN/pdf/CN.17.pdf';
const TLC_2025_ANALYSIS_URL = 'https://tlc.texas.gov/docs/amendments/analyses25.pdf';
const LAST_BALLOT_URL = 'https://www.sos.state.tx.us/about/newsreleases/2025/062525.shtml';
const LAST_CANVASS_URL = 'https://www.sos.state.tx.us/texreg/archive/December52025/The%20Governor/The%20Governor.html';

export const Route = createFileRoute('/laws/constitutional-amendments')({
  head: () => ({
    meta: [
      { title: 'Texas Constitutional Amendments: 2026 Status & How the Process Works | KeepTXRed' },
      { name: 'description', content: 'Current 2026 Texas constitutional-amendment ballot status, the Article XVII amendment process, 2025 election context, effective-date rules and official state sources.' },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:title', content: 'Texas Constitutional Amendments: 2026 Status & Process' },
      { property: 'og:description', content: 'A maintained Texas constitutional-amendment reference covering the current ballot status, voter-approval process, 2025 results context and official sources.' },
      { property: 'og:url', content: CANONICAL },
      { property: 'og:type', content: 'website' },
    ],
    links: [{ rel: 'canonical', href: CANONICAL }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Texas Constitutional Amendments: 2026 Status and Process',
      url: CANONICAL,
      dateModified: '2026-09-07',
      isBasedOn: [CURRENT_ELECTION_URL, HISTORY_URL, EFFECTIVE_DATES_URL, ARTICLE_XVII_URL, TLC_2025_ANALYSIS_URL, LAST_BALLOT_URL, LAST_CANVASS_URL],
      about: { '@type': 'Thing', name: 'Texas constitutional amendments' },
    }).replace(/</g, '\\u003c') }],
  }),
  component: ConstitutionalAmendmentsTracker,
});

function ConstitutionalAmendmentsTracker() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/laws">Texas Laws</Link> / Constitutional Amendments</nav>
      <header className="mt-6 border-b pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas Constitution · statewide ballot reference</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Texas Constitutional Amendments: 2026 Status & How the Process Works</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">A maintained reference for the current statewide amendment-ballot status, how the Texas Legislature sends proposed constitutional changes to voters, when approved amendments take effect, and where to verify official ballot language and historical results.</p>
      </header>

      <section className="mt-8 rounded-2xl border bg-card p-6" aria-labelledby="current-amendment-status">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Current status · verified September 7, 2026</p>
        <h2 id="current-amendment-status" className="mt-2 text-3xl font-bold">No statewide constitutional-amendment slate is currently published for the November 3, 2026 general election</h2>
        <p className="mt-4 leading-7 text-muted-foreground">The Texas Secretary of State’s current November 3, 2026 election calendar covers the general election for federal, state and county officers and also explains how local political subdivisions may place their own measures on the ballot. As of this verification date, the state has not published a statewide constitutional-amendment proposition slate for that election.</p>
        <p className="mt-3 leading-7 text-muted-foreground">That distinction matters: a city, school district, county or other political subdivision may have a local proposition even when there is no statewide constitutional-amendment election. Use your county’s final sample ballot for the measures that apply to your address.</p>
        <div className="mt-5 flex flex-wrap gap-4">
          <a href={CURRENT_ELECTION_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Check the official 2026 election calendar →</a>
          <Link to="/elections/voting" className="font-semibold text-primary hover:underline">Texas voting rules and deadlines →</Link>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="amendment-process">
        <h2 id="amendment-process" className="text-3xl font-bold">How the Texas Constitution is amended</h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">Article XVII of the Texas Constitution sets a higher bar than the ordinary bill process. A constitutional amendment starts in the Legislature, but lawmakers cannot add it to the constitution by themselves. Texas voters make the final decision.</p>
        <ol className="mt-5 grid gap-4 md:grid-cols-2">
          <li className="rounded-2xl border p-5"><p className="font-bold">1. The Legislature proposes an amendment.</p><p className="mt-2 leading-7 text-muted-foreground">A proposed amendment is introduced as a joint resolution. Article XVII allows proposals during a regular session and during a special session when the subject is within the governor’s call.</p></li>
          <li className="rounded-2xl border p-5"><p className="font-bold">2. Two-thirds of each chamber must approve it.</p><p className="mt-2 leading-7 text-muted-foreground">The proposal must receive a two-thirds vote of all members elected to the Texas House and a two-thirds vote of all members elected to the Texas Senate, with the vote entered in the journals.</p></li>
          <li className="rounded-2xl border p-5"><p className="font-bold">3. The proposal is published and submitted to voters.</p><p className="mt-2 leading-7 text-muted-foreground">The Legislature specifies the election date. The Secretary of State prepares the required explanatory statement and ballot wording, and Article XVII establishes statewide publication and county-posting requirements before the election.</p></li>
          <li className="rounded-2xl border p-5"><p className="font-bold">4. A majority of votes cast on the proposition decides it.</p><p className="mt-2 leading-7 text-muted-foreground">If a majority voting on that proposition votes for it, the amendment is adopted. If a majority votes against it, the proposed constitutional change fails.</p></li>
        </ol>
        <a href={ARTICLE_XVII_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-semibold text-primary hover:underline">Read Article XVII of the Texas Constitution →</a>
      </section>

      <section className="mt-8 rounded-2xl bg-muted/40 p-6" aria-labelledby="effective-date-rules">
        <h2 id="effective-date-rules" className="text-2xl font-bold">When does an approved Texas constitutional amendment take effect?</h2>
        <p className="mt-3 leading-7 text-muted-foreground">The Texas Legislative Council explains that an amendment approved by voters generally becomes part of the constitution on the official canvass date showing adoption, unless the amendment itself provides a later effective date. That is different from simply using Election Night returns as the legal effective date.</p>
        <p className="mt-3 leading-7 text-muted-foreground">The Secretary of State maintains a historical table of amendment election dates and canvass dates. For current law implementation after an amendment is adopted, also check whether the Legislature enacted enabling legislation tied to the constitutional change.</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <a href={EFFECTIVE_DATES_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Official amendment effective-date history →</a>
          <Link to="/laws/effective-dates" className="font-semibold text-primary hover:underline">Texas laws taking effect in 2026 →</Link>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="recent-amendment-election">
        <h2 id="recent-amendment-election" className="text-3xl font-bold">The most recent statewide amendment election: November 4, 2025</h2>
        <p className="mt-3 leading-7 text-muted-foreground">The 89th Texas Legislature referred 17 proposed constitutional amendments to voters in 2025. The Secretary of State published the official ballot order and the Texas Legislative Council published a proposition-by-proposition analysis covering the ballot language, background and arguments discussed during the legislative process.</p>
        <p className="mt-3 leading-7 text-muted-foreground">After the election, the governor’s official canvass proclamation recorded that Texas voters adopted 16 of the 17 proposed amendments. Proposition 14 was the one measure not included among the 16 adopted amendments in that certified proclamation.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <a href={LAST_BALLOT_URL} target="_blank" rel="noopener noreferrer" className="rounded-2xl border p-5 hover:bg-muted/40"><span className="block font-bold">2025 ballot order</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">Official Secretary of State proposition list and joint-resolution references.</span></a>
          <a href={TLC_2025_ANALYSIS_URL} target="_blank" rel="noopener noreferrer" className="rounded-2xl border p-5 hover:bg-muted/40"><span className="block font-bold">2025 amendment analyses</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">Texas Legislative Council background and analysis for all 17 proposals.</span></a>
          <a href={LAST_CANVASS_URL} target="_blank" rel="noopener noreferrer" className="rounded-2xl border p-5 hover:bg-muted/40"><span className="block font-bold">2025 certified canvass</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">Governor’s proclamation recording the 16 adopted amendments.</span></a>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="amendment-vs-law">
        <h2 id="amendment-vs-law" className="text-3xl font-bold">Constitutional amendment vs. ordinary Texas law</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border p-6"><h3 className="text-xl font-bold">Constitutional amendment</h3><p className="mt-3 leading-7 text-muted-foreground">Changes the state constitution. It requires the Article XVII supermajority process in the Legislature and approval by Texas voters on the statewide proposition.</p></div>
          <div className="rounded-2xl border p-6"><h3 className="text-xl font-bold">Statute</h3><p className="mt-3 leading-7 text-muted-foreground">Changes statutory law through the legislative process. Statutes can implement or operate alongside constitutional provisions, but passage of an ordinary bill does not itself amend the Texas Constitution.</p></div>
        </div>
        <div className="mt-5 flex flex-wrap gap-4">
          <Link to="/texas-legislature" className="font-semibold text-primary hover:underline">How the Texas Legislature works →</Link>
          <Link to="/bills" className="font-semibold text-primary hover:underline">Track Texas bills →</Link>
          <Link to="/laws/topics" className="font-semibold text-primary hover:underline">Browse the Texas law library →</Link>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="amendment-faq">
        <h2 id="amendment-faq" className="text-3xl font-bold">Texas constitutional amendment FAQ</h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border p-5"><h3 className="text-lg font-bold">Are there statewide Texas constitutional amendments on the November 3, 2026 ballot?</h3><p className="mt-2 leading-7 text-muted-foreground">As of September 7, 2026, the Secretary of State’s current statewide election materials do not publish a statewide constitutional-amendment slate for the November 3 general election. Local propositions can still appear on local ballots.</p></div>
          <div className="rounded-2xl border p-5"><h3 className="text-lg font-bold">Can the Legislature amend the Texas Constitution without voters?</h3><p className="mt-2 leading-7 text-muted-foreground">No. The Legislature can propose an amendment after meeting the Article XVII voting threshold, but the proposal must then be submitted to Texas voters and receive a majority of votes cast on that proposition.</p></div>
          <div className="rounded-2xl border p-5"><h3 className="text-lg font-bold">Where can I find the exact ballot language?</h3><p className="mt-2 leading-7 text-muted-foreground">Use the Texas Secretary of State’s election materials for the official proposition wording and the historical constitutional-amendment archive for prior elections. The Texas Legislative Council also publishes analyses when statewide amendments are referred to voters.</p></div>
          <div className="rounded-2xl border p-5"><h3 className="text-lg font-bold">Where should I follow the next statewide amendment election?</h3><p className="mt-2 leading-7 text-muted-foreground">This page will track the statewide status. For the wider election calendar, candidates, voting rules and results, use <Link to="/elections/2026" className="font-semibold text-primary hover:underline">Texas Election Central</Link>.</p></div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border p-6" aria-labelledby="related-law-guides">
        <h2 id="related-law-guides" className="text-2xl font-bold">Related Texas law and election guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link to="/laws" className="font-semibold text-primary hover:underline">Texas laws explained →</Link>
          <Link to="/laws/topics" className="font-semibold text-primary hover:underline">Texas law library →</Link>
          <Link to="/laws/effective-dates" className="font-semibold text-primary hover:underline">Texas law effective dates →</Link>
          <Link to="/elections/2026" className="font-semibold text-primary hover:underline">2026 Texas Election Central →</Link>
          <Link to="/elections/voting" className="font-semibold text-primary hover:underline">Texas voting guide →</Link>
          <Link to="/texas-legislature" className="font-semibold text-primary hover:underline">Texas Legislature guide →</Link>
        </div>
      </section>

      <CitationTrustPanel
        className="mt-8"
        sources={[
          { name: 'Texas Secretary of State — November 3, 2026 Election Law Calendar', url: CURRENT_ELECTION_URL },
          { name: 'Texas Constitution — Article XVII', url: ARTICLE_XVII_URL },
          { name: 'Texas Secretary of State — Constitutional Amendment Data', url: HISTORY_URL },
          { name: 'Texas Secretary of State — Effective Dates of Constitutional Amendments', url: EFFECTIVE_DATES_URL },
          { name: 'Texas Legislative Council — 2025 Proposed Constitutional Amendment Analyses', url: TLC_2025_ANALYSIS_URL },
          { name: 'Texas Secretary of State — 2025 ballot order', url: LAST_BALLOT_URL },
          { name: 'Texas Register — November 19, 2025 canvass proclamation', url: LAST_CANVASS_URL },
        ]}
        methodology="KeepTXRed checks the Secretary of State’s current election calendar for a published statewide amendment election, uses Article XVII for the constitutional proposal and voter-approval requirements, uses the Secretary of State historical archive and effective-date table for prior elections, and uses the Texas Legislative Council and official canvass proclamation for 2025 context. Local propositions are kept separate from statewide constitutional amendments."
        lastVerified="September 7, 2026"
        title="Constitutional amendment sources and methodology"
      />
    </main>
  );
}
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
const ELECTION_CALENDAR_URL = 'https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml';
const PROP14_RESULT_URL = 'https://www.lrl.texas.gov/legis/billsearch/amendmentdetails.cfm?amendmentID=734&billNumberDetail=3&billSuffixDetail=&billtypeDetail=SJR&legSession=89-0';
const PROP14_APPEAL_URL = 'https://dev-search.txcourts.gov/Case.aspx?cn=15-26-00074-CV&coa=coa15';
const ELECTION_CONTEST_URL = 'https://statutes.capitol.texas.gov/?artSec=233.006&chapter=EL.233&code=EL&tab=1';
const LAST_CANVASS_URL = 'https://www.sos.state.tx.us/texreg/archive/December52025/The%20Governor/The%20Governor.html';
const EMPTY_BILLS_SEARCH = { q: '', status: '', legislature: 0, chamber: '', billType: '', page: 1 } as const;

export const Route = createFileRoute('/laws/constitutional-amendments')({
  head: () => ({
    meta: [
      { title: 'Texas Constitutional Amendments: Results, Proposals & Process | KeepTXRed' },
      { name: 'description', content: 'Understand Texas constitutional amendments, the 2025 vote and contested Proposition 14, Article XVII, effective dates and where to verify future proposals.' },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:title', content: 'Texas Constitutional Amendments: Results & Process' },
      { property: 'og:description', content: 'A maintained Texas constitutional-amendment reference covering the current ballot status, voter-approval process, 2025 results context and official sources.' },
      { property: 'og:url', content: CANONICAL },
      { property: 'og:type', content: 'website' },
    ],
    links: [{ rel: 'canonical', href: CANONICAL }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Texas Constitutional Amendments: Results and Process',
      url: CANONICAL,
      dateModified: '2026-11-24',
      isBasedOn: [CURRENT_ELECTION_URL, HISTORY_URL, EFFECTIVE_DATES_URL, ARTICLE_XVII_URL, TLC_2025_ANALYSIS_URL, LAST_BALLOT_URL, LAST_CANVASS_URL, ELECTION_CALENDAR_URL, PROP14_RESULT_URL, PROP14_APPEAL_URL, ELECTION_CONTEST_URL],
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
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Texas Constitutional Amendments Tracker</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">A maintained reference for the current statewide amendment-ballot status, how the Texas Legislature sends proposed constitutional changes to voters, when approved amendments take effect, and where to verify official ballot language and historical results.</p>
      </header>

      <section className="mt-8 rounded-2xl border bg-card p-6" aria-labelledby="current-amendment-status">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Election status · reviewed November 24, 2026</p>
        <h2 id="current-amendment-status" className="mt-2 text-3xl font-bold">The November 3, 2026 general election has passed</h2>
        <p className="mt-4 leading-7 text-muted-foreground">The November 3 general election was scheduled for federal, state and county officers, with local measures where applicable. The state’s 2026 general-election materials did not announce a statewide constitutional-amendment slate. The state’s statute website identifies November 2025 as the latest amendment election incorporated in its published constitutional text. Check the Secretary of State’s election calendar and legislative joint resolutions for the next statewide amendment election; do not assume a future proposition or ballot number before it is officially assigned.</p>
        <p className="mt-3 leading-7 text-muted-foreground">That distinction matters: a city, school district, county or other political subdivision may have a local proposition even when there is no statewide constitutional-amendment election. Use the official local sample ballot for the measures that apply to your address at each future election.</p>
        <div className="mt-5 flex flex-wrap gap-4">
          <a href={CURRENT_ELECTION_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">November 2026 election calendar (archive) →</a>
          <a href={ELECTION_CALENDAR_URL} className="font-semibold text-primary hover:underline">Official upcoming election dates →</a>
          <Link to="/county-elections" className="font-semibold text-primary hover:underline">County election offices →</Link>
          <Link to="/register-to-vote" className="font-semibold text-primary hover:underline">Texas voter registration →</Link>
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
        <p className="mt-3 leading-7 text-muted-foreground">The governor’s published canvass proclamation covers 16 of the 17 measures. That is not evidence that Proposition 14 lost at the ballot box: the Legislative Reference Library records 2,016,281 votes for Proposition 14 and 924,001 against. Its implementation was affected by a separate election contest.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <a href={LAST_BALLOT_URL} target="_blank" rel="noopener noreferrer" className="rounded-2xl border p-5 hover:bg-muted/40"><span className="block font-bold">2025 ballot order</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">Official Secretary of State proposition list and joint-resolution references.</span></a>
          <a href={TLC_2025_ANALYSIS_URL} target="_blank" rel="noopener noreferrer" className="rounded-2xl border p-5 hover:bg-muted/40"><span className="block font-bold">2025 amendment analyses</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">Texas Legislative Council background and analysis for all 17 proposals.</span></a>
          <a href={LAST_CANVASS_URL} target="_blank" rel="noopener noreferrer" className="rounded-2xl border p-5 hover:bg-muted/40"><span className="block font-bold">2025 certified canvass</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">Governor’s proclamation covering 16 measures; consult the separate Proposition 14 record below.</span></a>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border p-6" aria-labelledby="prop14-status">
        <h2 id="prop14-status" className="text-2xl font-bold">Proposition 14: voter approval is not the same as implementation</h2>
        <p className="mt-3 leading-7">The 2025 proposal would establish the Dementia Prevention and Research Institute of Texas and fund it with a $3 billion transfer. The official legislative library reports the measure as adopted by voters, but the published 2025 canvass proclamation omitted it. The separate contest illustrates why researchers should record the vote result, official proclamation, effective-date rules and subsequent litigation independently.</p>
        <p className="mt-3 leading-7">The Fifteenth Court of Appeals docket, case 15-26-00074-CV, shows a trial-court judgment on February 4, 2026 and submission on briefs on September 23, 2026. The docket reviewed November 24 did not show a final appellate judgment. Consult that docket and the latest official constitutional text before relying on the measure as operative law; this page does not predict the outcome of the litigation.</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-primary">
          <a href={PROP14_RESULT_URL} className="underline">Official vote record</a>
          <a href={PROP14_APPEAL_URL} className="underline">Official appellate docket</a>
          <a href={ELECTION_CONTEST_URL} className="underline">Election Code Chapter 233</a>
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
          <Link to="/bills" search={EMPTY_BILLS_SEARCH} className="font-semibold text-primary hover:underline">Track Texas bills →</Link>
          <Link to="/laws/topics" className="font-semibold text-primary hover:underline">Browse the Texas law library →</Link>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="amendment-faq">
        <h2 id="amendment-faq" className="text-3xl font-bold">Texas constitutional amendment FAQ</h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border p-5"><h3 className="text-lg font-bold">How do I find the next statewide Texas constitutional amendment election?</h3><p className="mt-2 leading-7 text-muted-foreground">Check the Secretary of State’s upcoming election dates and official proposition materials. The ordinary pattern is a statewide amendment election following an odd-year legislative session, but a joint resolution can provide a specific election date. A local proposition is not a proposed amendment to the state constitution.</p></div>
          <div className="rounded-2xl border p-5"><h3 className="text-lg font-bold">Can the Legislature amend the Texas Constitution without voters?</h3><p className="mt-2 leading-7 text-muted-foreground">No. The Legislature can propose an amendment after meeting the Article XVII voting threshold, but the proposal must then be submitted to Texas voters and receive a majority of votes cast on that proposition.</p></div>
          <div className="rounded-2xl border p-5"><h3 className="text-lg font-bold">Where can I find the exact ballot language?</h3><p className="mt-2 leading-7 text-muted-foreground">Use the Texas Secretary of State’s election materials for the official proposition wording and the historical constitutional-amendment archive for prior elections. The Texas Legislative Council also publishes analyses when statewide amendments are referred to voters.</p></div>
          <div className="rounded-2xl border p-5"><h3 className="text-lg font-bold">Where should I follow the next statewide amendment election?</h3><p className="mt-2 leading-7 text-muted-foreground">This page will track the statewide status. For historical context, see <Link to="/texas-politics/texas-election-history" className="font-semibold text-primary hover:underline">Texas election history</Link>. For current election details, verify with the Secretary of State.</p></div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border p-6" aria-labelledby="related-law-guides">
        <h2 id="related-law-guides" className="text-2xl font-bold">Related Texas law and election guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link to="/laws" className="font-semibold text-primary hover:underline">Texas laws explained →</Link>
          <Link to="/laws/topics" className="font-semibold text-primary hover:underline">Texas law library →</Link>
          <Link to="/laws/effective-dates" className="font-semibold text-primary hover:underline">Texas law effective dates →</Link>
          <Link to="/texas-politics/texas-election-history" className="font-semibold text-primary hover:underline">Texas election history →</Link>
          <Link to="/register-to-vote" className="font-semibold text-primary hover:underline">Texas voter registration →</Link>
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
          { name: 'Texas Secretary of State — Important Election Dates', url: ELECTION_CALENDAR_URL },
          { name: 'Legislative Reference Library — Proposition 14 vote record', url: PROP14_RESULT_URL },
          { name: 'Fifteenth Court of Appeals — 15-26-00074-CV', url: PROP14_APPEAL_URL },
          { name: 'Texas Election Code — Chapter 233, contests on measures', url: ELECTION_CONTEST_URL },
        ]}
        methodology="KeepTXRed checks the Secretary of State’s current election calendar for a published statewide amendment election, uses Article XVII for the constitutional proposal and voter-approval requirements, uses the Secretary of State historical archive and effective-date table for prior elections, and uses the Texas Legislative Council, official canvass proclamation, legislative library vote record and court docket to distinguish 2025 voter approval, certification and implementation. Local propositions are kept separate from statewide constitutional amendments."
        lastVerified="November 24, 2026"
        title="Constitutional amendment sources and methodology"
      />
    </main>
  );
}
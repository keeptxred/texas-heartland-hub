import candidatesSnapshot from '@/data/elections/2026/candidates.json';
import racesSnapshot from '@/data/elections/2026/races.json';
import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';
import { TEXAS_ELECTIONS, formatElectionDate } from '@/lib/election-calendar';

const publishedRaces = racesSnapshot.filter((race) => race.publicationStatus === 'published' && race.verificationStatus === 'verified');
const publishedCandidates = candidatesSnapshot.filter((candidate) => candidate.publicationStatus === 'published' && candidate.verificationStatus === 'verified');
const calendar2026 = TEXAS_ELECTIONS.filter((election) => election.date.startsWith('2026-'));
const latestCalendarVerification = calendar2026.map((election) => election.lastUpdated).sort().at(-1) ?? 'Verification pending';
const calendarSource = calendar2026.find((election) => election.source)?.source;
const generalElection = calendar2026.find((item) => item.type === 'general');

export function ElectionMasterReference() {
  return (
    <section className="border-y border-border bg-muted/30" aria-labelledby="election-master-reference">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">2026 master reference</p>
        <h2 id="election-master-reference" className="mt-2 font-display text-3xl leading-none tracking-tight text-foreground">Texas election cycle at a glance</h2>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">This index counts only Election Central race and candidate records that are both published and verified. Calendar dates come from the centralized Texas election calendar and link into the maintained race, candidate, voting and results systems.</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MasterFact label="Verified races" value={publishedRaces.length.toLocaleString('en-US')} />
          <MasterFact label="Verified candidates" value={publishedCandidates.length.toLocaleString('en-US')} />
          <MasterFact label="2026 statewide election dates" value={calendar2026.length.toLocaleString('en-US')} />
          <MasterFact label="General Election" value={generalElection ? formatElectionDate(generalElection) : 'Date pending verification'} />
        </dl>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ReferenceLink href="/elections/races" label="All verified races" />
          <ReferenceLink href="/elections/candidates" label="Candidate directory" />
          <ReferenceLink href="/elections/statewide" label="Statewide offices" />
          <ReferenceLink href="/elections/voting" label="Voting & ballot research" />
          <ReferenceLink href="/elections/results" label="Election results" />
        </div>

        <CitationTrustPanel
          className="mt-8"
          sources={calendarSource ? [{ name: 'Texas Secretary of State election calendar', url: calendarSource }] : [{ name: 'Texas election authority record' }]}
          methodology="Race and candidate totals are computed from the site's published, verified 2026 election snapshots. Calendar dates are read from the centralized Texas election calendar. Unpublished or unverified records are excluded rather than counted as complete coverage."
          lastVerified={`Election calendar last verified ${latestCalendarVerification}. Race and candidate pages retain their own verification records.`}
          title="Election master reference sources"
        />
      </div>
    </section>
  );
}

function MasterFact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-card p-5"><dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</dt><dd className="mt-2 text-2xl font-bold text-foreground">{value}</dd></div>;
}

function ReferenceLink({ href, label }: { href: string; label: string }) {
  return <a href={href} className="rounded-xl border border-border bg-card p-4 font-semibold text-primary shadow-sm hover:border-primary hover:underline">{label} →</a>;
}

export default ElectionMasterReference;

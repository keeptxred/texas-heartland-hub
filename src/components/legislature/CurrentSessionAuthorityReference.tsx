import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';

const TLO_URL = 'https://capitol.texas.gov/';

export function CurrentSessionAuthorityReference() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14" aria-labelledby="current-session-reference">
      <div className="rounded-2xl border bg-card p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Current-session reference</p>
        <h2 id="current-session-reference" className="mt-2 text-3xl font-bold">Track bills, committees and official actions from one place</h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">KeepTXRed’s current-session layer connects the bill database to the House, Senate, committee directory, law reference and representative pages. Texas Legislature Online remains the source of truth for official bill text, actions, votes and committee records.</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <Fact label="Texas House" value="150 members" />
          <Fact label="Texas Senate" value="31 members" />
          <Fact label="Regular session" value="Up to 140 days" />
        </dl>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ReferenceLink href="/bills" label="Search Texas bills" />
          <ReferenceLink href="/texas-legislature/committees" label="Browse committees" />
          <ReferenceLink href="/texas-legislature/votes" label="Committee vote records" />
          <ReferenceLink href="/representatives" label="Texas lawmakers" />
          <ReferenceLink href="/laws/effective-dates" label="2026 effective dates" />
          <ReferenceLink href="/laws/constitutional-amendments" label="Amendment tracker" />
        </div>
      </div>
      <CitationTrustPanel
        className="mt-8"
        sources={[{ name: 'Texas Legislature Online', url: TLO_URL }]}
        methodology="KeepTXRed normalizes legislative records into bill, sponsor, committee, action and document relationships for public research. Individual bill pages expose their own current status and source links; the official Texas Legislature Online record controls if a synchronized display lags an official action."
        lastVerified="Legislative records are synchronized from official sources; individual bill pages show the most recent available action or synchronization context."
        title="Legislative reference sources"
      />
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-muted p-4"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 text-2xl font-bold">{value}</dd></div>;
}

function ReferenceLink({ href, label }: { href: string; label: string }) {
  return <a href={href} className="rounded-xl border p-4 font-semibold text-primary hover:border-primary hover:underline">{label} →</a>;
}

export default CurrentSessionAuthorityReference;
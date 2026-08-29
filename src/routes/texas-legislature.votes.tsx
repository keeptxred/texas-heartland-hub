import { createFileRoute, Link } from '@tanstack/react-router';
import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';
import { supabase } from '@/integrations/supabase/client';
import { SITE_URL } from '@/lib/bills';
import { publicBillPath } from '@/lib/bill-public-path';

const db = supabase as any;
const CANONICAL = `${SITE_URL}/texas-legislature/votes`;
const TLO_URL = 'https://capitol.texas.gov/';

type VoteActivity = {
  id: string;
  bill_id: string;
  committee_name: string | null;
  action_description: string | null;
  action_type: string | null;
  vote_date: string;
  source_url: string | null;
  legislative_committees?: { committee_name?: string | null; committee_slug?: string | null } | null;
};

type BillSummary = {
  id: string;
  bill_identifier: string;
  legislature_number: number;
  session_code: string;
  bill_type: string;
  bill_number: number;
  caption: string;
  current_status_label: string;
};

export const Route = createFileRoute('/texas-legislature/votes')({
  loader: async () => {
    const { data: voteRows, error: voteError } = await db
      .from('bill_committee_history')
      .select('id,bill_id,committee_name,action_description,action_type,vote_date,source_url,legislative_committees(committee_name,committee_slug)')
      .not('vote_date', 'is', null)
      .order('vote_date', { ascending: false })
      .limit(250);
    if (voteError) throw voteError;
    const votes = (voteRows ?? []) as VoteActivity[];
    const billIds = [...new Set(votes.map((vote) => vote.bill_id))];
    let bills: BillSummary[] = [];
    if (billIds.length) {
      const { data: billRows, error: billError } = await db
        .from('bills')
        .select('id,bill_identifier,legislature_number,session_code,bill_type,bill_number,caption,current_status_label')
        .in('id', billIds);
      if (billError) throw billError;
      bills = (billRows ?? []) as BillSummary[];
    }
    return { votes, bills };
  },
  head: () => ({
    meta: [
      { title: 'Texas Legislative Committee Vote Records | KeepTXRed' },
      { name: 'description', content: 'Browse recorded Texas legislative committee vote dates connected to bills and official committee records. Vote dates do not imply a yea/nay margin unless the official source provides one.' },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:title', content: 'Texas Legislative Committee Vote Records' },
      { property: 'og:url', content: CANONICAL },
      { property: 'og:type', content: 'website' },
    ],
    links: [{ rel: 'canonical', href: CANONICAL }],
  }),
  component: LegislativeVoteReference,
});

function LegislativeVoteReference() {
  const { votes, bills } = Route.useLoaderData();
  const billById = new Map(bills.map((bill) => [bill.id, bill] as const));
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground"><Link to="/">Home</Link> / <Link to="/texas-legislature">Texas Legislature</Link> / Vote Records</nav>
      <header className="mt-6 rounded-2xl border bg-card p-7 md:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Verified committee activity</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Texas Legislative Committee Vote Records</h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-muted-foreground">This reference exposes committee vote dates already present in official committee-history records and connects them to the related bill and committee. A vote date confirms recorded committee vote activity; it does not establish a member-by-member position or vote margin unless the linked official record supplies one.</p>
      </header>
      <aside className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">KeepTXRed intentionally does not calculate yea/nay totals from a date-only record. Open the official committee source for the actual motion, tally or member positions when those details are published.</aside>
      <section className="mt-8" aria-labelledby="committee-vote-activity">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wide text-primary">Latest available records</p><h2 id="committee-vote-activity" className="mt-2 text-3xl font-bold">Committee vote activity</h2></div><p className="text-sm text-muted-foreground">Showing up to 250 recorded vote-date entries</p></div>
        <div className="mt-5 divide-y rounded-xl border bg-card">
          {votes.length ? votes.map((vote) => {
            const bill = billById.get(vote.bill_id);
            const committeeName = vote.committee_name || vote.legislative_committees?.committee_name || 'Legislative committee';
            const committeeSlug = vote.legislative_committees?.committee_slug;
            return <article key={vote.id} className="grid gap-4 p-5 md:grid-cols-[9rem_minmax(0,1fr)_15rem] md:items-start"><div><p className="text-xs font-bold uppercase tracking-wide text-primary">Vote date</p><time className="mt-1 block font-semibold">{formatDate(vote.vote_date)}</time></div><div>{bill ? <><a href={publicBillPath(bill)} className="text-lg font-bold hover:text-primary hover:underline">{bill.bill_identifier}: {bill.caption}</a><p className="mt-1 text-sm text-muted-foreground">Session {bill.session_code} · Current status: {bill.current_status_label}</p></> : <p className="font-semibold">Bill record unavailable for this committee-history row</p>}{(vote.action_description || vote.action_type) ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{vote.action_description || vote.action_type}</p> : null}</div><div><p className="font-semibold">{committeeSlug ? <a href={`/texas-legislature/committees/${committeeSlug}`} className="hover:text-primary hover:underline">{committeeName}</a> : committeeName}</p>{vote.source_url ? <a href={vote.source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">Official committee record →</a> : <span className="mt-2 block text-sm text-muted-foreground">Source URL pending in normalized record</span>}</div></article>;
          }) : <p className="p-6 text-muted-foreground">No committee vote dates are currently available in the normalized public record.</p>}
        </div>
      </section>
      <CitationTrustPanel className="mt-8" sources={[{ name: 'Texas Legislature Online', url: TLO_URL, note: 'Official legislative and committee record system.' }]} methodology="This page reads only bill committee-history rows that contain an official vote_date, joins them to canonical bill records, and preserves any stored official source URL. It does not infer vote totals or individual member positions from committee activity dates." lastVerified="Records reflect the current normalized Texas legislative database; individual source links and bill pages show their most recent synchronized official context." title="Committee vote reference sources and methodology" />
    </main>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

import { createFileRoute, Link, notFound, redirect } from '@tanstack/react-router';
import { CalendarDays, ExternalLink, Landmark, Scale, Users } from 'lucide-react';
import { billJsonLd, canonicalBillPath, getBill, getBillRelations, SITE_URL } from '@/lib/bills';
import { getRelatedAuthorityContent } from '@/lib/authority-relationships';
import { RelatedAuthorityContent } from '@/components/authority/RelatedAuthorityContent';
import { BillDocumentsPanel } from '@/components/bills/BillDocumentsPanel';

export const Route = createFileRoute('/bills/texas/$legislature/$billType/$billNumber')({
  loader: async ({ params }) => {
    const legislature = Number(params.legislature);
    const billNumber = Number(params.billNumber);
    const billType = params.billType.toLowerCase();
    if (!Number.isInteger(legislature) || !Number.isInteger(billNumber) || billNumber < 1) throw notFound();
    const normalizedPath = `/bills/texas/${legislature}/${billType}/${billNumber}`;
    if (params.billType !== billType || params.billNumber !== String(billNumber)) throw redirect({ href: normalizedPath, statusCode: 301 });
    const bill = await getBill(legislature, billType, billNumber);
    if (!bill) throw notFound();
    const [relations, relatedContent] = await Promise.all([
      getBillRelations(bill.id),
      getRelatedAuthorityContent('bill', bill.id).catch((error: any) => {
        console.error(`getRelatedAuthorityContent failed for bill ${bill.id}:`, error?.message ?? error);
        return [] as any;
      }),
    ]);
    return { bill, ...relations, relatedContent };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { bill, sponsors, actions } = loaderData;
    const canonical = `${SITE_URL}${canonicalBillPath(bill)}`;
    const title = `${bill.bill_identifier} Texas Legislature: Status, Sponsors and History | KeepTXRed`;
    const description = `Track Texas ${bill.bill_identifier}, including its current status, sponsors, committee history, legislative actions, bill text and related Texas news.`;
    return {
      meta: [
        { title }, { name: 'description', content: description },
        { property: 'og:title', content: title }, { property: 'og:description', content: description },
        { property: 'og:url', content: canonical }, { property: 'og:type', content: 'article' },
      ],
      links: [{ rel: 'canonical', href: canonical }],
      scripts: [{ type: 'application/ld+json', children: JSON.stringify(billJsonLd(bill, sponsors, actions)).replace(/</g, '\\u003c') }],
    };
  },
  component: BillPage,
});

const formatDate = (value?: string | null) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

function BillPage() {
  const { bill, sponsors, actions, committees, documents, subjects, articles, relatedContent } = Route.useLoaderData();
  const groupedSponsors = sponsors.reduce((groups: Record<string, any[]>, sponsor: any) => {
    (groups[sponsor.sponsor_role] ||= []).push(sponsor); return groups;
  }, {});
  const latestAction = actions[0];
  const summary = bill.plain_language_summary || bill.summary || bill.description || bill.caption;
  const fallbackDocumentLinks = [
    bill.bill_text_url ? { href: bill.bill_text_url, label: 'Current bill text' } : null,
    bill.analysis_url ? { href: bill.analysis_url, label: 'Bill analysis' } : null,
    bill.fiscal_note_url ? { href: bill.fiscal_note_url, label: 'Fiscal note' } : null,
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <a href="/bills">Bills</a> / {bill.legislature_number}th Legislature / {bill.bill_identifier}</nav>
      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">{bill.bill_identifier}</span><span className="rounded-full border px-3 py-1 text-sm font-semibold">{bill.current_status_label}</span>{bill.became_law && <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-900">Became law</span>}</div>
        <h1 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">{bill.caption}</h1>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"><span>{bill.legislature_number}th Texas Legislature · Session {bill.session_code}</span><span>{bill.chamber === 'house' ? 'Texas House' : bill.chamber === 'senate' ? 'Texas Senate' : 'Joint resolution'}</span>{bill.last_action_date && <span>Last action {formatDate(bill.last_action_date)}</span>}</div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <main className="space-y-8">
          <section className="rounded-xl border bg-card p-6"><h2 className="text-2xl font-bold">Bill overview</h2><p className="mt-4 text-lg leading-8">{summary}</p>{bill.description && bill.description !== summary && <p className="mt-4 text-muted-foreground">{bill.description}</p>}{subjects.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{subjects.map((subject: any) => <a key={subject.id} href={`/bills/subject/${subject.slug}`} className="rounded-full border px-3 py-1 text-sm hover:border-primary">{subject.name}</a>)}</div>}</section>

          <section className="rounded-xl border bg-card p-6" id="status"><div className="flex items-center gap-3"><Scale className="h-6 w-6 text-primary"/><h2 className="text-2xl font-bold">Current status</h2></div><p className="mt-4 text-xl font-semibold">{bill.current_status_label}</p><p className="mt-2 text-muted-foreground">{bill.current_status_description || latestAction?.action_text || 'The latest official status has not yet been synchronized.'}</p>{latestAction && <div className="mt-4 rounded-lg bg-muted/50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Latest official action</p><p className="mt-1 font-medium">{latestAction.action_text}</p><p className="mt-1 text-sm text-muted-foreground">{formatDate(latestAction.action_date)}{latestAction.chamber ? ` · ${latestAction.chamber}` : ''}</p></div>}</section>

          <section className="rounded-xl border bg-card p-6" id="sponsors"><div className="flex items-center gap-3"><Users className="h-6 w-6 text-primary"/><h2 className="text-2xl font-bold">Sponsors</h2></div>{sponsors.length ? <div className="mt-5 space-y-5">{Object.entries(groupedSponsors).map(([role, people]) => <div key={role}><h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{role}</h3><div className="mt-2 grid gap-3 sm:grid-cols-2">{(people as any[]).map((person) => person.sponsor_slug ? <a key={person.id} href={`/representatives/${person.sponsor_slug}`} className="rounded-lg border p-4 hover:border-primary"><strong>{person.sponsor_name}</strong><span className="mt-1 block text-sm text-muted-foreground">{[person.party, person.district].filter(Boolean).join(' · ')}</span></a> : <div key={person.id} className="rounded-lg border p-4"><strong>{person.sponsor_name}</strong><span className="mt-1 block text-sm text-muted-foreground">{[person.party, person.district].filter(Boolean).join(' · ') || 'Profile match pending'}</span></div>)}</div></div>)}</div> : <p className="mt-4 text-muted-foreground">Sponsor information has not yet been matched.</p>}</section>

          <section className="rounded-xl border bg-card p-6" id="committees"><div className="flex items-center gap-3"><Landmark className="h-6 w-6 text-primary"/><h2 className="text-2xl font-bold">Committee history</h2></div>{committees.length ? <ol className="mt-5 space-y-4">{committees.map((item: any) => <li key={item.id} className="border-l-2 border-primary pl-4"><p className="font-semibold">{item.committee_name}</p><p className="text-sm text-muted-foreground">{item.action_description || item.action_type || 'Committee action recorded'}</p><p className="mt-1 text-xs text-muted-foreground">{formatDate(item.referred_date || item.hearing_date || item.vote_date || item.reported_date)}</p></li>)}</ol> : <p className="mt-4 text-muted-foreground">No committee actions have been recorded.</p>}</section>

          <section className="rounded-xl border bg-card p-6" id="timeline"><div className="flex items-center gap-3"><CalendarDays className="h-6 w-6 text-primary"/><h2 className="text-2xl font-bold">Legislative timeline</h2></div>{actions.length ? <ol className="mt-6 space-y-0">{actions.map((action: any, index: number) => <li key={action.id} className="relative border-l-2 border-border pb-6 pl-6 last:pb-0"><span className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`}/><time className="text-sm font-semibold text-primary">{formatDate(action.action_date)}</time><p className="mt-1 font-medium">{action.action_text}</p><p className="mt-1 text-sm text-muted-foreground">{[action.chamber, action.normalized_status, action.legislative_committees?.committee_name].filter(Boolean).join(' · ')}</p>{action.source_url && <a href={action.source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">Official record <ExternalLink className="h-3.5 w-3.5"/></a>}</li>)}</ol> : <p className="mt-4 text-muted-foreground">The latest official action has not yet been synchronized.</p>}</section>

          <section className="rounded-xl border bg-card p-6" id="articles"><h2 className="text-2xl font-bold">Related articles</h2>{articles.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{articles.map((article: any) => <a key={article.id} href={`/article/${article.slug}`} className="rounded-lg border p-4 hover:border-primary"><h3 className="font-bold leading-snug">{article.title}</h3>{article.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{article.excerpt}</p>}<p className="mt-3 text-xs font-semibold uppercase text-primary">{article.relationship_type}</p></a>)}</div> : <p className="mt-4 text-muted-foreground">No related KeepTXRed articles have been linked.</p>}</section>
          <RelatedAuthorityContent items={relatedContent} />
        </main>

        <aside className="space-y-6">
          <BillDocumentsPanel documents={documents} fallbackLinks={fallbackDocumentLinks} />
          <section className="rounded-xl border bg-card p-5"><h2 className="font-bold">Key dates</h2><dl className="mt-4 space-y-3 text-sm">{[['Introduced', bill.introduced_date],['Passed House', bill.passed_house_date],['Passed Senate', bill.passed_senate_date],['Sent to governor', bill.sent_to_governor_date],['Signed', bill.signed_date],['Vetoed', bill.vetoed_date],['Effective', bill.effective_date]].filter(([,date]) => date).map(([label,date]) => <div key={label} className="flex justify-between gap-4"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-medium">{formatDate(date as string)}</dd></div>)}</dl></section>
          <section className="rounded-xl border bg-muted/30 p-5"><h2 className="font-bold">Source disclosure</h2><p className="mt-2 text-sm text-muted-foreground">Status and history are based on official Texas legislative information and may change as actions are recorded.</p>{bill.last_synced_at && <p className="mt-3 text-xs text-muted-foreground">Last synchronized {new Date(bill.last_synced_at).toLocaleString()}</p>}{bill.source_url && <a href={bill.source_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">View official bill page <ExternalLink className="h-4 w-4"/></a>}</section>
        </aside>
      </div>
    </div>
  );
}

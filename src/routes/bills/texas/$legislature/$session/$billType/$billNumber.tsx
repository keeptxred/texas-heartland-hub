import { createFileRoute, Link, notFound, redirect } from '@tanstack/react-router';
import { CalendarDays, ExternalLink, Landmark, Scale, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SITE_URL } from '@/lib/bills';
import { publicBillPath, normalizePublicBillSessionCode } from '@/lib/bill-public-path';
import { hasMeaningfulBillText, isScheduleBillActionCode, isSubstantiveBillActionCode } from '@/lib/bill-indexability';
import { getPublicBillRelations } from '@/lib/public-bill-relations';
import { getRelatedAuthorityContent } from '@/lib/authority-relationships';
import { getRelatedBills } from '@/lib/related-bills';
import { RelatedAuthorityContent } from '@/components/authority/RelatedAuthorityContent';
import { BillDocumentsPanel } from '@/components/bills/BillDocumentsPanel';
import { BillEditorialExplanation } from '@/components/bills/BillEditorialExplanation';
import { BillHearingsAndVotes } from '@/components/bills/BillHearingsAndVotes';
import { RelatedBillsSection } from '@/components/bills/RelatedBillsSection';
import { OfficialBillTextViewer } from '@/components/legislature/OfficialBillTextViewer';

const db = supabase as any;

const hasSubstantiveBillEvidence = (loaderData: any) => {
  const { bill, actions = [], committees = [], documents = [], subjects = [], articles = [] } = loaderData;
  const hasSubstantiveAction = actions.some((action: any) => isSubstantiveBillActionCode(action.action_code));
  return Boolean(
    bill.became_law
      || documents.length
      || committees.length
      || subjects.length
      || articles.length
      || hasSubstantiveAction
      || bill.analysis_url
      || bill.fiscal_note_url
      || hasMeaningfulBillText(bill.plain_language_summary)
      || hasMeaningfulBillText(bill.summary)
      || hasMeaningfulBillText(bill.description),
  );
};

function calledSessionJsonLd(bill: any, sponsors: any[], actions: any[]) {
  const url = `${SITE_URL}${publicBillPath(bill)}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: `${bill.bill_identifier} — ${bill.legislature_number}th Legislature Session ${bill.session_code}`,
        description: bill.plain_language_summary || bill.summary || bill.caption,
        dateModified: bill.last_synced_at || bill.last_action_date || undefined,
        mainEntity: { '@id': `${url}#legislation` },
      },
      {
        '@type': 'Legislation',
        '@id': `${url}#legislation`,
        name: bill.caption,
        alternateName: bill.bill_identifier,
        legislationIdentifier: bill.bill_identifier,
        legislationType: String(bill.bill_type).toUpperCase(),
        legislationJurisdiction: { '@type': 'AdministrativeArea', name: 'Texas' },
        description: bill.plain_language_summary || bill.summary || bill.caption,
        sponsor: sponsors.map((sponsor) => ({ '@type': 'Person', name: sponsor.sponsor_name })),
        ...(actions[0]?.action_date ? { dateModified: actions[0].action_date } : {}),
        url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Texas Bills', item: `${SITE_URL}/bills` },
          { '@type': 'ListItem', position: 3, name: `${bill.legislature_number}th Legislature Session ${bill.session_code}`, item: `${SITE_URL}/texas-legislature/sessions/${bill.legislature_number}${String(bill.session_code).toLowerCase()}` },
          { '@type': 'ListItem', position: 4, name: bill.bill_identifier, item: url },
        ],
      },
    ],
  };
}

export const Route = createFileRoute('/bills/texas/$legislature/$session/$billType/$billNumber')({
  loader: async ({ params }) => {
    const legislature = Number(params.legislature);
    const billNumber = Number(params.billNumber);
    const billType = params.billType.toLowerCase();
    const sessionCode = normalizePublicBillSessionCode(params.session);
    if (!Number.isInteger(legislature) || !Number.isInteger(billNumber) || billNumber < 1) throw notFound();
    if (!/^[A-Z0-9]+$/.test(sessionCode)) throw notFound();
    if (sessionCode === 'R') {
      throw redirect({ href: `/bills/texas/${legislature}/${billType}/${billNumber}`, statusCode: 301 });
    }
    const normalizedPath = `/bills/texas/${legislature}/${sessionCode.toLowerCase()}/${billType}/${billNumber}`;
    if (params.session !== sessionCode.toLowerCase() || params.billType !== billType || params.billNumber !== String(billNumber)) {
      throw redirect({ href: normalizedPath, statusCode: 301 });
    }
    const { data: bill, error } = await db
      .from('bills')
      .select('*')
      .eq('legislature_number', legislature)
      .eq('session_code', sessionCode)
      .eq('bill_type', billType)
      .eq('bill_number', billNumber)
      .eq('is_active', true)
      .maybeSingle();
    if (error) throw error;
    if (!bill) throw notFound();

    const [relations, relatedContent, relatedBills] = await Promise.all([
      getPublicBillRelations(bill.id),
      getRelatedAuthorityContent('bill', bill.id).catch(() => []),
      getRelatedBills(bill.id, bill.legislature_number).catch(() => []),
    ]);
    return { bill, ...relations, relatedContent, relatedBills };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { bill, sponsors, actions } = loaderData;
    const legalActions = actions.filter((action: any) => !isScheduleBillActionCode(action.action_code));
    const canonical = `${SITE_URL}${publicBillPath(bill)}`;
    const title = `${bill.bill_identifier} — Texas Legislature Session ${bill.session_code} | KeepTXRed`;
    const description = `Track Texas ${bill.bill_identifier} in the ${bill.legislature_number}th Legislature, Session ${bill.session_code}, including status, sponsors, committee history, legislative actions and official sources.`;
    const indexable = hasSubstantiveBillEvidence(loaderData);
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        ...(!indexable ? [{ name: 'robots', content: 'noindex,follow' }, { name: 'googlebot', content: 'noindex,follow' }] : []),
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonical },
        { property: 'og:type', content: 'article' },
      ],
      links: [{ rel: 'canonical', href: canonical }],
      scripts: [{ type: 'application/ld+json', children: JSON.stringify(calledSessionJsonLd(bill, sponsors, legalActions)).replace(/</g, '\\u003c') }],
    };
  },
  component: CalledSessionBillPage,
});

const formatDate = (value?: string | null) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

function CalledSessionBillPage() {
  const { bill, sponsors, actions, committees, documents, subjects, articles, relatedContent, relatedBills } = Route.useLoaderData();
  const legalActions = actions.filter((action: any) => !isScheduleBillActionCode(action.action_code));
  const latestAction = legalActions[0];
  const summary = bill.plain_language_summary || bill.summary || bill.description || bill.caption;
  const fallbackDocumentLinks = [
    bill.bill_text_url ? { href: bill.bill_text_url, label: 'Current bill text' } : null,
    bill.analysis_url ? { href: bill.analysis_url, label: 'Bill analysis' } : null,
    bill.fiscal_note_url ? { href: bill.fiscal_note_url, label: 'Fiscal note' } : null,
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <a href="/bills">Bills</a> / <a href={`/texas-legislature/sessions/${bill.legislature_number}${String(bill.session_code).toLowerCase()}`}>Session {bill.session_code}</a> / {bill.bill_identifier}</nav>
      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">{bill.bill_identifier}</span><span className="rounded-full border px-3 py-1 text-sm font-semibold">{bill.current_status_label}</span>{bill.became_law && <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-900">Became law</span>}</div>
        <h1 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">{bill.caption}</h1>
        <p className="mt-4 text-sm font-semibold text-primary">{bill.legislature_number}th Texas Legislature · Called Session {bill.session_code}</p>
        {bill.last_action_date ? <p className="mt-2 text-sm text-muted-foreground">Last legal action {formatDate(bill.last_action_date)}</p> : null}
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-8">
          <section className="rounded-xl border bg-card p-6"><h2 className="text-2xl font-bold">Bill overview</h2><p className="mt-4 text-lg leading-8">{summary}</p>{subjects.length ? <div className="mt-5 flex flex-wrap gap-2">{subjects.map((subject: any) => <a key={subject.id} href={`/bills/subject/${subject.slug}`} className="rounded-full border px-3 py-1 text-sm">{subject.name}</a>)}</div> : null}</section>
          <BillEditorialExplanation billId={bill.id} />
          <section className="rounded-xl border bg-card p-6"><div className="flex items-center gap-3"><Scale className="h-6 w-6 text-primary" /><h2 className="text-2xl font-bold">Current status</h2></div><p className="mt-4 text-xl font-semibold">{bill.current_status_label}</p>{latestAction ? <div className="mt-4 rounded-lg bg-muted/50 p-4"><p className="font-medium">{latestAction.action_text}</p><p className="mt-1 text-sm text-muted-foreground">{formatDate(latestAction.action_date)}</p></div> : null}</section>
          <section className="rounded-xl border bg-card p-6"><div className="flex items-center gap-3"><Users className="h-6 w-6 text-primary" /><h2 className="text-2xl font-bold">Sponsors</h2></div>{sponsors.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{sponsors.map((person: any) => person.sponsor_slug ? <a key={person.id} href={`/representatives/${person.sponsor_slug}`} className="rounded-lg border p-4 hover:border-primary"><strong>{person.sponsor_name}</strong><span className="mt-1 block text-sm text-muted-foreground">{[person.sponsor_role, person.party, person.district].filter(Boolean).join(' · ')}</span></a> : <div key={person.id} className="rounded-lg border p-4"><strong>{person.sponsor_name}</strong></div>)}</div> : <p className="mt-4 text-muted-foreground">No sponsor is currently matched to this record.</p>}</section>
          <section className="rounded-xl border bg-card p-6"><div className="flex items-center gap-3"><Landmark className="h-6 w-6 text-primary" /><h2 className="text-2xl font-bold">Committee history</h2></div>{committees.length ? <ol className="mt-5 space-y-4">{committees.map((item: any) => <li key={item.id} className="border-l-2 border-primary pl-4"><p className="font-semibold">{item.committee_name || item.legislative_committees?.committee_name}</p><p className="text-sm text-muted-foreground">{item.action_description || item.action_type || 'Committee activity recorded'}</p></li>)}</ol> : <p className="mt-4 text-muted-foreground">No committee history is currently recorded.</p>}</section>
          <BillHearingsAndVotes activities={committees} />
          <section className="rounded-xl border bg-card p-6"><div className="flex items-center gap-3"><CalendarDays className="h-6 w-6 text-primary" /><h2 className="text-2xl font-bold">Legislative timeline</h2></div>{legalActions.length ? <ol className="mt-5 space-y-5">{legalActions.map((action: any) => <li key={action.id} className="border-l-2 border-border pl-4"><time className="text-sm font-semibold text-primary">{formatDate(action.action_date)}</time><p className="mt-1 font-medium">{action.action_text}</p>{action.source_url ? <a href={action.source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary">Official record <ExternalLink className="h-3.5 w-3.5" /></a> : null}</li>)}</ol> : <p className="mt-4 text-muted-foreground">No dated legislative actions are available yet.</p>}</section>
          <OfficialBillTextViewer billIdentifier={bill.bill_identifier} sessionCode={bill.session_code} billType={bill.bill_type} billNumber={bill.bill_number} currentTextUrl={bill.bill_text_url} documents={documents} />
          <BillDocumentsPanel documents={documents} fallbackLinks={fallbackDocumentLinks} />
          <RelatedBillsSection bills={relatedBills} />
          <section className="rounded-xl border bg-card p-6"><h2 className="text-2xl font-bold">Related articles</h2>{articles.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2">{articles.map((article: any) => <a key={article.id} href={`/news/${article.slug}`} className="rounded-lg border p-4 hover:border-primary"><strong>{article.title}</strong></a>)}</div> : <p className="mt-4 text-muted-foreground">No related published articles are currently attached.</p>}</section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-5"><h2 className="font-bold">Official sources</h2><div className="mt-3 space-y-2 text-sm">{bill.source_url ? <a href={bill.source_url} target="_blank" rel="noopener noreferrer" className="block font-semibold text-primary">Texas Legislature Online history →</a> : null}{bill.bill_text_url ? <a href={bill.bill_text_url} target="_blank" rel="noopener noreferrer" className="block font-semibold text-primary">Official bill text →</a> : null}</div></section>
          <RelatedAuthorityContent items={relatedContent} />
        </aside>
      </div>
    </main>
  );
}

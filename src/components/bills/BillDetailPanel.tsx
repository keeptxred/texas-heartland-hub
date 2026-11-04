import { useEffect, useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { publicBillSessionLabel } from '@/lib/bill-public-path';
import { BillDocumentsPanel } from '@/components/bills/BillDocumentsPanel';
import { BillEditorialExplanation } from '@/components/bills/BillEditorialExplanation';
import { BillHearingsAndVotes } from '@/components/bills/BillHearingsAndVotes';
import { RelatedBillsSection } from '@/components/bills/RelatedBillsSection';
import type { BillEffectiveDateProvision } from '@/lib/bill-effective-date-provisions';
import type { RelatedBill } from '@/lib/related-bills';
import { OfficialBillTextViewer } from '@/components/legislature/OfficialBillTextViewer';

type BillDetailData = {
  bill: any;
  relations: { sponsors?: any[]; committees?: any[]; actions?: any[]; documents?: any[]; articles?: any[]; subjects?: any[] };
  editorial: any | null;
  effectiveDates?: BillEffectiveDateProvision[];
  relatedBills?: RelatedBill[];
};

const formatDate = (value?: string | null) => value
  ? new Date(value.slice(0, 10) + 'T12:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC' })
  : '';

function OfficialSource({ href, label }: { href?: string | null; label: string }) {
  return href ? <a href={href} rel="noopener noreferrer" target="_blank" className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline">{label}<ExternalLink className="h-4 w-4" /></a> : null;
}

export function BillDetailPanel({ billKey, onClose }: { billKey: string; onClose: () => void }) {
  const [data, setData] = useState<BillDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setData(null);
    setLoading(true);
    setError('');
    fetch(`/api/public/bill-detail?bill=${encodeURIComponent(billKey)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Unable to load the bill record.');
        return payload as BillDetailData;
      })
      .then((payload) => { if (active) setData(payload); })
      .catch((reason) => { if (active && !controller.signal.aborted) setError(reason instanceof Error ? reason.message : String(reason)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [billKey, retry]);

  useEffect(() => {
    panelRef.current?.focus();
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [billKey, onClose]);

  const bill = data?.bill;
  const relations = data?.relations;
  const sponsors = relations?.sponsors ?? [];
  const committees = relations?.committees ?? [];
  const documents = relations?.documents ?? [];
  const actions = (relations?.actions ?? []).filter((entry: any) => entry.action_text && !String(entry.action_code ?? '').startsWith('tlo-rss-'));
  const articles = relations?.articles ?? [];
  return (
    <section ref={panelRef} id="bill-detail" tabIndex={-1} role="region" aria-label="Selected bill details" aria-busy={loading}
      className="mt-8 scroll-mt-24 rounded-2xl border-2 border-primary/40 bg-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-primary md:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas bill record</p>
        <button type="button" onClick={onClose} aria-label="Close bill details" className="inline-flex min-h-11 items-center gap-2 rounded-md border px-4 py-2 font-semibold"><X className="h-4 w-4" /> Close</button>
      </div>
      {loading ? <p role="status" className="py-8 text-muted-foreground">Loading official bill details…</p> : null}
      {error ? <div role="alert" className="rounded-xl border border-destructive/40 p-5"><p>{error}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-4 rounded-md border px-4 py-2">Retry loading</button></div> : null}
      {bill ? <div className="space-y-7">
        <header>
          <h2 className="text-2xl font-bold md:text-3xl">{bill.bill_identifier} — {publicBillSessionLabel(bill.legislature_number, bill.session_code)}</h2>
          <p className="mt-3 text-lg font-semibold leading-7">{bill.caption}</p>
          <p className="mt-3 text-sm text-muted-foreground">{bill.current_status_label} · {bill.chamber === 'house' ? 'Texas House' : bill.chamber === 'senate' ? 'Texas Senate' : 'Joint measure'}</p>
          {bill.last_action_date ? <p className="mt-2 text-sm">Last official action: {formatDate(bill.last_action_date)}</p> : null}
          {bill.effective_date ? <p className="mt-2 text-sm">Effective date: {formatDate(bill.effective_date)}</p> : null}
          {bill.last_synced_at ? <p className="mt-2 text-xs text-muted-foreground">Record synchronized {new Date(bill.last_synced_at).toLocaleString()}</p> : null}
          <div className="mt-3"><OfficialSource href={bill.source_url} label="Texas Legislature Online" /></div>
        </header>
        {bill.current_status_description ? <section><h3 className="font-bold">Status explanation</h3><p className="mt-2">{bill.current_status_description}</p></section> : null}
        {bill.plain_language_summary || bill.summary || bill.description ? <section><h3 className="font-bold">Bill overview</h3><p className="mt-2 leading-7">{bill.plain_language_summary || bill.summary || bill.description}</p></section> : null}
        <BillEditorialExplanation billId={bill.id} initialItem={data?.editorial} initialBill={bill} initialDocuments={documents} initialEffectiveDates={data?.effectiveDates} />
        <section><h3 className="text-xl font-bold">Sponsors and authors</h3>
          {sponsors.length ? <ul className="mt-3 grid gap-3 sm:grid-cols-2">{sponsors.map((person: any) => <li key={person.id} className="rounded-md border p-3"><strong>{person.sponsor_name}</strong><p className="mt-1 text-xs text-muted-foreground">{[person.sponsor_role, person.party, person.district].filter(Boolean).join(' · ')}</p>{person.sponsor_slug ? <a href={`/representatives/${person.sponsor_slug}`} className="text-sm text-primary underline">Representative profile</a> : null}</li>)}</ul>
            : <p className="mt-2 text-sm text-muted-foreground">No sponsors recorded.</p>}
        </section>
        <section><h3 className="text-xl font-bold">Committee history</h3>
          {committees.length ? <ol className="mt-3 space-y-3">{committees.map((entry: any) => <li key={entry.id} className="border-l-2 pl-4"><strong>{entry.committee_name || entry.legislative_committees?.committee_name || 'Committee'}</strong><p className="text-sm">{entry.action_description || entry.action_type || 'Activity recorded'}</p>{entry.referred_date ? <p className="text-xs text-muted-foreground">Referred {formatDate(entry.referred_date)}</p> : null}</li>)}</ol>
            : <p className="mt-2 text-sm text-muted-foreground">No committee history recorded.</p>}
        </section>
        <BillHearingsAndVotes activities={committees} />
        <section><h3 className="text-xl font-bold">Legislative actions</h3>
          {actions.length ? <ol className="mt-3 max-h-[32rem] space-y-3 overflow-y-auto">{actions.map((entry: any) => <li key={entry.id} className="border-l-2 pl-4"><time className="text-sm font-semibold">{formatDate(entry.action_date)}</time><p>{entry.action_text}</p><OfficialSource href={entry.source_url} label="Official action" /></li>)}</ol>
            : <p className="mt-2 text-sm text-muted-foreground">No recorded actions.</p>}
        </section>
        <OfficialBillTextViewer key={bill.id} billIdentifier={bill.bill_identifier} sessionCode={bill.session_code} billType={bill.bill_type} billNumber={bill.bill_number} currentTextUrl={bill.bill_text_url} documents={documents} />
        {relations?.subjects?.length ? <section><h3 className="text-xl font-bold">Verified subjects</h3><div className="mt-3 flex flex-wrap gap-2">{relations.subjects.map((subject: any) => <span key={subject.id} className="rounded-full border px-3 py-1.5 text-sm">{subject.name}</span>)}</div></section> : null}
        <RelatedBillsSection bills={data?.relatedBills ?? []} />
        <BillDocumentsPanel documents={documents} fallbackLinks={[bill.bill_text_url && { href: bill.bill_text_url, label: 'Bill text' }, bill.analysis_url && { href: bill.analysis_url, label: 'Official analysis' }, bill.fiscal_note_url && { href: bill.fiscal_note_url, label: 'Fiscal note' }].filter(Boolean) as Array<{ href: string; label: string }>} />
        {articles.length ? <section><h3 className="text-xl font-bold">Verified related coverage</h3><ul className="mt-3 space-y-2">{articles.map((article: any) => <li key={article.id}><a href={`/news/${article.slug}`} className="text-primary underline">{article.title}</a></li>)}</ul></section> : null}
      </div> : null}
    </section>
  );
}

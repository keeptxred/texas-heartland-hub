import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { listBillEditorialEnrichments, saveBillEditorialEnrichment } from '@/services/billEditorialReview.functions';

export const Route = createFileRoute('/admin/bills/editorial')({
  head: () => ({ meta: [{ title: 'Bill Editorial Review — Keep TX Red' }, { name: 'robots', content: 'noindex, nofollow' }] }),
  component: BillEditorialReviewPage,
});

type Status = 'draft' | 'pending' | 'approved' | 'rejected';
const PASSCODE = (import.meta.env.VITE_ADMIN_PASSCODE as string) || '';

function BillEditorialReviewPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('ktr-admin-ok') === '1') setUnlocked(true);
  }, []);

  if (!unlocked) return (
    <div className="flex min-h-[70vh] items-center justify-center bg-muted/30 px-4">
      <form className="w-full max-w-sm space-y-4 border bg-card p-6" onSubmit={(event) => {
        event.preventDefault();
        if (PASSCODE && pass === PASSCODE) {
          sessionStorage.setItem('ktr-admin-ok', '1');
          sessionStorage.setItem('ktr-admin-passcode', pass);
          setUnlocked(true);
        } else setError('Incorrect passcode or missing admin configuration.');
      }}>
        <h1 className="text-2xl font-bold">Bill Editorial Review</h1>
        <Input type="password" value={pass} onChange={(event) => { setPass(event.target.value); setError(''); }} placeholder="Admin passcode" />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button className="w-full">Unlock</Button>
      </form>
    </div>
  );

  return <EditorialDashboard />;
}

function EditorialDashboard() {
  const [status, setStatus] = useState<Status>('pending');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('ktr-admin-passcode') || '' : '';

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listBillEditorialEnrichments({ data: { token, status, limit: 50 } });
    if (result.ok) setItems(result.items);
    else setMessage(result.error);
    setLoading(false);
  }, [status, token]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <a href="/admin" className="text-sm text-white/80 hover:underline">← Editorial Dashboard</a>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Bill Editorial Review</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85">Review sourced KeepTXRed explanations separately from official legislative facts.</p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {(['draft', 'pending', 'approved', 'rejected'] as Status[]).map((value) => (
            <button key={value} onClick={() => setStatus(value)} className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize ${status === value ? 'bg-primary text-primary-foreground' : ''}`}>{value}</button>
          ))}
          <Button variant="outline" onClick={load}>Refresh</Button>
        </div>
        {message && <p className="mt-4 border bg-muted/30 p-3 text-sm">{message}</p>}
        <p className="mt-5 text-sm text-muted-foreground">{loading ? 'Loading…' : `${items.length} record${items.length === 1 ? '' : 's'}`}</p>
        <div className="mt-6 space-y-6">
          {items.map((item) => <EditorialCard key={item.id} item={item} token={token} onSaved={load} />)}
        </div>
      </main>
    </div>
  );
}

function EditorialCard({ item, token, onSaved }: { item: any; token: string; onSaved: () => void }) {
  const [draft, setDraft] = useState({
    plainLanguageSummary: item.plain_language_summary || '',
    whatChanges: item.what_changes || '',
    whoIsAffected: item.who_is_affected || '',
    effectiveDateExplanation: item.effective_date_explanation || '',
    limitations: item.limitations || '',
    sourceUrls: (item.source_urls || []).join('\n'),
    sourceNotes: item.source_notes || '',
    confidence: item.confidence == null ? '' : String(item.confidence),
  });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState('');
  const bill = item.bills;

  async function save(reviewStatus: Status) {
    setSaving(true);
    setResult('');
    const response = await saveBillEditorialEnrichment({ data: {
      token,
      id: item.id,
      plainLanguageSummary: draft.plainLanguageSummary || null,
      whatChanges: draft.whatChanges || null,
      whoIsAffected: draft.whoIsAffected || null,
      effectiveDateExplanation: draft.effectiveDateExplanation || null,
      limitations: draft.limitations || null,
      sourceUrls: draft.sourceUrls.split('\n').map((value) => value.trim()).filter(Boolean),
      sourceDocumentIds: item.source_document_ids || [],
      sourceNotes: draft.sourceNotes || null,
      confidence: draft.confidence === '' ? null : Number(draft.confidence),
      reviewStatus,
    }});
    setSaving(false);
    if (response.ok) { setResult(`Saved as ${reviewStatus}.`); onSaved(); }
    else setResult(response.error);
  }

  const field = (label: string, key: keyof typeof draft, rows = 4) => (
    <label className="block"><span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span><textarea rows={rows} value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} className="w-full rounded-md border bg-background p-3 text-sm" /></label>
  );

  return (
    <article className="rounded-xl border bg-card p-5">
      <a href={bill ? `/bills/texas/${bill.legislature_number}/${bill.bill_type}/${bill.bill_number}` : '#'} target="_blank" rel="noreferrer" className="text-xl font-bold text-primary hover:underline">{bill?.bill_identifier || 'Unknown bill'}</a>
      <p className="mt-1 text-sm text-muted-foreground">{bill?.caption}</p>
      <div className="mt-5 grid gap-4">
        {field('Plain-language summary', 'plainLanguageSummary')}
        {field('What changes', 'whatChanges')}
        {field('Who is affected', 'whoIsAffected')}
        {field('Effective-date explanation', 'effectiveDateExplanation', 3)}
        {field('Limitations and uncertainty', 'limitations', 3)}
        {field('Source URLs — one per line', 'sourceUrls', 3)}
        {field('Source notes', 'sourceNotes', 3)}
        <label><span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Confidence (0–1)</span><Input value={draft.confidence} onChange={(event) => setDraft((current) => ({ ...current, confidence: event.target.value }))} inputMode="decimal" /></label>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button disabled={saving} variant="outline" onClick={() => save('draft')}>Save draft</Button>
        <Button disabled={saving} variant="outline" onClick={() => save('pending')}>Send to review</Button>
        <Button disabled={saving} onClick={() => save('approved')}>Approve</Button>
        <Button disabled={saving} variant="destructive" onClick={() => save('rejected')}>Reject</Button>
      </div>
      {result && <p className="mt-3 text-sm">{result}</p>}
    </article>
  );
}
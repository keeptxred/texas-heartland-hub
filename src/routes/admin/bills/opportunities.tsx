import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  listLegislativeOpportunities,
  refreshLegislativeOpportunities,
  updateLegislativeOpportunity,
} from '@/services/legislativeOpportunity.functions';

export const Route = createFileRoute('/admin/bills/opportunities')({
  head: () => ({ meta: [{ title: 'Legislative Opportunities — Keep TX Red' }, { name: 'robots', content: 'noindex,follow' }] }),
  component: LegislativeOpportunityPage,
});

const STORAGE_KEY = 'ktr-admin-ok';
const PASSCODE = (import.meta.env.VITE_ADMIN_PASSCODE as string | undefined)?.trim() ?? '';
type Status = 'new' | 'reviewed' | 'dismissed' | 'published';

function LegislativeOpportunityPage() {
  const [ok, setOk] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (PASSCODE && typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === '1') setOk(true);
  }, []);

  if (!ok) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-muted/30 px-4">
        <form className="w-full max-w-sm space-y-4 border-2 border-foreground/10 bg-white p-6" onSubmit={(event) => {
          event.preventDefault();
          if (PASSCODE && pass === PASSCODE) {
            sessionStorage.setItem(STORAGE_KEY, '1');
            sessionStorage.setItem('ktr-admin-passcode', pass);
            setOk(true);
          } else setError(PASSCODE ? 'Incorrect passcode.' : 'Admin passcode is not configured.');
        }}>
          <h1 className="text-2xl font-bold">Legislative Opportunities</h1>
          <Input type="password" value={pass} onChange={(event) => { setPass(event.target.value); setError(''); }} placeholder="Passcode" autoFocus disabled={!PASSCODE} />
          {error && <p className="text-xs text-destructive">{error}</p>}
          {!PASSCODE && <p className="text-xs text-destructive">Admin access is unavailable until the required passcode is configured.</p>}
          <Button type="submit" className="w-full" disabled={!PASSCODE}>Unlock</Button>
        </form>
      </div>
    );
  }

  return <OpportunityDashboard />;
}

function OpportunityDashboard() {
  const [status, setStatus] = useState<Status>('new');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('ktr-admin-passcode') || '' : '';

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listLegislativeOpportunities({ data: { token, status, limit: 100 } });
    if (result.ok) setItems(result.items);
    else setMessage(result.error);
    setLoading(false);
  }, [status, token]);

  useEffect(() => { load(); }, [load]);

  async function update(id: string, nextStatus: 'reviewed' | 'dismissed' | 'published') {
    const result = await updateLegislativeOpportunity({ data: { token, id, status: nextStatus } });
    if (!result.ok) return setMessage(result.error);
    setItems((current) => current.filter((item) => item.id !== id));
    setMessage(`Opportunity marked ${nextStatus}.`);
  }

  async function refresh() {
    setMessage('Refreshing from recent official actions…');
    const result = await refreshLegislativeOpportunities({ data: { token, sinceDays: 30 } });
    if (!result.ok) return setMessage(result.error);
    setMessage('Recent legislative actions refreshed.');
    await load();
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <a href="/admin" className="text-sm text-white/80 hover:underline">← Editorial Dashboard</a>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Legislative Opportunities</h1>
          <p className="mt-2 text-sm text-white/85">Official filings, hearings, votes, passage, signatures, and vetoes ready for editorial review.</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {(['new', 'reviewed', 'dismissed', 'published'] as Status[]).map((value) => (
            <button key={value} onClick={() => setStatus(value)} className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize ${status === value ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>{value}</button>
          ))}
          <Button variant="outline" onClick={refresh}>Refresh recent actions</Button>
        </div>

        {message && <p className="mt-4 border bg-muted/30 p-3 text-sm">{message}</p>}
        <p className="mt-5 text-sm text-muted-foreground">{loading ? 'Loading…' : `${items.length} opportunity${items.length === 1 ? '' : 'ies'} shown`}</p>

        <div className="mt-6 space-y-4">
          {items.map((item) => {
            const bill = item.bills;
            const path = bill ? `/bills/texas/${bill.legislature_number}/${String(bill.bill_type).toLowerCase()}/${bill.bill_number}` : '#';
            return (
              <article key={item.id} className="rounded-xl border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">{item.event_type.replaceAll('-', ' ')}</p>
                    <h2 className="mt-1 text-xl font-bold">{item.headline}</h2>
                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{item.summary}</p>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">Priority {item.priority}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <a href={path} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">Open bill</a>
                  {item.source_url && <a href={item.source_url} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">Official source</a>}
                  {item.event_date && <span className="text-muted-foreground">{new Date(`${item.event_date}T12:00:00`).toLocaleDateString()}</span>}
                </div>
                {status === 'new' && <div className="mt-5 flex flex-wrap gap-3"><Button onClick={() => update(item.id, 'reviewed')}>Mark reviewed</Button><Button variant="outline" onClick={() => update(item.id, 'published')}>Mark published</Button><Button variant="destructive" onClick={() => update(item.id, 'dismissed')}>Dismiss</Button></div>}
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { listBillRelationshipReviews, reviewBillRelationship } from '@/services/billRelationshipReview.functions';

export const Route = createFileRoute('/admin/bills/relationships')({
  head: () => ({
    meta: [
      { title: 'Bill Relationship Review — Keep TX Red' },
      { name: 'robots', content: 'noindex, follow, max-image-preview:large' },
    ],
  }),
  component: BillRelationshipReviewPage,
});

const STORAGE_KEY = 'ktr-admin-ok';
const PASSCODE = (import.meta.env.VITE_ADMIN_PASSCODE as string | undefined)?.trim() ?? '';

type ReviewStatus = 'pending' | 'approved' | 'rejected';
type ReviewType = 'all' | 'subject' | 'article';

function BillRelationshipReviewPage() {
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
          <div><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Restricted</p><h1 className="mt-1 text-2xl font-bold">Bill Relationship Review</h1></div>
          <Input type="password" value={pass} onChange={(event) => { setPass(event.target.value); setError(''); }} placeholder="Passcode" autoFocus disabled={!PASSCODE} />
          {error && <p className="text-xs text-destructive">{error}</p>}
          {!PASSCODE && <p className="text-xs text-destructive">Admin access is unavailable until the required passcode is configured.</p>}
          <Button type="submit" className="w-full" disabled={!PASSCODE}>Unlock</Button>
        </form>
      </div>
    );
  }

  return <ReviewDashboard />;
}

function ReviewDashboard() {
  const [status, setStatus] = useState<ReviewStatus>('pending');
  const [type, setType] = useState<ReviewType>('all');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('ktr-admin-passcode') || '' : '';

  const load = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await listBillRelationshipReviews({ data: { token, status, type, limit: 100 } });
      if (!result.ok) throw new Error(result.error);
      setItems(result.items);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load relationships.');
    } finally {
      setLoading(false);
    }
  }, [status, type, token]);

  useEffect(() => { load(); }, [load]);

  async function decide(item: any, nextStatus: 'approved' | 'rejected') {
    setMessage('');
    try {
      const result = await reviewBillRelationship({ data: { token, type: item.type, id: item.id, status: nextStatus } });
      if (!result.ok) throw new Error(result.error);
      setItems((current) => current.filter((row) => row.id !== item.id));
      setMessage(`${item.type === 'article' ? 'Article' : 'Subject'} relationship ${nextStatus}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Review action failed.');
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <a href="/admin" className="text-sm text-white/80 hover:underline">← Editorial Dashboard</a>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Bill Relationship Review</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85">Approve or reject automated bill-to-subject and bill-to-article matches before they appear publicly.</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {(['pending', 'approved', 'rejected'] as ReviewStatus[]).map((value) => <button key={value} onClick={() => setStatus(value)} className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize ${status === value ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>{value}</button>)}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(['all', 'subject', 'article'] as ReviewType[]).map((value) => <button key={value} onClick={() => setType(value)} className={`rounded-md border px-3 py-1.5 text-sm capitalize ${type === value ? 'border-primary text-primary' : ''}`}>{value}</button>)}
          <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
          <Button variant="outline" size="sm" asChild><a href="/admin/bills/backfill">Backfill status</a></Button>
        </div>

        {message && <p className="mt-4 border bg-muted/30 p-3 text-sm">{message}</p>}
        <p className="mt-5 text-sm text-muted-foreground">{loading ? 'Loading…' : `${items.length} relationship${items.length === 1 ? '' : 's'} shown`}</p>

        {!loading && items.length === 0 ? <div className="mt-6 rounded-xl border border-dashed p-10 text-center"><h2 className="font-semibold">No {status} relationships</h2><p className="mt-2 text-sm text-muted-foreground">There is nothing in this review queue for the selected type.</p></div> : null}

        <div className="mt-6 space-y-4">
          {items.map((item) => {
            const bill = item.bills;
            const subject = item.bill_subjects;
            const article = item.daily_articles;
            const billPath = bill ? `/bills/texas/${bill.legislature_number}/${String(bill.bill_type).toLowerCase()}/${bill.bill_number}` : '#';
            return (
              <article key={`${item.type}:${item.id}`} className="rounded-xl border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">{item.type} relationship</p>
                    <a href={billPath} className="mt-1 block text-xl font-bold hover:underline" target="_blank" rel="noreferrer">{bill?.bill_identifier || 'Unknown bill'}</a>
                    <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{bill?.caption}</p>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{Math.round(Number(item.confidence || 0) * 100)}% confidence</span>
                </div>

                <div className="mt-4 rounded-lg border bg-background p-4">
                  {item.type === 'subject' ? <><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Proposed subject</p><p className="mt-1 text-lg font-semibold">{subject?.name}</p></> : <><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Related article</p><a href={article?.slug ? `/news/${article.slug}` : '#'} target="_blank" rel="noreferrer" className="mt-1 block text-lg font-semibold hover:underline">{article?.title}</a>{article?.dek && <p className="mt-2 text-sm text-muted-foreground">{article.dek}</p>}</>}
                </div>

                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div><dt className="font-semibold">Matcher</dt><dd className="text-muted-foreground">{item.source}</dd></div>
                  <div><dt className="font-semibold">Evidence</dt><dd className="break-words text-muted-foreground">{JSON.stringify(item.evidence || {})}</dd></div>
                </dl>

                {status === 'pending' && <div className="mt-5 flex gap-3"><Button onClick={() => decide(item, 'approved')}>Approve</Button><Button variant="destructive" onClick={() => decide(item, 'rejected')}>Reject</Button></div>}
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}

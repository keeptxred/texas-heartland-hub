import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getLegislativeBackfillStatus,
  runLegislativeBackfillPass,
} from '@/services/legislativeBackfill.functions';

export const Route = createFileRoute('/admin/bills/backfill')({
  head: () => ({
    meta: [
      { title: 'Legislative Backfill — Keep TX Red' },
      { name: 'robots', content: 'noindex,follow' },
    ],
  }),
  component: LegislativeBackfillPage,
});

const STORAGE_KEY = 'ktr-admin-ok';
const PASSCODE = (import.meta.env.VITE_ADMIN_PASSCODE as string | undefined)?.trim() ?? '';

type BackfillStatus = {
  session: string;
  bills: number;
  subjects: number;
  subjectRelationships: number;
  articleRelationships: number;
  authorityEdges: number;
  sourceRecords: number;
  checkedSourceRecords: number;
  remainingSourceRecords: number;
  complete: boolean;
  measuredAt: string;
};

function LegislativeBackfillPage() {
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
          <h1 className="text-2xl font-bold">Legislative Backfill</h1>
          <Input type="password" value={pass} onChange={(event) => { setPass(event.target.value); setError(''); }} placeholder="Passcode" autoFocus disabled={!PASSCODE} />
          {error && <p className="text-xs text-destructive">{error}</p>}
          {!PASSCODE && <p className="text-xs text-destructive">Admin access is unavailable until the required passcode is configured.</p>}
          <Button type="submit" className="w-full" disabled={!PASSCODE}>Unlock</Button>
        </form>
      </div>
    );
  }

  return <BackfillDashboard />;
}

function BackfillDashboard() {
  const [status, setStatus] = useState<BackfillStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('ktr-admin-passcode') || '' : '';

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getLegislativeBackfillStatus({ data: { token, session: '89R' } });
    if (result.ok) setStatus(result.status);
    else setMessage(result.error);
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function runPass() {
    setRunning(true);
    setMessage('Running one bounded server-side backfill pass…');
    const result = await runLegislativeBackfillPass({
      data: { token, session: '89R', maxSeconds: 60, limit: 100 },
    });
    if (result.ok) {
      setStatus(result.after);
      const processed = result.before.remainingSourceRecords - result.after.remainingSourceRecords;
      setMessage(result.after.complete ? 'Backfill complete.' : `Pass complete. ${processed} source records processed; ${result.after.remainingSourceRecords} remain.`);
    } else {
      setMessage(result.error);
    }
    setRunning(false);
  }

  const cards = status ? [
    ['Bills', status.bills],
    ['Subjects', status.subjects],
    ['Subject relationships', status.subjectRelationships],
    ['Article relationships', status.articleRelationships],
    ['Authority edges', status.authorityEdges],
    ['Source records checked', `${status.checkedSourceRecords} / ${status.sourceRecords}`],
  ] : [];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <a href="/admin" className="text-sm text-white/80 hover:underline">← Editorial Dashboard</a>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Legislative Backfill</h1>
          <p className="mt-2 text-sm text-white/85">Run bounded official-subject and relationship passes through the production admin runtime.</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-3">
          <Button onClick={runPass} disabled={running || loading || Boolean(status?.complete)}>{running ? 'Running…' : status?.complete ? 'Backfill complete' : 'Run next pass'}</Button>
          <Button variant="outline" onClick={load} disabled={running || loading}>Refresh counts</Button>
          <a href="/admin/bills/relationships" className="inline-flex items-center rounded-md border px-4 text-sm font-semibold">Review relationships</a>
        </div>

        {message && <p className="mt-4 border bg-muted/30 p-3 text-sm">{message}</p>}
        {loading && <p className="mt-6 text-sm text-muted-foreground">Loading production counts…</p>}

        {status && <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(([label, value]) => <div key={String(label)} className="rounded-xl border bg-card p-5"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>)}
          </div>
          <div className={`mt-6 rounded-xl border p-5 ${status.complete ? 'bg-green-50' : 'bg-amber-50'}`}>
            <h2 className="text-xl font-bold">{status.complete ? 'Backfill complete' : `${status.remainingSourceRecords} source records remain`}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Counts measured {new Date(status.measuredAt).toLocaleString()}.</p>
          </div>
        </>}
      </main>
    </div>
  );
}

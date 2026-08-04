import { createFileRoute } from '@tanstack/react-router';
import { governanceHealth } from '@/platform/governance-event-store';

export const Route = createFileRoute('/admin/governance-health')({
  head: () => ({ meta: [{ title: 'Governance Health — Keep TX Red' }, { name: 'robots', content: 'noindex,follow' }] }),
  loader: async () => governanceHealth(),
  component: Page,
});

function Page() {
  const health = Route.useLoaderData();
  const summary = health.summary;
  return <div className="min-h-screen bg-white">
    <header className="border-b-4 border-primary bg-secondary text-white"><div className="mx-auto max-w-6xl px-4 py-8"><a href="/admin" className="text-sm hover:underline">← Editorial Dashboard</a><h1 className="mt-3 text-4xl font-bold">Cross-Site Governance Health</h1><p className="mt-2 max-w-3xl text-sm text-white/80">Privacy-safe publication decisions from KeepTXRed and TexasDefined. Supabase persistence is used when configured, with bounded process memory as fallback.</p></div></header>
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Health" value={health.healthy ? 'Healthy' : 'Needs review'} detail={`${health.ownershipDrift.length} unreviewed drift events`} />
        <Metric label="Recorded events" value={String(health.eventCount)} detail={`Memory fallback capped at ${health.maxMemoryEvents.toLocaleString()}`} />
        <Metric label="Blocked rate" value={`${(summary.blockedRate * 100).toFixed(1)}%`} detail={`${summary.blocked} blocked · ${summary.allowed} allowed`} />
        <Metric label="Override acceptance" value={`${(summary.overrideAcceptanceRate * 100).toFixed(1)}%`} detail={`${summary.overridesAccepted} accepted · ${summary.overridesRejected} rejected`} />
      </section>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="KeepTXRed events" value={String(summary.bySite.KeepTXRed)} detail="All retained governed decisions" />
        <Metric label="TexasDefined events" value={String(summary.bySite.TexasDefined)} detail="All retained governed decisions" />
        <Metric label="Ownership drift" value={String(summary.ownershipDrift)} detail="Allowed off-owner without override" />
        <Metric label="Persistence" value={health.persistent ? 'Durable' : 'Fallback'} detail={health.persistenceError ?? health.storage} />
      </section>
      <Breakdown title="Events by content domain" values={summary.byDomain} />
      <Breakdown title="Events by disposition" values={summary.byDisposition} />
      <section className="mt-10 rounded-xl border p-6"><h2 className="text-2xl font-bold">Privacy controls</h2><div className="mt-5 grid gap-3 sm:grid-cols-2"><Fact label="Article bodies stored" value={health.privacy.storesArticleBodies ? 'Yes' : 'No'} /><Fact label="Captions stored" value={health.privacy.storesCaptions ? 'Yes' : 'No'} /><Fact label="Reader identifiers stored" value={health.privacy.storesReaderIdentifiers ? 'Yes' : 'No'} /><Fact label="Credentials stored" value={health.privacy.storesCredentials ? 'Yes' : 'No'} /></div></section>
    </main>
  </div>;
}
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <article className="rounded-xl border p-5"><strong className="text-2xl font-bold">{value}</strong><span className="mt-2 block font-semibold">{label}</span><small className="mt-1 block text-muted-foreground">{detail}</small></article>; }
function Breakdown({ title, values }: { title: string; values: Record<string, number | undefined> }) { const entries = Object.entries(values).filter(([, count]) => count).sort((a, b) => Number(b[1]) - Number(a[1])); return <section className="mt-10"><h2 className="text-2xl font-bold">{title}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{entries.length ? entries.map(([key, count]) => <article key={key} className="rounded-xl border p-5"><strong className="capitalize">{key.replaceAll('-', ' ')}</strong><p className="mt-2 text-2xl font-bold">{count}</p></article>) : <p className="text-sm text-muted-foreground">No durable or in-memory events are available yet.</p>}</div></section>; }
function Fact({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-muted p-4"><span className="text-sm text-muted-foreground">{label}</span><strong className="mt-1 block">{value}</strong></div>; }

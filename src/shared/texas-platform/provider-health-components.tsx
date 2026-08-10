import type { EntityProviderStatus } from './providers';
import { sortEntityProviderStatuses, summarizeEntityProviderHealth } from './provider-health';

const STATUS_LABELS: Record<EntityProviderStatus['status'], string> = {
  ready: 'Ready',
  failed: 'Failed',
  'timed-out': 'Timed out',
};

export function SharedProviderHealthSummary({ providers }: { providers: ReadonlyArray<EntityProviderStatus> }) {
  const summary = summarizeEntityProviderHealth(providers);
  return (
    <section className="rounded-xl border bg-card p-6" aria-labelledby="shared-provider-health-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Shared data providers</p>
          <h2 id="shared-provider-health-title" className="mt-2 font-display text-3xl">Provider health</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${summary.healthy ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
          {summary.healthy ? 'Healthy' : 'Needs attention'}
        </span>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="Providers" value={summary.total} />
        <Metric label="Ready" value={summary.ready} />
        <Metric label="Failed" value={summary.failed} />
        <Metric label="Timed out" value={summary.timedOut} />
        <Metric label="Entities loaded" value={summary.loadedEntities} />
      </dl>

      {summary.slowestProvider ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Slowest provider: <strong className="text-foreground">{summary.slowestProvider.id}</strong> ({summary.slowestProvider.durationMs} ms)
        </p>
      ) : null}
    </section>
  );
}

export function SharedProviderHealthTable({ providers }: { providers: ReadonlyArray<EntityProviderStatus> }) {
  const sorted = sortEntityProviderStatuses(providers);
  if (!sorted.length) {
    return <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">No external providers are registered.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Provider</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Entities</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Cache</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((provider) => (
            <tr key={provider.id} className="border-b last:border-b-0">
              <td className="px-4 py-3 font-semibold">{provider.id}</td>
              <td className="px-4 py-3">{STATUS_LABELS[provider.status]}</td>
              <td className="px-4 py-3">{provider.entityCount}</td>
              <td className="px-4 py-3">{provider.durationMs} ms</td>
              <td className="px-4 py-3">{provider.cached ? 'Cached' : 'Live'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-2xl font-bold">{value}</dd>
    </div>
  );
}

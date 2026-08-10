import type { SharedSearchTelemetryEvent } from './search-telemetry';
import { summarizeSharedSearchTelemetry } from './search-telemetry';
import { sharedSearchInsights } from './search-insights';

export function SharedSearchTelemetrySummaryCards({ events }: { events: ReadonlyArray<SharedSearchTelemetryEvent> }) {
  const summary = summarizeSharedSearchTelemetry(events);
  const cards = [
    { label: 'Searches', value: summary.searches },
    { label: 'Zero-result searches', value: summary.zeroResultSearches },
    { label: 'Searches with clicks', value: summary.clickThroughSearches },
    { label: 'Click-through rate', value: `${summary.clickThroughRate}%` },
  ];

  return (
    <section aria-labelledby="shared-search-telemetry-summary">
      <h2 id="shared-search-telemetry-summary" className="font-display text-3xl">Resource search performance</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border bg-card p-5">
            <p className="text-sm font-semibold text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SharedSearchQueryTables({ events }: { events: ReadonlyArray<SharedSearchTelemetryEvent> }) {
  const summary = summarizeSharedSearchTelemetry(events);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SearchQueryTable title="Most common searches" rows={summary.topQueries} empty="No searches recorded yet." />
      <SearchQueryTable title="Searches needing content" rows={summary.topZeroResultQueries} empty="No zero-result searches recorded." />
    </div>
  );
}

function SearchQueryTable({ title, rows, empty }: { title: string; rows: Array<{ query: string; count: number }>; empty: string }) {
  return (
    <section className="rounded-xl border bg-card p-6">
      <h2 className="font-display text-2xl">{title}</h2>
      {rows.length ? (
        <ol className="mt-4 divide-y">
          {rows.map((row) => (
            <li key={row.query} className="flex items-center justify-between gap-4 py-3">
              <span className="font-semibold">{row.query}</span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold">{row.count}</span>
            </li>
          ))}
        </ol>
      ) : <p className="mt-4 text-sm text-muted-foreground">{empty}</p>}
    </section>
  );
}

export function SharedSearchInsights({ events }: { events: ReadonlyArray<SharedSearchTelemetryEvent> }) {
  const insights = sharedSearchInsights(events);
  if (!insights.length) return null;
  return (
    <section aria-labelledby="shared-search-insights-title">
      <h2 id="shared-search-insights-title" className="font-display text-3xl">Recommended search improvements</h2>
      <div className="mt-5 space-y-3">
        {insights.map((insight) => (
          <article key={insight.id} className="rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold">{insight.title}</h3>
              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">{insight.priority}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{insight.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

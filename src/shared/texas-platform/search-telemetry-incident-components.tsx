import type { SearchTelemetryIncident } from './search-telemetry-incidents';
import { summarizeSearchTelemetryIncidents } from './search-telemetry-incident-metrics';
import { evaluateSearchTelemetryIncidentSla, type SearchTelemetryIncidentSla } from './search-telemetry-incident-sla';

export function SearchTelemetryIncidentSummary({
  incidents,
}: {
  incidents: ReadonlyArray<SearchTelemetryIncident>;
}) {
  const summary = summarizeSearchTelemetryIncidents(incidents);
  const cards = [
    ['Open', summary.open],
    ['Acknowledged', summary.acknowledged],
    ['Resolved', summary.resolved],
    ['Critical active', summary.criticalActive],
  ] as const;

  return (
    <section aria-labelledby="search-incident-summary-title">
      <h2 id="search-incident-summary-title" className="font-display text-2xl">Search incidents</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SearchTelemetryIncidentTable({
  incidents,
  sla,
  now,
}: {
  incidents: ReadonlyArray<SearchTelemetryIncident>;
  sla?: SearchTelemetryIncidentSla;
  now?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Incident</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Occurrences</th>
            <th className="px-4 py-3">Response target</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => {
            const status = evaluateSearchTelemetryIncidentSla(incident, sla, now);
            return (
              <tr key={incident.id} className="border-t align-top">
                <td className="px-4 py-3">
                  <p className="font-semibold">{incident.anomalyCode}</p>
                  <p className="mt-1 max-w-xl text-muted-foreground">{incident.latestMessage}</p>
                </td>
                <td className="px-4 py-3 capitalize">{incident.severity}</td>
                <td className="px-4 py-3 capitalize">{incident.status}</td>
                <td className="px-4 py-3">{incident.occurrences}</td>
                <td className="px-4 py-3">
                  {incident.status === 'resolved' ? 'Resolved' : status.breached ? 'Breached' : `${status.remainingMinutes} min remaining`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import { ELECTION_CENTRAL_CONFIG, getActiveElectionCycleConfig } from "@/lib/elections";
import { ElectionAdminMenu } from "./ElectionAdminMenu";

export interface ElectionAdminMetric {
  label: string;
  value: number | string;
  description: string;
  status?: "ready" | "attention" | "planned";
}

export interface ElectionAdminDashboardProps {
  metrics?: readonly ElectionAdminMetric[];
  lastUpdated?: string | Date;
  className?: string;
}

const DEFAULT_METRICS: readonly ElectionAdminMetric[] = [
  {
    label: "Races",
    value: 0,
    description: "Published and draft races will appear here after the election data source is connected.",
    status: "planned",
  },
  {
    label: "Candidates",
    value: 0,
    description: "Candidate profiles will be counted after the management workflow is enabled.",
    status: "planned",
  },
  {
    label: "Current polls",
    value: 0,
    description: "Only sourced, non-expired polls should be included in this total.",
    status: "planned",
  },
  {
    label: "Forecast updates",
    value: 0,
    description: "Forecast model runs and freshness checks will be shown here when available.",
    status: "planned",
  },
] as const;

function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat(ELECTION_CENTRAL_CONFIG.locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: ELECTION_CENTRAL_CONFIG.timeZone,
  }).format(date);
}

function statusClasses(status: ElectionAdminMetric["status"]): string {
  if (status === "ready") return "bg-emerald-100 text-emerald-800";
  if (status === "attention") return "bg-amber-100 text-amber-900";
  return "bg-slate-200 text-slate-700";
}

export function ElectionAdminDashboard({
  metrics = DEFAULT_METRICS,
  lastUpdated,
  className = "",
}: ElectionAdminDashboardProps) {
  const cycle = getActiveElectionCycleConfig();

  return (
    <div className={`space-y-8 ${className}`.trim()}>
      <ElectionAdminMenu currentPath="/admin/elections" />

      <section aria-labelledby="election-admin-summary" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Active cycle</p>
            <h2 id="election-admin-summary" className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              {cycle.label}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              This workspace is the control center for election records, source attribution, freshness checks,
              publishing readiness, and election-night operations.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="font-semibold text-slate-950">Election Day</div>
            <div>{formatDate(cycle.electionDay)}</div>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-sm font-semibold text-slate-700">{metric.label}</dt>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClasses(metric.status)}`}>
                  {metric.status === "ready" ? "Ready" : metric.status === "attention" ? "Review" : "Planned"}
                </span>
              </div>
              <dd className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{metric.value}</dd>
              <p className="mt-2 text-sm leading-5 text-slate-600">{metric.description}</p>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Launch readiness</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">Required before public data publishing</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li>✓ Election routes, cards, SEO helpers, sitemap support, and shared configuration are available.</li>
            <li>○ Connect authoritative race, candidate, polling, forecast, and results data sources.</li>
            <li>○ Add source review, validation, publication, correction, and audit workflows.</li>
            <li>○ Verify empty, loading, stale-data, and failure behavior before enabling live updates.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Editorial safeguards</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">Election data requirements</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li>Every public record must include source attribution and a visible last-updated label.</li>
            <li>Polling must remain clearly separated from forecasts and projections.</li>
            <li>Unofficial results must never be presented as certified outcomes.</li>
            <li>Election pages should include contextual links to voter guides and relevant KeepTXRed coverage.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <div className="font-semibold text-slate-950">Dashboard data status</div>
        <p className="mt-1 leading-6">
          This shell intentionally uses safe zero-value placeholders. It does not imply that election records have
          been imported or verified. {lastUpdated ? `Dashboard snapshot: ${formatDate(lastUpdated)}.` : "No live data connection is active yet."}
        </p>
      </section>
    </div>
  );
}

export default ElectionAdminDashboard;

import { AlertTriangle, CheckCircle2, ExternalLink, Gauge, TrendingUp } from 'lucide-react';
import type { TexasLifeFreshnessIssue } from './texas-life-operations';

export type TexasLifeFreshnessDashboardModel = {
  totalResources: number;
  healthyResources: number;
  criticalIssues: number;
  warningIssues: number;
  issues: TexasLifeFreshnessIssue[];
  recentlyUpdated: ReadonlyArray<{
    resourceId: string;
    title: string;
    href: string;
    updatedAt?: string;
  }>;
};

export type TexasLifeJourneySummary = {
  journeyId: string;
  starts: number;
  completions: number;
  completionRate: number;
  calculatorUses: number;
  officialResourceClicks: number;
  nextActionClicks: number;
  dropOffStep?: string;
};

function MetricCard({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
      {detail ? <p className="mt-1 text-sm text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

export function TexasLifeFreshnessSummary({ dashboard }: { dashboard: TexasLifeFreshnessDashboardModel }) {
  const healthRate = dashboard.totalResources
    ? Math.round((dashboard.healthyResources / dashboard.totalResources) * 100)
    : 100;

  return (
    <section aria-labelledby="texas-life-freshness-summary">
      <div className="flex items-center gap-2">
        <Gauge className="size-5 text-primary" />
        <h2 id="texas-life-freshness-summary" className="font-display text-3xl">Content health</h2>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Healthy" value={`${healthRate}%`} detail={`${dashboard.healthyResources} of ${dashboard.totalResources} resources`} />
        <MetricCard label="Critical" value={dashboard.criticalIssues} detail="Broken official links or urgent failures" />
        <MetricCard label="Warnings" value={dashboard.warningIssues} detail="Reviews, standards, or next steps needed" />
        <MetricCard label="Recently updated" value={dashboard.recentlyUpdated.length} detail="Latest reviewed resources" />
      </div>
    </section>
  );
}

export function TexasLifeFreshnessIssues({ issues }: { issues: ReadonlyArray<TexasLifeFreshnessIssue> }) {
  return (
    <section aria-labelledby="texas-life-freshness-issues" className="rounded-2xl border bg-card">
      <div className="border-b p-5">
        <h2 id="texas-life-freshness-issues" className="font-display text-2xl">Resources needing attention</h2>
      </div>
      {issues.length ? (
        <div className="divide-y">
          {issues.map((issue) => (
            <a key={issue.resourceId} href={issue.href} className="flex items-start justify-between gap-4 p-5 transition hover:bg-muted/40">
              <div>
                <div className="flex items-center gap-2">
                  {issue.severity === 'critical'
                    ? <AlertTriangle className="size-4 text-destructive" />
                    : <AlertTriangle className="size-4 text-amber-600" />}
                  <h3 className="font-semibold">{issue.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{issue.reasons.join(' · ')}</p>
              </div>
              <ExternalLink className="mt-1 size-4 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 p-5 text-sm text-muted-foreground">
          <CheckCircle2 className="size-4 text-primary" />All tracked resources currently pass the health checks.
        </div>
      )}
    </section>
  );
}

export function TexasLifeJourneyAnalyticsTable({ journeys }: { journeys: ReadonlyArray<TexasLifeJourneySummary> }) {
  return (
    <section aria-labelledby="texas-life-journey-analytics" className="rounded-2xl border bg-card">
      <div className="flex items-center gap-2 border-b p-5">
        <TrendingUp className="size-5 text-primary" />
        <h2 id="texas-life-journey-analytics" className="font-display text-2xl">Journey outcomes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Journey</th>
              <th className="px-5 py-3">Starts</th>
              <th className="px-5 py-3">Completed</th>
              <th className="px-5 py-3">Completion</th>
              <th className="px-5 py-3">Calculators</th>
              <th className="px-5 py-3">Official visits</th>
              <th className="px-5 py-3">Next actions</th>
              <th className="px-5 py-3">Drop-off</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {journeys.map((journey) => (
              <tr key={journey.journeyId}>
                <td className="px-5 py-4 font-semibold">{journey.journeyId}</td>
                <td className="px-5 py-4">{journey.starts}</td>
                <td className="px-5 py-4">{journey.completions}</td>
                <td className="px-5 py-4">{Math.round(journey.completionRate * 100)}%</td>
                <td className="px-5 py-4">{journey.calculatorUses}</td>
                <td className="px-5 py-4">{journey.officialResourceClicks}</td>
                <td className="px-5 py-4">{journey.nextActionClicks}</td>
                <td className="px-5 py-4 text-muted-foreground">{journey.dropOffStep ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

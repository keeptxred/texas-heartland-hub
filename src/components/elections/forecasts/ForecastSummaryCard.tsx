import { ELECTION_ROUTES } from "@/lib/elections";
import type { ElectionForecastSummary } from "@/types/elections";
import {
  FORECAST_CONFIDENCE_LEVEL_LABELS,
  FORECAST_RATING_LABELS,
} from "@/types/elections/forecastClassifications";

export interface ForecastSummaryCardProps {
  forecast: ElectionForecastSummary;
}

export function ForecastSummaryCard({ forecast }: ForecastSummaryCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {forecast.sourceName}
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">
            <a
              href={ELECTION_ROUTES.forecastDetail(forecast.slug)}
              className="hover:text-primary hover:underline"
            >
              {forecast.race.name}
            </a>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{forecast.race.officeName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {FORECAST_RATING_LABELS[forecast.rating]}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            {FORECAST_CONFIDENCE_LEVEL_LABELS[forecast.confidenceLevel]} confidence
          </span>
          {forecast.model === "fundamentals" ? (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
              Fundamentals-based forecast
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {forecast.candidates.map((candidate) => {
          const probability = Math.min(100, Math.max(0, candidate.winProbability));

          return (
            <div key={candidate.candidateId}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-foreground">{candidate.candidateName}</span>
                <span className="font-mono font-bold text-foreground">
                  {probability.toFixed(1)}%
                </span>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                <CandidateMetric
                  label="Est. vote"
                  value={formatPercent(candidate.projectedVoteShare)}
                />
                <CandidateMetric
                  label="Poll avg."
                  value={formatPercent(candidate.pollingAverage)}
                />
                <CandidateMetric
                  label="Change"
                  value={formatChange(candidate.winProbabilityChange)}
                />
                <CandidateMetric label="Win chance" value={`${probability.toFixed(1)}%`} />
              </dl>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  aria-hidden="true"
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${probability}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        Updated {new Date(forecast.updatedAt).toLocaleString("en-US")}
      </p>
    </article>
  );
}

function CandidateMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-mono font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function formatPercent(value: number | null) {
  return value == null ? "Not available" : `${value.toFixed(1)}%`;
}

function formatChange(value: number | null) {
  if (value == null) return "No prior update";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)} pts`;
}

export default ForecastSummaryCard;

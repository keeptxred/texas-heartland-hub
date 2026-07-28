import { ElectionEmptyState } from "../states";
import type { ElectionForecastDetail } from "@/types/elections";
import {
  FORECAST_CONFIDENCE_LEVEL_LABELS,
  FORECAST_RATING_LABELS,
} from "@/types/elections/forecastClassifications";

export interface RaceForecastSectionProps {
  forecast: ElectionForecastDetail | null;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

export function RaceForecastSection({ forecast }: RaceForecastSectionProps) {
  return (
    <section aria-labelledby="race-forecast-heading" className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Model outlook</p>
        <h2
          id="race-forecast-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Race forecast
        </h2>
      </div>

      {!forecast ? (
        <ElectionEmptyState kind="forecasts" />
      ) : (
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-950">
                {forecast.source.sourceName}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Updated {formatDateTime(forecast.updatedAt)}
                {forecast.model.modelVersion ? ` · Model ${forecast.model.modelVersion}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                {FORECAST_RATING_LABELS[forecast.rating]}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {FORECAST_CONFIDENCE_LEVEL_LABELS[forecast.confidenceLevel]} confidence
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4" aria-label="Candidate win probabilities">
            {forecast.candidateSummaries.map((candidate) => {
              const probability = Math.min(100, Math.max(0, candidate.winProbability));

              return (
                <div key={candidate.candidateId}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-950">{candidate.candidateName}</span>
                    <span className="font-mono font-bold text-slate-950">
                      {probability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-red-700"
                      style={{ width: `${probability}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {forecast.projectedMargin != null ? (
            <p className="mt-5 text-sm font-semibold text-slate-700">
              Projected margin: {forecast.projectedMargin > 0 ? "+" : ""}
              {forecast.projectedMargin.toFixed(1)} points
            </p>
          ) : null}

          {forecast.notes ? (
            <p className="mt-5 text-sm leading-6 text-slate-600">{forecast.notes}</p>
          ) : null}

          {forecast.model.methodologyUrl ? (
            <div className="mt-6 border-t border-slate-200 pt-5">
              <a
                href={forecast.model.methodologyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-red-700 underline-offset-4 hover:underline"
              >
                Review forecast methodology ↗
              </a>
            </div>
          ) : null}
        </article>
      )}
    </section>
  );
}

export default RaceForecastSection;

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
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
            {forecast.sourceName}
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
            <a
              href={ELECTION_ROUTES.forecastDetail(forecast.slug)}
              className="hover:text-red-700 hover:underline"
            >
              {forecast.race.name}
            </a>
          </h3>
          <p className="mt-1 text-sm text-slate-600">{forecast.race.officeName}</p>
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

      <div className="mt-6 space-y-3">
        {forecast.candidates.map((candidate) => {
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

      <p className="mt-5 text-xs text-slate-500">
        Updated {new Date(forecast.updatedAt).toLocaleString("en-US")}
      </p>
    </article>
  );
}

export default ForecastSummaryCard;

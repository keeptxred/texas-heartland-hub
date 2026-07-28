import { ELECTION_ROUTES } from "@/lib/elections";
import type { ElectionForecastDetail } from "@/types/elections";
import {
  FORECAST_CONFIDENCE_LEVEL_LABELS,
  FORECAST_MODEL_LABELS,
  FORECAST_RATING_LABELS,
} from "@/types/elections/forecastClassifications";

export interface ForecastDetailViewProps {
  forecast: ElectionForecastDetail;
}

export function ForecastDetailView({ forecast }: ForecastDetailViewProps) {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
          {forecast.source.sourceName}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {forecast.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Forecast for{" "}
          <a
            href={ELECTION_ROUTES.race(forecast.race.slug)}
            className="font-semibold text-red-700 hover:underline"
          >
            {forecast.race.name}
          </a>
          .
        </p>
      </header>

      <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        {forecast.model.model === "fundamentals" ? (
          <>
            <strong>Fundamentals-based forecast.</strong> Credible public polling is not available
            for this race, so the model uses the clearly labeled fundamentals below.
          </>
        ) : (
          <>
            Forecasts are model estimates, not vote totals or guarantees. Review the source,
            assumptions, methodology, and update time before interpreting this outlook.
          </>
        )}
      </aside>

      <section
        aria-labelledby="forecast-rating"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 id="forecast-rating" className="text-xl font-bold text-slate-950">
          Race rating
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <Detail label="Rating" value={FORECAST_RATING_LABELS[forecast.rating]} />
          <Detail
            label="Confidence"
            value={FORECAST_CONFIDENCE_LEVEL_LABELS[forecast.confidenceLevel]}
          />
          <Detail
            label="Projected margin"
            value={
              forecast.projectedMargin == null
                ? "Not reported"
                : `${forecast.projectedMargin.toFixed(1)} points`
            }
          />
        </dl>
      </section>

      <section
        aria-labelledby="forecast-probabilities"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 id="forecast-probabilities" className="text-xl font-bold text-slate-950">
          Candidate probabilities
        </h2>
        <div className="mt-5 space-y-5">
          {forecast.candidateSummaries.map((candidate) => {
            const probability = Math.min(100, Math.max(0, candidate.winProbability));

            return (
              <div key={candidate.candidateId}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{candidate.candidateName}</p>
                    <p className="text-xs text-slate-500">{formatParty(candidate.party)}</p>
                  </div>
                  <p className="font-mono text-lg font-bold text-slate-950">
                    {probability.toFixed(1)}%
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    aria-hidden="true"
                    className="h-full rounded-full bg-red-700"
                    style={{ width: `${probability}%` }}
                  />
                </div>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                  <Detail
                    label="Estimated vote share"
                    value={formatPercent(candidate.projectedVoteShare)}
                  />
                  <Detail label="Polling average" value={formatPercent(candidate.pollingAverage)} />
                  <Detail
                    label="Forecast change"
                    value={formatChange(candidate.winProbabilityChange)}
                  />
                </dl>
              </div>
            );
          })}
        </div>
      </section>

      {forecast.model.model === "fundamentals" && forecast.model.fundamentals ? (
        <section
          aria-labelledby="forecast-fundamentals"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 id="forecast-fundamentals" className="text-xl font-bold text-slate-950">
            Fundamentals inputs
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            These are model inputs expressed in points. They are not poll results.
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail
              label="Previous election result"
              value={formatPoints(forecast.model.fundamentals.previousElectionMargin)}
            />
            <Detail
              label="District partisan lean"
              value={formatPoints(forecast.model.fundamentals.districtPartisanLean)}
            />
            <Detail
              label="Incumbency"
              value={formatPoints(forecast.model.fundamentals.incumbencyAdjustment)}
            />
            <Detail
              label="Fundraising"
              value={formatPoints(forecast.model.fundamentals.fundraisingAdvantage)}
            />
            <Detail
              label="Candidate quality indicators"
              value={formatPoints(forecast.model.fundamentals.candidateQualityAdjustment)}
            />
            <Detail
              label="Inputs updated"
              value={formatDateTime(forecast.model.fundamentals.dataAsOf)}
            />
          </dl>
          {forecast.model.fundamentals.sourceUrls.length > 0 ? (
            <ul className="mt-5 space-y-2 text-sm">
              {forecast.model.fundamentals.sourceUrls.map((url, index) => (
                <li key={url}>
                  <a
                    href={url}
                    className="font-semibold text-red-700 hover:underline"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Fundamentals source {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section
        aria-labelledby="forecast-methodology"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 id="forecast-methodology" className="text-xl font-bold text-slate-950">
          Methodology
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Detail label="Model" value={FORECAST_MODEL_LABELS[forecast.model.model]} />
          <Detail label="Model name" value={forecast.model.modelName} />
          <Detail label="Version" value={forecast.model.modelVersion ?? "Not reported"} />
          <Detail
            label="Simulations"
            value={
              forecast.model.simulationCount == null
                ? "Not reported"
                : forecast.model.simulationCount.toLocaleString("en-US")
            }
          />
          <Detail
            label="Last model run"
            value={
              forecast.model.lastModelRunAt
                ? formatDateTime(forecast.model.lastModelRunAt)
                : "Not reported"
            }
          />
        </dl>
        {forecast.model.methodologyUrl ? (
          <a
            href={forecast.model.methodologyUrl}
            className="mt-5 inline-flex font-semibold text-red-700 hover:underline"
            rel="noreferrer"
            target="_blank"
          >
            Read the published methodology
          </a>
        ) : (
          <p className="mt-5 text-sm text-slate-600">No methodology link was reported.</p>
        )}
      </section>

      <footer className="border-t border-slate-200 pt-5 text-sm text-slate-600">
        <p>
          Source:{" "}
          <a
            href={forecast.source.sourceUrl}
            className="font-semibold text-red-700 hover:underline"
            rel="noreferrer"
            target="_blank"
          >
            {forecast.source.sourceName}
          </a>
        </p>
        <p className="mt-1">Updated {formatDateTime(forecast.updatedAt)}</p>
      </footer>
    </div>
  );
}

function formatPercent(value: number | null) {
  return value == null ? "Not available" : `${value.toFixed(1)}%`;
}

function formatChange(value: number | null) {
  if (value == null) return "No prior published forecast";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)} percentage points`;
}

function formatPoints(value: number | null) {
  if (value == null) return "Not used";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)} points`;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-slate-800">{value}</dd>
    </div>
  );
}

function formatParty(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default ForecastDetailView;

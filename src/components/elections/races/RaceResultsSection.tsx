import { ElectionEmptyState } from "../states";
import type { ElectionResultDetail } from "@/types/elections";
import {
  CERTIFICATION_STATUS_LABELS,
  ELECTION_RESULT_STATUS_LABELS,
  RESULT_REPORTING_STATUS_LABELS,
  WINNER_STATUS_LABELS,
} from "@/types/elections/resultClassifications";

export interface RaceResultsSectionProps {
  result: ElectionResultDetail | null;
  isPreElection?: boolean;
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

export function RaceResultsSection({ result, isPreElection = false }: RaceResultsSectionProps) {
  const certified = result?.status === "certified" || result?.certificationStatus === "certified";

  return (
    <section aria-labelledby="race-results-heading" className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
          Official reporting
        </p>
        <h2
          id="race-results-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Election results
        </h2>
      </div>

      {isPreElection || !result ? (
        <ElectionEmptyState
          kind="results"
          title="Results are not reporting"
          message="Verified vote totals will appear after the official reporting source begins publishing results for this race."
        />
      ) : (
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-950">
                {certified ? "Certified results" : "Unofficial results"}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {ELECTION_RESULT_STATUS_LABELS[result.status]} ·{" "}
                {RESULT_REPORTING_STATUS_LABELS[result.reportingStatus]}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                certified
                  ? "bg-green-50 text-green-800 ring-1 ring-inset ring-green-200"
                  : "bg-amber-50 text-amber-900 ring-1 ring-inset ring-amber-200"
              }`}
            >
              {certified
                ? CERTIFICATION_STATUS_LABELS[result.certificationStatus]
                : "Live totals are unofficial"}
            </span>
          </div>

          {!certified ? (
            <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Election-night totals can change as additional ballots and reporting units are
              processed. Results are not final until certified by the responsible election
              authority.
            </p>
          ) : null}

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total votes
              </dt>
              <dd className="mt-1 text-lg font-bold text-slate-950">
                {result.totalVotes.toLocaleString("en-US")}
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Reporting
              </dt>
              <dd className="mt-1 text-lg font-bold text-slate-950">
                {result.reporting.reportingPercentage == null
                  ? "Not reported"
                  : `${result.reporting.reportingPercentage.toFixed(1)}%`}
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Certification
              </dt>
              <dd className="mt-1 text-lg font-bold text-slate-950">
                {CERTIFICATION_STATUS_LABELS[result.certificationStatus]}
              </dd>
            </div>
          </dl>

          <div className="mt-6 divide-y divide-slate-200">
            {result.candidateSummaries.map((candidate) => (
              <div
                key={candidate.candidateId}
                className="grid gap-2 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6"
              >
                <div>
                  <p className="font-semibold text-slate-950">{candidate.ballotName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {[candidate.partyLabel, WINNER_STATUS_LABELS[candidate.winnerStatus]]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <p className="font-mono text-sm font-semibold text-slate-700">
                  {candidate.votes.toLocaleString("en-US")} votes
                </p>
                <p className="font-mono text-lg font-bold text-slate-950">
                  {candidate.voteShare == null ? "—" : `${candidate.voteShare.toFixed(1)}%`}
                </p>
              </div>
            ))}
          </div>

          <footer className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-600">
            <p>
              Source:{" "}
              <a
                href={result.source.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-red-700 underline-offset-4 hover:underline"
              >
                {result.source.sourceName}
              </a>
            </p>
            <p className="mt-1">Refreshed {formatDateTime(result.updatedAt)}</p>
          </footer>
        </article>
      )}
    </section>
  );
}

export default RaceResultsSection;

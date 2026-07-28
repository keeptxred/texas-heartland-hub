import { ELECTION_ROUTES } from "@/lib/elections";
import type { ElectionResultSummary } from "@/types/elections";
import {
  CERTIFICATION_STATUS_LABELS,
  RESULT_REPORTING_STATUS_LABELS,
  WINNER_STATUS_LABELS,
} from "@/types/elections/resultClassifications";

export interface ResultSummaryCardProps {
  result: ElectionResultSummary;
}

export function ResultSummaryCard({ result }: ResultSummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h4 className="text-xl font-bold tracking-tight text-slate-950">
            <a
              href={ELECTION_ROUTES.result(result.slug)}
              className="hover:text-red-700 hover:underline"
            >
              {result.race.name}
            </a>
          </h4>
          <p className="mt-1 text-sm text-slate-600">{result.race.officeName}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {CERTIFICATION_STATUS_LABELS[result.certificationStatus]}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Reporting
          </dt>
          <dd className="mt-1 font-bold text-slate-950">
            {result.reporting.reportingPercentage == null
              ? RESULT_REPORTING_STATUS_LABELS[result.reportingStatus]
              : `${result.reporting.reportingPercentage.toFixed(1)}%`}
          </dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total votes
          </dt>
          <dd className="mt-1 font-bold text-slate-950">
            {result.totalVotes.toLocaleString("en-US")}
          </dd>
        </div>
      </dl>

      <div className="mt-5 divide-y divide-slate-200">
        {result.candidates.slice(0, 3).map((candidate) => (
          <div key={candidate.candidateId} className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
            <div>
              <p className="font-semibold text-slate-950">{candidate.ballotName}</p>
              <p className="mt-1 text-xs text-slate-500">
                {WINNER_STATUS_LABELS[candidate.winnerStatus]}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-slate-950">
                {candidate.voteShare == null ? "—" : `${candidate.voteShare.toFixed(1)}%`}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-500">
                {candidate.votes.toLocaleString("en-US")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ResultSummaryCard;

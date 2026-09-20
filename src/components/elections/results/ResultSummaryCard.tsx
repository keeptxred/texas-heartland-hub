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
  const certified = result.status === "certified" || result.certificationStatus === "certified";
  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h4 className="text-xl font-bold tracking-tight text-foreground">
            <a
              href={ELECTION_ROUTES.result(result.slug)}
              className="hover:text-primary hover:underline"
            >
              {result.race.name}
            </a>
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">{result.race.officeName}</p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {certified ? "Certified result" : "Unofficial result"} ·{" "}
          {CERTIFICATION_STATUS_LABELS[result.certificationStatus]}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/40 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Reporting
          </dt>
          <dd className="mt-1 font-bold text-foreground">
            {result.reporting.reportingPercentage == null
              ? RESULT_REPORTING_STATUS_LABELS[result.reportingStatus]
              : `${result.reporting.reportingPercentage.toFixed(1)}%`}
          </dd>
        </div>
        <div className="rounded-lg bg-muted/40 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total votes
          </dt>
          <dd className="mt-1 font-bold text-foreground">
            {result.totalVotes.toLocaleString("en-US")}
          </dd>
        </div>
      </dl>

      <div className="mt-5 divide-y divide-border">
        {result.candidates.slice(0, 3).map((candidate) => (
          <div key={candidate.candidateId} className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
            <div>
              <p className="font-semibold text-foreground">{candidate.ballotName}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {WINNER_STATUS_LABELS[candidate.winnerStatus]}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-foreground">
                {candidate.voteShare == null ? "—" : `${candidate.voteShare.toFixed(1)}%`}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {candidate.votes.toLocaleString("en-US")}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        Updated {new Date(result.lastVoteUpdateAt ?? result.updatedAt).toLocaleString("en-US")}
      </p>
    </article>
  );
}

export default ResultSummaryCard;

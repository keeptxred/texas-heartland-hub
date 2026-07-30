import { ElectionEmptyState } from "../states";
import type { CandidateDetail, ElectionResultDetail } from "@/types/elections";
import {
  CERTIFICATION_STATUS_LABELS,
  WINNER_STATUS_LABELS,
} from "@/types/elections/resultClassifications";

export interface CandidateResultsSectionProps {
  candidate: CandidateDetail;
  result: ElectionResultDetail | null;
  isPreElection?: boolean;
}

export function CandidateResultsSection({
  candidate,
  result,
  isPreElection = false,
}: CandidateResultsSectionProps) {
  const candidateResult = result?.candidateSummaries.find(
    (item) => item.candidateId === candidate.id,
  );

  return (
    <section aria-labelledby="candidate-results-heading" className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
          Official reporting
        </p>
        <h2
          id="candidate-results-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Candidate results
        </h2>
      </div>

      {isPreElection || !result || !candidateResult ? (
        <ElectionEmptyState
          kind="results"
          title="Candidate results are not available"
          message="Verified vote totals and outcome information will appear after official reporting begins for this candidate's race."
        />
      ) : (
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultMetric
              label="Vote total"
              value={candidateResult.votes.toLocaleString("en-US")}
            />
            <ResultMetric
              label="Vote percentage"
              value={
                candidateResult.voteShare == null
                  ? "Not reported"
                  : `${candidateResult.voteShare.toFixed(1)}%`
              }
            />
            <ResultMetric
              label="Outcome"
              value={WINNER_STATUS_LABELS[candidateResult.winnerStatus]}
            />
            <ResultMetric
              label="Certification"
              value={CERTIFICATION_STATUS_LABELS[result.certificationStatus]}
            />
          </dl>
        </article>
      )}
    </section>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 text-lg font-bold text-slate-950">{value}</dd>
    </div>
  );
}

export default CandidateResultsSection;

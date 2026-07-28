import { ElectionEmptyState } from "../states";
import type { CandidateDetail, ElectionPollSummary } from "@/types/elections";

export interface CandidatePollingSectionProps {
  candidate: CandidateDetail;
  polls: readonly ElectionPollSummary[];
  hasStaleData?: boolean;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function CandidatePollingSection({
  candidate,
  polls,
  hasStaleData = false,
}: CandidatePollingSectionProps) {
  const supportPoints = polls.flatMap((poll) => {
    const response = poll.primaryQuestion?.responses.find(
      (item) => item.candidateId === candidate.id,
    );

    return response?.percentage == null ? [] : [{ poll, response }];
  });

  return (
    <section aria-labelledby="candidate-polling-heading" className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Public polling</p>
        <h2
          id="candidate-polling-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Candidate support and recent trend
        </h2>
      </div>

      {hasStaleData ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          One or more polls are outside the current freshness window. Review field dates and sources
          before interpreting the trend.
        </div>
      ) : null}

      {supportPoints.length === 0 ? (
        <ElectionEmptyState
          kind="polls"
          title="No candidate-specific polling is available"
          message="Support figures will appear only when a qualifying published poll includes this candidate in its reported toplines."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-200">
            {supportPoints.map(({ poll, response }) => {
              const sourceUrl = poll.methodology.methodologyUrl;

              return (
                <article
                  key={poll.id}
                  className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold text-slate-950">{poll.pollsterName}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Fielded {formatDate(poll.fieldStartDate)}–{formatDate(poll.fieldEndDate)}
                    </p>
                    {sourceUrl ? (
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm font-semibold text-red-700 underline-offset-4 hover:underline"
                      >
                        Review poll methodology ↗
                      </a>
                    ) : null}
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Candidate support
                    </p>
                    <p className="mt-1 font-mono text-2xl font-bold text-slate-950">
                      {response.percentage?.toFixed(1)}%
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default CandidatePollingSection;

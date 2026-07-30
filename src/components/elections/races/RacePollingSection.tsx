import { PollCard } from "../cards";
import { ElectionEmptyState } from "../states";
import type { ElectionPollSummary, RaceDetail } from "@/types/elections";
import {
  POLL_GRADE_LABELS,
  POLL_MODE_LABELS,
  POLL_POPULATION_LABELS,
} from "@/types/elections/pollClassifications";

export interface RacePollingSectionProps {
  race: RaceDetail;
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

export function RacePollingSection({ race, polls, hasStaleData = false }: RacePollingSectionProps) {
  return (
    <section aria-labelledby="race-polls-heading" className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Public polling</p>
        <h2
          id="race-polls-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Latest polls
        </h2>
      </div>

      {hasStaleData ? (
        <div
          role="status"
          className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
        >
          One or more polls are outside the current freshness window. Review field dates and
          methodology before interpreting the results.
        </div>
      ) : null}

      {polls.length === 0 ? (
        <ElectionEmptyState kind="polls" />
      ) : (
        <div className="space-y-6">
          {polls.slice(0, 5).map((poll) => {
            const question = poll.primaryQuestion;
            const results =
              question?.responses.flatMap((response) =>
                response.percentage == null
                  ? []
                  : [
                      {
                        candidateId: response.candidateId ?? response.id,
                        candidateName: response.candidateName ?? response.label,
                        partyLabel: response.partyLabel ?? undefined,
                        percentage: response.percentage,
                      },
                    ],
              ) ?? [];
            const methodologyNotes = [
              poll.methodology.samplingDescription,
              poll.methodology.weightingDescription,
              poll.methodology.likelyVoterModelDescription,
            ].filter((note): note is string => Boolean(note));

            return (
              <div key={poll.id}>
                <PollCard
                  pollster={poll.pollsterName}
                  raceName={race.name}
                  raceHref={`/elections/races/${race.slug}`}
                  fieldDates={`${formatDate(poll.fieldStartDate)}–${formatDate(poll.fieldEndDate)}`}
                  publishedDate={poll.releaseDate ? formatDate(poll.releaseDate) : undefined}
                  sampleSize={question?.sampleSize ?? poll.methodology.sampleSize}
                  populationLabel={
                    POLL_POPULATION_LABELS[question?.population ?? poll.methodology.population]
                  }
                  methodologyLabel={POLL_MODE_LABELS[poll.methodology.mode]}
                  marginOfError={poll.methodology.marginOfError}
                  grade={POLL_GRADE_LABELS[poll.pollsterGrade]}
                  sponsor={
                    poll.sponsors.length > 0
                      ? poll.sponsors.map((sponsor) => sponsor.name).join(", ")
                      : undefined
                  }
                  results={results}
                  sourceUrl={poll.methodology.methodologyUrl ?? undefined}
                />
                {methodologyNotes.length > 0 ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-950">Methodology notes</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                      {methodologyNotes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RacePollingSection;

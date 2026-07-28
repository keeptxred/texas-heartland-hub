import { PollCard } from "../cards";
import { ELECTION_ROUTES } from "@/lib/elections";
import type { ElectionPollDetail } from "@/types/elections";
import {
  POLL_GRADE_LABELS,
  POLL_MODE_LABELS,
  POLL_POPULATION_LABELS,
} from "@/types/elections/pollClassifications";

export interface PollDetailViewProps {
  poll: ElectionPollDetail;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function PollDetailView({ poll }: PollDetailViewProps) {
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
              candidateHref: response.candidateSlug
                ? ELECTION_ROUTES.candidate(response.candidateSlug)
                : undefined,
            },
          ],
    ) ?? [];

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Poll detail</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {poll.title}
        </h1>
        {question?.prompt ? (
          <p className="mt-4 text-base leading-7 text-slate-600">{question.prompt}</p>
        ) : null}
      </header>

      <PollCard
        pollster={poll.pollster.name}
        raceName={poll.race?.name ?? poll.jurisdictionName ?? poll.title}
        raceHref={poll.race ? ELECTION_ROUTES.race(poll.race.slug) : undefined}
        fieldDates={`${formatDate(poll.fieldStartDate)}–${formatDate(poll.fieldEndDate)}`}
        publishedDate={poll.releaseDate ? formatDate(poll.releaseDate) : undefined}
        sampleSize={question?.sampleSize ?? poll.methodology.sampleSize}
        populationLabel={
          POLL_POPULATION_LABELS[question?.population ?? poll.methodology.population]
        }
        methodologyLabel={POLL_MODE_LABELS[poll.methodology.mode]}
        marginOfError={poll.methodology.marginOfError}
        grade={POLL_GRADE_LABELS[poll.pollster.grade]}
        sponsor={
          poll.sponsors.length > 0
            ? poll.sponsors.map((sponsor) => sponsor.name).join(", ")
            : undefined
        }
        results={results}
        sourceUrl={poll.toplineUrl ?? poll.methodology.methodologyUrl ?? poll.source.sourceUrl}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Methodology</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <MethodDetail label="Sampling" value={poll.methodology.samplingDescription} />
          <MethodDetail label="Weighting" value={poll.methodology.weightingDescription} />
          <MethodDetail
            label="Likely-voter model"
            value={poll.methodology.likelyVoterModelDescription}
          />
          <MethodDetail
            label="Confidence level"
            value={
              poll.methodology.confidenceLevel == null
                ? null
                : `${poll.methodology.confidenceLevel}%`
            }
          />
        </dl>
      </section>
    </div>
  );
}

function MethodDetail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-slate-700">{value ?? "Not reported"}</dd>
    </div>
  );
}

export default PollDetailView;

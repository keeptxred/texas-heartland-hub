import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ElectionEmptyState, PollCard, PollingTrendChart } from "@/components/elections";
import { useElectionCandidates, useElectionPolls, useElectionRaces } from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionPollListPage } from "@/pages/elections";
import type { CandidateId, PollPopulation, PollSponsorType, RaceId } from "@/types/elections";
import {
  POLL_POPULATIONS,
  POLL_GRADE_LABELS,
  POLL_MODE_LABELS,
  POLL_POPULATION_LABELS,
  POLL_SPONSOR_TYPES,
  POLL_SPONSOR_TYPE_LABELS,
} from "@/types/elections/pollClassifications";

export const Route = createFileRoute("/elections/polls")({
  head: () => ({
    meta: [
      { title: "Texas Election Polls | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Review published Texas election polls with field dates, sample populations, sponsors, toplines, and methodology disclosures.",
      },
      {
        property: "og:title",
        content: "Texas Election Polls | KeepTXRed Election Central",
      },
      { property: "og:url", content: "https://keeptxred.com/elections/polls" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/polls",
      },
    ],
  }),
  component: ElectionPollsRoute,
});

function ElectionPollsRoute() {
  return (
    <ElectionRepositoryProvider>
      <ElectionPollsContent />
    </ElectionRepositoryProvider>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function ElectionPollsContent() {
  const [raceId, setRaceId] = useState<RaceId | null>(null);
  const [candidateId, setCandidateId] = useState<CandidateId | null>(null);
  const [pollsterName, setPollsterName] = useState("");
  const [population, setPopulation] = useState<PollPopulation | null>(null);
  const [sponsorType, setSponsorType] = useState<PollSponsorType | null>(null);
  const [fieldDateFrom, setFieldDateFrom] = useState("");
  const [fieldDateTo, setFieldDateTo] = useState("");
  const [internalPoll, setInternalPoll] = useState<boolean | null>(null);
  const races = useElectionRaces({
    filters: { publicationStatuses: ["published"], stateCodes: ["TX"] },
    pagination: { page: 1, pageSize: 100 },
    sort: [{ field: "name", direction: "asc" }],
  });
  const candidates = useElectionCandidates({
    filters: {
      primaryRaceIds: raceId ? [raceId] : undefined,
      publicationStatuses: ["published"],
      stateCodes: ["TX"],
    },
    pagination: { page: 1, pageSize: 100 },
    sort: [{ field: "ballot_name", direction: "asc" }],
  });
  const polls = useElectionPolls({
    filters: {
      raceIds: raceId ? [raceId] : undefined,
      candidateIds: candidateId ? [candidateId] : undefined,
      pollsterNames: pollsterName.trim() ? [pollsterName.trim()] : undefined,
      populations: population ? [population] : undefined,
      sponsorTypes: sponsorType ? [sponsorType] : undefined,
      fieldDateFrom: fieldDateFrom || undefined,
      fieldDateTo: fieldDateTo || undefined,
      internalPoll: internalPoll ?? undefined,
      publicationStatuses: ["published"],
    },
    pagination: { page: 1, pageSize: 50 },
    sort: [{ field: "field_end_date", direction: "desc" }],
  });

  return (
    <ElectionPollListPage
      error={races.error ?? candidates.error ?? polls.error}
      isLoading={races.isLoading || candidates.isLoading || polls.isLoading}
      onRetry={() => {
        void races.refetch();
        void candidates.refetch();
        void polls.refetch();
      }}
    >
      <div className="space-y-6">
        <div
          aria-label="Filter election polls"
          className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <PollFilterSelect
            label="Race"
            value={raceId ?? ""}
            options={
              races.data?.items.map((race) => ({
                value: race.id,
                label: race.name,
              })) ?? []
            }
            onChange={(value) =>
              setRaceId((current) => {
                const next = races.data?.items.find((race) => race.id === value)?.id ?? null;
                if (next !== current) setCandidateId(null);
                return next;
              })
            }
          />
          <PollFilterSelect
            label="Candidate"
            value={candidateId ?? ""}
            options={
              candidates.data?.items.map((candidate) => ({
                value: candidate.id,
                label: candidate.fullName,
              })) ?? []
            }
            onChange={(value) =>
              setCandidateId(
                candidates.data?.items.find((candidate) => candidate.id === value)?.id ?? null,
              )
            }
          />
          <label className="text-sm font-semibold text-slate-900">
            Pollster
            <input
              type="search"
              value={pollsterName}
              onChange={(event) => setPollsterName(event.target.value)}
              placeholder="Pollster name"
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </label>
          <PollFilterSelect
            label="Population"
            value={population ?? ""}
            options={POLL_POPULATIONS.map((value) => ({
              value,
              label: POLL_POPULATION_LABELS[value],
            }))}
            onChange={(value) =>
              setPopulation(POLL_POPULATIONS.find((item) => item === value) ?? null)
            }
          />
          <PollFilterSelect
            label="Sponsor type"
            value={sponsorType ?? ""}
            options={POLL_SPONSOR_TYPES.map((value) => ({
              value,
              label: POLL_SPONSOR_TYPE_LABELS[value],
            }))}
            onChange={(value) =>
              setSponsorType(POLL_SPONSOR_TYPES.find((item) => item === value) ?? null)
            }
          />
          <PollFilterSelect
            label="Poll source"
            value={internalPoll == null ? "" : internalPoll ? "internal" : "independent"}
            options={[
              { value: "independent", label: "Independent polls" },
              { value: "internal", label: "Internal polls" },
            ]}
            onChange={(value) =>
              setInternalPoll(value === "internal" ? true : value === "independent" ? false : null)
            }
          />
          <DateFilter label="Field date from" value={fieldDateFrom} onChange={setFieldDateFrom} />
          <DateFilter label="Field date to" value={fieldDateTo} onChange={setFieldDateTo} />
        </div>

        {polls.isEmpty ? (
          raceId &&
          !candidateId &&
          !pollsterName.trim() &&
          !population &&
          !sponsorType &&
          !fieldDateFrom &&
          !fieldDateTo &&
          internalPoll == null ? (
            <ElectionEmptyState
              kind="polls"
              title="No credible public polling is currently available for this race."
              message="Election Central does not create or estimate poll numbers when a qualifying public poll has not been published."
            />
          ) : (
            <ElectionEmptyState kind="filters" />
          )
        ) : (
          <div className="space-y-6">
            {raceId && polls.data ? <PollingTrendChart polls={polls.data.items} /> : null}
            {polls.data?.items.map((poll) => {
              const question = poll.primaryQuestion;
              const raceHref = poll.race ? ELECTION_ROUTES.race(poll.race.slug) : undefined;
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

              return (
                <PollCard
                  key={poll.id}
                  pollster={poll.pollsterName}
                  raceName={poll.race?.name ?? poll.jurisdictionName ?? poll.title}
                  raceHref={raceHref}
                  fieldDates={`${formatDate(poll.fieldStartDate)}–${formatDate(poll.fieldEndDate)}`}
                  publishedDate={poll.releaseDate ? formatDate(poll.releaseDate) : undefined}
                  sampleSize={question?.sampleSize ?? poll.methodology.sampleSize}
                  populationLabel={
                    POLL_POPULATION_LABELS[question?.population ?? poll.methodology.population]
                  }
                  methodologyLabel={POLL_MODE_LABELS[poll.methodology.mode]}
                  disclosureLabels={[
                    ...(poll.internalPoll ? ["Internal poll"] : ["Independent poll"]),
                    ...(poll.partisanPoll ? ["Partisan sponsor"] : []),
                  ]}
                  marginOfError={poll.methodology.marginOfError}
                  grade={POLL_GRADE_LABELS[poll.pollsterGrade]}
                  sponsor={
                    poll.sponsors.length > 0
                      ? poll.sponsors.map((sponsor) => sponsor.name).join(", ")
                      : undefined
                  }
                  results={results}
                  sourceUrl={poll.toplineUrl ?? poll.sourceUrl}
                />
              );
            })}
          </div>
        )}
      </div>
    </ElectionPollListPage>
  );
}

interface PollFilterSelectProps {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}

function PollFilterSelect({ label, value, options, onChange }: PollFilterSelectProps) {
  return (
    <label className="text-sm font-semibold text-slate-900">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DateFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-semibold text-slate-900">
      {label}
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
      />
    </label>
  );
}

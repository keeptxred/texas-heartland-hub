import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ElectionEmptyState, RaceCard } from "@/components/elections";
import { useActiveElectionCycle, useElectionCycles, useElectionRaces } from "@/hooks/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionRaceListPage } from "@/pages/elections";
import type {
  ElectionCycleId,
  ElectionType,
  OfficeLevel,
  PartyScope,
  RaceStatus,
} from "@/types/elections";
import {
  ELECTION_TYPES,
  ELECTION_TYPE_LABELS,
  OFFICE_LEVELS,
  OFFICE_LEVEL_LABELS,
  PARTY_SCOPES,
  PARTY_SCOPE_LABELS,
  RACE_STATUSES,
  RACE_STATUS_LABELS,
} from "@/types/elections/raceClassifications";

const RACE_SORT_OPTIONS = [
  { value: "election_date", label: "Election date" },
  { value: "office_level", label: "Office level" },
  { value: "competitive", label: "Competitiveness" },
  { value: "name", label: "Alphabetical" },
] as const;

type RaceSortOption = (typeof RACE_SORT_OPTIONS)[number]["value"];

export const Route = createFileRoute("/elections/races")({
  head: () => ({
    meta: [
      { title: "Texas Election Races | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Browse verified Texas election races, candidates, election dates, ratings, and reporting status.",
      },
      {
        property: "og:title",
        content: "Texas Election Races | KeepTXRed Election Central",
      },
      {
        property: "og:description",
        content:
          "Follow published statewide, congressional, legislative, county, and local Texas election races.",
      },
      { property: "og:url", content: "/elections/races" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/races",
      },
    ],
  }),
  component: ElectionRacesRoute,
});

function ElectionRacesRoute() {
  return (
    <ElectionRepositoryProvider>
      <ElectionRacesContent />
    </ElectionRepositoryProvider>
  );
}

function ElectionRacesContent() {
  const [selectedCycleId, setSelectedCycleId] = useState<ElectionCycleId | null>(null);
  const [officeLevel, setOfficeLevel] = useState<OfficeLevel | null>(null);
  const [electionType, setElectionType] = useState<ElectionType | null>(null);
  const [partyScope, setPartyScope] = useState<PartyScope | null>(null);
  const [raceStatus, setRaceStatus] = useState<RaceStatus | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<RaceSortOption>("election_date");
  const activeCycle = useActiveElectionCycle();
  const cycles = useElectionCycles({
    filters: {
      stateCodes: ["TX"],
      publicationStatuses: ["published"],
    },
    sort: [{ field: "election_date", direction: "desc" }],
  });
  const electionCycleId = selectedCycleId ?? activeCycle.data?.id ?? null;
  const races = useElectionRaces({
    filters: {
      electionCycleIds: electionCycleId ? [electionCycleId] : [],
      officeLevels: officeLevel ? [officeLevel] : undefined,
      electionTypes: electionType ? [electionType] : undefined,
      partyScopes: partyScope ? [partyScope] : undefined,
      statuses: raceStatus ? [raceStatus] : undefined,
      featured: featuredOnly || undefined,
      publicationStatuses: ["published"],
    },
    pagination: { page: 1, pageSize: 50 },
    sort: [
      {
        field: sortBy,
        direction: sortBy === "competitive" ? "desc" : "asc",
      },
    ],
  });
  const error = activeCycle.error ?? cycles.error ?? races.error;

  const handleCycleChange = (value: string) => {
    const cycle = cycles.data?.items.find((item) => item.id === value);
    setSelectedCycleId(cycle?.id ?? null);
  };

  const handleRetry = () => {
    void activeCycle.refetch();
    void cycles.refetch();
    void races.refetch();
  };

  const clearFilters = () => {
    setOfficeLevel(null);
    setElectionType(null);
    setPartyScope(null);
    setRaceStatus(null);
    setFeaturedOnly(false);
  };

  return (
    <ElectionRaceListPage
      error={error}
      isLoading={activeCycle.isLoading || cycles.isLoading || races.isLoading}
      onRetry={handleRetry}
    >
      <div className="space-y-6">
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          {cycles.data && cycles.data.items.length > 0 ? (
            <label className="block text-sm font-semibold text-slate-900">
              Election cycle
              <select
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                value={electionCycleId ?? ""}
                onChange={(event) => handleCycleChange(event.target.value)}
              >
                {cycles.data.items.map((cycle) => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <RaceFilterSelect
            label="Sort races"
            value={sortBy}
            options={RACE_SORT_OPTIONS}
            includeAllOption={false}
            onChange={(value) => {
              const option = RACE_SORT_OPTIONS.find((item) => item.value === value);
              if (option) {
                setSortBy(option.value);
              }
            }}
          />
        </div>

        <div
          aria-label="Filter election races"
          className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-5"
        >
          <RaceFilterSelect
            label="Office level"
            value={officeLevel ?? ""}
            options={OFFICE_LEVELS.map((value) => ({
              value,
              label: OFFICE_LEVEL_LABELS[value],
            }))}
            onChange={(value) =>
              setOfficeLevel(OFFICE_LEVELS.find((item) => item === value) ?? null)
            }
          />
          <RaceFilterSelect
            label="Election type"
            value={electionType ?? ""}
            options={ELECTION_TYPES.map((value) => ({
              value,
              label: ELECTION_TYPE_LABELS[value],
            }))}
            onChange={(value) =>
              setElectionType(ELECTION_TYPES.find((item) => item === value) ?? null)
            }
          />
          <RaceFilterSelect
            label="Party scope"
            value={partyScope ?? ""}
            options={PARTY_SCOPES.map((value) => ({
              value,
              label: PARTY_SCOPE_LABELS[value],
            }))}
            onChange={(value) => setPartyScope(PARTY_SCOPES.find((item) => item === value) ?? null)}
          />
          <RaceFilterSelect
            label="Race status"
            value={raceStatus ?? ""}
            options={RACE_STATUSES.map((value) => ({
              value,
              label: RACE_STATUS_LABELS[value],
            }))}
            onChange={(value) =>
              setRaceStatus(RACE_STATUSES.find((item) => item === value) ?? null)
            }
          />
          <div className="flex flex-col justify-end gap-3">
            <label className="flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-900">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(event) => setFeaturedOnly(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-red-700 focus:ring-red-600"
              />
              Featured races only
            </label>
            <button
              type="button"
              onClick={clearFilters}
              className="self-start text-sm font-semibold text-red-700 underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
          </div>
        </div>

        {!electionCycleId || races.isEmpty ? (
          <ElectionEmptyState kind="races" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {races.data?.items.map((race) => (
              <RaceCard
                key={race.id}
                name={race.name}
                office={race.officeName}
                district={race.districtName ?? undefined}
                electionDate={race.electionDate}
                electionType={ELECTION_TYPE_LABELS[race.electionType]}
                status={race.status}
                rating={race.rating}
                competitive={race.competitive}
                candidates={race.candidates.map((candidate) => ({
                  id: candidate.id,
                  name: candidate.fullName,
                  partyLabel: candidate.partyLabel ?? undefined,
                  incumbent: candidate.incumbent,
                }))}
              />
            ))}
          </div>
        )}
      </div>
    </ElectionRaceListPage>
  );
}

interface RaceFilterSelectProps {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  includeAllOption?: boolean;
}

function RaceFilterSelect({
  label,
  value,
  options,
  onChange,
  includeAllOption = true,
}: RaceFilterSelectProps) {
  return (
    <label className="block text-sm font-semibold text-slate-900">
      {label}
      <select
        className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {includeAllOption ? <option value="">All</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

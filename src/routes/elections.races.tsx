import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ElectionEmptyState, RaceCard } from "@/components/elections";
import { useActiveElectionCycle, useElectionCycles, useElectionRaces } from "@/hooks/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionRaceListPage } from "@/pages/elections";
import type { ElectionCycleId } from "@/types/elections";
import { ELECTION_TYPE_LABELS } from "@/types/elections/raceClassifications";

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
      publicationStatuses: ["published"],
    },
    pagination: { page: 1, pageSize: 50 },
    sort: [{ field: "election_date", direction: "asc" }],
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

  return (
    <ElectionRaceListPage
      error={error}
      isLoading={activeCycle.isLoading || cycles.isLoading || races.isLoading}
      onRetry={handleRetry}
    >
      <div className="space-y-6">
        {cycles.data && cycles.data.items.length > 0 ? (
          <label className="block max-w-sm text-sm font-semibold text-slate-900">
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

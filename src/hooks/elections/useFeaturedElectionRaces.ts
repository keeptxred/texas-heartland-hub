import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionCycleId, RaceSummary } from "@/types/elections";

function sortFeaturedRaces(races: readonly RaceSummary[]) {
  return races
    .map((race, index) => ({ race, index }))
    .sort(
      (left, right) =>
        left.race.electionDate.localeCompare(right.race.electionDate) ||
        left.race.name.localeCompare(right.race.name) ||
        left.race.id.localeCompare(right.race.id) ||
        left.index - right.index,
    )
    .map(({ race }) => race);
}

export function useFeaturedElectionRaces(electionCycleId?: ElectionCycleId, limit?: number) {
  const { races } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: electionCycleId
      ? electionQueryKeys.races.featured(electionCycleId, limit)
      : [...electionQueryKeys.races.all(), "featured", "disabled", limit ?? null],
    queryFn: electionCycleId ? () => races.listFeatured(electionCycleId, limit) : skipToken,
    select: sortFeaturedRaces,
    staleTime: electionQueryStaleTimes.races,
  });

  return {
    ...result,
    isEmpty: result.isSuccess && result.data.length === 0,
  };
}

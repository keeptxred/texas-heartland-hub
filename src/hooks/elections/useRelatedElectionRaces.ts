import { useQueries } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { RaceId } from "@/types/elections";

export function useRelatedElectionRaces(raceIds: readonly RaceId[]) {
  const { races } = useElectionRepositories();
  const queries = useQueries({
    queries: raceIds.map((raceId) => ({
      ...electionQueryDefaults,
      queryKey: electionQueryKeys.races.detailById(raceId),
      queryFn: () => races.findDetailById(raceId),
      staleTime: electionQueryStaleTimes.races,
    })),
  });

  return {
    data: queries.flatMap((query) => (query.data ? [query.data] : [])),
    error: queries.find((query) => query.error)?.error ?? null,
    isLoading: queries.some((query) => query.isLoading),
    refetch: () => Promise.all(queries.map((query) => query.refetch())),
  };
}

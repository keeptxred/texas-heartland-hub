import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { RaceId } from "@/types/elections";

export function useResultByRace(raceId?: RaceId) {
  const { results } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: raceId
      ? electionQueryKeys.results.byRace(raceId)
      : [...electionQueryKeys.results.all(), "race", "disabled"],
    queryFn: raceId ? () => results.findDetailByRaceId(raceId) : skipToken,
    staleTime: electionQueryStaleTimes.results,
  });
  const isPreElection =
    Boolean(raceId) &&
    result.isSuccess &&
    (result.data === null || result.data.status === "not_started");

  return {
    ...result,
    reporting: result.data?.reporting ?? null,
    reportingStatus: result.data?.reportingStatus ?? null,
    certificationStatus: result.data?.certificationStatus ?? null,
    isPreElection,
  };
}

import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { RaceId } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export function useResultByRace(raceId: RaceId | undefined) {
  const { results } = useElectionRepositories();

  const result = useQuery({
    queryKey: raceId
      ? electionQueryKeys.results.byRace(raceId)
      : [...electionQueryKeys.results.all(), "race", "disabled"],
    queryFn: async () => {
      if (!raceId) return null;
      return results.findDetailByRaceId(raceId);
    },
    enabled: Boolean(raceId),
    ...ELECTION_QUERY_DEFAULTS.public,
  });

  const electionResult = result.data ?? null;

  return {
    ...result,
    result: electionResult,
    isPreElection: result.isSuccess && electionResult === null,
    reportingStatus: electionResult?.reportingStatus ?? null,
    certificationStatus: electionResult?.certificationStatus ?? null,
    lastUpdatedAt:
      electionResult?.lastVoteUpdateAt ?? electionResult?.updatedAt ?? null,
  };
}

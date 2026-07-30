import { skipToken, useQuery } from "@tanstack/react-query";
import { ELECTION_CENTRAL_CONFIG } from "@/lib/elections/config";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
  getElectionResultRefetchInterval,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionCycleId, ElectionResultSummary } from "@/types/elections";

function getActiveResultsRefetchInterval(results: readonly ElectionResultSummary[] | undefined) {
  if (results?.some((result) => result.reportingStatus === "partial")) {
    return getElectionResultRefetchInterval("reporting");
  }

  if (results?.some((result) => result.reportingStatus === "substantially_complete")) {
    return getElectionResultRefetchInterval("nearly_complete");
  }

  return false;
}

export function useActiveElectionResults(
  electionCycleId?: ElectionCycleId,
  limit: number = ELECTION_CENTRAL_CONFIG.display.defaultRaceLimit,
) {
  const { results } = useElectionRepositories();
  const resultLimit = Math.max(0, Math.floor(limit));
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: electionCycleId
      ? electionQueryKeys.results.active(electionCycleId, resultLimit)
      : [...electionQueryKeys.results.all(), "active", "disabled", resultLimit],
    queryFn: electionCycleId
      ? () =>
          resultLimit === 0 ? Promise.resolve([]) : results.listLive(electionCycleId, resultLimit)
      : skipToken,
    refetchInterval: (query) => getActiveResultsRefetchInterval(query.state.data),
    staleTime: electionQueryStaleTimes.results,
  });

  return {
    ...result,
    isEmpty: result.isSuccess && result.data.length === 0,
  };
}

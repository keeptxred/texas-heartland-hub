import { useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
  getElectionResultRefetchInterval,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionResultListQuery } from "@/types/elections";

export function useElectionResults(query?: ElectionResultListQuery) {
  const { results } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: electionQueryKeys.results.list(query),
    queryFn: () => results.list(query),
    refetchInterval: (currentQuery) => {
      const items = currentQuery.state.data?.items;
      if (items?.some((item) => item.reportingStatus === "partial")) {
        return getElectionResultRefetchInterval("reporting");
      }
      if (items?.some((item) => item.reportingStatus === "substantially_complete")) {
        return getElectionResultRefetchInterval("nearly_complete");
      }
      return false;
    },
    staleTime: electionQueryStaleTimes.results,
  });

  return {
    ...result,
    isEmpty: result.isSuccess && result.data.items.length === 0,
  };
}

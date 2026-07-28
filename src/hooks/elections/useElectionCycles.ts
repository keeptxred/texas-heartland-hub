import { useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionCycleListQuery } from "@/types/elections";

export function useElectionCycles(query?: ElectionCycleListQuery) {
  const { cycles } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: electionQueryKeys.cycles.list(query),
    queryFn: () => cycles.list(query),
    staleTime: electionQueryStaleTimes.cycles,
  });

  return {
    ...result,
    isEmpty: result.isSuccess && result.data.items.length === 0,
  };
}

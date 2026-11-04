import { useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";

export function useActiveElectionCycle(stateCode = "TX", options?: { enabled?: boolean }) {
  const { cycles } = useElectionRepositories();

  return useQuery({
    ...electionQueryDefaults,
    queryKey: electionQueryKeys.cycles.active(stateCode),
    queryFn: () => cycles.findActive(stateCode),
    enabled: options?.enabled ?? true,
    staleTime: electionQueryStaleTimes.cycles,
  });
}

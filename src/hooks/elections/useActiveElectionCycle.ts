import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export function useActiveElectionCycle(stateCode = "TX") {
  const { cycles } = useElectionRepositories();

  const query = useQuery({
    queryKey: [...electionQueryKeys.cycles.active(), stateCode],
    queryFn: () => cycles.findActive(stateCode),
    ...ELECTION_QUERY_DEFAULTS.staticReference,
  });

  return {
    ...query,
    cycle: query.data ?? null,
    isMissing: query.isSuccess && query.data === null,
  };
}

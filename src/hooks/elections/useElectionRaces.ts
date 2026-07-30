import { useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { RaceListQuery } from "@/types/elections";

export function useElectionRaces(query?: RaceListQuery) {
  const { races } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: electionQueryKeys.races.list(query),
    queryFn: () => races.list(query),
    staleTime: electionQueryStaleTimes.races,
  });

  return {
    ...result,
    isEmpty: result.isSuccess && result.data.items.length === 0,
  };
}

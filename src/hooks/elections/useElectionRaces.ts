import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { RaceListQuery } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export function useElectionRaces(query?: RaceListQuery) {
  const { races } = useElectionRepositories();

  const result = useQuery({
    queryKey: electionQueryKeys.races.list(query),
    queryFn: () => races.list(query),
    ...ELECTION_QUERY_DEFAULTS.public,
  });

  return {
    ...result,
    races: result.data?.items ?? [],
    totalItems: result.data?.totalItems ?? 0,
    isEmpty: result.isSuccess && (result.data?.items.length ?? 0) === 0,
  };
}

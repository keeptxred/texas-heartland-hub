import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { ElectionResultListQuery } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export function useElectionResults(query?: ElectionResultListQuery) {
  const { results } = useElectionRepositories();

  const result = useQuery({
    queryKey: electionQueryKeys.results.list(query),
    queryFn: () => results.list(query),
    ...ELECTION_QUERY_DEFAULTS.public,
  });

  const records = result.data?.items ?? [];

  return {
    ...result,
    results: records,
    totalItems: result.data?.totalItems ?? 0,
    isEmpty: result.isSuccess && records.length === 0,
  };
}

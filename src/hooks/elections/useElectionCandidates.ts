import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { CandidateListQuery } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export function useElectionCandidates(query?: CandidateListQuery) {
  const { candidates } = useElectionRepositories();

  const result = useQuery({
    queryKey: electionQueryKeys.candidates.list(query),
    queryFn: () => candidates.list(query),
    ...ELECTION_QUERY_DEFAULTS.public,
  });

  return {
    ...result,
    candidates: result.data?.items ?? [],
    totalItems: result.data?.totalItems ?? 0,
    isEmpty: result.isSuccess && (result.data?.items.length ?? 0) === 0,
  };
}

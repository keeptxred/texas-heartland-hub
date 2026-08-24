import { useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { CandidateListQuery } from "@/types/elections";

type ElectionCandidateListData = Awaited<
  ReturnType<ReturnType<typeof useElectionRepositories>["candidates"]["list"]>
>;

export function useElectionCandidates(
  query?: CandidateListQuery,
  initialData?: ElectionCandidateListData,
) {
  const { candidates } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: electionQueryKeys.candidates.list(query),
    queryFn: () => candidates.list(query),
    staleTime: electionQueryStaleTimes.candidates,
    initialData,
  });

  return {
    ...result,
    isEmpty: result.isSuccess && result.data.items.length === 0,
  };
}

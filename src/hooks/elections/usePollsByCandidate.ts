import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { CandidateId } from "@/types/elections";

export function usePollsByCandidate(candidateId?: CandidateId) {
  const { polls } = useElectionRepositories();
  const query = candidateId
    ? {
        filters: {
          candidateIds: [candidateId],
          publicationStatuses: ["published"] as const,
        },
        pagination: { page: 1, pageSize: 20 },
        sort: [{ field: "field_end_date", direction: "desc" }] as const,
      }
    : undefined;
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: query
      ? electionQueryKeys.polls.list(query)
      : [...electionQueryKeys.polls.all(), "candidate", "disabled"],
    queryFn: query ? () => polls.list(query) : skipToken,
    staleTime: electionQueryStaleTimes.polls,
  });

  return {
    ...result,
    isEmpty: Boolean(candidateId) && result.isSuccess && result.data.items.length === 0,
  };
}

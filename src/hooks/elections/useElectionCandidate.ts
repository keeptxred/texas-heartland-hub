import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { CandidateLookup } from "@/types/elections";

export function useElectionCandidate(lookup?: CandidateLookup) {
  const { candidates } = useElectionRepositories();
  const id = lookup?.id;
  const slug = lookup?.slug;
  const identifier = id ?? slug;
  const queryKey = id
    ? electionQueryKeys.candidates.detailById(id)
    : slug
      ? electionQueryKeys.candidates.detailBySlug(slug, lookup.electionCycleId)
      : [...electionQueryKeys.candidates.details(), "disabled"];
  const queryFn = id
    ? () => candidates.findDetailById(id)
    : slug
      ? () => candidates.findDetailBySlug(slug, lookup.electionCycleId)
      : skipToken;
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey,
    queryFn,
    staleTime: electionQueryStaleTimes.candidates,
  });

  return {
    ...result,
    isMissing: Boolean(identifier) && result.isSuccess && result.data === null,
  };
}

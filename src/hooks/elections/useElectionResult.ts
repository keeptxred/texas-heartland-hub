import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionResultLookup } from "@/types/elections";

export function useElectionResult(lookup?: ElectionResultLookup) {
  const { results } = useElectionRepositories();
  const id = lookup?.id;
  const slug = lookup?.slug;
  const identifier = id ?? slug;
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: id
      ? electionQueryKeys.results.detail(id)
      : slug
        ? electionQueryKeys.results.detailBySlug(slug, lookup.electionCycleId)
        : [...electionQueryKeys.results.details(), "disabled"],
    queryFn: id
      ? () => results.findDetailById(id)
      : slug
        ? () => results.findDetailBySlug(slug, lookup.electionCycleId)
        : skipToken,
    staleTime: electionQueryStaleTimes.results,
  });

  return {
    ...result,
    isMissing: Boolean(identifier) && result.isSuccess && result.data === null,
  };
}

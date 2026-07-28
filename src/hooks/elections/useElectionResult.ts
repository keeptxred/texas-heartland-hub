import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
  getElectionResultRefetchInterval,
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
    refetchInterval: (currentQuery) => {
      const data = currentQuery.state.data;
      if (!data || data.certificationStatus === "certified" || data.status === "certified") {
        return false;
      }
      if (data.reportingStatus === "partial") {
        return getElectionResultRefetchInterval("reporting");
      }
      if (data.reportingStatus === "substantially_complete") {
        return getElectionResultRefetchInterval("nearly_complete");
      }
      return false;
    },
    staleTime: electionQueryStaleTimes.results,
  });

  return {
    ...result,
    isMissing: Boolean(identifier) && result.isSuccess && result.data === null,
  };
}

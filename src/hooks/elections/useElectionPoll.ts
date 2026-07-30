import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionPollLookup } from "@/types/elections";

export function useElectionPoll(lookup?: ElectionPollLookup) {
  const { polls } = useElectionRepositories();
  const id = lookup?.id;
  const slug = lookup?.slug;
  const identifier = id ?? slug;
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: id
      ? electionQueryKeys.polls.detail(id)
      : slug
        ? electionQueryKeys.polls.detailBySlug(slug, lookup.electionCycleId)
        : [...electionQueryKeys.polls.details(), "disabled"],
    queryFn: id
      ? () => polls.findDetailById(id)
      : slug
        ? () => polls.findDetailBySlug(slug, lookup.electionCycleId)
        : skipToken,
    staleTime: electionQueryStaleTimes.polls,
  });

  return {
    ...result,
    isMissing: Boolean(identifier) && result.isSuccess && result.data === null,
  };
}

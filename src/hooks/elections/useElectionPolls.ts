import { useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionPollListQuery } from "@/types/elections";

export function useElectionPolls(query?: ElectionPollListQuery) {
  const { polls } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: electionQueryKeys.polls.list(query),
    queryFn: () => polls.list(query),
    staleTime: electionQueryStaleTimes.polls,
  });
  const stalePollCount =
    result.data?.items.reduce(
      (count, poll) =>
        count + Number(poll.freshnessStatus === "stale" || poll.freshnessStatus === "expired"),
      0,
    ) ?? 0;

  return {
    ...result,
    stalePollCount,
    hasStaleData: stalePollCount > 0,
    isEmpty: result.isSuccess && result.data.items.length === 0,
  };
}

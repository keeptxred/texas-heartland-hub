import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { ElectionPollListQuery } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export function useElectionPolls(query?: ElectionPollListQuery) {
  const { polls } = useElectionRepositories();

  const result = useQuery({
    queryKey: electionQueryKeys.polls.list(query),
    queryFn: () => polls.list(query),
    ...ELECTION_QUERY_DEFAULTS.polls,
  });

  const records = result.data?.items ?? [];

  return {
    ...result,
    polls: records,
    totalItems: result.data?.totalItems ?? 0,
    stalePollCount: records.filter((poll) =>
      ["stale", "expired"].includes(poll.freshnessStatus),
    ).length,
    hasStaleData: records.some((poll) =>
      ["stale", "expired"].includes(poll.freshnessStatus),
    ),
    isEmpty: result.isSuccess && records.length === 0,
  };
}

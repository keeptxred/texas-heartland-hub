import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { ElectionCycleId, RaceId } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export interface LatestElectionPollOptions {
  electionCycleId?: ElectionCycleId;
  featuredRaceIds?: readonly RaceId[];
  limit?: number;
}

export function useLatestElectionPolls(options: LatestElectionPollOptions = {}) {
  const { electionCycleId, featuredRaceIds = [], limit = 6 } = options;
  const { polls } = useElectionRepositories();

  const result = useQuery({
    queryKey: electionCycleId
      ? electionQueryKeys.polls.latest(electionCycleId, limit)
      : [...electionQueryKeys.polls.all(), "latest", "disabled", limit],
    queryFn: async () => {
      if (!electionCycleId) return [];

      const page = await polls.list({
        filters: {
          electionCycleIds: [electionCycleId],
          raceIds: featuredRaceIds.length ? featuredRaceIds : undefined,
          publicationStatuses: ["published"],
          verificationStatuses: ["verified"],
        },
        pagination: { page: 1, pageSize: limit },
        sort: [{ field: "field_end_date", direction: "desc" }],
      });

      return page.items.slice(0, limit);
    },
    enabled: Boolean(electionCycleId),
    ...ELECTION_QUERY_DEFAULTS.polls,
  });

  const records = result.data ?? [];

  return {
    ...result,
    polls: records,
    hasStaleData: records.some((poll) =>
      ["stale", "expired"].includes(poll.freshnessStatus),
    ),
    isEmpty: result.isSuccess && records.length === 0,
  };
}

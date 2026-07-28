import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionCycleId } from "@/types/elections";

const DEFAULT_LATEST_POLL_LIMIT = 6;

export function useLatestElectionPolls(
  electionCycleId?: ElectionCycleId,
  limit = DEFAULT_LATEST_POLL_LIMIT,
) {
  const { polls, races } = useElectionRepositories();
  const resultLimit = Math.max(0, Math.floor(limit));
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: electionCycleId
      ? electionQueryKeys.polls.latest(electionCycleId, resultLimit)
      : [...electionQueryKeys.polls.all(), "latest", "disabled", resultLimit],
    queryFn: electionCycleId
      ? async () => {
          if (resultLimit === 0) return [];

          const featuredRaces = await races.listFeatured(electionCycleId);
          if (featuredRaces.length === 0) return [];

          const page = await polls.list({
            filters: {
              electionCycleIds: [electionCycleId],
              raceIds: featuredRaces.map((race) => race.id),
              statuses: ["published", "revised"],
              publicationStatuses: ["published"],
              verificationStatuses: ["unverified", "pending_review", "verified", "needs_update"],
            },
            pagination: {
              page: 1,
              pageSize: resultLimit,
            },
            sort: [
              { field: "field_end_date", direction: "desc" },
              { field: "release_date", direction: "desc" },
            ],
          });

          return page.items.filter((poll) => poll.primaryQuestion !== null).slice(0, resultLimit);
        }
      : skipToken,
    staleTime: electionQueryStaleTimes.polls,
  });

  return {
    ...result,
    isEmpty: result.isSuccess && result.data.length === 0,
  };
}

import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type {
  ElectionPollListQuery,
  ElectionPollSummary,
  RaceId,
  RacePage,
} from "@/types/elections";

type PollsByRaceQuery = Omit<ElectionPollListQuery, "filters">;

function sortPollPageNewestFirst(
  page: RacePage<ElectionPollSummary>,
): RacePage<ElectionPollSummary> {
  const items = page.items
    .map((poll, index) => ({ poll, index }))
    .sort(
      (left, right) =>
        right.poll.fieldEndDate.localeCompare(left.poll.fieldEndDate) ||
        (right.poll.releaseDate ?? "").localeCompare(left.poll.releaseDate ?? "") ||
        left.poll.id.localeCompare(right.poll.id) ||
        left.index - right.index,
    )
    .map(({ poll }) => poll);

  return { ...page, items };
}

export function usePollsByRace(raceId?: RaceId, query?: PollsByRaceQuery) {
  const { polls } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: raceId
      ? electionQueryKeys.polls.byRace(raceId, query)
      : [...electionQueryKeys.polls.all(), "race", "disabled", query ?? {}],
    queryFn: raceId ? () => polls.listByRace(raceId, query) : skipToken,
    select: sortPollPageNewestFirst,
    staleTime: electionQueryStaleTimes.polls,
  });
  const stalePollIds =
    result.data?.items
      .filter((poll) => poll.freshnessStatus === "stale" || poll.freshnessStatus === "expired")
      .map((poll) => poll.id) ?? [];

  return {
    ...result,
    stalePollIds,
    stalePollCount: stalePollIds.length,
    hasStaleData: stalePollIds.length > 0,
    isEmpty: result.isSuccess && result.data.items.length === 0,
  };
}

import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { RaceId } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export function usePollsByRace(raceId: RaceId | undefined) {
  const { polls } = useElectionRepositories();

  const result = useQuery({
    queryKey: raceId
      ? electionQueryKeys.polls.byRace(raceId)
      : [...electionQueryKeys.polls.all(), "race", "disabled"],
    queryFn: async () => {
      if (!raceId) return [];
      const page = await polls.listByRace(raceId, {
        sort: [{ field: "field_end_date", direction: "desc" }],
      });
      return [...page.items].sort((a, b) =>
        b.fieldEndDate.localeCompare(a.fieldEndDate),
      );
    },
    enabled: Boolean(raceId),
    ...ELECTION_QUERY_DEFAULTS.polls,
  });

  const records = result.data ?? [];

  return {
    ...result,
    polls: records,
    stalePolls: records.filter((poll) =>
      ["stale", "expired"].includes(poll.freshnessStatus),
    ),
    hasStaleData: records.some((poll) =>
      ["stale", "expired"].includes(poll.freshnessStatus),
    ),
    isEmpty: result.isSuccess && records.length === 0,
  };
}

import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { ElectionCycleId, RaceRating, RaceSummary } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

const RATING_PRIORITY: Record<RaceRating, number> = {
  toss_up: 0,
  leans_republican: 1,
  leans_democratic: 1,
  likely_republican: 2,
  likely_democratic: 2,
  safe_republican: 3,
  safe_democratic: 3,
  unrated: 4,
};

function compareFeaturedRaces(a: RaceSummary, b: RaceSummary): number {
  if (a.competitive !== b.competitive) return a.competitive ? -1 : 1;

  const ratingDifference = RATING_PRIORITY[a.rating] - RATING_PRIORITY[b.rating];
  if (ratingDifference !== 0) return ratingDifference;

  const dateDifference = a.electionDate.localeCompare(b.electionDate);
  if (dateDifference !== 0) return dateDifference;

  return a.name.localeCompare(b.name);
}

export function useFeaturedElectionRaces(
  electionCycleId: ElectionCycleId | undefined,
  limit?: number,
) {
  const { races } = useElectionRepositories();

  const result = useQuery({
    queryKey: electionCycleId
      ? electionQueryKeys.races.featured(electionCycleId, limit)
      : [...electionQueryKeys.races.all(), "featured", "disabled"],
    queryFn: async () => {
      if (!electionCycleId) return [];
      const featured = await races.listFeatured(electionCycleId, limit);
      return [...featured].sort(compareFeaturedRaces);
    },
    enabled: Boolean(electionCycleId),
    ...ELECTION_QUERY_DEFAULTS.public,
  });

  return {
    ...result,
    races: result.data ?? [],
    isEmpty: result.isSuccess && (result.data?.length ?? 0) === 0,
  };
}

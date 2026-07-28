import { skipToken, useQuery } from "@tanstack/react-query";
import { ELECTION_CENTRAL_CONFIG } from "@/lib/elections/config";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionCycleId, ElectionForecastSummary, ForecastRating } from "@/types/elections";

const COMPETITIVENESS_ORDER: Record<ForecastRating, number> = {
  toss_up: 0,
  leans_republican: 1,
  leans_democratic: 1,
  likely_republican: 2,
  likely_democratic: 2,
  safe_republican: 3,
  safe_democratic: 3,
  safe_other: 3,
  unrated: 4,
};

function sortByCompetitiveness(forecasts: readonly ElectionForecastSummary[]) {
  return [...forecasts].sort(
    (left, right) =>
      COMPETITIVENESS_ORDER[left.rating] - COMPETITIVENESS_ORDER[right.rating] ||
      left.race.electionDate.localeCompare(right.race.electionDate) ||
      left.race.name.localeCompare(right.race.name) ||
      left.id.localeCompare(right.id),
  );
}

export function useFeaturedForecasts(
  electionCycleId?: ElectionCycleId,
  limit: number = ELECTION_CENTRAL_CONFIG.display.defaultRaceLimit,
) {
  const { forecasts, races } = useElectionRepositories();
  const resultLimit = Math.max(0, Math.floor(limit));
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: electionCycleId
      ? electionQueryKeys.forecasts.featured(electionCycleId, resultLimit)
      : [...electionQueryKeys.forecasts.all(), "featured", "disabled", resultLimit],
    queryFn: electionCycleId
      ? async () => {
          if (resultLimit === 0) return [];

          const featuredRaces = await races.listFeatured(electionCycleId);
          if (featuredRaces.length === 0) return [];

          const page = await forecasts.list({
            filters: {
              electionCycleIds: [electionCycleId],
              raceIds: featuredRaces.map((race) => race.id),
              statuses: ["active", "final"],
              publicationStatuses: ["published"],
            },
          });

          return sortByCompetitiveness(page.items).slice(0, resultLimit);
        }
      : skipToken,
    staleTime: electionQueryStaleTimes.forecasts,
  });

  return {
    ...result,
    isEmpty: result.isSuccess && result.data.length === 0,
  };
}

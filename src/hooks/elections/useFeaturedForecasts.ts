import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { ElectionCycleId, RaceId } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export interface FeaturedForecastOptions {
  electionCycleId?: ElectionCycleId;
  featuredRaceIds?: readonly RaceId[];
  limit?: number;
}

export function useFeaturedForecasts(options: FeaturedForecastOptions = {}) {
  const { electionCycleId, featuredRaceIds = [], limit = 6 } = options;
  const { forecasts } = useElectionRepositories();

  const result = useQuery({
    queryKey: electionCycleId
      ? electionQueryKeys.forecasts.featured(electionCycleId)
      : [...electionQueryKeys.forecasts.all(), "featured", "disabled"],
    queryFn: async () => {
      if (!electionCycleId) return [];

      const page = await forecasts.list({
        filters: {
          electionCycleIds: [electionCycleId],
          raceIds: featuredRaceIds.length ? featuredRaceIds : undefined,
          publicationStatuses: ["published"],
          verificationStatuses: ["verified"],
          active: true,
        },
        pagination: { page: 1, pageSize: limit },
        sort: [{ field: "updated_at", direction: "desc" }],
      });

      return [...page.items]
        .sort((a, b) => {
          const aMargin = Math.abs(a.projectedMargin ?? Number.POSITIVE_INFINITY);
          const bMargin = Math.abs(b.projectedMargin ?? Number.POSITIVE_INFINITY);
          if (aMargin !== bMargin) return aMargin - bMargin;
          return a.race.name.localeCompare(b.race.name);
        })
        .slice(0, limit);
    },
    enabled: Boolean(electionCycleId),
    ...ELECTION_QUERY_DEFAULTS.forecasts,
  });

  return {
    ...result,
    forecasts: result.data ?? [],
    isEmpty: result.isSuccess && (result.data?.length ?? 0) === 0,
  };
}

import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import { isElectionDataStale } from "@/lib/elections/config";
import type { ElectionForecastListQuery } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export function useElectionForecasts(query?: ElectionForecastListQuery) {
  const { forecasts } = useElectionRepositories();

  const result = useQuery({
    queryKey: electionQueryKeys.forecasts.list(query),
    queryFn: () => forecasts.list(query),
    ...ELECTION_QUERY_DEFAULTS.forecasts,
  });

  const records = result.data?.items ?? [];

  return {
    ...result,
    forecasts: records,
    totalItems: result.data?.totalItems ?? 0,
    staleForecastCount: records.filter((forecast) =>
      isElectionDataStale("forecasts", forecast.updatedAt),
    ).length,
    hasStaleData: records.some((forecast) =>
      isElectionDataStale("forecasts", forecast.updatedAt),
    ),
    isEmpty: result.isSuccess && records.length === 0,
  };
}

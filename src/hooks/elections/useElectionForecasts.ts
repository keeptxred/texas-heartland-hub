import { useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionForecastListQuery } from "@/types/elections";

export function useElectionForecasts(query?: ElectionForecastListQuery) {
  const { forecasts } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: electionQueryKeys.forecasts.list(query),
    queryFn: () => forecasts.list(query),
    staleTime: electionQueryStaleTimes.forecasts,
  });
  const staleForecastCount =
    result.data?.items.reduce(
      (count, forecast) =>
        count +
        Number(forecast.freshnessStatus === "stale" || forecast.freshnessStatus === "expired"),
      0,
    ) ?? 0;

  return {
    ...result,
    staleForecastCount,
    hasStaleData: staleForecastCount > 0,
    isEmpty: result.isSuccess && result.data.items.length === 0,
  };
}

import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ForecastId } from "@/types/elections";

export function useElectionForecast(forecastId?: ForecastId) {
  const { forecasts } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: forecastId
      ? electionQueryKeys.forecasts.detail(forecastId)
      : [...electionQueryKeys.forecasts.details(), "disabled"],
    queryFn: forecastId ? () => forecasts.findDetailById(forecastId) : skipToken,
    staleTime: electionQueryStaleTimes.forecasts,
  });

  return {
    ...result,
    isMissing: Boolean(forecastId) && result.isSuccess && result.data === null,
  };
}

import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionForecastLookup } from "@/types/elections";

export function useElectionForecast(lookup?: ElectionForecastLookup) {
  const { forecasts } = useElectionRepositories();
  const id = lookup?.id;
  const slug = lookup?.slug;
  const identifier = id ?? slug;
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: id
      ? electionQueryKeys.forecasts.detail(id)
      : slug
        ? electionQueryKeys.forecasts.detailBySlug(slug, lookup.electionCycleId)
        : [...electionQueryKeys.forecasts.details(), "disabled"],
    queryFn: id
      ? () => forecasts.findDetailById(id)
      : slug
        ? () => forecasts.findDetailBySlug(slug, lookup.electionCycleId)
        : skipToken,
    staleTime: electionQueryStaleTimes.forecasts,
  });

  return {
    ...result,
    isMissing: Boolean(identifier) && result.isSuccess && result.data === null,
  };
}

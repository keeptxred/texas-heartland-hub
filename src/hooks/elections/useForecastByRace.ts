import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { RaceId } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export function useForecastByRace(
  raceId: RaceId | undefined,
  primarySourceName?: string,
) {
  const { forecasts } = useElectionRepositories();

  const result = useQuery({
    queryKey: raceId
      ? electionQueryKeys.forecasts.byRace(raceId, primarySourceName)
      : [...electionQueryKeys.forecasts.all(), "race", "disabled"],
    queryFn: async () => {
      if (!raceId) return null;
      return forecasts.findDetailByRaceId(raceId);
    },
    enabled: Boolean(raceId),
    ...ELECTION_QUERY_DEFAULTS.forecasts,
  });

  const forecast = result.data ?? null;

  return {
    ...result,
    forecast,
    isMissing: result.isSuccess && forecast === null,
    preferredSourceMatched:
      !primarySourceName ||
      forecast?.source.sourceName.toLowerCase() === primarySourceName.toLowerCase(),
  };
}

import { skipToken, useQuery } from "@tanstack/react-query";
import { ELECTION_CENTRAL_CONFIG } from "@/lib/elections/config";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionForecastSummary, RaceId } from "@/types/elections";

function selectLatestForecast(
  forecasts: readonly ElectionForecastSummary[],
  primarySourceId: string | null,
) {
  const sorted = [...forecasts].sort(
    (left, right) =>
      right.updatedAt.localeCompare(left.updatedAt) || left.id.localeCompare(right.id),
  );

  return (
    (primarySourceId
      ? sorted.find((forecast) => forecast.sourceId === primarySourceId)
      : undefined) ??
    sorted[0] ??
    null
  );
}

export function useForecastByRace(
  raceId?: RaceId,
  primarySourceId = ELECTION_CENTRAL_CONFIG.forecasts.primarySourceId,
) {
  const { forecasts } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: raceId
      ? [...electionQueryKeys.forecasts.byRace(raceId), primarySourceId]
      : [...electionQueryKeys.forecasts.all(), "race", "disabled", primarySourceId],
    queryFn: raceId
      ? async () => {
          const page = await forecasts.list({
            filters: {
              raceIds: [raceId],
              statuses: ["active", "final"],
              publicationStatuses: ["published"],
            },
            sort: [{ field: "updated_at", direction: "desc" }],
          });

          return selectLatestForecast(page.items, primarySourceId);
        }
      : skipToken,
    staleTime: electionQueryStaleTimes.forecasts,
  });

  return {
    ...result,
    isMissing: Boolean(raceId) && result.isSuccess && result.data === null,
  };
}

import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionCycleId } from "@/types/elections";

export function useElectionSummaryMetrics(electionCycleId?: ElectionCycleId) {
  const { candidates, forecasts, polls, races, results } = useElectionRepositories();

  return useQuery({
    ...electionQueryDefaults,
    queryKey: [...electionQueryKeys.all, "summary-metrics", electionCycleId ?? "disabled"],
    queryFn: electionCycleId
      ? async () => {
          const [raceCount, candidateCount, pollCount, forecastCount, resultCount] =
            await Promise.all([
              races.count({ electionCycleIds: [electionCycleId] }),
              candidates.count({ electionCycleIds: [electionCycleId] }),
              polls.count({ electionCycleIds: [electionCycleId] }),
              forecasts.count({ electionCycleIds: [electionCycleId] }),
              results.count({ electionCycleIds: [electionCycleId] }),
            ]);

          return {
            raceCount,
            candidateCount,
            pollCount,
            forecastCount,
            resultCount,
          };
        }
      : skipToken,
    staleTime: Math.min(electionQueryStaleTimes.races, electionQueryStaleTimes.results),
  });
}

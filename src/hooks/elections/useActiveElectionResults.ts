import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import { ELECTION_CENTRAL_CONFIG } from "@/lib/elections/config";
import type { ElectionCycleId, ElectionResultSummary } from "@/types/elections";
import { electionQueryKeys } from "./queryKeys";

function shouldKeepRefreshing(records: readonly ElectionResultSummary[]): boolean {
  return records.some(
    (record) =>
      record.certificationStatus !== "certified" &&
      !["complete", "not_reporting"].includes(record.reportingStatus),
  );
}

export function useActiveElectionResults(
  electionCycleId: ElectionCycleId | undefined,
  limit = 12,
) {
  const { results } = useElectionRepositories();

  const query = useQuery({
    queryKey: electionQueryKeys.results.active(electionCycleId),
    queryFn: async () => {
      if (!electionCycleId) return [];
      return results.listLive(electionCycleId, limit);
    },
    enabled: Boolean(electionCycleId),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    refetchInterval: (state) => {
      const records = state.state.data ?? [];
      if (!records.length || !shouldKeepRefreshing(records)) return false;
      return ELECTION_CENTRAL_CONFIG.refresh.liveResultsMs;
    },
    refetchIntervalInBackground: false,
  });

  const records = query.data ?? [];

  return {
    ...query,
    results: records,
    isActivelyRefreshing: shouldKeepRefreshing(records),
    isEmpty: query.isSuccess && records.length === 0,
  };
}

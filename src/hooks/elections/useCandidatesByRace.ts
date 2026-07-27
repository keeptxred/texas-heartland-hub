import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { CandidateSummary, RaceId } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

const STATUS_ORDER: Record<CandidateSummary["status"], number> = {
  active: 0,
  write_in: 1,
  withdrawn: 2,
  disqualified: 3,
};

function compareCandidates(a: CandidateSummary, b: CandidateSummary): number {
  const statusDifference = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  if (statusDifference !== 0) return statusDifference;

  if (a.incumbencyType !== b.incumbencyType) {
    if (a.incumbencyType === "incumbent") return -1;
    if (b.incumbencyType === "incumbent") return 1;
  }

  return a.ballotName.localeCompare(b.ballotName);
}

export function useCandidatesByRace(raceId: RaceId | undefined) {
  const { candidates } = useElectionRepositories();

  const result = useQuery({
    queryKey: raceId
      ? electionQueryKeys.candidates.byRace(raceId)
      : [...electionQueryKeys.candidates.all(), "race", "disabled"],
    queryFn: async () => {
      if (!raceId) return [];
      const records = await candidates.listByRace(raceId);
      return [...records].sort(compareCandidates);
    },
    enabled: Boolean(raceId),
    ...ELECTION_QUERY_DEFAULTS.public,
  });

  const records = result.data ?? [];

  return {
    ...result,
    candidates: records,
    activeCandidates: records.filter(
      (candidate) =>
        candidate.status !== "withdrawn" && candidate.status !== "disqualified",
    ),
    withdrawnCandidates: records.filter(
      (candidate) => candidate.status === "withdrawn",
    ),
    isEmpty: result.isSuccess && records.length === 0,
  };
}

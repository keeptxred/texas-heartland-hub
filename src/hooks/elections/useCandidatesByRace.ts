import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { CandidateSummary, RaceId } from "@/types/elections";

function sortCandidates(candidates: readonly CandidateSummary[]) {
  return candidates
    .map((candidate, index) => ({ candidate, index }))
    .sort(
      (left, right) =>
        Number(left.candidate.status === "withdrawn") -
          Number(right.candidate.status === "withdrawn") ||
        left.candidate.ballotName.localeCompare(right.candidate.ballotName) ||
        left.candidate.id.localeCompare(right.candidate.id) ||
        left.index - right.index,
    )
    .map(({ candidate }) => candidate);
}

export function useCandidatesByRace(raceId?: RaceId) {
  const { candidates } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: raceId
      ? electionQueryKeys.candidates.byRace(raceId)
      : [...electionQueryKeys.candidates.all(), "race", "disabled"],
    queryFn: raceId ? () => candidates.listByRace(raceId) : skipToken,
    select: sortCandidates,
    staleTime: electionQueryStaleTimes.candidates,
  });

  return {
    ...result,
    isEmpty: result.isSuccess && result.data.length === 0,
  };
}

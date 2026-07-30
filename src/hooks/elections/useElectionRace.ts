import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { RaceLookup } from "@/types/elections";

export function useElectionRace(lookup?: RaceLookup) {
  const { races } = useElectionRepositories();
  const id = lookup?.id;
  const slug = lookup?.slug;
  const identifier = id ?? slug;
  const queryKey = id
    ? electionQueryKeys.races.detailById(id)
    : slug
      ? electionQueryKeys.races.detailBySlug(slug, lookup.electionCycleId)
      : [...electionQueryKeys.races.details(), "disabled"];
  const queryFn = id
    ? () => races.findDetailById(id)
    : slug
      ? () => races.findDetailBySlug(slug, lookup.electionCycleId)
      : skipToken;
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey,
    queryFn,
    staleTime: electionQueryStaleTimes.races,
  });

  return {
    ...result,
    isMissing: Boolean(identifier) && result.isSuccess && result.data === null,
  };
}

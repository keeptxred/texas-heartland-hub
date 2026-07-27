import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type { ElectionCycleId, RaceId, RaceSlug } from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export interface ElectionRaceIdentifier {
  id?: RaceId;
  slug?: RaceSlug;
  electionCycleId?: ElectionCycleId;
}

export function useElectionRace(identifier: ElectionRaceIdentifier) {
  const { races } = useElectionRepositories();
  const queryIdentifier = identifier.id ?? identifier.slug;

  const result = useQuery({
    queryKey: electionQueryKeys.races.detail(queryIdentifier ?? "disabled" as RaceSlug),
    queryFn: async () => {
      if (identifier.id) return races.findDetailById(identifier.id);
      if (identifier.slug) {
        return races.findDetailBySlug(identifier.slug, identifier.electionCycleId);
      }
      return null;
    },
    enabled: Boolean(queryIdentifier),
    ...ELECTION_QUERY_DEFAULTS.public,
  });

  return {
    ...result,
    race: result.data ?? null,
    isMissing: result.isSuccess && result.data === null,
  };
}

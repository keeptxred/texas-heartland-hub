import { useQuery } from "@tanstack/react-query";
import { useElectionRepositories } from "@/data/elections";
import type {
  CandidateId,
  CandidateSlug,
  ElectionCycleId,
} from "@/types/elections";
import { ELECTION_QUERY_DEFAULTS } from "./queryDefaults";
import { electionQueryKeys } from "./queryKeys";

export interface ElectionCandidateIdentifier {
  id?: CandidateId;
  slug?: CandidateSlug;
  electionCycleId?: ElectionCycleId;
}

export function useElectionCandidate(identifier: ElectionCandidateIdentifier) {
  const { candidates } = useElectionRepositories();
  const queryIdentifier = identifier.id ?? identifier.slug;

  const result = useQuery({
    queryKey: electionQueryKeys.candidates.detail(
      queryIdentifier ?? ("disabled" as CandidateSlug),
    ),
    queryFn: async () => {
      if (identifier.id) return candidates.findDetailById(identifier.id);
      if (identifier.slug) {
        return candidates.findDetailBySlug(
          identifier.slug,
          identifier.electionCycleId,
        );
      }
      return null;
    },
    enabled: Boolean(queryIdentifier),
    ...ELECTION_QUERY_DEFAULTS.public,
  });

  return {
    ...result,
    candidate: result.data ?? null,
    isMissing: result.isSuccess && result.data === null,
  };
}

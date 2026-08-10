import type { ElectionCandidate } from '@/types/elections/candidate';
import type { ElectionRace } from '@/types/elections/race';
import { candidateToAuthorityEntity } from '@/lib/candidate-authority';
import { raceToAuthorityEntity } from '@/lib/race-authority';
import {
  createAuthorityEntityRegistry,
  type AuthorityEntityRegistry,
} from '@/lib/authority-entity-registry';

export type ElectionAuthorityRegistryInput = {
  candidates: readonly ElectionCandidate[];
  races: readonly ElectionRace[];
  districtSlugById?: ReadonlyMap<string, string>;
};

export type ElectionAuthorityRegistryDiagnostics = {
  unresolvedCandidateRaceIds: readonly string[];
  unresolvedRaceCandidateIds: readonly string[];
  unresolvedRaceDistrictIds: readonly string[];
};

export type ElectionAuthorityRegistry = {
  registry: AuthorityEntityRegistry;
  diagnostics: ElectionAuthorityRegistryDiagnostics;
};

/**
 * Builds the dynamic election portion of the authority graph from verified
 * candidate and race records. Public slugs are resolved explicitly; database
 * IDs are never emitted as URL identities.
 */
export function createElectionAuthorityRegistry(
  input: ElectionAuthorityRegistryInput,
): ElectionAuthorityRegistry {
  const raceSlugById = new Map(
    input.races.map((race) => [String(race.id), String(race.slug)]),
  );
  const candidateSlugById = new Map(
    input.candidates.map((candidate) => [candidate.id, String(candidate.slug)]),
  );

  const unresolvedCandidateRaceIds = new Set<string>();
  for (const candidate of input.candidates) {
    for (const raceId of candidate.raceIds) {
      if (!raceSlugById.has(String(raceId))) unresolvedCandidateRaceIds.add(String(raceId));
    }
  }

  const unresolvedRaceCandidateIds = new Set<string>();
  const unresolvedRaceDistrictIds = new Set<string>();
  for (const race of input.races) {
    for (const candidateId of race.candidateIds) {
      if (!candidateSlugById.has(candidateId)) unresolvedRaceCandidateIds.add(String(candidateId));
    }
    if (
      race.districtId &&
      !input.districtSlugById?.has(String(race.districtId))
    ) {
      unresolvedRaceDistrictIds.add(String(race.districtId));
    }
  }

  const candidateEntities = input.candidates.map((candidate) =>
    candidateToAuthorityEntity(candidate, { raceSlugById }),
  );
  const raceEntities = input.races.map((race) =>
    raceToAuthorityEntity(race, {
      candidateSlugById,
      districtSlug: race.districtId
        ? input.districtSlugById?.get(String(race.districtId)) ?? null
        : null,
    }),
  );

  return {
    registry: createAuthorityEntityRegistry([...candidateEntities, ...raceEntities]),
    diagnostics: {
      unresolvedCandidateRaceIds: [...unresolvedCandidateRaceIds].sort(),
      unresolvedRaceCandidateIds: [...unresolvedRaceCandidateIds].sort(),
      unresolvedRaceDistrictIds: [...unresolvedRaceDistrictIds].sort(),
    },
  };
}

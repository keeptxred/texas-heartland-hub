import type { ElectionRace } from '@/types/elections/race';
import type { CandidateId } from '@/types/elections/identifiers';
import {
  ELECTION_TYPE_LABELS,
  RACE_STATUS_LABELS,
} from '@/types/elections/raceClassifications';
import {
  createAuthorityEntityKey,
  type AuthorityEntity,
} from '@/lib/authority-entity';

const inactiveRaceStatuses = new Set(['cancelled', 'certified']);

export type RaceAuthorityRelationshipResolution = {
  candidateSlugById?: ReadonlyMap<CandidateId, string>;
  districtSlug?: string | null;
};

export function raceToAuthorityEntity(
  race: ElectionRace,
  resolution: RaceAuthorityRelationshipResolution = {},
): AuthorityEntity {
  const candidateEntityIds = race.candidateIds
    .map((candidateId) => resolution.candidateSlugById?.get(candidateId) ?? null)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => createAuthorityEntityKey('candidate', slug));

  const relatedEntityIds = [
    ...candidateEntityIds,
    ...(resolution.districtSlug
      ? [createAuthorityEntityKey('district', resolution.districtSlug)]
      : []),
  ];

  return {
    id: createAuthorityEntityKey('race', String(race.slug)),
    entityType: 'race',
    slug: String(race.slug),
    name: race.name,
    active: !inactiveRaceStatuses.has(race.status),
    lastVerified: race.verifiedAt ?? race.lastCheckedAt ?? race.dataAsOf,
    sourceOfTruth: {
      label: race.source.sourceName,
      url: race.source.sourceUrl,
    },
    title: race.officeName,
    subtitle: `${ELECTION_TYPE_LABELS[race.electionType]} · ${RACE_STATUS_LABELS[race.status]}`,
    summary: race.description,
    imageUrl: null,
    relatedEntityIds,
    createdAt: race.createdAt,
    updatedAt: race.updatedAt,
  };
}

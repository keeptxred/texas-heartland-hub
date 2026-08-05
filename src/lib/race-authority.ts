import type { ElectionRace } from '@/types/elections/race';
import {
  ELECTION_TYPE_LABELS,
  RACE_STATUS_LABELS,
} from '@/types/elections/raceClassifications';
import {
  createAuthorityEntityKey,
  type AuthorityEntity,
} from '@/lib/authority-entity';

const inactiveRaceStatuses = new Set(['cancelled', 'certified']);

export function raceToAuthorityEntity(race: ElectionRace): AuthorityEntity {
  const relatedEntityIds = [
    ...race.candidateIds.map((candidateId) =>
      createAuthorityEntityKey('candidate', String(candidateId)),
    ),
    ...(race.districtId
      ? [createAuthorityEntityKey('district', String(race.districtId))]
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

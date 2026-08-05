import type { ElectionCandidate } from '@/types/elections/candidate';
import { CANDIDATE_STATUS_LABELS } from '@/types/elections/candidateClassifications';
import {
  createAuthorityEntityKey,
  type AuthorityEntity,
} from '@/lib/authority-entity';

const inactiveCandidateStatuses = new Set([
  'withdrawn',
  'disqualified',
  'deceased',
  'defeated',
]);

export function candidateToAuthorityEntity(
  candidate: ElectionCandidate,
): AuthorityEntity {
  return {
    id: createAuthorityEntityKey('candidate', String(candidate.slug)),
    entityType: 'candidate',
    slug: String(candidate.slug),
    name: candidate.fullName,
    active: !inactiveCandidateStatuses.has(candidate.status),
    lastVerified:
      candidate.verifiedAt ?? candidate.lastCheckedAt ?? candidate.dataAsOf,
    sourceOfTruth: {
      label: candidate.source.sourceName,
      url: candidate.source.sourceUrl,
    },
    title: candidate.currentOfficeName ?? candidate.partyLabel ?? candidate.party,
    subtitle: `${candidate.partyLabel ?? candidate.party} · ${CANDIDATE_STATUS_LABELS[candidate.status]}`,
    summary: candidate.biography,
    imageUrl: candidate.imageUrl,
    relatedEntityIds: candidate.raceIds.map((raceId) =>
      createAuthorityEntityKey('race', String(raceId)),
    ),
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  };
}

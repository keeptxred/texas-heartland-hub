import {
  TEXAS_LEGISLATIVE_SEATS,
  type TexasLegislativeSeat,
} from '@/data/texas-legislators.generated';
import {
  createAuthorityEntityKey,
  type AuthorityEntity,
} from '@/lib/authority-entity';

const districtSlug = (seat: TexasLegislativeSeat) =>
  `texas-${seat.chamber}-district-${seat.district}`;

export function legislatorSeatToAuthorityEntity(
  seat: TexasLegislativeSeat,
): AuthorityEntity {
  if (seat.vacant || !seat.name || !seat.authority) {
    throw new Error(`Legislative seat ${seat.chamber}-${seat.district} has no active legislator`);
  }

  const chamberLabel = seat.chamber === 'house' ? 'Texas House' : 'Texas Senate';

  return {
    id: createAuthorityEntityKey('legislator', seat.slug),
    entityType: 'legislator',
    slug: seat.slug,
    name: seat.name,
    active: true,
    lastVerified: seat.authority.reviewedAt,
    sourceOfTruth: {
      label: `Official ${chamberLabel} member page`,
      url: seat.website,
    },
    title: `${chamberLabel} District ${seat.district}`,
    subtitle: seat.party ? `${seat.party} · District ${seat.district}` : `District ${seat.district}`,
    summary: seat.authority.biography,
    imageUrl: seat.imageUrl,
    relatedEntityIds: [
      createAuthorityEntityKey('district', districtSlug(seat)),
      ...seat.authority.committees.map((committee) =>
        createAuthorityEntityKey(
          'committee',
          committee
            .replace(/—.*$/, '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
        ),
      ),
    ],
    createdAt: null,
    updatedAt: null,
  };
}

export const LEGISLATOR_AUTHORITY_ENTITIES: AuthorityEntity[] =
  TEXAS_LEGISLATIVE_SEATS.filter(
    (seat) => !seat.vacant && Boolean(seat.name) && Boolean(seat.authority),
  ).map(legislatorSeatToAuthorityEntity);

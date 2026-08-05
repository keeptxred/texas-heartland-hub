import {
  TEXAS_LEGISLATIVE_SEATS,
  type TexasLegislativeSeat,
} from '@/data/texas-legislators.generated';
import {
  createAuthorityEntityKey,
  type AuthorityEntity,
} from '@/lib/authority-entity';

export const legislativeDistrictSlug = (seat: TexasLegislativeSeat) =>
  `texas-${seat.chamber}-district-${seat.district}`;

export function legislativeSeatToDistrictAuthorityEntity(
  seat: TexasLegislativeSeat,
): AuthorityEntity {
  const chamberLabel = seat.chamber === 'house' ? 'Texas House' : 'Texas Senate';
  const slug = legislativeDistrictSlug(seat);
  const reviewedAt = seat.authority?.reviewedAt ?? '2026-07-31';

  return {
    id: createAuthorityEntityKey('district', slug),
    entityType: 'district',
    slug,
    name: `${chamberLabel} District ${seat.district}`,
    active: true,
    lastVerified: reviewedAt,
    sourceOfTruth: {
      label: 'Texas Legislature district and member directory',
      url: seat.website,
    },
    title: `${chamberLabel} District ${seat.district}`,
    subtitle: seat.vacant ? 'Vacant seat' : seat.name,
    summary:
      seat.authority?.districtOverview ??
      `${chamberLabel} District ${seat.district}. Verify current boundaries and representation through the official Texas Legislature directory.`,
    imageUrl: null,
    relatedEntityIds:
      !seat.vacant && seat.name
        ? [createAuthorityEntityKey('legislator', seat.slug)]
        : [],
    createdAt: null,
    updatedAt: null,
  };
}

export const LEGISLATIVE_DISTRICT_AUTHORITY_ENTITIES: AuthorityEntity[] =
  TEXAS_LEGISLATIVE_SEATS.map(legislativeSeatToDistrictAuthorityEntity);

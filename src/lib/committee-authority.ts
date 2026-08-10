import {
  createAuthorityEntityKey,
  type AuthorityEntity,
} from '@/lib/authority-entity';

export type LegislativeCommitteeAuthorityRow = {
  committee_slug: string;
  committee_name: string;
  chamber: string | null;
  description: string | null;
  source_url: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

/** Maps a database-backed legislative committee row into the canonical model. */
export function committeeRowToAuthorityEntity(
  committee: LegislativeCommitteeAuthorityRow,
): AuthorityEntity {
  return {
    id: createAuthorityEntityKey('committee', committee.committee_slug),
    entityType: 'committee',
    slug: committee.committee_slug,
    name: committee.committee_name,
    active: true,
    lastVerified: committee.updated_at ?? null,
    sourceOfTruth: committee.source_url
      ? {
          label: `${committee.committee_name} official source`,
          url: committee.source_url,
        }
      : null,
    title: committee.chamber
      ? `${committee.chamber} committee`
      : 'Texas legislative committee',
    subtitle: null,
    summary: committee.description,
    imageUrl: null,
    relatedEntityIds: [],
    createdAt: committee.created_at ?? null,
    updatedAt: committee.updated_at ?? null,
  };
}

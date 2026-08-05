export const AUTHORITY_ENTITY_TYPES = [
  'statewide-office',
  'legislator',
  'candidate',
  'committee',
  'agency',
  'district',
] as const;

export type AuthorityEntityType = (typeof AUTHORITY_ENTITY_TYPES)[number];

export type AuthoritySourceOfTruth = {
  label: string;
  url: string;
};

/**
 * Canonical identity and verification model shared by future authority pages.
 * Domain-specific data such as bills, elections, memberships, and news remains
 * outside this foundation and should be connected through entity relationships.
 */
export type AuthorityEntity = {
  id: string;
  entityType: AuthorityEntityType;
  slug: string;
  name: string;

  active: boolean;
  lastVerified: string | null;
  sourceOfTruth: AuthoritySourceOfTruth | null;

  title: string | null;
  subtitle: string | null;
  summary: string | null;
  imageUrl: string | null;

  relatedEntityIds: string[];

  createdAt: string | null;
  updatedAt: string | null;
};

export const EXPLORE_ENTITY_STATUSES = [
  "draft",
  "imported",
  "validated",
  "reviewed",
  "published",
  "verified",
  "archived",
] as const;

export const EXPLORE_VISIBILITIES = ["internal", "unlisted", "public"] as const;

export const EXPLORE_ENTITY_TYPE_KEYS = [
  "state",
  "region",
  "county",
  "city",
  "lake",
  "river",
  "state_park",
  "national_park",
  "campground",
  "historic_site",
  "trail",
  "fish",
  "bird",
  "wildflower",
  "tree",
  "animal",
  "business",
  "restaurant",
  "hotel",
  "event",
  "law",
] as const;

export type ExploreEntityStatus = (typeof EXPLORE_ENTITY_STATUSES)[number];
export type ExploreVisibility = (typeof EXPLORE_VISIBILITIES)[number];
export type ExploreEntityTypeKey = (typeof EXPLORE_ENTITY_TYPE_KEYS)[number];

export interface ExploreEntityType {
  id: string;
  key: ExploreEntityTypeKey | string;
  name: string;
  pluralName: string;
  description: string | null;
  iconKey: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExploreEntity {
  id: string;
  entityTypeId: string;
  entityType?: ExploreEntityType;
  name: string;
  slug: string;
  alternateNames: string[];
  shortDescription: string | null;
  longDescription: string | null;
  summary: string | null;
  status: ExploreEntityStatus;
  visibility: ExploreVisibility;
  sourceConfidence: number;
  featured: boolean;
  popularityScore: number;
  version: number;
  ownerUserId: string | null;
  publishedAt: string | null;
  verifiedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExploreCoordinates {
  latitude: number;
  longitude: number;
}

export interface ExploreLocation extends ExploreCoordinates {
  id: string;
  entityId: string;
  locationType: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  county: string | null;
  stateCode: string;
  postalCode: string | null;
  countryCode: string;
  directions: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExploreRelationship {
  id: string;
  relationshipTypeId: string;
  sourceEntityId: string;
  targetEntityId: string;
  weight: number;
  priority: "primary" | "secondary" | "nearby" | "regional" | "suggested";
  metadata: Record<string, unknown>;
  effectiveFrom: string | null;
  effectiveUntil: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExplorePagination {
  page: number;
  pageSize: number;
}

export interface ExplorePaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ExploreEntityFilters {
  type?: ExploreEntityTypeKey | string;
  status?: ExploreEntityStatus;
  visibility?: ExploreVisibility;
  featured?: boolean;
  categorySlugs?: string[];
  tagSlugs?: string[];
  query?: string;
}

export interface ExploreEntityCreateInput {
  entityTypeId: string;
  name: string;
  slug?: string;
  alternateNames?: string[];
  shortDescription?: string | null;
  longDescription?: string | null;
  summary?: string | null;
  status?: ExploreEntityStatus;
  visibility?: ExploreVisibility;
  sourceConfidence?: number;
  featured?: boolean;
  popularityScore?: number;
  ownerUserId?: string | null;
}

export type ExploreEntityUpdateInput = Partial<Omit<ExploreEntityCreateInput, "entityTypeId">> & {
  entityTypeId?: string;
};

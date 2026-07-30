import type { ElectionAuthority, ElectionAuthorityCreateInput, ElectionAuthorityUpdateInput } from "./electionAuthority";
import type { ElectionAuthorityLevel, ElectionAuthorityStatus, ElectionAuthorityType } from "./electionAuthorityClassifications";
import type { CountyElectionAuthorityDirectory, ElectionAuthorityDetail, ElectionAuthoritySummary } from "./electionAuthorityProjections";
import type { CountyId, ElectionAuthorityId, ElectionAuthoritySlug } from "./identifiers";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const ELECTION_AUTHORITY_SORT_FIELDS = ["name", "jurisdiction", "authority_level", "authority_type", "updated_at"] as const;
export type ElectionAuthoritySortField = (typeof ELECTION_AUTHORITY_SORT_FIELDS)[number];

export interface ElectionAuthoritySort {
  field: ElectionAuthoritySortField;
  direction: SortDirection;
}

export interface ElectionAuthorityFilters {
  ids?: readonly ElectionAuthorityId[];
  countyIds?: readonly CountyId[];
  authorityLevels?: readonly ElectionAuthorityLevel[];
  authorityTypes?: readonly ElectionAuthorityType[];
  statuses?: readonly ElectionAuthorityStatus[];
  featured?: boolean;
  verified?: boolean;
  search?: string;
}

export interface ElectionAuthorityListQuery {
  filters?: ElectionAuthorityFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionAuthoritySort[];
}

export interface ElectionAuthorityRepository {
  findById(id: ElectionAuthorityId): Promise<ElectionAuthority | null>;
  findBySlug(slug: ElectionAuthoritySlug): Promise<ElectionAuthority | null>;
  findDetailById(id: ElectionAuthorityId): Promise<ElectionAuthorityDetail | null>;
  list(query?: ElectionAuthorityListQuery): Promise<RacePage<ElectionAuthoritySummary>>;
  listCore(query?: ElectionAuthorityListQuery): Promise<RacePage<ElectionAuthority>>;
  getCountyDirectory(countyId: CountyId): Promise<CountyElectionAuthorityDirectory | null>;
  count(filters?: ElectionAuthorityFilters): Promise<number>;
  create(input: ElectionAuthorityCreateInput): Promise<ElectionAuthority>;
  update(id: ElectionAuthorityId, input: ElectionAuthorityUpdateInput): Promise<ElectionAuthority>;
  delete(id: ElectionAuthorityId): Promise<boolean>;
}

export type ReadonlyElectionAuthorityRepository = Pick<
  ElectionAuthorityRepository,
  "findById" | "findBySlug" | "findDetailById" | "list" | "listCore" | "getCountyDirectory" | "count"
>;

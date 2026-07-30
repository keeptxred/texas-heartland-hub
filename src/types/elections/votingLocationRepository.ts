import type { CountyId, ElectionCycleId, VotingLocationId, VotingLocationSlug } from "./identifiers";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";
import type { VotingLocation, VotingLocationCreateInput, VotingLocationUpdateInput } from "./votingLocation";
import type { VotingLocationStatus, VotingLocationType } from "./votingLocationClassifications";
import type { CountyVotingLocationDirectory, VotingLocationDetail, VotingLocationSummary } from "./votingLocationProjections";

export const VOTING_LOCATION_SORT_FIELDS = ["name", "city", "status", "location_type", "updated_at"] as const;
export type VotingLocationSortField = (typeof VOTING_LOCATION_SORT_FIELDS)[number];

export interface VotingLocationSort {
  field: VotingLocationSortField;
  direction: SortDirection;
}

export interface VotingLocationFilters {
  ids?: readonly VotingLocationId[];
  electionCycleIds?: readonly ElectionCycleId[];
  countyIds?: readonly CountyId[];
  locationTypes?: readonly VotingLocationType[];
  statuses?: readonly VotingLocationStatus[];
  city?: string;
  postalCode?: string;
  featured?: boolean;
  verified?: boolean;
  search?: string;
}

export interface VotingLocationListQuery {
  filters?: VotingLocationFilters;
  pagination?: RacePagination;
  sort?: readonly VotingLocationSort[];
}

export interface VotingLocationRepository {
  findById(id: VotingLocationId): Promise<VotingLocation | null>;
  findBySlug(slug: VotingLocationSlug): Promise<VotingLocation | null>;
  findDetailById(id: VotingLocationId): Promise<VotingLocationDetail | null>;
  list(query?: VotingLocationListQuery): Promise<RacePage<VotingLocationSummary>>;
  listCore(query?: VotingLocationListQuery): Promise<RacePage<VotingLocation>>;
  getCountyDirectory(countyId: CountyId, electionCycleId: ElectionCycleId): Promise<CountyVotingLocationDirectory | null>;
  count(filters?: VotingLocationFilters): Promise<number>;
  create(input: VotingLocationCreateInput): Promise<VotingLocation>;
  update(id: VotingLocationId, input: VotingLocationUpdateInput): Promise<VotingLocation>;
  delete(id: VotingLocationId): Promise<boolean>;
}

export type ReadonlyVotingLocationRepository = Pick<
  VotingLocationRepository,
  "findById" | "findBySlug" | "findDetailById" | "list" | "listCore" | "getCountyDirectory" | "count"
>;

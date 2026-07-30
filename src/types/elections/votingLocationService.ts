import type { CountyId, ElectionCycleId, VotingLocationId, VotingLocationSlug } from "./identifiers";
import type { RacePage, RacePagination } from "./raceRepository";
import type { VotingLocation, VotingLocationCreateInput, VotingLocationUpdateInput } from "./votingLocation";
import type { CountyVotingLocationDirectory, VotingLocationDetail, VotingLocationSummary } from "./votingLocationProjections";
import type { VotingLocationFilters, VotingLocationListQuery, VotingLocationSort } from "./votingLocationRepository";

export const VOTING_LOCATION_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_location",
  "invalid_coordinates",
  "invalid_hours",
  "missing_source",
  "invalid_status_transition",
] as const;
export type VotingLocationValidationErrorCode = (typeof VOTING_LOCATION_VALIDATION_ERROR_CODES)[number];

export interface VotingLocationValidationIssue {
  code: VotingLocationValidationErrorCode;
  field: string | null;
  message: string;
}

export interface VotingLocationValidationResult {
  valid: boolean;
  issues: readonly VotingLocationValidationIssue[];
}

export type VotingLocationServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface VotingLocationServiceError {
  code: VotingLocationServiceErrorCode;
  message: string;
  issues?: readonly VotingLocationValidationIssue[];
}

export type VotingLocationServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: VotingLocationServiceError };

export interface VotingLocationQueryOptions {
  filters?: VotingLocationFilters;
  pagination?: RacePagination;
  sort?: readonly VotingLocationSort[];
  includeUnpublished?: boolean;
}

export interface VotingLocationService {
  getLocationById(id: VotingLocationId): Promise<VotingLocationServiceResult<VotingLocation>>;
  getLocationBySlug(slug: VotingLocationSlug): Promise<VotingLocationServiceResult<VotingLocation>>;
  getLocationDetail(id: VotingLocationId): Promise<VotingLocationServiceResult<VotingLocationDetail>>;
  listLocations(query?: VotingLocationQueryOptions): Promise<RacePage<VotingLocationSummary>>;
  searchLocations(query: VotingLocationListQuery): Promise<RacePage<VotingLocationSummary>>;
  getCountyDirectory(countyId: CountyId, electionCycleId: ElectionCycleId): Promise<VotingLocationServiceResult<CountyVotingLocationDirectory>>;
  validateCreate(input: VotingLocationCreateInput): Promise<VotingLocationValidationResult>;
  validateUpdate(id: VotingLocationId, input: VotingLocationUpdateInput): Promise<VotingLocationValidationResult>;
  createLocation(input: VotingLocationCreateInput): Promise<VotingLocationServiceResult<VotingLocation>>;
  updateLocation(id: VotingLocationId, input: VotingLocationUpdateInput): Promise<VotingLocationServiceResult<VotingLocation>>;
  deleteLocation(id: VotingLocationId): Promise<VotingLocationServiceResult<boolean>>;
}

export type ReadonlyVotingLocationService = Pick<
  VotingLocationService,
  "getLocationById" | "getLocationBySlug" | "getLocationDetail" | "listLocations" | "searchLocations" | "getCountyDirectory"
>;

import type { DistrictId, DistrictSlug, ElectionEntityId } from "./identifiers";
import type {
  ElectionDistrict,
  ElectionDistrictCreateInput,
  ElectionDistrictUpdateInput,
} from "./district";
import type {
  ElectionDistrictDetail,
  ElectionDistrictSummary,
} from "./districtProjections";
import type {
  ElectionDistrictFilters,
  ElectionDistrictListQuery,
  ElectionDistrictSort,
} from "./districtRepository";
import type { RacePage, RacePagination } from "./raceRepository";

export const ELECTION_DISTRICT_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_slug",
  "invalid_population",
  "invalid_geometry_url",
  "jurisdiction_required",
  "district_in_use",
] as const;

export type ElectionDistrictValidationErrorCode =
  (typeof ELECTION_DISTRICT_VALIDATION_ERROR_CODES)[number];

export interface ElectionDistrictValidationIssue {
  code: ElectionDistrictValidationErrorCode;
  field: string | null;
  message: string;
}

export interface ElectionDistrictValidationResult {
  valid: boolean;
  issues: readonly ElectionDistrictValidationIssue[];
}

export type ElectionDistrictServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface ElectionDistrictServiceError {
  code: ElectionDistrictServiceErrorCode;
  message: string;
  issues?: readonly ElectionDistrictValidationIssue[];
}

export type ElectionDistrictServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ElectionDistrictServiceError };

export interface ElectionDistrictQueryOptions {
  filters?: ElectionDistrictFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionDistrictSort[];
  includeInactive?: boolean;
}

export interface ElectionDistrictService {
  getDistrictById(
    id: DistrictId,
  ): Promise<ElectionDistrictServiceResult<ElectionDistrict>>;
  getDistrictBySlug(
    slug: DistrictSlug,
  ): Promise<ElectionDistrictServiceResult<ElectionDistrict>>;
  getDistrictSummary(
    id: DistrictId,
  ): Promise<ElectionDistrictServiceResult<ElectionDistrictSummary>>;
  getDistrictDetail(
    id: DistrictId,
  ): Promise<ElectionDistrictServiceResult<ElectionDistrictDetail>>;
  listDistricts(
    query?: ElectionDistrictQueryOptions,
  ): Promise<RacePage<ElectionDistrictSummary>>;
  searchDistricts(
    query: ElectionDistrictListQuery,
  ): Promise<RacePage<ElectionDistrictSummary>>;
  getDistrictsForCounty(
    entityId: ElectionEntityId,
  ): Promise<readonly ElectionDistrictSummary[]>;
  validateCreate(
    input: ElectionDistrictCreateInput,
  ): Promise<ElectionDistrictValidationResult>;
  validateUpdate(
    id: DistrictId,
    input: ElectionDistrictUpdateInput,
  ): Promise<ElectionDistrictValidationResult>;
  createDistrict(
    input: ElectionDistrictCreateInput,
  ): Promise<ElectionDistrictServiceResult<ElectionDistrict>>;
  updateDistrict(
    id: DistrictId,
    input: ElectionDistrictUpdateInput,
  ): Promise<ElectionDistrictServiceResult<ElectionDistrict>>;
  deleteDistrict(
    id: DistrictId,
  ): Promise<ElectionDistrictServiceResult<boolean>>;
}

export type ReadonlyElectionDistrictService = Pick<
  ElectionDistrictService,
  | "getDistrictById"
  | "getDistrictBySlug"
  | "getDistrictSummary"
  | "getDistrictDetail"
  | "listDistricts"
  | "searchDistricts"
  | "getDistrictsForCounty"
>;
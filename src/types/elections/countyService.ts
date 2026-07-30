import type { CountyId, CountySlug } from "./identifiers";
import type {
  ElectionCounty,
  ElectionCountyCreateInput,
  ElectionCountyUpdateInput,
} from "./county";
import type {
  ElectionCountyDetail,
  ElectionCountySummary,
} from "./countyProjections";
import type {
  ElectionCountyFilters,
  ElectionCountyListQuery,
  ElectionCountySort,
} from "./countyRepository";
import type { RacePage, RacePagination } from "./raceRepository";

export const ELECTION_COUNTY_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_slug",
  "duplicate_fips_code",
  "invalid_population",
  "invalid_url",
  "county_in_use",
] as const;

export type ElectionCountyValidationErrorCode =
  (typeof ELECTION_COUNTY_VALIDATION_ERROR_CODES)[number];

export interface ElectionCountyValidationIssue {
  code: ElectionCountyValidationErrorCode;
  field: string | null;
  message: string;
}

export interface ElectionCountyValidationResult {
  valid: boolean;
  issues: readonly ElectionCountyValidationIssue[];
}

export type ElectionCountyServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface ElectionCountyServiceError {
  code: ElectionCountyServiceErrorCode;
  message: string;
  issues?: readonly ElectionCountyValidationIssue[];
}

export type ElectionCountyServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ElectionCountyServiceError };

export interface ElectionCountyQueryOptions {
  filters?: ElectionCountyFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionCountySort[];
  includeInactive?: boolean;
}

export interface ElectionCountyService {
  getCountyById(
    id: CountyId,
  ): Promise<ElectionCountyServiceResult<ElectionCounty>>;
  getCountyBySlug(
    slug: CountySlug,
  ): Promise<ElectionCountyServiceResult<ElectionCounty>>;
  getCountyByFipsCode(
    fipsCode: string,
  ): Promise<ElectionCountyServiceResult<ElectionCounty>>;
  getCountySummary(
    id: CountyId,
  ): Promise<ElectionCountyServiceResult<ElectionCountySummary>>;
  getCountyDetail(
    id: CountyId,
  ): Promise<ElectionCountyServiceResult<ElectionCountyDetail>>;
  listCounties(
    query?: ElectionCountyQueryOptions,
  ): Promise<RacePage<ElectionCountySummary>>;
  searchCounties(
    query: ElectionCountyListQuery,
  ): Promise<RacePage<ElectionCountySummary>>;
  validateCreate(
    input: ElectionCountyCreateInput,
  ): Promise<ElectionCountyValidationResult>;
  validateUpdate(
    id: CountyId,
    input: ElectionCountyUpdateInput,
  ): Promise<ElectionCountyValidationResult>;
  createCounty(
    input: ElectionCountyCreateInput,
  ): Promise<ElectionCountyServiceResult<ElectionCounty>>;
  updateCounty(
    id: CountyId,
    input: ElectionCountyUpdateInput,
  ): Promise<ElectionCountyServiceResult<ElectionCounty>>;
  deleteCounty(
    id: CountyId,
  ): Promise<ElectionCountyServiceResult<boolean>>;
}

export type ReadonlyElectionCountyService = Pick<
  ElectionCountyService,
  | "getCountyById"
  | "getCountyBySlug"
  | "getCountyByFipsCode"
  | "getCountySummary"
  | "getCountyDetail"
  | "listCounties"
  | "searchCounties"
>;
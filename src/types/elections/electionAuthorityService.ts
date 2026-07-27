import type { ElectionAuthority, ElectionAuthorityCreateInput, ElectionAuthorityUpdateInput } from "./electionAuthority";
import type { CountyElectionAuthorityDirectory, ElectionAuthorityDetail, ElectionAuthoritySummary } from "./electionAuthorityProjections";
import type { ElectionAuthorityFilters, ElectionAuthorityListQuery, ElectionAuthoritySort } from "./electionAuthorityRepository";
import type { CountyId, ElectionAuthorityId, ElectionAuthoritySlug } from "./identifiers";
import type { RacePage, RacePagination } from "./raceRepository";

export const ELECTION_AUTHORITY_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_authority",
  "invalid_contact",
  "missing_website",
  "invalid_status_transition",
] as const;
export type ElectionAuthorityValidationErrorCode = (typeof ELECTION_AUTHORITY_VALIDATION_ERROR_CODES)[number];

export interface ElectionAuthorityValidationIssue {
  code: ElectionAuthorityValidationErrorCode;
  field: string | null;
  message: string;
}

export interface ElectionAuthorityValidationResult {
  valid: boolean;
  issues: readonly ElectionAuthorityValidationIssue[];
}

export type ElectionAuthorityServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface ElectionAuthorityServiceError {
  code: ElectionAuthorityServiceErrorCode;
  message: string;
  issues?: readonly ElectionAuthorityValidationIssue[];
}

export type ElectionAuthorityServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ElectionAuthorityServiceError };

export interface ElectionAuthorityQueryOptions {
  filters?: ElectionAuthorityFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionAuthoritySort[];
  includeUnpublished?: boolean;
}

export interface ElectionAuthorityService {
  getAuthorityById(id: ElectionAuthorityId): Promise<ElectionAuthorityServiceResult<ElectionAuthority>>;
  getAuthorityBySlug(slug: ElectionAuthoritySlug): Promise<ElectionAuthorityServiceResult<ElectionAuthority>>;
  getAuthorityDetail(id: ElectionAuthorityId): Promise<ElectionAuthorityServiceResult<ElectionAuthorityDetail>>;
  listAuthorities(query?: ElectionAuthorityQueryOptions): Promise<RacePage<ElectionAuthoritySummary>>;
  searchAuthorities(query: ElectionAuthorityListQuery): Promise<RacePage<ElectionAuthoritySummary>>;
  getCountyDirectory(countyId: CountyId): Promise<ElectionAuthorityServiceResult<CountyElectionAuthorityDirectory>>;
  validateCreate(input: ElectionAuthorityCreateInput): Promise<ElectionAuthorityValidationResult>;
  validateUpdate(id: ElectionAuthorityId, input: ElectionAuthorityUpdateInput): Promise<ElectionAuthorityValidationResult>;
  createAuthority(input: ElectionAuthorityCreateInput): Promise<ElectionAuthorityServiceResult<ElectionAuthority>>;
  updateAuthority(id: ElectionAuthorityId, input: ElectionAuthorityUpdateInput): Promise<ElectionAuthorityServiceResult<ElectionAuthority>>;
  deleteAuthority(id: ElectionAuthorityId): Promise<ElectionAuthorityServiceResult<boolean>>;
}

export type ReadonlyElectionAuthorityService = Pick<
  ElectionAuthorityService,
  "getAuthorityById" | "getAuthorityBySlug" | "getAuthorityDetail" | "listAuthorities" | "searchAuthorities" | "getCountyDirectory"
>;

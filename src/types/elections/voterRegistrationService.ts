import type {
  VoterRegistrationCreateInput,
  VoterRegistrationRecord,
  VoterRegistrationUpdateInput,
} from "./voterRegistration";
import type {
  VoterRegistrationCountyOverview,
  VoterRegistrationDetail,
  VoterRegistrationSummary,
} from "./voterRegistrationProjections";
import type {
  VoterRegistrationFilters,
  VoterRegistrationListQuery,
  VoterRegistrationSort,
} from "./voterRegistrationRepository";
import type {
  CountyId,
  ElectionCycleId,
  VoterRegistrationId,
  VoterRegistrationSlug,
} from "./identifiers";
import type { RacePage, RacePagination } from "./raceRepository";

export const VOTER_REGISTRATION_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_record",
  "county_cycle_mismatch",
  "invalid_status_transition",
  "deadline_conflict",
] as const;
export type VoterRegistrationValidationErrorCode =
  (typeof VOTER_REGISTRATION_VALIDATION_ERROR_CODES)[number];

export interface VoterRegistrationValidationIssue {
  code: VoterRegistrationValidationErrorCode;
  field: string | null;
  message: string;
}

export interface VoterRegistrationValidationResult {
  valid: boolean;
  issues: readonly VoterRegistrationValidationIssue[];
}

export type VoterRegistrationServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface VoterRegistrationServiceError {
  code: VoterRegistrationServiceErrorCode;
  message: string;
  issues?: readonly VoterRegistrationValidationIssue[];
}

export type VoterRegistrationServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: VoterRegistrationServiceError };

export interface VoterRegistrationQueryOptions {
  filters?: VoterRegistrationFilters;
  pagination?: RacePagination;
  sort?: readonly VoterRegistrationSort[];
  includeInactive?: boolean;
}

export interface VoterRegistrationService {
  getRegistrationById(id: VoterRegistrationId): Promise<VoterRegistrationServiceResult<VoterRegistrationRecord>>;
  getRegistrationBySlug(slug: VoterRegistrationSlug): Promise<VoterRegistrationServiceResult<VoterRegistrationRecord>>;
  getRegistrationDetail(id: VoterRegistrationId): Promise<VoterRegistrationServiceResult<VoterRegistrationDetail>>;
  listRegistrations(query?: VoterRegistrationQueryOptions): Promise<RacePage<VoterRegistrationSummary>>;
  searchRegistrations(query: VoterRegistrationListQuery): Promise<RacePage<VoterRegistrationSummary>>;
  getCountyOverview(countyId: CountyId, electionCycleId: ElectionCycleId): Promise<VoterRegistrationServiceResult<VoterRegistrationCountyOverview>>;
  validateCreate(input: VoterRegistrationCreateInput): Promise<VoterRegistrationValidationResult>;
  validateUpdate(id: VoterRegistrationId, input: VoterRegistrationUpdateInput): Promise<VoterRegistrationValidationResult>;
  createRegistration(input: VoterRegistrationCreateInput): Promise<VoterRegistrationServiceResult<VoterRegistrationRecord>>;
  updateRegistration(id: VoterRegistrationId, input: VoterRegistrationUpdateInput): Promise<VoterRegistrationServiceResult<VoterRegistrationRecord>>;
  deleteRegistration(id: VoterRegistrationId): Promise<VoterRegistrationServiceResult<boolean>>;
}

export type ReadonlyVoterRegistrationService = Pick<
  VoterRegistrationService,
  "getRegistrationById" | "getRegistrationBySlug" | "getRegistrationDetail" | "listRegistrations" | "searchRegistrations" | "getCountyOverview"
>;

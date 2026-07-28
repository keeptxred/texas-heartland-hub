import type { MailBallotCreateInput, MailBallotRecord, MailBallotUpdateInput } from "./mailBallot";
import type { MailBallotCountyOverview, MailBallotDetail, MailBallotSummary } from "./mailBallotProjections";
import type { MailBallotFilters, MailBallotListQuery, MailBallotSort } from "./mailBallotRepository";
import type { CountyId, ElectionCycleId, MailBallotId, MailBallotSlug } from "./identifiers";
import type { RacePage, RacePagination } from "./raceRepository";

export const MAIL_BALLOT_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_record",
  "county_cycle_mismatch",
  "invalid_status_transition",
  "deadline_conflict",
] as const;
export type MailBallotValidationErrorCode = (typeof MAIL_BALLOT_VALIDATION_ERROR_CODES)[number];

export interface MailBallotValidationIssue {
  code: MailBallotValidationErrorCode;
  field: string | null;
  message: string;
}

export interface MailBallotValidationResult {
  valid: boolean;
  issues: readonly MailBallotValidationIssue[];
}

export type MailBallotServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface MailBallotServiceError {
  code: MailBallotServiceErrorCode;
  message: string;
  issues?: readonly MailBallotValidationIssue[];
}

export type MailBallotServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: MailBallotServiceError };

export interface MailBallotQueryOptions {
  filters?: MailBallotFilters;
  pagination?: RacePagination;
  sort?: readonly MailBallotSort[];
  includeCancelled?: boolean;
}

export interface MailBallotService {
  getMailBallotById(id: MailBallotId): Promise<MailBallotServiceResult<MailBallotRecord>>;
  getMailBallotBySlug(slug: MailBallotSlug): Promise<MailBallotServiceResult<MailBallotRecord>>;
  getMailBallotDetail(id: MailBallotId): Promise<MailBallotServiceResult<MailBallotDetail>>;
  listMailBallots(query?: MailBallotQueryOptions): Promise<RacePage<MailBallotSummary>>;
  searchMailBallots(query: MailBallotListQuery): Promise<RacePage<MailBallotSummary>>;
  getCountyOverview(countyId: CountyId, electionCycleId: ElectionCycleId): Promise<MailBallotServiceResult<MailBallotCountyOverview>>;
  validateCreate(input: MailBallotCreateInput): Promise<MailBallotValidationResult>;
  validateUpdate(id: MailBallotId, input: MailBallotUpdateInput): Promise<MailBallotValidationResult>;
  createMailBallot(input: MailBallotCreateInput): Promise<MailBallotServiceResult<MailBallotRecord>>;
  updateMailBallot(id: MailBallotId, input: MailBallotUpdateInput): Promise<MailBallotServiceResult<MailBallotRecord>>;
  deleteMailBallot(id: MailBallotId): Promise<MailBallotServiceResult<boolean>>;
}

export type ReadonlyMailBallotService = Pick<
  MailBallotService,
  "getMailBallotById" | "getMailBallotBySlug" | "getMailBallotDetail" | "listMailBallots" | "searchMailBallots" | "getCountyOverview"
>;

import type { SampleBallot, SampleBallotCreateInput, SampleBallotUpdateInput } from "./sampleBallot";
import type { SampleBallotDetail, SampleBallotSummary } from "./sampleBallotProjections";
import type { SampleBallotFilters, SampleBallotListQuery, SampleBallotSort } from "./sampleBallotRepository";
import type { SampleBallotId, SampleBallotSlug } from "./identifiers";
import type { RacePage, RacePagination } from "./raceRepository";

export const SAMPLE_BALLOT_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_ballot",
  "missing_source",
  "invalid_document",
  "invalid_status_transition",
] as const;
export type SampleBallotValidationErrorCode = (typeof SAMPLE_BALLOT_VALIDATION_ERROR_CODES)[number];

export interface SampleBallotValidationIssue {
  code: SampleBallotValidationErrorCode;
  field: string | null;
  message: string;
}

export interface SampleBallotValidationResult {
  valid: boolean;
  issues: readonly SampleBallotValidationIssue[];
}

export type SampleBallotServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface SampleBallotServiceError {
  code: SampleBallotServiceErrorCode;
  message: string;
  issues?: readonly SampleBallotValidationIssue[];
}

export type SampleBallotServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: SampleBallotServiceError };

export interface SampleBallotQueryOptions {
  filters?: SampleBallotFilters;
  pagination?: RacePagination;
  sort?: readonly SampleBallotSort[];
  includeUnpublished?: boolean;
}

export interface SampleBallotService {
  getBallotById(id: SampleBallotId): Promise<SampleBallotServiceResult<SampleBallot>>;
  getBallotBySlug(slug: SampleBallotSlug): Promise<SampleBallotServiceResult<SampleBallot>>;
  getBallotDetail(id: SampleBallotId): Promise<SampleBallotServiceResult<SampleBallotDetail>>;
  listBallots(query?: SampleBallotQueryOptions): Promise<RacePage<SampleBallotSummary>>;
  searchBallots(query: SampleBallotListQuery): Promise<RacePage<SampleBallotSummary>>;
  validateCreate(input: SampleBallotCreateInput): Promise<SampleBallotValidationResult>;
  validateUpdate(id: SampleBallotId, input: SampleBallotUpdateInput): Promise<SampleBallotValidationResult>;
  createBallot(input: SampleBallotCreateInput): Promise<SampleBallotServiceResult<SampleBallot>>;
  updateBallot(id: SampleBallotId, input: SampleBallotUpdateInput): Promise<SampleBallotServiceResult<SampleBallot>>;
  deleteBallot(id: SampleBallotId): Promise<SampleBallotServiceResult<boolean>>;
}

export type ReadonlySampleBallotService = Pick<
  SampleBallotService,
  "getBallotById" | "getBallotBySlug" | "getBallotDetail" | "listBallots" | "searchBallots"
>;

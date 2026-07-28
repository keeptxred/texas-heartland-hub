import type { CandidateId, LegislativeScorecardId, LegislativeScorecardSlug } from "./identifiers";
import type { LegislativeScorecard, LegislativeScorecardCreateInput, LegislativeScorecardUpdateInput } from "./legislativeScorecard";
import type { CandidateLegislativeScorecardProfile, LegislativeScorecardDetail, LegislativeScorecardSummary } from "./legislativeScorecardProjections";
import type { LegislativeScorecardFilters, LegislativeScorecardListQuery, LegislativeScorecardSort } from "./legislativeScorecardRepository";
import type { RacePage, RacePagination } from "./raceRepository";

export const LEGISLATIVE_SCORECARD_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_scorecard",
  "invalid_score",
  "missing_source",
  "invalid_status_transition",
] as const;
export type LegislativeScorecardValidationErrorCode = (typeof LEGISLATIVE_SCORECARD_VALIDATION_ERROR_CODES)[number];

export interface LegislativeScorecardValidationIssue {
  code: LegislativeScorecardValidationErrorCode;
  field: string | null;
  message: string;
}

export interface LegislativeScorecardValidationResult {
  valid: boolean;
  issues: readonly LegislativeScorecardValidationIssue[];
}

export type LegislativeScorecardServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface LegislativeScorecardServiceError {
  code: LegislativeScorecardServiceErrorCode;
  message: string;
  issues?: readonly LegislativeScorecardValidationIssue[];
}

export type LegislativeScorecardServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: LegislativeScorecardServiceError };

export interface LegislativeScorecardQueryOptions {
  filters?: LegislativeScorecardFilters;
  pagination?: RacePagination;
  sort?: readonly LegislativeScorecardSort[];
  includeUnpublished?: boolean;
}

export interface LegislativeScorecardService {
  getScorecardById(id: LegislativeScorecardId): Promise<LegislativeScorecardServiceResult<LegislativeScorecard>>;
  getScorecardBySlug(slug: LegislativeScorecardSlug): Promise<LegislativeScorecardServiceResult<LegislativeScorecard>>;
  getScorecardDetail(id: LegislativeScorecardId): Promise<LegislativeScorecardServiceResult<LegislativeScorecardDetail>>;
  listScorecards(query?: LegislativeScorecardQueryOptions): Promise<RacePage<LegislativeScorecardSummary>>;
  searchScorecards(query: LegislativeScorecardListQuery): Promise<RacePage<LegislativeScorecardSummary>>;
  getCandidateProfile(candidateId: CandidateId): Promise<LegislativeScorecardServiceResult<CandidateLegislativeScorecardProfile>>;
  validateCreate(input: LegislativeScorecardCreateInput): Promise<LegislativeScorecardValidationResult>;
  validateUpdate(id: LegislativeScorecardId, input: LegislativeScorecardUpdateInput): Promise<LegislativeScorecardValidationResult>;
  createScorecard(input: LegislativeScorecardCreateInput): Promise<LegislativeScorecardServiceResult<LegislativeScorecard>>;
  updateScorecard(id: LegislativeScorecardId, input: LegislativeScorecardUpdateInput): Promise<LegislativeScorecardServiceResult<LegislativeScorecard>>;
  deleteScorecard(id: LegislativeScorecardId): Promise<LegislativeScorecardServiceResult<boolean>>;
}

export type ReadonlyLegislativeScorecardService = Pick<
  LegislativeScorecardService,
  "getScorecardById" | "getScorecardBySlug" | "getScorecardDetail" | "listScorecards" | "searchScorecards" | "getCandidateProfile"
>;

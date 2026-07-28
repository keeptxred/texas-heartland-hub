import type {
  CandidateIssuePosition,
  CandidateIssuePositionCreateInput,
  CandidateIssuePositionUpdateInput,
} from "./issuePosition";
import type {
  CandidateIssueComparisonRow,
  CandidateIssuePositionDetail,
  CandidateIssuePositionSummary,
  CandidateIssueProfile,
} from "./issuePositionProjections";
import type {
  IssuePositionFilters,
  IssuePositionListQuery,
  IssuePositionSort,
} from "./issuePositionRepository";
import type { CandidateId, IssuePositionId, IssuePositionSlug, RaceId } from "./identifiers";
import type { RacePage, RacePagination } from "./raceRepository";

export const ISSUE_POSITION_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_position",
  "missing_source",
  "candidate_race_mismatch",
  "invalid_status_transition",
] as const;
export type IssuePositionValidationErrorCode = (typeof ISSUE_POSITION_VALIDATION_ERROR_CODES)[number];

export interface IssuePositionValidationIssue {
  code: IssuePositionValidationErrorCode;
  field: string | null;
  message: string;
}

export interface IssuePositionValidationResult {
  valid: boolean;
  issues: readonly IssuePositionValidationIssue[];
}

export type IssuePositionServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface IssuePositionServiceError {
  code: IssuePositionServiceErrorCode;
  message: string;
  issues?: readonly IssuePositionValidationIssue[];
}

export type IssuePositionServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: IssuePositionServiceError };

export interface IssuePositionQueryOptions {
  filters?: IssuePositionFilters;
  pagination?: RacePagination;
  sort?: readonly IssuePositionSort[];
  includeUnpublished?: boolean;
}

export interface IssuePositionService {
  getPositionById(id: IssuePositionId): Promise<IssuePositionServiceResult<CandidateIssuePosition>>;
  getPositionBySlug(slug: IssuePositionSlug): Promise<IssuePositionServiceResult<CandidateIssuePosition>>;
  getPositionDetail(id: IssuePositionId): Promise<IssuePositionServiceResult<CandidateIssuePositionDetail>>;
  listPositions(query?: IssuePositionQueryOptions): Promise<RacePage<CandidateIssuePositionSummary>>;
  searchPositions(query: IssuePositionListQuery): Promise<RacePage<CandidateIssuePositionSummary>>;
  getCandidateProfile(candidateId: CandidateId): Promise<IssuePositionServiceResult<CandidateIssueProfile>>;
  compareCandidates(candidateIds: readonly CandidateId[], raceId?: RaceId): Promise<readonly CandidateIssueComparisonRow[]>;
  validateCreate(input: CandidateIssuePositionCreateInput): Promise<IssuePositionValidationResult>;
  validateUpdate(id: IssuePositionId, input: CandidateIssuePositionUpdateInput): Promise<IssuePositionValidationResult>;
  createPosition(input: CandidateIssuePositionCreateInput): Promise<IssuePositionServiceResult<CandidateIssuePosition>>;
  updatePosition(id: IssuePositionId, input: CandidateIssuePositionUpdateInput): Promise<IssuePositionServiceResult<CandidateIssuePosition>>;
  deletePosition(id: IssuePositionId): Promise<IssuePositionServiceResult<boolean>>;
}

export type ReadonlyIssuePositionService = Pick<
  IssuePositionService,
  | "getPositionById"
  | "getPositionBySlug"
  | "getPositionDetail"
  | "listPositions"
  | "searchPositions"
  | "getCandidateProfile"
  | "compareCandidates"
>;

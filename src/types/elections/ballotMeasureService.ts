import type { ElectionBallotMeasure, ElectionBallotMeasureCreateInput, ElectionBallotMeasureUpdateInput } from "./ballotMeasure";
import type { BallotMeasureDetail, BallotMeasureSummary } from "./ballotMeasureProjections";
import type { BallotMeasureFilters, BallotMeasureListQuery, BallotMeasureSort } from "./ballotMeasureRepository";
import type { BallotMeasureId, BallotMeasureSlug } from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type { RacePage, RacePagination } from "./raceRepository";

export const BALLOT_MEASURE_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "invalid_date_order",
  "invalid_vote_totals",
  "invalid_percentage",
  "duplicate_slug",
  "duplicate_measure_number",
  "invalid_status_transition",
] as const;

export type BallotMeasureValidationErrorCode = (typeof BALLOT_MEASURE_VALIDATION_ERROR_CODES)[number];

export interface BallotMeasureValidationIssue {
  code: BallotMeasureValidationErrorCode;
  field: string | null;
  message: string;
}

export interface BallotMeasureValidationResult {
  valid: boolean;
  issues: readonly BallotMeasureValidationIssue[];
}

export type BallotMeasureServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface BallotMeasureServiceError {
  code: BallotMeasureServiceErrorCode;
  message: string;
  issues?: readonly BallotMeasureValidationIssue[];
}

export type BallotMeasureServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: BallotMeasureServiceError };

export interface BallotMeasureQueryOptions {
  filters?: BallotMeasureFilters;
  pagination?: RacePagination;
  sort?: readonly BallotMeasureSort[];
  includeUnpublished?: boolean;
}

export interface BallotMeasureCallInput {
  ballotMeasureId: BallotMeasureId;
  status: "passed" | "failed";
  calledAt: IsoDateTimeString;
  notes?: string | null;
}

export interface BallotMeasureService {
  getBallotMeasureById(id: BallotMeasureId): Promise<BallotMeasureServiceResult<ElectionBallotMeasure>>;
  getBallotMeasureBySlug(slug: BallotMeasureSlug): Promise<BallotMeasureServiceResult<ElectionBallotMeasure>>;
  getBallotMeasureSummary(id: BallotMeasureId): Promise<BallotMeasureServiceResult<BallotMeasureSummary>>;
  getBallotMeasureDetail(id: BallotMeasureId): Promise<BallotMeasureServiceResult<BallotMeasureDetail>>;
  listBallotMeasures(query?: BallotMeasureQueryOptions): Promise<RacePage<BallotMeasureSummary>>;
  searchBallotMeasures(query: BallotMeasureListQuery): Promise<RacePage<BallotMeasureSummary>>;
  validateCreate(input: ElectionBallotMeasureCreateInput): Promise<BallotMeasureValidationResult>;
  validateUpdate(id: BallotMeasureId, input: ElectionBallotMeasureUpdateInput): Promise<BallotMeasureValidationResult>;
  createBallotMeasure(input: ElectionBallotMeasureCreateInput): Promise<BallotMeasureServiceResult<ElectionBallotMeasure>>;
  updateBallotMeasure(id: BallotMeasureId, input: ElectionBallotMeasureUpdateInput): Promise<BallotMeasureServiceResult<ElectionBallotMeasure>>;
  deleteBallotMeasure(id: BallotMeasureId): Promise<BallotMeasureServiceResult<boolean>>;
  callBallotMeasure(input: BallotMeasureCallInput): Promise<BallotMeasureServiceResult<ElectionBallotMeasure>>;
}

export type ReadonlyBallotMeasureService = Pick<
  BallotMeasureService,
  | "getBallotMeasureById"
  | "getBallotMeasureBySlug"
  | "getBallotMeasureSummary"
  | "getBallotMeasureDetail"
  | "listBallotMeasures"
  | "searchBallotMeasures"
>;

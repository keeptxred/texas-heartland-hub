import type {
  CandidateId,
  ElectionCycleId,
  ForecastId,
  ForecastSlug,
  RaceId,
} from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type {
  ElectionForecast,
  ElectionForecastCreateInput,
  ElectionForecastUpdateInput,
} from "./forecast";
import type {
  ForecastConfidenceLevel,
  ForecastRating,
  ForecastStatus,
} from "./forecastClassifications";
import type {
  ElectionForecastDetail,
  ElectionForecastSnapshot,
  ElectionForecastSummary,
} from "./forecastProjections";
import type {
  ElectionForecastFilters,
  ElectionForecastListQuery,
  ElectionForecastSort,
} from "./forecastRepository";
import type { RacePage, RacePagination } from "./raceRepository";

export const FORECAST_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "invalid_probability",
  "invalid_probability_total",
  "duplicate_candidate",
  "candidate_not_found",
  "candidate_race_mismatch",
  "race_not_found",
  "cycle_mismatch",
  "duplicate_slug",
  "invalid_status_transition",
  "invalid_date_order",
] as const;

export type ForecastValidationErrorCode =
  (typeof FORECAST_VALIDATION_ERROR_CODES)[number];

export interface ForecastValidationIssue {
  code: ForecastValidationErrorCode;
  field: string | null;
  message: string;
}

export interface ForecastValidationResult {
  valid: boolean;
  issues: readonly ForecastValidationIssue[];
}

export type ForecastServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface ForecastServiceError {
  code: ForecastServiceErrorCode;
  message: string;
  issues?: readonly ForecastValidationIssue[];
}

export type ForecastServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ForecastServiceError };

export interface ForecastQueryOptions {
  filters?: ElectionForecastFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionForecastSort[];
  includeUnpublished?: boolean;
}

export interface ActiveForecastOptions {
  electionCycleId: ElectionCycleId;
  limit?: number;
  includeUnverified?: boolean;
  includeStale?: boolean;
}

export interface ForecastStatusTransitionInput {
  forecastId: ForecastId;
  status: ForecastStatus;
  occurredAt: IsoDateTimeString;
  notes?: string | null;
}

export interface ForecastStatusTransitionResult {
  forecast: ElectionForecast;
  previousStatus: ForecastStatus;
  currentStatus: ForecastStatus;
}

export interface ForecastAssessmentUpdateInput {
  forecastId: ForecastId;
  rating?: ForecastRating;
  confidenceLevel?: ForecastConfidenceLevel;
  projectedWinnerCandidateId?: CandidateId | null;
  projectedMargin?: number | null;
  updatedAt: IsoDateTimeString;
}

export interface ForecastSnapshotInput {
  forecastId: ForecastId;
  capturedAt: IsoDateTimeString;
}

export interface ElectionForecastService {
  getForecastById(
    id: ForecastId,
  ): Promise<ForecastServiceResult<ElectionForecast>>;
  getForecastBySlug(
    slug: ForecastSlug,
    electionCycleId?: ElectionCycleId,
  ): Promise<ForecastServiceResult<ElectionForecast>>;
  getForecastForRace(
    raceId: RaceId,
  ): Promise<ForecastServiceResult<ElectionForecastDetail>>;
  getForecastSummary(
    id: ForecastId,
  ): Promise<ForecastServiceResult<ElectionForecastSummary>>;
  getForecastDetail(
    id: ForecastId,
  ): Promise<ForecastServiceResult<ElectionForecastDetail>>;

  listForecasts(
    query?: ForecastQueryOptions,
  ): Promise<RacePage<ElectionForecastSummary>>;
  searchForecasts(
    query: ElectionForecastListQuery,
  ): Promise<RacePage<ElectionForecastSummary>>;
  getActiveForecasts(
    options: ActiveForecastOptions,
  ): Promise<readonly ElectionForecastSummary[]>;
  getForecastsForCandidate(
    candidateId: CandidateId,
  ): Promise<readonly ElectionForecastSummary[]>;

  validateCreate(
    input: ElectionForecastCreateInput,
  ): Promise<ForecastValidationResult>;
  validateUpdate(
    id: ForecastId,
    input: ElectionForecastUpdateInput,
  ): Promise<ForecastValidationResult>;
  validateStatusTransition(
    input: ForecastStatusTransitionInput,
  ): Promise<ForecastValidationResult>;

  createForecast(
    input: ElectionForecastCreateInput,
  ): Promise<ForecastServiceResult<ElectionForecast>>;
  updateForecast(
    id: ForecastId,
    input: ElectionForecastUpdateInput,
  ): Promise<ForecastServiceResult<ElectionForecast>>;
  deleteForecast(id: ForecastId): Promise<ForecastServiceResult<boolean>>;

  updateAssessment(
    input: ForecastAssessmentUpdateInput,
  ): Promise<ForecastServiceResult<ElectionForecast>>;
  transitionStatus(
    input: ForecastStatusTransitionInput,
  ): Promise<ForecastServiceResult<ForecastStatusTransitionResult>>;
  captureSnapshot(
    input: ForecastSnapshotInput,
  ): Promise<ForecastServiceResult<ElectionForecastSnapshot>>;
}

export type ReadonlyElectionForecastService = Pick<
  ElectionForecastService,
  | "getForecastById"
  | "getForecastBySlug"
  | "getForecastForRace"
  | "getForecastSummary"
  | "getForecastDetail"
  | "listForecasts"
  | "searchForecasts"
  | "getActiveForecasts"
  | "getForecastsForCandidate"
>;

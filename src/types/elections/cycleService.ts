import type { ElectionStatus } from "./domain";
import type {
  ElectionCycleId,
  ElectionCycleSlug,
} from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type {
  ElectionCycle,
  ElectionCycleCreateInput,
  ElectionCycleUpdateInput,
} from "./cycle";
import type {
  ElectionCycleDetail,
  ElectionCycleSummary,
} from "./cycleProjections";
import type {
  ElectionCycleFilters,
  ElectionCycleListQuery,
  ElectionCycleSort,
} from "./cycleRepository";
import type { RacePage, RacePagination } from "./raceRepository";

export const ELECTION_CYCLE_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "invalid_year",
  "invalid_date_order",
  "duplicate_slug",
  "duplicate_year",
  "invalid_status_transition",
  "active_cycle_conflict",
] as const;

export type ElectionCycleValidationErrorCode =
  (typeof ELECTION_CYCLE_VALIDATION_ERROR_CODES)[number];

export interface ElectionCycleValidationIssue {
  code: ElectionCycleValidationErrorCode;
  field: string | null;
  message: string;
}

export interface ElectionCycleValidationResult {
  valid: boolean;
  issues: readonly ElectionCycleValidationIssue[];
}

export type ElectionCycleServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface ElectionCycleServiceError {
  code: ElectionCycleServiceErrorCode;
  message: string;
  issues?: readonly ElectionCycleValidationIssue[];
}

export type ElectionCycleServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ElectionCycleServiceError };

export interface ElectionCycleQueryOptions {
  filters?: ElectionCycleFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionCycleSort[];
  includeUnpublished?: boolean;
}

export interface ElectionCycleStatusTransitionInput {
  cycleId: ElectionCycleId;
  status: ElectionStatus;
  occurredAt: IsoDateTimeString;
  notes?: string | null;
}

export interface ElectionCycleStatusTransitionResult {
  cycle: ElectionCycle;
  previousStatus: ElectionStatus;
  currentStatus: ElectionStatus;
}

export interface ElectionCycleActivationInput {
  cycleId: ElectionCycleId;
  occurredAt: IsoDateTimeString;
  deactivateOtherCycles?: boolean;
}

export interface ElectionCycleService {
  getCycleById(
    id: ElectionCycleId,
  ): Promise<ElectionCycleServiceResult<ElectionCycle>>;
  getCycleBySlug(
    slug: ElectionCycleSlug,
  ): Promise<ElectionCycleServiceResult<ElectionCycle>>;
  getCycleByYear(
    year: number,
    stateCode?: string,
  ): Promise<ElectionCycleServiceResult<ElectionCycle>>;
  getActiveCycle(
    stateCode?: string,
  ): Promise<ElectionCycleServiceResult<ElectionCycle>>;
  getCycleSummary(
    id: ElectionCycleId,
  ): Promise<ElectionCycleServiceResult<ElectionCycleSummary>>;
  getCycleDetail(
    id: ElectionCycleId,
  ): Promise<ElectionCycleServiceResult<ElectionCycleDetail>>;

  listCycles(
    query?: ElectionCycleQueryOptions,
  ): Promise<RacePage<ElectionCycleSummary>>;
  searchCycles(
    query: ElectionCycleListQuery,
  ): Promise<RacePage<ElectionCycleSummary>>;
  getUpcomingCycles(
    stateCode?: string,
    limit?: number,
  ): Promise<readonly ElectionCycleSummary[]>;

  validateCreate(
    input: ElectionCycleCreateInput,
  ): Promise<ElectionCycleValidationResult>;
  validateUpdate(
    id: ElectionCycleId,
    input: ElectionCycleUpdateInput,
  ): Promise<ElectionCycleValidationResult>;
  validateStatusTransition(
    input: ElectionCycleStatusTransitionInput,
  ): Promise<ElectionCycleValidationResult>;

  createCycle(
    input: ElectionCycleCreateInput,
  ): Promise<ElectionCycleServiceResult<ElectionCycle>>;
  updateCycle(
    id: ElectionCycleId,
    input: ElectionCycleUpdateInput,
  ): Promise<ElectionCycleServiceResult<ElectionCycle>>;
  deleteCycle(
    id: ElectionCycleId,
  ): Promise<ElectionCycleServiceResult<boolean>>;

  activateCycle(
    input: ElectionCycleActivationInput,
  ): Promise<ElectionCycleServiceResult<ElectionCycle>>;
  transitionStatus(
    input: ElectionCycleStatusTransitionInput,
  ): Promise<ElectionCycleServiceResult<ElectionCycleStatusTransitionResult>>;
}

export type ReadonlyElectionCycleService = Pick<
  ElectionCycleService,
  | "getCycleById"
  | "getCycleBySlug"
  | "getCycleByYear"
  | "getActiveCycle"
  | "getCycleSummary"
  | "getCycleDetail"
  | "listCycles"
  | "searchCycles"
  | "getUpcomingCycles"
>;

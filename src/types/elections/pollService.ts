import type {
  CandidateId,
  ElectionCycleId,
  PollId,
  PollSlug,
  RaceId,
} from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type {
  ElectionPoll,
  ElectionPollCreateInput,
  ElectionPollUpdateInput,
} from "./poll";
import type { PollStatus } from "./pollClassifications";
import type {
  ElectionPollDetail,
  ElectionPollSummary,
  PollTrendPoint,
} from "./pollProjections";
import type {
  ElectionPollFilters,
  ElectionPollListQuery,
  ElectionPollSort,
  PollTrendQuery,
} from "./pollRepository";
import type { RacePage, RacePagination } from "./raceRepository";

export const POLL_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "invalid_date_range",
  "duplicate_slug",
  "race_not_found",
  "race_cycle_mismatch",
  "candidate_not_found",
  "candidate_not_in_race",
  "primary_question_not_found",
  "superseded_poll_not_found",
  "superseded_poll_cycle_mismatch",
  "invalid_status_transition",
  "invalid_methodology",
  "invalid_response_total",
  "conflicting_flags",
] as const;

export type PollValidationErrorCode =
  (typeof POLL_VALIDATION_ERROR_CODES)[number];

export interface PollValidationIssue {
  code: PollValidationErrorCode;
  field: string | null;
  message: string;
}

export interface PollValidationResult {
  valid: boolean;
  issues: readonly PollValidationIssue[];
}

export type PollServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface PollServiceError {
  code: PollServiceErrorCode;
  message: string;
  issues?: readonly PollValidationIssue[];
}

export type PollServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: PollServiceError };

export interface PollQueryOptions {
  filters?: ElectionPollFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionPollSort[];
  includeUnpublished?: boolean;
}

export interface LatestPollOptions {
  electionCycleId: ElectionCycleId;
  raceId?: RaceId;
  limit?: number;
  includeInternal?: boolean;
  includePartisan?: boolean;
  includeUnverified?: boolean;
  includeStale?: boolean;
}

export interface PollStatusTransitionInput {
  pollId: PollId;
  status: PollStatus;
  occurredAt: IsoDateTimeString;
  notes?: string | null;
}

export interface PollStatusTransitionResult {
  poll: ElectionPoll;
  previousStatus: PollStatus;
  currentStatus: PollStatus;
}

export interface PollSupersessionInput {
  pollId: PollId;
  supersededByPollId: PollId | null;
  occurredAt: IsoDateTimeString;
}

export interface ElectionPollService {
  getPollById(id: PollId): Promise<PollServiceResult<ElectionPoll>>;
  getPollBySlug(
    slug: PollSlug,
    electionCycleId?: ElectionCycleId,
  ): Promise<PollServiceResult<ElectionPoll>>;
  getPollSummary(id: PollId): Promise<PollServiceResult<ElectionPollSummary>>;
  getPollDetail(id: PollId): Promise<PollServiceResult<ElectionPollDetail>>;

  listPolls(query?: PollQueryOptions): Promise<RacePage<ElectionPollSummary>>;
  searchPolls(
    query: ElectionPollListQuery,
  ): Promise<RacePage<ElectionPollSummary>>;
  getLatestPolls(
    options: LatestPollOptions,
  ): Promise<readonly ElectionPollSummary[]>;
  getPollsForRace(
    raceId: RaceId,
    query?: PollQueryOptions,
  ): Promise<RacePage<ElectionPollSummary>>;
  getPollsForCandidate(
    candidateId: CandidateId,
    electionCycleId?: ElectionCycleId,
  ): Promise<readonly ElectionPollSummary[]>;
  getTrackingSeries(
    raceId: RaceId,
  ): Promise<readonly ElectionPollSummary[]>;
  getTrendPoints(query: PollTrendQuery): Promise<readonly PollTrendPoint[]>;

  validateCreate(
    input: ElectionPollCreateInput,
  ): Promise<PollValidationResult>;
  validateUpdate(
    id: PollId,
    input: ElectionPollUpdateInput,
  ): Promise<PollValidationResult>;
  validateStatusTransition(
    input: PollStatusTransitionInput,
  ): Promise<PollValidationResult>;

  createPoll(
    input: ElectionPollCreateInput,
  ): Promise<PollServiceResult<ElectionPoll>>;
  updatePoll(
    id: PollId,
    input: ElectionPollUpdateInput,
  ): Promise<PollServiceResult<ElectionPoll>>;
  deletePoll(id: PollId): Promise<PollServiceResult<boolean>>;
  transitionStatus(
    input: PollStatusTransitionInput,
  ): Promise<PollServiceResult<PollStatusTransitionResult>>;
  setSupersedingPoll(
    input: PollSupersessionInput,
  ): Promise<PollServiceResult<ElectionPoll>>;
}

export type ReadonlyElectionPollService = Pick<
  ElectionPollService,
  | "getPollById"
  | "getPollBySlug"
  | "getPollSummary"
  | "getPollDetail"
  | "listPolls"
  | "searchPolls"
  | "getLatestPolls"
  | "getPollsForRace"
  | "getPollsForCandidate"
  | "getTrackingSeries"
  | "getTrendPoints"
>;

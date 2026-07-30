import type {
  CandidateId,
  ElectionCycleId,
  ElectionResultId,
  ElectionResultSlug,
  RaceId,
} from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type {
  ElectionResult,
  ElectionResultCreateInput,
  ElectionResultReportingProgress,
  ElectionResultUpdateInput,
} from "./result";
import type {
  CertificationStatus,
  ElectionResultStatus,
  ResultReportingStatus,
} from "./resultClassifications";
import type {
  ElectionResultDetail,
  ElectionResultSnapshot,
  ElectionResultSummary,
} from "./resultProjections";
import type {
  ElectionResultFilters,
  ElectionResultListQuery,
  ElectionResultSnapshotQuery,
  ElectionResultSort,
} from "./resultRepository";
import type { RacePage, RacePagination } from "./raceRepository";

export const ELECTION_RESULT_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "invalid_vote_total",
  "invalid_vote_share",
  "invalid_reporting_progress",
  "duplicate_candidate",
  "candidate_not_in_race",
  "candidate_cycle_mismatch",
  "winner_not_in_result",
  "leader_not_in_result",
  "runoff_candidate_not_in_result",
  "conflicting_winner_statuses",
  "invalid_status_transition",
  "invalid_certification_transition",
  "duplicate_race_result",
] as const;

export type ElectionResultValidationErrorCode =
  (typeof ELECTION_RESULT_VALIDATION_ERROR_CODES)[number];

export interface ElectionResultValidationIssue {
  code: ElectionResultValidationErrorCode;
  field: string | null;
  message: string;
}

export interface ElectionResultValidationResult {
  valid: boolean;
  issues: readonly ElectionResultValidationIssue[];
}

export type ElectionResultServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface ElectionResultServiceError {
  code: ElectionResultServiceErrorCode;
  message: string;
  issues?: readonly ElectionResultValidationIssue[];
}

export type ElectionResultServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ElectionResultServiceError };

export interface ElectionResultQueryOptions {
  filters?: ElectionResultFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionResultSort[];
  includeUnpublished?: boolean;
}

export interface LiveElectionResultOptions {
  electionCycleId: ElectionCycleId;
  limit?: number;
  includeUnverified?: boolean;
  includeStale?: boolean;
}

export interface ElectionResultStatusTransitionInput {
  resultId: ElectionResultId;
  status: ElectionResultStatus;
  occurredAt: IsoDateTimeString;
  leaderCandidateId?: CandidateId | null;
  winnerCandidateId?: CandidateId | null;
  runoffCandidateIds?: readonly CandidateId[];
  notes?: string | null;
}

export interface ElectionResultStatusTransitionResult {
  result: ElectionResult;
  previousStatus: ElectionResultStatus;
  currentStatus: ElectionResultStatus;
}

export interface ElectionResultReportingUpdateInput {
  resultId: ElectionResultId;
  reportingStatus: ResultReportingStatus;
  reporting: ElectionResultReportingProgress;
  totalVotes: number;
  lastVoteUpdateAt: IsoDateTimeString;
}

export interface ElectionResultCertificationInput {
  resultId: ElectionResultId;
  certificationStatus: CertificationStatus;
  certifiedAt?: IsoDateTimeString | null;
  certificationDocumentUrl?: string | null;
  notes?: string | null;
}

export interface ElectionResultCertificationResult {
  result: ElectionResult;
  previousStatus: CertificationStatus;
  currentStatus: CertificationStatus;
}

export interface ElectionResultWinnerUpdateInput {
  resultId: ElectionResultId;
  leaderCandidateId?: CandidateId | null;
  winnerCandidateId?: CandidateId | null;
  runoffCandidateIds?: readonly CandidateId[];
  calledAt?: IsoDateTimeString | null;
}

export interface ElectionResultService {
  getResultById(
    id: ElectionResultId,
  ): Promise<ElectionResultServiceResult<ElectionResult>>;
  getResultBySlug(
    slug: ElectionResultSlug,
    electionCycleId?: ElectionCycleId,
  ): Promise<ElectionResultServiceResult<ElectionResult>>;
  getResultByRaceId(
    raceId: RaceId,
  ): Promise<ElectionResultServiceResult<ElectionResult>>;
  getResultSummary(
    id: ElectionResultId,
  ): Promise<ElectionResultServiceResult<ElectionResultSummary>>;
  getResultDetail(
    id: ElectionResultId,
  ): Promise<ElectionResultServiceResult<ElectionResultDetail>>;
  getResultDetailByRaceId(
    raceId: RaceId,
  ): Promise<ElectionResultServiceResult<ElectionResultDetail>>;

  listResults(
    query?: ElectionResultQueryOptions,
  ): Promise<RacePage<ElectionResultSummary>>;
  searchResults(
    query: ElectionResultListQuery,
  ): Promise<RacePage<ElectionResultSummary>>;
  getLiveResults(
    options: LiveElectionResultOptions,
  ): Promise<readonly ElectionResultSummary[]>;
  getCertifiedResults(
    electionCycleId: ElectionCycleId,
    limit?: number,
  ): Promise<readonly ElectionResultSummary[]>;
  getResultsForCandidate(
    candidateId: CandidateId,
  ): Promise<readonly ElectionResultSummary[]>;
  getSnapshots(
    query: ElectionResultSnapshotQuery,
  ): Promise<readonly ElectionResultSnapshot[]>;

  validateCreate(
    input: ElectionResultCreateInput,
  ): Promise<ElectionResultValidationResult>;
  validateUpdate(
    id: ElectionResultId,
    input: ElectionResultUpdateInput,
  ): Promise<ElectionResultValidationResult>;
  validateStatusTransition(
    input: ElectionResultStatusTransitionInput,
  ): Promise<ElectionResultValidationResult>;
  validateCertification(
    input: ElectionResultCertificationInput,
  ): Promise<ElectionResultValidationResult>;

  createResult(
    input: ElectionResultCreateInput,
  ): Promise<ElectionResultServiceResult<ElectionResult>>;
  updateResult(
    id: ElectionResultId,
    input: ElectionResultUpdateInput,
  ): Promise<ElectionResultServiceResult<ElectionResult>>;
  deleteResult(
    id: ElectionResultId,
  ): Promise<ElectionResultServiceResult<boolean>>;

  updateReporting(
    input: ElectionResultReportingUpdateInput,
  ): Promise<ElectionResultServiceResult<ElectionResult>>;
  updateWinner(
    input: ElectionResultWinnerUpdateInput,
  ): Promise<ElectionResultServiceResult<ElectionResult>>;
  transitionStatus(
    input: ElectionResultStatusTransitionInput,
  ): Promise<ElectionResultServiceResult<ElectionResultStatusTransitionResult>>;
  updateCertification(
    input: ElectionResultCertificationInput,
  ): Promise<ElectionResultServiceResult<ElectionResultCertificationResult>>;
  captureSnapshot(
    resultId: ElectionResultId,
    capturedAt: IsoDateTimeString,
  ): Promise<ElectionResultServiceResult<ElectionResultSnapshot>>;
}

export type ReadonlyElectionResultService = Pick<
  ElectionResultService,
  | "getResultById"
  | "getResultBySlug"
  | "getResultByRaceId"
  | "getResultSummary"
  | "getResultDetail"
  | "getResultDetailByRaceId"
  | "listResults"
  | "searchResults"
  | "getLiveResults"
  | "getCertifiedResults"
  | "getResultsForCandidate"
  | "getSnapshots"
>;

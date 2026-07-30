import type {
  CandidateId,
  CandidateSlug,
  ElectionCycleId,
  ElectionEntityId,
  RaceId,
} from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type {
  ElectionCandidate,
  ElectionCandidateCreateInput,
  ElectionCandidateUpdateInput,
} from "./candidate";
import type {
  BallotAccessStatus,
  CampaignStatus,
  CandidateFilingStatus,
  CandidateStatus,
} from "./candidateClassifications";
import type {
  CandidateDetail,
  CandidateEndorsementSummary,
  CandidateSummary,
} from "./candidateProjections";
import type {
  CandidateFilters,
  CandidateListQuery,
  CandidateSort,
} from "./candidateRepository";
import type { RacePage, RacePagination } from "./raceRepository";

export const CANDIDATE_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_slug",
  "race_not_found",
  "race_cycle_mismatch",
  "primary_race_not_assigned",
  "office_not_found",
  "invalid_status_transition",
  "invalid_filing_transition",
  "invalid_campaign_transition",
  "invalid_ballot_access_transition",
  "conflicting_dates",
  "conflicting_flags",
] as const;

export type CandidateValidationErrorCode =
  (typeof CANDIDATE_VALIDATION_ERROR_CODES)[number];

export interface CandidateValidationIssue {
  code: CandidateValidationErrorCode;
  field: string | null;
  message: string;
}

export interface CandidateValidationResult {
  valid: boolean;
  issues: readonly CandidateValidationIssue[];
}

export type CandidateServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface CandidateServiceError {
  code: CandidateServiceErrorCode;
  message: string;
  issues?: readonly CandidateValidationIssue[];
}

export type CandidateServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: CandidateServiceError };

export interface CandidateQueryOptions {
  filters?: CandidateFilters;
  pagination?: RacePagination;
  sort?: readonly CandidateSort[];
  includeUnpublished?: boolean;
}

export interface FeaturedCandidateOptions {
  electionCycleId: ElectionCycleId;
  limit?: number;
  includeUnverified?: boolean;
  includeStale?: boolean;
}

export interface CandidateRaceAssignmentInput {
  candidateId: CandidateId;
  raceIds: readonly RaceId[];
  primaryRaceId?: RaceId | null;
}

export interface CandidateOfficeAssignmentInput {
  candidateId: CandidateId;
  currentOfficeId: ElectionEntityId | null;
  currentOfficeName?: string | null;
}

export interface CandidateFeatureUpdateInput {
  featured?: boolean;
  endorsed?: boolean;
}

export interface CandidateStatusTransitionInput {
  candidateId: CandidateId;
  status: CandidateStatus;
  occurredAt: IsoDateTimeString;
  notes?: string | null;
}

export interface CandidateStatusTransitionResult {
  candidate: ElectionCandidate;
  previousStatus: CandidateStatus;
  currentStatus: CandidateStatus;
}

export interface CandidateFilingTransitionInput {
  candidateId: CandidateId;
  filingStatus: CandidateFilingStatus;
  occurredAt: IsoDateTimeString;
  notes?: string | null;
}

export interface CandidateCampaignTransitionInput {
  candidateId: CandidateId;
  campaignStatus: CampaignStatus;
  occurredAt: IsoDateTimeString;
  notes?: string | null;
}

export interface CandidateBallotAccessTransitionInput {
  candidateId: CandidateId;
  ballotAccessStatus: BallotAccessStatus;
  occurredAt: IsoDateTimeString;
  notes?: string | null;
}

export interface CandidateEndorsementUpdateInput {
  candidateId: CandidateId;
  endorsements: readonly CandidateEndorsementSummary[];
}

export interface CandidateService {
  getCandidateById(id: CandidateId): Promise<CandidateServiceResult<ElectionCandidate>>;
  getCandidateBySlug(
    slug: CandidateSlug,
    electionCycleId?: ElectionCycleId,
  ): Promise<CandidateServiceResult<ElectionCandidate>>;
  getCandidateSummary(id: CandidateId): Promise<CandidateServiceResult<CandidateSummary>>;
  getCandidateDetail(id: CandidateId): Promise<CandidateServiceResult<CandidateDetail>>;

  listCandidates(query?: CandidateQueryOptions): Promise<RacePage<CandidateSummary>>;
  searchCandidates(query: CandidateListQuery): Promise<RacePage<CandidateSummary>>;
  getCandidatesForRace(raceId: RaceId): Promise<readonly CandidateSummary[]>;
  getCandidatesForOffice(officeId: ElectionEntityId): Promise<readonly CandidateSummary[]>;
  getFeaturedCandidates(
    options: FeaturedCandidateOptions,
  ): Promise<readonly CandidateSummary[]>;
  getEndorsedCandidates(
    electionCycleId: ElectionCycleId,
    limit?: number,
  ): Promise<readonly CandidateSummary[]>;

  validateCreate(
    input: ElectionCandidateCreateInput,
  ): Promise<CandidateValidationResult>;
  validateUpdate(
    id: CandidateId,
    input: ElectionCandidateUpdateInput,
  ): Promise<CandidateValidationResult>;
  validateStatusTransition(
    input: CandidateStatusTransitionInput,
  ): Promise<CandidateValidationResult>;
  validateFilingTransition(
    input: CandidateFilingTransitionInput,
  ): Promise<CandidateValidationResult>;
  validateCampaignTransition(
    input: CandidateCampaignTransitionInput,
  ): Promise<CandidateValidationResult>;
  validateBallotAccessTransition(
    input: CandidateBallotAccessTransitionInput,
  ): Promise<CandidateValidationResult>;

  createCandidate(
    input: ElectionCandidateCreateInput,
  ): Promise<CandidateServiceResult<ElectionCandidate>>;
  updateCandidate(
    id: CandidateId,
    input: ElectionCandidateUpdateInput,
  ): Promise<CandidateServiceResult<ElectionCandidate>>;
  deleteCandidate(id: CandidateId): Promise<CandidateServiceResult<boolean>>;

  assignRaces(
    input: CandidateRaceAssignmentInput,
  ): Promise<CandidateServiceResult<ElectionCandidate>>;
  assignCurrentOffice(
    input: CandidateOfficeAssignmentInput,
  ): Promise<CandidateServiceResult<ElectionCandidate>>;
  updateCandidateFlags(
    id: CandidateId,
    input: CandidateFeatureUpdateInput,
  ): Promise<CandidateServiceResult<ElectionCandidate>>;
  updateEndorsements(
    input: CandidateEndorsementUpdateInput,
  ): Promise<CandidateServiceResult<CandidateDetail>>;
  transitionStatus(
    input: CandidateStatusTransitionInput,
  ): Promise<CandidateServiceResult<CandidateStatusTransitionResult>>;
  transitionFilingStatus(
    input: CandidateFilingTransitionInput,
  ): Promise<CandidateServiceResult<ElectionCandidate>>;
  transitionCampaignStatus(
    input: CandidateCampaignTransitionInput,
  ): Promise<CandidateServiceResult<ElectionCandidate>>;
  transitionBallotAccessStatus(
    input: CandidateBallotAccessTransitionInput,
  ): Promise<CandidateServiceResult<ElectionCandidate>>;
}

export type ReadonlyCandidateService = Pick<
  CandidateService,
  | "getCandidateById"
  | "getCandidateBySlug"
  | "getCandidateSummary"
  | "getCandidateDetail"
  | "listCandidates"
  | "searchCandidates"
  | "getCandidatesForRace"
  | "getCandidatesForOffice"
  | "getFeaturedCandidates"
  | "getEndorsedCandidates"
>;

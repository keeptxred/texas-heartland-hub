import type { CandidateId, ElectionCycleId, RaceId, RaceSlug } from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type {
  ElectionRace,
  ElectionRaceCreateInput,
  ElectionRaceUpdateInput,
} from "./race";
import type { RaceStatus } from "./raceClassifications";
import type { RaceDetail, RaceSummary } from "./raceProjections";
import type {
  RaceFilters,
  RaceListQuery,
  RacePage,
  RacePagination,
  RaceSort,
} from "./raceRepository";

export const RACE_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "invalid_date_range",
  "duplicate_slug",
  "candidate_not_found",
  "candidate_cycle_mismatch",
  "incumbent_not_in_race",
  "winner_not_in_race",
  "invalid_status_transition",
  "conflicting_flags",
] as const;

export type RaceValidationErrorCode =
  (typeof RACE_VALIDATION_ERROR_CODES)[number];

export interface RaceValidationIssue {
  code: RaceValidationErrorCode;
  field: string | null;
  message: string;
}

export interface RaceValidationResult {
  valid: boolean;
  issues: readonly RaceValidationIssue[];
}

export type RaceServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface RaceServiceError {
  code: RaceServiceErrorCode;
  message: string;
  issues?: readonly RaceValidationIssue[];
}

export type RaceServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: RaceServiceError };

export interface RaceQueryOptions {
  filters?: RaceFilters;
  pagination?: RacePagination;
  sort?: readonly RaceSort[];
  includeUnpublished?: boolean;
}

export interface FeaturedRaceOptions {
  electionCycleId: ElectionCycleId;
  limit?: number;
  includeUnverified?: boolean;
  includeStale?: boolean;
}

export interface RaceStatusTransitionInput {
  raceId: RaceId;
  status: RaceStatus;
  occurredAt: IsoDateTimeString;
  winnerCandidateId?: CandidateId | null;
  notes?: string | null;
}

export interface RaceStatusTransitionResult {
  race: ElectionRace;
  previousStatus: RaceStatus;
  currentStatus: RaceStatus;
}

export interface RaceFeatureUpdateInput {
  featured?: boolean;
  competitive?: boolean;
  uncontested?: boolean;
}

export interface RaceCandidateAssignmentInput {
  raceId: RaceId;
  candidateIds: readonly CandidateId[];
  incumbentCandidateId?: CandidateId | null;
}

export interface RaceService {
  getRaceById(id: RaceId): Promise<RaceServiceResult<ElectionRace>>;
  getRaceBySlug(
    slug: RaceSlug,
    electionCycleId?: ElectionCycleId,
  ): Promise<RaceServiceResult<ElectionRace>>;
  getRaceSummary(id: RaceId): Promise<RaceServiceResult<RaceSummary>>;
  getRaceDetail(id: RaceId): Promise<RaceServiceResult<RaceDetail>>;

  listRaces(query?: RaceQueryOptions): Promise<RacePage<RaceSummary>>;
  searchRaces(query: RaceListQuery): Promise<RacePage<RaceSummary>>;
  getFeaturedRaces(
    options: FeaturedRaceOptions,
  ): Promise<readonly RaceSummary[]>;
  getCompetitiveRaces(
    electionCycleId: ElectionCycleId,
    limit?: number,
  ): Promise<readonly RaceSummary[]>;
  getRacesForCandidate(
    candidateId: CandidateId,
  ): Promise<readonly RaceSummary[]>;

  validateCreate(
    input: ElectionRaceCreateInput,
  ): Promise<RaceValidationResult>;
  validateUpdate(
    id: RaceId,
    input: ElectionRaceUpdateInput,
  ): Promise<RaceValidationResult>;
  validateStatusTransition(
    input: RaceStatusTransitionInput,
  ): Promise<RaceValidationResult>;

  createRace(
    input: ElectionRaceCreateInput,
  ): Promise<RaceServiceResult<ElectionRace>>;
  updateRace(
    id: RaceId,
    input: ElectionRaceUpdateInput,
  ): Promise<RaceServiceResult<ElectionRace>>;
  deleteRace(id: RaceId): Promise<RaceServiceResult<boolean>>;

  updateRaceFlags(
    id: RaceId,
    input: RaceFeatureUpdateInput,
  ): Promise<RaceServiceResult<ElectionRace>>;
  assignCandidates(
    input: RaceCandidateAssignmentInput,
  ): Promise<RaceServiceResult<ElectionRace>>;
  transitionStatus(
    input: RaceStatusTransitionInput,
  ): Promise<RaceServiceResult<RaceStatusTransitionResult>>;
}

export type ReadonlyRaceService = Pick<
  RaceService,
  | "getRaceById"
  | "getRaceBySlug"
  | "getRaceSummary"
  | "getRaceDetail"
  | "listRaces"
  | "searchRaces"
  | "getFeaturedRaces"
  | "getCompetitiveRaces"
  | "getRacesForCandidate"
>;

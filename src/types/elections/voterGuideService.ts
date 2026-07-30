import type { ElectionCycleId, VoterGuideId, VoterGuideSlug } from "./identifiers";
import type { RacePage, RacePagination } from "./raceRepository";
import type { VoterGuide, VoterGuideCreateInput, VoterGuideUpdateInput } from "./voterGuide";
import type { ElectionCycleVoterGuideDirectory, VoterGuideDetail, VoterGuideSummary } from "./voterGuideProjections";
import type { VoterGuideFilters, VoterGuideListQuery, VoterGuideSort } from "./voterGuideRepository";

export const VOTER_GUIDE_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_guide",
  "empty_sections",
  "invalid_status_transition",
] as const;
export type VoterGuideValidationErrorCode = (typeof VOTER_GUIDE_VALIDATION_ERROR_CODES)[number];

export interface VoterGuideValidationIssue {
  code: VoterGuideValidationErrorCode;
  field: string | null;
  message: string;
}

export interface VoterGuideValidationResult {
  valid: boolean;
  issues: readonly VoterGuideValidationIssue[];
}

export type VoterGuideServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface VoterGuideServiceError {
  code: VoterGuideServiceErrorCode;
  message: string;
  issues?: readonly VoterGuideValidationIssue[];
}

export type VoterGuideServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: VoterGuideServiceError };

export interface VoterGuideQueryOptions {
  filters?: VoterGuideFilters;
  pagination?: RacePagination;
  sort?: readonly VoterGuideSort[];
  includeUnpublished?: boolean;
}

export interface VoterGuideService {
  getGuideById(id: VoterGuideId): Promise<VoterGuideServiceResult<VoterGuide>>;
  getGuideBySlug(slug: VoterGuideSlug): Promise<VoterGuideServiceResult<VoterGuide>>;
  getGuideDetail(id: VoterGuideId): Promise<VoterGuideServiceResult<VoterGuideDetail>>;
  listGuides(query?: VoterGuideQueryOptions): Promise<RacePage<VoterGuideSummary>>;
  searchGuides(query: VoterGuideListQuery): Promise<RacePage<VoterGuideSummary>>;
  getElectionCycleDirectory(electionCycleId: ElectionCycleId): Promise<ElectionCycleVoterGuideDirectory>;
  validateCreate(input: VoterGuideCreateInput): Promise<VoterGuideValidationResult>;
  validateUpdate(id: VoterGuideId, input: VoterGuideUpdateInput): Promise<VoterGuideValidationResult>;
  createGuide(input: VoterGuideCreateInput): Promise<VoterGuideServiceResult<VoterGuide>>;
  updateGuide(id: VoterGuideId, input: VoterGuideUpdateInput): Promise<VoterGuideServiceResult<VoterGuide>>;
  deleteGuide(id: VoterGuideId): Promise<VoterGuideServiceResult<boolean>>;
}

export type ReadonlyVoterGuideService = Pick<
  VoterGuideService,
  "getGuideById" | "getGuideBySlug" | "getGuideDetail" | "listGuides" | "searchGuides" | "getElectionCycleDirectory"
>;

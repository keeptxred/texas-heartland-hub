import type { ElectionEndorsement, ElectionEndorsementCreateInput, ElectionEndorsementUpdateInput } from "./endorsement";
import type { ElectionEndorsementDetail, ElectionEndorsementSummary } from "./endorsementProjections";
import type { EndorsementFilters, EndorsementListQuery, EndorsementSort } from "./endorsementRepository";
import type { EndorsementId, EndorsementSlug } from "./identifiers";
import type { RacePage, RacePagination } from "./raceRepository";

export const ENDORSEMENT_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "invalid_target",
  "invalid_date_order",
  "duplicate_slug",
  "duplicate_endorsement",
  "invalid_status_transition",
] as const;
export type EndorsementValidationErrorCode = (typeof ENDORSEMENT_VALIDATION_ERROR_CODES)[number];

export interface EndorsementValidationIssue {
  code: EndorsementValidationErrorCode;
  field: string | null;
  message: string;
}

export interface EndorsementValidationResult {
  valid: boolean;
  issues: readonly EndorsementValidationIssue[];
}

export type EndorsementServiceErrorCode = "not_found" | "validation_failed" | "conflict" | "forbidden" | "repository_error";
export interface EndorsementServiceError {
  code: EndorsementServiceErrorCode;
  message: string;
  issues?: readonly EndorsementValidationIssue[];
}
export type EndorsementServiceResult<T> = { ok: true; value: T } | { ok: false; error: EndorsementServiceError };

export interface EndorsementQueryOptions {
  filters?: EndorsementFilters;
  pagination?: RacePagination;
  sort?: readonly EndorsementSort[];
  includeUnpublished?: boolean;
}

export interface ElectionEndorsementService {
  getEndorsementById(id: EndorsementId): Promise<EndorsementServiceResult<ElectionEndorsement>>;
  getEndorsementBySlug(slug: EndorsementSlug): Promise<EndorsementServiceResult<ElectionEndorsement>>;
  getEndorsementSummary(id: EndorsementId): Promise<EndorsementServiceResult<ElectionEndorsementSummary>>;
  getEndorsementDetail(id: EndorsementId): Promise<EndorsementServiceResult<ElectionEndorsementDetail>>;
  listEndorsements(query?: EndorsementQueryOptions): Promise<RacePage<ElectionEndorsementSummary>>;
  searchEndorsements(query: EndorsementListQuery): Promise<RacePage<ElectionEndorsementSummary>>;
  validateCreate(input: ElectionEndorsementCreateInput): Promise<EndorsementValidationResult>;
  validateUpdate(id: EndorsementId, input: ElectionEndorsementUpdateInput): Promise<EndorsementValidationResult>;
  createEndorsement(input: ElectionEndorsementCreateInput): Promise<EndorsementServiceResult<ElectionEndorsement>>;
  updateEndorsement(id: EndorsementId, input: ElectionEndorsementUpdateInput): Promise<EndorsementServiceResult<ElectionEndorsement>>;
  deleteEndorsement(id: EndorsementId): Promise<EndorsementServiceResult<boolean>>;
}

export type ReadonlyElectionEndorsementService = Pick<ElectionEndorsementService,
  "getEndorsementById" | "getEndorsementBySlug" | "getEndorsementSummary" | "getEndorsementDetail" | "listEndorsements" | "searchEndorsements"
>;
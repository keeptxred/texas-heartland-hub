import type { OfficeId, OfficeSlug } from "./identifiers";
import type {
  ElectionOffice,
  ElectionOfficeCreateInput,
  ElectionOfficeUpdateInput,
} from "./office";
import type {
  ElectionOfficeDetail,
  ElectionOfficeSummary,
} from "./officeProjections";
import type {
  ElectionOfficeFilters,
  ElectionOfficeListQuery,
  ElectionOfficeSort,
} from "./officeRepository";
import type { RacePage, RacePagination } from "./raceRepository";

export const ELECTION_OFFICE_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "duplicate_slug",
  "invalid_term_length",
  "invalid_seat_count",
  "jurisdiction_required",
  "office_in_use",
] as const;

export type ElectionOfficeValidationErrorCode =
  (typeof ELECTION_OFFICE_VALIDATION_ERROR_CODES)[number];

export interface ElectionOfficeValidationIssue {
  code: ElectionOfficeValidationErrorCode;
  field: string | null;
  message: string;
}

export interface ElectionOfficeValidationResult {
  valid: boolean;
  issues: readonly ElectionOfficeValidationIssue[];
}

export type ElectionOfficeServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface ElectionOfficeServiceError {
  code: ElectionOfficeServiceErrorCode;
  message: string;
  issues?: readonly ElectionOfficeValidationIssue[];
}

export type ElectionOfficeServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ElectionOfficeServiceError };

export interface ElectionOfficeQueryOptions {
  filters?: ElectionOfficeFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionOfficeSort[];
  includeInactive?: boolean;
}

export interface ElectionOfficeService {
  getOfficeById(id: OfficeId): Promise<ElectionOfficeServiceResult<ElectionOffice>>;
  getOfficeBySlug(
    slug: OfficeSlug,
  ): Promise<ElectionOfficeServiceResult<ElectionOffice>>;
  getOfficeSummary(
    id: OfficeId,
  ): Promise<ElectionOfficeServiceResult<ElectionOfficeSummary>>;
  getOfficeDetail(
    id: OfficeId,
  ): Promise<ElectionOfficeServiceResult<ElectionOfficeDetail>>;
  listOffices(
    query?: ElectionOfficeQueryOptions,
  ): Promise<RacePage<ElectionOfficeSummary>>;
  searchOffices(
    query: ElectionOfficeListQuery,
  ): Promise<RacePage<ElectionOfficeSummary>>;
  validateCreate(
    input: ElectionOfficeCreateInput,
  ): Promise<ElectionOfficeValidationResult>;
  validateUpdate(
    id: OfficeId,
    input: ElectionOfficeUpdateInput,
  ): Promise<ElectionOfficeValidationResult>;
  createOffice(
    input: ElectionOfficeCreateInput,
  ): Promise<ElectionOfficeServiceResult<ElectionOffice>>;
  updateOffice(
    id: OfficeId,
    input: ElectionOfficeUpdateInput,
  ): Promise<ElectionOfficeServiceResult<ElectionOffice>>;
  deleteOffice(id: OfficeId): Promise<ElectionOfficeServiceResult<boolean>>;
}

export type ReadonlyElectionOfficeService = Pick<
  ElectionOfficeService,
  | "getOfficeById"
  | "getOfficeBySlug"
  | "getOfficeSummary"
  | "getOfficeDetail"
  | "listOffices"
  | "searchOffices"
>;
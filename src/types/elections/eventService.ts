import type { ElectionEvent, ElectionEventCreateInput, ElectionEventUpdateInput } from "./event";
import type { ElectionEventDetail, ElectionEventSummary } from "./eventProjections";
import type { ElectionEventFilters, ElectionEventListQuery, ElectionEventSort } from "./eventRepository";
import type { ElectionEventId, ElectionEventSlug } from "./identifiers";
import type { RacePage, RacePagination } from "./raceRepository";

export const ELECTION_EVENT_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "invalid_date_order",
  "invalid_time_zone",
  "duplicate_slug",
  "invalid_status_transition",
] as const;

export type ElectionEventValidationErrorCode = (typeof ELECTION_EVENT_VALIDATION_ERROR_CODES)[number];

export interface ElectionEventValidationIssue {
  code: ElectionEventValidationErrorCode;
  field: string | null;
  message: string;
}

export interface ElectionEventValidationResult {
  valid: boolean;
  issues: readonly ElectionEventValidationIssue[];
}

export type ElectionEventServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface ElectionEventServiceError {
  code: ElectionEventServiceErrorCode;
  message: string;
  issues?: readonly ElectionEventValidationIssue[];
}

export type ElectionEventServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ElectionEventServiceError };

export interface ElectionEventQueryOptions {
  filters?: ElectionEventFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionEventSort[];
  includeUnpublished?: boolean;
}

export interface ElectionEventService {
  getEventById(id: ElectionEventId): Promise<ElectionEventServiceResult<ElectionEvent>>;
  getEventBySlug(slug: ElectionEventSlug): Promise<ElectionEventServiceResult<ElectionEvent>>;
  getEventSummary(id: ElectionEventId): Promise<ElectionEventServiceResult<ElectionEventSummary>>;
  getEventDetail(id: ElectionEventId): Promise<ElectionEventServiceResult<ElectionEventDetail>>;
  listEvents(query?: ElectionEventQueryOptions): Promise<RacePage<ElectionEventSummary>>;
  searchEvents(query: ElectionEventListQuery): Promise<RacePage<ElectionEventSummary>>;
  getUpcomingEvents(limit?: number, query?: ElectionEventQueryOptions): Promise<readonly ElectionEventSummary[]>;
  validateCreate(input: ElectionEventCreateInput): Promise<ElectionEventValidationResult>;
  validateUpdate(id: ElectionEventId, input: ElectionEventUpdateInput): Promise<ElectionEventValidationResult>;
  createEvent(input: ElectionEventCreateInput): Promise<ElectionEventServiceResult<ElectionEvent>>;
  updateEvent(id: ElectionEventId, input: ElectionEventUpdateInput): Promise<ElectionEventServiceResult<ElectionEvent>>;
  deleteEvent(id: ElectionEventId): Promise<ElectionEventServiceResult<boolean>>;
}

export type ReadonlyElectionEventService = Pick<
  ElectionEventService,
  | "getEventById"
  | "getEventBySlug"
  | "getEventSummary"
  | "getEventDetail"
  | "listEvents"
  | "searchEvents"
  | "getUpcomingEvents"
>;

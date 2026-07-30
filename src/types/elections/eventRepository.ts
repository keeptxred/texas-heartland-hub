import type { ElectionEvent, ElectionEventCreateInput, ElectionEventUpdateInput } from "./event";
import type { ElectionEventStatus, ElectionEventType } from "./eventClassifications";
import type { ElectionEventDetail, ElectionEventSummary } from "./eventProjections";
import type { CountyId, DistrictId, ElectionCycleId, ElectionEventId, ElectionEventSlug, RaceId } from "./identifiers";
import type { ElectionFreshnessStatus, ElectionPublicationStatus, ElectionVerificationStatus, IsoDateTimeString } from "./metadata";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const ELECTION_EVENT_SORT_FIELDS = ["starts_at", "ends_at", "title", "type", "updated_at"] as const;
export type ElectionEventSortField = (typeof ELECTION_EVENT_SORT_FIELDS)[number];

export interface ElectionEventSort {
  field: ElectionEventSortField;
  direction: SortDirection;
}

export interface ElectionEventFilters {
  ids?: readonly ElectionEventId[];
  electionCycleIds?: readonly ElectionCycleId[];
  raceIds?: readonly RaceId[];
  countyIds?: readonly CountyId[];
  districtIds?: readonly DistrictId[];
  types?: readonly ElectionEventType[];
  statuses?: readonly ElectionEventStatus[];
  publicationStatuses?: readonly ElectionPublicationStatus[];
  verificationStatuses?: readonly ElectionVerificationStatus[];
  freshnessStatuses?: readonly ElectionFreshnessStatus[];
  startsFrom?: IsoDateTimeString;
  startsTo?: IsoDateTimeString;
  search?: string;
}

export interface ElectionEventListQuery {
  filters?: ElectionEventFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionEventSort[];
}

export interface ElectionEventRepository {
  findById(id: ElectionEventId): Promise<ElectionEvent | null>;
  findBySlug(slug: ElectionEventSlug): Promise<ElectionEvent | null>;
  findSummaryById(id: ElectionEventId): Promise<ElectionEventSummary | null>;
  findDetailById(id: ElectionEventId): Promise<ElectionEventDetail | null>;
  list(query?: ElectionEventListQuery): Promise<RacePage<ElectionEventSummary>>;
  listCore(query?: ElectionEventListQuery): Promise<RacePage<ElectionEvent>>;
  listUpcoming(limit?: number, query?: ElectionEventListQuery): Promise<readonly ElectionEventSummary[]>;
  count(filters?: ElectionEventFilters): Promise<number>;
  create(input: ElectionEventCreateInput): Promise<ElectionEvent>;
  update(id: ElectionEventId, input: ElectionEventUpdateInput): Promise<ElectionEvent>;
  delete(id: ElectionEventId): Promise<boolean>;
}

export type ReadonlyElectionEventRepository = Pick<
  ElectionEventRepository,
  "findById" | "findBySlug" | "findSummaryById" | "findDetailById" | "list" | "listCore" | "listUpcoming" | "count"
>;

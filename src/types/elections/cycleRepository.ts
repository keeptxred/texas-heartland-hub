import type { ElectionStatus } from "./domain";
import type {
  ElectionCycleId,
  ElectionCycleSlug,
} from "./identifiers";
import type {
  ElectionFreshnessStatus,
  ElectionPublicationStatus,
  ElectionVerificationStatus,
  IsoDateString,
} from "./metadata";
import type {
  ElectionCycleCreateInput,
  ElectionCycleRecord,
  ElectionCycleUpdateInput,
} from "./cycle";
import type {
  ElectionCycleDetail,
  ElectionCycleSummary,
} from "./cycleProjections";
import type {
  RacePage,
  RacePagination,
  SortDirection,
} from "./raceRepository";

export const ELECTION_CYCLE_SORT_FIELDS = [
  "year",
  "election_date",
  "updated_at",
  "name",
  "status",
] as const;

export type ElectionCycleSortField =
  (typeof ELECTION_CYCLE_SORT_FIELDS)[number];

export interface ElectionCycleSort {
  field: ElectionCycleSortField;
  direction: SortDirection;
}

export interface ElectionCycleFilters {
  ids?: readonly ElectionCycleId[];
  years?: readonly number[];
  stateCodes?: readonly string[];
  statuses?: readonly ElectionStatus[];
  publicationStatuses?: readonly ElectionPublicationStatus[];
  verificationStatuses?: readonly ElectionVerificationStatus[];
  freshnessStatuses?: readonly ElectionFreshnessStatus[];
  electionDateFrom?: IsoDateString;
  electionDateTo?: IsoDateString;
  active?: boolean;
  featured?: boolean;
  search?: string;
}

export interface ElectionCycleListQuery {
  filters?: ElectionCycleFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionCycleSort[];
}

export interface ElectionCycleLookup {
  id?: ElectionCycleId;
  slug?: ElectionCycleSlug;
  year?: number;
  stateCode?: string;
}

export interface ElectionCycleRepository {
  findById(id: ElectionCycleId): Promise<ElectionCycleRecord | null>;
  findBySlug(slug: ElectionCycleSlug): Promise<ElectionCycleRecord | null>;
  findByYear(year: number, stateCode?: string): Promise<ElectionCycleRecord | null>;
  findActive(stateCode?: string): Promise<ElectionCycleRecord | null>;
  findSummaryById(id: ElectionCycleId): Promise<ElectionCycleSummary | null>;
  findDetailById(id: ElectionCycleId): Promise<ElectionCycleDetail | null>;

  list(
    query?: ElectionCycleListQuery,
  ): Promise<RacePage<ElectionCycleSummary>>;
  listCore(
    query?: ElectionCycleListQuery,
  ): Promise<RacePage<ElectionCycleRecord>>;
  listUpcoming(
    stateCode?: string,
    limit?: number,
  ): Promise<readonly ElectionCycleSummary[]>;

  count(filters?: ElectionCycleFilters): Promise<number>;
  exists(lookup: ElectionCycleLookup): Promise<boolean>;

  create(input: ElectionCycleCreateInput): Promise<ElectionCycleRecord>;
  update(
    id: ElectionCycleId,
    input: ElectionCycleUpdateInput,
  ): Promise<ElectionCycleRecord>;
  delete(id: ElectionCycleId): Promise<boolean>;
}

export type ReadonlyElectionCycleRepository = Pick<
  ElectionCycleRepository,
  | "findById"
  | "findBySlug"
  | "findByYear"
  | "findActive"
  | "findSummaryById"
  | "findDetailById"
  | "list"
  | "listCore"
  | "listUpcoming"
  | "count"
  | "exists"
>;

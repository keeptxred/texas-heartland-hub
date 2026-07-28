import type { CandidateId, ElectionCycleId, ForecastId, ForecastSlug, RaceId } from "./identifiers";
import type {
  ElectionFreshnessStatus,
  ElectionPublicationStatus,
  ElectionVerificationStatus,
  IsoDateTimeString,
} from "./metadata";
import type {
  ElectionForecast,
  ElectionForecastCreateInput,
  ElectionForecastUpdateInput,
} from "./forecast";
import type {
  ForecastConfidenceLevel,
  ForecastModel,
  ForecastRating,
  ForecastStatus,
} from "./forecastClassifications";
import type {
  ElectionForecastDetail,
  ElectionForecastSnapshot,
  ElectionForecastSummary,
} from "./forecastProjections";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const ELECTION_FORECAST_SORT_FIELDS = [
  "updated_at",
  "published_at",
  "rating",
  "confidence_level",
  "projected_margin",
] as const;

export type ElectionForecastSortField = (typeof ELECTION_FORECAST_SORT_FIELDS)[number];

export interface ElectionForecastSort {
  field: ElectionForecastSortField;
  direction: SortDirection;
}

export interface ElectionForecastFilters {
  electionCycleIds?: readonly ElectionCycleId[];
  raceIds?: readonly RaceId[];
  candidateIds?: readonly CandidateId[];
  sourceIds?: readonly string[];
  statuses?: readonly ForecastStatus[];
  ratings?: readonly ForecastRating[];
  confidenceLevels?: readonly ForecastConfidenceLevel[];
  models?: readonly ForecastModel[];
  publicationStatuses?: readonly ElectionPublicationStatus[];
  verificationStatuses?: readonly ElectionVerificationStatus[];
  freshnessStatuses?: readonly ElectionFreshnessStatus[];
  updatedFrom?: IsoDateTimeString;
  updatedTo?: IsoDateTimeString;
  active?: boolean;
  final?: boolean;
  search?: string;
}

export interface ElectionForecastListQuery {
  filters?: ElectionForecastFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionForecastSort[];
}

export interface ElectionForecastLookup {
  id?: ForecastId;
  slug?: ForecastSlug;
  raceId?: RaceId;
  electionCycleId?: ElectionCycleId;
}

export interface ElectionForecastSnapshotQuery {
  forecastId: ForecastId;
  capturedFrom?: IsoDateTimeString;
  capturedTo?: IsoDateTimeString;
  limit?: number;
  direction?: SortDirection;
}

export interface ElectionForecastRepository {
  findById(id: ForecastId): Promise<ElectionForecast | null>;
  findBySlug(
    slug: ForecastSlug,
    electionCycleId?: ElectionCycleId,
  ): Promise<ElectionForecast | null>;
  findByRaceId(raceId: RaceId): Promise<ElectionForecast | null>;
  findSummaryById(id: ForecastId): Promise<ElectionForecastSummary | null>;
  findDetailById(id: ForecastId): Promise<ElectionForecastDetail | null>;
  findDetailByRaceId(raceId: RaceId): Promise<ElectionForecastDetail | null>;

  list(query?: ElectionForecastListQuery): Promise<RacePage<ElectionForecastSummary>>;
  listCore(query?: ElectionForecastListQuery): Promise<RacePage<ElectionForecast>>;
  listActive(
    electionCycleId: ElectionCycleId,
    limit?: number,
  ): Promise<readonly ElectionForecastSummary[]>;
  listByCandidate(candidateId: CandidateId): Promise<readonly ElectionForecastSummary[]>;
  listSnapshots(query: ElectionForecastSnapshotQuery): Promise<readonly ElectionForecastSnapshot[]>;

  count(filters?: ElectionForecastFilters): Promise<number>;
  exists(lookup: ElectionForecastLookup): Promise<boolean>;

  create(input: ElectionForecastCreateInput): Promise<ElectionForecast>;
  update(id: ForecastId, input: ElectionForecastUpdateInput): Promise<ElectionForecast>;
  saveSnapshot(snapshot: ElectionForecastSnapshot): Promise<ElectionForecastSnapshot>;
  delete(id: ForecastId): Promise<boolean>;
}

export type ReadonlyElectionForecastRepository = Pick<
  ElectionForecastRepository,
  | "findById"
  | "findBySlug"
  | "findByRaceId"
  | "findSummaryById"
  | "findDetailById"
  | "findDetailByRaceId"
  | "list"
  | "listCore"
  | "listActive"
  | "listByCandidate"
  | "listSnapshots"
  | "count"
  | "exists"
>;

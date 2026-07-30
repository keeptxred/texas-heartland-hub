import type { ElectionBallotMeasure, ElectionBallotMeasureCreateInput, ElectionBallotMeasureUpdateInput } from "./ballotMeasure";
import type { BallotMeasureStatus, BallotMeasureType } from "./ballotMeasureClassifications";
import type { BallotMeasureDetail, BallotMeasureSummary } from "./ballotMeasureProjections";
import type { BallotMeasureId, BallotMeasureSlug, CountyId, DistrictId, ElectionCycleId } from "./identifiers";
import type { ElectionFreshnessStatus, ElectionPublicationStatus, ElectionVerificationStatus, IsoDateString } from "./metadata";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const BALLOT_MEASURE_SORT_FIELDS = [
  "election_date",
  "measure_number",
  "short_title",
  "status",
  "updated_at",
] as const;

export type BallotMeasureSortField = (typeof BALLOT_MEASURE_SORT_FIELDS)[number];

export interface BallotMeasureSort {
  field: BallotMeasureSortField;
  direction: SortDirection;
}

export interface BallotMeasureFilters {
  ids?: readonly BallotMeasureId[];
  electionCycleIds?: readonly ElectionCycleId[];
  countyIds?: readonly CountyId[];
  districtIds?: readonly DistrictId[];
  stateCodes?: readonly string[];
  types?: readonly BallotMeasureType[];
  statuses?: readonly BallotMeasureStatus[];
  publicationStatuses?: readonly ElectionPublicationStatus[];
  verificationStatuses?: readonly ElectionVerificationStatus[];
  freshnessStatuses?: readonly ElectionFreshnessStatus[];
  electionDateFrom?: IsoDateString;
  electionDateTo?: IsoDateString;
  search?: string;
}

export interface BallotMeasureListQuery {
  filters?: BallotMeasureFilters;
  pagination?: RacePagination;
  sort?: readonly BallotMeasureSort[];
}

export interface BallotMeasureLookup {
  id?: BallotMeasureId;
  slug?: BallotMeasureSlug;
  electionCycleId?: ElectionCycleId;
  measureNumber?: string;
}

export interface BallotMeasureRepository {
  findById(id: BallotMeasureId): Promise<ElectionBallotMeasure | null>;
  findBySlug(slug: BallotMeasureSlug): Promise<ElectionBallotMeasure | null>;
  findSummaryById(id: BallotMeasureId): Promise<BallotMeasureSummary | null>;
  findDetailById(id: BallotMeasureId): Promise<BallotMeasureDetail | null>;
  list(query?: BallotMeasureListQuery): Promise<RacePage<BallotMeasureSummary>>;
  listCore(query?: BallotMeasureListQuery): Promise<RacePage<ElectionBallotMeasure>>;
  count(filters?: BallotMeasureFilters): Promise<number>;
  exists(lookup: BallotMeasureLookup): Promise<boolean>;
  create(input: ElectionBallotMeasureCreateInput): Promise<ElectionBallotMeasure>;
  update(id: BallotMeasureId, input: ElectionBallotMeasureUpdateInput): Promise<ElectionBallotMeasure>;
  delete(id: BallotMeasureId): Promise<boolean>;
}

export type ReadonlyBallotMeasureRepository = Pick<
  BallotMeasureRepository,
  "findById" | "findBySlug" | "findSummaryById" | "findDetailById" | "list" | "listCore" | "count" | "exists"
>;

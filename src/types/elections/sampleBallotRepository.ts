import type { CountyId, ElectionCycleId, SampleBallotId, SampleBallotSlug } from "./identifiers";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";
import type { SampleBallot, SampleBallotCreateInput, SampleBallotUpdateInput } from "./sampleBallot";
import type { SampleBallotFormat, SampleBallotPrecisionLevel, SampleBallotStatus } from "./sampleBallotClassifications";
import type { SampleBallotDetail, SampleBallotSummary } from "./sampleBallotProjections";

export const SAMPLE_BALLOT_SORT_FIELDS = ["title", "precision_level", "status", "published_at", "updated_at"] as const;
export type SampleBallotSortField = (typeof SAMPLE_BALLOT_SORT_FIELDS)[number];

export interface SampleBallotSort {
  field: SampleBallotSortField;
  direction: SortDirection;
}

export interface SampleBallotFilters {
  ids?: readonly SampleBallotId[];
  electionCycleIds?: readonly ElectionCycleId[];
  countyIds?: readonly CountyId[];
  precisionLevels?: readonly SampleBallotPrecisionLevel[];
  formats?: readonly SampleBallotFormat[];
  statuses?: readonly SampleBallotStatus[];
  precinctCode?: string;
  ballotStyleCode?: string;
  featured?: boolean;
  verified?: boolean;
  search?: string;
}

export interface SampleBallotListQuery {
  filters?: SampleBallotFilters;
  pagination?: RacePagination;
  sort?: readonly SampleBallotSort[];
}

export interface SampleBallotRepository {
  findById(id: SampleBallotId): Promise<SampleBallot | null>;
  findBySlug(slug: SampleBallotSlug): Promise<SampleBallot | null>;
  findDetailById(id: SampleBallotId): Promise<SampleBallotDetail | null>;
  list(query?: SampleBallotListQuery): Promise<RacePage<SampleBallotSummary>>;
  listCore(query?: SampleBallotListQuery): Promise<RacePage<SampleBallot>>;
  count(filters?: SampleBallotFilters): Promise<number>;
  create(input: SampleBallotCreateInput): Promise<SampleBallot>;
  update(id: SampleBallotId, input: SampleBallotUpdateInput): Promise<SampleBallot>;
  delete(id: SampleBallotId): Promise<boolean>;
}

export type ReadonlySampleBallotRepository = Pick<
  SampleBallotRepository,
  "findById" | "findBySlug" | "findDetailById" | "list" | "listCore" | "count"
>;

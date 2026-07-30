import type { CountyId, CountySlug, ElectionEntityId } from "./identifiers";
import type {
  ElectionCounty,
  ElectionCountyCreateInput,
  ElectionCountyUpdateInput,
} from "./county";
import type {
  ElectionCountyDetail,
  ElectionCountySummary,
} from "./countyProjections";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const ELECTION_COUNTY_SORT_FIELDS = [
  "name",
  "population",
  "fips_code",
  "updated_at",
] as const;

export type ElectionCountySortField =
  (typeof ELECTION_COUNTY_SORT_FIELDS)[number];

export interface ElectionCountySort {
  field: ElectionCountySortField;
  direction: SortDirection;
}

export interface ElectionCountyFilters {
  ids?: readonly CountyId[];
  entityIds?: readonly ElectionEntityId[];
  stateCodes?: readonly string[];
  active?: boolean;
  search?: string;
}

export interface ElectionCountyListQuery {
  filters?: ElectionCountyFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionCountySort[];
}

export interface ElectionCountyLookup {
  id?: CountyId;
  slug?: CountySlug;
  fipsCode?: string;
}

export interface ElectionCountyRepository {
  findById(id: CountyId): Promise<ElectionCounty | null>;
  findBySlug(slug: CountySlug): Promise<ElectionCounty | null>;
  findByFipsCode(fipsCode: string): Promise<ElectionCounty | null>;
  findSummaryById(id: CountyId): Promise<ElectionCountySummary | null>;
  findDetailById(id: CountyId): Promise<ElectionCountyDetail | null>;
  list(query?: ElectionCountyListQuery): Promise<RacePage<ElectionCountySummary>>;
  listCore(query?: ElectionCountyListQuery): Promise<RacePage<ElectionCounty>>;
  count(filters?: ElectionCountyFilters): Promise<number>;
  exists(lookup: ElectionCountyLookup): Promise<boolean>;
  create(input: ElectionCountyCreateInput): Promise<ElectionCounty>;
  update(id: CountyId, input: ElectionCountyUpdateInput): Promise<ElectionCounty>;
  delete(id: CountyId): Promise<boolean>;
}

export type ReadonlyElectionCountyRepository = Pick<
  ElectionCountyRepository,
  | "findById"
  | "findBySlug"
  | "findByFipsCode"
  | "findSummaryById"
  | "findDetailById"
  | "list"
  | "listCore"
  | "count"
  | "exists"
>;
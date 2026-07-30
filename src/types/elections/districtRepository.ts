import type { DistrictId, DistrictSlug, ElectionEntityId } from "./identifiers";
import type {
  ElectionDistrict,
  ElectionDistrictCreateInput,
  ElectionDistrictUpdateInput,
} from "./district";
import type { DistrictType } from "./districtClassifications";
import type {
  ElectionDistrictDetail,
  ElectionDistrictSummary,
} from "./districtProjections";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const ELECTION_DISTRICT_SORT_FIELDS = [
  "name",
  "type",
  "district_number",
  "population",
  "updated_at",
] as const;

export type ElectionDistrictSortField =
  (typeof ELECTION_DISTRICT_SORT_FIELDS)[number];

export interface ElectionDistrictSort {
  field: ElectionDistrictSortField;
  direction: SortDirection;
}

export interface ElectionDistrictFilters {
  ids?: readonly DistrictId[];
  types?: readonly DistrictType[];
  stateCodes?: readonly string[];
  jurisdictionIds?: readonly ElectionEntityId[];
  countyEntityIds?: readonly ElectionEntityId[];
  active?: boolean;
  search?: string;
}

export interface ElectionDistrictListQuery {
  filters?: ElectionDistrictFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionDistrictSort[];
}

export interface ElectionDistrictLookup {
  id?: DistrictId;
  slug?: DistrictSlug;
}

export interface ElectionDistrictRepository {
  findById(id: DistrictId): Promise<ElectionDistrict | null>;
  findBySlug(slug: DistrictSlug): Promise<ElectionDistrict | null>;
  findSummaryById(id: DistrictId): Promise<ElectionDistrictSummary | null>;
  findDetailById(id: DistrictId): Promise<ElectionDistrictDetail | null>;
  list(query?: ElectionDistrictListQuery): Promise<RacePage<ElectionDistrictSummary>>;
  listCore(query?: ElectionDistrictListQuery): Promise<RacePage<ElectionDistrict>>;
  listByCounty(entityId: ElectionEntityId): Promise<readonly ElectionDistrictSummary[]>;
  count(filters?: ElectionDistrictFilters): Promise<number>;
  exists(lookup: ElectionDistrictLookup): Promise<boolean>;
  create(input: ElectionDistrictCreateInput): Promise<ElectionDistrict>;
  update(id: DistrictId, input: ElectionDistrictUpdateInput): Promise<ElectionDistrict>;
  delete(id: DistrictId): Promise<boolean>;
}

export type ReadonlyElectionDistrictRepository = Pick<
  ElectionDistrictRepository,
  | "findById"
  | "findBySlug"
  | "findSummaryById"
  | "findDetailById"
  | "list"
  | "listCore"
  | "listByCounty"
  | "count"
  | "exists"
>;
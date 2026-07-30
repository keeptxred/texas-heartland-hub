import type { ElectionEntityId, OfficeId, OfficeSlug } from "./identifiers";
import type { ElectionOffice, ElectionOfficeCreateInput, ElectionOfficeUpdateInput } from "./office";
import type { OfficeBranch, OfficeElectionMethod, OfficeLevel } from "./officeClassifications";
import type { ElectionOfficeDetail, ElectionOfficeSummary } from "./officeProjections";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const ELECTION_OFFICE_SORT_FIELDS = [
  "name",
  "level",
  "branch",
  "updated_at",
] as const;

export type ElectionOfficeSortField =
  (typeof ELECTION_OFFICE_SORT_FIELDS)[number];

export interface ElectionOfficeSort {
  field: ElectionOfficeSortField;
  direction: SortDirection;
}

export interface ElectionOfficeFilters {
  ids?: readonly OfficeId[];
  levels?: readonly OfficeLevel[];
  branches?: readonly OfficeBranch[];
  electionMethods?: readonly OfficeElectionMethod[];
  jurisdictionIds?: readonly ElectionEntityId[];
  districtRequired?: boolean;
  active?: boolean;
  search?: string;
}

export interface ElectionOfficeListQuery {
  filters?: ElectionOfficeFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionOfficeSort[];
}

export interface ElectionOfficeLookup {
  id?: OfficeId;
  slug?: OfficeSlug;
}

export interface ElectionOfficeRepository {
  findById(id: OfficeId): Promise<ElectionOffice | null>;
  findBySlug(slug: OfficeSlug): Promise<ElectionOffice | null>;
  findSummaryById(id: OfficeId): Promise<ElectionOfficeSummary | null>;
  findDetailById(id: OfficeId): Promise<ElectionOfficeDetail | null>;
  list(query?: ElectionOfficeListQuery): Promise<RacePage<ElectionOfficeSummary>>;
  listCore(query?: ElectionOfficeListQuery): Promise<RacePage<ElectionOffice>>;
  count(filters?: ElectionOfficeFilters): Promise<number>;
  exists(lookup: ElectionOfficeLookup): Promise<boolean>;
  create(input: ElectionOfficeCreateInput): Promise<ElectionOffice>;
  update(id: OfficeId, input: ElectionOfficeUpdateInput): Promise<ElectionOffice>;
  delete(id: OfficeId): Promise<boolean>;
}

export type ReadonlyElectionOfficeRepository = Pick<
  ElectionOfficeRepository,
  | "findById"
  | "findBySlug"
  | "findSummaryById"
  | "findDetailById"
  | "list"
  | "listCore"
  | "count"
  | "exists"
>;
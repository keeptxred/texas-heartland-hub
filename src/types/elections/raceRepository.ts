import type { RaceRating } from "./domain";
import type {
  CandidateId,
  ElectionCycleId,
  ElectionEntityId,
  RaceId,
  RaceSlug,
} from "./identifiers";
import type {
  ElectionFreshnessStatus,
  ElectionPublicationStatus,
  ElectionVerificationStatus,
  IsoDateString,
} from "./metadata";
import type { ElectionRace, ElectionRaceCreateInput, ElectionRaceUpdateInput } from "./race";
import type {
  ElectionType,
  JurisdictionType,
  OfficeLevel,
  PartyScope,
  RaceStatus,
  RaceType,
} from "./raceClassifications";
import type { RaceDetail, RaceSummary } from "./raceProjections";

export const RACE_SORT_FIELDS = [
  "election_date",
  "updated_at",
  "name",
  "rating",
  "status",
] as const;

export type RaceSortField = (typeof RACE_SORT_FIELDS)[number];
export type SortDirection = "asc" | "desc";

export interface RaceSort {
  field: RaceSortField;
  direction: SortDirection;
}

export interface RacePagination {
  page: number;
  pageSize: number;
}

export interface RacePage<T> {
  items: readonly T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RaceFilters {
  electionCycleIds?: readonly ElectionCycleId[];
  officeIds?: readonly ElectionEntityId[];
  districtIds?: readonly ElectionEntityId[];
  candidateIds?: readonly CandidateId[];
  officeLevels?: readonly OfficeLevel[];
  raceTypes?: readonly RaceType[];
  electionTypes?: readonly ElectionType[];
  jurisdictionTypes?: readonly JurisdictionType[];
  partyScopes?: readonly PartyScope[];
  statuses?: readonly RaceStatus[];
  ratings?: readonly RaceRating[];
  publicationStatuses?: readonly ElectionPublicationStatus[];
  verificationStatuses?: readonly ElectionVerificationStatus[];
  freshnessStatuses?: readonly ElectionFreshnessStatus[];
  stateCodes?: readonly string[];
  countyIds?: readonly ElectionEntityId[];
  electionDateFrom?: IsoDateString;
  electionDateTo?: IsoDateString;
  featured?: boolean;
  competitive?: boolean;
  uncontested?: boolean;
  runoffRequired?: boolean;
  search?: string;
}

export interface RaceListQuery {
  filters?: RaceFilters;
  pagination?: RacePagination;
  sort?: readonly RaceSort[];
}

export interface RaceLookup {
  id?: RaceId;
  slug?: RaceSlug;
  electionCycleId?: ElectionCycleId;
}

export interface RaceRepository {
  findById(id: RaceId): Promise<ElectionRace | null>;
  findBySlug(slug: RaceSlug, electionCycleId?: ElectionCycleId): Promise<ElectionRace | null>;
  findSummaryById(id: RaceId): Promise<RaceSummary | null>;
  findDetailById(id: RaceId): Promise<RaceDetail | null>;
  findDetailBySlug(slug: RaceSlug, electionCycleId?: ElectionCycleId): Promise<RaceDetail | null>;

  list(query?: RaceListQuery): Promise<RacePage<RaceSummary>>;
  listCore(query?: RaceListQuery): Promise<RacePage<ElectionRace>>;
  listFeatured(electionCycleId: ElectionCycleId, limit?: number): Promise<readonly RaceSummary[]>;
  listCompetitive(electionCycleId: ElectionCycleId, limit?: number): Promise<readonly RaceSummary[]>;
  listByCandidate(candidateId: CandidateId): Promise<readonly RaceSummary[]>;

  count(filters?: RaceFilters): Promise<number>;
  exists(lookup: RaceLookup): Promise<boolean>;

  create(input: ElectionRaceCreateInput): Promise<ElectionRace>;
  update(id: RaceId, input: ElectionRaceUpdateInput): Promise<ElectionRace>;
  delete(id: RaceId): Promise<boolean>;
}

export type ReadonlyRaceRepository = Pick<
  RaceRepository,
  | "findById"
  | "findBySlug"
  | "findSummaryById"
  | "findDetailById"
  | "findDetailBySlug"
  | "list"
  | "listCore"
  | "listFeatured"
  | "listCompetitive"
  | "listByCandidate"
  | "count"
  | "exists"
>;

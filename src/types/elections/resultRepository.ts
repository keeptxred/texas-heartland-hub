import type {
  CandidateId,
  ElectionCycleId,
  ElectionEntityId,
  ElectionResultId,
  ElectionResultSlug,
  RaceId,
} from "./identifiers";
import type {
  ElectionFreshnessStatus,
  ElectionPublicationStatus,
  ElectionVerificationStatus,
  IsoDateString,
  IsoDateTimeString,
} from "./metadata";
import type {
  CertificationStatus,
  ElectionResultStatus,
  ResultReportingStatus,
  TabulationScope,
} from "./resultClassifications";
import type {
  ElectionResult,
  ElectionResultCreateInput,
  ElectionResultUpdateInput,
} from "./result";
import type {
  ElectionResultDetail,
  ElectionResultSnapshot,
  ElectionResultSummary,
} from "./resultProjections";
import type {
  RacePage,
  RacePagination,
  SortDirection,
} from "./raceRepository";

export const ELECTION_RESULT_SORT_FIELDS = [
  "election_date",
  "last_vote_update_at",
  "updated_at",
  "status",
  "reporting_percentage",
  "total_votes",
] as const;

export type ElectionResultSortField =
  (typeof ELECTION_RESULT_SORT_FIELDS)[number];

export interface ElectionResultSort {
  field: ElectionResultSortField;
  direction: SortDirection;
}

export interface ElectionResultFilters {
  electionCycleIds?: readonly ElectionCycleId[];
  raceIds?: readonly RaceId[];
  candidateIds?: readonly CandidateId[];
  subdivisionEntityIds?: readonly ElectionEntityId[];
  statuses?: readonly ElectionResultStatus[];
  reportingStatuses?: readonly ResultReportingStatus[];
  certificationStatuses?: readonly CertificationStatus[];
  tabulationScopes?: readonly TabulationScope[];
  publicationStatuses?: readonly ElectionPublicationStatus[];
  verificationStatuses?: readonly ElectionVerificationStatus[];
  freshnessStatuses?: readonly ElectionFreshnessStatus[];
  electionDateFrom?: IsoDateString;
  electionDateTo?: IsoDateString;
  updatedFrom?: IsoDateTimeString;
  updatedTo?: IsoDateTimeString;
  hasWinner?: boolean;
  hasRunoff?: boolean;
  recountRequested?: boolean;
  contested?: boolean;
  live?: boolean;
  certified?: boolean;
  search?: string;
}

export interface ElectionResultListQuery {
  filters?: ElectionResultFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionResultSort[];
}

export interface ElectionResultLookup {
  id?: ElectionResultId;
  slug?: ElectionResultSlug;
  raceId?: RaceId;
  electionCycleId?: ElectionCycleId;
}

export interface ElectionResultSnapshotQuery {
  resultId: ElectionResultId;
  capturedFrom?: IsoDateTimeString;
  capturedTo?: IsoDateTimeString;
  limit?: number;
  direction?: SortDirection;
}

export interface ElectionResultRepository {
  findById(id: ElectionResultId): Promise<ElectionResult | null>;
  findBySlug(
    slug: ElectionResultSlug,
    electionCycleId?: ElectionCycleId,
  ): Promise<ElectionResult | null>;
  findByRaceId(raceId: RaceId): Promise<ElectionResult | null>;
  findSummaryById(id: ElectionResultId): Promise<ElectionResultSummary | null>;
  findDetailById(id: ElectionResultId): Promise<ElectionResultDetail | null>;
  findDetailByRaceId(raceId: RaceId): Promise<ElectionResultDetail | null>;

  list(
    query?: ElectionResultListQuery,
  ): Promise<RacePage<ElectionResultSummary>>;
  listCore(
    query?: ElectionResultListQuery,
  ): Promise<RacePage<ElectionResult>>;
  listLive(
    electionCycleId: ElectionCycleId,
    limit?: number,
  ): Promise<readonly ElectionResultSummary[]>;
  listCertified(
    electionCycleId: ElectionCycleId,
    limit?: number,
  ): Promise<readonly ElectionResultSummary[]>;
  listByCandidate(
    candidateId: CandidateId,
  ): Promise<readonly ElectionResultSummary[]>;
  listBySubdivision(
    entityId: ElectionEntityId,
    electionCycleId?: ElectionCycleId,
  ): Promise<readonly ElectionResultSummary[]>;
  listSnapshots(
    query: ElectionResultSnapshotQuery,
  ): Promise<readonly ElectionResultSnapshot[]>;

  count(filters?: ElectionResultFilters): Promise<number>;
  exists(lookup: ElectionResultLookup): Promise<boolean>;

  create(input: ElectionResultCreateInput): Promise<ElectionResult>;
  update(
    id: ElectionResultId,
    input: ElectionResultUpdateInput,
  ): Promise<ElectionResult>;
  saveSnapshot(snapshot: ElectionResultSnapshot): Promise<ElectionResultSnapshot>;
  delete(id: ElectionResultId): Promise<boolean>;
}

export type ReadonlyElectionResultRepository = Pick<
  ElectionResultRepository,
  | "findById"
  | "findBySlug"
  | "findByRaceId"
  | "findSummaryById"
  | "findDetailById"
  | "findDetailByRaceId"
  | "list"
  | "listCore"
  | "listLive"
  | "listCertified"
  | "listByCandidate"
  | "listBySubdivision"
  | "listSnapshots"
  | "count"
  | "exists"
>;

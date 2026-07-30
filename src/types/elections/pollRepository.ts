import type {
  CandidateId,
  ElectionCycleId,
  ElectionEntityId,
  PollId,
  PollSlug,
  RaceId,
} from "./identifiers";
import type {
  ElectionFreshnessStatus,
  ElectionPublicationStatus,
  ElectionVerificationStatus,
  IsoDateString,
} from "./metadata";
import type { ElectionPoll, ElectionPollCreateInput, ElectionPollUpdateInput } from "./poll";
import type {
  PollGrade,
  PollMode,
  PollPopulation,
  PollQuestionType,
  PollSponsorType,
  PollStatus,
} from "./pollClassifications";
import type { ElectionPollDetail, ElectionPollSummary, PollTrendPoint } from "./pollProjections";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const ELECTION_POLL_SORT_FIELDS = [
  "field_end_date",
  "release_date",
  "updated_at",
  "pollster_name",
  "sample_size",
  "status",
] as const;

export type ElectionPollSortField = (typeof ELECTION_POLL_SORT_FIELDS)[number];

export interface ElectionPollSort {
  field: ElectionPollSortField;
  direction: SortDirection;
}

export interface ElectionPollFilters {
  electionCycleIds?: readonly ElectionCycleId[];
  raceIds?: readonly RaceId[];
  jurisdictionIds?: readonly ElectionEntityId[];
  candidateIds?: readonly CandidateId[];
  pollsterNames?: readonly string[];
  statuses?: readonly PollStatus[];
  populations?: readonly PollPopulation[];
  modes?: readonly PollMode[];
  questionTypes?: readonly PollQuestionType[];
  sponsorTypes?: readonly PollSponsorType[];
  grades?: readonly PollGrade[];
  publicationStatuses?: readonly ElectionPublicationStatus[];
  verificationStatuses?: readonly ElectionVerificationStatus[];
  freshnessStatuses?: readonly ElectionFreshnessStatus[];
  fieldDateFrom?: IsoDateString;
  fieldDateTo?: IsoDateString;
  releaseDateFrom?: IsoDateString;
  releaseDateTo?: IsoDateString;
  internalPoll?: boolean;
  partisanPoll?: boolean;
  trackingPoll?: boolean;
  hasRace?: boolean;
  search?: string;
}

export interface ElectionPollListQuery {
  filters?: ElectionPollFilters;
  pagination?: RacePagination;
  sort?: readonly ElectionPollSort[];
}

export interface ElectionPollLookup {
  id?: PollId;
  slug?: PollSlug;
  electionCycleId?: ElectionCycleId;
}

export interface PollTrendQuery {
  raceId: RaceId;
  candidateIds?: readonly CandidateId[];
  questionTypes?: readonly PollQuestionType[];
  populations?: readonly PollPopulation[];
  fieldDateFrom?: IsoDateString;
  fieldDateTo?: IsoDateString;
  limit?: number;
}

export interface ElectionPollRepository {
  findById(id: PollId): Promise<ElectionPoll | null>;
  findBySlug(slug: PollSlug, electionCycleId?: ElectionCycleId): Promise<ElectionPoll | null>;
  findSummaryById(id: PollId): Promise<ElectionPollSummary | null>;
  findDetailById(id: PollId): Promise<ElectionPollDetail | null>;
  findDetailBySlug(
    slug: PollSlug,
    electionCycleId?: ElectionCycleId,
  ): Promise<ElectionPollDetail | null>;

  list(query?: ElectionPollListQuery): Promise<RacePage<ElectionPollSummary>>;
  listCore(query?: ElectionPollListQuery): Promise<RacePage<ElectionPoll>>;
  listByRace(
    raceId: RaceId,
    query?: Omit<ElectionPollListQuery, "filters">,
  ): Promise<RacePage<ElectionPollSummary>>;
  listByCandidate(
    candidateId: CandidateId,
    electionCycleId?: ElectionCycleId,
  ): Promise<readonly ElectionPollSummary[]>;
  listLatest(
    electionCycleId: ElectionCycleId,
    limit?: number,
  ): Promise<readonly ElectionPollSummary[]>;
  listTrackingSeries(raceId: RaceId): Promise<readonly ElectionPollSummary[]>;
  listTrendPoints(query: PollTrendQuery): Promise<readonly PollTrendPoint[]>;

  count(filters?: ElectionPollFilters): Promise<number>;
  exists(lookup: ElectionPollLookup): Promise<boolean>;

  create(input: ElectionPollCreateInput): Promise<ElectionPoll>;
  update(id: PollId, input: ElectionPollUpdateInput): Promise<ElectionPoll>;
  delete(id: PollId): Promise<boolean>;
}

export type ReadonlyElectionPollRepository = Pick<
  ElectionPollRepository,
  | "findById"
  | "findBySlug"
  | "findSummaryById"
  | "findDetailById"
  | "findDetailBySlug"
  | "list"
  | "listCore"
  | "listByRace"
  | "listByCandidate"
  | "listLatest"
  | "listTrackingSeries"
  | "listTrendPoints"
  | "count"
  | "exists"
>;

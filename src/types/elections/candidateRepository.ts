import type { CandidateParty } from "./domain";
import type {
  CandidateId,
  CandidateSlug,
  ElectionCycleId,
  ElectionEntityId,
  RaceId,
} from "./identifiers";
import type {
  ElectionFreshnessStatus,
  ElectionPublicationStatus,
  ElectionVerificationStatus,
  IsoDateString,
} from "./metadata";
import type {
  BallotAccessStatus,
  CampaignStatus,
  CandidateFilingStatus,
  CandidateStatus,
  IncumbencyType,
} from "./candidateClassifications";
import type {
  ElectionCandidate,
  ElectionCandidateCreateInput,
  ElectionCandidateUpdateInput,
} from "./candidate";
import type { CandidateDetail, CandidateSummary } from "./candidateProjections";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const CANDIDATE_SORT_FIELDS = [
  "last_name",
  "ballot_name",
  "updated_at",
  "status",
  "party",
  "filing_date",
] as const;

export type CandidateSortField = (typeof CANDIDATE_SORT_FIELDS)[number];

export interface CandidateSort {
  field: CandidateSortField;
  direction: SortDirection;
}

export interface CandidateFilters {
  electionCycleIds?: readonly ElectionCycleId[];
  raceIds?: readonly RaceId[];
  primaryRaceIds?: readonly RaceId[];
  currentOfficeIds?: readonly ElectionEntityId[];
  residenceCountyIds?: readonly ElectionEntityId[];
  parties?: readonly CandidateParty[];
  statuses?: readonly CandidateStatus[];
  filingStatuses?: readonly CandidateFilingStatus[];
  incumbencyTypes?: readonly IncumbencyType[];
  campaignStatuses?: readonly CampaignStatus[];
  ballotAccessStatuses?: readonly BallotAccessStatus[];
  publicationStatuses?: readonly ElectionPublicationStatus[];
  verificationStatuses?: readonly ElectionVerificationStatus[];
  freshnessStatuses?: readonly ElectionFreshnessStatus[];
  stateCodes?: readonly string[];
  filingDateFrom?: IsoDateString;
  filingDateTo?: IsoDateString;
  featured?: boolean;
  endorsed?: boolean;
  hasImage?: boolean;
  hasCampaignWebsite?: boolean;
  search?: string;
}

export interface CandidateListQuery {
  filters?: CandidateFilters;
  pagination?: RacePagination;
  sort?: readonly CandidateSort[];
}

export interface CandidateLookup {
  id?: CandidateId;
  slug?: CandidateSlug;
  electionCycleId?: ElectionCycleId;
}

export interface CandidateRepository {
  findById(id: CandidateId): Promise<ElectionCandidate | null>;
  findBySlug(
    slug: CandidateSlug,
    electionCycleId?: ElectionCycleId,
  ): Promise<ElectionCandidate | null>;
  findSummaryById(id: CandidateId): Promise<CandidateSummary | null>;
  findDetailById(id: CandidateId): Promise<CandidateDetail | null>;
  findDetailBySlug(
    slug: CandidateSlug,
    electionCycleId?: ElectionCycleId,
  ): Promise<CandidateDetail | null>;

  list(query?: CandidateListQuery): Promise<RacePage<CandidateSummary>>;
  listCore(query?: CandidateListQuery): Promise<RacePage<ElectionCandidate>>;
  listByRace(raceId: RaceId): Promise<readonly CandidateSummary[]>;
  listByOffice(officeId: ElectionEntityId): Promise<readonly CandidateSummary[]>;
  listFeatured(
    electionCycleId: ElectionCycleId,
    limit?: number,
  ): Promise<readonly CandidateSummary[]>;
  listEndorsed(
    electionCycleId: ElectionCycleId,
    limit?: number,
  ): Promise<readonly CandidateSummary[]>;

  count(filters?: CandidateFilters): Promise<number>;
  exists(lookup: CandidateLookup): Promise<boolean>;

  create(input: ElectionCandidateCreateInput): Promise<ElectionCandidate>;
  update(
    id: CandidateId,
    input: ElectionCandidateUpdateInput,
  ): Promise<ElectionCandidate>;
  delete(id: CandidateId): Promise<boolean>;
}

export type ReadonlyCandidateRepository = Pick<
  CandidateRepository,
  | "findById"
  | "findBySlug"
  | "findSummaryById"
  | "findDetailById"
  | "findDetailBySlug"
  | "list"
  | "listCore"
  | "listByRace"
  | "listByOffice"
  | "listFeatured"
  | "listEndorsed"
  | "count"
  | "exists"
>;

import type {
  CandidateIssuePosition,
  CandidateIssuePositionCreateInput,
  CandidateIssuePositionUpdateInput,
} from "./issuePosition";
import type {
  CandidatePositionStance,
  ElectionIssueCategory,
  PositionConfidenceLevel,
} from "./issuePositionClassifications";
import type {
  CandidateIssueComparisonRow,
  CandidateIssuePositionDetail,
  CandidateIssuePositionSummary,
  CandidateIssueProfile,
} from "./issuePositionProjections";
import type {
  CandidateId,
  ElectionCycleId,
  IssuePositionId,
  IssuePositionSlug,
  RaceId,
} from "./identifiers";
import type {
  ElectionPublicationStatus,
  ElectionVerificationStatus,
} from "./metadata";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const ISSUE_POSITION_SORT_FIELDS = [
  "issue_name",
  "category",
  "candidate_name",
  "confidence",
  "updated_at",
] as const;
export type IssuePositionSortField = (typeof ISSUE_POSITION_SORT_FIELDS)[number];

export interface IssuePositionSort {
  field: IssuePositionSortField;
  direction: SortDirection;
}

export interface IssuePositionFilters {
  ids?: readonly IssuePositionId[];
  electionCycleIds?: readonly ElectionCycleId[];
  raceIds?: readonly RaceId[];
  candidateIds?: readonly CandidateId[];
  categories?: readonly ElectionIssueCategory[];
  stances?: readonly CandidatePositionStance[];
  confidenceLevels?: readonly PositionConfidenceLevel[];
  publicationStatuses?: readonly ElectionPublicationStatus[];
  verificationStatuses?: readonly ElectionVerificationStatus[];
  featured?: boolean;
  search?: string;
}

export interface IssuePositionListQuery {
  filters?: IssuePositionFilters;
  pagination?: RacePagination;
  sort?: readonly IssuePositionSort[];
}

export interface IssuePositionRepository {
  findById(id: IssuePositionId): Promise<CandidateIssuePosition | null>;
  findBySlug(slug: IssuePositionSlug): Promise<CandidateIssuePosition | null>;
  findDetailById(id: IssuePositionId): Promise<CandidateIssuePositionDetail | null>;
  list(query?: IssuePositionListQuery): Promise<RacePage<CandidateIssuePositionSummary>>;
  listCore(query?: IssuePositionListQuery): Promise<RacePage<CandidateIssuePosition>>;
  getCandidateProfile(candidateId: CandidateId): Promise<CandidateIssueProfile | null>;
  compareCandidates(candidateIds: readonly CandidateId[], raceId?: RaceId): Promise<readonly CandidateIssueComparisonRow[]>;
  count(filters?: IssuePositionFilters): Promise<number>;
  create(input: CandidateIssuePositionCreateInput): Promise<CandidateIssuePosition>;
  update(id: IssuePositionId, input: CandidateIssuePositionUpdateInput): Promise<CandidateIssuePosition>;
  delete(id: IssuePositionId): Promise<boolean>;
}

export type ReadonlyIssuePositionRepository = Pick<
  IssuePositionRepository,
  | "findById"
  | "findBySlug"
  | "findDetailById"
  | "list"
  | "listCore"
  | "getCandidateProfile"
  | "compareCandidates"
  | "count"
>;

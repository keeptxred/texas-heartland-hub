import type { CandidateId, ElectionCycleId, LegislativeScorecardId, LegislativeScorecardSlug } from "./identifiers";
import type { LegislativeScorecard, LegislativeScorecardCreateInput, LegislativeScorecardUpdateInput } from "./legislativeScorecard";
import type { LegislativeScoreGrade, LegislativeScorecardStatus, LegislativeScorecardType } from "./legislativeScorecardClassifications";
import type { CandidateLegislativeScorecardProfile, LegislativeScorecardDetail, LegislativeScorecardSummary } from "./legislativeScorecardProjections";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const LEGISLATIVE_SCORECARD_SORT_FIELDS = ["title", "publisher_name", "percentage_score", "grade", "updated_at"] as const;
export type LegislativeScorecardSortField = (typeof LEGISLATIVE_SCORECARD_SORT_FIELDS)[number];

export interface LegislativeScorecardSort {
  field: LegislativeScorecardSortField;
  direction: SortDirection;
}

export interface LegislativeScorecardFilters {
  ids?: readonly LegislativeScorecardId[];
  electionCycleIds?: readonly ElectionCycleId[];
  candidateIds?: readonly CandidateId[];
  scorecardTypes?: readonly LegislativeScorecardType[];
  statuses?: readonly LegislativeScorecardStatus[];
  grades?: readonly LegislativeScoreGrade[];
  publishers?: readonly string[];
  featured?: boolean;
  verified?: boolean;
  search?: string;
}

export interface LegislativeScorecardListQuery {
  filters?: LegislativeScorecardFilters;
  pagination?: RacePagination;
  sort?: readonly LegislativeScorecardSort[];
}

export interface LegislativeScorecardRepository {
  findById(id: LegislativeScorecardId): Promise<LegislativeScorecard | null>;
  findBySlug(slug: LegislativeScorecardSlug): Promise<LegislativeScorecard | null>;
  findDetailById(id: LegislativeScorecardId): Promise<LegislativeScorecardDetail | null>;
  list(query?: LegislativeScorecardListQuery): Promise<RacePage<LegislativeScorecardSummary>>;
  listCore(query?: LegislativeScorecardListQuery): Promise<RacePage<LegislativeScorecard>>;
  getCandidateProfile(candidateId: CandidateId): Promise<CandidateLegislativeScorecardProfile | null>;
  count(filters?: LegislativeScorecardFilters): Promise<number>;
  create(input: LegislativeScorecardCreateInput): Promise<LegislativeScorecard>;
  update(id: LegislativeScorecardId, input: LegislativeScorecardUpdateInput): Promise<LegislativeScorecard>;
  delete(id: LegislativeScorecardId): Promise<boolean>;
}

export type ReadonlyLegislativeScorecardRepository = Pick<
  LegislativeScorecardRepository,
  "findById" | "findBySlug" | "findDetailById" | "list" | "listCore" | "getCandidateProfile" | "count"
>;

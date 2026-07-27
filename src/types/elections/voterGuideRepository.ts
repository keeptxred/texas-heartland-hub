import type { CountyId, ElectionCycleId, RaceId, VoterGuideId, VoterGuideSlug } from "./identifiers";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";
import type { VoterGuide, VoterGuideCreateInput, VoterGuideUpdateInput } from "./voterGuide";
import type { VoterGuideAudience, VoterGuideStatus, VoterGuideType } from "./voterGuideClassifications";
import type { ElectionCycleVoterGuideDirectory, VoterGuideDetail, VoterGuideSummary } from "./voterGuideProjections";

export const VOTER_GUIDE_SORT_FIELDS = ["title", "guide_type", "status", "published_at", "updated_at"] as const;
export type VoterGuideSortField = (typeof VOTER_GUIDE_SORT_FIELDS)[number];

export interface VoterGuideSort {
  field: VoterGuideSortField;
  direction: SortDirection;
}

export interface VoterGuideFilters {
  ids?: readonly VoterGuideId[];
  electionCycleIds?: readonly ElectionCycleId[];
  countyIds?: readonly CountyId[];
  raceIds?: readonly RaceId[];
  guideTypes?: readonly VoterGuideType[];
  audiences?: readonly VoterGuideAudience[];
  statuses?: readonly VoterGuideStatus[];
  featured?: boolean;
  search?: string;
}

export interface VoterGuideListQuery {
  filters?: VoterGuideFilters;
  pagination?: RacePagination;
  sort?: readonly VoterGuideSort[];
}

export interface VoterGuideRepository {
  findById(id: VoterGuideId): Promise<VoterGuide | null>;
  findBySlug(slug: VoterGuideSlug): Promise<VoterGuide | null>;
  findDetailById(id: VoterGuideId): Promise<VoterGuideDetail | null>;
  list(query?: VoterGuideListQuery): Promise<RacePage<VoterGuideSummary>>;
  listCore(query?: VoterGuideListQuery): Promise<RacePage<VoterGuide>>;
  getElectionCycleDirectory(electionCycleId: ElectionCycleId): Promise<ElectionCycleVoterGuideDirectory>;
  count(filters?: VoterGuideFilters): Promise<number>;
  create(input: VoterGuideCreateInput): Promise<VoterGuide>;
  update(id: VoterGuideId, input: VoterGuideUpdateInput): Promise<VoterGuide>;
  delete(id: VoterGuideId): Promise<boolean>;
}

export type ReadonlyVoterGuideRepository = Pick<
  VoterGuideRepository,
  "findById" | "findBySlug" | "findDetailById" | "list" | "listCore" | "getElectionCycleDirectory" | "count"
>;

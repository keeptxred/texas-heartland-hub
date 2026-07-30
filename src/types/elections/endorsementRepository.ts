import type { ElectionEndorsement, ElectionEndorsementCreateInput, ElectionEndorsementUpdateInput } from "./endorsement";
import type { EndorsementStatus, EndorsementType, EndorserType } from "./endorsementClassifications";
import type { ElectionEndorsementDetail, ElectionEndorsementSummary } from "./endorsementProjections";
import type { BallotMeasureId, CandidateId, ElectionCycleId, EndorsementId, EndorsementSlug, RaceId } from "./identifiers";
import type { ElectionFreshnessStatus, ElectionPublicationStatus, ElectionVerificationStatus, IsoDateString } from "./metadata";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const ENDORSEMENT_SORT_FIELDS = ["endorsed_on", "endorser_name", "updated_at"] as const;
export type EndorsementSortField = (typeof ENDORSEMENT_SORT_FIELDS)[number];

export interface EndorsementSort {
  field: EndorsementSortField;
  direction: SortDirection;
}

export interface EndorsementFilters {
  ids?: readonly EndorsementId[];
  electionCycleIds?: readonly ElectionCycleId[];
  raceIds?: readonly RaceId[];
  candidateIds?: readonly CandidateId[];
  ballotMeasureIds?: readonly BallotMeasureId[];
  types?: readonly EndorsementType[];
  statuses?: readonly EndorsementStatus[];
  endorserTypes?: readonly EndorserType[];
  publicationStatuses?: readonly ElectionPublicationStatus[];
  verificationStatuses?: readonly ElectionVerificationStatus[];
  freshnessStatuses?: readonly ElectionFreshnessStatus[];
  endorsedFrom?: IsoDateString;
  endorsedTo?: IsoDateString;
  featured?: boolean;
  search?: string;
}

export interface EndorsementListQuery {
  filters?: EndorsementFilters;
  pagination?: RacePagination;
  sort?: readonly EndorsementSort[];
}

export interface ElectionEndorsementRepository {
  findById(id: EndorsementId): Promise<ElectionEndorsement | null>;
  findBySlug(slug: EndorsementSlug): Promise<ElectionEndorsement | null>;
  findSummaryById(id: EndorsementId): Promise<ElectionEndorsementSummary | null>;
  findDetailById(id: EndorsementId): Promise<ElectionEndorsementDetail | null>;
  list(query?: EndorsementListQuery): Promise<RacePage<ElectionEndorsementSummary>>;
  listCore(query?: EndorsementListQuery): Promise<RacePage<ElectionEndorsement>>;
  count(filters?: EndorsementFilters): Promise<number>;
  create(input: ElectionEndorsementCreateInput): Promise<ElectionEndorsement>;
  update(id: EndorsementId, input: ElectionEndorsementUpdateInput): Promise<ElectionEndorsement>;
  delete(id: EndorsementId): Promise<boolean>;
}

export type ReadonlyElectionEndorsementRepository = Pick<
  ElectionEndorsementRepository,
  "findById" | "findBySlug" | "findSummaryById" | "findDetailById" | "list" | "listCore" | "count"
>;
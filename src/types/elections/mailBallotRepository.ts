import type { MailBallotCreateInput, MailBallotRecord, MailBallotUpdateInput } from "./mailBallot";
import type {
  MailBallotApplicationStatus,
  MailBallotEligibilityReason,
  MailBallotReturnMethod,
  MailBallotStatus,
} from "./mailBallotClassifications";
import type { MailBallotCountyOverview, MailBallotDetail, MailBallotSummary } from "./mailBallotProjections";
import type { CountyId, ElectionCycleId, MailBallotId, MailBallotSlug } from "./identifiers";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const MAIL_BALLOT_SORT_FIELDS = [
  "county_name",
  "application_status",
  "ballot_status",
  "application_deadline",
  "ballot_return_deadline",
  "updated_at",
] as const;
export type MailBallotSortField = (typeof MAIL_BALLOT_SORT_FIELDS)[number];

export interface MailBallotSort {
  field: MailBallotSortField;
  direction: SortDirection;
}

export interface MailBallotFilters {
  ids?: readonly MailBallotId[];
  electionCycleIds?: readonly ElectionCycleId[];
  countyIds?: readonly CountyId[];
  applicationStatuses?: readonly MailBallotApplicationStatus[];
  ballotStatuses?: readonly MailBallotStatus[];
  eligibilityReasons?: readonly MailBallotEligibilityReason[];
  returnMethods?: readonly MailBallotReturnMethod[];
  search?: string;
}

export interface MailBallotListQuery {
  filters?: MailBallotFilters;
  pagination?: RacePagination;
  sort?: readonly MailBallotSort[];
}

export interface MailBallotRepository {
  findById(id: MailBallotId): Promise<MailBallotRecord | null>;
  findBySlug(slug: MailBallotSlug): Promise<MailBallotRecord | null>;
  findDetailById(id: MailBallotId): Promise<MailBallotDetail | null>;
  list(query?: MailBallotListQuery): Promise<RacePage<MailBallotSummary>>;
  listCore(query?: MailBallotListQuery): Promise<RacePage<MailBallotRecord>>;
  getCountyOverview(countyId: CountyId, electionCycleId: ElectionCycleId): Promise<MailBallotCountyOverview | null>;
  count(filters?: MailBallotFilters): Promise<number>;
  create(input: MailBallotCreateInput): Promise<MailBallotRecord>;
  update(id: MailBallotId, input: MailBallotUpdateInput): Promise<MailBallotRecord>;
  delete(id: MailBallotId): Promise<boolean>;
}

export type ReadonlyMailBallotRepository = Pick<
  MailBallotRepository,
  "findById" | "findBySlug" | "findDetailById" | "list" | "listCore" | "getCountyOverview" | "count"
>;

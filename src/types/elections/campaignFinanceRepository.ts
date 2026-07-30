import type {
  CampaignFinanceReport,
  CampaignFinanceReportCreateInput,
  CampaignFinanceReportUpdateInput,
} from "./campaignFinance";
import type {
  CampaignFinanceFilingStatus,
  CampaignFinanceJurisdiction,
  CampaignFinanceReportType,
} from "./campaignFinanceClassifications";
import type {
  CampaignFinanceLeaderboardEntry,
  CampaignFinanceReportDetail,
  CampaignFinanceReportSummary,
  CampaignFinanceTotals,
} from "./campaignFinanceProjections";
import type {
  BallotMeasureId,
  CampaignFinanceReportId,
  CampaignFinanceReportSlug,
  CandidateId,
  ElectionCycleId,
  RaceId,
} from "./identifiers";
import type { IsoDateString } from "./metadata";
import type { RacePage, RacePagination, SortDirection } from "./raceRepository";

export const CAMPAIGN_FINANCE_SORT_FIELDS = [
  "period_end",
  "filed_at",
  "contributions",
  "expenditures",
  "cash_on_hand",
  "updated_at",
] as const;
export type CampaignFinanceSortField = (typeof CAMPAIGN_FINANCE_SORT_FIELDS)[number];

export interface CampaignFinanceSort {
  field: CampaignFinanceSortField;
  direction: SortDirection;
}

export interface CampaignFinanceFilters {
  ids?: readonly CampaignFinanceReportId[];
  electionCycleIds?: readonly ElectionCycleId[];
  raceIds?: readonly RaceId[];
  candidateIds?: readonly CandidateId[];
  ballotMeasureIds?: readonly BallotMeasureId[];
  reportTypes?: readonly CampaignFinanceReportType[];
  filingStatuses?: readonly CampaignFinanceFilingStatus[];
  jurisdictions?: readonly CampaignFinanceJurisdiction[];
  periodFrom?: IsoDateString;
  periodTo?: IsoDateString;
  search?: string;
}

export interface CampaignFinanceListQuery {
  filters?: CampaignFinanceFilters;
  pagination?: RacePagination;
  sort?: readonly CampaignFinanceSort[];
}

export interface CampaignFinanceRepository {
  findById(id: CampaignFinanceReportId): Promise<CampaignFinanceReport | null>;
  findBySlug(slug: CampaignFinanceReportSlug): Promise<CampaignFinanceReport | null>;
  findDetailById(id: CampaignFinanceReportId): Promise<CampaignFinanceReportDetail | null>;
  list(query?: CampaignFinanceListQuery): Promise<RacePage<CampaignFinanceReportSummary>>;
  listCore(query?: CampaignFinanceListQuery): Promise<RacePage<CampaignFinanceReport>>;
  getTotals(filters: CampaignFinanceFilters): Promise<CampaignFinanceTotals>;
  getLeaderboard(raceId: RaceId, electionCycleId: ElectionCycleId): Promise<readonly CampaignFinanceLeaderboardEntry[]>;
  count(filters?: CampaignFinanceFilters): Promise<number>;
  create(input: CampaignFinanceReportCreateInput): Promise<CampaignFinanceReport>;
  update(id: CampaignFinanceReportId, input: CampaignFinanceReportUpdateInput): Promise<CampaignFinanceReport>;
  delete(id: CampaignFinanceReportId): Promise<boolean>;
}
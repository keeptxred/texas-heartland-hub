import type {
  CampaignFinanceReport,
  CampaignFinanceReportCreateInput,
  CampaignFinanceReportUpdateInput,
} from "./campaignFinance";
import type {
  CampaignFinanceLeaderboardEntry,
  CampaignFinanceReportDetail,
  CampaignFinanceReportSummary,
  CampaignFinanceTotals,
} from "./campaignFinanceProjections";
import type {
  CampaignFinanceFilters,
  CampaignFinanceListQuery,
  CampaignFinanceSort,
} from "./campaignFinanceRepository";
import type {
  CampaignFinanceReportId,
  CampaignFinanceReportSlug,
  ElectionCycleId,
  RaceId,
} from "./identifiers";
import type { RacePage, RacePagination } from "./raceRepository";

export const CAMPAIGN_FINANCE_VALIDATION_ERROR_CODES = [
  "required",
  "invalid_value",
  "invalid_date_order",
  "negative_amount",
  "duplicate_filing",
  "invalid_target",
] as const;
export type CampaignFinanceValidationErrorCode = (typeof CAMPAIGN_FINANCE_VALIDATION_ERROR_CODES)[number];

export interface CampaignFinanceValidationIssue {
  code: CampaignFinanceValidationErrorCode;
  field: string | null;
  message: string;
}

export interface CampaignFinanceValidationResult {
  valid: boolean;
  issues: readonly CampaignFinanceValidationIssue[];
}

export type CampaignFinanceServiceErrorCode =
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "forbidden"
  | "repository_error";

export interface CampaignFinanceServiceError {
  code: CampaignFinanceServiceErrorCode;
  message: string;
  issues?: readonly CampaignFinanceValidationIssue[];
}

export type CampaignFinanceServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: CampaignFinanceServiceError };

export interface CampaignFinanceQueryOptions {
  filters?: CampaignFinanceFilters;
  pagination?: RacePagination;
  sort?: readonly CampaignFinanceSort[];
  includeUnpublished?: boolean;
}

export interface CampaignFinanceService {
  getReportById(id: CampaignFinanceReportId): Promise<CampaignFinanceServiceResult<CampaignFinanceReport>>;
  getReportBySlug(slug: CampaignFinanceReportSlug): Promise<CampaignFinanceServiceResult<CampaignFinanceReport>>;
  getReportDetail(id: CampaignFinanceReportId): Promise<CampaignFinanceServiceResult<CampaignFinanceReportDetail>>;
  listReports(query?: CampaignFinanceQueryOptions): Promise<RacePage<CampaignFinanceReportSummary>>;
  searchReports(query: CampaignFinanceListQuery): Promise<RacePage<CampaignFinanceReportSummary>>;
  getTotals(filters: CampaignFinanceFilters): Promise<CampaignFinanceTotals>;
  getLeaderboard(raceId: RaceId, electionCycleId: ElectionCycleId): Promise<readonly CampaignFinanceLeaderboardEntry[]>;
  validateCreate(input: CampaignFinanceReportCreateInput): Promise<CampaignFinanceValidationResult>;
  validateUpdate(id: CampaignFinanceReportId, input: CampaignFinanceReportUpdateInput): Promise<CampaignFinanceValidationResult>;
  createReport(input: CampaignFinanceReportCreateInput): Promise<CampaignFinanceServiceResult<CampaignFinanceReport>>;
  updateReport(id: CampaignFinanceReportId, input: CampaignFinanceReportUpdateInput): Promise<CampaignFinanceServiceResult<CampaignFinanceReport>>;
  deleteReport(id: CampaignFinanceReportId): Promise<CampaignFinanceServiceResult<boolean>>;
}
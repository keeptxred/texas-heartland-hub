import type {
  CampaignFinanceCommitteeType,
  CampaignFinanceFilingStatus,
  CampaignFinanceJurisdiction,
  CampaignFinanceReportType,
} from "./campaignFinanceClassifications";
import type {
  BallotMeasureId,
  CampaignFinanceReportId,
  CampaignFinanceReportSlug,
  CandidateId,
  ElectionCycleId,
  RaceId,
} from "./identifiers";
import type { ElectionDataMetadata, IsoDateString, IsoDateTimeString } from "./metadata";

export interface CampaignFinanceAmounts {
  contributions: number;
  expenditures: number;
  cashOnHand: number;
  debtsOwed: number;
  loansReceived: number;
  inKindContributions: number;
  independentExpendituresSupporting: number;
  independentExpendituresOpposing: number;
}

export interface CampaignFinanceReport extends ElectionDataMetadata {
  id: CampaignFinanceReportId;
  slug: CampaignFinanceReportSlug;
  electionCycleId: ElectionCycleId;
  raceId: RaceId | null;
  candidateId: CandidateId | null;
  ballotMeasureId: BallotMeasureId | null;
  committeeName: string;
  committeeId: string | null;
  committeeType: CampaignFinanceCommitteeType;
  jurisdiction: CampaignFinanceJurisdiction;
  reportType: CampaignFinanceReportType;
  filingStatus: CampaignFinanceFilingStatus;
  periodStart: IsoDateString;
  periodEnd: IsoDateString;
  dueDate: IsoDateString | null;
  filedAt: IsoDateTimeString | null;
  amendedAt: IsoDateTimeString | null;
  amounts: CampaignFinanceAmounts;
  filingUrl: string | null;
  sourceUrl: string;
  sourceAgency: string;
  currencyCode: "USD";
  notes: string | null;
}

export type CampaignFinanceReportCreateInput = Omit<CampaignFinanceReport, "id" | "createdAt" | "updatedAt">;
export type CampaignFinanceReportUpdateInput = Partial<
  Omit<CampaignFinanceReport, "id" | "electionCycleId" | "createdAt">
> & { updatedAt: IsoDateTimeString };
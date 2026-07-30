import type { CampaignFinanceAmounts, CampaignFinanceReport } from "./campaignFinance";
import type { CandidateId, ElectionCycleId, RaceId } from "./identifiers";
import type { IsoDateString, IsoDateTimeString } from "./metadata";

export interface CampaignFinanceReportSummary {
  id: CampaignFinanceReport["id"];
  slug: CampaignFinanceReport["slug"];
  candidateId: CandidateId | null;
  raceId: RaceId | null;
  committeeName: string;
  reportType: CampaignFinanceReport["reportType"];
  filingStatus: CampaignFinanceReport["filingStatus"];
  periodEnd: IsoDateString;
  filedAt: IsoDateTimeString | null;
  amounts: CampaignFinanceAmounts;
  updatedAt: IsoDateTimeString;
}

export interface CampaignFinanceReportDetail extends CampaignFinanceReport {
  candidateName: string | null;
  raceName: string | null;
  ballotMeasureTitle: string | null;
}

export interface CampaignFinanceTotals {
  electionCycleId: ElectionCycleId;
  raceId: RaceId | null;
  candidateId: CandidateId | null;
  amounts: CampaignFinanceAmounts;
  latestPeriodEnd: IsoDateString | null;
  reportCount: number;
}

export interface CampaignFinanceLeaderboardEntry {
  candidateId: CandidateId;
  candidateName: string;
  partyLabel: string | null;
  totals: CampaignFinanceAmounts;
  rankByContributions: number;
  rankByCashOnHand: number;
}
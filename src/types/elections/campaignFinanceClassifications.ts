export const CAMPAIGN_FINANCE_REPORT_TYPES = [
  "periodic",
  "pre_election",
  "post_election",
  "runoff",
  "termination",
  "amended",
  "other",
] as const;
export type CampaignFinanceReportType = (typeof CAMPAIGN_FINANCE_REPORT_TYPES)[number];

export const CAMPAIGN_FINANCE_FILING_STATUSES = [
  "expected",
  "filed",
  "amended",
  "late",
  "missing",
  "rejected",
] as const;
export type CampaignFinanceFilingStatus = (typeof CAMPAIGN_FINANCE_FILING_STATUSES)[number];

export const CAMPAIGN_FINANCE_COMMITTEE_TYPES = [
  "candidate",
  "political_action_committee",
  "party",
  "ballot_measure",
  "independent_expenditure",
  "other",
] as const;
export type CampaignFinanceCommitteeType = (typeof CAMPAIGN_FINANCE_COMMITTEE_TYPES)[number];

export const CAMPAIGN_FINANCE_JURISDICTIONS = ["federal", "state", "local"] as const;
export type CampaignFinanceJurisdiction = (typeof CAMPAIGN_FINANCE_JURISDICTIONS)[number];
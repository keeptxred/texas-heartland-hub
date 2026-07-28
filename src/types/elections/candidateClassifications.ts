export const CANDIDATE_STATUSES = [
  "prospective",
  "active",
  "withdrawn",
  "suspended",
  "disqualified",
  "deceased",
  "write_in",
  "nominee",
  "elected",
  "defeated",
] as const;

export const CANDIDATE_FILING_STATUSES = [
  "not_filed",
  "filed",
  "pending_review",
  "accepted",
  "rejected",
  "withdrawn",
  "challenged",
] as const;

export const INCUMBENCY_TYPES = [
  "none",
  "incumbent",
  "appointed_incumbent",
  "former_officeholder",
  "challenger",
  "open_seat_candidate",
  "unknown",
] as const;

export const CAMPAIGN_STATUSES = [
  "exploratory",
  "announced",
  "active",
  "suspended",
  "ended",
  "transition",
  "unknown",
] as const;

export const BALLOT_ACCESS_STATUSES = [
  "not_applicable",
  "pending",
  "qualified",
  "challenged",
  "removed",
  "write_in_only",
  "unknown",
] as const;

export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];
export type CandidateFilingStatus = (typeof CANDIDATE_FILING_STATUSES)[number];
export type IncumbencyType = (typeof INCUMBENCY_TYPES)[number];
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];
export type BallotAccessStatus = (typeof BALLOT_ACCESS_STATUSES)[number];

export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
  prospective: "Prospective",
  active: "Active",
  withdrawn: "Withdrawn",
  suspended: "Suspended",
  disqualified: "Disqualified",
  deceased: "Deceased",
  write_in: "Write-in",
  nominee: "Nominee",
  elected: "Elected",
  defeated: "Defeated",
};

export const CANDIDATE_FILING_STATUS_LABELS: Record<CandidateFilingStatus, string> = {
  not_filed: "Not filed",
  filed: "Filed",
  pending_review: "Pending review",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  challenged: "Challenged",
};

export const INCUMBENCY_TYPE_LABELS: Record<IncumbencyType, string> = {
  none: "Not an incumbent",
  incumbent: "Incumbent",
  appointed_incumbent: "Appointed incumbent",
  former_officeholder: "Former officeholder",
  challenger: "Challenger",
  open_seat_candidate: "Open-seat candidate",
  unknown: "Unknown",
};

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  exploratory: "Exploratory",
  announced: "Announced",
  active: "Active",
  suspended: "Suspended",
  ended: "Ended",
  transition: "Transition",
  unknown: "Unknown",
};

export const BALLOT_ACCESS_STATUS_LABELS: Record<BallotAccessStatus, string> = {
  not_applicable: "Not applicable",
  pending: "Pending",
  qualified: "Qualified",
  challenged: "Challenged",
  removed: "Removed",
  write_in_only: "Write-in only",
  unknown: "Unknown",
};

function includesValue<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export function isCandidateStatus(value: unknown): value is CandidateStatus {
  return includesValue(CANDIDATE_STATUSES, value);
}

export function isCandidateFilingStatus(value: unknown): value is CandidateFilingStatus {
  return includesValue(CANDIDATE_FILING_STATUSES, value);
}

export function isIncumbencyType(value: unknown): value is IncumbencyType {
  return includesValue(INCUMBENCY_TYPES, value);
}

export function isCampaignStatus(value: unknown): value is CampaignStatus {
  return includesValue(CAMPAIGN_STATUSES, value);
}

export function isBallotAccessStatus(value: unknown): value is BallotAccessStatus {
  return includesValue(BALLOT_ACCESS_STATUSES, value);
}

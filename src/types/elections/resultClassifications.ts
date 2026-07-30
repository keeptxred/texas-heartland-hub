export const ELECTION_RESULT_STATUSES = [
  "not_started",
  "in_progress",
  "projected",
  "called",
  "final_unofficial",
  "certified",
  "recount",
  "contested",
  "voided",
] as const;

export const RESULT_REPORTING_STATUSES = [
  "not_reporting",
  "partial",
  "substantially_complete",
  "complete",
  "delayed",
  "paused",
  "unknown",
] as const;

export const WINNER_STATUSES = [
  "none",
  "leading",
  "projected_winner",
  "apparent_winner",
  "certified_winner",
  "tied",
  "runoff_required",
  "recount_pending",
  "contested",
] as const;

export const VOTE_METHODS = [
  "election_day",
  "early_in_person",
  "mail",
  "provisional",
  "curbside",
  "overseas_military",
  "write_in",
  "other",
  "all_methods",
] as const;

export const TABULATION_SCOPES = [
  "statewide",
  "county",
  "district",
  "precinct",
  "municipality",
  "school_district",
  "special_district",
  "race_total",
  "unknown",
] as const;

export const CERTIFICATION_STATUSES = [
  "not_applicable",
  "not_started",
  "pending",
  "partially_certified",
  "certified",
  "amended",
  "rescinded",
  "challenged",
  "unknown",
] as const;

export type ElectionResultStatus = (typeof ELECTION_RESULT_STATUSES)[number];
export type ResultReportingStatus = (typeof RESULT_REPORTING_STATUSES)[number];
export type WinnerStatus = (typeof WINNER_STATUSES)[number];
export type VoteMethod = (typeof VOTE_METHODS)[number];
export type TabulationScope = (typeof TABULATION_SCOPES)[number];
export type CertificationStatus = (typeof CERTIFICATION_STATUSES)[number];

export const ELECTION_RESULT_STATUS_LABELS: Record<ElectionResultStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  projected: "Projected",
  called: "Called",
  final_unofficial: "Final unofficial",
  certified: "Certified",
  recount: "Recount",
  contested: "Contested",
  voided: "Voided",
};

export const RESULT_REPORTING_STATUS_LABELS: Record<ResultReportingStatus, string> = {
  not_reporting: "Not reporting",
  partial: "Partial",
  substantially_complete: "Substantially complete",
  complete: "Complete",
  delayed: "Delayed",
  paused: "Paused",
  unknown: "Unknown",
};

export const WINNER_STATUS_LABELS: Record<WinnerStatus, string> = {
  none: "No winner",
  leading: "Leading",
  projected_winner: "Projected winner",
  apparent_winner: "Apparent winner",
  certified_winner: "Certified winner",
  tied: "Tied",
  runoff_required: "Runoff required",
  recount_pending: "Recount pending",
  contested: "Contested",
};

export const VOTE_METHOD_LABELS: Record<VoteMethod, string> = {
  election_day: "Election Day",
  early_in_person: "Early in-person",
  mail: "Mail",
  provisional: "Provisional",
  curbside: "Curbside",
  overseas_military: "Overseas and military",
  write_in: "Write-in",
  other: "Other",
  all_methods: "All methods",
};

export const TABULATION_SCOPE_LABELS: Record<TabulationScope, string> = {
  statewide: "Statewide",
  county: "County",
  district: "District",
  precinct: "Precinct",
  municipality: "Municipality",
  school_district: "School district",
  special_district: "Special district",
  race_total: "Race total",
  unknown: "Unknown",
};

export const CERTIFICATION_STATUS_LABELS: Record<CertificationStatus, string> = {
  not_applicable: "Not applicable",
  not_started: "Not started",
  pending: "Pending",
  partially_certified: "Partially certified",
  certified: "Certified",
  amended: "Amended",
  rescinded: "Rescinded",
  challenged: "Challenged",
  unknown: "Unknown",
};

function includesValue<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export function isElectionResultStatus(value: unknown): value is ElectionResultStatus {
  return includesValue(ELECTION_RESULT_STATUSES, value);
}

export function isResultReportingStatus(value: unknown): value is ResultReportingStatus {
  return includesValue(RESULT_REPORTING_STATUSES, value);
}

export function isWinnerStatus(value: unknown): value is WinnerStatus {
  return includesValue(WINNER_STATUSES, value);
}

export function isVoteMethod(value: unknown): value is VoteMethod {
  return includesValue(VOTE_METHODS, value);
}

export function isTabulationScope(value: unknown): value is TabulationScope {
  return includesValue(TABULATION_SCOPES, value);
}

export function isCertificationStatus(value: unknown): value is CertificationStatus {
  return includesValue(CERTIFICATION_STATUSES, value);
}

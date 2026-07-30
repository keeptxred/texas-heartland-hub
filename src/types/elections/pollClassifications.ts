export const POLL_STATUSES = [
  "draft",
  "fielding",
  "completed",
  "published",
  "revised",
  "withdrawn",
  "archived",
] as const;

export const POLL_POPULATIONS = [
  "adults",
  "registered_voters",
  "likely_voters",
  "primary_voters",
  "caucus_goers",
  "party_members",
  "other",
  "unknown",
] as const;

export const POLL_MODES = [
  "live_phone",
  "automated_phone",
  "online_panel",
  "text_message",
  "mail",
  "in_person",
  "mixed_mode",
  "other",
  "unknown",
] as const;

export const POLL_SPONSOR_TYPES = [
  "news_organization",
  "academic",
  "nonprofit",
  "campaign",
  "political_party",
  "advocacy_group",
  "pollster",
  "government",
  "other",
  "unknown",
] as const;

export const POLL_QUESTION_TYPES = [
  "head_to_head",
  "multi_candidate",
  "approval",
  "favorability",
  "ballot_measure",
  "issue",
  "generic_ballot",
  "primary_ballot",
  "runoff_ballot",
  "other",
] as const;

export const POLL_GRADES = [
  "a_plus",
  "a",
  "a_minus",
  "b_plus",
  "b",
  "b_minus",
  "c_plus",
  "c",
  "c_minus",
  "d",
  "f",
  "unrated",
] as const;

export type PollStatus = (typeof POLL_STATUSES)[number];
export type PollPopulation = (typeof POLL_POPULATIONS)[number];
export type PollMode = (typeof POLL_MODES)[number];
export type PollSponsorType = (typeof POLL_SPONSOR_TYPES)[number];
export type PollQuestionType = (typeof POLL_QUESTION_TYPES)[number];
export type PollGrade = (typeof POLL_GRADES)[number];

export const POLL_STATUS_LABELS: Record<PollStatus, string> = {
  draft: "Draft",
  fielding: "Fielding",
  completed: "Completed",
  published: "Published",
  revised: "Revised",
  withdrawn: "Withdrawn",
  archived: "Archived",
};

export const POLL_POPULATION_LABELS: Record<PollPopulation, string> = {
  adults: "Adults",
  registered_voters: "Registered voters",
  likely_voters: "Likely voters",
  primary_voters: "Primary voters",
  caucus_goers: "Caucus-goers",
  party_members: "Party members",
  other: "Other",
  unknown: "Unknown",
};

export const POLL_MODE_LABELS: Record<PollMode, string> = {
  live_phone: "Live telephone",
  automated_phone: "Automated telephone",
  online_panel: "Online panel",
  text_message: "Text message",
  mail: "Mail",
  in_person: "In person",
  mixed_mode: "Mixed mode",
  other: "Other",
  unknown: "Unknown",
};

export const POLL_SPONSOR_TYPE_LABELS: Record<PollSponsorType, string> = {
  news_organization: "News organization",
  academic: "Academic",
  nonprofit: "Nonprofit",
  campaign: "Campaign",
  political_party: "Political party",
  advocacy_group: "Advocacy group",
  pollster: "Pollster",
  government: "Government",
  other: "Other",
  unknown: "Unknown",
};

export const POLL_QUESTION_TYPE_LABELS: Record<PollQuestionType, string> = {
  head_to_head: "Head-to-head",
  multi_candidate: "Multi-candidate",
  approval: "Approval",
  favorability: "Favorability",
  ballot_measure: "Ballot measure",
  issue: "Issue",
  generic_ballot: "Generic ballot",
  primary_ballot: "Primary ballot",
  runoff_ballot: "Runoff ballot",
  other: "Other",
};

export const POLL_GRADE_LABELS: Record<PollGrade, string> = {
  a_plus: "A+",
  a: "A",
  a_minus: "A-",
  b_plus: "B+",
  b: "B",
  b_minus: "B-",
  c_plus: "C+",
  c: "C",
  c_minus: "C-",
  d: "D",
  f: "F",
  unrated: "Unrated",
};

function includesValue<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export function isPollStatus(value: unknown): value is PollStatus {
  return includesValue(POLL_STATUSES, value);
}

export function isPollPopulation(value: unknown): value is PollPopulation {
  return includesValue(POLL_POPULATIONS, value);
}

export function isPollMode(value: unknown): value is PollMode {
  return includesValue(POLL_MODES, value);
}

export function isPollSponsorType(value: unknown): value is PollSponsorType {
  return includesValue(POLL_SPONSOR_TYPES, value);
}

export function isPollQuestionType(value: unknown): value is PollQuestionType {
  return includesValue(POLL_QUESTION_TYPES, value);
}

export function isPollGrade(value: unknown): value is PollGrade {
  return includesValue(POLL_GRADES, value);
}

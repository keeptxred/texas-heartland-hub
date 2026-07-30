export const ELECTION_EVENT_TYPES = [
  "registration_deadline",
  "early_voting_start",
  "early_voting_end",
  "mail_ballot_request_deadline",
  "mail_ballot_return_deadline",
  "election_day",
  "poll_open",
  "poll_close",
  "canvass",
  "certification",
  "recount",
  "debate",
  "forum",
  "filing_deadline",
  "other",
] as const;

export const ELECTION_EVENT_STATUSES = [
  "scheduled",
  "confirmed",
  "rescheduled",
  "cancelled",
  "completed",
] as const;

export type ElectionEventType = (typeof ELECTION_EVENT_TYPES)[number];
export type ElectionEventStatus = (typeof ELECTION_EVENT_STATUSES)[number];

export const ELECTION_EVENT_TYPE_LABELS: Record<ElectionEventType, string> = {
  registration_deadline: "Registration deadline",
  early_voting_start: "Early voting starts",
  early_voting_end: "Early voting ends",
  mail_ballot_request_deadline: "Mail ballot request deadline",
  mail_ballot_return_deadline: "Mail ballot return deadline",
  election_day: "Election Day",
  poll_open: "Polls open",
  poll_close: "Polls close",
  canvass: "Canvass",
  certification: "Certification",
  recount: "Recount",
  debate: "Debate",
  forum: "Forum",
  filing_deadline: "Filing deadline",
  other: "Other",
};

export function isElectionEventType(value: unknown): value is ElectionEventType {
  return typeof value === "string" && ELECTION_EVENT_TYPES.includes(value as ElectionEventType);
}

export function isElectionEventStatus(value: unknown): value is ElectionEventStatus {
  return typeof value === "string" && ELECTION_EVENT_STATUSES.includes(value as ElectionEventStatus);
}

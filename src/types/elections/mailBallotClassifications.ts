export const MAIL_BALLOT_APPLICATION_STATUSES = [
  "not_started",
  "submitted",
  "received",
  "approved",
  "rejected",
  "cancelled",
  "unknown",
] as const;
export type MailBallotApplicationStatus = (typeof MAIL_BALLOT_APPLICATION_STATUSES)[number];

export const MAIL_BALLOT_STATUSES = [
  "not_issued",
  "issued",
  "in_transit",
  "received",
  "accepted",
  "rejected",
  "cured",
  "cancelled",
  "unknown",
] as const;
export type MailBallotStatus = (typeof MAIL_BALLOT_STATUSES)[number];

export const MAIL_BALLOT_ELIGIBILITY_REASONS = [
  "age_65_or_older",
  "disability",
  "expected_absence",
  "confined_in_jail",
  "childbirth",
  "military_or_overseas",
  "other",
] as const;
export type MailBallotEligibilityReason = (typeof MAIL_BALLOT_ELIGIBILITY_REASONS)[number];

export const MAIL_BALLOT_RETURN_METHODS = ["mail", "common_carrier", "in_person", "military_overseas"] as const;
export type MailBallotReturnMethod = (typeof MAIL_BALLOT_RETURN_METHODS)[number];

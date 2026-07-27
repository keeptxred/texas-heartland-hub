export const ENDORSEMENT_TYPES = [
  "candidate",
  "ballot_measure_support",
  "ballot_measure_opposition",
] as const;
export type EndorsementType = (typeof ENDORSEMENT_TYPES)[number];

export const ENDORSER_TYPES = [
  "individual",
  "organization",
  "newspaper",
  "union",
  "political_committee",
  "elected_official",
  "party",
  "other",
] as const;
export type EndorserType = (typeof ENDORSER_TYPES)[number];

export const ENDORSEMENT_STATUSES = ["active", "withdrawn", "superseded"] as const;
export type EndorsementStatus = (typeof ENDORSEMENT_STATUSES)[number];
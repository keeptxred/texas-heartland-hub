export const ELECTION_AUTHORITY_LEVELS = ["state", "county", "municipal", "district", "other"] as const;
export type ElectionAuthorityLevel = (typeof ELECTION_AUTHORITY_LEVELS)[number];

export const ELECTION_AUTHORITY_TYPES = [
  "secretary_of_state",
  "county_elections_office",
  "county_clerk",
  "elections_administrator",
  "tax_assessor_collector",
  "municipal_clerk",
  "district_office",
  "other",
] as const;
export type ElectionAuthorityType = (typeof ELECTION_AUTHORITY_TYPES)[number];

export const ELECTION_AUTHORITY_STATUSES = ["active", "temporary", "inactive", "unverified"] as const;
export type ElectionAuthorityStatus = (typeof ELECTION_AUTHORITY_STATUSES)[number];

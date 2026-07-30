export const VOTING_LOCATION_TYPES = ["early_voting", "election_day", "combined", "other"] as const;
export type VotingLocationType = (typeof VOTING_LOCATION_TYPES)[number];

export const VOTING_LOCATION_STATUSES = ["scheduled", "open", "closed", "relocated", "cancelled", "unverified"] as const;
export type VotingLocationStatus = (typeof VOTING_LOCATION_STATUSES)[number];

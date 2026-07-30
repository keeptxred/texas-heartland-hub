export const VOTER_GUIDE_TYPES = ["general", "race_specific", "candidate_comparison", "issue_guide", "local_guide", "other"] as const;
export type VoterGuideType = (typeof VOTER_GUIDE_TYPES)[number];

export const VOTER_GUIDE_STATUSES = ["draft", "review", "published", "archived"] as const;
export type VoterGuideStatus = (typeof VOTER_GUIDE_STATUSES)[number];

export const VOTER_GUIDE_AUDIENCES = ["all_voters", "county", "district", "city", "precinct", "other"] as const;
export type VoterGuideAudience = (typeof VOTER_GUIDE_AUDIENCES)[number];

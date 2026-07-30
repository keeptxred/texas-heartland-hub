export const LEGISLATIVE_SCORECARD_TYPES = ["organization", "editorial", "issue_specific", "composite", "other"] as const;
export type LegislativeScorecardType = (typeof LEGISLATIVE_SCORECARD_TYPES)[number];

export const LEGISLATIVE_SCORECARD_STATUSES = ["draft", "published", "archived", "withdrawn"] as const;
export type LegislativeScorecardStatus = (typeof LEGISLATIVE_SCORECARD_STATUSES)[number];

export const LEGISLATIVE_SCORE_GRADES = ["a_plus", "a", "b", "c", "d", "f", "pass", "fail", "ungraded"] as const;
export type LegislativeScoreGrade = (typeof LEGISLATIVE_SCORE_GRADES)[number];

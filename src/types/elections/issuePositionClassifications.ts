export const ELECTION_ISSUE_CATEGORIES = [
  "economy",
  "taxes",
  "education",
  "healthcare",
  "public_safety",
  "immigration",
  "energy",
  "environment",
  "transportation",
  "housing",
  "agriculture",
  "veterans",
  "civil_rights",
  "elections",
  "government_reform",
  "other",
] as const;
export type ElectionIssueCategory = (typeof ELECTION_ISSUE_CATEGORIES)[number];

export const CANDIDATE_POSITION_STANCES = [
  "supports",
  "opposes",
  "mixed",
  "neutral",
  "unclear",
  "not_stated",
] as const;
export type CandidatePositionStance = (typeof CANDIDATE_POSITION_STANCES)[number];

export const POSITION_EVIDENCE_TYPES = [
  "campaign_website",
  "questionnaire",
  "public_statement",
  "debate",
  "interview",
  "press_release",
  "voting_record",
  "legislation",
  "social_media",
  "third_party_summary",
  "other",
] as const;
export type PositionEvidenceType = (typeof POSITION_EVIDENCE_TYPES)[number];

export const POSITION_CONFIDENCE_LEVELS = ["high", "medium", "low", "unverified"] as const;
export type PositionConfidenceLevel = (typeof POSITION_CONFIDENCE_LEVELS)[number];

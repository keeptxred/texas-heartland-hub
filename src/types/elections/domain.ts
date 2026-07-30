export const CANDIDATE_PARTIES = [
  "republican",
  "democratic",
  "libertarian",
  "green",
  "independent",
  "nonpartisan",
  "other",
] as const;

export const ELECTION_STATUSES = [
  "scheduled",
  "early_voting",
  "polls_open",
  "polls_closed",
  "counting",
  "called",
  "certified",
  "recount",
  "cancelled",
] as const;

export const RACE_RATINGS = [
  "safe_republican",
  "likely_republican",
  "leans_republican",
  "toss_up",
  "leans_democratic",
  "likely_democratic",
  "safe_democratic",
  "unrated",
] as const;

export type CandidateParty = (typeof CANDIDATE_PARTIES)[number];
export type ElectionStatus = (typeof ELECTION_STATUSES)[number];
export type RaceRating = (typeof RACE_RATINGS)[number];

export interface ElectionCycle {
  id: string;
  year: number;
  name: string;
  slug: string;
  electionDate: string;
  primaryDate: string | null;
  primaryRunoffDate: string | null;
  registrationDeadline: string | null;
  earlyVotingStart: string | null;
  earlyVotingEnd: string | null;
  status: ElectionStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Office {
  id: string;
  name: string;
  slug: string;
  level: "federal" | "state" | "county" | "local";
  branch: "executive" | "legislative" | "judicial" | "administrative";
  districtRequired: boolean;
  termLengthYears: number | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface District {
  id: string;
  name: string;
  slug: string;
  districtType:
    | "statewide"
    | "congressional"
    | "state_senate"
    | "state_house"
    | "state_board_of_education"
    | "judicial"
    | "county"
    | "municipal"
    | "other";
  districtNumber: string | null;
  stateCode: string;
  countyIds: string[];
  population: number | null;
  geometryUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface County {
  id: string;
  name: string;
  slug: string;
  stateCode: string;
  fipsCode: string;
  population: number | null;
  electionsUrl: string | null;
  resultsUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  electionCycleId: string;
  fullName: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  slug: string;
  party: CandidateParty;
  partyLabel: string | null;
  incumbent: boolean;
  status: "active" | "withdrawn" | "disqualified" | "write_in";
  biography: string | null;
  occupation: string | null;
  hometown: string | null;
  photoUrl: string | null;
  websiteUrl: string | null;
  campaignUrl: string | null;
  fecCandidateId: string | null;
  texasEthicsId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Race {
  id: string;
  electionCycleId: string;
  officeId: string;
  districtId: string | null;
  name: string;
  slug: string;
  electionDate: string;
  electionType: "general" | "primary" | "runoff" | "special" | "local";
  status: ElectionStatus;
  rating: RaceRating;
  featured: boolean;
  competitive: boolean;
  candidateIds: string[];
  winnerCandidateId: string | null;
  calledAt: string | null;
  certifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PollResult {
  candidateId: string;
  percentage: number;
  sampleSize: number | null;
  marginOfError: number | null;
}

export interface Poll {
  id: string;
  raceId: string;
  pollster: string;
  sponsor: string | null;
  sourceUrl: string;
  startDate: string;
  endDate: string;
  publishedAt: string;
  sampleSize: number;
  population: "registered_voters" | "likely_voters" | "adults" | "unknown";
  methodology: "phone" | "online" | "mixed" | "text" | "unknown";
  marginOfError: number | null;
  grade: string | null;
  partisanSponsor: CandidateParty | null;
  results: PollResult[];
  createdAt: string;
  updatedAt: string;
}

export interface Forecast {
  id: string;
  raceId: string;
  generatedAt: string;
  modelVersion: string;
  rating: RaceRating;
  projectedMargin: number | null;
  confidence: number;
  candidateProbabilities: Record<string, number>;
  pollingWeight: number;
  fundamentalsWeight: number;
  incumbencyWeight: number;
  fundraisingWeight: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

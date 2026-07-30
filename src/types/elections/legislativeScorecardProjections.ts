import type { CandidateId, ElectionCycleId, LegislativeScorecardId, LegislativeScorecardSlug } from "./identifiers";
import type { LegislativeScorecard } from "./legislativeScorecard";
import type { LegislativeScoreGrade, LegislativeScorecardStatus, LegislativeScorecardType } from "./legislativeScorecardClassifications";
import type { IsoDateTimeString } from "./metadata";

export interface LegislativeScorecardSummary {
  id: LegislativeScorecardId;
  slug: LegislativeScorecardSlug;
  electionCycleId: ElectionCycleId;
  candidateId: CandidateId;
  candidateName: string;
  title: string;
  publisherName: string;
  scorecardType: LegislativeScorecardType;
  status: LegislativeScorecardStatus;
  percentageScore: number | null;
  grade: LegislativeScoreGrade;
  sourceUrl: string;
  verified: boolean;
  featured: boolean;
  updatedAt: IsoDateTimeString;
}

export interface LegislativeScorecardDetail extends LegislativeScorecard {
  candidateName: string;
  candidateSlug: string;
  candidatePartyLabel: string | null;
}

export interface CandidateLegislativeScorecardProfile {
  candidateId: CandidateId;
  candidateName: string;
  scorecards: readonly LegislativeScorecardSummary[];
  averagePercentageScore: number | null;
  scorecardCount: number;
  lastUpdatedAt: IsoDateTimeString | null;
}

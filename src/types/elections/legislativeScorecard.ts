import type { CandidateId, ElectionCycleId, LegislativeScorecardId, LegislativeScorecardSlug } from "./identifiers";
import type { ElectionDataMetadata, IsoDateString, IsoDateTimeString } from "./metadata";
import type { LegislativeScoreGrade, LegislativeScorecardStatus, LegislativeScorecardType } from "./legislativeScorecardClassifications";

export interface LegislativeScorecardItem {
  title: string;
  description: string | null;
  position: string | null;
  pointsEarned: number;
  pointsPossible: number;
  sourceUrl: string | null;
}

export interface LegislativeScorecard extends ElectionDataMetadata {
  id: LegislativeScorecardId;
  slug: LegislativeScorecardSlug;
  electionCycleId: ElectionCycleId;
  candidateId: CandidateId;
  title: string;
  publisherName: string;
  scorecardType: LegislativeScorecardType;
  status: LegislativeScorecardStatus;
  score: number | null;
  maximumScore: number | null;
  percentageScore: number | null;
  grade: LegislativeScoreGrade;
  summary: string | null;
  items: readonly LegislativeScorecardItem[];
  sourceUrl: string;
  publishedOn: IsoDateString | null;
  verifiedAt: IsoDateTimeString | null;
  featured: boolean;
  notes: string | null;
}

export type LegislativeScorecardCreateInput = Omit<LegislativeScorecard, "id" | "createdAt" | "updatedAt">;

export type LegislativeScorecardUpdateInput = Partial<
  Omit<LegislativeScorecard, "id" | "electionCycleId" | "candidateId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};

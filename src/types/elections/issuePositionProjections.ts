import type { CandidateIssuePosition } from "./issuePosition";
import type { CandidatePositionStance, ElectionIssueCategory } from "./issuePositionClassifications";
import type { CandidateId, IssuePositionId, IssuePositionSlug, RaceId } from "./identifiers";
import type { ElectionPublicationStatus, ElectionVerificationStatus, IsoDateTimeString } from "./metadata";

export interface CandidateIssuePositionSummary {
  id: IssuePositionId;
  slug: IssuePositionSlug;
  candidateId: CandidateId;
  candidateName: string;
  candidateSlug: string;
  raceId: RaceId | null;
  raceName: string | null;
  category: ElectionIssueCategory;
  issueName: string;
  stance: CandidatePositionStance;
  positionSummary: string;
  sourceUrl: string;
  verified: boolean;
  featured: boolean;
  updatedAt: IsoDateTimeString;
}

export interface CandidateIssuePositionDetail extends CandidateIssuePosition {
  candidateName: string;
  candidateSlug: string;
  candidatePartyLabel: string | null;
  raceName: string | null;
  publicationStatus: ElectionPublicationStatus;
  verificationStatus: ElectionVerificationStatus;
}

export interface CandidateIssueComparisonRow {
  category: ElectionIssueCategory;
  issueName: string;
  positions: readonly CandidateIssuePositionSummary[];
}

export interface CandidateIssueProfile {
  candidateId: CandidateId;
  candidateName: string;
  positions: readonly CandidateIssuePositionSummary[];
  statedPositionCount: number;
  verifiedPositionCount: number;
  lastUpdatedAt: IsoDateTimeString | null;
}

import type {
  CandidatePositionStance,
  ElectionIssueCategory,
  PositionConfidenceLevel,
  PositionEvidenceType,
} from "./issuePositionClassifications";
import type {
  CandidateId,
  ElectionCycleId,
  IssuePositionId,
  IssuePositionSlug,
  RaceId,
} from "./identifiers";
import type { ElectionDataMetadata, IsoDateString, IsoDateTimeString } from "./metadata";

export interface CandidateIssuePosition extends ElectionDataMetadata {
  id: IssuePositionId;
  slug: IssuePositionSlug;
  electionCycleId: ElectionCycleId;
  raceId: RaceId | null;
  candidateId: CandidateId;
  category: ElectionIssueCategory;
  issueName: string;
  issueSummary: string | null;
  stance: CandidatePositionStance;
  positionSummary: string;
  detailedPosition: string | null;
  evidenceType: PositionEvidenceType;
  confidence: PositionConfidenceLevel;
  sourceTitle: string | null;
  sourceUrl: string;
  sourcePublishedOn: IsoDateString | null;
  observedAt: IsoDateTimeString;
  quoteExcerpt: string | null;
  verifiedByEditor: boolean;
  featured: boolean;
  notes: string | null;
}

export type CandidateIssuePositionCreateInput = Omit<
  CandidateIssuePosition,
  "id" | "createdAt" | "updatedAt"
>;

export type CandidateIssuePositionUpdateInput = Partial<
  Omit<CandidateIssuePosition, "id" | "electionCycleId" | "candidateId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};

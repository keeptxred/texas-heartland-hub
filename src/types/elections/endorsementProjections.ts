import type { ElectionEndorsement } from "./endorsement";

export interface ElectionEndorsementSummary extends ElectionEndorsement {
  targetName: string;
  raceName: string | null;
  candidateName: string | null;
  ballotMeasureTitle: string | null;
}

export interface ElectionEndorsementDetail extends ElectionEndorsementSummary {
  relatedEndorsements: readonly ElectionEndorsementSummary[];
}

export interface EndorsementTargetSummary {
  targetName: string;
  total: number;
  featured: number;
  endorsements: readonly ElectionEndorsementSummary[];
}
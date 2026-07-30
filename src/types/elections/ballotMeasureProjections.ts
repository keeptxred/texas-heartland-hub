import type { ElectionBallotMeasure } from "./ballotMeasure";
import type { BallotMeasureId, BallotMeasureSlug, ElectionCycleId } from "./identifiers";
import type { ElectionFreshnessStatus, ElectionVerificationStatus, IsoDateString, IsoDateTimeString } from "./metadata";
import type { BallotMeasureStatus, BallotMeasureType } from "./ballotMeasureClassifications";

export interface BallotMeasureSummary {
  id: BallotMeasureId;
  slug: BallotMeasureSlug;
  electionCycleId: ElectionCycleId;
  measureNumber: string | null;
  shortTitle: string;
  jurisdictionName: string;
  type: BallotMeasureType;
  status: BallotMeasureStatus;
  electionDate: IsoDateString;
  yesPercentage: number | null;
  noPercentage: number | null;
  totalVotes: number | null;
  freshnessStatus: ElectionFreshnessStatus;
  verificationStatus: ElectionVerificationStatus;
  updatedAt: IsoDateTimeString;
}

export interface BallotMeasureDetail extends ElectionBallotMeasure {
  relatedArticleUrls: readonly string[];
  explainerUrl: string | null;
}

export type BallotMeasureListItem = BallotMeasureSummary;

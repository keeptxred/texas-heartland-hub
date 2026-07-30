import type { CountyId, DistrictId, ElectionCycleId, BallotMeasureId, BallotMeasureSlug } from "./identifiers";
import type { ElectionDataMetadata, IsoDateString, IsoDateTimeString } from "./metadata";
import type { BallotMeasureStatus, BallotMeasureType } from "./ballotMeasureClassifications";

export interface BallotMeasureCommittee {
  name: string;
  position: "support" | "oppose" | "neutral";
  websiteUrl: string | null;
  treasurerName: string | null;
  filingUrl: string | null;
}

export interface BallotMeasureFiscalImpact {
  estimatedCost: number | null;
  estimatedRevenue: number | null;
  currency: "USD";
  period: string | null;
  summary: string | null;
  sourceUrl: string | null;
}

export interface ElectionBallotMeasure extends ElectionDataMetadata {
  id: BallotMeasureId;
  slug: BallotMeasureSlug;
  electionCycleId: ElectionCycleId;
  countyId: CountyId | null;
  districtId: DistrictId | null;
  stateCode: string;
  jurisdictionName: string;
  measureNumber: string | null;
  shortTitle: string;
  officialTitle: string;
  ballotLanguage: string;
  summary: string | null;
  type: BallotMeasureType;
  status: BallotMeasureStatus;
  electionDate: IsoDateString;
  qualifiedAt: IsoDateTimeString | null;
  calledAt: IsoDateTimeString | null;
  certifiedAt: IsoDateTimeString | null;
  yesVotes: number | null;
  noVotes: number | null;
  totalVotes: number | null;
  yesPercentage: number | null;
  noPercentage: number | null;
  thresholdPercentage: number | null;
  committees: readonly BallotMeasureCommittee[];
  fiscalImpact: BallotMeasureFiscalImpact | null;
  officialUrl: string | null;
  resultsUrl: string | null;
  sourceDocumentUrl: string | null;
  notes: string | null;
}

export type ElectionBallotMeasureCreateInput = Omit<
  ElectionBallotMeasure,
  "id" | "createdAt" | "updatedAt"
>;

export type ElectionBallotMeasureUpdateInput = Partial<
  Omit<ElectionBallotMeasure, "id" | "electionCycleId" | "createdAt">
> & { updatedAt: IsoDateTimeString };

import type { EndorsementStatus, EndorsementType, EndorserType } from "./endorsementClassifications";
import type { BallotMeasureId, CandidateId, ElectionCycleId, EndorsementId, EndorsementSlug, RaceId } from "./identifiers";
import type { ElectionDataMetadata, IsoDateString, IsoDateTimeString } from "./metadata";

export interface ElectionEndorsement extends ElectionDataMetadata {
  id: EndorsementId;
  slug: EndorsementSlug;
  electionCycleId: ElectionCycleId;
  raceId: RaceId | null;
  candidateId: CandidateId | null;
  ballotMeasureId: BallotMeasureId | null;
  type: EndorsementType;
  status: EndorsementStatus;
  endorserType: EndorserType;
  endorserName: string;
  endorserTitle: string | null;
  endorserOrganization: string | null;
  statement: string | null;
  endorsedOn: IsoDateString;
  announcedAt: IsoDateTimeString | null;
  withdrawnAt: IsoDateTimeString | null;
  sourceUrl: string;
  sourceTitle: string | null;
  imageUrl: string | null;
  featured: boolean;
  notes: string | null;
}

export type ElectionEndorsementCreateInput = Omit<ElectionEndorsement, "id" | "createdAt" | "updatedAt">;
export type ElectionEndorsementUpdateInput = Partial<Omit<ElectionEndorsement, "id" | "electionCycleId" | "createdAt">> & {
  updatedAt: IsoDateTimeString;
};
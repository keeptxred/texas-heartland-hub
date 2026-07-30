import type { CountyId, ElectionCycleId, SampleBallotId, SampleBallotSlug } from "./identifiers";
import type { ElectionDataMetadata, IsoDateTimeString } from "./metadata";
import type { SampleBallotFormat, SampleBallotPrecisionLevel, SampleBallotStatus } from "./sampleBallotClassifications";

export interface SampleBallot extends ElectionDataMetadata {
  id: SampleBallotId;
  slug: SampleBallotSlug;
  electionCycleId: ElectionCycleId;
  countyId: CountyId | null;
  title: string;
  description: string | null;
  precisionLevel: SampleBallotPrecisionLevel;
  format: SampleBallotFormat;
  status: SampleBallotStatus;
  precinctCode: string | null;
  ballotStyleCode: string | null;
  jurisdictionName: string | null;
  sourceUrl: string;
  documentUrl: string | null;
  lookupUrl: string | null;
  publishedAt: IsoDateTimeString | null;
  verifiedAt: IsoDateTimeString | null;
  featured: boolean;
  notes: string | null;
}

export type SampleBallotCreateInput = Omit<SampleBallot, "id" | "createdAt" | "updatedAt">;

export type SampleBallotUpdateInput = Partial<
  Omit<SampleBallot, "id" | "electionCycleId" | "countyId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};

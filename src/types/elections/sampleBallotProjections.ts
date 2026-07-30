import type { CountyId, ElectionCycleId, SampleBallotId, SampleBallotSlug } from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type { SampleBallot } from "./sampleBallot";
import type { SampleBallotFormat, SampleBallotPrecisionLevel, SampleBallotStatus } from "./sampleBallotClassifications";

export interface SampleBallotSummary {
  id: SampleBallotId;
  slug: SampleBallotSlug;
  electionCycleId: ElectionCycleId;
  countyId: CountyId | null;
  title: string;
  precisionLevel: SampleBallotPrecisionLevel;
  format: SampleBallotFormat;
  status: SampleBallotStatus;
  sourceUrl: string;
  verified: boolean;
  updatedAt: IsoDateTimeString;
}

export interface SampleBallotDetail extends SampleBallot {
  countyName: string | null;
  countySlug: string | null;
}

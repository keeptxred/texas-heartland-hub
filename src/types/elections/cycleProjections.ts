import type { ElectionStatus } from "./domain";
import type {
  ElectionCycleId,
  ElectionCycleSlug,
} from "./identifiers";
import type {
  ElectionFreshnessStatus,
  ElectionVerificationStatus,
  IsoDateString,
  IsoDateTimeString,
} from "./metadata";
import type { ElectionCycle } from "./cycle";

export interface ElectionCycleSummary {
  id: ElectionCycleId;
  slug: ElectionCycleSlug;
  year: number;
  name: string;
  stateCode: string;
  status: ElectionStatus;
  electionDate: IsoDateString;
  earlyVotingStart: IsoDateString | null;
  earlyVotingEnd: IsoDateString | null;
  active: boolean;
  featured: boolean;
  raceCount: number;
  candidateCount: number;
  freshnessStatus: ElectionFreshnessStatus;
  verificationStatus: ElectionVerificationStatus;
  updatedAt: IsoDateTimeString;
}

export interface ElectionCycleDetail extends ElectionCycle {
  raceCount: number;
  candidateCount: number;
  pollCount: number;
  forecastCount: number;
  resultCount: number;
}

export type ElectionCycleListItem = ElectionCycleSummary;

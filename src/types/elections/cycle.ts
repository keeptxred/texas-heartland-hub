import type { ElectionStatus } from "./domain";
import type {
  ElectionCycleId,
  ElectionCycleSlug,
} from "./identifiers";
import type {
  ElectionDataMetadata,
  IsoDateString,
  IsoDateTimeString,
} from "./metadata";

export interface ElectionCycleMilestones {
  registrationDeadline: IsoDateString | null;
  earlyVotingStart: IsoDateString | null;
  earlyVotingEnd: IsoDateString | null;
  absenteeBallotRequestDeadline: IsoDateString | null;
  absenteeBallotReturnDeadline: IsoDateString | null;
  primaryDate: IsoDateString | null;
  primaryRunoffDate: IsoDateString | null;
  generalElectionDate: IsoDateString;
  certificationDeadline: IsoDateString | null;
}

export interface ElectionCycle extends ElectionDataMetadata {
  id: ElectionCycleId;
  slug: ElectionCycleSlug;
  year: number;
  name: string;
  description: string | null;
  stateCode: string;
  status: ElectionStatus;
  milestones: ElectionCycleMilestones;
  active: boolean;
  featured: boolean;
  archivedAt: IsoDateTimeString | null;
}

export type ElectionCycleCreateInput = Omit<
  ElectionCycle,
  "id" | "createdAt" | "updatedAt"
>;

export type ElectionCycleUpdateInput = Partial<
  Omit<ElectionCycle, "id" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};

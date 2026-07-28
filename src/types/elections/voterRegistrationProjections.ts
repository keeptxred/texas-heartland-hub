import type { VoterRegistrationRecord } from "./voterRegistration";
import type {
  VoterEligibilityStatus,
  VoterRegistrationStatus,
} from "./voterRegistrationClassifications";
import type {
  CountyId,
  ElectionCycleId,
  VoterRegistrationId,
  VoterRegistrationSlug,
} from "./identifiers";
import type { IsoDateString, IsoDateTimeString } from "./metadata";

export interface VoterRegistrationSummary {
  id: VoterRegistrationId;
  slug: VoterRegistrationSlug;
  electionCycleId: ElectionCycleId;
  countyId: CountyId;
  countyName: string;
  status: VoterRegistrationStatus;
  eligibilityStatus: VoterEligibilityStatus;
  registrationDeadline: IsoDateString | null;
  precinctCode: string | null;
  lastVerifiedAt: IsoDateTimeString | null;
  updatedAt: IsoDateTimeString;
}

export interface VoterRegistrationDetail extends VoterRegistrationRecord {
  countyName: string;
  countySlug: string;
  electionCycleName: string;
  lookupAvailable: boolean;
  officialLookupUrl: string | null;
  officialApplicationUrl: string | null;
}

export interface VoterRegistrationCountyOverview {
  countyId: CountyId;
  countyName: string;
  registrationDeadline: IsoDateString | null;
  activeCount: number;
  pendingCount: number;
  inactiveCount: number;
  lastUpdatedAt: IsoDateTimeString | null;
}

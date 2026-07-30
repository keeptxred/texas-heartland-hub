import type { CountyId, ElectionCycleId, VotingLocationId, VotingLocationSlug } from "./identifiers";
import type { ElectionDataMetadata, IsoDateString, IsoDateTimeString } from "./metadata";
import type { VotingLocationStatus, VotingLocationType } from "./votingLocationClassifications";

export interface VotingLocationHours {
  date: IsoDateString;
  opensAt: string;
  closesAt: string;
  notes: string | null;
}

export interface VotingLocation extends ElectionDataMetadata {
  id: VotingLocationId;
  slug: VotingLocationSlug;
  electionCycleId: ElectionCycleId;
  countyId: CountyId;
  name: string;
  locationType: VotingLocationType;
  status: VotingLocationStatus;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateCode: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  hours: readonly VotingLocationHours[];
  accessibilityNotes: string | null;
  parkingNotes: string | null;
  instructions: string | null;
  sourceUrl: string;
  verifiedAt: IsoDateTimeString | null;
  featured: boolean;
  notes: string | null;
}

export type VotingLocationCreateInput = Omit<VotingLocation, "id" | "createdAt" | "updatedAt">;

export type VotingLocationUpdateInput = Partial<
  Omit<VotingLocation, "id" | "electionCycleId" | "countyId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};

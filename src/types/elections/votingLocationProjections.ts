import type { CountyId, ElectionCycleId, VotingLocationId, VotingLocationSlug } from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type { VotingLocation } from "./votingLocation";
import type { VotingLocationStatus, VotingLocationType } from "./votingLocationClassifications";

export interface VotingLocationSummary {
  id: VotingLocationId;
  slug: VotingLocationSlug;
  electionCycleId: ElectionCycleId;
  countyId: CountyId;
  countyName: string;
  name: string;
  locationType: VotingLocationType;
  status: VotingLocationStatus;
  address: string;
  city: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  nextOpensAt: IsoDateTimeString | null;
  nextClosesAt: IsoDateTimeString | null;
  verified: boolean;
  featured: boolean;
  updatedAt: IsoDateTimeString;
}

export interface VotingLocationDetail extends VotingLocation {
  countyName: string;
  countySlug: string;
  directionsUrl: string | null;
  currentlyOpen: boolean | null;
}

export interface CountyVotingLocationDirectory {
  countyId: CountyId;
  countyName: string;
  electionCycleId: ElectionCycleId;
  locations: readonly VotingLocationSummary[];
  openLocationCount: number;
  totalLocationCount: number;
  lastVerifiedAt: IsoDateTimeString | null;
}

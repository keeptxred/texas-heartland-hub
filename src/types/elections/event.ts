import type { CountyId, DistrictId, ElectionCycleId, ElectionEventId, ElectionEventSlug, RaceId } from "./identifiers";
import type { ElectionDataMetadata, IsoDateTimeString } from "./metadata";
import type { ElectionEventStatus, ElectionEventType } from "./eventClassifications";

export interface ElectionEventLocation {
  name: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  stateCode: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  virtualUrl: string | null;
}

export interface ElectionEvent extends ElectionDataMetadata {
  id: ElectionEventId;
  slug: ElectionEventSlug;
  electionCycleId: ElectionCycleId;
  raceId: RaceId | null;
  countyId: CountyId | null;
  districtId: DistrictId | null;
  type: ElectionEventType;
  status: ElectionEventStatus;
  title: string;
  description: string | null;
  startsAt: IsoDateTimeString;
  endsAt: IsoDateTimeString | null;
  allDay: boolean;
  timeZone: string;
  location: ElectionEventLocation | null;
  officialUrl: string | null;
  registrationUrl: string | null;
  sourceUrl: string | null;
  rescheduledFrom: IsoDateTimeString | null;
  cancelledAt: IsoDateTimeString | null;
  notes: string | null;
}

export type ElectionEventCreateInput = Omit<ElectionEvent, "id" | "createdAt" | "updatedAt">;
export type ElectionEventUpdateInput = Partial<Omit<ElectionEvent, "id" | "electionCycleId" | "createdAt">> & {
  updatedAt: IsoDateTimeString;
};

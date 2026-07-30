import type { CountyId, CountySlug, ElectionEntityId } from "./identifiers";
import type { ElectionDataMetadata, IsoDateTimeString } from "./metadata";

export interface ElectionCounty extends ElectionDataMetadata {
  id: CountyId;
  slug: CountySlug;
  entityId: ElectionEntityId | null;
  name: string;
  stateCode: string;
  fipsCode: string;
  population: number | null;
  electionsUrl: string | null;
  resultsUrl: string | null;
  voterRegistrationUrl: string | null;
  earlyVotingUrl: string | null;
  active: boolean;
  archivedAt: IsoDateTimeString | null;
}

export type ElectionCountyCreateInput = Omit<
  ElectionCounty,
  "id" | "createdAt" | "updatedAt"
>;

export type ElectionCountyUpdateInput = Partial<
  Omit<ElectionCounty, "id" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};
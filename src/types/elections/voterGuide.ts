import type { CountyId, ElectionCycleId, RaceId, VoterGuideId, VoterGuideSlug } from "./identifiers";
import type { ElectionDataMetadata, IsoDateTimeString } from "./metadata";
import type { VoterGuideAudience, VoterGuideStatus, VoterGuideType } from "./voterGuideClassifications";

export interface VoterGuideSection {
  heading: string;
  summary: string | null;
  body: string;
  sortOrder: number;
}

export interface VoterGuide extends ElectionDataMetadata {
  id: VoterGuideId;
  slug: VoterGuideSlug;
  electionCycleId: ElectionCycleId;
  countyId: CountyId | null;
  raceId: RaceId | null;
  title: string;
  description: string | null;
  guideType: VoterGuideType;
  audience: VoterGuideAudience;
  status: VoterGuideStatus;
  sections: readonly VoterGuideSection[];
  sourceUrl: string | null;
  publishedAt: IsoDateTimeString | null;
  reviewedAt: IsoDateTimeString | null;
  featured: boolean;
  notes: string | null;
}

export type VoterGuideCreateInput = Omit<VoterGuide, "id" | "createdAt" | "updatedAt">;

export type VoterGuideUpdateInput = Partial<
  Omit<VoterGuide, "id" | "electionCycleId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};

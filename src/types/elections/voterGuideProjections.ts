import type { CountyId, ElectionCycleId, RaceId, VoterGuideId, VoterGuideSlug } from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type { VoterGuide } from "./voterGuide";
import type { VoterGuideAudience, VoterGuideStatus, VoterGuideType } from "./voterGuideClassifications";

export interface VoterGuideSummary {
  id: VoterGuideId;
  slug: VoterGuideSlug;
  electionCycleId: ElectionCycleId;
  countyId: CountyId | null;
  countyName: string | null;
  raceId: RaceId | null;
  raceName: string | null;
  title: string;
  guideType: VoterGuideType;
  audience: VoterGuideAudience;
  status: VoterGuideStatus;
  sectionCount: number;
  featured: boolean;
  updatedAt: IsoDateTimeString;
}

export interface VoterGuideDetail extends VoterGuide {
  countyName: string | null;
  countySlug: string | null;
  raceName: string | null;
  raceSlug: string | null;
}

export interface ElectionCycleVoterGuideDirectory {
  electionCycleId: ElectionCycleId;
  guides: readonly VoterGuideSummary[];
  publishedGuideCount: number;
  featuredGuideCount: number;
  lastUpdatedAt: IsoDateTimeString | null;
}

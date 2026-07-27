import type { ElectionEvent } from "./event";
import type { ElectionEventId, ElectionEventSlug } from "./identifiers";
import type { ElectionFreshnessStatus, ElectionVerificationStatus, IsoDateTimeString } from "./metadata";
import type { ElectionEventStatus, ElectionEventType } from "./eventClassifications";

export interface ElectionEventSummary {
  id: ElectionEventId;
  slug: ElectionEventSlug;
  type: ElectionEventType;
  status: ElectionEventStatus;
  title: string;
  startsAt: IsoDateTimeString;
  endsAt: IsoDateTimeString | null;
  allDay: boolean;
  timeZone: string;
  locationName: string | null;
  freshnessStatus: ElectionFreshnessStatus;
  verificationStatus: ElectionVerificationStatus;
  updatedAt: IsoDateTimeString;
}

export interface ElectionEventDetail extends ElectionEvent {
  relatedArticleUrls: readonly string[];
  calendarDownloadUrl: string | null;
}

export type ElectionEventListItem = ElectionEventSummary;

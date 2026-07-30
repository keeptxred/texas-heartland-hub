export type IsoDateString = string;
export type IsoDateTimeString = string;

export interface ElectionTimestamps {
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export interface ElectionPublicationTimestamps {
  publishedAt: IsoDateTimeString | null;
  unpublishedAt: IsoDateTimeString | null;
}

export const ELECTION_SOURCE_TYPES = [
  "official",
  "government",
  "campaign",
  "pollster",
  "forecast_provider",
  "news_organization",
  "academic",
  "manual",
  "other",
] as const;

export type ElectionSourceType = (typeof ELECTION_SOURCE_TYPES)[number];

export interface ElectionSourceAttribution {
  sourceId?: string | null;
  sourceName: string;
  sourceType: ElectionSourceType;
  sourceUrl: string;
  sourceRecordId?: string | null;
  retrievedAt: IsoDateTimeString;
  attributionText?: string | null;
}

export const ELECTION_VERIFICATION_STATUSES = [
  "unverified",
  "pending_review",
  "verified",
  "rejected",
  "needs_update",
] as const;

export type ElectionVerificationStatus =
  (typeof ELECTION_VERIFICATION_STATUSES)[number];

export interface ElectionVerificationMetadata {
  verificationStatus: ElectionVerificationStatus;
  verifiedAt: IsoDateTimeString | null;
  verifiedBy: string | null;
  verificationNotes: string | null;
}

export const ELECTION_PUBLICATION_STATUSES = [
  "draft",
  "in_review",
  "scheduled",
  "published",
  "unpublished",
  "archived",
] as const;

export type ElectionPublicationStatus =
  (typeof ELECTION_PUBLICATION_STATUSES)[number];

export interface ElectionPublicationMetadata
  extends ElectionPublicationTimestamps {
  publicationStatus: ElectionPublicationStatus;
  scheduledFor: IsoDateTimeString | null;
  publishedBy: string | null;
}

export const ELECTION_FRESHNESS_STATUSES = [
  "fresh",
  "aging",
  "stale",
  "expired",
  "unknown",
] as const;

export type ElectionFreshnessStatus =
  (typeof ELECTION_FRESHNESS_STATUSES)[number];

export interface ElectionFreshnessMetadata {
  dataAsOf: IsoDateTimeString | null;
  lastCheckedAt: IsoDateTimeString | null;
  staleAfter: IsoDateTimeString | null;
  expiresAt: IsoDateTimeString | null;
  freshnessStatus: ElectionFreshnessStatus;
}

export interface ElectionDataMetadata
  extends ElectionTimestamps,
    ElectionVerificationMetadata,
    ElectionPublicationMetadata,
    ElectionFreshnessMetadata {
  source: ElectionSourceAttribution;
}

export function isPublishedElectionRecord(
  metadata: Pick<ElectionPublicationMetadata, "publicationStatus">,
): boolean {
  return metadata.publicationStatus === "published";
}

export function isVerifiedElectionRecord(
  metadata: Pick<ElectionVerificationMetadata, "verificationStatus">,
): boolean {
  return metadata.verificationStatus === "verified";
}

export function isStaleElectionRecord(
  metadata: Pick<ElectionFreshnessMetadata, "freshnessStatus">,
): boolean {
  return metadata.freshnessStatus === "stale" || metadata.freshnessStatus === "expired";
}

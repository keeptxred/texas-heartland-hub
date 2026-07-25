import type { ExploreEntity } from './index';

export const EXPLORE_DUPLICATE_STATUSES = [
  'pending',
  'merged',
  'not_duplicate',
  'deferred',
] as const;

export type ExploreDuplicateStatus = (typeof EXPLORE_DUPLICATE_STATUSES)[number];

export interface ExploreDuplicateEntitySummary {
  id: string;
  name: string;
  slug: string;
  status: ExploreEntity['status'];
  visibility: ExploreEntity['visibility'];
  entityTypeId: string;
  entityTypeKey: string | null;
  entityTypeName: string | null;
  summary: string | null;
  shortDescription: string | null;
  verifiedAt: string | null;
  archivedAt: string | null;
  updatedAt: string;
  createdAt: string;
  sourceConfidence: number;
  popularityScore: number;
  location: {
    city: string | null;
    county: string | null;
    stateCode: string | null;
    addressLine1: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
  counts: {
    media: number;
    categories: number;
    tags: number;
    amenities: number;
    activities: number;
    relationships: number;
    observations: number;
    reviews: number;
    sources: number;
  };
  hasProfile: boolean;
}

export interface ExploreDuplicateCandidate {
  id: string;
  entityAId: string;
  entityBId: string;
  similarityScore: number;
  matchingFields: string[];
  /** JSON-serialized evidence blob; parse on the client if needed. */
  evidenceJson: string;
  status: ExploreDuplicateStatus;
  resolutionNotes: string | null;
  resolvedByUserId: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExploreDuplicateCandidateWithEntities extends ExploreDuplicateCandidate {
  entityA: ExploreDuplicateEntitySummary | null;
  entityB: ExploreDuplicateEntitySummary | null;
}

export interface ExploreMergeRequestInput {
  candidateId: string;
  survivorId: string;
  reason?: string | null;
}

export interface ExploreMergeStats {
  slugHistoryMoved: number;
  relationshipsPruned: number;
}

export interface ExploreMergeResult {
  candidateId: string;
  survivorId: string;
  loserId: string;
  archivedSlug: string | null;
  mergedAt: string;
  stats: ExploreMergeStats;
  warnings: string[];
}

export type ExploreMergeErrorCode =
  | 'unauthenticated'
  | 'unauthorized'
  | 'validation'
  | 'not_found'
  | 'already_resolved'
  | 'archived_entity'
  | 'invalid_survivor'
  | 'conflict'
  | 'server_error';

export interface ExploreMergeErrorShape {
  code: ExploreMergeErrorCode;
  message: string;
}

export interface ExploreDuplicateComparison {
  candidate: ExploreDuplicateCandidateWithEntities;
  fieldDiffs: Array<{
    field: string;
    label: string;
    a: string | number | null;
    b: string | number | null;
    equal: boolean;
  }>;
}

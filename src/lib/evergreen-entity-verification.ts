/** Source-backed evergreen entity verification, independent of election pipelines. */
export type VerificationStatus = 'pending' | 'verified' | 'change-detected' | 'source-unavailable' | 'needs-review';
export type VerificationCadence = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'event-driven';
export interface OfficialEvidence {
  url: string;
  checkedAt: string;
  status: 'available' | 'unavailable' | 'changed';
  evidenceExcerpt?: string;
  contentHash?: string;
}
export interface EntityVerificationRecord {
  entityId: string;
  route: string;
  cadence: VerificationCadence;
  status: VerificationStatus;
  lastCheckedAt?: string;
  lastVerifiedAt?: string;
  lastContentChangedAt?: string;
  nextCheckAt?: string;
  officialSources: string[];
  evidence: OfficialEvidence[];
  pendingChanges: Array<{ field: string; previous?: string; proposed: string; sourceUrl: string; explanation: string }>;
  reviewerApprovedAt?: string;
}
const cadenceDays: Partial<Record<VerificationCadence, number>> = { daily: 1, weekly: 7, monthly: 30, quarterly: 90 };
export function nextVerificationDate(cadence: VerificationCadence, checkedAt: string): string | undefined {
  const days = cadenceDays[cadence];
  if (!days) return undefined;
  const time = Date.parse(checkedAt);
  if (!Number.isFinite(time)) throw new Error('Invalid verification timestamp');
  return new Date(time + days * 86400000).toISOString();
}
export function verificationDue(record: EntityVerificationRecord, now = new Date().toISOString()): boolean {
  if (record.cadence === 'event-driven') return false;
  return !record.nextCheckAt || Date.parse(record.nextCheckAt) <= Date.parse(now);
}
export function recordSourceCheck(record: EntityVerificationRecord, evidence: OfficialEvidence[]): EntityVerificationRecord {
  if (!evidence.length) throw new Error('Source checks must include evidence');
  const checkedAt = evidence.map(item => item.checkedAt).sort().at(-1)!;
  const hasFailure = evidence.some(item => item.status === 'unavailable');
  const hasChange = evidence.some(item => item.status === 'changed');
  const status: VerificationStatus = hasFailure ? 'source-unavailable' : hasChange ? 'needs-review' : 'verified';
  return {
    ...record, evidence, status, lastCheckedAt: checkedAt,
    lastVerifiedAt: status === 'verified' ? checkedAt : record.lastVerifiedAt,
    nextCheckAt: nextVerificationDate(record.cadence, checkedAt),
  };
}
/** Never auto-publish a detected change, especially legal, tax or government facts. */
export function publishable(record: EntityVerificationRecord): boolean {
  return record.status === 'verified' && record.pendingChanges.length === 0;
}

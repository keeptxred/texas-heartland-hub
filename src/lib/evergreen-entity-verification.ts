/** Source-backed evergreen entity verification, independent of election pipelines. */
export type VerificationStatus = 'pending' | 'retrieved-not-verified' | 'verified' | 'change-detected' | 'source-unavailable' | 'needs-review';
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
  if (evidence.some(item => !Number.isFinite(Date.parse(item.checkedAt)))) throw new Error('Invalid evidence timestamp');
  if (new Set(evidence.map(item => item.url)).size !== evidence.length) throw new Error('Duplicate evidence sources');
  if (evidence.some(item => !record.officialSources.includes(item.url))) throw new Error('Evidence from unregistered source');
  const checkedAt = evidence.map(item => item.checkedAt).sort().at(-1)!;
  const hasFailure = record.officialSources.some(url => !evidence.some(item => item.url === url)) || evidence.some(item => item.status === 'unavailable');
  const hasChange = evidence.some(item => item.status === 'changed');
  const status: VerificationStatus = hasFailure ? 'source-unavailable' : hasChange ? 'needs-review' : 'retrieved-not-verified';
  return {
    ...record, evidence, status, lastCheckedAt: checkedAt,
    lastVerifiedAt: record.lastVerifiedAt,
    nextCheckAt: nextVerificationDate(record.cadence, checkedAt),
  };
}
/** Never auto-publish a detected change, especially legal, tax or government facts. */
export function publishable(record: EntityVerificationRecord, now = new Date().toISOString()): boolean {
  const currentTime = Date.parse(now);
  if (!Number.isFinite(currentTime) || !record.lastVerifiedAt || !record.nextCheckAt || !Number.isFinite(Date.parse(record.nextCheckAt)) || Date.parse(record.nextCheckAt) <= currentTime) return false;
  if (!record.reviewerApprovedAt || !Number.isFinite(Date.parse(record.reviewerApprovedAt)) || Date.parse(record.reviewerApprovedAt) > currentTime || Date.parse(record.lastVerifiedAt) > currentTime) return false;
  if (record.evidence.some(item => !Number.isFinite(Date.parse(item.checkedAt)) || Date.parse(item.checkedAt) > currentTime || Date.parse(item.checkedAt) > Date.parse(record.reviewerApprovedAt!))) return false;
  return record.status === 'verified' && Boolean(record.reviewerApprovedAt) && record.pendingChanges.length === 0 && record.officialSources.length > 0 && record.officialSources.every(url => record.evidence.some(item => item.url === url && item.status === 'available'));
}

/** Human factual review is required: HTTP success and hash equality are not proof. */
export function approveFactualVerification(record: EntityVerificationRecord, approvedAt: string): EntityVerificationRecord {
  if (record.status !== 'retrieved-not-verified' || record.pendingChanges.length || !record.officialSources.length || record.officialSources.some(url => !record.evidence.some(item => item.url === url && item.status === 'available')) || record.evidence.some(item => item.status !== 'available')) {
    throw new Error('Cannot approve missing, changed or unavailable source evidence');
  }
  const approvalTime = Date.parse(approvedAt);
  if (!Number.isFinite(approvalTime) || !record.nextCheckAt || !Number.isFinite(Date.parse(record.nextCheckAt)) || approvalTime >= Date.parse(record.nextCheckAt) || record.evidence.some(item => !Number.isFinite(Date.parse(item.checkedAt)) || Date.parse(item.checkedAt) > approvalTime)) throw new Error('Invalid or stale approval or evidence timestamp');
  return {...record, status:'verified', lastVerifiedAt:approvedAt, reviewerApprovedAt:approvedAt};
}

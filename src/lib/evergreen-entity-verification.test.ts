import { describe, expect, it } from 'vitest';
import { nextVerificationDate, recordSourceCheck, verificationDue, publishable, approveFactualVerification, type EntityVerificationRecord } from './evergreen-entity-verification';

const base: EntityVerificationRecord = {
  entityId: 'resource:texas-laws', route: '/laws/topics', cadence: 'weekly',
  status: 'pending', officialSources: ['https://statutes.capitol.texas.gov/'],
  evidence: [], pendingChanges: [],
};
const at = '2026-10-10T12:00:00.000Z';
describe('evergreen entity verification', () => {
  it('schedules weekly checks and skips event-driven polling', () => {
    expect(nextVerificationDate('weekly', at)).toBe('2026-10-17T12:00:00.000Z');
    expect(nextVerificationDate('event-driven', at)).toBeUndefined();
    expect(verificationDue(base, at)).toBe(true);
    expect(verificationDue({ ...base, nextCheckAt: '2026-10-17T12:00:00.000Z' }, at)).toBe(false);
  });
  it('records successful source checks without changing published content', () => {
    const result = recordSourceCheck(base, [{url:base.officialSources[0], checkedAt:at,status:'available'}]);
    expect(result.status).toBe('retrieved-not-verified');
    expect(result.lastVerifiedAt).toBeUndefined();
    expect(publishable(result)).toBe(false);
    const approved = approveFactualVerification(result, at);
    expect(publishable(approved, '2026-10-11T12:00:00.000Z')).toBe(true);
    expect(publishable(approved, '2026-10-17T12:00:00.000Z')).toBe(false);
    expect(() => approveFactualVerification(result, '2026-10-18T12:00:00.000Z')).toThrow();
  });
  it('blocks source failures and changes pending editorial review', () => {
    const unavailable = recordSourceCheck(base, [{url:base.officialSources[0],checkedAt:at,status:'unavailable'}]);
    expect(unavailable.status).toBe('source-unavailable');
    expect(unavailable.lastVerifiedAt).toBeUndefined();
    const changed = recordSourceCheck(base, [{url:base.officialSources[0],checkedAt:at,status:'changed'}]);
    expect(changed.status).toBe('needs-review');
    expect(publishable(changed)).toBe(false);
  });
  it('rejects approval when a required official source was never checked', () => {
    const twoSources = {...base, officialSources: ['https://statutes.capitol.texas.gov/', 'https://comptroller.texas.gov/']};
    const result = recordSourceCheck(twoSources, [{url:twoSources.officialSources[0],checkedAt:at,status:'available' as const}]);
    expect(result.status).toBe('source-unavailable');
    expect(() => approveFactualVerification(result, at)).toThrow();
  });
  it('rejects approval without any registered official sources', () => {
    const result = {...base, officialSources: [], status:'retrieved-not-verified' as const, evidence:[{url:base.officialSources[0],checkedAt:at,status:'available' as const}]};
    expect(() => approveFactualVerification(result, at)).toThrow();
  });
  it('rejects malformed evidence timestamps and approval predating a check', () => {
    expect(() => recordSourceCheck(base, [{url:base.officialSources[0],checkedAt:'not-a-date',status:'available'}])).toThrow();
    const checked = recordSourceCheck(base, [{url:base.officialSources[0],checkedAt:at,status:'available'}]);
    expect(() => approveFactualVerification(checked, '2026-10-09T12:00:00.000Z')).toThrow();
  });
  it('never publishes a forged verified record with missing official evidence', () => {
    expect(publishable({...base,status:'verified',reviewerApprovedAt:at})).toBe(false);
  });
  it('rejects duplicate evidence and evidence from unregistered official sources', () => {
    const evidence = {url:base.officialSources[0],checkedAt:at,status:'available' as const};
    expect(() => recordSourceCheck(base,[evidence,evidence])).toThrow();
    expect(() => recordSourceCheck(base,[{...evidence,url:'https://unregistered.gov/'}])).toThrow();
  });
  it('does not accept an empty evidence list', () => {
    expect(() => recordSourceCheck(base, [])).toThrow();
  });
});

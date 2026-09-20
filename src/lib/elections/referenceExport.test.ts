import { describe, expect, it } from 'vitest';
import { buildElectionReferenceExport } from './referenceExport';

const verifiedRace = {
  id: 'race-1', slug: '2026-example-race', name: '2026 Example Race', officeName: 'Example Office',
  officeLevel: 'statewide', electionType: 'general', jurisdictionType: 'statewide', districtName: null,
  districtNumber: null, electionDate: '2026-11-03', status: 'active', candidateIds: ['candidate-1'],
  publicationStatus: 'published', verificationStatus: 'verified', verifiedAt: '2026-08-10T12:00:00Z',
  updatedAt: '2026-08-11T12:00:00Z', dataAsOf: '2026-08-11T10:00:00Z',
  source: { sourceName: 'Official source', sourceType: 'official', sourceUrl: 'https://example.gov/race', retrievedAt: '2026-08-11T09:00:00Z' },
  internalNotes: 'must not export', forecast: { rating: 'secret-test-value' },
};

const verifiedCandidate = {
  id: 'candidate-1', slug: 'example-candidate', fullName: 'Example Candidate', ballotName: 'Example Candidate',
  party: 'republican', partyLabel: 'Republican', status: 'active', filingStatus: 'filed', incumbencyType: 'challenger',
  raceIds: ['race-1'], primaryRaceId: 'race-1', publicationStatus: 'published', verificationStatus: 'verified',
  verifiedAt: '2026-08-10T12:00:00Z', updatedAt: '2026-08-11T13:00:00Z', dataAsOf: '2026-08-11T11:00:00Z',
  source: { sourceName: 'Official candidate source', sourceType: 'official', sourceUrl: 'https://example.gov/candidate', retrievedAt: '2026-08-11T09:30:00Z' },
  email: 'private@example.com', phone: '555-0100', dateOfBirth: '1970-01-01', donationUrl: 'https://donate.example',
  biography: 'Not part of the compact relationship export.', campaignWebsite: 'https://campaign.example', internalNotes: 'do not export',
};

describe('Election Central public reference export', () => {
  it('exports only published and verified race/candidate records', () => {
    const payload = buildElectionReferenceExport(
      [verifiedRace, { ...verifiedRace, id: 'race-draft', slug: 'draft-race', publicationStatus: 'draft' }],
      [verifiedCandidate, { ...verifiedCandidate, id: 'candidate-unverified', slug: 'unverified', verificationStatus: 'pending' }],
    );

    expect(payload.races.map((race) => race.id)).toEqual(['race-1']);
    expect(payload.candidates.map((candidate) => candidate.id)).toEqual(['candidate-1']);
    expect(payload.generatedFrom).toBe('published_verified_records');
  });

  it('keeps canonical relationships, provenance and record dates', () => {
    const payload = buildElectionReferenceExport([verifiedRace], [verifiedCandidate]);
    expect(payload.races[0]).toMatchObject({
      canonicalUrl: 'https://keeptxred.com/elections/races/2026-example-race',
      candidateIds: ['candidate-1'],
      verifiedAt: '2026-08-10T12:00:00Z',
    });
    expect(payload.candidates[0]).toMatchObject({
      canonicalUrl: 'https://keeptxred.com/elections/candidates/example-candidate',
      raceIds: ['race-1'],
      primaryRaceId: 'race-1',
    });
    expect(payload.asOf).toBe('2026-08-11T13:00:00Z');
  });

  it('does not leak contact, birth, donation, biography, campaign or internal/admin fields', () => {
    const serialized = JSON.stringify(buildElectionReferenceExport([verifiedRace], [verifiedCandidate]));
    for (const forbidden of [
      'private@example.com', '555-0100', '1970-01-01', 'donate.example', 'campaign.example',
      'internalNotes', 'secret-test-value', 'Not part of the compact relationship export.',
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});

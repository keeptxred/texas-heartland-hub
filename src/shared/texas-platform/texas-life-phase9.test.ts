import { describe, expect, it } from 'vitest';
import {
  auditTexasLifeResource,
  staleTexasLifeResources,
  texasLifeResourceReadiness,
  type TexasLifeResourceRecord,
} from './texas-life-governance';
import {
  TEXAS_LIFE_JOURNEYS,
  TEXAS_LIFE_TASK_BUNDLES,
  journeyProgress,
  nextTexasLifeSteps,
  texasLifeJourney,
} from './texas-life-journeys';
import { validateOfficialAgency, validatePlaceProfile } from './texas-life-directory';

const completeResource: TexasLifeResourceRecord = {
  id: 'guide:homestead-exemption',
  title: 'Texas Homestead Exemption',
  kind: 'guide',
  href: '/homestead-exemption',
  pillar: 'do',
  summary: 'A plain-English guide to the Texas homestead exemption.',
  trust: {
    explanation: 'TexasDefined explains eligibility and the application process.',
    authority: 'The county appraisal district approves or denies the application.',
    authorityName: 'County appraisal district',
    authorityUrl: 'https://comptroller.texas.gov',
  },
  goldenRule: {
    what: 'A property tax exemption for a qualifying primary residence.',
    why: 'It can reduce taxable value and add appraisal protections.',
    next: 'Find your appraisal district and review the application.',
    verify: 'Verify requirements with the county appraisal district.',
    else: 'Deadlines, ownership, and occupancy rules can affect eligibility.',
  },
  journeyIds: ['buying-a-home'],
  officialSourceUrl: 'https://comptroller.texas.gov',
  nextStepIds: ['property-taxes', 'county-guide'],
  health: {
    lastReviewedAt: '2026-08-01T00:00:00Z',
    officialSourceCheckedAt: '2026-08-01T00:00:00Z',
    brokenLinkCount: 0,
    missingFields: [],
    pendingUpdates: [],
    reviewStatus: 'verified',
  },
};

describe('Texas Life Phase 9 governance', () => {
  it('marks a complete resource publishable', () => {
    expect(auditTexasLifeResource(completeResource)).toEqual([]);
    expect(texasLifeResourceReadiness(completeResource)).toMatchObject({ publishable: true, score: 100 });
  });

  it('blocks resources that fail the Golden Rule, trust, journey, and official-source standards', () => {
    const incomplete: TexasLifeResourceRecord = {
      ...completeResource,
      officialSourceUrl: '/not-official',
      journeyIds: [],
      nextStepIds: [],
      trust: { explanation: '', authority: '' },
      goldenRule: { what: 'Something' },
    };
    const readiness = texasLifeResourceReadiness(incomplete);
    expect(readiness.publishable).toBe(false);
    expect(readiness.errors.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'invalid-official-source',
      'missing-journey',
      'missing-next-step',
      'incomplete-trust-framework',
      'missing-golden-why',
      'missing-golden-next',
      'missing-golden-verify',
      'missing-golden-else',
    ]));
  });

  it('finds stale and never-reviewed resources', () => {
    const stale = staleTexasLifeResources([
      completeResource,
      { ...completeResource, id: 'old', health: { ...completeResource.health, lastReviewedAt: '2025-01-01T00:00:00Z' } },
      { ...completeResource, id: 'missing', health: { ...completeResource.health, lastReviewedAt: undefined } },
    ], new Date('2026-08-03T00:00:00Z'), 180);
    expect(stale.map((resource) => resource.id)).toEqual(['old', 'missing']);
  });
});

describe('Texas Life journeys and task bundles', () => {
  it('includes the four major journeys', () => {
    expect(TEXAS_LIFE_JOURNEYS.map((journey) => journey.id)).toEqual([
      'buying-a-home',
      'moving-to-texas',
      'starting-a-business',
      'outdoor-texas',
    ]);
  });

  it('connects each step to a logical next action', () => {
    expect(nextTexasLifeSteps('buying-a-home', 'mortgage').map((step) => step.id)).toEqual(['closing-costs']);
    expect(nextTexasLifeSteps('moving-to-texas', 'driver-license').map((step) => step.id)).toEqual(['vehicle-registration']);
  });

  it('calculates journey progress without mutating configuration', () => {
    const before = texasLifeJourney('buying-a-home')!.steps.map((step) => step.id);
    const progress = journeyProgress('buying-a-home', ['affordability', 'mortgage'], 'mortgage');
    expect(progress).toMatchObject({ completed: 2, total: 13, percent: 15 });
    expect(progress?.next.map((step) => step.id)).toEqual(['closing-costs']);
    expect(texasLifeJourney('buying-a-home')!.steps.map((step) => step.id)).toEqual(before);
  });

  it('defines complete bundles for home, moving, business, and outdoor tasks', () => {
    expect(TEXAS_LIFE_TASK_BUNDLES).toHaveLength(4);
    for (const bundle of TEXAS_LIFE_TASK_BUNDLES) {
      const journey = texasLifeJourney(bundle.journeyId);
      expect(journey).toBeDefined();
      expect(bundle.stepIds.every((id) => journey!.steps.some((step) => step.id === id))).toBe(true);
    }
  });
});

describe('Texas Life official directories', () => {
  it('requires HTTPS official agency services', () => {
    expect(validateOfficialAgency({
      id: 'tpwd',
      name: 'Texas Parks and Wildlife Department',
      summary: 'Manages parks, wildlife, and licensing programs.',
      officialUrl: 'https://tpwd.texas.gov',
      responsibilities: ['State parks', 'Wildlife', 'Licensing'],
      services: [{ title: 'Reserve a campsite', href: 'https://texasstateparks.reserveamerica.com' }],
      relatedGuideIds: [],
      relatedLawIds: [],
    }).valid).toBe(true);
  });

  it('validates city and county official profile links', () => {
    expect(validatePlaceProfile({
      id: 'county:fort-bend',
      name: 'Fort Bend County',
      type: 'county',
      summary: 'Official and practical county information.',
      officialUrl: 'https://www.fortbendcountytx.gov',
      countyIds: [],
      cityIds: ['city:katy', 'city:sugar-land'],
      schoolDistrictIds: [],
      representativeIds: [],
      agencyIds: [],
      utilityIds: [],
      parkIds: [],
      hospitalIds: [],
      libraryIds: [],
      electionUrl: 'https://www.fortbendcountytx.gov/government/departments/elections-voter-registration',
      propertyTaxUrl: 'https://www.fbcad.org',
    }).valid).toBe(true);
  });
});

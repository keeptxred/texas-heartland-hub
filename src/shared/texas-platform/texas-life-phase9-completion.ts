import { TEXAS_LIFE_PILLARS, TEXAS_LIFE_PAGE_STANDARDS, TEXAS_LIFE_EDITORIAL_PRINCIPLES } from './texas-life-platform';
import { TEXAS_LIFE_PILLAR_HUBS, validateTexasLifePillarHubs } from './texas-life-pillar-hubs';
import { TEXAS_OFFICIAL_AGENCIES, validateTexasOfficialAgencies } from './texas-life-agencies';
import { TEXAS_LIFE_STARTER_BLUEPRINTS } from './texas-life-starter-blueprints';
import { validateTexasLifeBlueprint } from './texas-life-page-blueprint';
import { TEXAS_LIFE_JOURNEYS, validateTexasLifeJourney } from './texas-life-journeys';

export type Phase9CompletionArea = {
  id: string;
  title: string;
  complete: boolean;
  issues: string[];
};

export type Phase9CompletionReport = {
  complete: boolean;
  completedAreas: number;
  totalAreas: number;
  completionRate: number;
  areas: Phase9CompletionArea[];
};

export function buildPhase9CompletionReport(): Phase9CompletionReport {
  const pillarHubValidation = validateTexasLifePillarHubs(TEXAS_LIFE_PILLAR_HUBS);
  const agencyValidation = validateTexasOfficialAgencies(TEXAS_OFFICIAL_AGENCIES);
  const blueprintIssues = TEXAS_LIFE_STARTER_BLUEPRINTS.flatMap((blueprint) => {
    const result = validateTexasLifeBlueprint(blueprint);
    return result.complete ? [] : [`${blueprint.id}: ${[...result.missing, ...result.errors].join(' ')}`];
  });
  const journeyIssues = TEXAS_LIFE_JOURNEYS.flatMap((journey) => {
    const result = validateTexasLifeJourney(journey);
    return result.valid ? [] : result.errors.map((error) => `${journey.id}: ${error}`);
  });

  const areas: Phase9CompletionArea[] = [
    {
      id: 'vision-and-pillars',
      title: 'Vision and five-pillar model',
      complete: TEXAS_LIFE_PILLARS.length === 5,
      issues: TEXAS_LIFE_PILLARS.length === 5 ? [] : ['Exactly five Texas Life pillars are required.'],
    },
    {
      id: 'golden-rule',
      title: 'Five-question Golden Rule',
      complete: TEXAS_LIFE_PAGE_STANDARDS.length === 5,
      issues: TEXAS_LIFE_PAGE_STANDARDS.length === 5 ? [] : ['Exactly five page standards are required.'],
    },
    {
      id: 'editorial-principles',
      title: 'Editorial principles',
      complete: TEXAS_LIFE_EDITORIAL_PRINCIPLES.length >= 6,
      issues: TEXAS_LIFE_EDITORIAL_PRINCIPLES.length >= 6 ? [] : ['Editorial principles are incomplete.'],
    },
    {
      id: 'pillar-hubs',
      title: 'Public pillar hubs',
      complete: pillarHubValidation.valid,
      issues: pillarHubValidation.errors,
    },
    {
      id: 'official-agencies',
      title: 'Official agency directory',
      complete: agencyValidation.valid,
      issues: agencyValidation.errors,
    },
    {
      id: 'starter-guides',
      title: 'Golden Rule guide blueprints',
      complete: TEXAS_LIFE_STARTER_BLUEPRINTS.length >= 3 && blueprintIssues.length === 0,
      issues: TEXAS_LIFE_STARTER_BLUEPRINTS.length >= 3 ? blueprintIssues : ['At least three starter guide blueprints are required.'],
    },
    {
      id: 'decision-journeys',
      title: 'Texas Decision Graph journeys',
      complete: TEXAS_LIFE_JOURNEYS.length >= 4 && journeyIssues.length === 0,
      issues: TEXAS_LIFE_JOURNEYS.length >= 4 ? journeyIssues : ['At least four guided journeys are required.'],
    },
    {
      id: 'shared-platform',
      title: 'Shared Texas platform architecture',
      complete: true,
      issues: [],
    },
  ];

  const completedAreas = areas.filter((area) => area.complete).length;
  return {
    complete: completedAreas === areas.length,
    completedAreas,
    totalAreas: areas.length,
    completionRate: areas.length ? completedAreas / areas.length : 0,
    areas,
  };
}

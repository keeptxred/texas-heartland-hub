import { TEXAS_LIFE_PILLARS, TEXAS_LIFE_PAGE_STANDARDS, TEXAS_LIFE_EDITORIAL_PRINCIPLES } from './texas-life-platform';
import { TEXAS_LIFE_PILLAR_HUBS, validateTexasLifePillarHubs } from './texas-life-pillar-hubs';
import { TEXAS_LIFE_AGENCIES, validateTexasLifeAgency } from './texas-life-agencies';
import { TEXAS_LIFE_STARTER_BLUEPRINTS } from './texas-life-starter-blueprints';
import { validateTexasLifeBlueprint } from './texas-life-page-blueprint';
import { TEXAS_LIFE_JOURNEYS, type TexasLifeJourney } from './texas-life-journeys';

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

function validateJourney(journey: TexasLifeJourney) {
  const errors: string[] = [];
  const ids = new Set(journey.steps.map((step) => step.id));
  if (!journey.id.trim() || !journey.title.trim() || !journey.description.trim()) errors.push('Journey identity is incomplete.');
  if (!journey.steps.length) errors.push('Journey requires at least one step.');
  if (ids.size !== journey.steps.length) errors.push('Journey step IDs must be unique.');
  for (const step of journey.steps) {
    if (!step.title.trim() || !step.description.trim()) errors.push(`Incomplete step: ${step.id}`);
    if (!step.href.startsWith('/')) errors.push(`Step URL must be internal: ${step.href}`);
    for (const nextId of step.next) {
      if (!ids.has(nextId)) errors.push(`Unknown next step ${nextId} from ${step.id}.`);
    }
  }
  return errors;
}

export function buildPhase9CompletionReport(): Phase9CompletionReport {
  const pillarHubValidation = validateTexasLifePillarHubs(TEXAS_LIFE_PILLAR_HUBS);
  const agencyIssues = TEXAS_LIFE_AGENCIES.flatMap((agency) => {
    const result = validateTexasLifeAgency(agency);
    return result.valid ? [] : result.errors.map((error) => `${agency.id}: ${error}`);
  });
  const blueprintIssues = TEXAS_LIFE_STARTER_BLUEPRINTS.flatMap((blueprint) => {
    const result = validateTexasLifeBlueprint(blueprint);
    return result.complete ? [] : [`${blueprint.id}: ${[...result.missing, ...result.errors].join(' ')}`];
  });
  const journeyIssues = TEXAS_LIFE_JOURNEYS.flatMap((journey) =>
    validateJourney(journey).map((error) => `${journey.id}: ${error}`),
  );

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
      complete: TEXAS_LIFE_AGENCIES.length >= 7 && agencyIssues.length === 0,
      issues: TEXAS_LIFE_AGENCIES.length >= 7 ? agencyIssues : ['At least seven official agencies are required.'],
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

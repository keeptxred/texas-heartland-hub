import type { TexasLifePillarId } from './texas-life-platform';

export type TexasLifeJourneyStep = {
  id: string;
  title: string;
  href: string;
  description: string;
  estimatedMinutes?: number;
  difficulty?: 'easy' | 'moderate' | 'advanced';
  officialAction?: boolean;
  next: string[];
};

export type TexasLifeJourney = {
  id: string;
  title: string;
  description: string;
  pillar: TexasLifePillarId;
  steps: TexasLifeJourneyStep[];
};

export type TexasLifeTaskBundle = {
  id: string;
  title: string;
  description: string;
  journeyId: string;
  stepIds: string[];
};

export const TEXAS_LIFE_JOURNEYS: TexasLifeJourney[] = [
  {
    id: 'buying-a-home',
    title: 'Buying a Home in Texas',
    description: 'Move from affordability through closing, taxes, services, schools, and community connections.',
    pillar: 'decide',
    steps: [
      { id: 'affordability', title: 'Home Affordability', href: '/texas-home-affordability-calculator', description: 'Estimate a realistic purchase range.', estimatedMinutes: 5, difficulty: 'easy', next: ['mortgage'] },
      { id: 'mortgage', title: 'Mortgage', href: '/texas-mortgage-calculator', description: 'Estimate monthly payment and borrowing cost.', estimatedMinutes: 5, difficulty: 'easy', next: ['closing-costs'] },
      { id: 'closing-costs', title: 'Closing Costs', href: '/texas-closing-cost-calculator', description: 'Estimate upfront transaction expenses.', estimatedMinutes: 5, difficulty: 'easy', next: ['property-taxes'] },
      { id: 'property-taxes', title: 'Property Taxes', href: '/tax-calculator', description: 'Estimate annual local property taxes.', estimatedMinutes: 5, difficulty: 'easy', next: ['homestead-exemption'] },
      { id: 'homestead-exemption', title: 'Homestead Exemption', href: '/texas-property-tax-protest-guide', description: 'Understand eligibility and the application process.', estimatedMinutes: 10, difficulty: 'moderate', officialAction: true, next: ['insurance'] },
      { id: 'insurance', title: 'Home Insurance', href: '/texas-resources?q=home+insurance', description: 'Review common coverage needs and risks.', estimatedMinutes: 10, difficulty: 'moderate', next: ['utilities'] },
      { id: 'utilities', title: 'Utilities', href: '/texas-resources?q=utilities', description: 'Plan electricity, water, gas, and waste service.', estimatedMinutes: 10, difficulty: 'easy', officialAction: true, next: ['schools'] },
      { id: 'schools', title: 'School Districts', href: '/texas-resources/type/school-district', description: 'Understand local district boundaries and resources.', estimatedMinutes: 10, difficulty: 'moderate', next: ['moving-checklist'] },
      { id: 'moving-checklist', title: 'Moving Checklist', href: '/moving-to-texas', description: 'Organize the practical steps before move-in.', estimatedMinutes: 15, difficulty: 'easy', next: ['internet'] },
      { id: 'internet', title: 'Internet Providers', href: '/texas-resources?q=internet+providers', description: 'Compare availability and setup needs.', estimatedMinutes: 10, difficulty: 'easy', next: ['county-guide'] },
      { id: 'county-guide', title: 'County Guide', href: '/texas-resources/type/county', description: 'Find county offices, taxes, services, and contacts.', estimatedMinutes: 10, difficulty: 'easy', next: ['representative'] },
      { id: 'representative', title: 'Representative', href: '/representatives', description: 'Find the officials who represent the new address.', estimatedMinutes: 3, difficulty: 'easy', next: ['community-events'] },
      { id: 'community-events', title: 'Community Events', href: '/texas-resources?q=community+events', description: 'Connect with local events and organizations.', estimatedMinutes: 5, difficulty: 'easy', next: [] },
    ],
  },
  {
    id: 'moving-to-texas',
    title: 'Moving to Texas',
    description: 'Compare places, establish residency, and connect essential services.',
    pillar: 'do',
    steps: [
      { id: 'cost-of-living', title: 'Cost of Living', href: '/texas-cost-of-living-calculator', description: 'Compare household costs.', estimatedMinutes: 5, difficulty: 'easy', next: ['choose-city'] },
      { id: 'choose-city', title: 'Choose a City', href: '/texas-resources/type/city', description: 'Review cities that fit your priorities.', estimatedMinutes: 15, difficulty: 'moderate', next: ['schools'] },
      { id: 'schools', title: 'School Districts', href: '/texas-resources/type/school-district', description: 'Check local education options.', estimatedMinutes: 10, difficulty: 'moderate', next: ['driver-license'] },
      { id: 'driver-license', title: 'Driver License', href: '/texas-resources?q=texas+driver+license', description: 'Follow the official new-resident process.', estimatedMinutes: 15, difficulty: 'moderate', officialAction: true, next: ['vehicle-registration'] },
      { id: 'vehicle-registration', title: 'Vehicle Registration', href: '/vehicles/new-residents', description: 'Register vehicles in Texas.', estimatedMinutes: 15, difficulty: 'moderate', officialAction: true, next: ['utilities'] },
      { id: 'utilities', title: 'Utilities', href: '/texas-resources?q=utilities', description: 'Start essential services.', estimatedMinutes: 10, difficulty: 'easy', officialAction: true, next: ['voter-registration'] },
      { id: 'voter-registration', title: 'Voter Registration', href: '/elections', description: 'Review voter registration requirements.', estimatedMinutes: 10, difficulty: 'easy', officialAction: true, next: ['county-services'] },
      { id: 'county-services', title: 'County Services', href: '/texas-resources/type/county', description: 'Find local offices and services.', estimatedMinutes: 5, difficulty: 'easy', next: [] },
    ],
  },
  {
    id: 'starting-a-business',
    title: 'Starting a Business in Texas',
    description: 'Move from business structure through taxes, permits, banking, and compliance.',
    pillar: 'do',
    steps: [
      { id: 'business-structure', title: 'Choose a Business Structure', href: '/texas-resources?q=business+structure', description: 'Compare common entity types.', estimatedMinutes: 10, difficulty: 'moderate', next: ['form-llc'] },
      { id: 'form-llc', title: 'Form an LLC', href: '/texas-resources?q=start+an+llc', description: 'Follow the Secretary of State filing process.', estimatedMinutes: 20, difficulty: 'moderate', officialAction: true, next: ['ein'] },
      { id: 'ein', title: 'Get an EIN', href: '/texas-resources?q=get+an+ein', description: 'Apply with the IRS when needed.', estimatedMinutes: 10, difficulty: 'easy', officialAction: true, next: ['sales-tax-permit'] },
      { id: 'sales-tax-permit', title: 'Sales Tax Permit', href: '/texas-sales-tax-explained', description: 'Determine whether registration is required.', estimatedMinutes: 15, difficulty: 'moderate', officialAction: true, next: ['business-banking'] },
      { id: 'business-banking', title: 'Business Banking', href: '/texas-resources?q=business+banking', description: 'Separate business and personal finances.', estimatedMinutes: 10, difficulty: 'easy', next: ['insurance'] },
      { id: 'insurance', title: 'Business Insurance', href: '/texas-resources?q=business+insurance', description: 'Review common coverage needs.', estimatedMinutes: 15, difficulty: 'moderate', next: ['local-permits'] },
      { id: 'local-permits', title: 'Local Permits', href: '/texas-resources/type/city', description: 'Check city and county requirements.', estimatedMinutes: 15, difficulty: 'moderate', officialAction: true, next: ['compliance'] },
      { id: 'compliance', title: 'Ongoing Compliance', href: '/texas-resources?q=texas+business+compliance', description: 'Track recurring state and local obligations.', estimatedMinutes: 15, difficulty: 'advanced', next: [] },
    ],
  },
  {
    id: 'outdoor-texas',
    title: 'Explore Outdoor Texas',
    description: 'Plan parks, camping, fishing, hunting, weather, and nearby stops.',
    pillar: 'discover',
    steps: [
      { id: 'choose-destination', title: 'Choose a Destination', href: '/explore/state-parks', description: 'Find a state park or outdoor destination.', estimatedMinutes: 10, difficulty: 'easy', next: ['reserve-campsite'] },
      { id: 'reserve-campsite', title: 'Reserve a Campsite', href: '/texas-resources?q=reserve+campsite', description: 'Use the official reservation system.', estimatedMinutes: 10, difficulty: 'easy', officialAction: true, next: ['licenses'] },
      { id: 'licenses', title: 'Hunting and Fishing Licenses', href: '/texas-resources?q=hunting+fishing+license', description: 'Review license requirements.', estimatedMinutes: 10, difficulty: 'moderate', officialAction: true, next: ['weather'] },
      { id: 'weather', title: 'Check Weather', href: '/texas-resources?q=weather', description: 'Review current conditions and alerts.', estimatedMinutes: 3, difficulty: 'easy', next: ['nearby-towns'] },
      { id: 'nearby-towns', title: 'Nearby Towns', href: '/texas-resources/type/city', description: 'Find food, lodging, and services nearby.', estimatedMinutes: 10, difficulty: 'easy', next: [] },
    ],
  },
];

export const TEXAS_LIFE_TASK_BUNDLES: TexasLifeTaskBundle[] = [
  { id: 'home-buyer-toolkit', title: 'Home Buyer Toolkit', description: 'Core tools and guides for a Texas home purchase.', journeyId: 'buying-a-home', stepIds: ['affordability', 'mortgage', 'closing-costs', 'property-taxes', 'homestead-exemption'] },
  { id: 'new-resident-checklist', title: 'New Resident Checklist', description: 'Essential actions after moving to Texas.', journeyId: 'moving-to-texas', stepIds: ['driver-license', 'vehicle-registration', 'utilities', 'voter-registration', 'county-services'] },
  { id: 'business-launch-kit', title: 'Business Launch Kit', description: 'Key formation, tax, and compliance steps.', journeyId: 'starting-a-business', stepIds: ['business-structure', 'form-llc', 'ein', 'sales-tax-permit', 'local-permits'] },
  { id: 'camping-trip-kit', title: 'Camping Trip Kit', description: 'Plan a Texas outdoor trip from destination through local services.', journeyId: 'outdoor-texas', stepIds: ['choose-destination', 'reserve-campsite', 'licenses', 'weather', 'nearby-towns'] },
];

export function texasLifeJourney(id: string) {
  return TEXAS_LIFE_JOURNEYS.find((journey) => journey.id === id);
}

export function texasLifeJourneyStep(journeyId: string, stepId: string) {
  return texasLifeJourney(journeyId)?.steps.find((step) => step.id === stepId);
}

export function nextTexasLifeSteps(journeyId: string, stepId: string) {
  const journey = texasLifeJourney(journeyId);
  const step = journey?.steps.find((candidate) => candidate.id === stepId);
  if (!journey || !step) return [];
  const byId = new Map(journey.steps.map((candidate) => [candidate.id, candidate]));
  return step.next.flatMap((id) => {
    const next = byId.get(id);
    return next ? [{ ...next, next: [...next.next] }] : [];
  });
}

export function journeyProgress(journeyId: string, completedStepIds: ReadonlyArray<string>, currentStepId?: string) {
  const journey = texasLifeJourney(journeyId);
  if (!journey) return undefined;
  const complete = new Set(completedStepIds);
  const total = journey.steps.length;
  const completed = journey.steps.filter((step) => complete.has(step.id)).length;
  return {
    journeyId,
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
    current: currentStepId ? journey.steps.find((step) => step.id === currentStepId) : undefined,
    next: currentStepId ? nextTexasLifeSteps(journeyId, currentStepId) : [],
  };
}

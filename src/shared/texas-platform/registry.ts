export type SharedSite = 'keeptxred' | 'texasdefined';

export type SharedResource = {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: 'home' | 'landmark' | 'truck' | 'calculator' | 'scale' | 'wallet' | 'map' | 'compass' | 'building' | 'search';
  topics: string[];
  journeys: string[];
  sites: SharedSite[];
  featured?: boolean;
  official?: boolean;
};

export type SharedTopic = {
  id: string;
  title: string;
  description: string;
  icon: SharedResource['icon'];
  cta: string;
  resourceIds: string[];
  sites: SharedSite[];
};

export type SharedJourney = {
  id: string;
  title: string;
  description: string;
  icon: SharedResource['icon'];
  resourceIds: string[];
  sites: SharedSite[];
};

const KTR: SharedSite[] = ['keeptxred'];
const TD: SharedSite[] = ['texasdefined'];

export const SHARED_RESOURCES: SharedResource[] = [
  { id: 'property-tax-calculator', title: 'Property Tax Calculator', description: 'Estimate Texas property taxes and understand the factors that affect a bill.', route: '/decide/property-taxes', icon: 'home', topics: ['home-property', 'money-taxes'], journeys: ['buying-home', 'saving-money'], sites: TD, featured: true },
  { id: 'find-representative', title: 'Find My Representative', description: 'Identify the elected officials who represent a Texas address and district.', route: '/find-representative', icon: 'landmark', topics: ['government-elections'], journeys: ['government-help'], sites: KTR, featured: true, official: true },
  { id: 'moving-guide', title: 'Moving to Texas Guide', description: 'Plan a move, compare costs and prepare for settling in Texas.', route: '/moving-to-texas', icon: 'truck', topics: ['moving-texas', 'cities-counties'], journeys: ['moving-texas'], sites: TD, featured: true },
  { id: 'financial-tools', title: 'Texas Financial Tools', description: 'Use Texas-focused calculators for housing, salary, budgeting and utilities.', route: '/decide/financial-tools', icon: 'calculator', topics: ['money-taxes', 'calculators-tools'], journeys: ['buying-home', 'saving-money', 'moving-texas'], sites: TD, featured: true },
  { id: 'texas-laws', title: 'Texas Laws', description: 'Understand important Texas laws and the government actions behind them.', route: '/laws', icon: 'scale', topics: ['texas-laws'], journeys: ['understand-laws'], sites: KTR, featured: true, official: true },
  { id: 'texas-bills', title: 'Texas Bills', description: 'Search Texas legislation, sponsors, status and official bill history.', route: '/bills', icon: 'landmark', topics: ['government-elections'], journeys: ['government-help'], sites: KTR, featured: true, official: true },
  { id: 'texas-elections', title: 'Texas Elections', description: 'Follow statewide, legislative and local election information.', route: '/elections', icon: 'landmark', topics: ['government-elections'], journeys: ['government-help'], sites: KTR, official: true },
  { id: 'cost-of-living', title: 'Cost of Living Calculator', description: 'Compare everyday costs across Texas communities.', route: '/texas-cost-of-living-calculator', icon: 'wallet', topics: ['money-taxes', 'moving-texas', 'cities-counties'], journeys: ['moving-texas', 'saving-money'], sites: TD, featured: true },
  { id: 'mortgage-calculator', title: 'Texas Mortgage Calculator', description: 'Estimate payments, taxes and ownership costs for a Texas home.', route: '/texas-mortgage-calculator', icon: 'home', topics: ['home-property', 'calculators-tools'], journeys: ['buying-home'], sites: TD, featured: true },
  { id: 'budget-planner', title: 'Texas Budget Planner', description: 'Build a practical household budget around Texas living costs.', route: '/texas-budget-planner', icon: 'wallet', topics: ['money-taxes', 'calculators-tools'], journeys: ['saving-money'], sites: TD },
  { id: 'explore-texas', title: 'Explore Texas', description: 'Discover communities, parks, destinations and places worth knowing.', route: '/explore', icon: 'compass', topics: ['cities-counties', 'explore-texas'], journeys: ['explore-texas'], sites: TD, featured: true },
  { id: 'texas-comparisons', title: 'Compare Texas', description: 'Compare Texas communities, counties and planning data.', route: '/texas-data', icon: 'building', topics: ['cities-counties'], journeys: ['moving-texas', 'explore-texas'], sites: TD },
];

export const SHARED_TOPICS: SharedTopic[] = [
  { id: 'home-property', title: 'Home & Property', description: 'Understand property taxes, homeownership costs, insurance and utilities.', icon: 'home', cta: 'Explore Home & Property', resourceIds: ['property-tax-calculator', 'mortgage-calculator', 'financial-tools'], sites: TD },
  { id: 'money-taxes', title: 'Money & Taxes', description: 'Make informed decisions about salary, housing, budgets and everyday expenses.', icon: 'wallet', cta: 'Find Money Tools', resourceIds: ['financial-tools', 'cost-of-living', 'budget-planner'], sites: TD },
  { id: 'government-elections', title: 'Government & Elections', description: 'Find representatives, follow legislation and understand Texas elections.', icon: 'landmark', cta: 'Find Government Resources', resourceIds: ['find-representative', 'texas-bills', 'texas-elections'], sites: KTR },
  { id: 'texas-laws', title: 'Texas Laws', description: 'Read explanations of important Texas laws and government responsibilities.', icon: 'scale', cta: 'Understand Texas Laws', resourceIds: ['texas-laws'], sites: KTR },
  { id: 'cities-counties', title: 'Cities & Counties', description: 'Explore Texas communities, counties and local planning information.', icon: 'map', cta: 'Explore Communities', resourceIds: ['explore-texas', 'texas-comparisons', 'cost-of-living'], sites: TD },
  { id: 'moving-texas', title: 'Moving to Texas', description: 'Plan a move, compare communities and prepare for the decisions ahead.', icon: 'truck', cta: 'Start Planning Your Move', resourceIds: ['moving-guide', 'cost-of-living', 'financial-tools'], sites: TD },
  { id: 'calculators-tools', title: 'Calculators & Tools', description: 'Use practical tools for property taxes, mortgages, salaries and cost of living.', icon: 'calculator', cta: 'Use the Tools', resourceIds: ['financial-tools', 'property-tax-calculator', 'mortgage-calculator'], sites: TD },
  { id: 'explore-texas', title: 'Explore Texas', description: 'Discover destinations, communities, parks and places worth knowing.', icon: 'compass', cta: 'Explore Texas', resourceIds: ['explore-texas', 'texas-comparisons'], sites: TD },
];

export const SHARED_JOURNEYS: SharedJourney[] = [
  { id: 'buying-home', title: 'Buying a Home', description: 'Estimate ownership costs and understand taxes, mortgages and related decisions.', icon: 'home', resourceIds: ['mortgage-calculator', 'property-tax-calculator', 'financial-tools'], sites: TD },
  { id: 'moving-texas', title: 'Moving to Texas', description: 'Compare costs, plan a move and prepare for life in a new community.', icon: 'truck', resourceIds: ['moving-guide', 'cost-of-living', 'explore-texas'], sites: TD },
  { id: 'saving-money', title: 'Saving Money', description: 'Use practical tools to manage taxes, housing and household expenses.', icon: 'wallet', resourceIds: ['property-tax-calculator', 'budget-planner', 'financial-tools'], sites: TD },
  { id: 'government-help', title: 'Government Information', description: 'Find representatives, bills, elections and official Texas resources.', icon: 'landmark', resourceIds: ['find-representative', 'texas-bills', 'texas-elections'], sites: KTR },
  { id: 'understand-laws', title: 'Texas Laws', description: 'Understand current Texas laws and the institutions that enact them.', icon: 'scale', resourceIds: ['texas-laws'], sites: KTR },
  { id: 'explore-texas', title: 'Explore Texas', description: 'Discover Texas communities, destinations and places to visit.', icon: 'compass', resourceIds: ['explore-texas', 'texas-comparisons'], sites: TD },
];

export function resourcesForSite(site: SharedSite) {
  return SHARED_RESOURCES.filter((resource) => resource.sites.includes(site));
}

export function topicsForSite(site: SharedSite) {
  return SHARED_TOPICS.filter((topic) => topic.sites.includes(site));
}

export function journeysForSite(site: SharedSite) {
  return SHARED_JOURNEYS.filter((journey) => journey.sites.includes(site));
}

export function resourceById(id: string) {
  return SHARED_RESOURCES.find((resource) => resource.id === id);
}

export function resolveResources(ids: readonly string[], site: SharedSite) {
  return ids.map(resourceById).filter((resource): resource is SharedResource => Boolean(resource && resource.sites.includes(site)));
}

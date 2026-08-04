import type { TexasLifePillarId } from './texas-life-platform';

export type TexasLifePillarHubLink = {
  title: string;
  description: string;
  href: string;
};

export type TexasLifePillarHub = {
  id: TexasLifePillarId;
  title: string;
  prompt: string;
  description: string;
  featured: TexasLifePillarHubLink[];
};

export const TEXAS_LIFE_PILLAR_HUBS: TexasLifePillarHub[] = [
  {
    id: 'learn',
    title: 'Learn',
    prompt: 'Help me understand.',
    description: 'Plain-English reference guides explaining how Texas works.',
    featured: [
      { title: 'Texas Property Taxes', description: 'Understand appraisals, tax rates, exemptions, and local authorities.', href: '/texas-property-taxes' },
      { title: 'Texas Laws', description: 'Find practical explanations of major state laws.', href: '/laws' },
      { title: 'Cities and Counties', description: 'Learn how Texas places, services, and local government fit together.', href: '/texas-resources/type/county' },
      { title: 'Texas School Districts', description: 'Understand districts, accountability, taxes, and enrollment.', href: '/texas-school-districts' },
    ],
  },
  {
    id: 'decide',
    title: 'Decide',
    prompt: 'Help me make a decision.',
    description: 'Comparisons and calculators for confident Texas decisions.',
    featured: [
      { title: 'Cost of Living Calculator', description: 'Compare the cost of living between Texas communities.', href: '/texas-cost-of-living-calculator' },
      { title: 'Rent or Buy Calculator', description: 'Compare the long-term cost of renting and owning.', href: '/texas-rent-vs-buy-calculator' },
      { title: 'Mortgage Calculator', description: 'Estimate monthly payments and housing costs.', href: '/texas-mortgage-calculator' },
      { title: 'Property Tax Calculator', description: 'Estimate property taxes before buying or budgeting.', href: '/tax-calculator' },
    ],
  },
  {
    id: 'do',
    title: 'Do',
    prompt: 'Help me accomplish something.',
    description: 'Step-by-step task guides linked to the correct official service.',
    featured: [
      { title: 'File a Homestead Exemption', description: 'Learn eligibility, timing, documents, and where to apply.', href: '/texas-homestead-exemption' },
      { title: 'Start a Texas LLC', description: 'Follow the formation process and official filing steps.', href: '/start-an-llc-in-texas' },
      { title: 'Get a Texas Driver License', description: 'Prepare documents, appointments, and required steps.', href: '/texas-driver-license' },
      { title: 'Register a Vehicle', description: 'Complete Texas title and registration requirements.', href: '/texas-vehicle-registration' },
    ],
  },
  {
    id: 'discover',
    title: 'Discover',
    prompt: 'Help me explore.',
    description: 'Places, experiences, and trips that make Texas worth exploring.',
    featured: [
      { title: 'Texas State Parks', description: 'Find parks, trails, camping, and reservation information.', href: '/texas-state-parks' },
      { title: 'Weekend Trips', description: 'Plan practical getaways across Texas.', href: '/texas-resources?q=weekend+trips' },
      { title: 'Texas Small Towns', description: 'Discover distinctive communities and local experiences.', href: '/texas-resources?q=small+towns' },
      { title: 'Festivals and Events', description: 'Find seasonal celebrations and community events.', href: '/texas-resources?q=festivals' },
    ],
  },
  {
    id: 'stay-informed',
    title: 'Stay Informed',
    prompt: "Tell me what's changed.",
    description: 'Practical updates about changes affecting everyday life in Texas.',
    featured: [
      { title: 'New Texas Laws', description: 'See what changed, when it takes effect, and what to do.', href: '/laws/texas-new-laws-2026' },
      { title: 'Property Tax Changes', description: 'Track changes affecting exemptions, rates, and deadlines.', href: '/property-taxes' },
      { title: 'Road Conditions', description: 'Check official travel conditions and closures.', href: 'https://drivetexas.org/' },
      { title: 'Weather Alerts', description: 'Find current official weather alerts for Texas.', href: 'https://www.weather.gov/' },
    ],
  },
];

export function texasLifePillarHub(id: TexasLifePillarId) {
  return TEXAS_LIFE_PILLAR_HUBS.find((hub) => hub.id === id);
}

export function validateTexasLifePillarHubs(hubs: ReadonlyArray<TexasLifePillarHub>) {
  const errors: string[] = [];
  const ids = new Set<TexasLifePillarId>();
  for (const hub of hubs) {
    if (ids.has(hub.id)) errors.push(`Duplicate pillar hub: ${hub.id}`);
    ids.add(hub.id);
    if (!hub.title.trim() || !hub.prompt.trim() || !hub.description.trim()) errors.push(`Incomplete pillar hub: ${hub.id}`);
    if (hub.featured.length < 4) errors.push(`Pillar hub needs at least four featured resources: ${hub.id}`);
    for (const link of hub.featured) {
      if (!link.title.trim() || !link.description.trim()) errors.push(`Incomplete featured resource in ${hub.id}`);
      if (!(link.href.startsWith('/') || link.href.startsWith('https://'))) errors.push(`Invalid resource URL in ${hub.id}: ${link.href}`);
    }
  }
  return { valid: errors.length === 0 && ids.size === 5, errors };
}

import type { TexasLifePillarId } from './texas-life-platform';

export type TexasLifeLandingLink = {
  label: string;
  href: string;
  description?: string;
};

export type TexasLifeLandingSection = {
  pillar: TexasLifePillarId;
  title: string;
  description: string;
  links: TexasLifeLandingLink[];
};

export const TEXASDEFINED_LANDING_SECTIONS: TexasLifeLandingSection[] = [
  {
    pillar: 'learn',
    title: 'Learn how Texas works',
    description: 'Understand the laws, taxes, places, schools, weather, wildlife, and history that shape everyday life in Texas.',
    links: [
      { label: 'Property taxes', href: '/texas-resources?q=property+taxes' },
      { label: 'Texas laws', href: '/laws' },
      { label: 'Cities and counties', href: '/texas-resources/topic/places' },
      { label: 'School districts', href: '/texas-resources/type/school-district' },
      { label: 'Weather and climate', href: '/texas-resources?q=weather' },
      { label: 'Texas history', href: '/texas-resources?q=history' },
    ],
  },
  {
    pillar: 'decide',
    title: 'Make a confident decision',
    description: 'Compare costs, communities, housing choices, taxes, schools, and services before making a major decision.',
    links: [
      { label: 'Cost of living calculator', href: '/texas-cost-of-living-calculator' },
      { label: 'Rent or buy', href: '/texas-resources?q=rent+or+buy' },
      { label: 'Mortgage calculator', href: '/texas-mortgage-calculator' },
      { label: 'Home affordability', href: '/texas-home-affordability-calculator' },
      { label: 'Compare cities', href: '/texas-resources/type/city' },
      { label: 'Compare counties', href: '/texas-resources/type/county' },
    ],
  },
  {
    pillar: 'do',
    title: 'Get something done',
    description: 'Follow clear steps, understand what is required, and continue to the correct official Texas resource.',
    links: [
      { label: 'File a homestead exemption', href: '/texas-resources?q=homestead+exemption' },
      { label: 'Start a Texas LLC', href: '/texas-resources?q=start+an+llc' },
      { label: 'Renew vehicle registration', href: '/texas-resources?q=vehicle+registration' },
      { label: 'Register to vote', href: '/texas-resources?q=register+to+vote' },
      { label: 'Get a hunting license', href: '/texas-resources?q=hunting+license' },
      { label: 'Reserve a campsite', href: '/texas-resources?q=reserve+a+campsite' },
    ],
  },
  {
    pillar: 'discover',
    title: 'Discover more of Texas',
    description: 'Find parks, beaches, scenic drives, festivals, food, small towns, and memorable weekend trips.',
    links: [
      { label: 'State parks', href: '/explore/state-parks' },
      { label: 'National parks', href: '/explore/national-parks' },
      { label: 'Historic sites', href: '/explore/historic-sites' },
      { label: 'Texas caverns', href: '/texas-resources?q=caverns' },
      { label: 'Lakes and rivers', href: '/texas-resources?q=lakes+rivers' },
      { label: 'Weekend trips', href: '/texas-resources?q=weekend+trips' },
    ],
  },
  {
    pillar: 'stay-informed',
    title: 'Stay informed about what changed',
    description: 'See practical updates on laws, taxes, roads, weather, and communities—focused on what the change means for you.',
    links: [
      { label: 'New Texas laws', href: '/laws/texas-new-laws-2026' },
      { label: 'Property tax changes', href: '/texas-resources?q=property+tax+changes' },
      { label: 'Weather alerts', href: '/texas-resources?q=weather+alerts' },
      { label: 'Road closures', href: '/texas-resources?q=road+closures' },
      { label: 'Community updates', href: '/texas-resources?q=community+updates' },
      { label: 'Legislative impact', href: '/texas-resources?q=legislative+updates' },
    ],
  },
];

export const TEXAS_SITE_ROLES = {
  texasdefined: {
    name: 'TexasDefined',
    focus: 'Everyday life in Texas',
    description: 'Practical guidance for living, working, investing, traveling, and thriving in Texas.',
  },
  keeptxred: {
    name: 'Keep TX Red',
    focus: 'Texas politics and government',
    description: 'Authoritative coverage of Texas politics, elections, government, representatives, and legislation.',
  },
} as const;

export function texasLifeLandingSection(pillar: TexasLifePillarId) {
  return TEXASDEFINED_LANDING_SECTIONS.find((section) => section.pillar === pillar);
}

export function validateTexasLifeLandingSections(sections: ReadonlyArray<TexasLifeLandingSection>) {
  const seen = new Set<TexasLifePillarId>();
  const errors: string[] = [];
  for (const section of sections) {
    if (seen.has(section.pillar)) errors.push(`Duplicate pillar: ${section.pillar}`);
    seen.add(section.pillar);
    if (!section.title.trim()) errors.push(`Missing title: ${section.pillar}`);
    if (!section.description.trim()) errors.push(`Missing description: ${section.pillar}`);
    if (section.links.length < 4) errors.push(`Too few links: ${section.pillar}`);
    if (section.links.some((link) => !link.href.startsWith('/'))) errors.push(`Invalid link: ${section.pillar}`);
  }
  return { valid: errors.length === 0, errors };
}

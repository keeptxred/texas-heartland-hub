export type TexasLifePillarId = 'learn' | 'decide' | 'do' | 'discover' | 'stay-informed';

export type TexasLifePillar = {
  id: TexasLifePillarId;
  title: string;
  prompt: string;
  description: string;
  examples: string[];
};

export type TexasLifePageStandard = {
  id: 'what' | 'why' | 'next' | 'verify' | 'else';
  question: string;
  purpose: string;
};

export type TexasLifeTrustStatement = {
  explanation: string;
  authority: string;
  authorityName?: string;
  authorityUrl?: string;
};

export type TexasLifeDecisionNode = {
  id: string;
  title: string;
  href: string;
  next: string[];
};

export const TEXAS_LIFE_VISION =
  'TexasDefined exists to help people confidently live, work, invest, travel, and thrive in Texas.';

export const TEXAS_LIFE_PLATFORM_VISION =
  'Build the most trusted digital guide for living in Texas—helping people understand, decide, and take action through practical guidance, interactive tools, and authoritative information.';

export const TEXAS_LIFE_PILLARS: TexasLifePillar[] = [
  {
    id: 'learn',
    title: 'Learn',
    prompt: 'Help me understand.',
    description: 'Plain-English reference information that explains how Texas works.',
    examples: ['Texas laws', 'Property taxes', 'Weather', 'School districts', 'Counties', 'Cities', 'Elections', 'Wildlife', 'History'],
  },
  {
    id: 'decide',
    title: 'Decide',
    prompt: 'Help me make a decision.',
    description: 'Comparisons, calculators, and practical tradeoffs that support confident choices.',
    examples: ['Which city?', 'Which county?', 'Rent or buy?', 'Protest my taxes?', 'Which utility?', 'Which school district?'],
  },
  {
    id: 'do',
    title: 'Do',
    prompt: 'Help me accomplish something.',
    description: 'Step-by-step task guides that lead visitors to the correct official resource.',
    examples: ['Register to vote', 'File homestead exemption', 'Start an LLC', 'Renew vehicle registration', 'Get a hunting license', 'Reserve a campsite'],
  },
  {
    id: 'discover',
    title: 'Discover',
    prompt: 'Help me explore.',
    description: 'Inspirational and practical ways to experience Texas.',
    examples: ['State parks', 'Scenic drives', 'Beaches', 'BBQ', 'Festivals', 'Hiking', 'Small towns', 'Weekend trips'],
  },
  {
    id: 'stay-informed',
    title: 'Stay Informed',
    prompt: "Tell me what's changed.",
    description: 'Timely updates framed around practical impact on everyday life in Texas.',
    examples: ['New laws', 'Tax changes', 'Road closures', 'Weather alerts', 'Legislative updates', 'Community news'],
  },
];

export const TEXAS_LIFE_PAGE_STANDARDS: TexasLifePageStandard[] = [
  { id: 'what', question: 'What is it?', purpose: 'Define the topic in plain English.' },
  { id: 'why', question: 'Why should I care?', purpose: 'Explain the practical impact.' },
  { id: 'next', question: 'What do I do next?', purpose: 'Provide a clear next action.' },
  { id: 'verify', question: 'Where can I verify it?', purpose: 'Link to the official authority.' },
  { id: 'else', question: 'What else should I know?', purpose: 'Surface exceptions, deadlines, costs, and related steps.' },
];

export const TEXAS_LIFE_EDITORIAL_PRINCIPLES = [
  'Plain English first.',
  'Guide before opinion.',
  'Official sources whenever possible.',
  'Tools beat long explanations when a calculation is needed.',
  'Every page should lead naturally to the next step.',
  'Build once, reuse everywhere through shared components and data.',
] as const;

export const TEXAS_LIFE_SUCCESS_METRICS = [
  'resource-found',
  'next-step-clicked',
  'official-source-visited',
  'task-return-visit',
] as const;

export const BUYING_HOME_DECISION_GRAPH: TexasLifeDecisionNode[] = [
  { id: 'buying-home', title: 'Buying a Home', href: '/texas-first-time-homebuyer-programs', next: ['mortgage'] },
  { id: 'mortgage', title: 'Mortgage', href: '/texas-mortgage-calculator', next: ['property-taxes'] },
  { id: 'property-taxes', title: 'Property Taxes', href: '/tax-calculator', next: ['homestead-exemption'] },
  { id: 'homestead-exemption', title: 'Homestead Exemption', href: '/texas-property-tax-protest-guide', next: ['insurance'] },
  { id: 'insurance', title: 'Insurance', href: '/texas-resources?q=home+insurance', next: ['utilities'] },
  { id: 'utilities', title: 'Utilities', href: '/texas-resources?q=utilities', next: ['schools'] },
  { id: 'schools', title: 'Schools', href: '/texas-resources/type/school-district', next: ['moving-checklist'] },
  { id: 'moving-checklist', title: 'Moving Checklist', href: '/moving-to-texas', next: ['internet-providers'] },
  { id: 'internet-providers', title: 'Internet Providers', href: '/texas-resources?q=internet+providers', next: ['county-guide'] },
  { id: 'county-guide', title: 'County Guide', href: '/texas-resources/type/county', next: ['representative'] },
  { id: 'representative', title: 'Representative', href: '/representatives', next: ['community-events'] },
  { id: 'community-events', title: 'Community Events', href: '/texas-resources?q=community+events', next: [] },
];

export function texasLifePillar(id: TexasLifePillarId) {
  return TEXAS_LIFE_PILLARS.find((pillar) => pillar.id === id);
}

export function nextDecisionSteps(graph: ReadonlyArray<TexasLifeDecisionNode>, id: string) {
  const byId = new Map(graph.map((node) => [node.id, node]));
  return (byId.get(id)?.next ?? []).flatMap((nextId) => {
    const node = byId.get(nextId);
    return node ? [{ ...node, next: [...node.next] }] : [];
  });
}

export function validateTexasLifePage(input: Partial<Record<TexasLifePageStandard['id'], string>>) {
  const missing = TEXAS_LIFE_PAGE_STANDARDS
    .filter((standard) => !input[standard.id]?.trim())
    .map((standard) => standard.id);
  return { complete: missing.length === 0, missing };
}

export function createTrustStatement(input: TexasLifeTrustStatement): TexasLifeTrustStatement {
  if (!input.explanation.trim()) throw new Error('TexasDefined explanation is required.');
  if (!input.authority.trim()) throw new Error('Official authority decision is required.');
  if (input.authorityUrl && !/^https:\/\//.test(input.authorityUrl)) {
    throw new Error('Official authority URL must use HTTPS.');
  }
  return {
    explanation: input.explanation.trim(),
    authority: input.authority.trim(),
    authorityName: input.authorityName?.trim() || undefined,
    authorityUrl: input.authorityUrl,
  };
}

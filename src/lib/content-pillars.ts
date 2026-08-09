export type ContentPillarSlug =
  | "texas-politics-government"
  | "texas-elections"
  | "texas-border-immigration"
  | "texas-energy-oil"
  | "texas-economy-small-business"
  | "texas-agriculture-rural"
  | "texas-veterans-military"
  | "texas-law-enforcement-public-safety"
  | "texas-laws-legislature";

export type ContentPillar = {
  slug: ContentPillarSlug;
  title: string;
  shortTitle: string;
  href: string;
  description: string;
  keywords: RegExp;
};

export const CONTENT_PILLARS: readonly ContentPillar[] = [
  {
    slug: "texas-politics-government",
    title: "Texas Politics & Government",
    shortTitle: "Politics & Government",
    href: "/texas-politics",
    description: "Texas statewide government, officeholders, agencies, political leadership, and the decisions shaping public policy.",
    keywords: /\b(governor|lieutenant governor|lt\.? governor|attorney general|secretary of state|comptroller|land commissioner|railroad commission|state board|state agency|politic|officeholder|appointment|executive order|proclamation|capitol)\b/i,
  },
  {
    slug: "texas-elections",
    title: "Texas Elections",
    shortTitle: "Elections",
    href: "/elections/2026",
    description: "Texas elections, candidates, races, polling, voting rules, results, and election administration.",
    keywords: /\b(election|primary|runoff|candidate|campaign|ballot|voter|voting|polling place|polls?|precinct|election day|early voting|absentee|mail ballot)\b/i,
  },
  {
    slug: "texas-border-immigration",
    title: "Texas Border & Immigration",
    shortTitle: "Border & Immigration",
    href: "/texas-border-security",
    description: "Border security, immigration enforcement, Operation Lone Star, ports of entry, and state-federal border policy.",
    keywords: /\b(border|immigration|immigrant|migrant|operation lone star|rio grande|customs and border protection|\bcbp\b|ice agents?|border patrol|asylum|deport|port of entry|cartel|smuggl)\b/i,
  },
  {
    slug: "texas-energy-oil",
    title: "Texas Energy & Oil",
    shortTitle: "Energy & Oil",
    href: "/texas-energy",
    description: "Oil and gas, the Permian Basin, ERCOT, the electric grid, pipelines, refineries, LNG, and Texas energy policy.",
    keywords: /\b(energy|oil|gas|natural gas|permian|ercot|electric grid|power grid|electricity|pipeline|refiner|refinery|lng|railroad commission|public utility commission|\bpuc\b|drilling|petroleum|crude|wind power|solar power)\b/i,
  },
  {
    slug: "texas-economy-small-business",
    title: "Texas Economy & Small Business",
    shortTitle: "Economy & Small Business",
    href: "/texas-economy",
    description: "Jobs, taxes, state spending, regulation, entrepreneurship, employers, and conditions affecting Texas small businesses.",
    keywords: /\b(economy|economic|small business|business owner|entrepreneur|startup|employer|jobs?|workforce|unemployment|tax|spending|budget|commerce|regulation|regulatory|manufacturing|investment|inflation)\b/i,
  },
  {
    slug: "texas-agriculture-rural",
    title: "Texas Agriculture & Rural Texas",
    shortTitle: "Agriculture & Rural Texas",
    href: "/texas-agriculture",
    description: "Texas farmers, ranchers, rural communities, water, livestock, crops, agricultural policy, and the rural economy.",
    keywords: /\b(agriculture|agricultural|farmer|farming|farm bill|ranch|rancher|cattle|livestock|crop|cotton|grain|wheat|corn|drought|rural|texas department of agriculture|commissioner of agriculture|farm bureau)\b/i,
  },
  {
    slug: "texas-veterans-military",
    title: "Texas Veterans & Military",
    shortTitle: "Veterans & Military",
    href: "/texas-veterans",
    description: "Texas veterans, military installations, service members, benefits, honors, deployments, and military policy affecting the state.",
    keywords: /\b(veteran|veterans|military|service member|servicemember|armed forces|army|air force|navy|marines?|coast guard|national guard|fort cavazos|fort bliss|lackland|randolph|dyess|sheppard|purple heart|medal of honor|va benefits?|department of veterans affairs)\b/i,
  },
  {
    slug: "texas-law-enforcement-public-safety",
    title: "Texas Law Enforcement & Public Safety",
    shortTitle: "Law Enforcement & Public Safety",
    href: "/texas-law-enforcement",
    description: "Texas police, sheriffs, DPS, criminal justice, emergency response, public safety policy, and major statewide enforcement developments.",
    keywords: /\b(law enforcement|police|sheriff|deputy|trooper|texas dps|department of public safety|public safety|criminal justice|crime|arrest|charged|indicted|prosecutor|district attorney|jail|prison|manhunt|amber alert|first responder)\b/i,
  },
  {
    slug: "texas-laws-legislature",
    title: "Texas Laws & Legislature",
    shortTitle: "Laws & Legislature",
    href: "/laws",
    description: "Texas laws, bills, legislative sessions, committees, constitutional amendments, rulemaking, and how state law changes.",
    keywords: /\b(legislature|legislative|house bill|senate bill|\bhb\s*\d|\bsb\s*\d|bill passed|bill filed|signed into law|new law|statute|rulemaking|regulation|committee hearing|special session|constitutional amendment|texas house|texas senate)\b/i,
  },
] as const;

const PILLAR_BY_SLUG = new Map(CONTENT_PILLARS.map((pillar) => [pillar.slug, pillar]));
const CONTENT_PILLAR_SLUGS = new Set<string>(CONTENT_PILLARS.map((pillar) => pillar.slug));

export function isContentPillarSlug(value: unknown): value is ContentPillarSlug {
  return typeof value === "string" && CONTENT_PILLAR_SLUGS.has(value);
}

export function getContentPillar(slug: ContentPillarSlug): ContentPillar {
  return PILLAR_BY_SLUG.get(slug)!;
}

export function classifyContentPillar(input: {
  title?: string | null;
  description?: string | null;
  body?: string | null;
  category?: string | null;
}): ContentPillarSlug | null {
  const haystack = `${input.category ?? ""} ${input.title ?? ""} ${input.description ?? ""} ${input.body ?? ""}`;

  // Specific beats broad: an election story about the governor belongs in Elections;
  // a border bill belongs in Border unless the legislative process itself is the news.
  const priority: ContentPillarSlug[] = [
    "texas-elections",
    "texas-border-immigration",
    "texas-veterans-military",
    "texas-agriculture-rural",
    "texas-law-enforcement-public-safety",
    "texas-energy-oil",
    "texas-laws-legislature",
    "texas-economy-small-business",
    "texas-politics-government",
  ];

  for (const slug of priority) {
    const pillar = getContentPillar(slug);
    if (pillar.keywords.test(haystack)) return slug;
  }

  return null;
}

export function resolveContentPillarSlug(
  persisted: unknown,
  input: Parameters<typeof classifyContentPillar>[0],
): ContentPillarSlug | null {
  return isContentPillarSlug(persisted) ? persisted : classifyContentPillar(input);
}

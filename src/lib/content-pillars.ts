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
  subtopics: readonly string[];
  related: readonly ContentPillarSlug[];
};

export const CONTENT_PILLARS: readonly ContentPillar[] = [
  {
    slug: "texas-politics-government",
    title: "Texas Politics & Government",
    shortTitle: "Politics & Government",
    href: "/texas-politics",
    description: "Texas statewide government, officeholders, agencies, political leadership, and the decisions shaping public policy.",
    keywords: /\b(governor|lieutenant governor|lt\.? governor|attorney general|secretary of state|comptroller|land commissioner|railroad commission|state board|state agency|politic|officeholder|appointment|executive order|proclamation|capitol)\b/i,
    subtopics: ["Statewide officials", "State agencies", "Government accountability", "Executive actions", "Public policy"],
    related: ["texas-elections", "texas-laws-legislature", "texas-economy-small-business"],
  },
  {
    slug: "texas-elections",
    title: "Texas Elections",
    shortTitle: "Elections",
    href: "/elections/2026",
    description: "Texas elections, candidates, races, polling, voting rules, results, and election administration.",
    keywords: /\b(election|primary|runoff|candidate|campaign|ballot|voter|voting|polling place|polls?|precinct|election day|early voting|absentee|mail ballot)\b/i,
    subtopics: ["Candidates", "Races", "Voting rules", "Polling", "Election results", "Election administration"],
    related: ["texas-politics-government", "texas-laws-legislature"],
  },
  {
    slug: "texas-border-immigration",
    title: "Texas Border & Immigration",
    shortTitle: "Border & Immigration",
    href: "/texas-border-security",
    description: "Border security, immigration enforcement, Operation Lone Star, ports of entry, and state-federal border policy.",
    keywords: /\b(border|immigration|immigrant|migrant|operation lone star|rio grande|customs and border protection|\bcbp\b|ice agents?|border patrol|asylum|deport|port of entry|cartel|smuggl)\b/i,
    subtopics: ["Operation Lone Star", "Immigration enforcement", "Ports of entry", "State-federal authority", "Border counties"],
    related: ["texas-law-enforcement-public-safety", "texas-laws-legislature", "texas-politics-government"],
  },
  {
    slug: "texas-energy-oil",
    title: "Texas Energy & Oil",
    shortTitle: "Energy & Oil",
    href: "/texas-energy",
    description: "Oil and gas, the Permian Basin, ERCOT, the electric grid, pipelines, refineries, LNG, and Texas energy policy.",
    keywords: /\b(energy|oil|gas|natural gas|permian|ercot|electric grid|power grid|electricity|pipeline|refiner|refinery|lng|railroad commission|public utility commission|\bpuc\b|drilling|petroleum|crude|wind power|solar power)\b/i,
    subtopics: ["ERCOT", "Electric grid", "Oil and gas", "Permian Basin", "Pipelines and refineries", "Energy regulation"],
    related: ["texas-economy-small-business", "texas-laws-legislature", "texas-politics-government"],
  },
  {
    slug: "texas-economy-small-business",
    title: "Texas Economy & Small Business",
    shortTitle: "Economy & Small Business",
    href: "/texas-economy",
    description: "Jobs, taxes, state spending, regulation, entrepreneurship, employers, and conditions affecting Texas small businesses.",
    keywords: /\b(economy|economic|small business|business owner|entrepreneur|startup|employer|jobs?|workforce|unemployment|tax|taxes|property tax(?:es)?|homestead exemption|appraisal protest|appraisal district|county appraisal district|\bcad\b|taxable value|assessed value|spending|budget|commerce|regulation|regulatory|manufacturing|investment|inflation)\b/i,
    subtopics: ["Jobs and workforce", "Small business", "Taxes and spending", "Property taxes and appraisals", "Regulation", "Manufacturing", "Investment"],
    related: ["texas-energy-oil", "texas-laws-legislature", "texas-politics-government", "texas-agriculture-rural"],
  },
  {
    slug: "texas-agriculture-rural",
    title: "Texas Agriculture & Rural Texas",
    shortTitle: "Agriculture & Rural Texas",
    href: "/texas-agriculture",
    description: "Texas farmers, ranchers, rural communities, water, livestock, crops, agricultural policy, and the rural economy.",
    keywords: /\b(agriculture|agricultural|farmer|farming|farm bill|ranch|rancher|cattle|livestock|crop|cotton|grain|wheat|corn|drought|rural|texas department of agriculture|commissioner of agriculture|farm bureau)\b/i,
    subtopics: ["Farmers and ranchers", "Livestock", "Crops", "Water and drought", "Rural economy", "Agricultural policy"],
    related: ["texas-economy-small-business", "texas-laws-legislature", "texas-politics-government"],
  },
  {
    slug: "texas-veterans-military",
    title: "Texas Veterans & Military",
    shortTitle: "Veterans & Military",
    href: "/texas-veterans",
    description: "Texas veterans, military installations, service members, benefits, honors, deployments, and military policy affecting the state.",
    keywords: /\b(veteran|veterans|military|service member|servicemember|armed forces|army|air force|navy|marines?|coast guard|national guard|fort cavazos|fort bliss|lackland|randolph|dyess|sheppard|purple heart|medal of honor|va benefits?|department of veterans affairs)\b/i,
    subtopics: ["Veterans benefits", "Military installations", "Texas National Guard", "Military honors", "Service members", "Defense policy"],
    related: ["texas-politics-government", "texas-laws-legislature", "texas-law-enforcement-public-safety"],
  },
  {
    slug: "texas-law-enforcement-public-safety",
    title: "Texas Law Enforcement & Public Safety",
    shortTitle: "Law Enforcement & Public Safety",
    href: "/texas-law-enforcement",
    description: "Texas police, sheriffs, DPS, criminal justice, emergency response, public safety policy, and major statewide enforcement developments.",
    keywords: /\b(law enforcement|police|sheriff|deputy|trooper|texas dps|department of public safety|public safety|criminal justice|crime|arrest|charged|indicted|prosecutor|district attorney|jail|prison|manhunt|amber alert|first responder)\b/i,
    subtopics: ["Texas DPS", "Police and sheriffs", "Criminal justice", "Emergency response", "Public safety policy", "Courts and prosecution"],
    related: ["texas-border-immigration", "texas-laws-legislature", "texas-politics-government"],
  },
  {
    slug: "texas-laws-legislature",
    title: "Texas Laws & Legislature",
    shortTitle: "Laws & Legislature",
    href: "/laws",
    description: "Texas laws, bills, legislative sessions, committees, constitutional amendments, rulemaking, and how state law changes.",
    keywords: /\b(legislature|legislative|house bill|senate bill|\bhb\s*\d|\bsb\s*\d|bill passed|bill filed|signed into law|new law|statute|rulemaking|regulation|committee hearing|special session|constitutional amendment|texas house|texas senate)\b/i,
    subtopics: ["Bills", "Legislative sessions", "Committees", "Texas House", "Texas Senate", "State laws", "Constitutional amendments"],
    related: ["texas-politics-government", "texas-elections", "texas-economy-small-business"],
  },
] as const;

const PILLAR_BY_SLUG = new Map(CONTENT_PILLARS.map((pillar) => [pillar.slug, pillar]));
const PILLAR_BY_HREF = new Map(CONTENT_PILLARS.map((pillar) => [pillar.href, pillar]));
const CONTENT_PILLAR_SLUGS = new Set<string>(CONTENT_PILLARS.map((pillar) => pillar.slug));

export function isContentPillarSlug(value: unknown): value is ContentPillarSlug {
  return typeof value === "string" && CONTENT_PILLAR_SLUGS.has(value);
}

export function getContentPillar(slug: ContentPillarSlug): ContentPillar {
  return PILLAR_BY_SLUG.get(slug)!;
}

export function getContentPillarByHref(href: string): ContentPillar | null {
  return PILLAR_BY_HREF.get(href) ?? null;
}

export function getRelatedContentPillars(slug: ContentPillarSlug): ContentPillar[] {
  return getContentPillar(slug).related.map((relatedSlug) => getContentPillar(relatedSlug));
}

const PRIORITY: ContentPillarSlug[] = [
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

const CATEGORY_SIGNALS: Partial<Record<string, ContentPillarSlug>> = {
  elections: "texas-elections",
  border: "texas-border-immigration",
  energy: "texas-energy-oil",
  "tax & spending": "texas-economy-small-business",
};

export function classifyContentPillar(input: {
  title?: string | null;
  description?: string | null;
  body?: string | null;
  category?: string | null;
}): ContentPillarSlug | null {
  const category = (input.category ?? "").trim().toLowerCase();
  const categorySignal = CATEGORY_SIGNALS[category];
  if (categorySignal) return categorySignal;

  const prominent = `${input.title ?? ""} ${input.description ?? ""}`;
  const prominentMatch = firstPillarMatch(prominent);
  if (prominentMatch) return prominentMatch;

  const lead = (input.body ?? "").slice(0, 1200);
  return earliestPillarMatch(lead);
}

export function classifyContentPillars(input: {
  title?: string | null;
  description?: string | null;
  body?: string | null;
  category?: string | null;
}, limit = 3): ContentPillarSlug[] {
  const primary = classifyContentPillar(input);
  const haystack = `${input.title ?? ""} ${input.description ?? ""} ${(input.body ?? "").slice(0, 1600)}`;
  const matches = PRIORITY.filter((slug) => getContentPillar(slug).keywords.test(haystack));
  const ordered = primary ? [primary, ...matches.filter((slug) => slug !== primary)] : matches;
  return [...new Set(ordered)].slice(0, Math.max(1, limit));
}

function firstPillarMatch(text: string): ContentPillarSlug | null {
  for (const slug of PRIORITY) {
    const pillar = getContentPillar(slug);
    if (pillar.keywords.test(text)) return slug;
  }
  return null;
}

function earliestPillarMatch(text: string): ContentPillarSlug | null {
  let winner: { slug: ContentPillarSlug; index: number; priority: number } | null = null;
  for (const [priority, slug] of PRIORITY.entries()) {
    const pillar = getContentPillar(slug);
    const match = text.match(pillar.keywords);
    if (!match || match.index == null) continue;
    if (!winner || match.index < winner.index || (match.index === winner.index && priority < winner.priority)) {
      winner = { slug, index: match.index, priority };
    }
  }
  return winner?.slug ?? null;
}

export function resolveContentPillarSlug(
  persisted: unknown,
  input: Parameters<typeof classifyContentPillar>[0],
): ContentPillarSlug | null {
  return isContentPillarSlug(persisted) ? persisted : classifyContentPillar(input);
}

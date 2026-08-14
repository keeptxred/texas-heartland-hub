export type TexasDefinedLink = {
  href: string;
  label: string;
  description: string;
};

const TEXAS_DEFINED = "https://texasdefined.com";

const HARD_POLITICS = /(?:^|-)(?:election|elections|candidate|candidates|campaign|primary|poll|polling|republican|democrat|legislature|legislative|senate|senator|house|governor|congress|congressional|vote|voting|ballot|bill|bills|sb\d+|hb\d+)(?:-|$)/i;

const COUNTY_SLUGS = [
  "harris",
  "dallas",
  "tarrant",
  "bexar",
  "travis",
  "collin",
  "denton",
  "fort-bend",
  "hidalgo",
  "el-paso",
  "montgomery",
  "williamson",
  "cameron",
  "brazoria",
  "bell",
  "nueces",
  "galveston",
  "lubbock",
  "webb",
  "mclennan",
  "jefferson",
  "smith",
  "brazos",
  "ellis",
  "johnson",
  "guadalupe",
  "comal",
  "hays",
  "midland",
  "ector",
  "potter",
  "randall",
  "taylor",
  "wichita",
  "grayson",
  "hunt",
  "parker",
  "rockwall",
  "bastrop",
  "caldwell",
  "burnet",
  "brewster",
  "presidio",
  "jeff-davis",
  "culberson",
  "hudspeth",
  "reeves",
  "pecos",
  "ward",
  "borden",
] as const;

const TOPIC_RULES: ReadonlyArray<{
  pattern: RegExp;
  link: TexasDefinedLink;
}> = [
  {
    pattern: /(?:history|historic|heritage|alamo|battle|centennial|anniversary)/i,
    link: {
      href: `${TEXAS_DEFINED}/texas-history`,
      label: "Texas history guides",
      description: "Explore the places, people and events behind Texas history.",
    },
  },
  {
    pattern: /(?:festival|rodeo|fair|parade|concert|event|celebration|pickle-festival)/i,
    link: {
      href: `${TEXAS_DEFINED}/events`,
      label: "Texas events",
      description: "Find nonpolitical Texas festivals, events and things to do.",
    },
  },
  {
    pattern: /(?:park|big-bend|lake|river|camp|camping|cavern|trail|wildlife|beach|gulf|stargazing|scenic|outdoors)/i,
    link: {
      href: `${TEXAS_DEFINED}/explore`,
      label: "Explore Texas",
      description: "Go deeper on Texas parks, road trips, outdoor destinations and places to visit.",
    },
  },
  {
    pattern: /(?:moving|relocation|relocating|new-resident|new-to-texas)/i,
    link: {
      href: `${TEXAS_DEFINED}/moving-to-texas`,
      label: "Moving to Texas",
      description: "Practical, nonpolitical guidance for people moving to Texas.",
    },
  },
  {
    pattern: /(?:garden|gardening|yard|landscap|home-improvement|home-maintenance)/i,
    link: {
      href: `${TEXAS_DEFINED}/home-garden`,
      label: "Texas home & garden",
      description: "Texas-specific home, yard and garden guidance.",
    },
  },
  {
    pattern: /(?:home-price|housing|real-estate|mortgage|property-value|rent-vs-buy|homebuyer|home-buying)/i,
    link: {
      href: `${TEXAS_DEFINED}/real-estate`,
      label: "Texas real estate",
      description: "Independent Texas housing, homeownership and real-estate resources.",
    },
  },
  {
    pattern: /(?:insurance|hurricane|freeze|storm|preparedness|calculator|cost-of-living|homeowners|utility-cost)/i,
    link: {
      href: `${TEXAS_DEFINED}/guides`,
      label: "Texas guides & tools",
      description: "Evergreen Texas explainers, calculators and practical reference guides.",
    },
  },
  {
    pattern: /(?:football|baseball|basketball|soccer|sports|astros|rangers|cowboys|texans|spurs|mavericks|rockets)/i,
    link: {
      href: `${TEXAS_DEFINED}/sports`,
      label: "Texas sports",
      description: "Explore the nonpolitical side of Texas sports and fan culture.",
    },
  },
];

function titleCaseCounty(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function findCountyLink(slug: string): TexasDefinedLink | null {
  const county = COUNTY_SLUGS.find((candidate) => slug.includes(`${candidate}-county`));
  if (!county) return null;
  return {
    href: `${TEXAS_DEFINED}/county/${county}`,
    label: `${titleCaseCounty(county)} County guide`,
    description: `Verified local reference information for ${titleCaseCounty(county)} County from TexasDefined.`,
  };
}

/**
 * Returns a small set of useful TexasDefined references for a KTR page.
 *
 * Brand guardrails:
 * - News pages only. The module does not turn civic/election/product pages into cross-promo pages.
 * - Hard-politics slugs are excluded unless there is also a clearly nonpolitical subject signal.
 * - No generic "Texas" keyword links and no body-text rewriting.
 * - At most three external recommendations per page.
 */
export function getTexasDefinedLinks(pathname: string): TexasDefinedLink[] {
  if (!pathname.startsWith("/news/")) return [];

  const slug = decodeURIComponent(pathname.slice("/news/".length)).toLowerCase();
  if (!slug) return [];

  const topicLinks = TOPIC_RULES.filter(({ pattern }) => pattern.test(slug)).map(({ link }) => link);
  const hasNonPoliticalSignal = topicLinks.length > 0;

  if (HARD_POLITICS.test(slug) && !hasNonPoliticalSignal) return [];

  const links: TexasDefinedLink[] = [];
  const countyLink = findCountyLink(slug);
  if (countyLink && (!HARD_POLITICS.test(slug) || hasNonPoliticalSignal)) links.push(countyLink);

  for (const link of topicLinks) {
    if (links.some((existing) => existing.href === link.href)) continue;
    links.push(link);
    if (links.length === 3) break;
  }

  return links;
}

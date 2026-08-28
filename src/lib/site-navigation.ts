export const SITE_NAV_GROUPS = [
  {
    id: "news",
    label: "News",
    href: "/news",
    description: "The latest statewide coverage, fast-moving updates, business, economy, and sports.",
    links: [
      { to: "/news", label: "Latest Texas News", description: "Breaking news and statewide reporting." },
      { to: "/happening-now", label: "Happening Now", description: "Fast-moving stories and developing updates." },
      { to: "/texas-economy", label: "Texas Economy", description: "Jobs, taxes, growth, regulation, and statewide economic trends." },
      { to: "/texas-business", label: "Texas Business", description: "Companies, employers, investment, and the Texas business climate." },
      { to: "/texas-sports", label: "Texas Sports", description: "Teams, college sports, schedules, and major events." },
    ],
  },
  {
    id: "government",
    label: "Politics & Government",
    href: "/texas-politics",
    description: "Texas politics, the Legislature, bills, officials, laws, and civic resources.",
    links: [
      { to: "/texas-politics", label: "Texas Politics", description: "State government, campaigns, officials, and policy." },
      { to: "/texas-government", label: "Texas Government", description: "Offices, leaders, constitutional powers, agencies, and highest courts." },
      { to: "/texas-legislature", label: "Texas Legislature", description: "Sessions, chambers, committees, and lawmakers." },
      { to: "/bills", label: "Track Texas Bills", description: "Search legislation, sponsors, actions, and documents." },
      { to: "/representatives", label: "Representatives", description: "Browse Texas lawmakers and public officials." },
      { to: "/find-representative", label: "Find My Representative", description: "Connect your location with the officials who represent you." },
      { to: "/contact-legislators", label: "Contact Legislators", description: "Find official contact information for Texas lawmakers." },
      { to: "/laws", label: "Texas Laws", description: "Plain-language legal guides grounded in statutes and official sources." },
    ],
  },
  {
    id: "elections",
    label: "Elections",
    href: "/elections/2026",
    description: "The 2026 Texas election hub for races, candidates, polls, voting, and results.",
    links: [
      { to: "/elections/2026", label: "Election Central", description: "Start with the complete 2026 election overview." },
      { to: "/elections/races", label: "Races", description: "Statewide, congressional, legislative, and local contests." },
      { to: "/elections/candidates", label: "Candidates", description: "Candidate profiles, backgrounds, and sourced campaign information." },
      { to: "/elections/polls", label: "Polls", description: "Published polling with field dates and methodology." },
      { to: "/elections/voting", label: "Voting Guide", description: "Dates, voter ID, ballot research, and official resources." },
      { to: "/elections/results", label: "Results", description: "Sourced unofficial returns and certified results when available." },
    ],
  },
  {
    id: "guides",
    label: "Issues & Guides",
    href: "/issues",
    description: "Permanent explainers, policy trackers, editorial positions, data, and tools.",
    links: [
      { to: "/issues", label: "Texas Issues", description: "Source-first evergreen guides to major Texas policy questions." },
      { to: "/topics", label: "Coverage Topics", description: "The map of KTR's core reporting and content pillars." },
      { to: "/policy", label: "Policy Trackers", description: "Current-status pages for issues that change over time." },
      { to: "/texas-case", label: "The Texas Case", description: "KTR's permanent editorial arguments and supporting evidence." },
      { to: "/data", label: "Texas Data Center", description: "Authoritative source maps for taxes, elections, energy, water, and more." },
      { to: "/tools", label: "Policy Tools", description: "Calculators and scenario tools with transparent assumptions." },
    ],
  },
  {
    id: "regions",
    label: "Regions",
    href: null,
    description: "Regional Texas coverage organized around the state's largest population centers.",
    links: [
      { to: "/houston", label: "Houston", description: "Houston-area government, politics, business, and public policy." },
      { to: "/dallas-fort-worth", label: "Dallas–Fort Worth", description: "North Texas government, growth, elections, and policy." },
      { to: "/san-antonio", label: "San Antonio", description: "San Antonio and South-Central Texas coverage." },
      { to: "/austin", label: "Austin", description: "Austin-area government plus the state-capitol region." },
      { to: "/el-paso", label: "El Paso", description: "El Paso, border-region government, and public policy." },
    ],
  },
] as const;

export const SHOP_LINK = {
  to: "/shop",
  label: "Shop",
  search: { category: undefined, collection: undefined, q: undefined, sort: undefined },
} as const;

export const ABOUT_LINKS = [
  { to: "/about", label: "About Keep TX Red" },
  { to: "/editorial-standards", label: "Editorial Standards" },
  { to: "/authors", label: "Newsroom Desks" },
  { to: "/contact", label: "Contact Us" },
] as const;

export const SHOP_POLICY_LINKS = [
  { to: "/about", label: "Store & Business Info" },
  { to: "/return-refund-policy", label: "Returns & Refunds" },
  { to: "/shipping-policy", label: "Shipping Policy" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms-of-service", label: "Terms of Service" },
] as const;

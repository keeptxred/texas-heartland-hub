export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string[];
  beats: string[];
};

export const EDITORIAL_BYLINE_DISCLOSURE =
  "Keep TX Red uses subject-matter desk names as editorial bylines. A desk or bureau name identifies a coverage area and editorial workflow; it is not a claim that a named individual, physical bureau, or separately staffed reporting team exists. Source-based and AI-assisted work is governed by our published editorial standards and disclosure policy.";

export const AUTHORS: Author[] = [
  {
    slug: "keep-tx-red-newsroom",
    name: "Keep TX Red Newsroom",
    role: "General Texas news & public-affairs desk",
    beats: ["Texas government", "Statewide news", "Public policy", "Government accountability"],
    bio: [
      "Keep TX Red Newsroom is the publication's organizational byline for source-grounded Texas news and public-affairs reporting that spans multiple policy beats or is not assigned to a narrower subject-matter desk. It identifies an editorial workflow, not an individual reporter.",
    ],
  },
  {
    slug: "keep-tx-red-editorial-staff",
    name: "Keep TX Red Editorial Staff",
    role: "Cross-desk editorial byline",
    beats: ["Texas politics", "Government", "Public policy", "Explanatory reporting"],
    bio: [
      "Keep TX Red Editorial Staff is an organizational byline for publication-wide explanatory and editorial work produced across Keep TX Red coverage areas. The name identifies the publication's editorial process and does not represent a named individual author.",
    ],
  },
  {
    slug: "staff-reporter",
    name: "Staff Reporter",
    role: "General assignment editorial byline",
    beats: ["Breaking news", "General assignment"],
    bio: [
      "Staff Reporter is the general-assignment editorial byline Keep TX Red uses when a story is not assigned to a subject-matter desk. It identifies the publication's editorial workflow rather than a named individual reporter.",
    ],
  },
  {
    slug: "keep-tx-red-sports-desk",
    name: "Keep TX Red Sports Desk",
    role: "Texas sports & culture",
    beats: ["Cowboys", "Texans", "Rangers", "Astros", "Spurs", "Mavericks", "Rockets", "Texas HS football"],
    bio: [
      "The Keep TX Red Sports Desk is the editorial byline for coverage of the teams and leagues that shape Texas identity — the NFL's Cowboys and Texans, MLB's Rangers and Astros, the NBA's Spurs, Mavericks, and Rockets, plus Texas high-school football.",
      "Coverage emphasizes the business and public-policy side of Texas sports, stadium and municipal-financing debates, and major competition storylines with clear Texas relevance.",
    ],
  },
  {
    slug: "texana-desk",
    name: "Texana Desk",
    role: "Texas culture, history & identity",
    beats: ["Texas history", "Landmarks & heritage", "Regional identity", "Music & food culture"],
    bio: [
      "The Texana Desk is the editorial byline for Texas culture and heritage coverage — history, landmarks, and traditions that shape the state's identity.",
      "Coverage uses primary-source history and clearly attributed reporting when a cultural story has a meaningful connection to Keep TX Red's Texas public-affairs mission.",
    ],
  },
  {
    slug: "border-bureau",
    name: "Border Bureau",
    role: "Border & Rio Grande Valley",
    beats: ["Operation Lone Star", "Rio Grande Valley", "DPS", "Federal–state friction"],
    bio: [
      "Border Bureau is the editorial byline for Keep TX Red coverage of the Texas–Mexico border, including Operation Lone Star, Texas DPS deployments, county enforcement, and state-federal policy disputes. The name describes the coverage beat; it does not represent a claimed physical bureau location.",
    ],
  },
  {
    slug: "politics-desk",
    name: "Politics Desk",
    role: "Statewide politics & campaigns",
    beats: ["Statewide races", "Primary politics", "Polling", "GOP coalition"],
    bio: [
      "The Politics Desk is the editorial byline for statewide races, the Texas primary calendar, polling, campaigns, and shifts inside the state's political coalitions.",
    ],
  },
  {
    slug: "lone-star-civics",
    name: "Lone Star Civics",
    role: "Local civics & school boards",
    beats: ["ISD boards", "Municipal elections", "Civic engagement"],
    bio: [
      "Lone Star Civics is the editorial byline for local-government coverage: school boards, city councils, MUDs, and local elections, with an emphasis on practical civic participation.",
    ],
  },
  {
    slug: "austin-bureau",
    name: "Austin Bureau",
    role: "Capitol & Legislature",
    beats: ["Texas House", "Texas Senate", "Special sessions", "Governor's office"],
    bio: [
      "Austin Bureau is the editorial byline for Texas Capitol coverage — the House, Senate, Governor's office, committees, floor action, and special sessions. The name describes the Capitol coverage beat; it does not represent a claimed physical newsroom bureau.",
    ],
  },
  {
    slug: "data-desk",
    name: "Data Desk",
    role: "Data journalism",
    beats: ["Property tax data", "ISD spending", "Election results"],
    bio: [
      "The Data Desk is the editorial byline for Keep TX Red's data tools and analytical coverage using primary-source records such as TEA, Texas Comptroller, county appraisal-district, and Secretary of State data. Methodology and source documentation are published when a dataset or analysis depends on them.",
    ],
  },
  {
    slug: "energy-desk",
    name: "Energy Desk",
    role: "Energy & the grid",
    beats: ["Permian Basin", "ERCOT", "Railroad Commission", "Pipeline policy"],
    bio: [
      "The Energy Desk is the editorial byline for the Permian Basin, Eagle Ford, ERCOT, Public Utility Commission, Railroad Commission, grid reliability, permitting, and Texas energy policy.",
    ],
  },
  {
    slug: "taxpayer-desk",
    name: "Taxpayer Desk",
    role: "Property tax & local spending",
    beats: ["Homestead exemption", "Appraisal protests", "ISD M&O rates", "Bond elections"],
    bio: [
      "The Taxpayer Desk is the editorial byline for Texas property-tax and local-spending coverage, including appraisal protests, exemptions, ISD rates, bond elections, and practical explanations of local tax bills.",
    ],
  },
  {
    slug: "civics-desk",
    name: "Civics Desk",
    role: "Government & process explainers",
    beats: ["How Texas government works", "Voter rights", "Sunshine laws"],
    bio: [
      "The Civics Desk is the editorial byline for evergreen explainers about Texas government, elections, public records, and civic procedure. Coverage is written for readers who want plain-English guidance grounded in official sources.",
    ],
  },
  {
    slug: "liberty-desk",
    name: "Liberty Desk",
    role: "Constitutional rights",
    beats: ["Second Amendment", "Religious liberty", "Property rights", "Free speech"],
    bio: [
      "The Liberty Desk is the editorial byline for constitutional-rights coverage, including firearms law, religious liberty, property rights, free speech, and limits on government power, with sourcing centered on statutes, case law, and official records.",
    ],
  },
  {
    slug: "elections-desk",
    name: "Elections Desk",
    role: "Elections & ballots",
    beats: ["Primaries & runoffs", "Voter ID", "Polling places", "Ballot integrity"],
    bio: [
      "The Elections Desk is the editorial byline for Texas election calendars, races, voter-identification rules, polling-place information, district maps, results, and election administration.",
    ],
  },
  {
    slug: "education-desk",
    name: "Education Desk",
    role: "K-12 & higher education",
    beats: ["ISDs", "School choice", "Curriculum", "TEA"],
    bio: [
      "The Education Desk is the editorial byline for Texas K-12 and higher-education policy, including school districts, TEA, curriculum, school choice, governance, and public spending.",
    ],
  },
  {
    slug: "policy-desk",
    name: "Policy Desk",
    role: "Policy analysis",
    beats: ["Water rights", "Regulatory policy", "Federalism"],
    bio: [
      "The Policy Desk is the editorial byline for long-form policy analysis on regulation, federalism, water, and structural public-policy questions, with sourcing centered on statutes, agency material, public records, and clearly attributed reporting.",
    ],
  },
];

const AUTHOR_SLUG_ALIASES: Readonly<Record<string, string>> = {
  "keep-tx-red-civics-desk": "civics-desk",
  "keep-tx-red-elections-desk": "elections-desk",
};

export function authorSlug(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return AUTHOR_SLUG_ALIASES[normalized] ?? normalized;
}

export function getAuthor(name: string): Author | undefined {
  const slug = authorSlug(name);
  return AUTHORS.find((a) => a.slug === slug);
}

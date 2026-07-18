export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string[];
  beats: string[];
};

export const AUTHORS: Author[] = [
  {
    slug: "staff-reporter",
    name: "Staff Reporter",
    role: "Newsroom",
    beats: ["Breaking news", "General assignment"],
    bio: [
      "Staff Reporter is the byline used for general-assignment Keep TX Red coverage produced by the full newsroom. Stories under this byline are edited by senior staff and reviewed against our editorial standards before publication.",
    ],
  },
  {
    slug: "keep-tx-red-sports-desk",
    name: "Keep TX Red Sports Desk",
    role: "Texas sports & culture",
    beats: ["Cowboys", "Texans", "Rangers", "Astros", "Spurs", "Mavericks", "Rockets", "Texas HS football"],
    bio: [
      "The Keep TX Red Sports Desk covers the teams and leagues that shape Texas identity — the NFL's Cowboys and Texans, MLB's Rangers and Astros, the NBA's Spurs, Mavericks, and Rockets, plus the Friday-night high-school football culture that defines fall in the Lone Star State.",
      "Reporting focuses on the business of Texas sports, stadium and municipal-financing debates, and the on-field storylines that Texans actually argue about at the barbershop.",
    ],
  },
  {
    slug: "texana-desk",
    name: "Texana Desk",
    role: "Texas culture, history & identity",
    beats: ["Texas history", "Landmarks & heritage", "Regional identity", "Music & food culture"],
    bio: [
      "The Texana Desk is Keep TX Red's culture and heritage byline — the history, landmarks, and traditions that make Texas Texas. From the Alamo to the King Ranch, from Selena to George Strait, from the Astrodome to the Cotton Bowl, we cover the stories that carry the state's identity forward.",
      "Coverage blends primary-source history with contemporary reporting on the places, people, and rituals that anchor Texas culture.",
    ],
  },
  {
    slug: "border-bureau",
    name: "Border Bureau",
    role: "Border & Rio Grande Valley",
    beats: ["Operation Lone Star", "Rio Grande Valley", "DPS", "Federal–state friction"],
    bio: [
      "The Border Bureau covers the 1,254-mile Texas–Mexico border — from El Paso and the Big Bend down through the Rio Grande Valley. Reporting tracks Operation Lone Star, Texas DPS deployments, county sheriffs along the river, and the policy fights between Austin and Washington over enforcement.",
    ],
  },
  {
    slug: "politics-desk",
    name: "Politics Desk",
    role: "Statewide politics & campaigns",
    beats: ["Statewide races", "Primary politics", "Polling", "GOP coalition"],
    bio: [
      "The Politics Desk covers statewide races, the Texas Republican primary calendar, and the shifting coalitions inside both parties. We focus on what drives Texas voters in March — when, in most districts, the real election is decided.",
    ],
  },
  {
    slug: "lone-star-civics",
    name: "Lone Star Civics",
    role: "Local civics & school boards",
    beats: ["ISD boards", "Municipal elections", "Civic engagement"],
    bio: [
      "Lone Star Civics is Keep TX Red's local-government desk: school boards, city councils, MUDs, and the May elections that decide them. Coverage centers on how Texans can actually influence the governments closest to their kitchen table.",
    ],
  },
  {
    slug: "austin-bureau",
    name: "Austin Bureau",
    role: "Capitol & Legislature",
    beats: ["Texas House", "Texas Senate", "Special sessions", "Governor's office"],
    bio: [
      "The Austin Bureau covers the Texas Capitol — the House, the Senate, the Governor's office, and the special sessions that increasingly carry the most consequential bills. We track committee calendars, floor amendments, and the conservative caucus's leverage on leadership.",
    ],
  },
  {
    slug: "data-desk",
    name: "Data Desk",
    role: "Data journalism",
    beats: ["Property tax data", "ISD spending", "Election results"],
    bio: [
      "The Data Desk builds Keep TX Red's interactive tools and analytical reporting from primary-source filings — TEA, the Texas Comptroller, county appraisal districts, and the Secretary of State. We publish methodology with every dataset so readers can audit the numbers.",
    ],
  },
  {
    slug: "energy-desk",
    name: "Energy Desk",
    role: "Energy & the grid",
    beats: ["Permian Basin", "ERCOT", "Railroad Commission", "Pipeline policy"],
    bio: [
      "The Energy Desk covers the Permian, the Eagle Ford, ERCOT, the Public Utility Commission, and the Railroad Commission — the agencies and basins that make Texas the energy capital of North America. We report on grid reliability, permitting, and federal pressure on Texas producers.",
    ],
  },
  {
    slug: "taxpayer-desk",
    name: "Taxpayer Desk",
    role: "Property tax & local spending",
    beats: ["Homestead exemption", "Appraisal protests", "ISD M&O rates", "Bond elections"],
    bio: [
      "The Taxpayer Desk exists to arm Texas homeowners with the data and procedural know-how to push back on rising property tax bills. We explain appraisal protests, exemptions, ISD bond ballots, and where every line on your tax bill actually goes.",
    ],
  },
  {
    slug: "civics-desk",
    name: "Civics Desk",
    role: "Government & process explainers",
    beats: ["How Texas government works", "Voter rights", "Sunshine laws"],
    bio: [
      "The Civics Desk writes the evergreen explainers: how a bill becomes Texas law, what an Attorney General actually does, how to read a posted commissioners court agenda. Plain-English government for Texans who want to engage but were never taught the rules.",
    ],
  },
  {
    slug: "liberty-desk",
    name: "Liberty Desk",
    role: "Constitutional rights",
    beats: ["Second Amendment", "Religious liberty", "Property rights", "Free speech"],
    bio: [
      "The Liberty Desk covers the constitutional rights at the core of Texas's conservative identity — carry law, religious liberty, property rights, and the limits of government power. Reporting is grounded in statute, case law, and the Texas Constitution.",
    ],
  },
  {
    slug: "elections-desk",
    name: "Elections Desk",
    role: "Elections & ballots",
    beats: ["Primaries & runoffs", "Voter ID", "Polling places", "Ballot integrity"],
    bio: [
      "The Elections Desk tracks every election Texans actually vote in — federal, state, ISD, city, MUD, and constitutional amendments. We publish the calendars, ID rules, and district maps Texans need to cast an informed ballot.",
    ],
  },
  {
    slug: "education-desk",
    name: "Education Desk",
    role: "K-12 & higher education",
    beats: ["ISDs", "School choice", "Curriculum", "TEA"],
    bio: [
      "The Education Desk covers Texas K-12 — ISD boards, the Texas Education Agency, curriculum, and the school choice debate. Coverage emphasizes the policy levers parents actually control and the May elections that decide them.",
    ],
  },
  {
    slug: "policy-desk",
    name: "Policy Desk",
    role: "Policy analysis",
    beats: ["Water rights", "Regulatory policy", "Federalism"],
    bio: [
      "The Policy Desk handles long-form policy analysis on water rights, regulation, federalism, and the structural questions that don't fit a daily news cycle. Sourcing leans on statute, agency reports, and public-records work.",
    ],
  },
];

export function authorSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAuthor(name: string): Author | undefined {
  const slug = authorSlug(name);
  return AUTHORS.find((a) => a.slug === slug);
}
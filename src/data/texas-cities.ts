export type CityRegion = "houston" | "dfw" | "san-antonio" | "austin" | "el-paso";

export type TexasCityConfig = {
  slug: string;
  name: string;
  region: CityRegion;
  eyebrow: string;
  title: string;
  description: string;
  communities: string[];
  coverage: { title: string; description: string }[];
  industries: string[];
  policyNotes: string[];
  fallbackSlugs: string[];
};

const REGIONAL_POLICY_FALLBACKS = [
  "texas-school-board-powers",
  "texas-school-finance-explained",
  "what-local-governments-control",
  "texas-voting-guide-2026",
  "why-texas-has-no-income-tax",
  "how-a-bill-becomes-texas-law",
];

export const TEXAS_CITIES: Record<CityRegion, TexasCityConfig> = {
  houston: {
    slug: "/houston",
    name: "Houston",
    region: "houston",
    eyebrow: "Houston and the Gulf Coast",
    title: "Houston News, Politics & Public Policy",
    description:
      "Follow Houston-area government, elections, energy, infrastructure, public safety, schools, and major regional policy decisions.",
    communities: ["Houston", "Katy", "Sugar Land", "Pearland", "Cypress", "The Woodlands"],
    coverage: [
      {
        title: "County and municipal government",
        description:
          "Track decisions by Houston, Harris County, neighboring counties, school districts, and special-purpose governments.",
      },
      {
        title: "Infrastructure and resilience",
        description:
          "Follow flood-control projects, transportation policy, port investment, drainage, and regional emergency planning.",
      },
      {
        title: "Elections and public accountability",
        description:
          "Monitor local races, public spending, ethics questions, and actions by elected officials across the metro area.",
      },
    ],
    industries: ["Energy", "Health care", "Aerospace", "Port and logistics", "Manufacturing"],
    policyNotes: [
      "Harris County and the City of Houston frequently make separate policy and budget decisions.",
      "Regional infrastructure involves county, municipal, state, federal, and special-district authorities.",
      "School-board, bond, county, and municipal elections can materially affect local policy and taxation.",
    ],
    fallbackSlugs: [
      "texas-energy-economy-overview",
      "texas-grid-ercot-explained",
      ...REGIONAL_POLICY_FALLBACKS,
    ],
  },
  dfw: {
    slug: "/dallas-fort-worth",
    name: "Dallas–Fort Worth",
    region: "dfw",
    eyebrow: "North Texas",
    title: "Dallas–Fort Worth News, Politics & Public Policy",
    description:
      "Follow government, elections, transportation, development, public safety, and economic-policy decisions across North Texas.",
    communities: ["Dallas", "Fort Worth", "Arlington", "Plano", "Frisco", "McKinney"],
    coverage: [
      {
        title: "Regional government and growth",
        description:
          "Track how Dallas, Fort Worth, surrounding cities, and fast-growing counties address development and public services.",
      },
      {
        title: "Transportation and infrastructure",
        description:
          "Follow highway, toll-road, transit, airport, water, and major capital-project decisions across the metroplex.",
      },
      {
        title: "Local elections and accountability",
        description:
          "Monitor city councils, county governments, school boards, bond proposals, and regional public spending.",
      },
    ],
    industries: ["Finance", "Technology", "Aviation", "Logistics", "Health care"],
    policyNotes: [
      "Dallas, Tarrant, Collin, and Denton counties often face different election calendars and policy priorities.",
      "Regional transportation decisions can involve cities, counties, TxDOT, transit agencies, and toll authorities.",
      "Rapid population growth places continued pressure on schools, water, roads, and local budgets.",
    ],
    fallbackSlugs: [
      "texas-voting-guide-2026",
      "texas-school-finance-explained",
      ...REGIONAL_POLICY_FALLBACKS,
    ],
  },
  "san-antonio": {
    slug: "/san-antonio",
    name: "San Antonio",
    region: "san-antonio",
    eyebrow: "South Central Texas",
    title: "San Antonio News, Politics & Public Policy",
    description:
      "Follow San Antonio-area government, military policy, growth, water, infrastructure, elections, and public accountability.",
    communities: ["San Antonio", "Alamo Heights", "Helotes", "Boerne", "Schertz", "New Braunfels"],
    coverage: [
      {
        title: "City and county government",
        description:
          "Track decisions by San Antonio, Bexar County, neighboring counties, school districts, and regional authorities.",
      },
      {
        title: "Military and federal policy",
        description:
          "Follow policy and funding affecting Joint Base San Antonio, veterans, defense employers, and connected communities.",
      },
      {
        title: "Water, growth, and infrastructure",
        description:
          "Monitor water policy, roads, development, utility governance, and fast growth across the I-35 corridor.",
      },
    ],
    industries: ["Military", "Health care", "Cybersecurity", "Tourism", "Manufacturing"],
    policyNotes: [
      "Bexar County and the City of San Antonio have separate elected leadership and budget authority.",
      "Military and veteran policy has an outsized regional impact.",
      "Growth into Comal and Guadalupe counties creates cross-jurisdiction infrastructure and school-policy questions.",
    ],
    fallbackSlugs: [
      "texas-water-rights-explained",
      "texas-school-finance-explained",
      ...REGIONAL_POLICY_FALLBACKS,
    ],
  },
  austin: {
    slug: "/austin",
    name: "Austin",
    region: "austin",
    eyebrow: "Central Texas",
    title: "Austin News, Politics & Public Policy",
    description:
      "Follow state government, Austin City Hall, regional elections, transportation, development, schools, and public accountability.",
    communities: ["Austin", "Round Rock", "Cedar Park", "Pflugerville", "Georgetown", "Buda"],
    coverage: [
      {
        title: "Texas government and the Capitol",
        description:
          "Track the Legislature, statewide officials, agencies, courts, and policy decisions centered in Austin.",
      },
      {
        title: "City and regional government",
        description:
          "Follow Austin, Travis County, surrounding cities, and fast-growing Williamson and Hays county communities.",
      },
      {
        title: "Transportation, water, and development",
        description:
          "Monitor transit, roads, utilities, water supply, land use, public spending, and regional growth policy.",
      },
    ],
    industries: ["Technology", "State government", "Education", "Semiconductors", "Creative industries"],
    policyNotes: [
      "State and local government decisions frequently overlap but are made by separate elected bodies.",
      "Transportation and land-use debates involve city, county, regional, and state authorities.",
      "Growth across Travis, Williamson, and Hays counties creates distinct election and policy environments.",
    ],
    fallbackSlugs: [
      "how-a-bill-becomes-texas-law",
      "texas-water-rights-explained",
      ...REGIONAL_POLICY_FALLBACKS,
    ],
  },
  "el-paso": {
    slug: "/el-paso",
    name: "El Paso",
    region: "el-paso",
    eyebrow: "Far West Texas",
    title: "El Paso News, Politics & Public Policy",
    description:
      "Follow El Paso-area government, border policy, Fort Bliss, trade, infrastructure, elections, and regional public accountability.",
    communities: ["El Paso", "Horizon City", "Socorro", "San Elizario", "Canutillo", "Anthony"],
    coverage: [
      {
        title: "Border and federal policy",
        description:
          "Track ports of entry, immigration enforcement, trade, customs, federal funding, and cross-border policy.",
      },
      {
        title: "Fort Bliss and defense",
        description:
          "Follow military policy, federal spending, veterans issues, and the installation's regional impact.",
      },
      {
        title: "Local government and infrastructure",
        description:
          "Monitor city, county, school, water, transportation, and public-safety decisions across the region.",
      },
    ],
    industries: ["Defense", "International trade", "Logistics", "Health care", "Government"],
    policyNotes: [
      "Border policy can involve federal, state, county, municipal, and binational institutions.",
      "Fort Bliss decisions affect regional employment, infrastructure, and public services.",
      "Water, transportation, public safety, and trade infrastructure remain central policy issues.",
    ],
    fallbackSlugs: [
      "texas-border-geography-101",
      "texas-border-policy-full-guide",
      "texas-water-rights-explained",
      ...REGIONAL_POLICY_FALLBACKS,
    ],
  },
};

export const CITY_NAVIGATION = [
  TEXAS_CITIES.houston,
  TEXAS_CITIES.dfw,
  TEXAS_CITIES["san-antonio"],
  TEXAS_CITIES.austin,
  TEXAS_CITIES["el-paso"],
];

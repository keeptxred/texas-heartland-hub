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
  relocationNotes: string[];
  fallbackSlugs: string[];
};

const RELOCATION_FALLBACKS = [
  "texas-property-tax-laws-explained",
  "homestead-exemption-explained",
  "appraisal-protest-playbook",
  "texas-school-board-powers",
  "texas-school-finance-explained",
  "what-local-governments-control",
  "texas-voting-guide-2026",
  "why-texas-has-no-income-tax",
];

export const TEXAS_CITIES: Record<CityRegion, TexasCityConfig> = {
  houston: {
    slug: "/houston",
    name: "Houston",
    region: "houston",
    eyebrow: "Houston and the Gulf Coast",
    title: "Moving to Houston",
    description:
      "Understand the Houston region through its neighborhoods, energy economy, property-tax structure, school districts, flood considerations, and fast-changing suburban communities.",
    communities: ["Houston", "Katy", "Sugar Land", "Pearland", "Cypress", "The Woodlands"],
    coverage: [
      {
        title: "Property taxes and local districts",
        description:
          "Harris County, neighboring counties, ISDs, MUDs, and other special districts can all affect the final bill.",
      },
      {
        title: "Commutes and regional scale",
        description:
          "The metro covers a very large area, so compare job location, toll roads, and peak travel before choosing a home.",
      },
      {
        title: "Flood and insurance planning",
        description:
          "Review official flood maps, drainage history, wind coverage, and insurance quotes for a specific property.",
      },
    ],
    industries: ["Energy", "Health care", "Aerospace", "Port and logistics", "Manufacturing"],
    relocationNotes: [
      "Compare Harris, Fort Bend, Montgomery, Brazoria, and Galveston county services.",
      "Confirm the assigned school district using the exact street address.",
      "Price homeowners, wind, and flood coverage before finalizing a housing budget.",
    ],
    fallbackSlugs: [
      "moving-to-houston-address-checklist",
      "texas-energy-economy-overview",
      "texas-grid-ercot-explained",
      ...RELOCATION_FALLBACKS,
    ],
  },
  dfw: {
    slug: "/dallas-fort-worth",
    name: "Dallas–Fort Worth",
    region: "dfw",
    eyebrow: "North Texas",
    title: "Moving to Dallas–Fort Worth",
    description:
      "Compare one connected North Texas economy with two central cities, many employment centers, multiple counties, and distinct suburban communities.",
    communities: ["Dallas", "Fort Worth", "Arlington", "Plano", "Frisco", "McKinney"],
    coverage: [
      {
        title: "One metro, many job centers",
        description:
          "Employment is distributed across Dallas, Fort Worth, Irving, Plano, Arlington, and other hubs rather than one downtown.",
      },
      {
        title: "County and city differences",
        description:
          "Dallas, Tarrant, Collin, and Denton counties have different tax offices, local services, and development patterns.",
      },
      {
        title: "Transportation choices",
        description:
          "Compare toll-road exposure, transit access, airport access, and actual rush-hour travel from a candidate address.",
      },
    ],
    industries: ["Finance", "Technology", "Aviation", "Logistics", "Health care"],
    relocationNotes: [
      "Choose a side of the metro based on the likely work commute rather than mileage alone.",
      "Compare county, city, ISD, and special-district rates for each property.",
      "Check fast-growth school-district boundaries before signing a lease or contract.",
    ],
    fallbackSlugs: [
      "moving-to-dallas-fort-worth-guide",
      "texas-voting-guide-2026",
      "texas-property-tax-guide",
      ...RELOCATION_FALLBACKS,
    ],
  },
  "san-antonio": {
    slug: "/san-antonio",
    name: "San Antonio",
    region: "san-antonio",
    eyebrow: "South Central Texas",
    title: "Moving to San Antonio",
    description:
      "Explore San Antonio and the surrounding Hill Country corridor through military, health-care, tourism, housing, water, and local-government considerations.",
    communities: ["San Antonio", "Alamo Heights", "Helotes", "Boerne", "Schertz", "New Braunfels"],
    coverage: [
      {
        title: "Military and civic connections",
        description:
          "Joint Base San Antonio and related employers shape the region’s economy, housing demand, and community services.",
      },
      {
        title: "Growth beyond Loop 1604",
        description:
          "Northern and northeastern growth connects Bexar County with Comal and Guadalupe county communities.",
      },
      {
        title: "Water and development",
        description:
          "Review utility providers, water restrictions, special districts, and infrastructure plans for the exact address.",
      },
    ],
    industries: ["Military", "Health care", "Cybersecurity", "Tourism", "Manufacturing"],
    relocationNotes: [
      "Compare Bexar, Comal, and Guadalupe county offices and taxing units.",
      "Check commute conditions around Loop 1604, I-10, I-35, and US 281.",
      "Verify school districts and utility providers at the street-address level.",
    ],
    fallbackSlugs: [
      "moving-to-san-antonio-guide",
      "texas-water-rights-explained",
      "texas-school-finance-explained",
      ...RELOCATION_FALLBACKS,
    ],
  },
  austin: {
    slug: "/austin",
    name: "Austin",
    region: "austin",
    eyebrow: "Central Texas",
    title: "Moving to Austin",
    description:
      "Plan for the Austin region’s technology economy, housing costs, traffic, state-government footprint, school districts, and fast-growing neighboring communities.",
    communities: ["Austin", "Round Rock", "Cedar Park", "Pflugerville", "Georgetown", "Buda"],
    coverage: [
      {
        title: "Housing and total monthly cost",
        description:
          "Compare mortgage or rent, taxes, insurance, utilities, tolls, and commute time rather than headline price alone.",
      },
      {
        title: "Regional job corridors",
        description:
          "Downtown, North Austin, Round Rock, and southern corridors can create very different daily travel patterns.",
      },
      {
        title: "Growth and infrastructure",
        description:
          "Water, roads, transit, and school capacity are central issues across Travis, Williamson, and Hays counties.",
      },
    ],
    industries: [
      "Technology",
      "State government",
      "Education",
      "Semiconductors",
      "Creative industries",
    ],
    relocationNotes: [
      "Compare Travis, Williamson, and Hays county taxes and services.",
      "Test the commute during the actual hours you expect to travel.",
      "Confirm utility territory and school assignment for the exact address.",
    ],
    fallbackSlugs: [
      "moving-to-austin-guide",
      "how-a-bill-becomes-texas-law",
      "texas-water-rights-explained",
      ...RELOCATION_FALLBACKS,
    ],
  },
  "el-paso": {
    slug: "/el-paso",
    name: "El Paso",
    region: "el-paso",
    eyebrow: "Far West Texas",
    title: "Moving to El Paso",
    description:
      "Learn how El Paso’s border location, Fort Bliss, logistics economy, desert climate, property taxes, and regional connections shape day-to-day life.",
    communities: ["El Paso", "Horizon City", "Socorro", "San Elizario", "Canutillo", "Anthony"],
    coverage: [
      {
        title: "Border and binational economy",
        description:
          "International trade, ports of entry, manufacturing, and cross-border family ties are central to the region.",
      },
      {
        title: "Fort Bliss and defense",
        description:
          "The installation and connected employers influence housing, services, and population movement.",
      },
      {
        title: "Desert climate and utilities",
        description:
          "Plan for summer cooling, water conservation, elevation, and the property-specific cost of utilities.",
      },
    ],
    industries: ["Defense", "International trade", "Logistics", "Health care", "Government"],
    relocationNotes: [
      "Vehicles registered in El Paso County remain subject to emissions testing.",
      "Compare eastside, westside, central, and lower-valley travel patterns.",
      "Review school districts, water service, and property taxes for the exact address.",
    ],
    fallbackSlugs: [
      "moving-to-el-paso-guide",
      "texas-border-geography-101",
      "texas-border-policy-full-guide",
      "texas-water-rights-explained",
      ...RELOCATION_FALLBACKS,
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

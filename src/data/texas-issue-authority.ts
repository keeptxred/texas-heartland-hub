import type { PillarArticleProps } from "@/components/pillar-article";

type AuthorityFields = Pick<
  PillarArticleProps,
  | "currentLaw"
  | "pendingLegislation"
  | "statistics"
  | "relatedRepresentatives"
  | "relatedBills"
  | "relatedElections"
  | "relatedArticles"
>;

const UPDATED = "2026-07-30";

export const TEXAS_ISSUE_AUTHORITY: Record<string, AuthorityFields> = {
  "no-state-income-tax-2026": {
    currentLaw: [
      {
        heading: "Constitutional framework",
        paragraphs: [
          "Texas does not impose a tax on individual income. The Texas Constitution requires voter approval before the Legislature can impose a tax on the net incomes of individuals, including a person's share of partnership or unincorporated-association income.",
          "Texas still collects revenue through state sales and use taxes, franchise taxes, fees, federal funding, and other sources. Local governments rely heavily on property taxes, while school finance combines local collections with state funding.",
        ],
      },
      {
        heading: "What the law means for residents",
        paragraphs: [
          "Wages, salaries, retirement income, and other personal income are not subject to a Texas individual income tax. Federal income taxes still apply, and businesses may have Texas franchise-tax or sales-tax obligations depending on their activities.",
        ],
      },
    ],
    pendingLegislation: [
      {
        to: "/legislature",
        label: "Texas tax legislation tracker",
        description: "Follow filed bills and proposed constitutional amendments affecting state revenue, sales taxes, franchise taxes, and local taxation.",
        meta: "Legislative tracking",
      },
      {
        to: "/texas/property-taxes-2026",
        label: "Property-tax relief proposals",
        description: "Track the major policy tradeoff in a state without an individual income tax: how lawmakers reduce local property-tax pressure.",
        meta: "Related policy",
      },
    ],
    statistics: [
      { value: "0%", label: "Texas individual state income-tax rate", source: "Texas constitutional and tax framework" },
      { value: "6.25%", label: "Texas state sales-tax rate before local additions", source: "Texas Comptroller" },
      { value: "8.25%", label: "Maximum combined state and local sales-tax rate", source: "Texas Comptroller" },
    ],
    relatedRepresentatives: [
      {
        to: "/representatives",
        label: "Texas House and Senate members",
        description: "Find the lawmakers who write tax policy, the state budget, and proposed constitutional amendments.",
        meta: "Legislature",
      },
      {
        to: "/contact-legislators",
        label: "Contact your Texas legislators",
        description: "Identify and contact the elected officials representing your address.",
        meta: "Take action",
      },
    ],
    relatedBills: [
      {
        to: "/legislature",
        label: "State revenue and taxation bills",
        description: "Review current-session measures affecting taxes, revenue, and the Texas budget.",
        meta: "Current session",
      },
    ],
    relatedElections: [
      {
        to: "/elections/legislative",
        label: "Texas legislative elections",
        description: "See the races that determine who will vote on state tax and budget policy.",
        meta: "Election Central",
      },
      {
        to: "/elections/2026",
        label: "2026 Texas elections",
        description: "Follow statewide and legislative contests with consequences for tax policy.",
        meta: "2026 cycle",
      },
    ],
    relatedArticles: [
      {
        to: "/texas/property-taxes-2026",
        label: "Texas Property Taxes in 2026",
        description: "Understand the local-tax side of the Texas revenue model.",
      },
      {
        to: "/texas/moving-to-texas-2026",
        label: "Moving to Texas in 2026",
        description: "Compare the tax structure with housing, insurance, and living costs.",
      },
    ],
  },

  "property-taxes-2026": {
    currentLaw: [
      {
        heading: "How Texas property-tax law works",
        paragraphs: [
          "Texas has no state property tax. Counties, cities, school districts, and special districts adopt local tax rates, while county appraisal districts determine taxable property values under state law.",
          "A residence homestead receives state-law protections and exemptions when the owner qualifies and files with the appraisal district. Additional protections may apply to homeowners who are 65 or older, disabled, veterans, surviving spouses, and other eligible groups.",
        ],
      },
      {
        heading: "Appraisals, notices, and protests",
        paragraphs: [
          "Property owners may challenge appraisal-district actions through the protest and appraisal-review-board process. Deadlines are controlled by the appraisal notice and state law, so owners should rely on the date printed on their notice rather than a general calendar date.",
          "Taxing units must follow public notice, hearing, and rate-adoption requirements. Tax bills reflect taxable value after exemptions multiplied by the rates adopted by each applicable taxing unit.",
        ],
      },
    ],
    pendingLegislation: [
      {
        to: "/legislature",
        label: "Property-tax legislation tracker",
        description: "Follow bills involving homestead exemptions, appraisal limits, school-tax compression, local rate elections, and appraisal-district procedures.",
        meta: "Legislative tracking",
      },
      {
        to: "/texas-property-tax-protest-guide",
        label: "Property-tax protest guide",
        description: "Use the site's step-by-step guide while monitoring changes to appraisal and protest law.",
        meta: "Homeowner guide",
      },
    ],
    statistics: [
      { value: "0", label: "State-level Texas property-tax rate", source: "Texas Comptroller" },
      { value: "4+", label: "Common local taxing units on one bill", source: "Typical county tax statements" },
      { value: "Annual", label: "Appraisal and protest cycle", source: "Texas Property Tax Code" },
    ],
    relatedRepresentatives: [
      {
        to: "/representatives",
        label: "Texas lawmakers",
        description: "Find legislators responsible for property-tax, appraisal, and school-finance laws.",
        meta: "Legislature",
      },
      {
        to: "/contact-legislators",
        label: "Contact your legislators",
        description: "Send questions or policy feedback to the officials representing your district.",
        meta: "Take action",
      },
    ],
    relatedBills: [
      {
        to: "/legislature",
        label: "Property-tax and school-finance bills",
        description: "Review measures that can change exemptions, compression, appraisal rules, and local revenue.",
        meta: "Current session",
      },
    ],
    relatedElections: [
      {
        to: "/elections/legislative",
        label: "Legislative races",
        description: "Track the candidates competing to write the next round of Texas property-tax policy.",
        meta: "Election Central",
      },
      {
        to: "/elections/voting",
        label: "Local and constitutional voting information",
        description: "Find election information relevant to tax-rate elections, bond proposals, and constitutional amendments.",
        meta: "Voting",
      },
    ],
    relatedArticles: [
      {
        to: "/texas-property-tax-protest-guide",
        label: "Texas Property Tax Protest Guide",
        description: "Prepare evidence, understand deadlines, and navigate the protest process.",
      },
      {
        to: "/news/why-texas-has-no-income-tax",
        label: "Why Texas Has No State Income Tax",
        description: "See why property taxes play such a large role in the Texas tax structure.",
      },
    ],
  },

  "moving-to-texas-2026": {
    currentLaw: [
      {
        heading: "Residency, identification, and vehicles",
        paragraphs: [
          "New residents must address Texas driver-license, vehicle-registration, inspection, insurance, and voter-registration requirements on the timelines that apply to their circumstances. State agencies, rather than unofficial summaries, control the final requirements and deadlines.",
          "Texas does not impose an individual state income tax, but residents pay state and local sales taxes and may face substantial property taxes, homeowners-insurance costs, tolls, utility expenses, and local fees.",
        ],
      },
      {
        heading: "Housing and local rules",
        paragraphs: [
          "Housing costs and legal obligations vary by city, county, school district, homeowners association, flood zone, and utility territory. Buyers and renters should verify property restrictions, insurance availability, tax estimates, school boundaries, and commute costs before signing a contract.",
        ],
      },
    ],
    pendingLegislation: [
      {
        to: "/legislature",
        label: "Growth, housing, and infrastructure legislation",
        description: "Follow bills affecting housing supply, property taxes, transportation, utilities, schools, insurance, and fast-growing communities.",
        meta: "Legislative tracking",
      },
      {
        to: "/texas/property-taxes-2026",
        label: "Property-tax policy changes",
        description: "Monitor one of the largest recurring costs facing Texas homeowners and landlords.",
        meta: "Cost of living",
      },
    ],
    statistics: [
      { value: "4", label: "Largest metro anchors: DFW, Houston, Austin, San Antonio", source: "Texas regional geography" },
      { value: "0%", label: "Texas individual state income-tax rate", source: "Texas constitutional and tax framework" },
      { value: "254", label: "Texas counties with different local conditions", source: "State of Texas" },
    ],
    relatedRepresentatives: [
      {
        to: "/representatives",
        label: "Find Texas representatives",
        description: "Learn who represents the area where you plan to live and which districts shape local policy.",
        meta: "Government",
      },
      {
        to: "/contact-legislators",
        label: "Contact district offices",
        description: "Ask state offices about constituent services and state-agency issues after relocating.",
        meta: "Constituent help",
      },
    ],
    relatedBills: [
      {
        to: "/legislature",
        label: "Housing, transportation, and growth bills",
        description: "Track policy changes affecting new residents and rapidly growing Texas communities.",
        meta: "Current session",
      },
    ],
    relatedElections: [
      {
        to: "/elections/districts",
        label: "Texas election districts",
        description: "Understand the political districts connected to a prospective Texas address.",
        meta: "Election Central",
      },
      {
        to: "/elections/2026",
        label: "2026 Texas elections",
        description: "Follow the statewide and legislative races that will shape growth policy.",
        meta: "2026 cycle",
      },
    ],
    relatedArticles: [
      {
        to: "/news/why-texas-has-no-income-tax",
        label: "Why Texas Has No State Income Tax",
        description: "Understand a major financial reason households consider Texas.",
      },
      {
        to: "/texas/property-taxes-2026",
        label: "Texas Property Taxes in 2026",
        description: "Estimate the local-tax tradeoff before choosing a home or county.",
      },
      {
        to: "/dmv",
        label: "Texas DMV and driver guides",
        description: "Start the practical vehicle and identification steps associated with a move.",
      },
    ],
  },
};

export const TEXAS_ISSUE_AUTHORITY_UPDATED = UPDATED;

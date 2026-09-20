import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE8: PolicyTracker[] = [
  {
    slug: "regulatory-reform-treo",
    shortTitle: "Regulatory Reform",
    title: "Texas Regulatory Reform and TREO Policy Tracker",
    description: "Track the Texas Regulatory Efficiency Office, agency rule reviews, regulatory-cost analysis, permit and licensing navigation, rulemaking reforms, and implementation of Senate Bill 14.",
    updated: reviewed,
    quickAnswer: "Texas Senate Bill 14 created the Texas Regulatory Efficiency Office within the Office of the Governor and added Government Code Chapter 465 to reform state rulemaking and regulatory review. TREO launched publicly in October 2025 and operates a statewide regulatory portal in 2026.",
    currentStatus: "Texas regulatory reform has moved from legislation into implementation. TREO is reviewing rules, publishing regulatory-reduction information, coordinating access to agency forms and requirements, and operating a public portal for permits, licenses, and regulations across state agencies.",
    keyFacts: [
      "SB 14 is titled the Regulatory Reform and Efficiency Act and created Government Code Chapter 465.",
      "Chapter 465 establishes TREO within the Office of the Governor and directs it to identify unnecessary or ineffective rules, assess regulatory costs, and help agencies find lower-cost ways to protect the public.",
      "The law also calls for improved public access to state rules, forms, and filings and an interactive website for regulated occupations, industries, professions, and activities.",
      "TREO's 2026 portal reports regulatory-review and reduction metrics and provides navigation across state permits and licensing workflows; those implementation claims should be updated as the office publishes new data.",
    ],
    context: [
      "KTR's editorial preference favors reducing unnecessary regulation and making government requirements easier to understand. The factual tracker separately measures which rules are actually repealed or changed, the costs claimed to be saved, and whether public-protection goals are maintained.",
      "This tracker complements occupational-licensing mobility but is broader: TREO covers state rulemaking, regulatory review, forms, permits, contested-case processes, and agency practices beyond professional licensing.",
    ],
    watchFor: [
      "TREO rule-review and regulatory-reduction reports",
      "Agency repeals or amendments attributed to Chapter 465 reviews",
      "Changes to regulatory cost, employment-impact, or rulemaking analyses",
      "Expansion of the public permits, forms, and licensing portal",
    ],
    sources: [
      { label: "Texas Legislature Online — SB 14 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00014F.htm", primary: true },
      { label: "Texas Regulatory Efficiency Office", url: "https://treo.texas.gov/", primary: true },
      { label: "Office of the Governor — TREO launch", url: "https://gov.texas.gov/news/post/governor-abbott-launches-texas-regulatory-efficiency-office-opens-regulation-evaluation-portal", primary: true },
      { label: "Texas Government Code", url: "https://statutes.capitol.texas.gov/?link=GV", primary: true },
    ],
    related: [
      { label: "Licensing Mobility tracker", href: "/policy/occupational-licensing-mobility", kind: "reference" },
      { label: "State-Federal Power tracker", href: "/policy/state-federal-power", kind: "reference" },
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["TREO", "regulatory reform", "SB 14", "Texas DOGE", "deregulation", "rules", "permits", "regulatory efficiency"],
  },
  {
    slug: "career-technical-workforce",
    shortTitle: "Career & Technical Education",
    title: "Texas Career and Technical Education and Workforce Policy Tracker",
    description: "Track Texas CTE expansion, workforce-aligned credentials, dual credit, rural pathways, career readiness, grant coordination, and regional labor-demand alignment.",
    updated: reviewed,
    quickAnswer: "Texas expanded career and technical education policy in 2025 through measures including HB 120 and SB 1786. The state framework links high-school and postsecondary CTE, credentials, dual credit, grant programs, and regional labor-demand data more closely to workforce needs.",
    currentStatus: "Texas is implementing a broader workforce-alignment strategy across the Texas Education Agency, Texas Higher Education Coordinating Board, and Texas Workforce Commission. The durable questions are whether programs produce credentials employers value, improve completion and employment outcomes, expand rural access, and avoid duplicative grant spending.",
    keyFacts: [
      "HB 120 became law in 2025 and expanded college, career, and military readiness provisions, including career and technology education programs, FAST, R-PEP, funding, reporting, and related public-school structures.",
      "SB 1786 requires TEA, THECB, and TWC to coordinate competitive secondary and postsecondary CTE grant programs aligned with state workforce-development goals.",
      "SB 1786 also requires TWC to conduct a biennial assessment of regional labor demand using available state and federal labor-market data to help higher-education programs align with workforce needs.",
      "A workforce-aligned CTE policy should be judged by credential value, completion, employment, wage outcomes, employer demand, and access—not merely enrollment counts or grant totals.",
    ],
    context: [
      "KTR's editorial position favors practical education routes that lead to skilled work without assuming a four-year degree is the only successful path. The factual tracker follows funding, program capacity, credentials, labor-market alignment, and measurable student outcomes.",
      "This tracker complements public education and occupational licensing by following the pipeline from secondary CTE through postsecondary training, credentials, licensing where required, and entry into the workforce.",
    ],
    watchFor: [
      "TEA, THECB, and TWC coordination of CTE grant programs",
      "TWC regional labor-demand assessments",
      "Changes to FAST, R-PEP, dual-credit, credential, and CTE funding rules",
      "Completion, credential, employment, wage, and employer-demand outcomes",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 120", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB120", primary: true },
      { label: "Texas Legislature Online — SB 1786 summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=SB1786&LegSess=89R", primary: true },
      { label: "Texas Workforce Commission", url: "https://www.twc.texas.gov/", primary: true },
      { label: "Texas Education Agency — Career and Technical Education", url: "https://tea.texas.gov/academics/college-career-and-military-prep/career-and-technical-education", primary: true },
    ],
    related: [
      { label: "Public Education tracker", href: "/policy/public-education", kind: "reference" },
      { label: "Licensing Mobility tracker", href: "/policy/occupational-licensing-mobility", kind: "reference" },
      { label: "Texas Economy", href: "/texas-economy", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["career and technical education", "CTE", "HB 120", "SB 1786", "workforce", "vocational training", "dual credit", "R-PEP", "FAST"],
  },
  {
    slug: "semiconductor-manufacturing",
    shortTitle: "Semiconductor Manufacturing",
    title: "Texas Semiconductor Manufacturing and Supply Chain Policy Tracker",
    description: "Track the Texas CHIPS Act, Semiconductor Innovation Fund and Consortium, grants, semiconductor manufacturing investment, workforce development, research, and domestic supply-chain expansion.",
    updated: reviewed,
    quickAnswer: "Texas enacted HB 5174 in 2023 to create the Texas Semiconductor Innovation Consortium and Texas Semiconductor Innovation Fund. The program supports semiconductor research, design, manufacturing, workforce development, and qualifying grants or matching funds, and remains active with new projects receiving awards in 2026.",
    currentStatus: "The Texas semiconductor strategy is now an active economic-development program rather than a planning proposal. The state reports approximately $948 million in total TSIF appropriations through 2025 and continues announcing manufacturing and supply-chain projects in 2026.",
    keyFacts: [
      "HB 5174 became effective immediately on June 9, 2023 and added Government Code Subchapter GG establishing the Texas Semiconductor Innovation Consortium and Fund.",
      "The statutory program is designed to support semiconductor research, design, manufacturing, investment, workforce development, and collaboration among industry and higher education.",
      "The Texas Semiconductor Innovation Fund can provide matching funding to state entities and institutions of higher education and grants to qualifying businesses with an established Texas presence.",
      "Because TSIF is an incentive program, KTR should track announced grants alongside promised capital investment, jobs, project completion, supply-chain value, and actual economic outcomes rather than treating every award as self-proving success.",
    ],
    context: [
      "KTR's editorial position favors stronger domestic manufacturing and resilient strategic supply chains, while recognizing an intra-conservative debate over targeted corporate incentives. The factual tracker therefore makes subsidy amounts, company commitments, jobs, capital investment, and delivery milestones visible.",
      "Semiconductors connect economic policy to national security, advanced manufacturing, higher-education research, workforce training, energy demand, water use, and competition with foreign adversaries.",
    ],
    watchFor: [
      "New TSIF grants and matching awards",
      "Project construction, hiring, capital-investment, and production milestones",
      "Texas Semiconductor Innovation Consortium reports and recommendations",
      "Federal semiconductor policy, export controls, supply-chain shocks, and major Texas expansions",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 5174", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=88R&Bill=HB5174", primary: true },
      { label: "HB 5174 enrolled text", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/HB05174F.htm", primary: true },
      { label: "Office of the Governor — Texas Semiconductor Innovation Fund", url: "https://gov.texas.gov/business/page/tsif", primary: true },
    ],
    related: [
      { label: "Career & Technical Education tracker", href: "/policy/career-technical-workforce", kind: "reference" },
      { label: "China Investment Restrictions tracker", href: "/policy/china-investment-restrictions", kind: "reference" },
      { label: "Energy & ERCOT tracker", href: "/policy/energy-ercot", kind: "reference" },
      { label: "Texas Economy", href: "/texas-economy", kind: "reference" },
    ],
    keywords: ["semiconductor", "Texas CHIPS Act", "HB 5174", "TSIF", "Texas Semiconductor Innovation Fund", "manufacturing", "chips", "supply chain"],
  },
];

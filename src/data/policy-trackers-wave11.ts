import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE11: PolicyTracker[] = [
  {
    slug: "data-centers-large-loads",
    shortTitle: "Data Centers & Large Loads",
    title: "Texas Data Centers, Large Loads, and Grid Policy Tracker",
    description: "Track Texas data-center and other large-load interconnections, SB 6 implementation, ERCOT Batch Zero, transmission costs, reliability requirements, curtailment, water concerns, and state oversight.",
    updated: reviewed,
    quickAnswer: "Texas Senate Bill 6 took effect June 20, 2025 and created a new framework for very large electric loads in ERCOT, including interconnection standards, cost allocation, reliability protections, load forecasting, and curtailment-related requirements. In 2026, ERCOT and the PUCT moved qualifying 75-megawatt-and-larger projects into a Batch Zero study process, while the Governor directed additional verification of data-center projects before they advance.",
    currentStatus: "Large-load policy is now an active implementation issue rather than a future legislative concept. The PUCT approved ERCOT's Batch Zero process in June 2026, ERCOT began implementing it in July, and on August 3, 2026 the Governor directed a comprehensive verification and audit of data centers advancing through ERCOT's interconnection process. ERCOT subsequently delayed parts of Batch Zero classification while it coordinates next steps with the PUCT.",
    keyFacts: [
      "SB 6 requires the PUCT to establish standards for interconnecting large-load customers in ERCOT while supporting business development, reducing stranded-infrastructure risk, and maintaining reliability.",
      "The statutory framework generally uses a 75 MW threshold unless the PUCT determines a lower threshold is needed for the relevant standards.",
      "ERCOT's Batch Zero process evaluates qualified large-load requests together rather than only project by project so systemwide reliability and transmission impacts can be considered.",
      "A data center's requested load is not the same thing as load that is already interconnected and operating; queue requests, study-qualified projects, committed projects, and energized facilities should be reported separately.",
    ],
    context: [
      "KTR's editorial priority is that ordinary Texans should not bear avoidable reliability risk or stranded grid costs created by speculative or unusually large new loads. At the same time, data centers and advanced manufacturing can create real investment and jobs, so the policy question is how to make growth pay its fair infrastructure cost and meet reliability standards rather than whether Texas should simply reject growth.",
      "Coverage should connect electric-load requests with generation, transmission, water demand, local tax incentives, jobs, capital investment, backup generation, curtailment capability, and actual project completion. Announced megawatts or investment figures alone do not prove a project will be built.",
    ],
    watchFor: [
      "PUCT and ERCOT implementation of SB 6 and the post-audit Batch Zero process",
      "Large-load queue totals separated by study maturity and actual interconnection status",
      "Transmission upgrade costs, deposits, financial commitments, and cost-allocation rules",
      "Data-center water use, local incentives, backup power, curtailment performance, and community impacts",
    ],
    sources: [
      { label: "Texas Legislature Online — SB 6 enrolled summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=SB6&LegSess=89R", primary: true },
      { label: "ERCOT — Large Load Integration", url: "https://www.ercot.com/services/rq/large-load-integration", primary: true },
      { label: "ERCOT — PUCT approval of Batch Zero", url: "https://www.ercot.com/news/release/06182026-puct-approves-ercots", primary: true },
      { label: "Office of the Governor — August 2026 data-center audit directive", url: "https://gov.texas.gov/news/post/governor-abbott-directs-comprehensive-data-center-audit", primary: true },
    ],
    related: [
      { label: "Energy & ERCOT tracker", href: "/policy/energy-ercot", kind: "reference" },
      { label: "Advanced Nuclear tracker", href: "/policy/advanced-nuclear", kind: "reference" },
      { label: "Semiconductor Manufacturing tracker", href: "/policy/semiconductor-manufacturing", kind: "reference" },
      { label: "Texas data", href: "/data", kind: "reference" },
    ],
    keywords: ["Texas data centers", "data center grid", "large load", "SB 6", "ERCOT Batch Zero", "75 MW", "data center electricity", "large load interconnection", "PUCT"],
  },
  {
    slug: "constitutional-tax-protections",
    shortTitle: "Tax Protections",
    title: "Texas Constitutional Tax Protections Policy Tracker",
    description: "Track Texas constitutional prohibitions on individual capital-gains taxes, certain securities-transaction taxes, death and inheritance taxes, and future attempts to alter those voter-approved protections.",
    updated: reviewed,
    quickAnswer: "Texas voters adopted three major tax-limitation amendments on November 4, 2025: Proposition 2 prohibits a state tax on realized or unrealized capital gains of an individual, family, estate, or trust subject to stated exceptions; Proposition 6 restricts certain occupation and securities-transaction taxes involving registered securities market operators; and Proposition 8 restricts state estate, inheritance, death, and specified transfer taxes subject to its exceptions.",
    currentStatus: "The November 2025 amendments are part of the current Texas Constitution. They do not abolish the taxes Texas already uses generally, such as sales, use, property, mineral-production, insurance-premium, or general business taxes where the respective constitutional text preserves them. The durable policy question is how these protections constrain future legislatures and how courts interpret their definitions and exceptions if a new tax is challenged.",
    keyFacts: [
      "Governor Greg Abbott's December 2025 proclamation certified that voters adopted Proposition 2 (SJR 18), Proposition 6 (HJR 4), and Proposition 8 (HJR 2).",
      "Proposition 2 added Article VIII, Section 24-b and prohibits a tax on realized or unrealized capital gains of an individual, family, estate, or trust, while preserving the applicability or rate changes of property, sales, and use taxes.",
      "Proposition 6 prohibits an occupation tax on a registered securities market operator and a tax on a securities transaction conducted by such an operator, while its text preserves specified existing/general tax categories and fees.",
      "Proposition 8 restricts state death, estate, inheritance, and specified transfer taxes but contains express exceptions, including property taxes and a motor-vehicle gift tax; it should not be summarized as a constitutional ban on every tax associated with wealth or asset transfers.",
    ],
    context: [
      "KTR's editorial position favors predictable low taxes and constitutional barriers against creating new taxes that could materially change Texas's economic model. The factual tracker keeps that argument tied to the exact scope of each amendment rather than claiming Texas has constitutionally prohibited taxation in general.",
      "These amendments also matter to business-location and investment debates. Future reporting should distinguish a tax that is politically unpopular from one that is actually constitutionally barred, and should identify the affected taxpayer and transaction rather than using labels such as 'wealth tax' loosely.",
    ],
    watchFor: [
      "Texas court cases interpreting the 2025 tax amendments",
      "Legislation testing the definitions or exceptions in Sections 24-b and the other adopted provisions",
      "Future constitutional amendments involving income, investment, business, transaction, estate, or transfer taxes",
      "Fiscal proposals that replace a prohibited tax concept with a differently structured levy",
    ],
    sources: [
      { label: "Texas Register — Governor proclamation certifying 2025 amendments", url: "https://www.sos.state.tx.us/texreg/archive/December52025/The%20Governor/The%20Governor.html", primary: true },
      { label: "Texas Legislature Online — SJR 18 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SJ00018F.htm", primary: true },
      { label: "Texas Legislature Online — HJR 4 enrolled history", url: "https://capitol.texas.gov/billlookup/History.aspx?Bill=HJR4&LegSess=89R", primary: true },
      { label: "Texas Legislature Online — HJR 2 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HJ00002F.htm", primary: true },
    ],
    related: [
      { label: "State Budget tracker", href: "/policy/state-budget", kind: "reference" },
      { label: "Property Taxes tracker", href: "/policy/property-taxes", kind: "reference" },
      { label: "Texas Economy", href: "/texas-economy", kind: "reference" },
      { label: "Texas constitutional amendments", href: "/laws/constitutional-amendments", kind: "law" },
    ],
    keywords: ["Texas capital gains tax", "Proposition 2", "Proposition 6", "Proposition 8", "death tax", "inheritance tax", "securities transaction tax", "Texas Constitution taxes"],
  },
  {
    slug: "critical-minerals-rare-earths",
    shortTitle: "Critical Minerals",
    title: "Texas Critical Minerals and Rare-Earth Supply Chain Policy Tracker",
    description: "Track Texas rare-earth mining, magnet and advanced-material manufacturing, critical-mineral incentives, permitting, domestic supply chains, jobs, capital investment, and reliance on foreign sources.",
    updated: reviewed,
    quickAnswer: "Texas is actively pursuing a domestic critical-minerals and rare-earth supply chain through mining and processing projects, advanced-manufacturing recruitment, and economic-development programs. In 2026 the state announced major rare-earth projects including USA Rare Earth's Round Top development in Hudspeth County and MP Materials' rare-earth magnet manufacturing expansion in North Texas, both supported by state incentives connected to the semiconductor and advanced-manufacturing supply chain.",
    currentStatus: "Critical-minerals policy in Texas is not one single 'rare earth law.' It spans mineral development, environmental and land-use permitting, semiconductor and advanced-manufacturing incentives, workforce development, infrastructure, federal policy, and national-security supply-chain concerns. The state now lists Rare Earth Elements and Mineral Mining as a target industry sector and is using existing incentive tools to support projects from extraction through magnet and materials manufacturing.",
    keyFacts: [
      "In May 2026 Texas announced a $14.1776 million Texas Semiconductor Innovation Fund grant for USA Rare Earth to accelerate the Round Top Mountain project in Hudspeth County; the state announcement projected 260 jobs and more than $1.4 billion in capital investment.",
      "In February 2026 Texas announced a $53.4575 million semiconductor-fund grant plus a Texas Enterprise Fund grant for MP Materials' Northlake rare-earth magnet campus; the state announcement projected more than 1,500 jobs and more than $1.25 billion in capital investment.",
      "State economic-development materials identify Rare Earth Elements and Mineral Mining as a target industry sector because of its inputs to advanced technology, infrastructure, and national-security industries.",
      "Announced grants, jobs, investment, mineral resources, permitting, commercial production, and actual output are different milestones and should be tracked separately rather than treating an announcement as completed domestic independence.",
    ],
    context: [
      "KTR's policy lens favors reducing dependence on hostile or strategically risky foreign supply chains while expanding domestic manufacturing. Conservatives can still disagree about the proper size and design of targeted grants, so this tracker will treat industrial subsidies and incentive programs as an intra-conservative debate rather than an automatic consensus position.",
      "The best accountability test is whether publicly supported projects reach construction and production milestones, create the jobs and capital investment promised, strengthen downstream Texas manufacturing, and do so under enforceable environmental, water, land, and infrastructure rules.",
    ],
    watchFor: [
      "Round Top permitting, financing, construction, processing, and production milestones",
      "MP Materials North Texas magnet-campus construction and output",
      "New Texas grants, tax incentives, JETI agreements, or federal support for mineral and magnet projects",
      "Critical-mineral supply, import dependence, prices, environmental approvals, water demand, and downstream Texas manufacturing capacity",
    ],
    sources: [
      { label: "Office of the Governor — USA Rare Earth Round Top grant", url: "https://gov.texas.gov/news/post/governor-abbott-announces-texas-semiconductor-innovation-fund-grant-to-usa-rare-earth", primary: true },
      { label: "Office of the Governor — MP Materials Northlake expansion", url: "https://gov.texas.gov/news/post/governor-abbott-announces-mp-materials-rare-earth-magnet-manufacturing-expansion-in-northlake", primary: true },
      { label: "Office of the Governor — Texas target industries", url: "https://gov.texas.gov/business/page/target-industries", primary: true },
      { label: "Texas CHIPS Office", url: "https://gov.texas.gov/business/page/texas-chips-office", primary: true },
    ],
    related: [
      { label: "Semiconductor Manufacturing tracker", href: "/policy/semiconductor-manufacturing", kind: "reference" },
      { label: "China Investment Restrictions tracker", href: "/policy/china-investment-restrictions", kind: "reference" },
      { label: "Foreign-Adversary Property tracker", href: "/policy/foreign-adversary-property", kind: "reference" },
      { label: "Texas Economy", href: "/texas-economy", kind: "reference" },
    ],
    keywords: ["critical minerals", "rare earth", "rare earth Texas", "Round Top", "USA Rare Earth", "MP Materials", "rare earth magnets", "domestic supply chain", "mineral independence"],
  },
];

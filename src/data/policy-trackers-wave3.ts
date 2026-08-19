import type { PolicyTracker } from "@/data/policy-trackers";

export const POLICY_TRACKERS_WAVE3: PolicyTracker[] = [
  {
    slug: "medical-freedom",
    shortTitle: "Medical Freedom",
    title: "Texas Medical Freedom Policy Tracker",
    description: "Track Texas informed-consent rules, vaccination-status protections, patient choice, organ-transplant rules, and medical-freedom legislation.",
    updated: "2026-08-19",
    quickAnswer: "Texas medical-freedom law is issue-specific rather than one blanket rule. One enacted 2025 protection, HB 4076, limits adverse organ-transplant decisions based solely on vaccination status while preserving individualized medical judgment. Other consent, vaccination, employment, school, and public-health rules are governed by separate statutes.",
    currentStatus: "Medical-freedom proposals remain active in Texas, but not every proposal becomes law. For example, SB 407 passed the Senate in 2025 but did not advance through the House. KTR therefore tracks enacted protections separately from bills that were proposed but failed to become law.",
    keyFacts: [
      "HB 4076 added protections against adverse organ-transplant decisions based solely on vaccination status, while allowing vaccination status to be considered when a physician determines after individualized evaluation that it is medically significant to the transplant.",
      "HB 4076 took effect September 1, 2025 and directed HHSC to adopt necessary implementing rules by January 1, 2026.",
      "SB 407 proposed requiring conscience-based vaccine exemptions in certain health-care facility policies, but Texas Legislature Online shows that it passed the Senate and did not reach the later House or governor stages.",
      "Texas medical-freedom disputes can involve different populations and statutes, so a rule affecting employees, schoolchildren, transplant patients, or minors should not be generalized to every health-care setting.",
    ],
    context: [
      "KTR's editorial emphasis is informed consent and protection from unnecessary coercion. The factual tracker keeps that principle separate from the precise scope of each enacted statute and from individualized clinical judgments expressly preserved by law.",
      "This page connects health-policy news to enacted statutes, failed and pending proposals, agency implementation, court challenges, and election debates without treating every medical-freedom question as legally identical.",
    ],
    watchFor: [
      "HHSC and licensing-agency implementation of enacted protections",
      "Court challenges involving consent or vaccination-status protections",
      "New legislation affecting minors, employment, schools, hospitals, or public-health powers",
      "Refiled or replacement legislation for proposals that did not become law in 2025",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 4076", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB4076", primary: true },
      { label: "Texas Legislature Online — SB 407 stages", url: "https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=SB407&LegSess=89R", primary: true },
      { label: "Texas Health and Safety Code", url: "https://statutes.capitol.texas.gov/?link=HS", primary: true },
      { label: "Texas Health and Human Services", url: "https://www.hhs.texas.gov/", primary: true },
    ],
    related: [
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Election Central", href: "/elections", kind: "reference" },
      { label: "Texas political reference", href: "/texas-political-reference", kind: "reference" },
    ],
    keywords: ["medical freedom", "informed consent", "vaccine mandate", "vaccination status", "HB 4076", "SB 407", "organ transplant", "health care"],
  },
  {
    slug: "esg-energy-boycotts",
    shortTitle: "ESG & Energy Boycotts",
    title: "Texas ESG and Energy Boycott Policy Tracker",
    description: "Track Texas anti-ESG law, state divestment rules, energy-boycott lists, public contracts, fiduciary disputes, and legislation affecting financial companies and the oil-and-gas industry.",
    updated: "2026-08-19",
    quickAnswer: "Texas Government Code Chapter 809, created by SB 13 in 2021, requires the Comptroller to identify certain financial companies that boycott energy companies and generally requires covered state governmental entities to divest from listed companies subject to statutory procedures and exceptions.",
    currentStatus: "The Comptroller continues to maintain the statutory energy-boycott list. The June 2025 update removed BlackRock and identified hundreds of investment funds subject to the Chapter 809 process. The policy debate now centers on fiduciary duties, financial performance, state contracting and investment power, and how broadly Texas should extend anti-boycott rules.",
    keyFacts: [
      "SB 13 became effective September 1, 2021 and created Government Code Chapter 809 governing state investment in financial companies that boycott certain energy companies.",
      "Chapter 809 establishes notice, clarification, divestment, prohibited-investment, reporting, and enforcement procedures rather than an automatic blanket ban on every company associated with ESG policies.",
      "The Comptroller's June 2025 update removed BlackRock from the financial-company list and reported approximately 332 investment funds qualifying for divestment under the statute.",
      "Texas anti-ESG policy should be evaluated separately from ordinary fiduciary decisions, because the statutes define which entities, contracts, investments, thresholds, exceptions, and procedures are covered.",
    ],
    context: [
      "KTR's editorial position favors protecting Texas energy producers from politically motivated financial discrimination. The factual tracker separately follows the exact statutory tests, Comptroller determinations, fiduciary exceptions, litigation, and measurable financial consequences.",
      "This tracker connects ESG disputes to the Energy & ERCOT tracker, oil-and-gas coverage, state contracting, university funds, the Comptroller, and legislation rather than treating every corporate environmental policy as legally equivalent to a Chapter 809 boycott.",
    ],
    watchFor: [
      "Comptroller updates to financial-company and investment-fund lists",
      "Litigation over Chapter 809 or related contracting statutes",
      "Legislation expanding, narrowing, or modifying covered state funds and contracts",
      "Documented investment-performance, fee, or market-access effects attributed to anti-boycott rules",
    ],
    sources: [
      { label: "Texas Legislature Online — SB 13 enrolled text", url: "https://capitol.texas.gov/tlodocs/87R/billtext/html/SB00013F.HTM", primary: true },
      { label: "Texas Comptroller — Divestment Statute Lists", url: "https://comptroller.texas.gov/purchasing/publications/divestment.php", primary: true },
      { label: "Texas Comptroller — June 2025 energy-boycott list update", url: "https://comptroller.texas.gov/about/media-center/news/20250603-texas-comptroller-glenn-hegar-announces-update-to-list-of-financial-companies-that-boycott-energy-companies-1746731924320", primary: true },
      { label: "Texas Government Code", url: "https://statutes.capitol.texas.gov/?link=GV", primary: true },
    ],
    related: [
      { label: "Energy & ERCOT tracker", href: "/policy/energy-ercot", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Texas Comptroller", href: "/texas-government/comptroller", kind: "government" },
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
    ],
    keywords: ["ESG", "energy boycott", "SB 13", "Chapter 809", "divestment", "BlackRock", "oil and gas", "Texas Comptroller", "fossil fuel"],
  },
];

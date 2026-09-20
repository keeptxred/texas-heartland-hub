import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE6: PolicyTracker[] = [
  {
    slug: "higher-education-dei",
    shortTitle: "Higher-Ed DEI",
    title: "Texas Higher Education DEI Policy Tracker",
    description: "Track Texas public-university DEI restrictions, governing-board duties, compliance audits, curriculum and faculty-governance changes, and litigation affecting higher education.",
    updated: reviewed,
    quickAnswer: "Texas Education Code Section 51.3525 restricts diversity, equity, and inclusion offices and specified DEI practices at public institutions of higher education. The framework originated in SB 17 in 2023 and operates alongside later higher-education governance changes enacted in 2025.",
    currentStatus: "Texas public higher education now operates under a statutory DEI-compliance framework plus newer governance requirements. The key questions are how institutions implement the law, how compliance is audited and enforced, how federal antidiscrimination duties interact with state restrictions, and how later governance legislation changes institutional decision-making.",
    keyFacts: [
      "SB 17 of the 88th Legislature became effective January 1, 2024 and added Education Code Section 51.3525.",
      "Section 51.3525 defines covered DEI offices and restricts specified institutional practices involving hiring, training, statements, and differential treatment, subject to statutory exceptions and other law.",
      "The statute includes compliance and reporting mechanisms; it should not be summarized as a ban on every discussion of race, sex, ethnicity, or discrimination in teaching or research.",
      "SB 37 of the 89th Legislature, effective September 1, 2025, separately changed public higher-education governance, curriculum review, faculty-senate authority, and ombudsman structures.",
    ],
    context: [
      "KTR's editorial position favors merit, equal treatment, viewpoint diversity, and institutional accountability. The factual tracker separates that position from the precise scope of Section 51.3525 and later higher-education governance statutes.",
      "This tracker complements campus free speech by distinguishing institutional DEI administration and governance from the separate legal rules protecting expressive activity.",
    ],
    watchFor: ["State-auditor and coordinating-board compliance activity", "University policy changes under Section 51.3525", "Litigation involving state restrictions and federal antidiscrimination law", "Implementation of 2025 governance and curriculum-review requirements"],
    sources: [
      { label: "Texas Education Code — Section 51.3525", url: "https://statutes.capitol.texas.gov/?artSec=51.3525&chapter=ED.51&code=ED&tab=1", primary: true },
      { label: "Texas Legislature Online — SB 17 (88th Legislature)", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=88R&Bill=SB17", primary: true },
      { label: "Texas Legislature Online — SB 37 (89th Legislature)", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SB37", primary: true },
    ],
    related: [
      { label: "Campus Free Speech tracker", href: "/policy/campus-free-speech", kind: "reference" },
      { label: "Public Education tracker", href: "/policy/public-education", kind: "reference" },
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["DEI", "SB 17", "SB 37", "higher education", "Texas universities", "merit", "faculty senate", "Section 51.3525"],
  },
  {
    slug: "foreign-adversary-property",
    shortTitle: "Foreign-Adversary Property",
    title: "Texas Foreign-Adversary Real Property Policy Tracker",
    description: "Track Texas restrictions on real-property acquisitions by certain foreign governments, entities, and individuals, including SB 17 enforcement, exceptions, designated countries, and litigation.",
    updated: reviewed,
    quickAnswer: "Texas SB 17, effective September 1, 2025, added Property Code Subchapter H restricting certain purchases or acquisitions of Texas real property by governments, entities, and individuals connected to designated countries. The law includes exceptions and a detailed enforcement process rather than a blanket ban on all foreign-born people owning Texas property.",
    currentStatus: "The statutory framework is now in force. Coverage should focus on who is actually covered, who is exempt, which countries or entities are designated, how the attorney general investigates and enforces violations, and how courts interpret the law's constitutional and property-rights boundaries.",
    keyFacts: [
      "Property Code Section 5.253 identifies categories of governments, companies, organizations, and individuals barred from purchasing or otherwise acquiring covered Texas real-property interests.",
      "Section 5.252 exempts U.S. citizens and lawful permanent residents and contains additional entity and short-term leasehold exceptions.",
      "The statute defines real property broadly, including agricultural, commercial, industrial, residential, mineral, groundwater, timber, and water-right interests.",
      "The attorney general has investigation and civil-enforcement authority, and a court can order divestiture after finding a prohibited acquisition.",
    ],
    context: [
      "KTR's editorial position favors protecting strategic Texas land and infrastructure from hostile foreign control while preserving clear rules for lawful residents and ordinary property transactions. The factual tracker therefore emphasizes statutory definitions and exceptions rather than nationality-based shorthand.",
      "The issue intersects with agriculture, property rights, state sovereignty, national security, critical infrastructure, and foreign-investment policy.",
    ],
    watchFor: ["Governor designations or removals under the statute", "Attorney General investigations and enforcement actions", "Constitutional or federal-preemption litigation", "Legislative changes to covered property, entities, exceptions, penalties, or enforcement"],
    sources: [
      { label: "Texas Property Code — Subchapter H", url: "https://statutes.capitol.texas.gov/?artSec=5.253&chapter=PR.5&code=PR&tab=1", primary: true },
      { label: "Texas Legislature Online — SB 17 (89th Legislature)", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SB17", primary: true },
      { label: "SB 17 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00017F.HTM", primary: true },
    ],
    related: [
      { label: "Agriculture & Family Farms tracker", href: "/policy/agriculture-family-farms", kind: "reference" },
      { label: "Housing & Property Rights tracker", href: "/policy/housing", kind: "reference" },
      { label: "State-Federal Power tracker", href: "/policy/state-federal-power", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["foreign land ownership", "SB 17", "China land", "foreign adversary", "Texas property", "designated country", "agricultural land", "national security"],
  },
  {
    slug: "china-investment-restrictions",
    shortTitle: "China Investment Restrictions",
    title: "Texas China-Affiliated Investment Restrictions Policy Tracker",
    description: "Track Texas Government Code Chapter 809A, restricted-entity lists, state pension and Permanent School Fund divestment, fiduciary exceptions, reports, and enforcement under SB 667.",
    updated: reviewed,
    quickAnswer: "Texas SB 667, effective September 1, 2025, created Government Code Chapter 809A restricting specified state governmental entities from investing in certain Chinese-affiliated and federally restricted entities. The law uses Comptroller-maintained lists, divestment procedures, reporting, and limited statutory exceptions.",
    currentStatus: "The implementation question is now which entities appear on the Comptroller's restricted list, how covered retirement systems and the Permanent School Fund divest or avoid prohibited holdings, when statutory financial exceptions are invoked, and what annual reports show.",
    keyFacts: [
      "Chapter 809A applies to specified state governmental investment entities, including major Texas retirement systems and the Permanent School Fund; it is not a general ban on private Texans investing in Chinese companies.",
      "The law distinguishes direct and indirect holdings and defines Chinese-affiliated and other restricted entities using statutory and federal-list criteria.",
      "Covered entities generally must divest listed restricted holdings and may not acquire prohibited securities, subject to statutory procedures and exceptions intended to address material financial harm.",
      "The attorney general may enforce the chapter, and covered entities have recurring public-reporting duties.",
    ],
    context: [
      "KTR's editorial position favors reducing strategic financial exposure to entities tied to hostile governments while requiring transparent accounting of costs, performance, and fiduciary consequences. The tracker keeps that argument separate from the law's exact list-based mechanics.",
      "This topic is distinct from Texas's ESG divestment rules and from SB 17 real-property restrictions even though all three use state financial or property power to address policy risks.",
    ],
    watchFor: ["Comptroller restricted-entity list publication and updates", "Retirement-system and Permanent School Fund divestment reports", "Use of statutory financial-loss exceptions", "Litigation or legislation changing definitions, federal-list references, or covered entities"],
    sources: [
      { label: "Texas Legislature Online — SB 667", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SB667", primary: true },
      { label: "SB 667 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00667F.htm", primary: true },
      { label: "Texas Government Code", url: "https://statutes.capitol.texas.gov/?link=GV", primary: true },
      { label: "Texas Comptroller", url: "https://comptroller.texas.gov/", primary: true },
    ],
    related: [
      { label: "ESG & Energy Boycotts tracker", href: "/policy/esg-energy-boycotts", kind: "reference" },
      { label: "Foreign-Adversary Property tracker", href: "/policy/foreign-adversary-property", kind: "reference" },
      { label: "Texas Comptroller", href: "/texas-government/comptroller", kind: "government" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["China investment", "SB 667", "Chapter 809A", "Chinese-affiliated entities", "divestment", "Texas pensions", "Permanent School Fund", "Comptroller"],
  },
];

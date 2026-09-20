import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE2: PolicyTracker[] = [
  {
    slug: "parental-rights",
    shortTitle: "Parental Rights",
    title: "Texas Parental Rights Policy Tracker",
    description: "Track Texas constitutional protections, public-school parental rights, notice and consent rules, curriculum transparency, and implementation of recent education laws.",
    updated: reviewed,
    quickAnswer: "Texas voters adopted a constitutional amendment in November 2025 affirming that parents are the primary decision makers for their children. State education law also gives parents specific rights involving school information, health-related services, instruction, grievances, and other decisions affecting their children.",
    currentStatus: "Parental rights are now anchored both in the Texas Constitution and in detailed Education Code requirements. The practical policy questions are how school districts implement notice, consent, access, curriculum, health-service, and grievance requirements and how courts reconcile parental authority with other state and federal obligations.",
    keyFacts: [
      "Texas voters adopted Proposition 15 in November 2025, adding a constitutional parental-rights provision originating in SJR 34.",
      "SB 12, effective September 1, 2025, revised Texas public-education law on parental rights, instruction, DEI duties, student clubs, social transitioning, and related school requirements.",
      "TEA guidance requires school systems to provide information about parental rights and to notify parents about specified changes in health-related services or monitoring.",
      "Parental-rights questions should be tied to the exact Education Code provision, district policy, or constitutional rule involved rather than treated as a single unlimited right.",
    ],
    context: [
      "KTR supports strong parental authority in education while keeping the factual tracker focused on what Texas law actually requires. This page separates constitutional principles from the operational duties imposed on districts and state agencies.",
      "The tracker connects parental-rights disputes to school choice, public education, curriculum, student privacy, health services, and elections for local school boards and state offices.",
    ],
    watchFor: [
      "TEA implementation guidance and rulemaking",
      "Litigation interpreting the 2025 constitutional amendment",
      "District compliance with notice, consent, and access requirements",
      "New legislation involving curriculum, student records, health services, or parental consent",
    ],
    sources: [
      { label: "Texas Legislature Online — SJR 34", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SJR34", primary: true },
      { label: "Texas Legislature Online — SB 12", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SB12", primary: true },
      { label: "Texas Education Agency — SB 12 parental-rights guidance", url: "https://tea.texas.gov/taa-letters/updated-sb-12-guidance-required-parental-rights-form-and-right-health-related-services", primary: true },
    ],
    related: [
      { label: "School Choice tracker", href: "/policy/school-choice", kind: "reference" },
      { label: "Public Education tracker", href: "/policy/public-education", kind: "reference" },
      { label: "The Texas Case for Parental Rights and School Choice", href: "/texas-case/parental-rights-school-choice", kind: "editorial" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Election Central", href: "/elections", kind: "reference" },
    ],
    keywords: ["parental rights", "parents", "SB 12", "SJR 34", "school parent rights", "curriculum", "parental consent", "TEA"],
  },
  {
    slug: "election-integrity",
    shortTitle: "Election Integrity",
    title: "Texas Election Integrity Policy Tracker",
    description: "Track Texas voter eligibility, citizenship rules, voter ID, voter-registration maintenance, election audits, mail voting, ballot security, and election-law changes.",
    updated: reviewed,
    quickAnswer: "Texas election law requires eligible voters to register before voting and imposes identification, ballot-handling, registration, audit, and canvassing rules. Texas voters also amended the state constitution in November 2025 to state expressly that a voter must be a United States citizen.",
    currentStatus: "Election integrity remains a permanent policy area rather than a one-election story. The strongest coverage separates eligibility, registration-list maintenance, voter identification, ballot handling, auditing, recounts, and election contests because each is governed by different law and evidence.",
    keyFacts: [
      "Proposition 16, originating in SJR 37, was adopted by Texas voters in November 2025 and expressly added non-citizens to the classes of persons not allowed to vote in Texas.",
      "The Texas Election Code separately governs registration, identification, early voting, voting by mail, ballot security, tabulation, canvassing, audits, recounts, and election contests.",
      "SB 827 expanded post-election hand-count audit procedures beginning with the November 2025 constitutional-amendment election.",
      "Claims about election administration should be checked against official county records, Secretary of State guidance, statutes, canvassed results, audits, and court records.",
    ],
    context: [
      "KTR supports secure elections and citizen-only voting while keeping factual reporting tied to verifiable procedures and records. A permanent tracker makes it easier to distinguish a policy disagreement from an allegation of an actual election-law violation.",
      "This tracker is designed to cross-link election news, candidate and race pages, redistricting coverage, legislative bills, and practical voter resources without duplicating Election Central.",
    ],
    watchFor: [
      "Secretary of State election advisories and rule changes",
      "Voter-registration list-maintenance procedures and litigation",
      "Post-election audit and recount results",
      "Legislation affecting voter ID, mail voting, ballot security, citizenship verification, or election administration",
    ],
    sources: [
      { label: "Texas Secretary of State — Elections", url: "https://www.sos.state.tx.us/elections/", primary: true },
      { label: "Texas Election Code", url: "https://statutes.capitol.texas.gov/?link=EL", primary: true },
      { label: "Texas Legislature Online — SJR 37", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SJR37", primary: true },
    ],
    related: [
      { label: "Election Central", href: "/elections", kind: "reference" },
      { label: "Texas Legislature", href: "/texas-legislature", kind: "government" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Texas political reference", href: "/texas-political-reference", kind: "reference" },
    ],
    keywords: ["election integrity", "voter ID", "citizenship voting", "noncitizen voting", "voter registration", "mail voting", "election audit", "Texas elections"],
  },
  {
    slug: "bitcoin-reserve",
    shortTitle: "Bitcoin Reserve",
    title: "Texas Strategic Bitcoin Reserve Policy Tracker",
    description: "Track the Texas Strategic Bitcoin Reserve, Comptroller authority, eligible cryptocurrency rules, custody, audits, appropriations, performance, and legislative oversight.",
    updated: reviewed,
    quickAnswer: "Texas created the Texas Strategic Bitcoin Reserve through SB 21 in 2025. The reserve is a special fund outside the state treasury administered by the Texas Comptroller under Government Code Chapter 403, with statutory rules for eligible assets, custody, management, audits, and reporting.",
    currentStatus: "SB 21 became effective June 20, 2025. The durable questions now concern implementation: how the Comptroller manages the reserve, what assets qualify under statute, what money the Legislature places into it, custody and risk controls, performance, audits, and required public reporting.",
    keyFacts: [
      "SB 21 is enacted law, not merely a proposed reserve.",
      "The reserve is established as a special fund outside the state treasury and is administered by the Comptroller.",
      "The statute authorizes specified cryptocurrency investment activity subject to eligibility, prudent-investor, custody, audit, and reporting provisions.",
      "Legislative appropriations and implementation decisions matter separately from the existence of the statutory reserve itself.",
    ],
    context: [
      "Texas's reserve creates a concrete state-policy test of cryptocurrency as a public asset. KTR tracks the policy from a limited-government and monetary-freedom perspective while treating investment performance, custody risk, statutory compliance, and taxpayer exposure as factual questions.",
      "The reserve also belongs in a broader Texas technology and financial-freedom cluster covering cryptocurrency regulation, privacy, digital payments, state financial policy, and opposition to a federal central bank digital currency.",
    ],
    watchFor: [
      "Comptroller implementation and reserve reports",
      "Legislative appropriations or changes to eligible assets",
      "Custody, audit, and risk-management disclosures",
      "Reserve holdings, performance, and administrative costs",
    ],
    sources: [
      { label: "Texas Legislature Online — SB 21", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SB21", primary: true },
      { label: "SB 21 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00021F.htm", primary: true },
      { label: "Texas Comptroller", url: "https://comptroller.texas.gov/", primary: true },
    ],
    related: [
      { label: "Texas and Central Bank Digital Currency", href: "/policy/central-bank-digital-currency", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Texas Comptroller", href: "/texas-government/comptroller", kind: "government" },
      { label: "Texas political reference", href: "/texas-political-reference", kind: "reference" },
    ],
    keywords: ["Texas Strategic Bitcoin Reserve", "SB 21", "bitcoin", "cryptocurrency", "crypto", "Texas Comptroller", "digital assets"],
  },
  {
    slug: "central-bank-digital-currency",
    shortTitle: "CBDC",
    title: "Texas and Central Bank Digital Currency Policy Tracker",
    description: "Track Texas policy toward a federal central bank digital currency, financial privacy, cryptocurrency freedom, cash, digital assets, and related legislation.",
    updated: reviewed,
    quickAnswer: "Texas cannot create or block federal monetary policy by itself, but the Texas Legislature formally expressed opposition to creation of a federal central bank digital currency in SCR 8 in 2025. Texas policy debates focus on privacy, surveillance, payment freedom, state participation, and alternatives such as cash and decentralized digital assets.",
    currentStatus: "SCR 8 records the Legislature's opposition but is a concurrent resolution, not a Texas prohibition on the Federal Reserve. Future state action could address whether Texas agencies may participate in, accept, hold, or facilitate a CBDC if federal policy changes.",
    keyFacts: [
      "SCR 8 was adopted by both chambers of the 89th Texas Legislature and expresses opposition to creation of a central bank digital currency.",
      "A Federal Reserve CBDC would be federal monetary policy; a Texas resolution does not itself control the Federal Reserve.",
      "A CBDC is conceptually different from decentralized cryptocurrency such as bitcoin and from ordinary electronic bank deposits.",
      "The central Texas policy questions involve privacy, cybersecurity, financial surveillance, state participation, and payment choice.",
    ],
    context: [
      "KTR's editorial perspective favors financial privacy and decentralized alternatives to government-controlled digital money. The tracker keeps that position separate from the legal question of what Texas can control and from the factual status of federal CBDC proposals.",
      "This page cross-links directly to the Texas Strategic Bitcoin Reserve because the two issues reflect contrasting approaches to digital assets: decentralized cryptocurrency held by the state versus a potential centrally issued federal digital currency.",
    ],
    watchFor: [
      "Federal Reserve or congressional action involving a retail CBDC",
      "Texas legislation restricting state-agency participation in a CBDC",
      "State constitutional or statutory protections for cash and digital-asset ownership",
      "Privacy and cybersecurity requirements for digital-payment systems",
    ],
    sources: [
      { label: "Texas Legislature Online — SCR 8", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SCR8", primary: true },
      { label: "SCR 8 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SC00008F.htm", primary: true },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/", primary: true },
    ],
    related: [
      { label: "Texas Strategic Bitcoin Reserve", href: "/policy/bitcoin-reserve", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Texas political reference", href: "/texas-political-reference", kind: "reference" },
    ],
    keywords: ["CBDC", "central bank digital currency", "SCR 8", "financial privacy", "digital currency", "Federal Reserve", "bitcoin", "crypto"],
  },
];

export function getWave2PolicyTracker(slug: string): PolicyTracker | undefined {
  return POLICY_TRACKERS_WAVE2.find((tracker) => tracker.slug === slug);
}

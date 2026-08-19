import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE10: PolicyTracker[] = [
  {
    slug: "school-library-materials",
    shortTitle: "School Library Materials",
    title: "Texas School Library Materials and Parental Review Policy Tracker",
    description: "Track Texas school-library acquisition rules, parental access controls, material challenges, local advisory councils, board approval, TEA guidance, and changes to Senate Bill 13 implementation.",
    updated: reviewed,
    quickAnswer: "Texas Senate Bill 13 applies beginning with the 2025-2026 school year and requires school districts to adopt library-material acquisition policies, give parents access to library catalogs and tools to restrict their own child's access, maintain a challenge process, and submit proposed library acquisitions for board approval under the statute's procedures.",
    currentStatus: "SB 13 is in implementation. TEA issued statewide guidance and a model library-materials policy in 2025, while the Texas State Library and Archives Commission was directed to update school-library collection-development standards by April 1, 2026. The durable questions are how districts implement parental controls, public review, challenges, advisory councils, and board approval without confusing library materials with classroom instructional materials.",
    keyFacts: [
      "Education Code Chapter 33 now contains specific school-library acquisition, catalog, parental-access, challenge, and advisory-council provisions added or amended by SB 13.",
      "Parents must be able to access the school library catalog and identify materials their own child may not check out or access outside the library.",
      "A local school library advisory council is optional unless the statutory petition threshold is met, at which point the district board must establish one.",
      "The board of trustees must adopt an acquisition policy and approve or reject proposed library materials under the statute's public-meeting procedures; the law should not be summarized as a statewide list of books automatically banned by Texas.",
    ],
    context: [
      "KTR's editorial emphasis favors parental authority, age-appropriate materials, transparency, and accountable local boards. The factual tracker separates those policy views from the actual procedures districts must follow under current law.",
      "Coverage should distinguish voluntary library access, required classroom assignments, instructional materials, challenges to particular titles, and districtwide acquisition policy because different rules can apply to each.",
    ],
    watchFor: [
      "TEA updates to SB 13 model policies, forms, and implementation guidance",
      "Texas State Library and Archives Commission collection-development standards",
      "District board votes, advisory-council petitions, and material challenges",
      "Litigation or later legislation affecting parental access, library acquisition, or constitutional claims",
    ],
    sources: [
      { label: "Texas Education Agency — SB 13 requirements", url: "https://tea.texas.gov/taa-letters/senate-bill-13-requirements-related-school-library-materials", primary: true },
      { label: "Texas Education Agency — Model policies and guidance", url: "https://tea.texas.gov/texas-schools/school-boards/model-policies-and-guidance-for-texas-school-systems", primary: true },
      { label: "Texas Legislature Online — SB 13 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00013F.HTM", primary: true },
      { label: "Texas Education Code", url: "https://statutes.capitol.texas.gov/?link=ED", primary: true },
    ],
    related: [
      { label: "Parental Rights tracker", href: "/policy/parental-rights", kind: "reference" },
      { label: "Public Education tracker", href: "/policy/public-education", kind: "reference" },
      { label: "School Choice tracker", href: "/policy/school-choice", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["school library", "library books", "SB 13", "parental rights", "book challenge", "library materials", "school library advisory council", "Texas Education Code 33"],
  },
  {
    slug: "school-safety-security",
    shortTitle: "School Safety",
    title: "Texas School Safety and Armed Campus Security Policy Tracker",
    description: "Track Texas armed-campus security requirements, school resource officers, emergency operations plans, good-cause exceptions, TEA safety oversight, grants, audits, and school-safety legislation.",
    updated: reviewed,
    quickAnswer: "Texas Education Code Section 37.0814 requires each school district board to determine the appropriate number of armed security officers for each campus and generally ensure at least one is present during regular school hours, subject to a statutory good-cause exception when qualifying personnel or funding are unavailable. Later 2025 legislation expanded and clarified who may serve and how exceptions and alternative standards operate.",
    currentStatus: "The armed-security requirement created by 2023 HB 3 remains part of Texas school-safety law and was amended in 2025 by legislation including HB 121 and HB 1458. Current implementation also includes emergency-operations planning, safety audits, law-enforcement coordination, incident response, and TEA/Texas School Safety Center oversight.",
    keyFacts: [
      "Education Code Section 37.0814 is the central armed-security requirement for school districts.",
      "A district that cannot fully comply because qualifying personnel or funding are unavailable may claim a good-cause exception but must adopt an alternative standard and review the exception as required by current law.",
      "HB 1458 expanded categories of qualifying officers, including certain reserve and honorably retired peace officers, while HB 121 clarified alternative-standard and broader school-safety requirements.",
      "School safety is broader than armed security: emergency operations, access control, audits, communications, training, mental-health response, and coordination with local law enforcement are separate parts of the framework.",
    ],
    context: [
      "KTR's editorial position supports a strong security presence and rapid law-enforcement response at schools. The tracker separately measures what districts are legally required to do, where exceptions exist, and whether state funding and staffing make compliance practical.",
      "Coverage should not imply that one armed-officer rule by itself satisfies every school-safety obligation or proves that a campus is secure; the broader statutory system includes prevention, preparedness, response, reunification, recovery, audits, and emergency planning.",
    ],
    watchFor: [
      "District use and renewal of good-cause exceptions",
      "TEA school-safety compliance monitoring, guidance, and grants",
      "Changes to qualifying security personnel or reserve-officer rules",
      "School-safety funding, emergency-response standards, audits, and Texas School Safety Center requirements",
    ],
    sources: [
      { label: "Texas Education Code — Chapter 37", url: "https://statutes.capitol.texas.gov/?link=ED", primary: true },
      { label: "Texas Education Agency — School Safety 89th Legislature updates", url: "https://tea.texas.gov/taa-letters/school-safety-89th-legislative-updates", primary: true },
      { label: "Texas Legislature Online — HB 121 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00121F.HTM", primary: true },
      { label: "Texas Legislature Online — HB 1458 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB01458F.HTM", primary: true },
    ],
    related: [
      { label: "Public Education tracker", href: "/policy/public-education", kind: "reference" },
      { label: "Gun Rights tracker", href: "/policy/gun-rights", kind: "reference" },
      { label: "Criminal Justice tracker", href: "/policy/criminal-justice", kind: "reference" },
      { label: "Texas Law Enforcement", href: "/texas-law-enforcement", kind: "reference" },
    ],
    keywords: ["school safety", "armed security officer", "school resource officer", "HB 3", "HB 121", "HB 1458", "Texas school security", "Education Code 37.0814"],
  },
  {
    slug: "violent-offense-bail",
    shortTitle: "Violent-Offense Bail",
    title: "Texas Violent-Offense Bail and Pretrial Detention Policy Tracker",
    description: "Track Texas constitutional bail rules, Proposition 3/SJR 5, hearings, evidentiary standards, public-safety findings, implementing law, court decisions, and pretrial-detention policy.",
    updated: reviewed,
    quickAnswer: "Texas voters adopted Proposition 3 on November 4, 2025, adding a constitutional rule requiring denial of bail in specified circumstances for people accused of listed felony offenses when the constitutional conditions are met after a hearing. The change does not abolish bail generally or eliminate due process; it creates a defined pretrial-detention framework for covered cases.",
    currentStatus: "The 2025 amendment is now part of the Texas constitutional bail framework. The key implementation questions are which offenses qualify, what the state must prove, what findings a judge or magistrate must make, how hearings operate, and how courts reconcile public-safety detention with the presumption of innocence and other constitutional protections.",
    keyFacts: [
      "SJR 5 became State of Texas Proposition 3 for the November 4, 2025 constitutional-amendment election and was among the amendments officially proclaimed adopted by the governor after certification of the vote.",
      "The amendment applies only to listed categories of felony offenses; it is not a blanket rule permitting detention without bail for every criminal charge.",
      "The constitutional text requires judicial process and factual findings before the covered no-bail rule applies.",
      "Pretrial detention occurs before conviction, so coverage should distinguish an accusation, a probable-cause or detention determination, and a final adjudication of guilt.",
    ],
    context: [
      "KTR's law-and-order position favors protecting victims and the public from demonstrably dangerous defendants while preserving due process. The narrow tracker keeps that debate tied to the actual constitutional standard instead of slogans about either 'cash bail' or automatic detention.",
      "This page is intentionally narrower than the general Criminal Justice tracker. It exists because the 2025 constitutional amendment materially changed Texas bail law and creates a distinct body of hearings, findings, implementing statutes, and appellate interpretation to follow.",
    ],
    watchFor: [
      "Implementing statutes and court rules governing hearings under the new constitutional provision",
      "Texas appellate decisions interpreting covered offenses and evidentiary standards",
      "County-level use of no-bail hearings and published detention outcomes",
      "Litigation involving due process, public-safety findings, timing, counsel, or evidentiary procedure",
    ],
    sources: [
      { label: "Texas Legislature Online — SJR 5 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SJ00005F.HTM", primary: true },
      { label: "Texas Legislature Online — SJR 5 enrolled summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=SJR5&LegSess=89R", primary: true },
      { label: "Texas Secretary of State — 2025 amendment ballot order", url: "https://www.sos.state.tx.us/about/newsreleases/2025/062525.shtml", primary: true },
      { label: "Texas Register — Governor proclamation certifying adopted amendments", url: "https://www.sos.state.tx.us/texreg/archive/December52025/The%20Governor/The%20Governor.html", primary: true },
    ],
    related: [
      { label: "Criminal Justice tracker", href: "/policy/criminal-justice", kind: "reference" },
      { label: "The Texas Case for Law, Order, and Consequences", href: "/texas-case/law-order-public-safety", kind: "editorial" },
      { label: "Texas Law Enforcement", href: "/texas-law-enforcement", kind: "reference" },
      { label: "Texas laws", href: "/laws", kind: "law" },
    ],
    keywords: ["Texas bail", "Proposition 3", "SJR 5", "pretrial detention", "violent offense bail", "no bail", "public safety", "Texas Constitution bail"],
  },
];

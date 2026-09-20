import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE5: PolicyTracker[] = [
  {
    slug: "womens-sports",
    shortTitle: "Women's Sports",
    title: "Texas Women's Sports Policy Tracker",
    description: "Track Texas law governing sex-based athletic competition in K-12 schools and public higher education, implementation rules, litigation, and new legislation affecting women's and girls' sports.",
    updated: reviewed,
    quickAnswer: "Texas law regulates school athletics by biological sex in both K-12 and public higher education. HB 25, enacted in 2021, governs interscholastic athletics in public school districts and open-enrollment charter schools, while SB 15, enacted in 2023, governs intercollegiate competition at public institutions of higher education.",
    currentStatus: "Texas has separate statutory frameworks for K-12 and public-college athletics. The continuing policy questions include implementation, interaction with federal law and athletic-association rules, litigation, and whether lawmakers expand, narrow, or otherwise modify the state framework.",
    keyFacts: [
      "HB 25 added Education Code Section 33.0834 for interscholastic athletic competition in school districts and open-enrollment charter schools.",
      "SB 15 added Education Code Section 51.980 for intercollegiate athletic competition at public institutions of higher education.",
      "The K-12 and higher-education statutes are separate laws with different institutional coverage, so claims about one should not automatically be generalized to the other.",
      "Federal statutes, court rulings, and athletic-association rules can affect implementation even when Texas statutory language remains unchanged.",
    ],
    context: [
      "KTR's editorial position favors preserving sex-based athletic categories for women and girls. The factual tracker separately follows the exact scope of Texas law, institutional obligations, litigation, and any federal-state conflicts.",
      "This issue belongs with public education, parental rights, higher-education governance, and election coverage because implementation can involve school districts, universities, statewide officials, courts, and lawmakers.",
    ],
    watchFor: [
      "Texas or federal court rulings involving school athletic eligibility",
      "Changes to federal Title IX rules or guidance affecting Texas institutions",
      "Texas Education Agency or higher-education implementation guidance",
      "Legislation changing biological-sex definitions, enforcement, remedies, or covered institutions",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 25 (87th 3rd Called Session)", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=873&Bill=HB25", primary: true },
      { label: "Texas Legislature Online — SB 15 (88th Legislature)", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=88R&Bill=SB15", primary: true },
      { label: "Texas Education Code", url: "https://statutes.capitol.texas.gov/?link=ED", primary: true },
    ],
    related: [
      { label: "Public Education tracker", href: "/policy/public-education", kind: "reference" },
      { label: "Parental Rights tracker", href: "/policy/parental-rights", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Election Central", href: "/elections", kind: "reference" },
    ],
    keywords: ["women's sports", "girls sports", "SB 15", "HB 25", "biological sex", "Title IX", "Texas athletics", "school sports"],
  },
  {
    slug: "campus-free-speech",
    shortTitle: "Campus Free Speech",
    title: "Texas Campus Free Speech Policy Tracker",
    description: "Track Texas public-university speech law, expressive activities, campus forum rules, protest and disruption policies, statutory amendments, and litigation involving student and faculty expression.",
    updated: reviewed,
    quickAnswer: "Texas Education Code Section 51.9315 establishes statewide protections for expressive activities at public institutions of higher education. The framework originated with SB 18 in 2019 and has since been amended, including changes enacted in 2025. It protects expression while allowing qualifying time, place, and manner rules and other lawful restrictions.",
    currentStatus: "Texas campus-speech law now combines constitutional protections with a detailed state statutory framework. The durable policy question is how universities distinguish protected expression from unlawful conduct, material disruption, threats, harassment, restricted locations, or other activity that may be regulated under state or federal law.",
    keyFacts: [
      "SB 18 in 2019 added statewide statutory protections for expressive activities at Texas public institutions of higher education.",
      "Education Code Section 51.9315 recognizes expressive rights while allowing qualifying restrictions and institutional policies consistent with the statute.",
      "The section was amended again by the 89th Legislature, including SB 2972 effective September 1, 2025.",
      "Free-speech disputes should distinguish protected expression from conduct that is unlawful or materially and substantially disrupts institutional functions.",
    ],
    context: [
      "KTR's editorial position favors robust protection for unpopular political and religious speech and skepticism toward viewpoint discrimination. The factual tracker separately records the statute's actual limits, institutional policies, court decisions, and due-process questions.",
      "Campus free speech intersects with protest rules, student organizations, faculty governance, religious liberty, DEI policy, and public-university administration, making it a useful bridge between education and constitutional-rights coverage.",
    ],
    watchFor: [
      "Implementation of 2025 amendments to Education Code Section 51.9315",
      "University policy changes governing protests, encampments, amplified sound, buildings, or common outdoor areas",
      "Litigation involving viewpoint discrimination, student organizations, faculty speech, or campus discipline",
      "New Texas legislation affecting expressive activities at public colleges and universities",
    ],
    sources: [
      { label: "Texas Education Code — Section 51.9315", url: "https://statutes.capitol.texas.gov/index.aspx?artSec=51.9315&chapter=ED.51&code=ED&tab=1", primary: true },
      { label: "Texas Legislature Online — SB 18 (86th Legislature)", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=86R&Bill=SB18", primary: true },
      { label: "Texas Legislature Online — SB 2972 (89th Legislature)", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SB2972", primary: true },
    ],
    related: [
      { label: "Religious Liberty tracker", href: "/policy/religious-liberty", kind: "reference" },
      { label: "Public Education tracker", href: "/policy/public-education", kind: "reference" },
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["free speech", "campus free speech", "SB 18", "SB 2972", "Section 51.9315", "First Amendment", "Texas universities", "expressive activities"],
  },
  {
    slug: "advanced-nuclear-energy",
    shortTitle: "Advanced Nuclear",
    title: "Texas Advanced Nuclear Energy Policy Tracker",
    description: "Track Texas advanced-nuclear policy, the Texas Advanced Nuclear Energy Office, project development, grants, workforce, federal licensing, grid reliability, and implementation of HB 14.",
    updated: reviewed,
    quickAnswer: "Texas enacted HB 14 in 2025 to support development of the advanced nuclear energy industry. The law created Government Code Chapter 483 and the Texas Advanced Nuclear Energy Office, establishing a state policy framework for advanced reactor projects, industry development, coordination, workforce, and related state support.",
    currentStatus: "HB 14 was signed June 20, 2025 and took effect September 1, 2025. The policy question has moved from whether Texas should create a state nuclear-development framework to how the new office, programs, grants, project pipeline, workforce initiatives, and federal licensing coordination are implemented.",
    keyFacts: [
      "HB 14 became effective September 1, 2025 and created Government Code Chapter 483.",
      "Chapter 483 creates the Texas Advanced Nuclear Energy Office and defines advanced nuclear projects to include specified reactor, fuel-cycle, and supporting technologies.",
      "Federal Nuclear Regulatory Commission licensing remains central to nuclear facility approval even when Texas creates state economic-development or coordination programs.",
      "Advanced nuclear policy intersects with ERCOT reliability, industrial growth, transmission, water, workforce development, fuel supply, project finance, and federal regulation.",
    ],
    context: [
      "KTR's editorial preference is for abundant, reliable energy and evaluating nuclear power on performance, cost, safety, and scalability rather than ideological labels. The factual tracker follows implementation milestones and distinguishes state support from federal nuclear-safety licensing authority.",
      "This page complements the broader Energy & ERCOT tracker by focusing specifically on the new statutory nuclear-development framework rather than duplicating general grid coverage.",
    ],
    watchFor: [
      "Appointments, staffing, rules, programs, and reports from the Texas Advanced Nuclear Energy Office",
      "State grants, incentives, or appropriations for advanced nuclear projects",
      "Announcements involving small modular reactors, microreactors, fuel-cycle facilities, or major nuclear projects in Texas",
      "NRC licensing milestones and grid interconnection or transmission requirements for proposed projects",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 14 (89th Legislature)", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB14", primary: true },
      { label: "HB 14 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00014F.htm", primary: true },
      { label: "Texas Government Code — Chapter 483", url: "https://statutes.capitol.texas.gov/?link=GV", primary: true },
      { label: "U.S. Nuclear Regulatory Commission", url: "https://www.nrc.gov/", primary: true },
    ],
    related: [
      { label: "Energy & ERCOT tracker", href: "/policy/energy-ercot", kind: "reference" },
      { label: "Texas Energy hub", href: "/texas-energy", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "State-Federal Power tracker", href: "/policy/state-federal-power", kind: "reference" },
    ],
    keywords: ["nuclear energy", "advanced nuclear", "HB 14", "small modular reactor", "SMR", "microreactor", "Texas Advanced Nuclear Energy Office", "NRC"],
  },
];

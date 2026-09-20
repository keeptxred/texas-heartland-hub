import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE7: PolicyTracker[] = [
  {
    slug: "e-verify-employment",
    shortTitle: "E-Verify & Employment",
    title: "Texas E-Verify and Employment Verification Policy Tracker",
    description: "Track Texas E-Verify requirements, state-agency hiring rules, employer verification policy, federal I-9 obligations, proposed expansions, and employment-authorization legislation.",
    updated: reviewed,
    quickAnswer: "Texas Government Code Chapter 673 requires state agencies to register and participate in E-Verify for all new employees. That state-agency mandate is not a universal Texas requirement for every private employer; Texas Workforce Commission guidance continues to describe E-Verify generally as an optional I-9 program for employers outside applicable mandates.",
    currentStatus: "Texas has had a state-agency E-Verify mandate since 2015. The continuing policy debate is whether the Legislature should expand verification requirements to additional public entities, contractors, or private employers and how any expansion should interact with federal employment-verification and anti-discrimination rules.",
    keyFacts: [
      "SB 374 of the 84th Legislature created Government Code Chapter 673 and took effect September 1, 2015.",
      "Section 673.002 requires a state agency to register and participate in E-Verify to verify information of all new employees.",
      "Texas Workforce Commission guidance describes E-Verify as an optional I-9 program generally, which means the state-agency mandate should not be misstated as a universal private-employer requirement.",
      "Federal Form I-9 duties apply separately from whether an employer participates in E-Verify, and document requests can implicate federal anti-discrimination rules.",
    ],
    context: [
      "KTR's editorial position favors employment-law enforcement and effective work-authorization verification. The factual tracker keeps that position separate from the exact category of employers covered by current Texas law and from federal rules governing Form I-9 and E-Verify.",
      "This tracker connects immigration and border policy to an employment-specific legal mechanism without treating E-Verify as a substitute for the broader federal immigration system.",
    ],
    watchFor: [
      "Texas bills expanding E-Verify to contractors, political subdivisions, or private employers",
      "Changes to federal E-Verify or Form I-9 requirements",
      "Texas Workforce Commission rules or guidance implementing Chapter 673",
      "Litigation involving verification procedures, discrimination, or federal preemption",
    ],
    sources: [
      { label: "Texas Legislature Online — SB 374 enrolled text", url: "https://capitol.texas.gov/tlodocs/84R/billtext/html/SB00374F.htm", primary: true },
      { label: "Texas Government Code — Chapter 673", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.673.htm", primary: true },
      { label: "Texas Workforce Commission — I-9 Procedures", url: "https://efte.twc.texas.gov/i_9_procedures.html", primary: true },
    ],
    related: [
      { label: "Immigration tracker", href: "/policy/immigration", kind: "reference" },
      { label: "Border Security tracker", href: "/policy/border-security", kind: "reference" },
      { label: "Right-to-Work tracker", href: "/policy/right-to-work", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["E-Verify", "employment verification", "SB 374", "Chapter 673", "I-9", "work authorization", "Texas employers", "immigration employment"],
  },
  {
    slug: "public-sector-labor",
    shortTitle: "Public-Sector Labor",
    title: "Texas Public-Sector Labor and Collective Bargaining Policy Tracker",
    description: "Track Texas public-employee collective bargaining, strike restrictions, police and firefighter exceptions, meet-and-confer systems, grievances, and legislation affecting government employees and taxpayers.",
    updated: reviewed,
    quickAnswer: "Texas Government Code Chapter 617 generally prohibits state and local officials from entering collective-bargaining contracts with labor organizations for public employees and generally prohibits organized public-employee strikes. Texas law also contains specific statutory exceptions and alternative bargaining or meet-and-confer systems for some police and firefighters.",
    currentStatus: "Texas retains a general statutory prohibition on public-sector collective bargaining and strikes, but the legal landscape is not one-size-fits-all. Special Local Government Code frameworks can displace Section 617.002 for covered police or firefighter agreements adopted under those statutes.",
    keyFacts: [
      "Government Code Section 617.002 generally prohibits officials of the state or a political subdivision from entering collective-bargaining contracts with labor organizations regarding public-employee wages, hours, or conditions of employment.",
      "Section 617.003 generally prohibits public employees from striking or engaging in an organized work stoppage against the state or a political subdivision.",
      "Section 617.005 preserves public employees' ability to present grievances individually or through a representative that does not claim a right to strike.",
      "Local Government Code provisions for certain police and firefighters can expressly make Section 617.002 inapplicable to qualifying agreements or actions, so the general ban should not be described as having no exceptions.",
    ],
    context: [
      "KTR's editorial perspective is skeptical of compulsory or expansive public-sector union power because government bargaining affects taxpayers and public services. The factual tracker separately identifies where Texas law permits or prohibits bargaining and where local voters or statutes create special systems.",
      "This page also distinguishes public-sector labor law from Texas's broader right-to-work protections, which address union membership as a condition of employment rather than whether a public employer may collectively bargain.",
    ],
    watchFor: [
      "Texas legislation amending Chapter 617",
      "Local elections or ordinances activating police or firefighter labor frameworks",
      "New meet-and-confer or collective-bargaining agreements under specific statutes",
      "Litigation involving public-employee strikes, representation, grievances, or statutory exceptions",
    ],
    sources: [
      { label: "Texas Government Code — Chapter 617", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.617.htm", primary: true },
      { label: "Texas Local Government Code", url: "https://statutes.capitol.texas.gov/?link=LG", primary: true },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/", primary: true },
    ],
    related: [
      { label: "Right-to-Work tracker", href: "/policy/right-to-work", kind: "reference" },
      { label: "Criminal Justice tracker", href: "/policy/criminal-justice", kind: "reference" },
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["public sector unions", "collective bargaining", "Chapter 617", "public employees", "police union", "firefighter union", "meet and confer", "public employee strike"],
  },
  {
    slug: "occupational-licensing-mobility",
    shortTitle: "Licensing Mobility",
    title: "Texas Occupational Licensing and Reciprocity Policy Tracker",
    description: "Track Texas occupational licensing, TDLR reciprocity agreements, interstate worker mobility, regulatory barriers, licensing reform, and implementation of HB 11.",
    updated: reviewed,
    quickAnswer: "HB 11, effective May 29, 2025, added Occupations Code Subchapter K and directs the Texas Department of Licensing and Regulation to maximize reciprocity agreements for licenses it issues when other states have substantially equivalent requirements. It does not create automatic universal recognition of every out-of-state occupational license.",
    currentStatus: "The Legislature has directed TDLR to pursue more reciprocity and identify state-law barriers to agreements. The next implementation questions are which occupations gain agreements, how TDLR evaluates substantial equivalence, what rules are adopted, and which remaining licensing requirements lawmakers choose to reduce or preserve.",
    keyFacts: [
      "HB 11 became effective immediately on May 29, 2025 and added Subchapter K to Occupations Code Chapter 51.",
      "Section 51.551 directs TDLR to maximize licensing reciprocity agreements, with respect to licenses issued by TDLR, to the extent allowed by law.",
      "Section 51.552 requires procedures for determining whether another state's licensing requirements are substantially equivalent and for entering qualifying reciprocity agreements.",
      "The initial statutory report on reciprocity efforts is due by December 1, 2027, and may recommend legislative reductions in licensing requirements that impede additional agreements.",
    ],
    context: [
      "KTR's editorial preference is for lower unnecessary barriers to work while preserving licensing rules that demonstrably protect public safety or consumers. The tracker therefore measures reform by actual mobility, costs, waiting time, and safety outcomes rather than assuming every license is either necessary or unnecessary.",
      "The 2025 law is narrower than universal-license-recognition proposals because it specifically addresses reciprocity agreements for TDLR-issued licenses and substantial-equivalence review.",
    ],
    watchFor: [
      "TDLR reciprocity agreements and implementing rules",
      "The first statutory reciprocity report due in 2027",
      "Bills reducing, consolidating, or eliminating licensing requirements",
      "Interstate compacts and occupation-specific reciprocity legislation",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 11", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB11", primary: true },
      { label: "HB 11 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00011F.htm", primary: true },
      { label: "Texas Department of Licensing and Regulation", url: "https://www.tdlr.texas.gov/", primary: true },
      { label: "Texas Occupations Code", url: "https://statutes.capitol.texas.gov/?link=OC", primary: true },
    ],
    related: [
      { label: "Right-to-Work tracker", href: "/policy/right-to-work", kind: "reference" },
      { label: "Texas Economy", href: "/texas-economy", kind: "reference" },
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["occupational licensing", "license reciprocity", "HB 11", "TDLR", "worker mobility", "licensing reform", "deregulation", "interstate reciprocity"],
  },
];

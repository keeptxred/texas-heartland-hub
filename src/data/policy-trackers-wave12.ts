import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE12: PolicyTracker[] = [
  {
    slug: "homeschool-autonomy",
    shortTitle: "Homeschool Autonomy",
    title: "Texas Homeschool Autonomy Policy Tracker",
    description: "Track Texas homeschool law, compulsory-attendance exemptions, curriculum requirements, withdrawal procedures, transfers back to public school, TEA guidance, and proposals to regulate or fund home education.",
    updated: reviewed,
    quickAnswer: "Texas permits home schooling as a legal alternative to public school. The Texas Education Agency says it does not regulate, index, monitor, approve, register, or accredit homeschool programs. Under the Texas Supreme Court's Leeper decision and current compulsory-attendance law, a bona fide home-school program must use a written curriculum and include reading, spelling, grammar, mathematics, and a study of good citizenship.",
    currentStatus: "Texas continues to operate a comparatively low-regulation homeschool framework. TEA's current guidance states that parents do not submit curriculum for agency approval and that districts generally may request a written assurance that a student is being home schooled when attendance status is at issue. Transfers into public school can be evaluated for grade placement or credit under district procedures.",
    keyFacts: [
      "TEA does not approve, register, monitor, accredit, or maintain an index of Texas homeschool programs.",
      "The Texas Supreme Court's Leeper decision recognized qualifying home schools as exempt from compulsory attendance to the same extent as private schools.",
      "TEA guidance identifies a bona fide curriculum requirement including reading, spelling, grammar, mathematics, and good citizenship.",
      "A district may seek written assurance that a child is being home schooled, but TEA guidance says parents are not required to appear in person or present curriculum for review simply to withdraw a student for home schooling.",
    ],
    context: [
      "KTR's editorial position favors parental control and broad homeschool autonomy while preserving clear rules against truancy disguised as home schooling. The factual tracker therefore distinguishes legitimate home education from compulsory-attendance enforcement.",
      "Future school-choice funding can create new policy questions without changing the underlying legality of independent home schooling. Coverage should distinguish voluntary participation in a state-funded program from baseline homeschool regulation.",
    ],
    watchFor: [
      "Texas legislation affecting homeschool registration, reporting, curriculum, testing, or compulsory attendance",
      "Rules for homeschool participation in Education Freedom Accounts or other voluntary state programs",
      "Public-school transfer, credit, athletics, extracurricular, and special-education policies affecting homeschool families",
      "Texas court decisions or TEA guidance changing withdrawal or attendance procedures",
    ],
    sources: [
      { label: "Texas Education Agency — Home Schooling", url: "https://tea.texas.gov/families-and-students/finding-school-your-child/home-schooling", primary: true },
      { label: "Texas Education Agency — Home Schools guidance", url: "https://tea.texas.gov/administrator-addressed-taa/taa-letters/home-schools", primary: true },
      { label: "Texas Education Code — Compulsory Attendance", url: "https://statutes.capitol.texas.gov/?link=ED", primary: true },
    ],
    related: [
      { label: "Parental Rights tracker", href: "/policy/parental-rights", kind: "reference" },
      { label: "School Choice tracker", href: "/policy/school-choice", kind: "reference" },
      { label: "Education Freedom Account guide", href: "/civic-tools/education-freedom-account-guide", kind: "tool" },
      { label: "Public Education tracker", href: "/policy/public-education", kind: "reference" },
    ],
    keywords: ["Texas homeschool", "home school", "homeschool law", "Leeper", "compulsory attendance", "homeschool curriculum", "parental rights", "homeschool regulation"],
  },
  {
    slug: "faith-based-child-welfare",
    shortTitle: "Faith-Based Child Welfare",
    title: "Texas Faith-Based Child Welfare and Adoption Provider Policy Tracker",
    description: "Track Texas conscience protections for foster-care, adoption, placement, and other child-welfare providers under Human Resources Code Chapter 45, including limits, referrals, litigation, contracting, and child best-interest rules.",
    updated: reviewed,
    quickAnswer: "Texas Human Resources Code Chapter 45, enacted by HB 3859 and effective September 1, 2017, generally bars governmental entities from taking adverse action against a private child-welfare services provider because the provider declines services that conflict with sincerely held religious beliefs. The law also requires access to alternate providers in specified circumstances and does not authorize race, ethnicity, or national-origin discrimination or deprivation of a child's statutory medical-care rights.",
    currentStatus: "Chapter 45 remains part of Texas law and applies to a broad set of child-welfare services, including foster care, adoption assistance, home studies, family services, and placement-related work. The durable policy dispute is how conscience protections interact with state contracting, equal-access concerns, child best-interest determinations, federal funding conditions, and constitutional law.",
    keyFacts: [
      "HB 3859 added Human Resources Code Chapter 45 and became effective September 1, 2017.",
      "The statute protects qualifying private child-welfare services providers from specified governmental adverse actions tied to sincerely held religious beliefs.",
      "When a protected provider declines a service, the law contains mechanisms involving alternate or secondary providers so the requested child-welfare service remains available.",
      "Chapter 45 expressly does not authorize discrimination based on race, ethnicity, or national origin, does not allow deprivation of specified minor medical-care rights, and does not prevent the state from acting in a child's best interest as managing conservator.",
    ],
    context: [
      "KTR's editorial position favors strong religious-liberty and conscience protections for faith-based providers while keeping child safety and access to legally required services explicit. The factual tracker therefore states both the protection and the statutory limits.",
      "This is broader than adoption alone. Reporting should identify whether a dispute concerns licensing, contracting, foster placement, adoption, referral, medical care, or another child-welfare service because the legal and factual questions can differ.",
    ],
    watchFor: [
      "Texas or federal litigation involving Chapter 45 and government contracting",
      "Federal funding or nondiscrimination rules affecting Texas child-welfare providers",
      "DFPS and community-based-care contracting policies",
      "Legislation changing conscience protections, referral obligations, or child best-interest standards",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 3859 enrolled text", url: "https://capitol.texas.gov/tlodocs/85R/billtext/html/HB03859F.htm", primary: true },
      { label: "Texas Legislature Online — HB 3859 history", url: "https://capitol.texas.gov/billlookup/History.aspx?Bill=HB3859&LegSess=85R", primary: true },
      { label: "Texas Human Resources Code", url: "https://statutes.capitol.texas.gov/?link=HR", primary: true },
      { label: "Texas Department of Family and Protective Services", url: "https://www.dfps.texas.gov/", primary: true },
    ],
    related: [
      { label: "Religious Liberty tracker", href: "/policy/religious-liberty", kind: "reference" },
      { label: "Life & Abortion tracker", href: "/policy/abortion", kind: "reference" },
      { label: "Texas laws", href: "/laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["faith based adoption", "child welfare conscience", "HB 3859", "Human Resources Code 45", "foster care religious liberty", "adoption provider", "child welfare provider"],
  },
  {
    slug: "tanf-work-participation",
    shortTitle: "TANF & Work",
    title: "Texas TANF Work Participation and Choices Policy Tracker",
    description: "Track Texas TANF work-participation policy, the Choices program, Workforce Solutions requirements, employment plans, education and training, good-cause rules, support services, time limits, and welfare-to-work outcomes.",
    updated: reviewed,
    quickAnswer: "Texas administers employment services for many TANF applicants and recipients through the Texas Workforce Commission's Choices program. Participants can be assigned work, job search, education, training, or other employment activities, but the framework includes HHSC exemptions, individualized employment planning, support services, and good-cause protections when barriers prevent participation.",
    currentStatus: "Choices remains Texas's primary TANF employment-and-training system. Applicants generally attend a Workforce Orientation for Applicants unless HHSC exempts them; approved recipients attend an Employment Planning Session and receive a Family Employment Plan. TWC currently describes typical participation standards of at least 30 hours per week for single-parent families and either 35 or 55 hours for two-parent families depending on child-care circumstances, subject to program rules and exceptions.",
    keyFacts: [
      "Choices serves TANF applicants and recipients and is overseen by TWC and local Workforce Development Boards using state and federal funds.",
      "TWC says applicants generally must attend a Workforce Orientation for Applicants unless HHSC determines they are exempt.",
      "After approval, recipients receive an employment-planning process and can participate through employment, job search, on-the-job training, education, vocational training, community service, and other allowable activities.",
      "Support services can include child care, transportation, work-related expenses, and testing or training assistance; TWC also recognizes good-cause situations when participation barriers cannot be removed.",
    ],
    context: [
      "KTR's editorial position favors work, training, and movement toward self-sufficiency for able adults receiving cash assistance. The factual tracker avoids the inaccurate shorthand that every recipient is always subject to an identical work mandate.",
      "Program performance should be judged by employment, earnings, retention, reduced dependency, family stability, and whether support services remove genuine barriers—not merely by sanction counts or enrollment totals.",
    ],
    watchFor: [
      "Changes to Texas TANF State Plan or federal TANF work-participation rules",
      "TWC Choices participation rates, employment outcomes, sanctions, and support-service use",
      "HHSC eligibility and exemption changes affecting applicants and recipients",
      "Legislation linking public assistance to employment, education, training, child support, or other participation conditions",
    ],
    sources: [
      { label: "Texas Workforce Commission — Choices Program", url: "https://www.twc.texas.gov/programs/choices", primary: true },
      { label: "Texas Workforce Commission — Choices Services", url: "https://www.twc.texas.gov/programs/choices/services", primary: true },
      { label: "Texas Health and Human Services — TANF", url: "https://www.hhs.texas.gov/services/financial/cash/tanf-cash-help", primary: true },
    ],
    related: [
      { label: "Career & Technical Education tracker", href: "/policy/career-technical-workforce", kind: "reference" },
      { label: "Texas Economy", href: "/texas-economy", kind: "reference" },
      { label: "Right-to-Work tracker", href: "/policy/right-to-work", kind: "reference" },
      { label: "Texas Workforce Commission", href: "/texas-government/agencies/texas-workforce-commission", kind: "government" },
    ],
    keywords: ["TANF work requirements", "Texas Choices", "welfare to work", "TANF Texas", "work participation", "Workforce Solutions", "Family Employment Plan", "cash assistance work"],
  },
];

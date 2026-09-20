import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE13: PolicyTracker[] = [
  {
    slug: "assisted-suicide",
    shortTitle: "Assisted Suicide",
    title: "Texas Assisted Suicide and End-of-Life Law Policy Tracker",
    description: "Track Texas law on aiding suicide, physician-assisted suicide proposals, end-of-life decision rules, hospice and palliative-care policy, criminal penalties, and related litigation.",
    updated: reviewed,
    quickAnswer: "Texas does not authorize physician-assisted suicide. Penal Code Section 22.08 makes it an offense to intentionally aid or attempt to aid another person in committing or attempting suicide. The offense is ordinarily a Class C misdemeanor but becomes a state jail felony when the conduct causes a suicide or attempted suicide resulting in serious bodily injury.",
    currentStatus: "Aiding suicide remains prohibited under current Texas criminal law. End-of-life care, advance directives, hospice, palliative care, refusal or withdrawal of treatment, and pain management are separate legal and medical questions and should not be described as equivalent to intentionally assisting suicide.",
    keyFacts: [
      "Texas Penal Code Section 22.08 criminalizes intentionally aiding or attempting to aid another person to commit or attempt suicide.",
      "The baseline offense is a Class C misdemeanor; it becomes a state jail felony if the actor's conduct causes suicide or attempted suicide resulting in serious bodily injury.",
      "Texas law separately governs advance directives and medical decision-making, so reporting should distinguish assisted suicide from a patient's lawful treatment decisions or palliative care.",
      "Any proposal to legalize, expand, restrict, or redefine assisted suicide should be tracked as legislation until it actually becomes law.",
    ],
    context: [
      "KTR's editorial position favors protecting vulnerable patients and preserving the legal distinction between intentionally assisting suicide and lawful end-of-life care. The factual tracker anchors that discussion in the precise criminal statute and separate health-care laws.",
      "Coverage should avoid implying that hospice, pain control, a do-not-resuscitate order, or refusal of treatment automatically constitutes assisted suicide; those issues have distinct legal standards.",
    ],
    watchFor: [
      "Bills proposing to legalize or alter criminal liability for assisted suicide",
      "Texas court decisions interpreting Penal Code Section 22.08",
      "Changes to advance-directive, hospice, palliative-care, or end-of-life decision statutes",
      "Federal litigation or constitutional claims affecting state assisted-suicide laws",
    ],
    sources: [
      { label: "Texas Penal Code — Section 22.08", url: "https://statutes.capitol.texas.gov/?artSec=22.01&chapter=PE.22&code=PE&tab=2", primary: true },
      { label: "Texas Health and Safety Code", url: "https://statutes.capitol.texas.gov/?link=HS", primary: true },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/", primary: true },
    ],
    related: [
      { label: "Life & Abortion tracker", href: "/policy/life-abortion", kind: "reference" },
      { label: "Medical Freedom tracker", href: "/policy/medical-freedom", kind: "reference" },
      { label: "Healthcare tracker", href: "/policy/healthcare", kind: "reference" },
      { label: "Texas laws", href: "/laws", kind: "law" },
    ],
    keywords: ["assisted suicide Texas", "physician assisted suicide", "Penal Code 22.08", "end of life", "euthanasia", "hospice", "palliative care"],
  },
  {
    slug: "charter-schools",
    shortTitle: "Charter Schools",
    title: "Texas Charter School Authorization and Expansion Policy Tracker",
    description: "Track Texas open-enrollment charter authorization, expansion amendments, accountability, funding, governance, virtual and hybrid campuses, commissioner decisions, and State Board of Education review.",
    updated: reviewed,
    quickAnswer: "Texas continues to authorize and expand public charter schools through Texas Education Agency processes under Education Code Chapter 12. In 2026 TEA opened Generation 32 charter application cycles and continues to process expansion amendments for additional campuses, grade levels, sites, and enrollment, while charter schools remain subject to state accountability and authorizer oversight.",
    currentStatus: "Charter authorization is active in 2026. TEA's Generation 32 application cycle includes staged completeness review, external review, capacity interviews, proposed commissioner awards, and State Board of Education involvement. Existing open-enrollment charter holders can also seek expansion amendments under separate TEA rules and procedures.",
    keyFacts: [
      "TEA's Division of Charter School Authorizing administers the application process for open-enrollment charter schools under Texas Education Code Chapter 12.",
      "The 2026 Generation 32 cycle includes application, external-review, capacity-interview, commissioner, and State Board of Education stages before final charter decisions.",
      "Existing charter holders can request expansion amendments to add grade levels, campuses, sites, or students to an approved maximum enrollment, subject to TEA rules and required governing-board approval.",
      "Texas charter policy should be evaluated using both access and accountability: student outcomes, financial stewardship, governance, special-program obligations, closures or sanctions, and demand for additional seats all matter.",
    ],
    context: [
      "KTR's editorial position favors parental choice and high-performing alternatives to assigned district schools while maintaining clear accountability for public funds and student outcomes. The factual tracker follows both expansion opportunities and authorizer enforcement.",
      "Charter schools, Education Freedom Accounts, district-campus partnerships, and virtual/hybrid campuses are related but legally distinct policy structures. This page focuses on charter authorization and expansion rather than treating every school-choice program as a charter school.",
    ],
    watchFor: [
      "Generation 32 charter application and award decisions",
      "Expansion amendment approvals, denials, and new-campus openings",
      "Accountability interventions, charter renewals, revocations, closures, and governance actions",
      "Legislation changing charter caps, funding, facilities, admissions, authorizer powers, or virtual/hybrid authority",
    ],
    sources: [
      { label: "Texas Education Agency — Charter School Applicants", url: "https://tea.texas.gov/school-and-district-information/texas-schools-charter-schools/charter-school-applicants", primary: true },
      { label: "Texas Education Agency — Charter School Amendments and Waivers", url: "https://tea.texas.gov/school-and-district-information/texas-schools-charter-schools/charter-school-amendments-and-waivers", primary: true },
      { label: "Texas Education Code", url: "https://statutes.capitol.texas.gov/?link=ED", primary: true },
      { label: "Texas Education Agency", url: "https://tea.texas.gov/", primary: true },
    ],
    related: [
      { label: "School Choice tracker", href: "/policy/school-choice", kind: "reference" },
      { label: "Public Education tracker", href: "/policy/public-education", kind: "reference" },
      { label: "Parental Rights tracker", href: "/policy/parental-rights", kind: "reference" },
      { label: "Education Freedom Account guide", href: "/civic-tools/education-freedom-account-guide", kind: "tool" },
    ],
    keywords: ["Texas charter schools", "charter school application", "Generation 32", "charter expansion", "open enrollment charter", "TEA charter authorizing", "school choice"],
  },
  {
    slug: "consumable-hemp-cannabis",
    shortTitle: "Hemp & Cannabis",
    title: "Texas Consumable Hemp and Cannabis Policy Tracker",
    description: "Track Texas consumable-hemp regulation, THC and cannabinoid rules, licensing, retail restrictions, controlled-substance scheduling, court orders, medical cannabis, and legislation affecting hemp-derived products.",
    updated: reviewed,
    quickAnswer: "Texas did not enact the broad 2025 Senate Bill 3 ban on most consumable-hemp cannabinoids because Governor Greg Abbott vetoed SB 3. Texas nevertheless regulates consumable hemp under Health and Safety Code Chapter 443 and DSHS rules. DSHS adopted updated consumable-hemp rules effective March 31, 2026, and a controlled-substance scheduling action affecting delta-8 THC became effective July 31, 2026.",
    currentStatus: "The 2026 Texas hemp market is governed by existing Chapter 443 law, DSHS licensing and product rules, court orders affecting some products, and controlled-substance scheduling—not by the vetoed 2025 SB 3. DSHS currently states that consumable hemp may contain no more than 0.3 percent delta-9 THC on a dry-weight basis and that only trace amounts of naturally produced delta-8 THC are permissible under the July 2026 scheduling action.",
    keyFacts: [
      "SB 3 passed both chambers in 2025 but was vetoed by Governor Abbott, so its proposed broad prohibition on most cannabinoids did not become law.",
      "DSHS adopted revised Consumable Hemp Program rules effective March 31, 2026 and continues to administer manufacturer and retailer licensing and compliance.",
      "DSHS says the Texas controlled-substance schedule affecting delta-8 THC became effective July 31, 2026 and allows only trace naturally produced amounts under its current guidance.",
      "The Texas Compassionate-Use medical cannabis program is legally distinct from the consumable-hemp framework and should not be conflated with retail hemp-derived cannabinoid products.",
    ],
    context: [
      "Cannabis and hemp policy are active debates within the political right as well as across parties. KTR's factual tracker therefore separates enacted law, agency rules, court orders, vetoed proposals, medical cannabis, and retail-hemp regulation instead of assigning one universal conservative position.",
      "Because DSHS rules, controlled-substance scheduling, and litigation can change faster than statutes, this page should be reviewed more frequently when enforcement guidance or court orders change.",
    ],
    watchFor: [
      "DSHS enforcement and rulemaking under the Consumable Hemp Program",
      "Court rulings affecting smokable hemp, delta-8 THC, or other cannabinoid products",
      "New legislation replacing or revising the vetoed 2025 SB 3 approach",
      "Changes to the Compassionate-Use Program or the legal boundary between medical cannabis and hemp products",
    ],
    sources: [
      { label: "Texas DSHS — Consumable Hemp Program", url: "https://www.dshs.texas.gov/consumable-hemp-program", primary: true },
      { label: "Texas Legislature Online — SB 3 bill summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=SB3&LegSess=89R", primary: true },
      { label: "Office of the Governor — SB 3 veto statement", url: "https://gov.texas.gov/news/post/governor-abbott-vetoes-senate-bill-3-89r", primary: true },
      { label: "Texas Health and Safety Code", url: "https://statutes.capitol.texas.gov/?link=HS", primary: true },
    ],
    related: [
      { label: "Medical Freedom tracker", href: "/policy/medical-freedom", kind: "reference" },
      { label: "Criminal Justice tracker", href: "/policy/criminal-justice", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Texas laws", href: "/laws", kind: "law" },
    ],
    keywords: ["Texas hemp", "consumable hemp", "delta-8", "THC Texas", "SB 3", "cannabis Texas", "Chapter 443", "DSHS hemp", "medical marijuana"],
  },
];

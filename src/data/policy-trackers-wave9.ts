import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE9: PolicyTracker[] = [
  {
    slug: "local-preemption-regulatory-consistency",
    shortTitle: "State-Local Preemption",
    title: "Texas Regulatory Consistency and Local Preemption Policy Tracker",
    description: "Track the Texas Regulatory Consistency Act, municipal and county preemption, state-local authority disputes, business and employment regulation, litigation, and legislative changes to HB 2127.",
    updated: reviewed,
    quickAnswer: "HB 2127, the Texas Regulatory Consistency Act, took effect September 1, 2023. It preempts certain municipal and county regulation in fields occupied by specified Texas codes unless another statute expressly authorizes local action, while preserving listed exceptions and other expressly granted local powers.",
    currentStatus: "Texas continues to use statewide preemption as a tool for regulatory consistency. The durable legal question is not whether local governments have no power, but which subjects the Legislature has occupied or expressly reserved to the state and which local powers remain authorized by statute or the Texas Constitution.",
    keyFacts: [
      "HB 2127 amended multiple codes, including Agriculture, Business & Commerce, Finance, Insurance, Labor, Natural Resources, Occupations, Property, and Local Government law.",
      "The act generally bars municipal or county rules in covered fields when state law occupies the field and no other statute expressly authorizes the local regulation.",
      "The act does not eliminate all local authority; the enrolled text preserves functions such as roads, taxes, powers expressly authorized by statute, specified animal regulation, and other listed exceptions.",
      "Labor Code preemption under the act includes local regulation of private-employer leave, hiring practices, breaks, benefits, scheduling, and other employment terms that exceed or conflict with state or federal law.",
    ],
    context: [
      "KTR's editorial preference favors predictable statewide rules when local regulatory patchworks impose substantial compliance costs. The factual tracker separately records what the Legislature actually preempted, which exceptions survive, and how courts interpret home-rule authority and the act's statutory language.",
      "This tracker is distinct from TREO. TREO reviews state-agency regulation; HB 2127 governs the boundary between state law and municipal or county regulation.",
    ],
    watchFor: [
      "Texas appellate decisions interpreting HB 2127 and home-rule authority",
      "Legislative amendments expanding or narrowing fields of preemption",
      "Municipal and county ordinances challenged under the act",
      "New statutes expressly restoring or granting local authority in covered fields",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 2127 enrolled text", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/HB02127F.HTM", primary: true },
      { label: "Texas Legislature Online — HB 2127 enrolled summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=HB2127&LegSess=88R", primary: true },
      { label: "Texas Legislature Online — HB 2127 history", url: "https://capitol.texas.gov/billlookup/History.aspx?Bill=HB2127&LegSess=88R", primary: true },
    ],
    related: [
      { label: "Regulatory Reform & TREO tracker", href: "/policy/regulatory-reform-treo", kind: "reference" },
      { label: "State-Federal Power tracker", href: "/policy/state-federal-power", kind: "reference" },
      { label: "Public-Sector Labor tracker", href: "/policy/public-sector-labor", kind: "reference" },
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
    ],
    keywords: ["HB 2127", "Texas Regulatory Consistency Act", "local preemption", "home rule", "city regulation", "county regulation", "state preemption", "local employment ordinances"],
  },
  {
    slug: "minor-gender-transition-medical-law",
    shortTitle: "Minor Gender-Transition Medical Law",
    title: "Texas Medical Treatment for Gender Transition in Minors Policy Tracker",
    description: "Track Texas Health and Safety Code Subchapter X, SB 14, statutory exceptions, public-funding restrictions, licensing enforcement, litigation, and later legislation involving specified gender-transition treatments for minors.",
    updated: reviewed,
    quickAnswer: "Texas SB 14 took effect September 1, 2023 and added Health and Safety Code Subchapter X. It prohibits licensed physicians and other covered health-care providers from knowingly providing specified procedures and treatments to certain people younger than 18 for the statutory purposes of gender transition, reassignment, or gender dysphoria, subject to exceptions written into the law.",
    currentStatus: "SB 14 remains part of Texas law. In State v. Loe, the Texas Supreme Court on June 28, 2024 reversed and vacated a trial-court temporary injunction that had blocked enforcement. Coverage should therefore distinguish the statute's current legal status from medical guidance, individual treatment decisions, and later proposals that may or may not have become law.",
    keyFacts: [
      "SB 14 became effective September 1, 2023 and added Health and Safety Code Sections 161.701 through 161.706, along with related Medicaid, CHIP, public-funding, and professional-licensing provisions.",
      "Section 161.702 identifies prohibited surgeries, mastectomy, specified puberty-suppression or hormone prescriptions, and removal of otherwise healthy or non-diseased tissue when performed for purposes defined by the statute.",
      "Section 161.703 contains statutory exceptions; the law should not be summarized as prohibiting every use of the listed drugs or procedures for every minor medical condition.",
      "The Texas Supreme Court's 2024 State v. Loe decision reversed and vacated the temporary injunction against SB 14; the decision did not convert a policy dispute into medical advice and does not eliminate the need to check later statutes or court orders.",
    ],
    context: [
      "KTR's editorial focus can address parental rights, child welfare, and medical-policy concerns, but this tracker is limited to the legal framework: what Texas law prohibits, what it excepts, which agencies enforce it, and what courts have ruled.",
      "Readers seeking personal medical guidance should rely on qualified health professionals; this page is a legal and policy reference, not a treatment recommendation or diagnosis.",
    ],
    watchFor: [
      "Texas Supreme Court or federal-court decisions affecting SB 14",
      "Legislative amendments to Health and Safety Code Subchapter X",
      "Texas Medical Board or HHSC enforcement and implementation guidance",
      "Later laws affecting insurance coverage, definitions, public funding, or professional discipline related to gender-transition care",
    ],
    sources: [
      { label: "Texas Legislature Online — SB 14 enrolled text", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/SB00014F.HTM", primary: true },
      { label: "Texas Legislature Online — SB 14 enrolled summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=SB14&LegSess=88R", primary: true },
      { label: "Texas Legislature Online — SB 14 history", url: "https://capitol.texas.gov/billlookup/History.aspx?Bill=SB14&LegSess=88R", primary: true },
      { label: "Texas Supreme Court — State v. Loe, June 28, 2024", url: "https://txcourts.gov/supreme/orders-opinions/2024/june/june-28-2024/", primary: true },
    ],
    related: [
      { label: "Medical Freedom tracker", href: "/policy/medical-freedom", kind: "reference" },
      { label: "Parental Rights tracker", href: "/policy/parental-rights", kind: "reference" },
      { label: "Healthcare tracker", href: "/policy/healthcare", kind: "reference" },
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
    ],
    keywords: ["SB 14", "gender transition minors", "gender dysphoria law", "Texas Health and Safety Code 161.702", "State v. Loe", "minor medical treatment", "Texas Medical Board"],
  },
];

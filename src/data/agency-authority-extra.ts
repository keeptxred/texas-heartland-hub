import type { AgencyAuthorityProfile } from "@/data/agency-authority";

const reviewed = "2026-08-20";

export const EXTRA_AGENCY_AUTHORITY_PROFILES: AgencyAuthorityProfile[] = [
  {
    slug: "texas-department-insurance",
    name: "Texas Department of Insurance",
    shortName: "TDI",
    entityType: "state-agency",
    reviewed,
    dek: "What the Texas Department of Insurance regulates, how its consumer and workers' compensation roles work, and where insurer, agent, fire-safety and complaint authority begins and ends.",
    quickAnswer: "The Texas Department of Insurance is the state's primary insurance regulator. It licenses insurers and insurance professionals, reviews and enforces insurance requirements, assists consumers, oversees the workers' compensation system through its Division of Workers' Compensation, and houses the State Fire Marshal's Office.",
    authority: "TDI operates under the Texas Insurance Code, Texas Labor Code provisions governing workers' compensation, legislative appropriations and rules adopted within delegated authority. Its jurisdiction depends on the insurance product, entity and statutory program involved, so not every coverage dispute or health-plan question is controlled by the same Texas regulator.",
    responsibilities: [
      "License and regulate insurers, agents and other insurance professionals where Texas law assigns TDI jurisdiction.",
      "Review insurance forms, rates and market conduct under the standards applicable to each line of insurance.",
      "Provide consumer information and complaint assistance for insurance matters within state jurisdiction.",
      "Administer the Texas workers' compensation system through the Division of Workers' Compensation.",
      "Carry out state fire-safety, fire-investigation and related regulatory functions through the State Fire Marshal's Office."
    ],
    notResponsibleFor: [
      "TDI does not regulate every health plan. Some employer-sponsored plans are governed primarily by federal law, and other programs may fall under separate state or federal agencies.",
      "TDI does not decide every private coverage lawsuit. Courts may ultimately determine contractual or legal disputes that cannot be resolved through the agency's administrative processes.",
      "TDI cannot create insurance statutes or appropriate public money; those are legislative functions."
    ],
    accountability: [
      "Texas Legislature, appropriations and statutory oversight.",
      "Commissioner of Insurance, administrative rulemaking and public records required by law.",
      "Judicial review and other legal remedies where Texas law authorizes review of agency action."
    ],
    programs: ["Insurance company and professional licensing", "Consumer protection and complaint assistance", "Insurance regulation within state jurisdiction", "Division of Workers' Compensation", "State Fire Marshal's Office"],
    sources: [
      { label: "Texas Department of Insurance", url: "https://www.tdi.texas.gov/", primary: true },
      { label: "TDI — About the agency", url: "https://www.tdi.texas.gov/general/index.html", primary: true },
      { label: "Texas Insurance Code", url: "https://statutes.capitol.texas.gov/?link=IN", primary: true }
    ],
    related: [
      { label: "Texas Government Agency Directory", href: "/texas-government/agencies" },
      { label: "Texas Laws", href: "/laws" },
      { label: "Texas Economy", href: "/texas-economy" }
    ],
    keywords: ["TDI", "Texas Department of Insurance", "insurance", "home insurance", "auto insurance", "workers compensation", "insurance complaints", "State Fire Marshal"]
  },
  {
    slug: "texas-parks-wildlife",
    name: "Texas Parks and Wildlife Department",
    shortName: "TPWD",
    entityType: "state-agency",
    reviewed,
    dek: "What Texas Parks and Wildlife controls across state parks, hunting, fishing, wildlife, fisheries, boating and conservation—and which environmental or land-use decisions belong elsewhere.",
    quickAnswer: "Texas Parks and Wildlife Department manages and conserves the state's fish, wildlife and many public recreation resources. It operates the state park system, administers hunting and fishing programs, manages inland and coastal fisheries and wildlife programs, supports boating safety and registration functions, and enforces wildlife and outdoor-recreation laws through game wardens.",
    authority: "TPWD carries out duties assigned by the Texas Parks and Wildlife Code, Natural Resources Code provisions, legislative appropriations, commission rules and applicable federal wildlife and fisheries law. The Texas Parks and Wildlife Commission sets policy within that statutory framework while the department administers programs and facilities.",
    responsibilities: [
      "Operate Texas state parks, historic recreational properties and related visitor, camping and reservation systems assigned to the department.",
      "Administer hunting and fishing licenses, seasons, limits and wildlife-management rules within statutory and commission authority.",
      "Manage inland fisheries, coastal fisheries, wildlife populations, habitat conservation, research and restoration programs.",
      "Administer boating safety and boat registration or titling functions assigned by Texas law.",
      "Enforce wildlife, fisheries, boating and park laws through commissioned game wardens and other authorized personnel."
    ],
    notResponsibleFor: [
      "TPWD does not control every Texas environmental permit. TCEQ, the Railroad Commission, General Land Office, federal agencies and local governments have separate jurisdictions.",
      "A hunting or fishing license does not create access to private land; landowner permission and public-access rules remain separate questions.",
      "TPWD does not operate every park or recreation property in Texas. Federal, county, municipal and private sites have different owners and rules."
    ],
    accountability: ["Texas Legislature and appropriations process.", "Texas Parks and Wildlife Commission meetings, rules and public records.", "Federal requirements and cooperative agreements for programs involving federal wildlife, fisheries or boating funds."],
    programs: ["Texas State Parks", "Hunting and fishing licensing and regulation", "Inland and coastal fisheries", "Wildlife management and conservation", "Game wardens and boating safety"],
    sources: [
      { label: "Texas Parks and Wildlife Department", url: "https://tpwd.texas.gov/", primary: true },
      { label: "TPWD — Mission and philosophy", url: "https://tpwd.texas.gov/about/mission-philosophy", primary: true },
      { label: "Texas Parks and Wildlife Code", url: "https://statutes.capitol.texas.gov/?link=PW", primary: true }
    ],
    related: [
      { label: "Texas Government Agency Directory", href: "/texas-government/agencies" },
      { label: "Texas Water", href: "/issues/texas-water-policy" },
      { label: "Texas Laws", href: "/laws" }
    ],
    keywords: ["TPWD", "Texas Parks and Wildlife", "state parks", "hunting", "fishing", "wildlife", "game wardens", "boating", "conservation"]
  },
  {
    slug: "texas-workforce-commission",
    name: "Texas Workforce Commission",
    shortName: "TWC",
    entityType: "state-agency",
    reviewed,
    dek: "What the Texas Workforce Commission administers across unemployment insurance, workforce services, child care, vocational rehabilitation, labor-market data and employer programs.",
    quickAnswer: "The Texas Workforce Commission administers the state's unemployment-insurance program and a broad workforce system serving job seekers, employers and local workforce boards. It also oversees programs involving child care, vocational rehabilitation, labor-market information and other employment services assigned by law.",
    authority: "TWC operates under the Texas Labor Code, federal workforce and unemployment-insurance law, legislative appropriations and rules adopted within delegated authority. Many workforce programs are delivered through local workforce-development boards and contractors, so the commission sets statewide systems and standards while local partners perform many front-line services.",
    responsibilities: [
      "Administer Texas unemployment insurance, including claims, employer tax functions, eligibility determinations and appeals under state and federal law.",
      "Oversee workforce-development programs and the Texas Workforce Solutions network serving job seekers and employers.",
      "Administer subsidized child-care programs connected to the workforce system and early-learning responsibilities assigned by law.",
      "Operate vocational-rehabilitation and disability-employment services assigned to the commission.",
      "Collect and publish Texas labor-market information, employment statistics and workforce research."
    ],
    notResponsibleFor: [
      "TWC does not decide every employment-law dispute. Wage, discrimination, workplace-safety, union and federal labor matters can belong to different state or federal agencies or courts.",
      "Filing an unemployment claim does not guarantee benefits; statutory wage, separation and ongoing-eligibility requirements must be satisfied.",
      "TWC does not directly operate every local workforce center or child-care provider; local boards and contracted providers perform many services within the statewide system."
    ],
    accountability: ["Texas Legislature, appropriations and sunset oversight.", "Federal program requirements for unemployment insurance and federally funded workforce programs.", "Commission rules, appeal decisions, audits, performance reports and public records."],
    programs: ["Unemployment insurance", "Texas Workforce Solutions", "Employer services and workforce training", "Child care and early learning programs", "Vocational rehabilitation and labor-market information"],
    sources: [
      { label: "Texas Workforce Commission", url: "https://www.twc.texas.gov/", primary: true },
      { label: "TWC — Unemployment Benefits", url: "https://www.twc.texas.gov/programs/unemployment-benefits", primary: true },
      { label: "Texas Labor Code", url: "https://statutes.capitol.texas.gov/?link=LA", primary: true }
    ],
    related: [
      { label: "Texas unemployment eligibility guide", href: "/guides/texas-unemployment-benefits-eligibility-law" },
      { label: "Texas unemployment appeals", href: "/guides/texas-unemployment-appeal-law" },
      { label: "Texas Government Agency Directory", href: "/texas-government/agencies" },
      { label: "Texas Economy", href: "/texas-economy" }
    ],
    keywords: ["TWC", "Texas Workforce Commission", "unemployment", "workforce", "jobs", "employers", "child care", "vocational rehabilitation", "labor market"]
  }
];

export function getExtraAgencyAuthorityProfile(slug: string) {
  return EXTRA_AGENCY_AUTHORITY_PROFILES.find((profile) => profile.slug === slug);
}

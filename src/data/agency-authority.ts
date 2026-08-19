export type AgencyAuthoritySource = { label: string; url: string; primary?: boolean };
export type AgencyAuthorityLink = { label: string; href: string };

export type AgencyAuthorityProfile = {
  slug: string;
  name: string;
  shortName: string;
  entityType: "state-agency" | "state-commission" | "grid-operator";
  reviewed: string;
  dek: string;
  quickAnswer: string;
  authority: string;
  responsibilities: string[];
  notResponsibleFor: string[];
  accountability: string[];
  programs: string[];
  sources: AgencyAuthoritySource[];
  related: AgencyAuthorityLink[];
  keywords: string[];
};

const reviewed = "2026-08-19";

export const AGENCY_AUTHORITY_PROFILES: AgencyAuthorityProfile[] = [
  {
    slug: "texas-education-agency",
    name: "Texas Education Agency",
    shortName: "TEA",
    entityType: "state-agency",
    reviewed,
    dek: "What the Texas Education Agency controls, how it relates to local school districts and the State Board of Education, and which education decisions remain with lawmakers or local boards.",
    quickAnswer: "TEA is the state agency that oversees primary and secondary public education in Texas. Under the commissioner of education, it administers state and federal school funding, statewide assessments and accountability, public-school data systems, and other duties assigned by education law.",
    authority: "TEA operates under the Texas Education Code, legislative appropriations, federal education law, and rules adopted by the commissioner and other authorized education bodies. It works alongside—but is not the same institution as—the elected State Board of Education or locally elected school boards.",
    responsibilities: [
      "Administer distribution of state and federal funding to public schools.",
      "Administer statewide student assessment and accountability systems.",
      "Collect and publish public-school data and monitor compliance with state and federal requirements.",
      "Support the State Board of Education in curriculum and instructional-material responsibilities assigned by law.",
      "Perform administrative functions for the State Board for Educator Certification.",
    ],
    notResponsibleFor: [
      "TEA does not itself pass the Texas Education Code; the Legislature does.",
      "TEA does not replace locally elected school boards in every district-level decision.",
      "TEA and the State Board of Education have separate legal roles even though both participate in statewide education governance.",
    ],
    accountability: ["Texas Legislature and legislative oversight", "Commissioner of Education and applicable state law", "Public rules, accountability reports, school-finance records and agency data"],
    programs: ["Foundation School Program administration", "State assessment and accountability", "Educator certification support", "Public Education Information Management System and school data"],
    sources: [
      { label: "Texas Education Agency — Who We Are", url: "https://tea.texas.gov/about-tea/who-we-are", primary: true },
      { label: "Texas Education Agency — About TEA", url: "https://tea.texas.gov/about-tea/about-tea", primary: true },
      { label: "Texas Education Code", url: "https://statutes.capitol.texas.gov/?link=ED", primary: true },
    ],
    related: [
      { label: "Public Education Policy Tracker", href: "/policy/public-education" },
      { label: "School Choice Policy Tracker", href: "/policy/school-choice" },
      { label: "Parental Rights in Education Law", href: "/laws/topic/parental-rights-education" },
      { label: "Texas Legislature", href: "/texas-legislature" },
    ],
    keywords: ["TEA", "Texas Education Agency", "public school", "school funding", "accountability", "STAAR", "education", "school district", "curriculum"],
  },
  {
    slug: "texas-department-public-safety",
    name: "Texas Department of Public Safety",
    shortName: "DPS",
    entityType: "state-agency",
    reviewed,
    dek: "What Texas DPS does across law enforcement, driver licensing, criminal records, border operations, highway safety, emergency support, and state public-safety systems.",
    quickAnswer: "DPS is Texas' statewide public-safety department. Its responsibilities include state law-enforcement capabilities, highway patrol and safety functions, driver licensing and identification, criminal-history and information systems, regulatory licensing, and support for local law enforcement.",
    authority: "DPS carries out duties assigned by Texas statutes and legislative appropriations. Its public-safety role spans statewide law-enforcement capabilities, criminal-justice information systems, licensing and regulatory functions, and specialized support that local agencies may not maintain independently.",
    responsibilities: [
      "Statewide law-enforcement and intelligence capabilities, including Texas Highway Patrol and specialized investigations.",
      "Driver-license and identification-card administration.",
      "Criminal-history, sex-offender, fingerprint and other criminal-justice information systems.",
      "Handgun licensing and other licensing or regulatory duties specifically assigned by law.",
      "Border-related state public-safety operations and assistance to local law-enforcement partners when authorized.",
    ],
    notResponsibleFor: [
      "DPS is not every Texas police department; cities, counties, school districts and other agencies maintain separate law-enforcement authority.",
      "DPS does not set immigration admission or removal policy, which is primarily federal.",
      "Vehicle title and registration functions belong primarily to TxDMV rather than DPS.",
    ],
    accountability: ["Texas Legislature and appropriations process", "Governor and Public Safety Commission structure established by law", "Public records, crime data, licensing rules and program reports"],
    programs: ["Texas Highway Patrol", "Driver License Division", "Texas Rangers and criminal investigations", "Crime records and criminal-justice information systems", "Border-security operations"],
    sources: [
      { label: "Texas DPS — Responsibilities", url: "https://www.dps.texas.gov/section/about-dps/dps-responsibilities", primary: true },
      { label: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/", primary: true },
    ],
    related: [
      { label: "Border Security Policy Tracker", href: "/policy/border-security" },
      { label: "Criminal Justice Policy Tracker", href: "/policy/criminal-justice" },
      { label: "Texas Law Enforcement", href: "/texas-law-enforcement" },
      { label: "Gun & Carry Law", href: "/laws/topic/gun-carry-law" },
    ],
    keywords: ["DPS", "Texas Department of Public Safety", "driver license", "highway patrol", "Texas Rangers", "border security", "crime records", "handgun license", "public safety"],
  },
  {
    slug: "public-utility-commission",
    name: "Public Utility Commission of Texas",
    shortName: "PUCT",
    entityType: "state-commission",
    reviewed,
    dek: "What the Texas Public Utility Commission regulates, how it oversees ERCOT, and where electric, telecommunications, water, and sewer utility authority begins and ends.",
    quickAnswer: "The PUCT regulates major parts of Texas electric, telecommunications, and retail water and sewer utility service, implements utility legislation, handles regulatory proceedings, and provides customer assistance. It also oversees ERCOT under Texas law.",
    authority: "The Legislature defines PUCT jurisdiction through statutes and appropriations. The commission adopts and enforces utility rules, conducts regulatory proceedings, oversees areas of the electric market and ERCOT, and handles specified water, sewer and telecommunications matters.",
    responsibilities: [
      "Regulate electric utilities and market participants where state law assigns PUCT jurisdiction.",
      "Oversee ERCOT and major electric-market rules within the statutory framework.",
      "Regulate specified telecommunications and retail water and sewer utility matters.",
      "Implement utility legislation through rules and contested proceedings.",
      "Provide consumer information and assistance with utility complaints within commission jurisdiction.",
    ],
    notResponsibleFor: [
      "PUCT does not operate the ERCOT grid itself; ERCOT is the independent system operator.",
      "PUCT does not regulate every municipal or cooperative utility decision in the same way as investor-owned utilities.",
      "TCEQ retains separate environmental and certain water-district responsibilities.",
    ],
    accountability: ["Texas Legislature", "Commissioners appointed under state law", "Open meetings, rulemakings, dockets, orders and judicial review"],
    programs: ["Electric utility regulation", "ERCOT oversight", "Consumer complaint assistance", "Telecommunications regulation", "Retail water and sewer utility regulation"],
    sources: [
      { label: "PUCT — Proposed Rule Changes / What We Do", url: "https://www.puc.texas.gov/agency/rulesnlaws/language/Default.aspx", primary: true },
      { label: "PUCT — Compact with Texans", url: "https://www.puc.texas.gov/agency/about/policies/compact/", primary: true },
    ],
    related: [
      { label: "Energy & ERCOT Policy Tracker", href: "/policy/energy-ercot" },
      { label: "ERCOT Authority Profile", href: "/texas-government/agencies/ercot" },
      { label: "Texas Energy", href: "/texas-energy" },
      { label: "Administrative Rulemaking Law", href: "/laws/topic/administrative-rulemaking" },
    ],
    keywords: ["PUC", "PUCT", "Public Utility Commission", "utility", "electric market", "ERCOT oversight", "electricity", "water utility", "telecommunications"],
  },
  {
    slug: "ercot",
    name: "Electric Reliability Council of Texas",
    shortName: "ERCOT",
    entityType: "grid-operator",
    reviewed,
    dek: "What ERCOT actually does, what it does not do, and how the Texas grid operator fits under PUCT and legislative oversight.",
    quickAnswer: "ERCOT is the independent system operator for the electric grid serving most of Texas. It maintains system reliability, facilitates wholesale and retail electric markets, and ensures open transmission access; it is not a state agency and does not itself own the power plants or transmission system it coordinates.",
    authority: "ERCOT is a membership-based nonprofit corporation operating under Texas law and PUCT oversight. Its protocols and market rules operate inside a statutory and regulatory structure shaped by the Legislature and PUCT.",
    responsibilities: [
      "Maintain reliability of the ERCOT electric system in real time.",
      "Schedule and coordinate power on the ERCOT transmission grid.",
      "Facilitate the competitive wholesale electricity market.",
      "Facilitate retail switching in competitive-choice areas.",
      "Provide open access to transmission and administer market settlements and grid information.",
    ],
    notResponsibleFor: [
      "ERCOT does not own the generators or transmission lines it coordinates.",
      "ERCOT does not set Texas energy statutes; the Legislature does.",
      "ERCOT is not the regulator of the electric market; PUCT is the principal state regulator.",
    ],
    accountability: ["Public Utility Commission of Texas oversight", "Texas Legislature", "ERCOT board, protocols, stakeholder processes and public grid/market reports"],
    programs: ["Grid operations and reliability", "Wholesale market settlement", "Retail switching", "Transmission access", "Grid-condition and market data"],
    sources: [
      { label: "ERCOT — About", url: "https://www.ercot.com/about", primary: true },
      { label: "ERCOT — Company Profile", url: "https://www.ercot.com/about/profile", primary: true },
    ],
    related: [
      { label: "Energy & ERCOT Policy Tracker", href: "/policy/energy-ercot" },
      { label: "Public Utility Commission", href: "/texas-government/agencies/public-utility-commission" },
      { label: "Texas Energy Data", href: "/data/energy-ercot" },
      { label: "Texas Energy", href: "/texas-energy" },
    ],
    keywords: ["ERCOT", "grid", "power grid", "electricity", "wholesale market", "transmission", "reliability", "power demand"],
  },
  {
    slug: "texas-department-transportation",
    name: "Texas Department of Transportation",
    shortName: "TxDOT",
    entityType: "state-agency",
    reviewed,
    dek: "What TxDOT plans, builds, operates and maintains, how transportation funding flows, and which vehicle or local-road functions belong elsewhere.",
    quickAnswer: "TxDOT is the state's transportation department. Its work centers on planning, designing, building, operating and maintaining the state transportation system, with safety, project delivery, innovation and stewardship as core agency priorities.",
    authority: "TxDOT carries out transportation duties assigned by the Texas Transportation Code, federal transportation law, legislative appropriations and Texas Transportation Commission policy. It works with metropolitan planning organizations, local governments, transit providers and federal agencies.",
    responsibilities: [
      "Plan, design, construct, operate and maintain the state highway system.",
      "Administer state and federal transportation funding and major capital programs.",
      "Coordinate with metropolitan planning organizations and local governments.",
      "Support public transportation, aviation, rail, ports and other transportation programs assigned by law.",
      "Operate traffic-safety, mobility and transportation-system-management programs.",
    ],
    notResponsibleFor: [
      "TxDOT is not TxDMV; vehicle titles and registrations are primarily TxDMV functions.",
      "Cities and counties own and maintain many local roads outside the state highway system.",
      "Local transit agencies operate many transit services with separate governance structures.",
    ],
    accountability: ["Texas Legislature and transportation appropriations", "Texas Transportation Commission", "Federal transportation requirements and public project/planning processes"],
    programs: ["State highway construction and maintenance", "Transportation planning", "Traffic operations and safety", "Aviation, rail, transit and port programs", "Project development and public involvement"],
    sources: [
      { label: "TxDOT — Mission, Vision and Priorities", url: "https://www.txdot.gov/about/leadership/mission.html", primary: true },
      { label: "TxDOT — About", url: "https://www.txdot.gov/about.html", primary: true },
    ],
    related: [
      { label: "Transportation Policy Tracker", href: "/policy/transportation" },
      { label: "Texas Legislature", href: "/texas-legislature" },
      { label: "Texas Bills", href: "/bills" },
    ],
    keywords: ["TxDOT", "Texas Department of Transportation", "highway", "roads", "transportation", "infrastructure", "traffic", "transit", "rail"],
  },
  {
    slug: "texas-commission-environmental-quality",
    name: "Texas Commission on Environmental Quality",
    shortName: "TCEQ",
    entityType: "state-commission",
    reviewed,
    dek: "What TCEQ regulates across air, water, waste, permits and enforcement, and how environmental authority is divided among Texas agencies and federal regulators.",
    quickAnswer: "TCEQ is Texas' environmental agency. It administers major air, water and waste permitting and regulatory programs, monitors compliance, conducts investigations, and enforces environmental laws within its jurisdiction.",
    authority: "TCEQ operates under state environmental statutes, federal delegated programs, legislative appropriations and commission rules. Three commissioners establish overall policy and decide specified contested matters; an executive director manages day-to-day operations and many uncontested actions.",
    responsibilities: [
      "Review and issue many air, water-quality, waste and underground-injection permits.",
      "Monitor environmental conditions and regulated entities for compliance.",
      "Investigate complaints and conduct enforcement when environmental requirements are violated.",
      "Administer state and federally delegated environmental programs within agency jurisdiction.",
      "Provide public participation processes for affected permitting and rulemaking matters.",
    ],
    notResponsibleFor: [
      "TCEQ does not control every natural-resource issue; RRC, TWDB, GLO, TPWD and federal agencies have separate roles.",
      "TCEQ is not the primary regulator of oil and gas production, which is principally under RRC jurisdiction.",
      "TCEQ permitting does not replace local land-use authority where local government law applies.",
    ],
    accountability: ["Texas Legislature", "Governor-appointed commissioners", "Public permitting records, enforcement records, rulemaking and judicial review"],
    programs: ["Air quality and permitting", "Water quality", "Waste management", "Environmental enforcement", "Dam safety and watermaster functions assigned to the agency"],
    sources: [
      { label: "TCEQ — About Us", url: "https://www.tceq.texas.gov/agency/about-the-tceq", primary: true },
      { label: "TCEQ — Mission and Philosophy", url: "https://www.tceq.texas.gov/agency/mission.html", primary: true },
      { label: "TCEQ — Compliance and Enforcement", url: "https://www.tceq.texas.gov/compliance", primary: true },
    ],
    related: [
      { label: "Water Policy Tracker", href: "/policy/water" },
      { label: "Texas Water Data", href: "/data/water" },
      { label: "Administrative Rulemaking Law", href: "/laws/topic/administrative-rulemaking" },
    ],
    keywords: ["TCEQ", "Texas Commission on Environmental Quality", "environment", "air permit", "water quality", "waste", "pollution", "environmental permit", "enforcement"],
  },
  {
    slug: "health-human-services-commission",
    name: "Texas Health and Human Services Commission",
    shortName: "HHSC",
    entityType: "state-agency",
    reviewed,
    dek: "What HHSC administers across Medicaid, health and human-services programs, regulation and benefits, and how its authority relates to other Texas health agencies.",
    quickAnswer: "HHSC is the executive-branch agency charged with administration and oversight of major Texas health and human-services programs, including the state's Medicaid program and a broad range of benefits, regulatory, care and support functions assigned by law.",
    authority: "HHSC is established in Texas Government Code Chapter 531 and operates under state and federal health-program law, legislative appropriations, administrative rules and federal program requirements. Some functions are carried out through other agencies in the Texas Health and Human Services system.",
    responsibilities: [
      "Administer and oversee the Texas Medicaid program, including managed-care structures.",
      "Administer major health and human-services benefits and support programs assigned by law.",
      "Regulate specified health-care, long-term-care and child-care providers and facilities through assigned divisions.",
      "Manage major state and federal health-services contracts, eligibility systems and program operations.",
      "Coordinate parts of the broader Texas Health and Human Services system.",
    ],
    notResponsibleFor: [
      "HHSC is not the Legislature and cannot independently create benefit entitlements outside legal authority and appropriations.",
      "The Department of State Health Services and Department of Family and Protective Services have separate statutory functions.",
      "Federal Medicaid and other federal program rules constrain state implementation choices.",
    ],
    accountability: ["Texas Legislature and appropriations", "Federal oversight for Medicaid and federally funded programs", "Administrative rules, audits, program data, contracts and public records"],
    programs: ["Texas Medicaid and managed care", "Eligibility and benefits administration", "Long-term care and disability services", "Provider and facility regulation assigned to HHSC", "Health and human-services contracting"],
    sources: [
      { label: "Texas Government Code — Chapter 531", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.531.htm", primary: true },
      { label: "Texas HHSC", url: "https://www.hhs.texas.gov/", primary: true },
      { label: "HHSC Medicaid program definition", url: "https://fhb.hhs.texas.gov/handbooks/starplus-handbook/sph-glossary", primary: true },
    ],
    related: [
      { label: "Healthcare Policy Tracker", href: "/policy/healthcare" },
      { label: "State Budget Policy Tracker", href: "/policy/state-budget" },
      { label: "Texas State Budget Data", href: "/data/state-budget" },
    ],
    keywords: ["HHSC", "Health and Human Services Commission", "Medicaid", "benefits", "healthcare", "long term care", "human services", "managed care"],
  },
  {
    slug: "railroad-commission",
    name: "Railroad Commission of Texas",
    shortName: "RRC",
    entityType: "state-commission",
    reviewed,
    dek: "What the Railroad Commission actually regulates today—oil, natural gas, pipelines, gas utilities and mining—and why the agency no longer regulates railroads.",
    quickAnswer: "Despite its name, the Railroad Commission no longer regulates railroads. RRC is the primary Texas regulator for oil and natural gas production, pipeline transporters, natural-gas and hazardous-liquid pipelines, natural-gas utilities, LP gas, critical natural-gas infrastructure, and coal and uranium surface mining.",
    authority: "RRC exercises statutory responsibilities under Texas law and specified delegated federal environmental and pipeline-safety programs. Its three commissioners are elected statewide and the commission adopts and enforces rules within its legal jurisdiction.",
    responsibilities: [
      "Regulate oil and natural-gas exploration and production under Texas law.",
      "Regulate pipeline transporters and natural-gas and hazardous-liquid pipeline safety within assigned jurisdiction.",
      "Regulate natural-gas utilities and LP-gas activities where state law assigns authority.",
      "Oversee critical natural-gas infrastructure functions assigned after grid-reliability reforms.",
      "Regulate coal and uranium surface mining and reclamation under state and delegated federal law.",
    ],
    notResponsibleFor: [
      "RRC no longer regulates railroads; remaining rail functions were transferred to other agencies, including TxDOT.",
      "RRC does not regulate electricity markets; PUCT and ERCOT have different roles.",
      "RRC does not generally decide private royalty disputes, lease terms or pipeline easement compensation.",
    ],
    accountability: ["Three statewide elected commissioners", "Texas Legislature", "Public rules, hearings, permits, enforcement data and judicial review"],
    programs: ["Oil and gas regulation", "Pipeline safety", "Natural gas utilities", "LP-gas regulation", "Surface mining and reclamation"],
    sources: [
      { label: "Railroad Commission — About Us", url: "https://www.rrc.texas.gov/about-us", primary: true },
      { label: "RRC — Authority and Jurisdiction", url: "https://www.rrc.texas.gov/about-us/faqs/rrc-authority-and-jurisdiction/", primary: true },
      { label: "RRC — What, No Railroads?", url: "https://www.rrc.texas.gov/about-us/faqs/railroads/", primary: true },
    ],
    related: [
      { label: "Energy & ERCOT Policy Tracker", href: "/policy/energy-ercot" },
      { label: "Texas Energy", href: "/texas-energy" },
      { label: "Texas Energy Data", href: "/data/energy-ercot" },
    ],
    keywords: ["Railroad Commission", "RRC", "oil", "natural gas", "pipeline", "LP gas", "energy", "drilling", "mining"],
  },
  {
    slug: "texas-water-development-board",
    name: "Texas Water Development Board",
    shortName: "TWDB",
    entityType: "state-agency",
    reviewed,
    dek: "What TWDB does for Texas water planning, flood planning, water data and infrastructure finance—and how that differs from TCEQ regulation and local water management.",
    quickAnswer: "TWDB is Texas' primary water-planning and financing agency. Its core responsibilities are collecting water data, supporting regional and statewide water and flood planning, and administering financing programs for water supply, wastewater, flood control and conservation projects.",
    authority: "TWDB operates under Texas water statutes, constitutional financing authority, legislative appropriations and state planning requirements. A three-member board appointed by the governor approves financing and major planning actions assigned to the board.",
    responsibilities: [
      "Collect, analyze and publish groundwater, surface-water, drought, flood and other water-resource data.",
      "Support regional water plans and assemble the State Water Plan.",
      "Support regional flood plans and assemble the State Flood Plan.",
      "Administer financing and grant programs for water supply, wastewater, flood and conservation projects.",
      "Support groundwater modeling, water conservation, alternative supplies and statewide geographic-information resources.",
    ],
    notResponsibleFor: [
      "TWDB is primarily a planning, data and financing agency—not the main environmental permitting regulator.",
      "TCEQ has separate water-quality, permitting, district and enforcement authority.",
      "Groundwater conservation districts, cities, river authorities and utilities retain separate local or regional responsibilities.",
    ],
    accountability: ["Texas Legislature and appropriations", "Governor-appointed board", "State and regional planning processes, financing records and published water data"],
    programs: ["State Water Plan", "State Flood Plan", "Water and flood infrastructure financing", "Groundwater and surface-water data", "Water conservation and alternative-water-supply planning"],
    sources: [
      { label: "TWDB — About", url: "https://www.twdb.texas.gov/about/", primary: true },
      { label: "TWDB — Compact with Texans", url: "https://www.twdb.texas.gov/home/compact_texan.asp", primary: true },
    ],
    related: [
      { label: "Water Policy Tracker", href: "/policy/water" },
      { label: "Texas Water Data", href: "/data/water" },
      { label: "TCEQ Authority Profile", href: "/texas-government/agencies/texas-commission-environmental-quality" },
    ],
    keywords: ["TWDB", "Texas Water Development Board", "water plan", "flood plan", "water financing", "groundwater", "drought", "water supply", "flood"],
  },
];

export function getAgencyAuthorityProfile(slug: string) {
  return AGENCY_AUTHORITY_PROFILES.find((profile) => profile.slug === slug);
}

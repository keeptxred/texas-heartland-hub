export type CornerstoneGuideSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type CornerstoneGuide = {
  slug: string;
  title: string;
  dek: string;
  updated: string;
  pillarLabel: string;
  pillarHref: string;
  guideLabel?: string;
  keyTakeaways: string[];
  intro: string[];
  sections: CornerstoneGuideSection[];
  faq: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  related: { label: string; href: string }[];
};

export const CORNERSTONE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-agriculture-rural-guide": {
    slug: "texas-agriculture-rural-guide",
    title: "Texas Agriculture & Rural Texas: The Essential Guide",
    dek: "A practical guide to the agencies, policies, water and land issues, financing programs, rural infrastructure, and public decisions that shape farming and ranching across Texas.",
    updated: "2026-08-09",
    pillarLabel: "Texas Agriculture & Rural Texas",
    pillarHref: "/texas-agriculture",
    keyTakeaways: [
      "Texas agriculture is shaped by more than commodity prices: water, land, transportation, labor, taxes, regulation, and disaster policy all affect producers and rural communities.",
      "The Texas Department of Agriculture is a major state touchpoint for producer programs, consumer protection, rural development, grants, marketing, and agricultural finance.",
      "Water availability and drought resilience are long-term policy questions for farms, ranches, and rural towns, not just weather stories.",
      "Financing and grant programs change over time, so producers should verify current eligibility and deadlines directly with the administering agency before relying on a program.",
      "Keep TX Red treats agriculture and rural Texas as a standing public-policy beat rather than folding every story into generic business coverage.",
    ],
    intro: [
      "Texas agriculture is both an industry and a way of life, but the public decisions that affect it reach far beyond the farm gate. Water law, drought response, transportation, property taxes, rural health care, broadband, agricultural finance, pest and disease control, market access, land use, and state regulation can determine whether a producer expands, holds steady, or exits a business entirely.",
      "This guide is designed as a map of that system. It focuses on the institutions and policy levers that Texas farmers, ranchers, rural business owners, landowners, and voters are most likely to encounter. It does not replace legal, tax, lending, or agricultural advice; instead, it explains where decisions are made and where to verify the current rules.",
    ],
    sections: [
      {
        heading: "What the Texas Department of Agriculture does",
        paragraphs: [
          "The Texas Department of Agriculture is the state's central agricultural agency, but its responsibilities are broader than promoting farms and ranches. The department describes work that includes consumer protection, pesticide regulation, organic certification, crop and livestock protection, market development, agricultural finance, rural community programs, nutrition programs, and other services tied to the food and agricultural economy.",
          "For producers, that means TDA can appear in very different parts of a business: financing, grants, inspections, marketing, rural development, disaster response, or regulatory compliance. The correct starting point depends on the issue, so producers should use the department's current program pages rather than relying on an old checklist or a third-party summary.",
        ],
      },
      {
        heading: "Agricultural finance and producer expansion",
        paragraphs: [
          "Access to capital is one of the recurring policy issues in agriculture because land, equipment, livestock, storage, irrigation, and infrastructure can require substantial upfront investment. The Texas Agricultural Finance Authority administers programs intended to support eligible agricultural operations and agriculture-related businesses.",
          "One example is the Agricultural Loan Guarantee Program, which is structured around state-backed loan guarantees rather than a direct state loan. Program limits, funding availability, lender requirements, and eligibility can change, so a producer considering expansion should verify the current program terms with TDA and a participating lender before making a financing decision.",
        ],
      },
      {
        heading: "Grants are useful, but they are not permanent entitlements",
        paragraphs: [
          "Texas periodically offers grant programs for producers, rural facilities, specialty crops, disaster relief, infrastructure, and other priorities. Those opportunities can be significant, but they are often competitive, time-limited, reimbursement-based, or dependent on legislative appropriations.",
          "That is why Keep TX Red treats a grant announcement as a current event rather than permanent evergreen advice. The long-term lesson is to know the administering agency and the official grants page. When a program opens, applicants should verify eligibility, deadlines, matching requirements, reimbursable costs, reporting duties, and whether funding is actually available in the current cycle.",
        ],
      },
      {
        heading: "Water is an agricultural policy issue",
        paragraphs: [
          "Drought and rainfall matter to agriculture, but so do the laws and institutions governing water. Surface-water rights, groundwater districts, aquifer conditions, municipal demand, reservoir planning, irrigation efficiency, and conservation programs can affect both production and land value.",
          "For rural communities, water policy also intersects with drinking-water systems, fire protection, economic development, and the ability to support new employers or housing. A statewide water debate can therefore have very different consequences in the Panhandle, South Texas, the Hill Country, the Gulf Coast, and the major agricultural regions of West and Central Texas.",
        ],
      },
      {
        heading: "Rural infrastructure is part of the farm economy",
        paragraphs: [
          "Agricultural productivity depends on roads, bridges, electric service, communications, processing capacity, storage, health care access, emergency services, and freight connections. A producer may be highly efficient on the farm and still face higher costs because a rural community lacks infrastructure or because a critical road, bridge, utility, or service network is inadequate.",
          "The Texas Department of Agriculture also administers rural-development programs, including programs that support smaller communities and infrastructure. Those programs matter because the health of an agricultural business is connected to the health of the town, county, school district, workforce, and service network around it.",
        ],
      },
      {
        heading: "Land, taxes, and the cost of staying in production",
        paragraphs: [
          "Texas land policy affects agriculture through appraisal rules, property taxes, development pressure, easements, eminent domain, transmission projects, pipelines, roads, and changing land uses around fast-growing metros. For many operators, land is both the productive asset and the largest store of family wealth.",
          "Agricultural appraisal rules and other tax provisions can be valuable, but they carry specific eligibility and use requirements. Landowners should verify county appraisal records and current Texas law before assuming a parcel qualifies for a particular treatment or that a future change in use will have no tax consequence.",
        ],
      },
      {
        heading: "Pests, disease, and biosecurity can become statewide policy issues quickly",
        paragraphs: [
          "Livestock disease, invasive pests, plant disease, and biosecurity threats can move an agricultural issue from a local concern to a statewide emergency. The response may involve TDA, Texas A&M AgriLife, federal agencies, border authorities, veterinarians, producers, and industry groups.",
          "For readers, the key is to distinguish confirmed agency guidance from rumor. During an emerging threat, Keep TX Red will prioritize official detection notices, quarantine or movement rules, producer guidance, and legislative or funding responses over unverified social-media claims.",
        ],
      },
      {
        heading: "How Keep TX Red will cover agriculture and rural Texas",
        bullets: [
          "State legislation affecting farms, ranches, landowners, water, agricultural taxes, and rural businesses.",
          "Texas Department of Agriculture actions, rules, grants, finance programs, and emergency notices.",
          "Drought, water availability, infrastructure, and disaster policy with a clear rural or producer impact.",
          "Livestock, crop, pest, disease, trade, and supply-chain developments when they materially affect Texas producers.",
          "Rural economic-development, health-care, broadband, transportation, and public-safety issues where state policy is a major factor.",
        ],
      },
    ],
    faq: [
      { q: "What state agency is responsible for agriculture in Texas?", a: "The Texas Department of Agriculture is the primary state agricultural agency. Its responsibilities include agricultural programs, consumer protection, market development, rural development, finance programs, and other functions. Specific issues may also involve other state, local, or federal agencies." },
      { q: "Does Texas offer financing programs for farmers and ranchers?", a: "Texas administers agricultural finance programs through the Texas Agricultural Finance Authority. Program availability, loan limits, lender participation, eligibility, and funding can change, so applicants should verify current terms directly with TDA." },
      { q: "Where should a producer check for current Texas agriculture grants?", a: "Use the Texas Department of Agriculture's official grants and services pages. Grant windows, appropriations, eligibility, matching requirements, and deadlines change, so an old article should never be treated as a current application notice." },
      { q: "Why is water part of an agriculture content pillar?", a: "Water availability, groundwater management, surface-water rights, drought, irrigation, and rural utility infrastructure directly affect agricultural production, land values, and the viability of rural communities." },
    ],
    sources: [
      { label: "Texas Department of Agriculture — What does TDA do?", url: "https://texasagriculture.gov/About/What-does-TDA-do" },
      { label: "Texas Department of Agriculture — Agricultural Loan Guarantee Program", url: "https://texasagriculture.gov/Grants-Services/Rural-Economic-Development/Texas-Agricultural-Finance-Authority/Agricultural-Loan-Guarantee-Program" },
      { label: "Texas Department of Agriculture — Rural Community Development", url: "https://texasagriculture.gov/Grants-Services/Rural-Economic-Development/RuralCommunityDevelopment" },
      { label: "Texas Department of Agriculture — Open Grants", url: "https://texasagriculture.gov/Grants-Services/Open-Grants" },
    ],
    related: [
      { label: "Texas Agriculture & Rural Texas", href: "/texas-agriculture" },
      { label: "Texas Economy & Small Business", href: "/texas-economy" },
      { label: "Texas Laws & Legislature", href: "/laws" },
      { label: "Texas water rights explained", href: "/news/texas-water-rights-explained" },
    ],
  },

  "texas-veterans-military-guide": {
    slug: "texas-veterans-military-guide",
    title: "Texas Veterans & Military: Benefits, Services and State Policy Guide",
    dek: "A Texas-focused guide to veterans benefits navigation, state services, employment and education programs, military families, installations, and the agencies that serve those who served.",
    updated: "2026-08-09",
    pillarLabel: "Texas Veterans & Military",
    pillarHref: "/texas-veterans",
    keyTakeaways: [
      "Veterans benefits in Texas are split across federal, state, county, and local systems, so the correct agency depends on the benefit or problem.",
      "The Texas Veterans Commission is the state's primary veterans advocacy agency and helps connect veterans and families with claims, employment, education, grants, and other services.",
      "Texas Workforce Commission programs and local Workforce Solutions offices are important employment and transition resources for veterans and military families.",
      "Property-tax exemptions and other state benefits have legal eligibility requirements; veterans should verify their status with the responsible agency or county office before relying on a summary.",
      "Keep TX Red will cover veterans and military issues as a standing Texas policy pillar, including legislation, benefits administration, installations, honors, and military-community impacts.",
    ],
    intro: [
      "Texas veterans often navigate several systems at once. Federal disability compensation, health care, education, pensions, and home-loan benefits are generally administered through the U.S. Department of Veterans Affairs, while Texas adds its own state programs, employment services, tax provisions, education resources, grants, and local support networks.",
      "The purpose of this guide is to explain that map. It is not a benefits determination and does not replace an accredited representative, county veterans service officer, tax professional, or government agency. It gives Texas veterans and families a reliable starting point for identifying who handles what and where to verify current eligibility.",
    ],
    sections: [
      {
        heading: "The Texas Veterans Commission is the main state advocacy agency",
        paragraphs: [
          "Texas law assigns the Texas Veterans Commission a broad role in helping veterans and their families understand and pursue benefits and services. The state's own veterans resources describe TVC responsibilities that include collecting and sharing information about veterans programs, cooperating with service organizations, informing veterans about education, health, housing, employment, and legal benefits, and assisting with claims and rights available under law.",
          "That makes TVC an important first stop when a veteran is unsure which program applies. It also means readers should distinguish between TVC's state advocacy role and the federal VA, which administers many of the underlying federal benefits.",
        ],
      },
      {
        heading: "Federal VA benefits and Texas assistance are different layers",
        paragraphs: [
          "A Texas resident may receive federal VA benefits while also qualifying for separate Texas benefits. Federal programs can include disability compensation, pensions, education benefits, health care, life insurance, and home-loan benefits. State and local programs can include tax provisions, employment services, education initiatives, land or housing programs, and community-based assistance.",
          "When a claim involves a federal VA benefit, veterans should verify the current federal rules through VA or an accredited representative. When the question involves a Texas program, the administering state or local agency controls eligibility. The safest approach is to identify the benefit first and then confirm the responsible agency before submitting personal information or paying anyone for help.",
        ],
      },
      {
        heading: "Employment and the transition to civilian work",
        paragraphs: [
          "The Texas Workforce Commission provides veterans-focused employment and training resources and works with Workforce Solutions offices around the state. Veterans can receive priority service in covered workforce programs, and Texas also supports initiatives aimed at translating military skills into civilian employment and connecting employers with veterans and military families.",
          "For transitioning service members, the practical challenge is often not a lack of experience but translating military occupations, certifications, leadership, and technical skills into language that civilian employers recognize. State workforce resources can help bridge that gap while veterans evaluate licensing, credential, training, or education requirements for a new field.",
        ],
      },
      {
        heading: "Education and training benefits require careful coordination",
        paragraphs: [
          "Veterans and dependents may encounter both federal education benefits and Texas-specific education programs. Eligibility can depend on service history, residency, discharge status, relationship to the veteran, institution, program type, and whether another benefit has already been used.",
          "Because these rules are fact-specific, a veteran should verify benefits before enrolling or assuming tuition will be covered. The school veterans office, the Texas Veterans Commission, and the U.S. Department of Veterans Affairs can each have a role depending on the program.",
        ],
      },
      {
        heading: "Property-tax benefits are powerful but eligibility is legal, not automatic",
        paragraphs: [
          "Texas law provides property-tax benefits for certain disabled veterans and qualifying surviving spouses. The amount and type of exemption depend on statutory requirements, disability status, ownership, residency, and other facts. A veteran should not assume that a disability rating automatically produces the same exemption in every circumstance.",
          "The county appraisal district administers property-tax exemptions at the local level, while state law establishes the authority. Veterans should use current state guidance and county forms, especially after a change in disability rating, residence, ownership, marital status, or surviving-spouse status.",
        ],
      },
      {
        heading: "Military installations are also major Texas communities",
        paragraphs: [
          "Texas military installations affect local housing, schools, transportation, health care, small businesses, infrastructure, and employment. A change in force structure, mission, deployment tempo, construction, or federal spending can therefore be both a defense story and a Texas economic-policy story.",
          "Keep TX Red's military coverage will focus on the Texas consequence: what a federal decision means for service members and families, the local economy, state policy, installation communities, veterans services, and public infrastructure.",
        ],
      },
      {
        heading: "Avoid benefits scams and unverified claims assistance",
        paragraphs: [
          "Veterans benefits attract aggressive marketing because successful claims can involve substantial retroactive or ongoing payments. Veterans should be cautious about anyone promising a guaranteed rating, guaranteed approval, or a shortcut that requires surrendering a share of benefits or signing a confusing contract.",
          "When claims assistance is needed, veterans should verify whether the representative is properly accredited and understand any fee arrangement before signing. Government and accredited-service channels should be the starting point for confirming what assistance is available.",
        ],
      },
      {
        heading: "How Keep TX Red will cover veterans and military issues",
        bullets: [
          "Texas legislation affecting veterans, military families, benefits, taxes, education, licensing, and employment.",
          "Texas Veterans Commission and Texas Workforce Commission program changes and public notices.",
          "Major developments at Texas military installations with a clear statewide or local impact.",
          "Veteran-owned business, workforce, housing, and public-service issues tied to state policy.",
          "Military honors, Purple Heart and Medal of Honor recognition, memorial observances, and official state actions honoring service.",
        ],
      },
    ],
    faq: [
      { q: "What does the Texas Veterans Commission do?", a: "The Texas Veterans Commission is the state's veterans advocacy agency. It helps connect veterans and families with claims assistance, employment, education, grant-funded services, outreach, and information about rights and benefits." },
      { q: "Is the Texas Veterans Commission the same as the U.S. Department of Veterans Affairs?", a: "No. The VA is a federal department that administers federal veterans benefits and health systems. The Texas Veterans Commission is a state agency that advocates for Texas veterans and helps them navigate benefits and services." },
      { q: "Where can Texas veterans get employment help?", a: "The Texas Workforce Commission and local Workforce Solutions offices provide veterans employment and training resources, while the Texas Veterans Commission also operates veterans employment services and related programs." },
      { q: "Do all disabled veterans receive the same Texas property-tax exemption?", a: "No. Texas exemptions depend on statutory eligibility, disability status, ownership, residency, and other facts. Veterans should verify the current rules and application requirements with the state and their county appraisal district." },
    ],
    sources: [
      { label: "Office of the Texas Governor — Veterans resources and Texas Veterans Commission responsibilities", url: "https://gov.texas.gov/organization/disabilities/veterans" },
      { label: "Texas Workforce Commission — Veteran Services Program", url: "https://www.twc.texas.gov/programs/veterans" },
      { label: "Texas Operation Welcome Home — About the state partnership", url: "https://texasoperationwelcomehome.portal.texas.gov/about-us/" },
      { label: "U.S. Department of Veterans Affairs — Waco Regional Benefit Office", url: "https://www.va.gov/waco-va-regional-benefit-office/" },
    ],
    related: [
      { label: "Texas Veterans & Military", href: "/texas-veterans" },
      { label: "Texas Laws & Legislature", href: "/laws" },
      { label: "Texas Economy & Small Business", href: "/texas-economy" },
      { label: "Find your Texas representatives", href: "/find-representative" },
    ],
  },

  "texas-law-enforcement-public-safety-guide": {
    slug: "texas-law-enforcement-public-safety-guide",
    title: "Texas Law Enforcement & Public Safety: Who Does What",
    dek: "A guide to Texas DPS, Highway Patrol, Texas Rangers, criminal investigations, local police and sheriffs, public-safety policy, and how major enforcement responsibilities are divided.",
    updated: "2026-08-09",
    pillarLabel: "Texas Law Enforcement & Public Safety",
    pillarHref: "/texas-law-enforcement",
    keyTakeaways: [
      "Texas public safety is decentralized: city police, county sheriffs, constables, state agencies, prosecutors, courts, and federal agencies have different authorities and jurisdictions.",
      "The Texas Department of Public Safety includes major statewide functions such as Highway Patrol, the Texas Rangers, criminal investigations, intelligence, emergency and specialized operations, and other public-safety responsibilities.",
      "The Texas Rangers are a DPS criminal-investigative division, not a substitute for every local police or sheriff complaint process.",
      "State legislation can change criminal law, enforcement authority, funding, training, border operations, penalties, and public-safety programs, which is why law enforcement is a standing Keep TX Red policy pillar.",
      "Readers should distinguish confirmed agency statements, court records, and charging documents from allegations or early reports in an active investigation.",
    ],
    intro: [
      "Texas does not have one unified police agency that handles every crime and every public-safety problem. A city police department, county sheriff, constable, Texas Department of Public Safety trooper, Texas Ranger, DPS special agent, prosecutor, federal agent, and emergency-management official may all have different roles in the same broad public-safety system.",
      "This guide explains the statewide structure readers are most likely to encounter in Texas news and policy coverage. It is not legal advice and it is not a directory for emergency reporting. In an emergency, use the appropriate emergency channel; for non-emergency complaints or reports, contact the agency with local jurisdiction or the official state program responsible for the issue.",
    ],
    sections: [
      {
        heading: "Local law enforcement remains the front line for most incidents",
        paragraphs: [
          "Most ordinary police services begin locally. Municipal police departments generally serve incorporated cities, while sheriffs are county officials with responsibilities that can include county law enforcement, jails, court security, warrants, and service outside municipal police jurisdiction. Constables also have duties established by Texas law and local practice.",
          "The exact division of work varies by county and city, which is why a statewide news report should identify the investigating agency rather than using 'Texas police' as if all officers report to one command structure.",
        ],
      },
      {
        heading: "Texas DPS is the major statewide public-safety agency",
        paragraphs: [
          "The Texas Department of Public Safety carries statewide responsibilities through multiple divisions and programs. Readers most often encounter DPS through the Texas Highway Patrol, Texas Rangers, Criminal Investigations Division, driver and regulatory functions, intelligence and homeland-security work, emergency support, and major multi-agency operations.",
          "DPS often works with local and federal partners rather than replacing them. A major case can involve a local police department or sheriff's office as the agency of jurisdiction while DPS contributes troopers, Rangers, special agents, intelligence, laboratories, tactical resources, or other specialized support.",
        ],
      },
      {
        heading: "What Texas Highway Patrol does",
        paragraphs: [
          "DPS describes the Texas Highway Patrol as responsible for traffic supervision, traffic and criminal law enforcement on Texas rural highways, and public-safety education. Troopers also perform broader enforcement and support functions beyond issuing traffic citations.",
          "Highway Patrol therefore appears in stories involving serious crashes, highway enforcement, interdiction, evacuations, disaster response, border assignments, civil disturbances, and multi-agency public-safety operations. The specific role depends on the incident and the orders in effect at the time.",
        ],
      },
      {
        heading: "What the Texas Rangers investigate",
        paragraphs: [
          "The Texas Ranger Division is the primary criminal investigative branch of DPS. DPS lists responsibilities that include major violent crimes, public corruption, complex criminal investigations, wanted fugitives, missing persons, special investigations, assistance to local law enforcement, and specialized statewide operations.",
          "That does not mean every complaint involving a local officer or every criminal allegation belongs with the Rangers. DPS specifically notes that the Ranger Division is not a general misconduct complaint office for local law-enforcement agencies. Jurisdiction, referral, statutory authority, and the nature of the case determine whether Rangers become involved.",
        ],
      },
      {
        heading: "DPS Criminal Investigations Division targets organized and high-threat crime",
        paragraphs: [
          "The DPS Criminal Investigations Division uses special agents and specialized support personnel to investigate organized crime, high-threat offenders, trafficking, gangs, fraud, violent fugitives, organized theft, and threats to life. The division works closely with local, state, and federal partners.",
          "CID also provides investigative support capabilities that can include computer forensics, electronic surveillance, polygraph services, intelligence support, and other specialized tools. Those resources are particularly important when a case crosses jurisdictions or requires capabilities a smaller local agency may not maintain on its own.",
        ],
      },
      {
        heading: "Specialized response is different from routine policing",
        paragraphs: [
          "Texas maintains specialized teams for high-risk incidents, tactical operations, explosives, crisis negotiation, border intelligence, cold cases, public corruption, and other missions. These teams may draw personnel from different DPS divisions and may support local agencies during incidents that require additional expertise or equipment.",
          "For readers, the presence of a specialized unit does not by itself prove the seriousness of a criminal allegation or the guilt of a suspect. It tells us what capabilities the responding agencies decided were necessary. Criminal responsibility is established through evidence, charging decisions, courts, and due process.",
        ],
      },
      {
        heading: "The Legislature shapes law-enforcement authority and funding",
        paragraphs: [
          "The Texas Legislature writes criminal statutes, sets many penalties, creates or changes enforcement powers, funds state agencies, establishes training and reporting requirements, and can create new programs or specialized units. Local governments separately make budget and policy decisions within their legal authority.",
          "That means public-safety coverage should connect a major enforcement change to the actual law, budget provision, agency rule, court decision, or executive action behind it. Keep TX Red's bills and laws coverage is intended to make those connections visible instead of treating enforcement policy as a series of isolated incidents.",
        ],
      },
      {
        heading: "How Keep TX Red will cover crime and public safety",
        bullets: [
          "Major statewide or regional public-safety developments with a clear Texas impact.",
          "DPS, Texas Ranger, sheriff, police, prosecutor, and multi-agency actions when the public significance extends beyond a routine blotter item.",
          "Legislation, budgets, court decisions, and state policy that change enforcement authority, penalties, training, or public-safety programs.",
          "Border-enforcement stories will be cross-linked with the Border & Immigration pillar when border policy is central to the event.",
          "Early allegations will be labeled as allegations, and coverage will prioritize official records and attributable statements over rumor.",
        ],
      },
    ],
    faq: [
      { q: "Are the Texas Rangers a separate agency from Texas DPS?", a: "No. The Texas Ranger Division is part of the Texas Department of Public Safety and serves as a major statewide criminal-investigative arm of the department." },
      { q: "What does Texas Highway Patrol do?", a: "Texas Highway Patrol handles traffic supervision, traffic and criminal law enforcement on rural highways, public-safety education, and a range of other enforcement and support duties within DPS." },
      { q: "Does DPS replace local police and sheriffs?", a: "No. Texas public safety is decentralized. DPS frequently works alongside local agencies and can provide statewide enforcement, investigative, intelligence, tactical, and specialized support depending on jurisdiction and the incident." },
      { q: "Will the Texas Rangers investigate any complaint against a local police department?", a: "No. DPS states that the Ranger Division is not a general misconduct complaint office. Ranger involvement depends on legal authority, the nature of the case, referrals, and requests from appropriate officials or agencies." },
    ],
    sources: [
      { label: "Texas DPS — Highway Patrol Service", url: "https://www.dps.texas.gov/section/highway-patrol/highway-patrol-service" },
      { label: "Texas DPS — Ranger Responsibilities", url: "https://www.dps.texas.gov/section/texas-rangers/ranger-responsibilities" },
      { label: "Texas DPS — Criminal Investigations", url: "https://www.dps.texas.gov/section/criminal-investigations" },
      { label: "Texas DPS — Texas Rangers Specialized Units", url: "https://www.dps.texas.gov/section/texas-rangers/specialized-units" },
      { label: "Texas DPS — Texas Rangers contact and jurisdiction guidance", url: "https://www.dps.texas.gov/section/texas-rangers/contact-information" },
    ],
    related: [
      { label: "Texas Law Enforcement & Public Safety", href: "/texas-law-enforcement" },
      { label: "Texas Laws & Legislature", href: "/laws" },
      { label: "Texas Border & Immigration", href: "/texas-border-security" },
      { label: "Texas Politics & Government", href: "/texas-politics" },
    ],
  },
};

import type { AgencyAuthorityProfile, AgencyAuthoritySource } from "@/data/agency-authority";

type AgencyExpansion = {
  quickAnswer: string;
  authority: string;
  responsibilities: string[];
  notResponsibleFor: string[];
  accountability: string[];
  programs: string[];
  sources?: AgencyAuthoritySource[];
};

const EXPANSIONS: Record<string, AgencyExpansion> = {
  "texas-education-agency": {
    quickAnswer: " TEA is an administrative agency, not a statewide school board for every classroom decision. The commissioner and agency implement duties the Legislature assigns in the Education Code, while the elected State Board of Education, State Board for Educator Certification, local trustees, charter operators, educators and federal authorities each retain separate responsibilities.",
    authority: " That division matters in disputes over curriculum, accountability, school finance or district intervention. A TEA rule must rest on delegated legal authority, and an agency decision can be constrained by statute, federal requirements and judicial review. The Legislature can change the underlying Education Code and appropriations, while local boards continue to make many operational decisions unless state law places the issue elsewhere.",
    responsibilities: [
      "Administer the Foundation School Program and other school-finance systems using formulas enacted by the Legislature. TEA calculates and distributes funding under those formulas, but it does not independently choose statewide tax policy or appropriate money outside the budget and education laws lawmakers enact.",
      "Operate statewide assessment and accountability systems, publish school and district performance information, and administer interventions authorized by law. Accountability labels and sanctions are administrative actions under the Education Code and agency rules, which means districts can have statutory review or challenge procedures rather than treating a rating as an informal agency opinion.",
      "Maintain statewide education data systems and reporting standards used for enrollment, staffing, finance, academic performance and accountability. These systems support public transparency and state oversight, but reported data can have definitions, reporting periods and later corrections that should be checked before making comparisons."
    ],
    notResponsibleFor: [
      "TEA does not write the Texas Constitution or Education Code and cannot create a statewide education entitlement merely through guidance. Major school-finance, curriculum, governance and accountability changes often require legislation or rulemaking grounded in existing statutory authority.",
      "TEA does not hire ordinary classroom teachers or set every local personnel decision. Districts and charter operators remain employers, subject to state certification, employment, finance and civil-rights rules that may constrain local discretion."
    ],
    accountability: [
      "The commissioner and agency are subject to legislative oversight, appropriations, state administrative-law requirements, public-information obligations and judicial review where law provides it. Agency rules and commissioner decisions should therefore be traced to the specific Education Code authority they invoke.",
      "Public-school accountability also runs in multiple directions: TEA oversees districts under state law, local trustees answer to voters, charter operators are governed by their authorization structure, and federal funding can bring separate federal compliance requirements."
    ],
    programs: [
      "School-finance administration includes formula calculations, entitlement and payment systems, financial reporting and guidance to districts. The formulas themselves are policy choices enacted by lawmakers, not discretionary grants invented by the agency.",
      "Assessment and accountability functions include statewide testing, rating methodologies, data publication and intervention processes. Because methodologies can change by school year, KTR will identify the applicable year and official methodology when comparing ratings."
    ]
  },
  "texas-department-public-safety": {
    quickAnswer: " DPS is governed through the Public Safety Commission and a director under Texas law. It combines statewide law-enforcement divisions with administrative systems such as driver licensing and criminal-history records, so a DPS story can involve policing, regulation, identity documents, intelligence, emergency support or database administration rather than one single mission.",
    authority: " Government Code Chapter 411 establishes the department and describes it as a state agency for enforcing laws protecting public safety and preventing and detecting crime. The same chapter establishes the Public Safety Commission and the department's organization. Other statutes assign additional licensing, records, border, regulatory and emergency functions, while legislative appropriations determine the resources available to carry them out.",
    responsibilities: [
      "Provide statewide Highway Patrol, Texas Ranger, criminal-investigation, intelligence and specialized public-safety capabilities. Those divisions can lead matters within their jurisdiction or assist local agencies, but the existence of a statewide capability does not erase the jurisdiction of sheriffs, police departments, constables or local prosecutors.",
      "Administer driver licenses and identification credentials under Texas law, including eligibility, testing, renewal, suspension and record functions assigned to the department. Vehicle title and registration are distinct functions primarily administered through TxDMV and county tax offices.",
      "Maintain criminal-justice information systems, fingerprint and criminal-history records, sex-offender information and other statewide databases assigned by statute. Access and disclosure rules vary by system, so a record maintained by DPS is not automatically a public record available without legal restrictions."
    ],
    notResponsibleFor: [
      "DPS does not control federal immigration admission, removal or asylum decisions. State border operations can involve enforcement of Texas law and assistance within state authority, while federal immigration powers remain governed by federal law and litigation over the state-federal boundary.",
      "DPS is not the statewide prosecutor for criminal cases. Rangers and investigators may develop cases, but charging decisions ordinarily belong to the prosecutor with legal jurisdiction unless a specific statute provides another process."
    ],
    accountability: [
      "The Public Safety Commission, governor, Legislature, appropriations process and applicable courts each provide different forms of oversight. Commission policy cannot exceed statutory authority, and legislative committees can examine spending, operations and statutory performance.",
      "DPS actions can also generate records subject to public-information law, criminal procedure, evidentiary rules and privacy restrictions. Responsible accountability reporting must distinguish an investigative allegation, an arrest, a charging decision and a final court judgment."
    ],
    programs: [
      "Driver-license administration is a large civilian service function alongside the department's law-enforcement mission. Performance questions can therefore include appointment availability, credential processing, statutory eligibility and technology systems as well as enforcement activity.",
      "Border and emergency deployments can draw personnel from multiple divisions and may be funded through special appropriations or interagency operations. KTR will separate the agency's statutory authority, the governor's directives and the Legislature's funding choices when evaluating those operations."
    ],
    sources: [
      { label: "Texas Government Code — Chapter 411, Department of Public Safety", url: "https://statutes.capitol.texas.gov/Docs/GV/pdf/GV.411.pdf", primary: true }
    ]
  },
  "public-utility-commission": {
    quickAnswer: " PUCT is a regulator and adjudicatory commission, not the operator of every utility it oversees. It writes rules within delegated authority, decides contested matters, oversees important parts of the competitive electric market and ERCOT, and administers consumer and utility proceedings. Its jurisdiction varies by utility type and ownership structure.",
    authority: " Utilities Code Chapter 12 establishes the Public Utility Commission and provides that it exercises the jurisdiction and powers conferred by the Utilities Code. Other chapters define electric, telecommunications, water and sewer jurisdiction. Commissioners therefore cannot regulate merely because a matter involves energy; a statute must place the subject within commission authority, and commission orders remain subject to applicable administrative and judicial review.",
    responsibilities: [
      "Adopt electric-market and utility rules authorized by statute, conduct dockets and contested cases, and issue orders affecting regulated utilities and market participants. Rulemaking sets generally applicable requirements, while a docket or contested case applies law and rules to a specific matter; those are different records and should not be conflated.",
      "Exercise statutory oversight of ERCOT, including governance, protocols, reliability and market matters assigned by the Legislature. PUCT oversight does not mean commissioners dispatch power plants in real time; ERCOT performs grid-operator functions within the regulatory framework.",
      "Review rates, certificates and service issues for utilities within the commission's jurisdiction and provide consumer complaint processes. Municipal utilities and electric cooperatives can be governed differently from investor-owned utilities, so ownership and service territory matter before assuming PUCT controls a particular rate."
    ],
    notResponsibleFor: [
      "PUCT does not own generation, transmission or distribution assets and does not itself operate the ERCOT control room. Utilities, generators, transmission companies and ERCOT have operational responsibilities distinct from the regulator.",
      "The commission cannot rewrite the Utilities Code or appropriate state money. The Legislature establishes the statutory market design and can change the commission's jurisdiction, while courts can review commission action under applicable law."
    ],
    accountability: [
      "Commission proceedings create a substantial public record: proposed rules, comments, dockets, orders, open meetings and filings can show how a decision was made. KTR will use the docket or rulemaking record rather than treating a press release as the full regulatory record.",
      "The Legislature oversees PUCT through statutes, appropriations, hearings and sunset review, while commissioners operate under appointment and ethics rules. Judicial review provides an additional legal check on final agency action where authorized."
    ],
    programs: [
      "Electric reliability and market oversight includes ERCOT governance, market rules, transmission and reliability policy within statutory jurisdiction. The commission's role is regulatory; real-time grid operations remain with ERCOT and physical assets remain with market participants.",
      "Consumer assistance includes complaint intake and information about regulated services. A complaint process can help resolve or document a dispute, but it does not expand commission jurisdiction over a utility or service the Legislature placed elsewhere."
    ],
    sources: [
      { label: "Texas Utilities Code — Public Utility Commission organization and jurisdiction", url: "https://statutes.capitol.texas.gov/Docs/SDocs/UTILITIESCODE.pdf", primary: true }
    ]
  },
  ercot: {
    quickAnswer: " ERCOT is the grid operator for the power region serving most Texans, but it is neither a power company nor a conventional state agency. It coordinates the flow of electricity, administers wholesale-market and settlement systems, manages reliability processes and operates under a statutory framework in which PUCT has direct oversight responsibilities.",
    authority: " Utilities Code Section 39.151 establishes the statutory framework for an independent organization to ensure reliability and access to the transmission system in the ERCOT power region. ERCOT's detailed protocols and market rules operate under PUCT oversight and state law. That structure is important because ERCOT can make operational and market decisions within its role but cannot independently change Texas statutes or the commission's regulatory authority.",
    responsibilities: [
      "Balance generation and electric demand in real time and direct reliability actions needed to keep the interconnected system operating within required limits. ERCOT coordinates resources through market and reliability mechanisms; it does not own the generators producing electricity.",
      "Administer wholesale-market settlement and information systems that calculate transactions among market participants. Market prices are produced through the market design and operating conditions rather than being a retail rate ERCOT simply chooses for household customers.",
      "Plan and evaluate transmission and resource-adequacy needs within the duties assigned by law, protocols and PUCT rules. Planning identifies system needs and reliability risks, while utilities and other entities generally own and construct the physical facilities subject to separate regulatory approvals."
    ],
    notResponsibleFor: [
      "ERCOT does not set a household's retail electricity contract, own the poles and wires serving a home, or send most Texans a retail bill. Retail electric providers, transmission and distribution utilities, municipal systems and cooperatives perform different customer-facing roles.",
      "ERCOT cannot enact energy statutes or unilaterally redefine PUCT jurisdiction. The Legislature writes the governing laws and PUCT exercises the regulatory authority the Legislature assigns."
    ],
    accountability: [
      "PUCT oversees ERCOT under Texas law, including governance and major protocol or market issues. Legislative committees can examine ERCOT performance and change the statutory framework, while ERCOT publishes extensive market, operational and planning records.",
      "Accountability for a grid event can involve multiple actors. ERCOT may be responsible for dispatch and reliability decisions, generators for plant performance, transmission utilities for equipment, fuel suppliers for fuel delivery, PUCT for regulatory choices and lawmakers for statutory design."
    ],
    programs: [
      "Real-time grid operations include frequency control, congestion management, reserves and emergency procedures. The exact action taken during stressed conditions depends on system conditions and the then-current protocols and PUCT rules.",
      "Market and planning functions include settlements, forecasts, transmission analysis and public operating data. These records let readers distinguish a forecast from actual demand, available capacity from installed capacity, and a market price from a residential retail bill."
    ],
    sources: [
      { label: "Texas Utilities Code — Chapter 39, including ERCOT statutory framework", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=UT.39&code=UT&tab=1", primary: true }
    ]
  },
  "texas-department-transportation": {
    quickAnswer: " TxDOT is responsible for the state transportation system, not every road or transportation service in Texas. Its portfolio includes state highways, planning, project delivery, traffic operations and assigned aviation, rail, transit and port programs. Local governments, toll entities, transit authorities, TxDMV and federal agencies retain separate responsibilities.",
    authority: " Transportation Code Chapter 201 establishes TxDOT and the Texas Transportation Commission, while other Transportation Code chapters and federal transportation law assign project, funding, safety and modal responsibilities. The commission sets policy and the department executes programs under legislative appropriations; neither can create a transportation tax or ignore federal requirements attached to federal funds.",
    responsibilities: [
      "Develop and maintain the state highway system through planning, engineering, right-of-way, construction, maintenance and operations. A project can take years because environmental review, design, funding, right-of-way acquisition and procurement are separate stages rather than one construction decision.",
      "Administer major state and federal transportation funding programs and maintain long-range planning documents. Funding decisions can involve constitutional revenue dedications, legislative appropriations, federal formulas, metropolitan planning processes and project-scoring systems.",
      "Operate statewide traffic-management and safety programs and coordinate incident response on state facilities. Local streets, police enforcement and local traffic policy remain under separate jurisdictions even when TxDOT data or funding supports a project."
    ],
    notResponsibleFor: [
      "TxDOT does not issue ordinary vehicle titles and registrations; TxDMV and county tax assessor-collector offices have central roles in that system. Driver licensing is primarily a DPS responsibility, making the three agencies distinct despite all being associated with roads and vehicles.",
      "TxDOT does not own every Texas road. Counties, cities, toll authorities and other entities maintain separate networks, and metropolitan planning organizations make regional planning decisions required by federal transportation law."
    ],
    accountability: [
      "The Texas Transportation Commission provides policy governance, while the Legislature controls statutes and appropriations and federal agencies oversee compliance tied to federal funds. Project records, environmental documents, letting information and commission meetings provide source material for accountability reporting.",
      "Major transportation projects should be evaluated by phase and funding source. An announced planning study, environmental clearance, funded project and awarded construction contract are different milestones and should not be reported as though they all mean construction is immediately underway."
    ],
    programs: [
      "Highway project delivery spans planning through maintenance, with separate records for design, environmental review, right of way, bidding and construction. That structure gives KTR multiple checkpoints for tracking cost, schedule and scope changes.",
      "Multimodal programs support aviation, rail, ports, transit and bicycle/pedestrian initiatives where law assigns TxDOT a role. Those programs generally involve partners with their own operating authority rather than direct state operation of every service."
    ],
    sources: [
      { label: "Texas Transportation Code — Chapter 201, TxDOT", url: "https://statutes.capitol.texas.gov/Docs/TN/pdf/TN.201.pdf", primary: true }
    ]
  },
  "texas-commission-environmental-quality": {
    quickAnswer: " TCEQ is a permitting, compliance and enforcement agency whose authority depends on the environmental program involved. Some programs implement Texas statutes alone, while others operate under federal delegation or authorization. A TCEQ permit therefore reflects a defined regulatory program; it is not a blanket state approval of every local, federal or private-law issue associated with a project.",
    authority: " Texas Water Code, Health and Safety Code provisions, other state environmental statutes and delegated federal programs define the commission's jurisdiction. Commissioners adopt rules and decide specified matters, while the executive director administers programs and can take actions delegated by law or commission rule. Federal agencies retain oversight or parallel authority in federally governed programs.",
    responsibilities: [
      "Administer air-quality permitting and compliance programs, including state implementation responsibilities under federal clean-air law. Permit requirements depend on the facility and program, and an authorization to emit within legal limits is not a finding that a facility has zero environmental impact.",
      "Administer water-quality permits, drinking-water oversight and waste programs assigned to TCEQ. Texas water governance is divided, so water rights, water planning, groundwater districts and financing can involve agencies other than TCEQ.",
      "Investigate complaints and alleged violations, conduct inspections, negotiate or pursue enforcement and publish compliance information. An investigation can close without an enforcement order, and an alleged violation should be distinguished from a final administrative or judicial finding."
    ],
    notResponsibleFor: [
      "TCEQ is not the primary oil-and-gas production regulator; the Railroad Commission has major jurisdiction over drilling, production and related activities. Environmental jurisdiction can overlap at the edges, so the specific statute and activity matter.",
      "TCEQ does not decide every local zoning, land-use or building-permit question. Local governments can retain separate authority, and federal permits or reviews may be required in addition to state environmental authorization."
    ],
    accountability: [
      "TCEQ rulemaking, permits, contested-case records, enforcement orders and commission meetings create a public administrative record. Judicial review and federal oversight can provide additional checks depending on the program and procedural posture.",
      "The Legislature establishes the agency's statutory authority, appropriations and many policy standards. Sunset review and legislative oversight can change program structure, while commissioners remain bound by existing law until those laws change."
    ],
    programs: [
      "Permitting programs translate statutes and rules into facility-specific conditions. KTR will distinguish an application, draft permit, final permit, contested-case proceeding and enforcement action because each represents a different stage and legal status.",
      "Compliance and enforcement programs use monitoring, reports, inspections and complaint investigations. Published enforcement data can document agency action but should be read with the underlying order or case record before assigning responsibility."
    ]
  },
  "health-human-services-commission": {
    quickAnswer: " HHSC is the administrative center of the Texas health and human-services system, with responsibility for Medicaid and many benefits, regulatory and service programs. Its decisions are heavily shaped by both state law and federal program rules, particularly in Medicaid, so state policymakers have meaningful discretion but do not control every eligibility, financing or coverage rule independently.",
    authority: " Government Code Chapter 531 and related health statutes organize HHSC and assign system responsibilities. Legislative appropriations provide state funding, while federal statutes, waivers, regulations and matching-fund requirements govern large portions of Medicaid and other programs. HHSC can adopt rules within delegated authority but cannot create appropriations or disregard federal conditions attached to federal participation.",
    responsibilities: [
      "Administer Medicaid eligibility, benefits and managed-care structures within state and federal law. Texas can make policy choices through its state plan, waivers and contracts, but many choices require federal approval or must satisfy federal minimum requirements.",
      "Operate or oversee eligibility systems for major health and human-services benefits and coordinate contracted service delivery. Eligibility decisions are governed by program rules and due-process requirements rather than informal discretion by an individual agency employee.",
      "License or regulate specified health, long-term-care and child-care providers and facilities through functions assigned to HHSC. Other professions and facilities may be regulated by separate boards or agencies, so the provider type determines the correct regulator."
    ],
    notResponsibleFor: [
      "HHSC is not synonymous with the entire Texas health system. The Department of State Health Services, Department of Family and Protective Services and numerous professional licensing boards have separate statutory missions and leadership structures.",
      "HHSC cannot promise a benefit or reimbursement rate without legal and budget authority. Legislative appropriations, federal matching rules, state-plan requirements and contracts all constrain what the agency can pay or cover."
    ],
    accountability: [
      "The Legislature oversees statutes, appropriations and agency performance, while federal agencies oversee compliance with federally funded programs. State auditors, inspectors general, contracting records, rulemaking and public-information laws add additional accountability mechanisms.",
      "Managed-care and vendor contracts can move operational work outside the agency without moving legal responsibility entirely away from the state. KTR will distinguish the agency's policy/oversight role from a contractor's performance when evaluating service failures."
    ],
    programs: [
      "Medicaid managed care combines state policy, federal approval, contracts and health-plan operations. A change can originate in legislation, an HHSC rule or contract, a federal requirement or a waiver amendment, so the source of authority should be identified before assigning responsibility.",
      "Benefits administration depends on large eligibility and data systems. Processing-time or access problems can therefore involve staffing, policy, vendor technology and federal verification requirements rather than a single program rule."
    ]
  },
  "railroad-commission": {
    quickAnswer: " RRC is an elected three-member regulatory commission with major authority over Texas oil and natural gas, pipelines, gas utilities and surface mining. Its name is historical: railroad regulation moved elsewhere long ago. Because commissioners are elected statewide, RRC combines an administrative regulatory record with direct electoral accountability unusual among major Texas agencies.",
    authority: " Texas Natural Resources Code, Utilities Code and other statutes assign RRC authority, while certain pipeline-safety and mining programs also operate under delegated federal requirements. The commission can adopt rules and decide matters within that jurisdiction, but it cannot regulate an activity simply because it is associated with the energy industry; electricity markets and environmental programs can belong to PUCT, TCEQ or federal agencies.",
    responsibilities: [
      "Regulate oil and gas drilling, production, well integrity, plugging and related field operations under Texas law. Permits and production records provide important public data, but a drilling permit is not a guarantee of production or a resolution of private mineral-title and lease disputes.",
      "Administer pipeline-safety and natural-gas utility responsibilities assigned to the commission. Jurisdiction depends on pipeline type, commodity and service, and federal pipeline-safety standards can form part of the governing framework.",
      "Oversee critical natural-gas infrastructure requirements tied to electric-grid reliability reforms. Those duties address gas-side preparedness and designation; they do not turn RRC into the electric-market regulator or grid operator."
    ],
    notResponsibleFor: [
      "RRC does not regulate wholesale electricity markets or operate the ERCOT grid. PUCT regulates major electric-market matters and oversees ERCOT, while ERCOT performs system-operator functions.",
      "RRC generally does not adjudicate private royalty accounting, mineral-title ownership or easement compensation as ordinary private disputes. Courts and contractual processes can govern those issues even when the underlying facility is regulated by RRC."
    ],
    accountability: [
      "Commissioners are elected statewide and vote in public commission proceedings. Rules, permits, hearings, enforcement records and production data create an extensive administrative record that can be compared with campaign promises and legislative directives.",
      "The Legislature can change RRC jurisdiction, funding and statutory standards, while federal agencies oversee delegated programs. Courts may review final commission action under applicable administrative-law standards."
    ],
    programs: [
      "Oil-and-gas regulation includes permitting, field rules, inspections, plugging and enforcement. KTR will distinguish permitting, compliance inspections and final enforcement actions rather than using 'approved by RRC' as a catch-all description.",
      "Pipeline and gas-utility programs involve safety, rates or operations within specific statutory jurisdictions. Readers should verify which RRC division and legal authority applies because not every pipeline or utility is regulated identically."
    ]
  },
  "texas-water-development-board": {
    quickAnswer: " TWDB is Texas's principal statewide water-planning, data and financing institution. It is designed to help the state understand future water and flood needs and finance infrastructure; it is not the primary environmental permitting agency and does not replace local utilities, groundwater districts or river authorities that make separate operational decisions.",
    authority: " Water Code Chapter 6 identifies TWDB as the state agency primarily responsible for water planning and administering water financing. Constitutional amendments and other statutes create specific financing programs, while state planning laws establish regional processes. The board can administer those programs and adopt authorized rules, but financing authority does not give it general control over all water rights or utility operations.",
    responsibilities: [
      "Compile the State Water Plan from regional planning processes and publish demand, supply, strategy and project information used to evaluate long-term needs. A plan identifies strategies and anticipated needs; it does not itself build every listed project or guarantee that financing, permitting and local approvals will occur.",
      "Develop the State Flood Plan through regional flood-planning processes and maintain flood-related data and mapping programs. Planning can identify risk and recommended projects, while project sponsors remain responsible for design, permits, local decisions and construction.",
      "Administer loans, grants and constitutionally authorized financing programs for eligible water, wastewater, flood and conservation projects. Financing decisions depend on program rules, eligibility, prioritization and available funds rather than a general entitlement for every proposed project."
    ],
    notResponsibleFor: [
      "TWDB is not TCEQ. Environmental permitting, drinking-water regulation and many water-quality enforcement functions are assigned to TCEQ, while water rights and other subjects can involve additional state and local institutions.",
      "TWDB does not operate most local water utilities or groundwater districts. Cities, special districts, river authorities and groundwater conservation districts can own infrastructure or exercise authorities that remain legally separate from statewide planning."
    ],
    accountability: [
      "A governor-appointed board approves major financing and policy actions within statute, while the Legislature controls laws, appropriations and constitutional propositions submitted to voters. Regional planning processes add local representation and public participation to statewide plans.",
      "TWDB publishes extensive water, drought, groundwater, planning and financing data. Those datasets are valuable for accountability but can include projections and modeled estimates, so KTR will distinguish measured observations from forecast demand or modeled supply."
    ],
    programs: [
      "State Water Plan work links population and demand projections to existing supplies, shortages and recommended strategies. The plan is a planning framework rather than a single construction schedule, and individual projects retain separate local, financial and permitting requirements.",
      "Infrastructure finance programs can use state and federal funds, bonds and constitutionally created mechanisms. Each program has separate eligibility and repayment rules, so an award or commitment should be tied to the exact financing program and board action."
    ],
    sources: [
      { label: "Texas Water Code — Chapter 6, Texas Water Development Board", url: "https://statutes.capitol.texas.gov/Docs/WA/pdf/WA.6.pdf", primary: true }
    ]
  }
};

export function upgradeAgencyAuthorityProfile(profile: AgencyAuthorityProfile): AgencyAuthorityProfile {
  const expansion = EXPANSIONS[profile.slug];
  if (!expansion) return profile;
  return {
    ...profile,
    reviewed: "2026-08-20",
    quickAnswer: `${profile.quickAnswer}${expansion.quickAnswer}`,
    authority: `${profile.authority}${expansion.authority}`,
    responsibilities: [...profile.responsibilities, ...expansion.responsibilities],
    notResponsibleFor: [...profile.notResponsibleFor, ...expansion.notResponsibleFor],
    accountability: [...profile.accountability, ...expansion.accountability],
    programs: [...profile.programs, ...expansion.programs],
    sources: [...profile.sources, ...(expansion.sources ?? [])],
  };
}

export function upgradeAgencyAuthorityProfiles(profiles: AgencyAuthorityProfile[]): AgencyAuthorityProfile[] {
  return profiles.map(upgradeAgencyAuthorityProfile);
}

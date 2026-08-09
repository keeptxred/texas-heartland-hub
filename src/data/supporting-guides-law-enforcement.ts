import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const commonRelated = [
  { label: "Texas Law Enforcement & Public Safety", href: "/texas-law-enforcement" },
  { label: "Texas Laws & Legislature", href: "/laws" },
  { label: "Texas Politics & Government", href: "/texas-politics" },
];

export const LAW_ENFORCEMENT_SUPPORTING_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-law-enforcement-agencies-guide": {
    slug: "texas-law-enforcement-agencies-guide",
    title: "Texas Law Enforcement Agencies Guide: Who Has Authority Where",
    dek: "A plain-English map of Texas police departments, sheriffs, constables, DPS, state investigators, prosecutors, and federal agencies—and how their jurisdictions differ.",
    updated: "2026-08-09", pillarLabel: "Texas Law Enforcement & Public Safety", pillarHref: "/texas-law-enforcement", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Texas law enforcement is decentralized; city, county, state, and federal agencies have different jurisdictions and legal authority.",
      "Sheriffs are elected county officials, municipal police serve cities, constables operate within counties, and DPS has statewide responsibilities.",
      "Major investigations can involve task forces and overlapping agencies, so the lead agency and charging authority should be identified before assigning responsibility.",
    ],
    intro: [
      "A Texas public-safety story can involve several badges at once. Municipal police, county sheriffs, constables, Texas Department of Public Safety personnel, specialized state investigators, prosecutors, and federal agencies may all participate in the same event while exercising different authority.",
      "Understanding that structure prevents a common reporting mistake: assuming the agency visible at a scene controls every part of the investigation, prosecution, jail, court, or policy decision that follows.",
    ],
    sections: [
      { heading: "Municipal police and county sheriffs", paragraphs: [
        "Municipal police departments generally enforce law within their cities under local and state authority. Sheriffs are elected county officials with responsibilities that commonly include law enforcement in unincorporated areas, county jail operations, court security, and service of process, though local arrangements vary.",
        "The distinction matters because a crime occurring inside a city may be investigated by municipal police while the county sheriff operates the jail where a defendant is booked. Prosecutorial decisions may then belong to a district or county attorney rather than either law-enforcement agency.",
      ]},
      { heading: "Constables and specialized local agencies", paragraphs: [
        "Texas counties can have elected constables serving precincts. Their duties can include civil process, court-related functions, and law-enforcement activity permitted by law. Transit, school, university, hospital, airport, and other special-purpose police agencies can also have commissioned officers within defined jurisdictions.",
        "Readers should identify the agency's statutory or institutional jurisdiction instead of assuming every local peace officer reports to a city police chief or county sheriff.",
      ]},
      { heading: "State and federal roles", paragraphs: [
        "DPS has statewide functions through the Texas Highway Patrol, Texas Rangers, criminal investigations, intelligence, driver and regulatory programs, emergency support, and other divisions. Other state agencies can have investigators or enforcement personnel tied to specific laws and programs.",
        "Federal agencies become involved when federal law, interstate activity, immigration, firearms, drugs, organized crime, national security, or another federal jurisdiction is implicated. Joint task forces do not erase the distinction between state and federal charges.",
      ]},
      { heading: "Questions to ask when agencies overlap", bullets: [
        "Which agency is the lead investigative agency?",
        "Which agency made the arrest and under what authority?",
        "Are the alleged offenses state, federal, or both?",
        "Which prosecutor will decide whether charges move forward?",
        "Which agency controls public records for the information being requested?",
      ]},
    ],
    faq: [
      { q: "Is a Texas sheriff the boss of city police departments?", a: "No. Sheriffs are county officials and municipal police departments operate under their city governments. They can cooperate, but one does not generally command the other simply because both operate in the same county." },
      { q: "Does Texas DPS have statewide authority?", a: "DPS has statewide responsibilities and commissioned personnel with authority under Texas law, though specific divisions and investigations have defined duties." },
      { q: "Can one case involve both state and federal agencies?", a: "Yes. Joint investigations and task forces are common when conduct may violate both state and federal law or cross multiple jurisdictions." },
    ],
    sources: [
      { label: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/" },
      { label: "Texas Commission on Law Enforcement", url: "https://www.tcole.texas.gov/" },
      { label: "Texas Constitution and Statutes", url: "https://statutes.capitol.texas.gov/" },
    ],
    related: [...commonRelated, { label: "Texas law enforcement cornerstone guide", href: "/guides/texas-law-enforcement-public-safety-guide" }],
  },

  "texas-dps-guide": {
    slug: "texas-dps-guide",
    title: "Texas DPS Guide: Highway Patrol, Rangers, Investigations and Statewide Public Safety",
    dek: "What the Texas Department of Public Safety does, how its major divisions differ, and where DPS fits into traffic enforcement, criminal investigations, border operations, licensing, and emergencies.",
    updated: "2026-08-09", pillarLabel: "Texas Law Enforcement & Public Safety", pillarHref: "/texas-law-enforcement", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "DPS is a statewide department with responsibilities that extend far beyond highway traffic enforcement.",
      "Texas Highway Patrol, Texas Rangers, criminal investigations, intelligence, driver-license operations, regulatory services, and emergency functions are distinct parts of the department.",
      "DPS can support local agencies without replacing local police, sheriffs, prosecutors, or courts.",
    ],
    intro: [
      "Texas DPS appears in stories ranging from traffic stops and major criminal investigations to border operations, disaster response, driver licenses, commercial vehicles, and state security. That breadth can make the department seem like one unit when it is actually a large organization with several different missions.",
      "For accurate coverage, the useful first question is which DPS division or function is involved. Authority, records, command structure, and the relationship with local agencies can differ depending on the operation.",
    ],
    sections: [
      { heading: "Highway Patrol and roadway enforcement", paragraphs: [
        "Texas Highway Patrol troopers conduct traffic and criminal enforcement on Texas roadways and support public-safety operations across the state. Commercial vehicle enforcement and crash-related duties can involve additional DPS functions and federal safety requirements.",
        "Local police and sheriffs also enforce traffic laws within their jurisdictions, so the presence of DPS on a roadway does not mean local agencies lack authority there.",
      ]},
      { heading: "Texas Rangers and criminal investigations", paragraphs: [
        "The Texas Rangers are a DPS division with statewide investigative responsibilities. Rangers may investigate major crimes, public corruption, officer-involved incidents, unsolved cases, or other matters depending on law, request, policy, and circumstances.",
        "DPS also has criminal investigations and intelligence functions beyond the Rangers. Reporting should identify the actual division named in the official release rather than using 'Texas Rangers' as a generic label for every DPS investigation.",
      ]},
      { heading: "Border and emergency operations", paragraphs: [
        "DPS has played a major role in Texas border-security operations, including Operation Lone Star, alongside the Texas Military Department and local partners. Border operations are policy-driven deployments and should be distinguished from the department's ordinary statewide duties.",
        "During disasters and major emergencies, DPS can support incident response, security, transportation, evacuations, communications, and coordination with other state and local agencies.",
      ]},
      { heading: "Other DPS functions readers encounter", bullets: [
        "Driver-license and identification services.",
        "Crime laboratories and forensic services.",
        "Regulatory programs and certain licensing functions.",
        "Intelligence, security, and emergency-management support.",
      ]},
    ],
    faq: [
      { q: "Are Texas Rangers separate from DPS?", a: "The Texas Rangers are a division of the Texas Department of Public Safety, not a separate cabinet-level state agency." },
      { q: "Does DPS replace local police during a major investigation?", a: "Not automatically. DPS can lead or assist depending on jurisdiction, request, law, and the facts. Local law enforcement and prosecutors can retain important roles." },
      { q: "Does DPS only enforce traffic laws?", a: "No. DPS responsibilities include criminal investigations, intelligence, forensic services, driver and regulatory programs, border operations, emergency support, and other statewide public-safety functions." },
    ],
    sources: [
      { label: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/" },
      { label: "Texas Rangers", url: "https://www.dps.texas.gov/section/texas-rangers" },
      { label: "Texas Highway Patrol", url: "https://www.dps.texas.gov/section/highway-patrol" },
    ],
    related: [...commonRelated, { label: "Texas Border & Immigration", href: "/texas-border-security" }],
  },

  "texas-sheriff-police-constable-guide": {
    slug: "texas-sheriff-police-constable-guide",
    title: "Texas Sheriff vs. Police vs. Constable: Who Does What",
    dek: "A guide to the different local law-enforcement offices Texans encounter, including elected sheriffs and constables, municipal police chiefs, county jails, courts, and overlapping jurisdiction.",
    updated: "2026-08-09", pillarLabel: "Texas Law Enforcement & Public Safety", pillarHref: "/texas-law-enforcement", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Texas sheriffs and constables are elected county officials, while municipal police departments are part of city government.",
      "Local agencies can have overlapping peace-officer authority while still having different institutional responsibilities.",
      "County jail administration, civil process, patrol, investigations, and court security can be divided differently by office and county.",
    ],
    intro: [
      "Texans can live inside a city, county, school district, constable precinct, and special police jurisdiction at the same time. That overlap explains why several agencies may be legally capable of responding to an incident even though their budgets, elected accountability, command structures, and daily responsibilities differ.",
      "The simplest distinction is institutional: police departments are municipal agencies, sheriffs are elected county officials, and constables are elected precinct-level county officials. The details are shaped by Texas law and local practice.",
    ],
    sections: [
      { heading: "Sheriffs", paragraphs: [
        "Each Texas county elects a sheriff. Sheriffs commonly provide law enforcement in unincorporated areas, operate county jails, provide court security, and perform other statutory duties. Large counties may have extensive specialized divisions, while small counties may rely on a much smaller staff.",
        "Because the sheriff is elected, accountability differs from a city police chief who is generally appointed within municipal government. County commissioners control important budget decisions but do not simply function as the sheriff's chain of command.",
      ]},
      { heading: "Municipal police", paragraphs: [
        "City police departments provide law-enforcement services within municipal boundaries under city government. Chiefs, staffing, budgets, local ordinances, and policy oversight operate through the municipal structure, subject to state and federal law.",
        "City officers and sheriff's deputies can cooperate on investigations and emergencies. Jurisdictional overlap does not erase the fact that they work for separate governmental entities.",
      ]},
      { heading: "Constables", paragraphs: [
        "Texas constables are elected within county precincts and are peace officers with duties that can include service of civil process, court functions, warrants, patrol, and other law-enforcement work authorized by law.",
        "The practical role of a constable's office varies widely. Some metropolitan precincts have substantial patrol and contract programs, while other offices focus more heavily on civil and court-related duties.",
      ]},
      { heading: "Why overlapping authority matters", bullets: [
        "Emergency response may be based on proximity and mutual-aid agreements rather than agency branding.",
        "The arresting agency may differ from the jail operator or prosecuting office.",
        "Public-record requests should be directed to the governmental body that actually maintains the requested record.",
        "Policy accountability follows the office's governmental structure—city, county, precinct, or another entity.",
      ]},
    ],
    faq: [
      { q: "Are Texas sheriffs elected?", a: "Yes. Sheriffs are elected county officials under the Texas constitutional and statutory framework." },
      { q: "Are Texas police chiefs elected?", a: "Municipal police chiefs are generally appointed under the city's governmental structure rather than elected countywide." },
      { q: "What is a Texas constable?", a: "A constable is an elected county precinct official and licensed peace officer with duties established by Texas law, including civil process and law-enforcement functions." },
    ],
    sources: [
      { label: "Texas Constitution and Statutes", url: "https://statutes.capitol.texas.gov/" },
      { label: "Texas Commission on Law Enforcement", url: "https://www.tcole.texas.gov/" },
      { label: "Texas Association of Counties — Sheriff", url: "https://www.county.org/County-Magazine-Main/County-Official-Information/Sheriff" },
    ],
    related: [...commonRelated, { label: "Texas law enforcement agencies guide", href: "/guides/texas-law-enforcement-agencies-guide" }],
  },

  "texas-peace-officer-training-licensing-guide": {
    slug: "texas-peace-officer-training-licensing-guide",
    title: "Texas Peace Officer Training and Licensing: TCOLE Explained",
    dek: "How Texas peace-officer licensing, academies, continuing education, standards, records, and disciplinary authority fit together under the Texas Commission on Law Enforcement.",
    updated: "2026-08-09", pillarLabel: "Texas Law Enforcement & Public Safety", pillarHref: "/texas-law-enforcement", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "TCOLE establishes and administers statewide licensing and training standards for covered law-enforcement personnel.",
      "A peace-officer license and employment by a particular agency are related but separate matters.",
      "Training and continuing-education requirements can change through legislation and commission rules, so current TCOLE guidance controls.",
    ],
    intro: [
      "Texas law-enforcement standards are not determined independently by every police department or sheriff. The Texas Commission on Law Enforcement administers statewide licensing and training requirements for peace officers and other covered licensees, while agencies make their own hiring and employment decisions within that framework.",
      "That distinction is important when a story involves academy training, an officer's license, agency discipline, termination, or state licensing action. Those processes can overlap without being the same proceeding.",
    ],
    sections: [
      { heading: "Licensing and academy standards", paragraphs: [
        "TCOLE establishes minimum standards and oversees licensing examinations and approved training structures. Candidates generally must satisfy statutory and commission requirements before receiving a Texas peace-officer license.",
        "An academy prepares a candidate for licensing requirements, but successful completion of training should not be confused with permanent employment by a particular agency. Hiring agencies can impose additional lawful standards.",
      ]},
      { heading: "Continuing education", paragraphs: [
        "Licensed officers are subject to continuing-education and training requirements that can include legislatively mandated topics and commission rules. Requirements may depend on license level, assignment, cycle, or other circumstances.",
        "Because training mandates can change, current TCOLE rules and agency training records are more reliable than an old list of required courses.",
      ]},
      { heading: "Licensing action versus agency discipline", paragraphs: [
        "An agency can investigate, discipline, suspend, or terminate an employee under employment rules and law. TCOLE separately has authority over state licenses and compliance within its statutory jurisdiction.",
        "A termination does not automatically explain the status of a state license, and a licensing matter does not necessarily describe every employment consequence. Reporting should identify which process is actually occurring.",
      ]},
      { heading: "Records to distinguish", bullets: [
        "TCOLE license and training records.",
        "Agency personnel and disciplinary records, subject to applicable disclosure law.",
        "Criminal or administrative investigation records.",
        "Court records when a dispute becomes litigation.",
      ]},
    ],
    faq: [
      { q: "What is TCOLE?", a: "The Texas Commission on Law Enforcement is the state agency that administers licensing, training standards, and related regulatory responsibilities for covered Texas law-enforcement licensees." },
      { q: "Does TCOLE hire police officers for local departments?", a: "No. Local and state agencies make their own employment decisions. TCOLE administers state licensing and training standards." },
      { q: "Can training requirements change?", a: "Yes. The Legislature and TCOLE can change requirements, so current commission rules and guidance should be used." },
    ],
    sources: [
      { label: "Texas Commission on Law Enforcement", url: "https://www.tcole.texas.gov/" },
      { label: "TCOLE Rules Handbook", url: "https://www.tcole.texas.gov/content/rules-and-policy" },
      { label: "Texas Constitution and Statutes", url: "https://statutes.capitol.texas.gov/" },
    ],
    related: [...commonRelated, { label: "Texas law enforcement agencies guide", href: "/guides/texas-law-enforcement-agencies-guide" }],
  },

  "texas-jails-prisons-guide": {
    slug: "texas-jails-prisons-guide",
    title: "Texas Jails vs. Prisons: Who Runs Them and Who Goes Where",
    dek: "A guide to county jails, state prisons, TDCJ, the Texas Commission on Jail Standards, pretrial detention, sentences, and why jail and prison are not interchangeable terms.",
    updated: "2026-08-09", pillarLabel: "Texas Law Enforcement & Public Safety", pillarHref: "/texas-law-enforcement", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Texas county jails and state prisons are different systems with different operators, populations, oversight, and purposes.",
      "County sheriffs commonly operate local jails, while TDCJ operates the state prison system and other correctional programs.",
      "The Texas Commission on Jail Standards sets and enforces minimum standards for county jails within its jurisdiction.",
    ],
    intro: [
      "News coverage frequently uses 'jail' and 'prison' as if the words mean the same thing. In Texas they usually refer to different institutions. A person can be held in a county jail before trial, after a misdemeanor sentence, while awaiting transfer, or under other legal authority, while state prisons primarily house people committed to the Texas Department of Criminal Justice after qualifying felony convictions.",
      "The distinction affects who controls the facility, which records exist, what standards apply, and which government body is responsible for policy and funding.",
    ],
    sections: [
      { heading: "County jails", paragraphs: [
        "County jails are generally operated by sheriffs and funded through county government. They hold a mix of pretrial detainees, people serving certain sentences, individuals awaiting transfer, and others held under lawful authority.",
        "Pretrial detention is not the same as a criminal conviction. Reporting should distinguish an arrest, booking, bond status, charge, plea, conviction, sentence, and later transfer rather than collapsing them into one event.",
      ]},
      { heading: "State prisons and TDCJ", paragraphs: [
        "The Texas Department of Criminal Justice operates the state correctional system, including prisons and other programs tied to incarceration, parole, and community supervision functions under Texas law.",
        "A county jail may temporarily hold someone who will later enter TDCJ custody, but the county and state systems remain separate governmental operations with different budgets and oversight structures.",
      ]},
      { heading: "Jail standards", paragraphs: [
        "The Texas Commission on Jail Standards establishes minimum standards and inspects county jails within its jurisdiction. Compliance findings can become significant public-policy issues when staffing, health care, safety, capacity, or facility conditions are disputed.",
        "A jail standards finding should be read from the commission's actual inspection or remedial documents, because the nature and status of noncompliance can change over time.",
      ]},
      { heading: "Terms readers should keep separate", bullets: [
        "Arrest and booking.",
        "Pretrial detention and conviction.",
        "County jail and state prison.",
        "Sentence and parole eligibility.",
        "Jail inspection findings and criminal allegations involving jail staff or detainees.",
      ]},
    ],
    faq: [
      { q: "Who runs county jails in Texas?", a: "County sheriffs generally operate county jails, while county government provides funding and facilities under the Texas legal framework." },
      { q: "Who runs Texas state prisons?", a: "The Texas Department of Criminal Justice operates the state prison system and related correctional functions." },
      { q: "Who inspects Texas county jails?", a: "The Texas Commission on Jail Standards establishes minimum standards and conducts inspections within its statutory jurisdiction." },
    ],
    sources: [
      { label: "Texas Commission on Jail Standards", url: "https://www.tcjs.state.tx.us/" },
      { label: "Texas Department of Criminal Justice", url: "https://www.tdcj.texas.gov/" },
      { label: "Texas Constitution and Statutes", url: "https://statutes.capitol.texas.gov/" },
    ],
    related: [...commonRelated, { label: "Texas sheriff vs. police vs. constable", href: "/guides/texas-sheriff-police-constable-guide" }],
  },

  "texas-criminal-justice-process-guide": {
    slug: "texas-criminal-justice-process-guide",
    title: "Texas Criminal Justice Process: From Arrest to Trial and Sentencing",
    dek: "A neutral, plain-English guide to arrest, booking, bail, charging, grand juries, pleas, trials, sentencing, appeals, and the distinct roles of police, prosecutors, judges, and juries.",
    updated: "2026-08-09", pillarLabel: "Texas Law Enforcement & Public Safety", pillarHref: "/texas-law-enforcement", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "An arrest is not a conviction; Texas criminal cases move through several stages and can end in dismissal, plea, trial, acquittal, conviction, or other dispositions.",
      "Police investigate and arrest under law, prosecutors decide what charges to pursue, judges manage court proceedings, and juries have defined fact-finding roles when a case goes to jury trial.",
      "Felony and misdemeanor procedures differ, and exact rights and deadlines are governed by current law and the facts of the case.",
    ],
    intro: [
      "Breaking-news coverage often captures the first step of a criminal case—the arrest—and then uses language that sounds final. Texas law provides a much longer process in which allegations are tested, charging decisions are made, defendants can challenge evidence and legal issues, and the state carries the burden required by law.",
      "This guide is designed for readers, not defendants seeking legal advice. Anyone personally facing a criminal charge should consult qualified counsel rather than rely on a general news explainer.",
    ],
    sections: [
      { heading: "Investigation, arrest, and booking", paragraphs: [
        "Law-enforcement agencies investigate suspected offenses and can make arrests when legal requirements are met. After arrest, booking creates custody and identification records and begins the jail and court process.",
        "An arrest reflects an accusation supported to the legal level required for that action; it is not a finding of guilt. News coverage should use 'accused,' 'charged,' or similarly precise language until a case is resolved.",
      ]},
      { heading: "Charging and prosecution", paragraphs: [
        "Prosecutors review cases and decide what charges to pursue within their authority. Felony cases can involve grand-jury proceedings, while misdemeanor charging follows different procedures.",
        "Police recommendations, arrest affidavits, prosecutor decisions, indictments, and final convictions are separate records. A change between those stages does not necessarily mean the earlier action was improper; evidence and legal review can evolve.",
      ]},
      { heading: "Plea, trial, and sentencing", paragraphs: [
        "Many criminal cases resolve through negotiated pleas, dismissals, diversion, or other dispositions rather than a jury trial. When a case goes to trial, the prosecution bears the applicable burden of proof and the defendant has constitutional and statutory rights.",
        "Sentencing depends on the offense, criminal history, enhancements, agreements, judicial findings, jury findings where applicable, and Texas law. A statutory range should not be presented as a prediction of a specific sentence.",
      ]},
      { heading: "Court-reporting precision", bullets: [
        "Distinguish arrest, charge, indictment, plea, conviction, and sentence.",
        "State whether allegations come from police, prosecutors, court filings, or testimony.",
        "Do not call a defendant guilty before a guilty plea or verdict and judgment.",
        "Use the actual court docket for current case status when available.",
      ]},
    ],
    faq: [
      { q: "Does being arrested in Texas mean someone has been convicted?", a: "No. An arrest begins or advances a criminal process; guilt must be resolved through a plea, trial, or other lawful disposition." },
      { q: "Who decides what criminal charges are filed?", a: "Prosecutors make charging decisions within their authority, although police provide investigative evidence and can make arrests under law." },
      { q: "Do all Texas criminal cases go to jury trial?", a: "No. Many cases resolve through dismissal, plea agreements, diversion, or other procedures. Trial rights remain important but not every case reaches a trial." },
    ],
    sources: [
      { label: "Texas Code of Criminal Procedure", url: "https://statutes.capitol.texas.gov/?link=CR" },
      { label: "Texas Penal Code", url: "https://statutes.capitol.texas.gov/?link=PE" },
      { label: "Texas Judicial Branch", url: "https://www.txcourts.gov/" },
    ],
    related: [...commonRelated, { label: "Texas jails vs. prisons", href: "/guides/texas-jails-prisons-guide" }],
  },

  "texas-emergency-response-guide": {
    slug: "texas-emergency-response-guide",
    title: "Texas Emergency Response Guide: Local Control, TDEM, DPS and State Assistance",
    dek: "How Texas emergency management works from local incident command through county and state response, disaster declarations, mutual aid, DPS support, and federal assistance.",
    updated: "2026-08-09", pillarLabel: "Texas Law Enforcement & Public Safety", pillarHref: "/texas-law-enforcement", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Most emergencies begin as local incidents managed by local officials and responders, with additional resources added as needs exceed local capacity.",
      "The Texas Division of Emergency Management coordinates statewide emergency-management functions and supports local jurisdictions.",
      "A governor's disaster declaration and a federal disaster declaration are different actions with different authorities and assistance consequences.",
    ],
    intro: [
      "Hurricanes, floods, wildfires, tornadoes, industrial accidents, winter weather, mass-casualty incidents, and other emergencies can bring city, county, regional, state, federal, nonprofit, utility, and private resources into the same response. That can make it difficult to tell who is actually in charge.",
      "Texas emergency management is built around local response with escalating support. The incident itself, local emergency-management structure, state assistance, disaster declarations, and federal aid should be treated as related but separate parts of the system.",
    ],
    sections: [
      { heading: "Local response comes first", paragraphs: [
        "Cities and counties maintain emergency-management responsibilities and local responders handle most incidents initially. Incident command is organized around the nature and location of the emergency rather than automatically transferring control to Austin when state resources arrive.",
        "Mutual aid allows neighboring jurisdictions and regional partners to provide personnel, equipment, and specialized capabilities when local resources are strained.",
      ]},
      { heading: "TDEM and state coordination", paragraphs: [
        "The Texas Division of Emergency Management coordinates the state's emergency-management program and supports local governments before, during, and after disasters. State operations can include resource coordination, logistics, planning, recovery, and requests for additional assistance.",
        "DPS, the Texas Military Department, TxDOT, health agencies, fire resources, utilities, and many other state entities can participate depending on the incident. Their presence does not mean each performs the same function.",
      ]},
      { heading: "Disaster declarations are not all the same", paragraphs: [
        "A Texas governor can issue state disaster declarations under state law. Federal disaster and emergency declarations operate under federal law and can unlock different forms of federal assistance after applicable requests and findings.",
        "Readers should identify which declaration occurred, the geographic area covered, the effective period, and what authority or assistance it actually triggers instead of treating every declaration as equivalent.",
      ]},
      { heading: "During a fast-moving emergency", bullets: [
        "Use local emergency management, National Weather Service, TDEM, TxDOT, utilities, and other responsible authorities for operational instructions.",
        "Distinguish evacuation orders from voluntary recommendations and identify the issuing authority.",
        "Do not treat social-media images or recycled disaster footage as verified current conditions.",
        "Check road, shelter, outage, and assistance information against current official sources.",
      ]},
    ],
    faq: [
      { q: "Does the governor take over every Texas disaster response?", a: "No. Local jurisdictions manage local incidents, with state resources and coordination added as needed. State declarations and assistance do not automatically eliminate local incident command." },
      { q: "What does TDEM do?", a: "The Texas Division of Emergency Management coordinates the state's emergency-management program and supports local jurisdictions in preparedness, response, recovery, mitigation, and resource coordination." },
      { q: "Is a Texas disaster declaration the same as a FEMA federal declaration?", a: "No. State and federal declarations arise under different laws and can trigger different authorities and assistance programs." },
    ],
    sources: [
      { label: "Texas Division of Emergency Management", url: "https://tdem.texas.gov/" },
      { label: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/" },
      { label: "FEMA — Disasters and Assistance", url: "https://www.fema.gov/disaster" },
      { label: "National Weather Service", url: "https://www.weather.gov/" },
    ],
    related: [...commonRelated, { label: "Texas law enforcement cornerstone guide", href: "/guides/texas-law-enforcement-public-safety-guide" }],
  },
};

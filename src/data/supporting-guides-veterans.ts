import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const commonRelated = [
  { label: "Texas Veterans & Military", href: "/texas-veterans" },
  { label: "Texas Politics & Government", href: "/texas-politics" },
  { label: "Texas Laws & Legislature", href: "/laws" },
];

export const VETERANS_SUPPORTING_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-veterans-benefits-guide": {
    slug: "texas-veterans-benefits-guide",
    title: "Texas Veterans Benefits Guide: Federal, State and Local Resources",
    dek: "A practical map of federal VA benefits, Texas Veterans Commission services, county assistance, education, employment, housing, and other resources for Texas veterans and families.",
    updated: "2026-08-09", pillarLabel: "Texas Veterans & Military", pillarHref: "/texas-veterans", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Veterans benefits are divided among federal, state, and local systems, so the correct agency depends on the benefit.",
      "The Texas Veterans Commission can help veterans navigate claims, employment, education, grants, and other state-supported services.",
      "Eligibility is fact-specific and changes can occur, so veterans should verify current rules with the administering agency before relying on a summary.",
    ],
    intro: [
      "Texas veterans may qualify for benefits from several layers of government at the same time. Federal VA programs can cover disability compensation, pensions, health care, education, insurance, home loans, and burial benefits, while Texas provides additional services and programs through state agencies and local offices.",
      "The challenge is often navigation. This guide separates the major systems so veterans and families can identify where to start, what to verify, and when an accredited representative or local veterans service officer may be useful.",
    ],
    sections: [
      { heading: "Federal VA benefits", paragraphs: [
        "The U.S. Department of Veterans Affairs administers major federal programs including disability compensation, pensions, health care, education benefits, home-loan guarantees, life insurance, and burial benefits. Eligibility varies by service history, discharge status, disability, income, dependency, and the specific program.",
        "Veterans should use VA's current eligibility pages or an accredited representative when a claim depends on medical evidence, service connection, effective dates, or appeals. Marketing claims should never substitute for an official benefits determination.",
      ]},
      { heading: "Texas Veterans Commission services", paragraphs: [
        "The Texas Veterans Commission is the state's principal veterans advocacy agency. Its programs include claims assistance, employment services, education oversight and support, grants, women veterans services, mental-health-related initiatives, and other resources.",
        "TVC does not replace the federal VA. It helps Texans navigate benefits and services and can connect veterans with the appropriate federal, state, or local channel.",
      ]},
      { heading: "County and local help", paragraphs: [
        "Many Texas counties have veterans service officers or other local resources that can help with claims, records, referrals, transportation, emergency needs, and local programs. Availability and scope differ by county.",
        "For veterans who are unsure where to begin, a county office or TVC can often help identify whether a problem belongs with VA, a Texas agency, an appraisal district, a school, a workforce office, or another institution.",
      ]},
      { heading: "Benefits navigation checklist", bullets: [
        "Identify whether the benefit is federal, state, county, or local.",
        "Gather service and discharge documents before beginning an application when required.",
        "Verify current eligibility and deadlines on the administering agency's official site.",
        "For claims representation, verify accreditation and understand any fee agreement before signing.",
      ]},
    ],
    faq: [
      { q: "What is the best first stop for a Texas veteran who does not know which benefit applies?", a: "The Texas Veterans Commission or a county veterans service office can help identify the correct federal, state, or local program and point the veteran toward the responsible agency." },
      { q: "Does Texas Veterans Commission approve federal VA disability claims?", a: "No. The U.S. Department of Veterans Affairs decides federal VA claims. TVC can provide claims assistance and advocacy to eligible Texas veterans." },
      { q: "Are all veterans benefits automatic after discharge?", a: "No. Many benefits require an application and have specific service, disability, residency, income, or other eligibility rules." },
    ],
    sources: [
      { label: "U.S. Department of Veterans Affairs — Benefits", url: "https://www.va.gov/" },
      { label: "Texas Veterans Commission", url: "https://www.tvc.texas.gov/" },
      { label: "Texas Veterans Portal", url: "https://veterans.portal.texas.gov/" },
    ],
    related: [...commonRelated, { label: "Texas veterans cornerstone guide", href: "/guides/texas-veterans-military-guide" }],
  },

  "texas-veteran-property-tax-guide": {
    slug: "texas-veteran-property-tax-guide",
    title: "Texas Veteran Property Tax Exemptions: A Practical Guide",
    dek: "How Texas disabled-veteran and surviving-spouse property-tax exemptions work, where to apply, and why disability rating and ownership details matter.",
    updated: "2026-08-09", pillarLabel: "Texas Veterans & Military", pillarHref: "/texas-veterans", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Texas provides property-tax exemptions for qualifying disabled veterans and certain surviving spouses, but the amount and type depend on statutory eligibility.",
      "County appraisal districts administer exemption applications locally under state law.",
      "Veterans should report relevant changes and verify current forms rather than assume a prior exemption automatically follows every move or ownership change.",
    ],
    intro: [
      "Texas property-tax benefits can be among the most valuable state benefits available to a qualifying disabled veteran or surviving spouse. They are also easy to oversimplify because different disability ratings and circumstances can produce different exemptions.",
      "This guide explains the administrative path and the questions a veteran should verify. It does not determine a specific taxpayer's eligibility or substitute for the county appraisal district, Texas Comptroller guidance, or professional advice in a complex ownership situation.",
    ],
    sections: [
      { heading: "The exemption depends on legal eligibility", paragraphs: [
        "Texas law provides several disabled-veteran property-tax provisions. Eligibility can depend on a VA disability rating, unemployability status, ownership, residence, surviving-spouse status, and other statutory facts.",
        "A veteran should use current Texas Comptroller guidance to identify the relevant exemption and then use the appraisal district's current application process. A disability rating alone should not be treated as a complete eligibility determination.",
      ]},
      { heading: "County appraisal districts administer the exemption", paragraphs: [
        "Property-tax exemptions are administered locally by county appraisal districts. The district reviews applications and supporting documentation under the Tax Code and statewide guidance.",
        "After moving, changing title, inheriting property, or experiencing a change in disability status, a veteran or surviving spouse should confirm what new application or documentation is required rather than assuming the prior county's records transfer automatically.",
      ]},
      { heading: "Surviving spouses have separate requirements", paragraphs: [
        "Texas law contains benefits for certain surviving spouses, but eligibility conditions can differ from those that applied to the veteran. Residence, remarriage, ownership, and the type of exemption may matter.",
        "Because surviving-spouse provisions are legal rules rather than discretionary benefits, applicants should verify the current statute and Comptroller guidance when circumstances change.",
      ]},
      { heading: "Application checklist", bullets: [
        "Check current statewide guidance and the county appraisal district's forms.",
        "Gather VA documentation and ownership/residence information requested by the form.",
        "Confirm filing deadlines and whether late-file provisions apply.",
        "Recheck eligibility after moving, changing ownership, remarriage, or a material VA rating change.",
      ]},
    ],
    faq: [
      { q: "Where does a Texas veteran apply for a property-tax exemption?", a: "Applications are generally filed with the county appraisal district that appraises the property. The Texas Comptroller publishes statewide guidance and forms." },
      { q: "Does every disabled veteran receive a complete homestead property-tax exemption?", a: "No. Texas has different disabled-veteran exemption provisions and eligibility rules. A total exemption can apply in certain qualifying circumstances, but not every disability rating produces the same benefit." },
      { q: "Can a surviving spouse qualify for a veteran-related property-tax exemption?", a: "Certain surviving spouses can qualify if statutory requirements are met. The exact requirements depend on the exemption and the spouse's circumstances." },
    ],
    sources: [
      { label: "Texas Comptroller — Property Tax Exemptions", url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/" },
      { label: "Texas Constitution and Statutes", url: "https://statutes.capitol.texas.gov/" },
      { label: "Texas Veterans Portal", url: "https://veterans.portal.texas.gov/" },
    ],
    related: [...commonRelated, { label: "Texas property tax laws explained", href: "/news/texas-property-tax-laws-explained" }],
  },

  "texas-veterans-land-board-guide": {
    slug: "texas-veterans-land-board-guide",
    title: "Texas Veterans Land Board Guide: Land, Home and Home-Improvement Programs",
    dek: "What the Texas Veterans Land Board does, how its land and housing programs fit into the wider veterans-benefits system, and what applicants should verify before applying.",
    updated: "2026-08-09", pillarLabel: "Texas Veterans & Military", pillarHref: "/texas-veterans", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "The Texas Veterans Land Board administers state programs involving land, home loans, home improvement, veterans homes, and veterans cemeteries.",
      "VLB programs are separate from federal VA programs even when a veteran may use or compare both.",
      "Rates, limits, eligibility, lenders, and program terms can change and should be verified directly before a financial decision.",
    ],
    intro: [
      "Texas has a veterans institution that many residents outside the military community rarely encounter: the Veterans Land Board. VLB programs can touch land purchases, home financing, home improvement, long-term care, and state veterans cemeteries.",
      "Because housing and land decisions involve large amounts of money, program summaries should be treated as starting points. Applicants need the current VLB terms, lender requirements, and eligibility rules in effect when they apply.",
    ],
    sections: [
      { heading: "Land and housing programs", paragraphs: [
        "VLB describes loan programs intended for eligible Texas veterans purchasing land, homes, or qualifying home improvements. These programs have their own limits, terms, and application processes.",
        "A veteran comparing VLB financing with a conventional loan or federal VA-backed mortgage should compare the complete transaction: interest rate, fees, down payment, insurance, taxes, lender requirements, and long-term cost.",
      ]},
      { heading: "Eligibility is a separate question from loan approval", paragraphs: [
        "Meeting veteran eligibility requirements does not necessarily mean a particular property, loan amount, lender, credit profile, or transaction will be approved. Program eligibility and underwriting are related but distinct questions.",
        "Applicants should verify service and residency requirements first, then work through the applicable loan or lender process using current documentation.",
      ]},
      { heading: "Veterans homes and cemeteries", paragraphs: [
        "The VLB also oversees Texas State Veterans Homes and Texas State Veterans Cemeteries. Those responsibilities make the board more than a lending program.",
        "Families considering long-term care or burial options should check current locations, eligibility, availability, costs, and application procedures directly with VLB because those facts can change.",
      ]},
      { heading: "Before applying", bullets: [
        "Confirm current veteran eligibility with VLB.",
        "Review current rates, limits, fees, and property requirements.",
        "Compare the full cost with other financing options rather than focusing on one advertised rate.",
        "Use only current VLB and participating-lender information for a transaction decision.",
      ]},
    ],
    faq: [
      { q: "Is the Texas Veterans Land Board the same as the federal VA?", a: "No. VLB is a Texas state program. The U.S. Department of Veterans Affairs administers separate federal programs, including the federal VA home-loan guaranty." },
      { q: "Does VLB lend only for rural land?", a: "VLB operates multiple programs, including land, home, and home-improvement programs. Current property and program requirements should be checked directly with VLB." },
      { q: "Does veteran eligibility guarantee financing approval?", a: "No. Eligibility for the veteran program and approval of a specific financing transaction are separate determinations." },
    ],
    sources: [
      { label: "Texas Veterans Land Board", url: "https://vlb.texas.gov/" },
      { label: "Texas Veterans Portal", url: "https://veterans.portal.texas.gov/" },
      { label: "VA Home Loans", url: "https://www.va.gov/housing-assistance/home-loans/" },
    ],
    related: [...commonRelated, { label: "Texas veterans benefits guide", href: "/guides/texas-veterans-benefits-guide" }],
  },

  "texas-military-installations-guide": {
    slug: "texas-military-installations-guide",
    title: "Texas Military Installations Guide: Bases, Missions and Local Impact",
    dek: "How Texas military installations affect service members, families, local economies, infrastructure, schools, housing, and state policy—and how to follow mission changes accurately.",
    updated: "2026-08-09", pillarLabel: "Texas Veterans & Military", pillarHref: "/texas-veterans", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Texas hosts major Army, Air Force, Navy, joint, training, aviation, medical, and reserve/guard installations and missions.",
      "Installation decisions can affect housing, schools, transportation, health care, employers, infrastructure, and local tax bases.",
      "Mission changes should be verified through the Department of Defense, service branch, installation, or official state/local sources rather than rumor.",
    ],
    intro: [
      "Military installations are communities, employers, infrastructure hubs, and strategic assets at the same time. A change in force structure or mission can affect thousands of service members and families while also changing demand for housing, schools, roads, health care, utilities, contractors, and small businesses.",
      "Keep TX Red treats installation news as both a defense story and a Texas public-policy story. The key is to distinguish an official mission decision from a proposal, study, budget request, construction plan, or local rumor.",
    ],
    sections: [
      { heading: "Different installations support different missions", paragraphs: [
        "Texas installations support training, aviation, medical care, logistics, cyber and intelligence work, operational units, reserve and guard missions, and other defense functions. The economic and community impact depends on the mission, personnel mix, construction footprint, and surrounding region.",
        "Readers should avoid assuming that every base expansion or reduction has the same local effect. Civilian employment, contractor spending, school enrollment, housing demand, and traffic can respond differently depending on what is changing.",
      ]},
      { heading: "Federal decisions create state and local consequences", paragraphs: [
        "Congress, the Department of Defense, service branches, and installation commands make many mission and budget decisions. Texas and local governments influence compatible land use, transportation, water, infrastructure, education, workforce, and community support around installations.",
        "That division of authority matters when evaluating political claims. A state official may advocate for a mission or fund supporting infrastructure without controlling the federal basing decision itself.",
      ]},
      { heading: "Military families are part of the policy picture", paragraphs: [
        "PCS moves can create recurring issues involving school enrollment, child care, professional licensing, employment for spouses, housing, vehicle registration, voting, and health care. State policy can reduce or increase friction in those areas even when the military assignment is federal.",
        "Installation coverage should therefore include family and community consequences rather than treating troop counts as the only relevant measure.",
      ]},
      { heading: "How to verify a base-related claim", bullets: [
        "Look for an official DoD, service-branch, installation, congressional, or budget document.",
        "Separate proposed funding from enacted funding and announced construction from completed construction.",
        "Identify whether the change affects permanent personnel, temporary training, civilian employees, contractors, or a specific unit.",
        "Check local infrastructure and housing impacts separately from federal mission authority.",
      ]},
    ],
    faq: [
      { q: "Who decides whether a Texas military installation gains or loses a mission?", a: "Mission and basing decisions are generally federal decisions involving the Department of Defense, military services, Congress, and applicable federal processes. State and local governments can advocate and support infrastructure but do not unilaterally assign federal missions." },
      { q: "Why are military bases an economic-policy topic for Texas?", a: "Installations affect employment, contractors, housing, schools, roads, utilities, health care, and local businesses, so force and mission changes can have broad regional effects." },
      { q: "Where can I verify official installation information?", a: "Use Department of Defense, service-branch, installation, congressional, and official budget or procurement sources for mission and funding claims." },
    ],
    sources: [
      { label: "U.S. Department of Defense", url: "https://www.defense.gov/" },
      { label: "Texas Military Preparedness Commission", url: "https://gov.texas.gov/organization/military" },
      { label: "Texas Military Department", url: "https://tmd.texas.gov/" },
    ],
    related: [...commonRelated, { label: "Texas veterans cornerstone guide", href: "/guides/texas-veterans-military-guide" }],
  },

  "texas-veteran-owned-business-guide": {
    slug: "texas-veteran-owned-business-guide",
    title: "Texas Veteran-Owned Business Guide: Certification, Contracting and Support",
    dek: "A starting guide to veteran entrepreneurship, federal certification, Texas contracting resources, financing, counseling, and the difference between marketing labels and formal eligibility.",
    updated: "2026-08-09", pillarLabel: "Texas Veterans & Military", pillarHref: "/texas-veterans", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Veteran-owned and service-disabled-veteran-owned business programs can have formal eligibility, ownership, control, and certification requirements.",
      "Federal contracting programs are administered through federal systems, while Texas procurement and business resources operate under separate state rules.",
      "Entrepreneurs should verify whether a particular opportunity requires certification, registration, a socioeconomic status, or no formal designation at all.",
    ],
    intro: [
      "Veterans starting or growing a Texas business can encounter a mix of general small-business resources and programs specifically aimed at veteran entrepreneurs. The useful first step is to separate business formation, financing, counseling, procurement, and certification because each follows a different process.",
      "A company may truthfully be veteran-owned without automatically qualifying for every government contracting preference. Formal programs can require specific ownership and control standards, documentation, and certification.",
    ],
    sections: [
      { heading: "Federal veteran contracting programs", paragraphs: [
        "The U.S. Small Business Administration administers certification for the federal Veteran Small Business Certification program, including service-disabled veteran-owned small businesses seeking access to certain federal contracting opportunities.",
        "Certification does not guarantee a contract. Businesses still need appropriate registrations, capabilities, pricing, past performance, and a strategy for the agencies that buy their products or services.",
      ]},
      { heading: "Texas procurement is a separate system", paragraphs: [
        "Texas state purchasing operates under state procurement rules and programs. A veteran entrepreneur should determine which Texas registrations, vendor systems, or historically underutilized business requirements may apply to a specific opportunity rather than assume federal certification transfers automatically.",
        "Local governments, universities, transit authorities, and other public entities can also have their own procurement processes. The solicitation controls the requirements for each opportunity.",
      ]},
      { heading: "Counseling and financing", paragraphs: [
        "Veteran entrepreneurs can use general SBA resources, Small Business Development Centers, Veterans Business Outreach Centers, lenders, and Texas small-business programs. Counseling can be particularly useful when a founder is deciding whether government contracting should be a core market or only one sales channel.",
        "Financing decisions should be based on repayment ability, terms, fees, collateral, and business economics. Veteran status alone does not turn a weak financing structure into a strong one.",
      ]},
      { heading: "Business development checklist", bullets: [
        "Choose the target market before pursuing certifications that may not be relevant.",
        "Verify ownership and control requirements for any formal veteran-business status.",
        "Register in the procurement systems required by the specific buyer.",
        "Build a capability statement, pricing discipline, and past-performance strategy alongside certification work.",
      ]},
    ],
    faq: [
      { q: "Does a veteran-owned Texas business need federal certification to call itself veteran-owned?", a: "Marketing descriptions and eligibility for a formal government contracting program are different issues. Federal set-aside programs can require SBA certification and specific ownership and control standards." },
      { q: "Does federal veteran certification automatically qualify a company for Texas contracts?", a: "No. Texas procurement follows state rules and the requirements of the specific solicitation. Federal certification and state procurement eligibility should be evaluated separately." },
      { q: "Where can veteran entrepreneurs get free or low-cost counseling?", a: "SBA resource partners, Veterans Business Outreach Centers, and Small Business Development Centers provide counseling and training resources in many areas." },
    ],
    sources: [
      { label: "SBA — Veteran Small Business Certification", url: "https://veterans.certify.sba.gov/" },
      { label: "SBA — Veteran-owned businesses", url: "https://www.sba.gov/business-guide/grow-your-business/veteran-owned-businesses" },
      { label: "Texas Comptroller — State Purchasing", url: "https://comptroller.texas.gov/purchasing/" },
    ],
    related: [...commonRelated, { label: "Texas Economy & Small Business", href: "/texas-economy" }],
  },

  "texas-military-overseas-voting-guide": {
    slug: "texas-military-overseas-voting-guide",
    title: "Texas Military and Overseas Voting Guide",
    dek: "How military members, eligible family members, and overseas Texas voters use federal and state voting procedures, ballots, deadlines, and official election resources.",
    updated: "2026-08-09", pillarLabel: "Texas Veterans & Military", pillarHref: "/texas-veterans", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Military and overseas voters can have special registration and ballot procedures under federal and Texas law.",
      "Election deadlines are time-sensitive and vary by election, so voters should use current official Texas and federal guidance.",
      "The Federal Voting Assistance Program and Texas Secretary of State are primary resources for UOCAVA voters.",
    ],
    intro: [
      "Military service and overseas residence can make ordinary voting procedures impractical. Federal law and Texas election procedures provide special mechanisms for eligible military and overseas voters, including registration and absentee-ballot processes designed for voters who may be far from their Texas county.",
      "Election rules and dates are inherently time-sensitive. This evergreen guide explains the system, but every voter should verify the current election calendar and submission instructions before acting.",
    ],
    sections: [
      { heading: "Who the special procedures are designed for", paragraphs: [
        "Federal UOCAVA protections generally cover members of the uniformed services, merchant marine, eligible family members, and U.S. citizens residing outside the United States. Texas implements procedures for eligible voters within its election system.",
        "Eligibility and voting residence questions can be fact-specific, especially after moves or long overseas assignments. Official state and federal guidance should be used when a voter's residence or status is uncertain.",
      ]},
      { heading: "The Federal Post Card Application", paragraphs: [
        "The Federal Post Card Application can serve as a key registration and ballot-request tool for eligible military and overseas voters. Submission methods and timing should be checked against the current Texas instructions and election deadlines.",
        "Voters should keep confirmation or tracking information when available and follow up with the appropriate county election office if they are unsure whether an application or ballot has been received.",
      ]},
      { heading: "Deadlines and ballot return matter", paragraphs: [
        "Military and overseas voting rules can include special transmission and return procedures, but they do not eliminate deadlines. Mailing time, electronic transmission options where authorized, and the voter's location can affect how early action is prudent.",
        "A voter should not rely on a deadline copied from an old article because each election has its own calendar. Texas Secretary of State and FVAP guidance should be checked for the specific election.",
      ]},
      { heading: "Voting checklist", bullets: [
        "Confirm UOCAVA eligibility and Texas voting residence.",
        "Use the current FPCA and Texas instructions.",
        "Check the exact election's registration, request, and ballot-return deadlines.",
        "Contact the county election office or FVAP when a ballot or application problem arises.",
      ]},
    ],
    faq: [
      { q: "What is UOCAVA?", a: "The Uniformed and Overseas Citizens Absentee Voting Act is the federal law that provides absentee-voting protections for qualifying uniformed-service members, family members, and overseas citizens." },
      { q: "Where should a Texas service member start for absentee voting?", a: "The Texas Secretary of State and Federal Voting Assistance Program provide official instructions and the Federal Post Card Application for eligible military and overseas voters." },
      { q: "Can I rely on last year's military voting deadlines?", a: "No. Election calendars change. Always verify the dates for the specific current election through official Texas election guidance." },
    ],
    sources: [
      { label: "Texas Secretary of State — Military and Overseas Voters", url: "https://www.sos.state.tx.us/elections/voter/reqabbm.shtml" },
      { label: "Federal Voting Assistance Program", url: "https://www.fvap.gov/" },
      { label: "VoteTexas.gov", url: "https://www.votetexas.gov/" },
    ],
    related: [...commonRelated, { label: "Texas Elections", href: "/elections/2026" }],
  },

  "texas-veteran-employment-guide": {
    slug: "texas-veteran-employment-guide",
    title: "Texas Veteran Employment Guide: Jobs, Skills, Licensing and Transition Resources",
    dek: "A guide to Texas veteran employment services, military skill translation, licensing, training, workforce offices, and resources for service members and spouses entering civilian careers.",
    updated: "2026-08-09", pillarLabel: "Texas Veterans & Military", pillarHref: "/texas-veterans", guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Texas Workforce Commission and Workforce Solutions offices provide employment resources for veterans and eligible spouses.",
      "Military experience often needs translation into civilian job titles, credentials, and measurable skills rather than simply being copied from a military resume.",
      "Occupational licensing and credential requirements vary by profession, so transitioning service members should verify the responsible Texas licensing authority early.",
    ],
    intro: [
      "Transitioning from military service to civilian employment is often a translation problem as much as a qualification problem. Leadership, logistics, maintenance, communications, medicine, cyber, aviation, intelligence, construction, and other military skills can be valuable in Texas industries, but civilian employers may use different job titles and credential requirements.",
      "Texas workforce programs can help veterans and spouses search for work, understand labor-market demand, prepare resumes, evaluate training, and navigate certain employment barriers. The best path depends on occupation and location.",
    ],
    sections: [
      { heading: "Texas workforce resources", paragraphs: [
        "The Texas Workforce Commission and local Workforce Solutions offices provide employment and training services, with veterans receiving priority of service in covered programs. Specialized veterans employment staff may assist eligible veterans with significant barriers to employment and employer outreach.",
        "Availability and program fit differ by individual and local area, so veterans should contact the relevant Workforce Solutions office for current services rather than assume every program operates identically statewide.",
      ]},
      { heading: "Translate military experience into civilian evidence", paragraphs: [
        "A military occupational specialty may contain experience that maps to several civilian jobs. Effective resumes explain responsibilities, team size, equipment, budgets, certifications, safety records, uptime, project outcomes, or other results in language a civilian hiring manager can recognize.",
        "Veterans should avoid stripping away the substance of military experience; the goal is to translate it. Job postings, O*NET, credentialing resources, and workforce counselors can help identify comparable civilian terminology.",
      ]},
      { heading: "Licensing and credentials can be occupation-specific", paragraphs: [
        "Some Texas occupations require a state license or other credential. Military training may help satisfy part of a requirement in some fields, but the responsible licensing board or agency controls the decision.",
        "Service members and spouses should investigate licensing before separation or relocation when possible, especially in health care, skilled trades, education, transportation, security, and other regulated occupations.",
      ]},
      { heading: "Transition checklist", bullets: [
        "Translate military duties into civilian skills and measurable results.",
        "Identify whether the target occupation requires a Texas license or credential.",
        "Use Workforce Solutions, veteran employment resources, and training benefits before paying for private services.",
        "Compare wages, location, benefits, travel, schedule, and advancement—not only job title.",
      ]},
    ],
    faq: [
      { q: "Do veterans receive priority at Texas workforce offices?", a: "Veterans and eligible spouses receive priority of service in qualifying U.S. Department of Labor-funded workforce programs, subject to program eligibility rules." },
      { q: "Can military training automatically become a Texas occupational license?", a: "Not universally. Recognition of military experience depends on the occupation and the responsible licensing authority. Veterans should verify requirements with the specific Texas board or agency." },
      { q: "Where can Texas veterans get job-search help?", a: "Texas Workforce Commission, local Workforce Solutions offices, Texas Veterans Commission, and federal veteran employment resources are good official starting points." },
    ],
    sources: [
      { label: "Texas Workforce Commission — Veterans", url: "https://www.twc.texas.gov/services/veterans" },
      { label: "Texas Veterans Commission — Employment", url: "https://www.tvc.texas.gov/employment/" },
      { label: "U.S. Department of Labor — Veterans' Employment and Training Service", url: "https://www.dol.gov/agencies/vets" },
    ],
    related: [...commonRelated, { label: "Texas veterans benefits guide", href: "/guides/texas-veterans-benefits-guide" }],
  },
};

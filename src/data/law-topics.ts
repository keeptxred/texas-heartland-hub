export type LawTopicSource = { label: string; url: string; note?: string };
export type LawTopic = {
  slug: string;
  title: string;
  dek: string;
  updated: string;
  quickAnswer: string;
  appliesTo: string[];
  framework: string[];
  keyRules: string[];
  questions: { q: string; a: string }[];
  sources: LawTopicSource[];
  related: { label: string; href: string }[];
};

const updated = "2026-08-19";

export const LAW_TOPICS: LawTopic[] = [
  {
    slug: "property-tax-law",
    title: "Texas Property Tax Law Explained",
    dek: "A permanent guide to the Texas Tax Code rules governing exemptions, appraisals, protests, tax-rate adoption, notices, and local property-tax administration.",
    updated,
    quickAnswer: "Texas property taxes are local taxes administered under state law. The Tax Code controls exemptions, appraisal standards, protest procedures, tax-rate adoption, notices, collections, and many taxpayer remedies, while local appraisal districts and taxing units perform most day-to-day administration.",
    appliesTo: ["Homeowners and landowners", "Businesses owning taxable property", "Appraisal districts and appraisal review boards", "Cities, counties, school districts, and special districts"],
    framework: [
      "Texas does not impose a state property tax. Instead, state statutes create the legal framework under which local governments appraise property, apply exemptions, adopt rates, send tax bills, and collect taxes.",
      "The most important legal distinction is between appraisal and taxation. Appraisal districts determine taxable value subject to statutory rules and protests; taxing units separately adopt tax rates and budgets. A dispute about value is therefore not the same proceeding as a dispute about a government's spending or tax-rate decision.",
      "Taxpayers should verify deadlines and remedies against the current Tax Code, Comptroller guidance, and their local appraisal district because protest, exemption, and payment deadlines can depend on the specific notice or property involved.",
    ],
    keyRules: ["Tax Code Chapter 11 covers exemptions, including homestead exemptions.", "Chapter 23 governs appraisal methods and taxable-value concepts.", "Chapter 26 governs tax-rate calculation, notices, voter-approval rules, and adoption procedures.", "Chapter 41 governs appraisal review board protests.", "Local appraisal districts administer appraisal; local taxing units set tax rates."],
    questions: [
      { q: "Who sets my Texas property-tax rate?", a: "Each local taxing unit that applies to the property adopts its own rate under state-law procedures. The appraisal district does not set those tax rates." },
      { q: "Where do I challenge an appraisal?", a: "Most appraisal disputes begin with the appraisal district and appraisal review board under Tax Code procedures. Further remedies can include arbitration or court review depending on the issue and eligibility." },
    ],
    sources: [
      { label: "Texas Tax Code", url: "https://statutes.capitol.texas.gov/?link=TX" },
      { label: "Texas Comptroller — Property Tax Assistance", url: "https://comptroller.texas.gov/taxes/property-tax/" },
    ],
    related: [{ label: "Property Tax Policy Tracker", href: "/policy/property-taxes" }, { label: "The Texas Case for Eliminating Property Taxes", href: "/texas-case/eliminate-property-taxes" }, { label: "Texas bills", href: "/bills" }],
  },
  {
    slug: "gun-carry-law",
    title: "Texas Gun and Carry Laws Explained",
    dek: "A permanent legal framework for Texas firearm possession, carry, prohibited places, licensing, criminal restrictions, and the interaction between state and federal law.",
    updated,
    quickAnswer: "Texas law generally allows eligible adults broad firearm possession and carry, but permitless carry did not erase prohibited-person rules, prohibited locations, criminal-use laws, signage rules, or federal firearms restrictions.",
    appliesTo: ["Texas firearm owners", "People carrying handguns in public", "Businesses and property owners", "License to Carry holders"],
    framework: [
      "Texas firearm law is spread across the Penal Code, Government Code, and other statutes rather than one single gun-law chapter. Penal Code Chapter 46 is a central starting point for unlawful possession and location restrictions.",
      "Texas permitless carry changed when an eligible person may carry without a License to Carry, but an LTC remains relevant in some circumstances. Federal restrictions continue to apply regardless of Texas law.",
      "Because criminal liability can depend on age, status, location, notice, and the specific weapon or conduct involved, readers should use the controlling statute for a real-world legal question rather than relying on a general summary.",
    ],
    keyRules: ["Penal Code Chapter 46 contains major weapons offenses and location rules.", "Penal Code Chapter 30 includes several notice/trespass provisions relevant to carry on private property.", "Government Code Chapter 411 contains the handgun licensing framework.", "Federal prohibited-person and federal location rules remain applicable in Texas."],
    questions: [
      { q: "Did constitutional carry eliminate the Texas LTC?", a: "No. Texas still operates the License to Carry program, and a license can remain useful for certain legal, reciprocity, or practical reasons." },
      { q: "Can a private business restrict carry?", a: "Texas law provides mechanisms for property owners to give legally significant notice in certain circumstances. The effect depends on the type of carry, signage or notice, and location." },
    ],
    sources: [{ label: "Texas Penal Code", url: "https://statutes.capitol.texas.gov/?link=PE" }, { label: "Texas Government Code", url: "https://statutes.capitol.texas.gov/?link=GV" }, { label: "Texas DPS — Handgun Licensing", url: "https://www.dps.texas.gov/section/handgun-licensing" }],
    related: [{ label: "Gun Rights Policy Tracker", href: "/policy/gun-rights" }, { label: "The Texas Case for Gun Rights", href: "/texas-case/gun-rights-over-gun-control" }, { label: "Texas bills", href: "/bills" }],
  },
  {
    slug: "self-defense-use-of-force",
    title: "Texas Self-Defense and Use-of-Force Law Explained",
    dek: "A plain-English starting point for Texas Penal Code Chapter 9, including self-defense, defense of others, property, deadly force, and the limits of justification defenses.",
    updated,
    quickAnswer: "Texas recognizes justification defenses for force in defined circumstances, but 'stand your ground' is not a blanket permission to use force. The legal analysis depends on reasonable belief, the threat, the amount of force used, whether the actor was engaged in criminal activity, and other statutory conditions.",
    appliesTo: ["Anyone evaluating Texas self-defense law", "Firearm owners", "Homeowners and occupants", "Victims and criminal defendants"],
    framework: ["Penal Code Chapter 9 contains Texas justification defenses. Separate sections address protection of persons, third persons, property, and special circumstances.", "Deadly force carries additional statutory requirements. A lawful right to possess a weapon does not itself establish that a particular use of force was justified.", "Self-defense disputes are highly fact-specific. This page is a legal framework, not advice about whether a particular shooting, assault, or confrontation was lawful."],
    keyRules: ["Penal Code §9.31 addresses self-defense using force.", "§9.32 addresses deadly force in defense of person.", "§9.33 addresses defense of a third person.", "§§9.41–9.43 address protection of property in specified circumstances.", "The statutory no-duty-to-retreat conditions do not eliminate the other justification requirements."],
    questions: [{ q: "Does Texas have a duty to retreat?", a: "Texas statutes remove a duty to retreat in specified circumstances when statutory conditions are met, but the remaining self-defense and deadly-force requirements still matter." }, { q: "Can deadly force be used only to protect property?", a: "Texas has specific provisions addressing deadly force to protect property, but they are narrower than a general right to defend property and depend on statutory circumstances." }],
    sources: [{ label: "Texas Penal Code — Chapter 9", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.9.htm" }],
    related: [{ label: "Gun Rights Policy Tracker", href: "/policy/gun-rights" }, { label: "Criminal Justice Policy Tracker", href: "/policy/criminal-justice" }, { label: "Texas law enforcement", href: "/texas-law-enforcement" }],
  },
  {
    slug: "election-law",
    title: "Texas Election Law Explained",
    dek: "A permanent guide to the Texas Election Code framework for voter registration, identification, early voting, mail ballots, polling places, counting, recounts, contests, and election administration.",
    updated,
    quickAnswer: "The Texas Election Code is the state's primary election-law framework. The Secretary of State serves as chief election officer, while counties and other local authorities conduct most elections under state law and official guidance.",
    appliesTo: ["Texas voters", "Candidates and campaigns", "County election officials", "Poll workers and poll watchers"],
    framework: ["Election law combines statewide statutory rules with local administration. The Secretary of State issues official forms and guidance, but county officials operate polling locations, process many ballots, conduct tabulation, and perform reconciliation and canvass functions.", "Rules differ depending on whether the election is a primary, general election, local election, runoff, recount, or contest. Party rules also matter in primary administration within the limits of state law.", "KTR distinguishes certified results from campaign claims, unofficial election-night returns, polls, forecasts, and allegations that have not been established through official records."],
    keyRules: ["The Election Code governs voter registration and eligibility procedures.", "State law establishes identification and voting procedures.", "Early voting and voting by mail have separate statutory requirements.", "Recounts and election contests are different legal processes.", "Certified results, not polls or forecasts, determine election outcomes."],
    questions: [{ q: "Who is Texas's chief election officer?", a: "The Texas Secretary of State serves as the state's chief election officer under the Election Code." }, { q: "Who actually runs polling places?", a: "County and other local election authorities conduct most voting operations under state law, depending on the election." }],
    sources: [{ label: "Texas Election Code", url: "https://statutes.capitol.texas.gov/?link=EL" }, { label: "Texas Secretary of State — Elections", url: "https://www.sos.state.tx.us/elections/" }, { label: "VoteTexas.gov", url: "https://www.votetexas.gov/" }],
    related: [{ label: "Election Law & Integrity Policy Tracker", href: "/policy/elections" }, { label: "Election Central", href: "/elections/2026" }, { label: "The Texas Case for Election Integrity", href: "/texas-case/election-integrity" }],
  },
  {
    slug: "parental-rights-education-law",
    title: "Texas Parental Rights in Education Law Explained",
    dek: "A permanent guide to Texas Education Code provisions affecting parental rights, access to records and curriculum, school governance, complaints, and education choice.",
    updated,
    quickAnswer: "Texas law recognizes specific parental rights in public education, including statutory rights involving access, information, records, and participation. Those rights coexist with school-district authority, student privacy rules, and other state and federal requirements.",
    appliesTo: ["Parents and guardians", "Public-school students", "School districts and trustees", "Teachers and administrators"],
    framework: ["Education Code Chapter 26 is a key starting point for statutory parental rights in Texas public schools. Other rights and obligations appear throughout the Education Code and federal law.", "A parental-rights claim can involve records, curriculum, instructional materials, surveys, medical or counseling issues, discipline, special education, or district complaint processes. Different statutes can govern different categories.", "School choice is related but legally separate: charter schools, transfers, private education, homeschooling, and state-funded choice programs each operate under their own legal rules."],
    keyRules: ["Education Code Chapter 26 establishes major parental-rights provisions.", "Local school boards exercise authority subject to state law and TEA oversight.", "Student-record access can also implicate federal privacy law.", "Special education rights are governed heavily by federal law as well as state implementation."],
    questions: [{ q: "Can a Texas parent inspect instructional materials?", a: "Texas law provides parental access rights to certain instructional materials and school information, subject to the controlling statute and applicable exceptions." }, { q: "Are all school policies controlled by TEA?", a: "No. State law and TEA establish major requirements, but locally elected boards retain substantial authority in areas not preempted or assigned elsewhere." }],
    sources: [{ label: "Texas Education Code", url: "https://statutes.capitol.texas.gov/?link=ED" }, { label: "Texas Education Agency", url: "https://tea.texas.gov/" }],
    related: [{ label: "Public Education Policy Tracker", href: "/policy/public-education" }, { label: "School Choice Policy Tracker", href: "/policy/school-choice" }, { label: "The Texas Case for Parental Rights and School Choice", href: "/texas-case/parental-rights-school-choice" }],
  },
  {
    slug: "open-records-public-information",
    title: "Texas Public Information Act Explained",
    dek: "A permanent guide to Texas Government Code Chapter 552: public-information requests, deadlines, exceptions, Attorney General rulings, costs, and government transparency.",
    updated,
    quickAnswer: "The Texas Public Information Act generally gives the public a right to request government records, subject to statutory exceptions. A request does not require special legal wording, but the governmental body and the Attorney General can have specific duties when information may be withheld.",
    appliesTo: ["Texans requesting government records", "State and local agencies", "Journalists and watchdog groups", "Public officials and records officers"],
    framework: ["Government Code Chapter 552 is the central Texas open-records statute. It starts from a policy favoring access to public information while creating specific mandatory and discretionary exceptions.", "A governmental body that wants to withhold information often must follow statutory procedures, which can include requesting an Attorney General decision unless a previous determination or other rule applies.", "The Act concerns existing information. It generally does not require an agency to answer questions, perform research, or create a new record that does not exist."],
    keyRules: ["Requests should identify the governmental body and records sought clearly enough to locate them.", "Different statutory deadlines apply to the governmental body and request process.", "Some information is confidential by law and cannot be released merely because an official prefers disclosure.", "Charges and cost estimates are governed by state rules.", "Open-meetings law is a separate body of law from the Public Information Act."],
    questions: [{ q: "Do I need a lawyer to file a Texas public-information request?", a: "No. Ordinary members of the public may request records. Clear descriptions, dates, names, and record types can make a request easier to process." }, { q: "Can an agency deny a request just because the records are embarrassing?", a: "Embarrassment is not itself a statutory exception. Withholding must rest on applicable law." }],
    sources: [{ label: "Texas Government Code — Chapter 552", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.552.htm" }, { label: "Texas Attorney General — Open Government", url: "https://www.texasattorneygeneral.gov/open-government" }],
    related: [{ label: "Texas Government", href: "/texas-government" }, { label: "Texas laws", href: "/laws" }, { label: "Texas Politics", href: "/texas-politics" }],
  },
  {
    slug: "eminent-domain-property-rights",
    title: "Texas Eminent Domain and Property Rights Law Explained",
    dek: "A permanent guide to Texas condemnation law, public-use requirements, compensation, procedure, landowner protections, and state limits on eminent domain authority.",
    updated,
    quickAnswer: "Texas law allows authorized entities to condemn private property for qualifying public uses, but the Texas and U.S. constitutions require legal authority and compensation. Statutes regulate procedure, offers, appraisals, hearings, and several landowner protections.",
    appliesTo: ["Landowners", "Pipeline and utility projects", "Transportation projects", "Governmental and authorized condemning entities"],
    framework: ["Property Code Chapter 21 contains major condemnation procedures. Government Code Chapter 2206 includes additional eminent-domain restrictions and reporting requirements.", "The existence of eminent-domain authority does not resolve every dispute. Landowners can contest authority, public use, procedure, valuation, damages, and other issues depending on the case.", "Infrastructure projects involving highways, transmission, pipelines, water, and local development can invoke different statutory authorities, which is why the identity and legal power of the condemning entity matter."],
    keyRules: ["Condemnation requires legal authority; not every private or governmental entity possesses it.", "Texas law requires procedural steps before and during condemnation.", "Compensation disputes can include the value taken and damages to remaining property.", "Landowner Bill of Rights requirements apply in covered proceedings."],
    questions: [{ q: "Can a private company ever use eminent domain in Texas?", a: "Some private entities can receive statutory condemnation authority for specified public-use infrastructure, but authority and compliance can be disputed." }, { q: "Who decides compensation?", a: "Texas condemnation procedure can involve special commissioners and court proceedings. The precise path depends on whether parties accept or challenge the award and other issues." }],
    sources: [{ label: "Texas Property Code — Chapter 21", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.21.htm" }, { label: "Texas Government Code — Chapter 2206", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.2206.htm" }, { label: "Texas Attorney General — Landowner's Bill of Rights", url: "https://www.texasattorneygeneral.gov/landowners-bill-rights" }],
    related: [{ label: "Housing & Property Rights Policy Tracker", href: "/policy/housing" }, { label: "The Texas Case for Strong Property Rights", href: "/texas-case/property-rights" }, { label: "Transportation Policy Tracker", href: "/policy/transportation" }],
  },
  {
    slug: "abortion-law",
    title: "Texas Abortion Law Explained",
    dek: "A permanent legal framework for Texas abortion restrictions, medical-emergency language, civil and criminal provisions, litigation, and the statutes governing abortion after Dobbs.",
    updated,
    quickAnswer: "Texas abortion law is not one single statute. Multiple Health and Safety Code provisions, civil statutes, licensing rules, and court decisions can matter. Chapter 170A is a central post-Dobbs criminal-law provision and includes statutory medical-emergency language.",
    appliesTo: ["Patients and families", "Physicians and hospitals", "Lawmakers and regulators", "Anyone evaluating Texas abortion policy"],
    framework: ["After Dobbs, Texas abortion policy is primarily governed by state statutes subject to remaining federal and state constitutional limits. Older and newer Texas provisions can overlap, which is why summaries that cite only one law can be incomplete.", "Medical-emergency disputes require precision. The controlling text, medical facts, court decisions, professional duties, and agency guidance matter more than political shorthand.", "KTR's editorial position is pro-life, but this law page is the factual legal layer and should not characterize a disputed legal rule more broadly than the statute or controlling court decision supports."],
    keyRules: ["Health and Safety Code Chapter 170A is a central Texas abortion restriction.", "Other Health and Safety Code provisions regulate abortion-related conduct and facilities.", "Civil-liability provisions can be separate from criminal-law provisions.", "Court decisions and official guidance can materially affect how statutory language is applied."],
    questions: [{ q: "Does Texas abortion law contain medical-emergency language?", a: "Yes. Relevant statutes include medical-emergency or life/major-bodily-function language, but how those standards apply to a specific case is a legal and medical question." }, { q: "Is one statute the entire Texas abortion law?", a: "No. Multiple statutes and legal authorities can apply, so a complete analysis requires more than citing a single section." }],
    sources: [{ label: "Texas Health & Safety Code — Chapter 170A", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.170A.htm" }, { label: "Texas Health & Safety Code", url: "https://statutes.capitol.texas.gov/?link=HS" }, { label: "Texas Judicial Branch", url: "https://www.txcourts.gov/" }],
    related: [{ label: "Life & Abortion Policy Tracker", href: "/policy/life-abortion" }, { label: "The Texas Case for Protecting Unborn Life", href: "/texas-case/protect-unborn-life" }, { label: "Texas bills", href: "/bills" }],
  },
  {
    slug: "administrative-rulemaking",
    title: "Texas Agency Rulemaking and the Texas Register Explained",
    dek: "A permanent guide to Texas administrative rulemaking, proposed and adopted rules, public comments, the Texas Register, agency authority, and judicial review.",
    updated,
    quickAnswer: "Texas agencies do not have unlimited power to make law. They adopt rules under authority delegated by statutes, generally following the Administrative Procedure Act and publication requirements that make proposed and adopted rules visible through the Texas Register.",
    appliesTo: ["Businesses and license holders", "State agencies", "Public-interest and trade groups", "Texans affected by agency rules"],
    framework: ["Government Code Chapter 2001 contains the Texas Administrative Procedure Act. It governs important parts of rulemaking, contested cases, and judicial review.", "The Texas Register is the official publication for proposed rules, adopted rules, notices, and other state-government material. It is therefore one of the best primary sources for detecting policy changes before they appear in ordinary news coverage.", "An agency rule must rest on lawful authority. Disputes can involve statutory delegation, required procedure, constitutional limits, economic impact, or whether the agency exceeded the Legislature's instructions."],
    keyRules: ["Proposed rules are generally published before adoption with notice and an opportunity for public comment.", "Adopted rules are published with required explanatory material.", "Emergency rulemaking has separate statutory standards.", "The Texas Administrative Code contains compiled agency rules after adoption.", "Courts can review agency action under applicable statutes and standards."],
    questions: [{ q: "Where can I see proposed Texas agency rules?", a: "The Texas Register publishes proposed rules and related notices. The Texas Administrative Code contains compiled adopted rules." }, { q: "Can an agency create any rule it wants?", a: "No. An agency must act within authority granted by law and follow applicable procedural and constitutional requirements." }],
    sources: [{ label: "Texas Government Code — Chapter 2001", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.2001.htm" }, { label: "Texas Register", url: "https://www.sos.texas.gov/texreg/index.shtml" }, { label: "Texas Administrative Code", url: "https://texreg.sos.state.tx.us/public/readtac$ext.ViewTAC" }],
    related: [{ label: "Texas Government Agencies", href: "/texas-government/agencies" }, { label: "Texas Politics", href: "/texas-politics" }, { label: "Texas bills", href: "/bills" }],
  },
  {
    slug: "local-government-authority",
    title: "Texas Local Government Authority Explained",
    dek: "A permanent guide to what Texas cities, counties, school districts, and special districts can do, where state preemption applies, and why local power differs by entity type.",
    updated,
    quickAnswer: "Texas local governments possess only the authority provided by the Texas Constitution and statutes, but that authority differs by entity. Home-rule cities have broader local powers than general-law cities, counties generally have more limited delegated powers, and school or special districts operate under separate statutory frameworks.",
    appliesTo: ["City and county residents", "Local elected officials", "Businesses regulated locally", "Taxpayers in school and special districts"],
    framework: ["Texas local power is fragmented among cities, counties, school districts, utility districts, hospital districts, appraisal districts, and many other entities. Calling all of them 'local government' can hide major legal differences.", "Home-rule municipalities can act broadly in local matters unless prohibited by state or federal law, while general-law municipalities and counties usually require clearer statutory authority.", "State preemption is a recurring political and legal conflict. The Legislature can limit local regulation, but whether a specific ordinance is preempted depends on the constitutional and statutory text at issue."],
    keyRules: ["Home-rule and general-law cities have different sources and scopes of authority.", "Counties are generally creatures of state law with enumerated or necessarily implied powers.", "School districts and special districts operate under their own enabling statutes and constitutional provisions.", "Local taxation and debt are subject to state constitutional and statutory limits.", "State preemption can invalidate otherwise valid local ordinances."],
    questions: [{ q: "Can a Texas county pass any ordinance it wants?", a: "No. Texas counties generally need statutory or constitutional authority for their actions and do not possess the same broad home-rule power as home-rule cities." }, { q: "Can Austin override a city ordinance?", a: "The Legislature can preempt local regulation within constitutional limits. Whether a particular state law actually preempts a local ordinance depends on the text and legal issue." }],
    sources: [{ label: "Texas Local Government Code", url: "https://statutes.capitol.texas.gov/?link=LG" }, { label: "Texas Constitution", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.1.htm" }, { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" }],
    related: [{ label: "Texas Government", href: "/texas-government" }, { label: "Property Tax Policy Tracker", href: "/policy/property-taxes" }, { label: "Housing & Property Rights Policy Tracker", href: "/policy/housing" }],
  },
];

export function getLawTopic(slug: string): LawTopic | undefined {
  return LAW_TOPICS.find((topic) => topic.slug === slug);
}

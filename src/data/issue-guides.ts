export type IssueSource = {
  label: string;
  url: string;
  note?: string;
};

export type IssueGuide = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  quickAnswer: string;
  sections: Array<{ heading: string; body: string[] }>;
  sources: IssueSource[];
  relatedSlugs: string[];
  toolLinks?: Array<{ label: string; href: string }>;
};

export const ISSUE_CATEGORIES = [
  "Energy & Environment",
  "Border Security & Immigration",
  "Economy & Fiscal Policy",
  "Education & Parental Rights",
  "Constitutional Rights & Law Enforcement",
  "Election Integrity & Governance",
  "Healthcare, Social Issues & Rural Life",
] as const;

export const issueGuides: IssueGuide[] = [
  {
    slug: "texas-oil-gas-federal-regulation",
    category: "Energy & Environment",
    title: "Texas Oil & Gas: Who Regulates What?",
    dek: "A practical guide to the state and federal agencies, laws, mineral-rights questions, permitting fights, and economic stakes surrounding Texas oil and gas.",
    quickAnswer: "Texas controls much of the day-to-day regulation of drilling and production, while federal law and agencies still shape air emissions, water rules, pipelines, federal lands, exports, endangered species, and interstate commerce. The real policy fight is usually not whether regulation exists, but which level of government sets the rule and how costly or restrictive that rule becomes.",
    sections: [
      { heading: "The Texas side of the system", body: ["The Railroad Commission of Texas is the state's principal oil-and-gas regulator. Its responsibilities include drilling permits, well plugging, pipeline safety functions, and regulation intended to prevent waste of oil and gas resources. The Texas Commission on Environmental Quality separately administers major state environmental programs, including many air and water permits.", "That split matters because a single project can face several regulatory tracks. A drilling permit, air authorization, water-related approval, pipeline requirement, local land-use issue, and private mineral-rights dispute are not the same legal question."] },
      { heading: "Where Washington enters", body: ["Federal authority can arise through environmental statutes, interstate pipelines, federal minerals, endangered-species protections, export rules, workplace regulation, and other national programs. Texas political disputes therefore often center on federal rules that apply to facilities physically located inside the state.", "For readers evaluating claims of federal overreach, the useful questions are specific: Which statute authorizes the rule? Which agency issued it? Does Texas have delegated authority to administer the program? Is litigation pending? And what does the rule require in practice?"] },
      { heading: "Why the Permian Basin and Gulf Coast matter", body: ["The Permian Basin links drilling, mineral royalties, employment, severance taxes, local tax bases, pipelines, refining, petrochemicals, and exports. Gulf Coast refineries and LNG facilities connect Texas production to national and international markets. That makes federal permitting, export policy, refinery standards, and pipeline capacity recurring Texas fiscal and political issues."] },
      { heading: "What Keep TX Red will track", body: ["This guide is the permanent landing page for KTR coverage of federal oil-and-gas rules, Railroad Commission policy, drilling and pipeline permitting, mineral and surface rights, LNG, refining, the Permian Basin, Eagle Ford Shale, and state-versus-federal natural-resource authority. Breaking stories should link back here for context, while this page links readers to the underlying primary sources."] },
    ],
    sources: [
      { label: "Railroad Commission of Texas", url: "https://www.rrc.texas.gov/" },
      { label: "Texas Commission on Environmental Quality", url: "https://www.tceq.texas.gov/" },
      { label: "U.S. Environmental Protection Agency", url: "https://www.epa.gov/" },
      { label: "Texas Natural Resources Code", url: "https://statutes.capitol.texas.gov/Docs/NR/htm/NR.81.htm" },
    ],
    relatedSlugs: ["ercot-grid-reliability", "texas-state-federal-power", "texas-economy-no-income-tax", "texas-water-policy"],
  },
  {
    slug: "ercot-grid-reliability",
    category: "Energy & Environment",
    title: "ERCOT & the Texas Power Grid: Reliability, Generation and Reform",
    dek: "How ERCOT, the Public Utility Commission, generators, transmission companies, and state lawmakers divide responsibility for keeping the Texas grid reliable.",
    quickAnswer: "ERCOT operates the wholesale market and grid for most of Texas, but it does not own power plants or transmission lines. The Public Utility Commission regulates the market, and the Legislature sets major policy. Reliability depends on enough generation, transmission, fuel, reserves, and operational flexibility being available when demand peaks.",
    sections: [
      { heading: "What ERCOT actually does", body: ["ERCOT coordinates grid operations, manages the wholesale electricity market, forecasts demand, procures reliability services, and directs system operations across most of Texas. It is not a conventional utility and does not itself build most generation.", "That distinction is important whenever politicians say ERCOT should 'build' a certain type of plant. Generation investment, market incentives, PUC rules, transmission planning, fuel supply, and legislative policy all interact."] },
      { heading: "Dispatchable power and intermittent generation", body: ["Texas has added large amounts of wind and solar generation while natural gas, coal, nuclear, storage, and demand-response resources continue to play different reliability roles. The policy question is not simply which technology produces the cheapest megawatt-hour in isolation; it is how the system values dependable capacity during tight conditions, transmission needs, fuel security, and the cost of maintaining reserves."] },
      { heading: "Post-2021 reforms", body: ["After Winter Storm Uri, Texas lawmakers changed governance, weatherization, market design, emergency coordination, and other grid rules. Those reforms are best evaluated against the enacted statutes, PUC rules, ERCOT protocols, and reliability reports rather than campaign shorthand."] },
      { heading: "Growth is the next stress test", body: ["Population growth, industrial development, data centers, electrification, and new manufacturing loads can increase peak demand. KTR will use this guide to connect those load-growth stories with generation additions, retirements, transmission projects, reserve margins, and policy proposals."] },
    ],
    sources: [
      { label: "ERCOT", url: "https://www.ercot.com/" },
      { label: "Public Utility Commission of Texas", url: "https://www.puc.texas.gov/" },
      { label: "Texas Utilities Code", url: "https://statutes.capitol.texas.gov/Docs/UT/htm/UT.39.htm" },
      { label: "SB 2, 87th Legislature (2021) — enrolled text", url: "https://capitol.texas.gov/tlodocs/87R/billtext/html/SB00002F.HTM" },
      { label: "SB 3, 87th Legislature (2021) — enrolled text", url: "https://capitol.texas.gov/tlodocs/87R/billtext/html/SB00003F.HTM" },
    ],
    relatedSlugs: ["texas-oil-gas-federal-regulation", "texas-state-federal-power", "texas-water-policy", "texas-economy-no-income-tax"],
  },
  {
    slug: "texas-border-security-operation-lone-star",
    category: "Border Security & Immigration",
    title: "Texas Border Security & Operation Lone Star: Laws, Spending and Authority",
    dek: "A source-first guide to Operation Lone Star, state border barriers, National Guard and DPS deployments, state immigration laws, federal authority, litigation, and taxpayer costs.",
    quickAnswer: "Texas has spent billions on state-led border security through Operation Lone Star, using DPS, the Texas National Guard, barriers, grants, and other programs. Immigration enforcement is principally federal, which is why state efforts to create or enforce immigration-related crimes have generated major constitutional litigation.",
    sections: [
      { heading: "What Operation Lone Star includes", body: ["Operation Lone Star is an umbrella for state border-security activity rather than one stand-alone statute. It has included DPS deployments, Texas National Guard missions, local grants, border barriers, prosecutions under state law, and state-funded infrastructure.", "Readers should separate operational announcements from appropriations. KTR will link budget claims to appropriations documents, agency reports, contracts, or Legislative Budget Board material whenever those records are available."] },
      { heading: "The state-versus-federal legal question", body: ["The Constitution gives the federal government substantial authority over immigration and foreign affairs, while Texas argues that it retains important sovereign police powers and constitutional protections when border conditions threaten the state. The boundary between those powers is being litigated through specific statutes and cases rather than resolved by political slogans alone."] },
      { heading: "SB 4 and state immigration crimes", body: ["The 2023 fourth-called-session SB 4 created state offenses relating to illegal entry and reentry and authorized certain removal orders. Because the law directly intersects federal immigration authority, its implementation became the subject of federal litigation. KTR coverage should identify the exact version of SB 4 being discussed because multiple Texas bills have carried that number in different sessions."] },
      { heading: "What belongs in this coverage cluster", body: ["This guide connects KTR reporting on the Texas border wall, tactical barriers, National Guard deployments, DPS operations, fentanyl and cartels, human smuggling, detention capacity, border-county costs, ranch and property damage, surveillance technology, E-Verify proposals, and litigation over state authority."] },
    ],
    sources: [
      { label: "Texas Department of Public Safety — Operation Lone Star", url: "https://www.dps.texas.gov/section/operation-lone-star" },
      { label: "Texas Military Department", url: "https://tmd.texas.gov/" },
      { label: "SB 4, 88th Legislature, 4th Called Session (2023)", url: "https://capitol.texas.gov/tlodocs/884/billtext/html/SB00004F.HTM" },
      { label: "U.S. Constitution, Article I", url: "https://constitution.congress.gov/constitution/article-1/" },
    ],
    relatedSlugs: ["texas-state-federal-power", "texas-election-law", "rural-texas"],
  },
  {
    slug: "texas-election-law",
    category: "Election Integrity & Governance",
    title: "Texas Election Law: Voter ID, Mail Ballots, Poll Watchers and Election Security",
    dek: "What Texas law actually requires for voting, voter registration, mail ballots, poll watchers, voting systems, voter-roll maintenance, and election administration.",
    quickAnswer: "Texas elections are governed primarily by the Texas Election Code, federal voting law, Secretary of State guidance, and court decisions. The 2021 Election Integrity Protection Act changed multiple rules involving registration, voting by mail, poll watchers, election officers, and criminal penalties.",
    sections: [
      { heading: "Start with the Election Code", body: ["Election claims are unusually easy to distort when a proposal, old rule, court order, and current statute are blended together. KTR's baseline is the current Texas Election Code plus official Secretary of State election guidance.", "For voter ID, mail voting, voter rolls, polling-place procedures, and watchers, readers should be able to move from an article directly to the controlling source."] },
      { heading: "What SB 1 changed", body: ["Senate Bill 1 from the 87th Legislature's second called session addressed election integrity and security across numerous parts of the Election Code. It included provisions involving voter registration, poll watchers, voting by mail, assistance to voters, election officers, voting systems, and enforcement.", "Because later lawsuits and legislation can affect how individual provisions operate, KTR will avoid treating a 2021 summary as a substitute for current law."] },
      { heading: "Paper trails, machines and cybersecurity", body: ["Voting-system security involves certification, physical controls, chain of custody, auditability, county procedures, and cybersecurity. A useful election-security story should identify the machine or process at issue and the official standard it is being measured against."] },
      { heading: "Election Central connections", body: ["This evergreen guide provides the law-and-process background for KTR Election Central coverage of candidates, districts, polling, early voting, Election Day, results, recounts, redistricting, and litigation." ] },
    ],
    sources: [
      { label: "Texas Election Code", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.1.htm" },
      { label: "Texas Secretary of State — Elections", url: "https://www.sos.state.tx.us/elections/" },
      { label: "SB 1, 87th Legislature, 2nd Called Session (2021) — enrolled text", url: "https://capitol.texas.gov/tlodocs/872/billtext/html/SB00001F.HTM" },
    ],
    relatedSlugs: ["texas-state-federal-power", "texas-border-security-operation-lone-star"],
    toolLinks: [{ label: "Go to KTR Election Central", href: "/elections" }],
  },
  {
    slug: "texas-school-choice-esas",
    category: "Education & Parental Rights",
    title: "Texas School Choice & Education Savings Accounts: What the Law Does",
    dek: "A source-first explanation of Texas education savings accounts, eligibility, approved expenses, oversight, public-school funding arguments, and implementation.",
    quickAnswer: "Texas enacted an education savings account framework in the 89th Legislature through SB 2. The program is designed to let eligible families use state-supported accounts for approved education expenses outside the traditional public-school system, subject to eligibility, vendor, reporting, and anti-fraud rules.",
    sections: [
      { heading: "What an ESA is — and is not", body: ["An education savings account is not simply a cash payment handed to a parent. Under the enacted framework, funds are administered for authorized educational expenses and participating providers and vendors are subject to program requirements.", "That distinction matters when comparing ESAs with vouchers, tax-credit scholarships, charter schools, homeschooling, and ordinary public-school transfers."] },
      { heading: "The central policy dispute", body: ["Supporters frame school choice as parental control, educational competition, and an escape valve for students whose assigned school is not meeting their needs. Opponents focus on public-school funding, accountability, access in rural areas, and whether public money should support private education. KTR's evergreen coverage should make those arguments testable against the statute, appropriations, participation data, and actual implementation."] },
      { heading: "Rural Texas deserves separate analysis", body: ["School-choice effects can differ sharply between a large metro area with many private providers and a rural county with few alternatives. Participation rates, provider availability, transportation distance, and district fixed costs should be tracked rather than assumed."] },
      { heading: "Implementation is now the story", body: ["Once a program is enacted, the highest-value questions shift from campaign promises to execution: who qualifies, how accounts are funded, which expenses are approved, how vendors qualify, how fraud controls work, how many families participate, and what the measured fiscal effects are."] },
    ],
    sources: [
      { label: "SB 2, 89th Legislature (2025) — enrolled bill analysis", url: "https://capitol.texas.gov/tlodocs/89R/analysis/html/SB00002F.htm" },
      { label: "Texas Education Code", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.1.htm" },
      { label: "Texas Education Agency", url: "https://tea.texas.gov/" },
    ],
    relatedSlugs: ["parental-rights-texas-schools", "rural-texas", "texas-state-federal-power"],
  },
  {
    slug: "parental-rights-texas-schools",
    category: "Education & Parental Rights",
    title: "Parental Rights in Texas Public Schools: Curriculum, Records, Health and Governance",
    dek: "Where Texas law gives parents rights over school records, curriculum access, consent, complaints, board participation, and other education decisions — and where those rights have limits.",
    quickAnswer: "Texas law gives parents a defined set of rights in public education, but the details vary by subject. Curriculum access, student records, health services, instructional materials, opt-outs, complaints, and school-board procedures can be governed by different statutes and policies, so broad claims about a single universal 'parental right' should be checked against the specific rule at issue.",
    sections: [
      { heading: "The legal starting point", body: ["Chapter 26 of the Texas Education Code is a key starting point for parental rights in public schools. Other rights and procedures appear elsewhere in the Education Code, Health and Safety Code, federal education law, district policy, and court decisions."] },
      { heading: "Curriculum, books and transparency", body: ["Curriculum disputes often mix several distinct issues: access to instructional materials, library acquisition policies, classroom assignments, age appropriateness, objections, and the authority of local boards versus state standards. Good coverage identifies which process controls the disputed material rather than treating every book controversy as the same legal question."] },
      { heading: "Health, consent and student privacy", body: ["Health services, counseling, student records, third-party software, surveys, and consent requirements can raise separate state and federal questions. KTR will link readers to the operative statute or agency rule whenever reporting on a claimed consent or notification requirement."] },
      { heading: "School boards and accountability", body: ["Parents exercise influence not only through individual rights but through elected boards, public meetings, grievance procedures, state standards, and elections. That makes this guide a natural bridge between KTR education coverage and Election Central." ] },
    ],
    sources: [
      { label: "Texas Education Code, Chapter 26 — Parental Rights and Responsibilities", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.26.htm" },
      { label: "Texas Education Agency", url: "https://tea.texas.gov/" },
      { label: "Texas State Board of Education", url: "https://tea.texas.gov/about-tea/leadership/state-board-of-education" },
    ],
    relatedSlugs: ["texas-school-choice-esas", "texas-election-law", "texas-state-federal-power"],
  },
  {
    slug: "texas-gun-laws",
    category: "Constitutional Rights & Law Enforcement",
    title: "Texas Gun Laws: Constitutional Carry, Restricted Places and State-Federal Rules",
    dek: "A plain-English map of Texas firearm law, including permitless carry, licenses to carry, prohibited persons, restricted locations, property-owner notices, and federal overlays.",
    quickAnswer: "Texas generally allows eligible adults to carry a handgun without a license under the 2021 Firearm Carry Act, but permitless carry is not permission to carry everywhere or for everyone. State and federal prohibited-person rules, location restrictions, criminal trespass notices, school and court rules, and other exceptions still matter.",
    sections: [
      { heading: "What constitutional carry changed", body: ["HB 1927, effective September 1, 2021, changed Texas handgun-carry law for people who meet the statutory requirements and are not otherwise prohibited from possessing firearms. Texas still maintains its License to Carry system, which can matter for reciprocity and other legal situations."] },
      { heading: "Where broad summaries go wrong", body: ["The statement 'Texas is constitutional carry' is only a starting point. A complete answer can depend on the person's legal status, age, the type of location, posted notice, whether an event is occurring, whether alcohol sales are involved, and federal restrictions."] },
      { heading: "State rights and federal law", body: ["The Second Amendment and Article I, Section 23 of the Texas Constitution provide constitutional protections, while both governments regulate firearms in specific contexts. Federal prohibited-person rules and federal location restrictions can apply even when Texas law is permissive."] },
      { heading: "KTR coverage connections", body: ["This page should receive internal links from stories about constitutional carry, campus carry, red-flag proposals, firearm-industry lawsuits, sanctuary resolutions, federal firearm rules, and Texas criminal-law changes." ] },
    ],
    sources: [
      { label: "HB 1927, 87th Legislature (2021) — enrolled text", url: "https://capitol.texas.gov/tlodocs/87R/billtext/html/HB01927F.HTM" },
      { label: "Texas Penal Code, Chapter 46", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.46.htm" },
      { label: "Texas DPS — License to Carry", url: "https://www.dps.texas.gov/section/handgun-licensing" },
      { label: "U.S. Constitution — Second Amendment", url: "https://constitution.congress.gov/constitution/amendment-2/" },
    ],
    relatedSlugs: ["texas-state-federal-power", "texas-election-law"],
  },
  {
    slug: "texas-property-tax-relief",
    category: "Economy & Fiscal Policy",
    title: "Texas Property Tax Relief: Appraisals, Rates, Homesteads and School Taxes",
    dek: "How Texas property taxes are calculated, which government bodies control the moving pieces, and what lawmakers mean when they promise appraisal limits or tax relief.",
    quickAnswer: "Texas has no state property tax. Local taxing units levy property taxes, appraisal districts determine taxable values, exemptions reduce taxable value for eligible property, and state law constrains parts of the rate-setting and appraisal process. 'Property-tax relief' can therefore mean larger exemptions, rate compression, appraisal limits, levy limits, or other changes — and those approaches do not affect every taxpayer the same way.",
    sections: [
      { heading: "Value and tax rate are different", body: ["A property-tax bill is driven by taxable value and the tax rates adopted by the applicable taxing units. An appraisal increase does not by itself tell you the final percentage change in the bill, and a lower rate does not guarantee a lower bill if taxable value changes enough."] },
      { heading: "Homestead protections", body: ["Residence homesteads can qualify for exemptions and appraisal protections that do not apply identically to every other property type. Seniors, disabled homeowners, veterans, and other groups may have additional provisions depending on the exemption and taxing unit."] },
      { heading: "School-tax compression versus appraisal caps", body: ["Rate compression reduces a tax rate; an exemption removes part of value from taxation; and an appraisal cap limits certain growth in appraised value. Because they operate at different points in the formula, they produce different distributions of relief."] },
      { heading: "How KTR should cover new proposals", body: ["Every property-tax proposal should be translated into four questions: Which taxable value is affected? Which rate or taxing unit changes? Who qualifies? And how is the lost local revenue replaced, if at all? This keeps headline-sized promises tied to the mechanics homeowners actually see." ] },
    ],
    sources: [
      { label: "Texas Comptroller — Property Tax Assistance", url: "https://comptroller.texas.gov/taxes/property-tax/" },
      { label: "Texas Tax Code", url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.1.htm" },
      { label: "Texas Constitution, Article VIII", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.8.htm" },
    ],
    relatedSlugs: ["texas-economy-no-income-tax", "rural-texas", "texas-state-federal-power"],
    toolLinks: [{ label: "Texas spending-growth calculator", href: "/tools/texas-spending-growth-cap" }],
  },
  {
    slug: "texas-state-federal-power",
    category: "Election Integrity & Governance",
    title: "Texas vs. Washington: State Sovereignty, Federal Power and the Tenth Amendment",
    dek: "A constitutional guide to the recurring Texas fights over federal preemption, state police power, the Tenth Amendment, spending conditions, lawsuits, and local preemption.",
    quickAnswer: "The Tenth Amendment reserves powers not delegated to the United States to the states or the people, but the Constitution also grants substantial federal powers and makes valid federal law supreme. Whether Texas can resist a federal policy therefore turns on the source and scope of federal authority, limits on commandeering states, preemption doctrine, and the specific statute or regulation at issue.",
    sections: [
      { heading: "Federalism is a division of powers", body: ["State sovereignty does not mean federal law never controls, and federal supremacy does not mean Washington has unlimited power. Constitutional disputes usually require identifying the federal power being invoked, the state power being exercised, and the doctrine that resolves the conflict."] },
      { heading: "Preemption and anti-commandeering", body: ["Federal law can preempt conflicting state law when Congress acts within constitutional authority. Separately, anti-commandeering doctrine limits the federal government's ability to require states or state officers to administer a federal regulatory program. Those are different doctrines and should not be collapsed into a generic 'states' rights' argument."] },
      { heading: "Texas also preempts local governments", body: ["The same structural question appears inside Texas when state law limits city or county ordinances. KTR coverage of local preemption should identify the state statute, the local rule, and the precise conflict rather than treating home rule as absolute."] },
      { heading: "Where this guide connects", body: ["Border policy, environmental regulation, elections, firearms, healthcare mandates, education, land use, and emergency powers all generate recurring federalism disputes. This page is the constitutional hub tying those issue guides together." ] },
    ],
    sources: [
      { label: "U.S. Constitution — Tenth Amendment", url: "https://constitution.congress.gov/constitution/amendment-10/" },
      { label: "U.S. Constitution — Supremacy Clause", url: "https://constitution.congress.gov/browse/article-6/clause-2/" },
      { label: "Texas Constitution", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.1.htm" },
    ],
    relatedSlugs: ["texas-border-security-operation-lone-star", "texas-oil-gas-federal-regulation", "texas-election-law", "texas-gun-laws", "parental-rights-texas-schools"],
  },
  {
    slug: "texas-water-policy",
    category: "Healthcare, Social Issues & Rural Life",
    title: "Texas Water: Supply, Growth, Groundwater and the State Water Plan",
    dek: "A guide to Texas water planning, groundwater rights, reservoirs, infrastructure, drought, population growth, and the state-local divide in water management.",
    quickAnswer: "Texas water policy is fragmented across state agencies, river authorities, groundwater conservation districts, cities, utilities, and private rights. The State Water Plan projects long-term needs and recommends strategies, but individual projects still require funding, permits, local decisions, and often years of development.",
    sections: [
      { heading: "Texas plans decades ahead", body: ["The Texas Water Development Board coordinates regional planning into a statewide water plan. Those projections matter for debates over reservoirs, desalination, aquifer storage, reuse, pipelines, conservation, and financing."] },
      { heading: "Groundwater is not governed exactly like surface water", body: ["Texas groundwater law has a strong private-property tradition, while groundwater conservation districts can regulate pumping in many areas. Surface-water rights operate under a different statutory framework. Articles about 'Texas water rights' should therefore identify which resource is actually at issue."] },
      { heading: "Growth turns water into fiscal policy", body: ["Fast-growing communities need treatment plants, pipes, reservoirs or alternative supplies, and financing. Rural communities can face different problems: aging infrastructure, declining systems, drought exposure, and conflicts between agricultural and municipal demand."] },
      { heading: "Energy and water are linked", body: ["Power generation, oil and gas production, manufacturing, agriculture, and population growth all consume or depend on water. That makes water a natural cross-link between KTR's energy, economy, rural-life, and local-government coverage." ] },
    ],
    sources: [
      { label: "Texas Water Development Board", url: "https://www.twdb.texas.gov/" },
      { label: "Texas Water Code", url: "https://statutes.capitol.texas.gov/Docs/WA/htm/WA.1.htm" },
      { label: "Texas Commission on Environmental Quality — Water", url: "https://www.tceq.texas.gov/permitting/water_rights" },
    ],
    relatedSlugs: ["rural-texas", "texas-oil-gas-federal-regulation", "ercot-grid-reliability", "texas-property-tax-relief"],
  },
  {
    slug: "rural-texas",
    category: "Healthcare, Social Issues & Rural Life",
    title: "Rural Texas: Hospitals, Water, Agriculture, Broadband and Property Rights",
    dek: "A permanent policy hub for the issues that affect rural Texas differently from the state's fast-growing metropolitan counties.",
    quickAnswer: "Rural Texas policy cannot be reduced to agriculture alone. Hospital access, EMS, broadband, roads, water, school finance, energy projects, property rights, workforce shortages, land use, hunting, livestock, and population change interact differently in low-density counties than they do in major metros.",
    sections: [
      { heading: "Healthcare access", body: ["Rural hospital closures and service reductions can turn an ordinary medical need into a long drive. Telemedicine can expand access, but broadband, reimbursement, workforce, and emergency-care capacity remain limiting factors."] },
      { heading: "Land, agriculture and infrastructure", body: ["Ranchers and farmers encounter state policy through water rights, roads, pipelines, transmission lines, eminent domain, wildlife rules, taxes, and federal environmental programs. Infrastructure that benefits a growing state can still impose concentrated costs on the landowners whose property it crosses."] },
      { heading: "Schools and population", body: ["Rural school districts often cover large geographic areas and may have fewer alternative providers. School finance, transportation, teacher recruitment, school choice, and declining or rapidly changing enrollment therefore require separate analysis from metro districts."] },
      { heading: "A cross-topic rural lens", body: ["KTR will use this hub to connect rural hospital, broadband, water, school, property-rights, agriculture, energy, hunting and fishing, feral-hog, and local-government stories rather than leaving them as isolated headlines." ] },
    ],
    sources: [
      { label: "Texas Department of Agriculture", url: "https://texasagriculture.gov/" },
      { label: "Texas Health and Human Services", url: "https://www.hhs.texas.gov/" },
      { label: "Texas Broadband Development Office", url: "https://comptroller.texas.gov/programs/broadband/" },
      { label: "Texas Water Development Board", url: "https://www.twdb.texas.gov/" },
    ],
    relatedSlugs: ["texas-water-policy", "texas-school-choice-esas", "texas-property-tax-relief", "texas-border-security-operation-lone-star"],
  },
  {
    slug: "texas-economy-no-income-tax",
    category: "Economy & Fiscal Policy",
    title: "How Texas Pays for Government Without a State Individual Income Tax",
    dek: "Sales taxes, property taxes, severance taxes, franchise taxes, federal funds and other revenue streams explain both Texas's no-income-tax advantage and its fiscal tradeoffs.",
    quickAnswer: "Texas does not levy a state individual income tax. State government relies heavily on sales taxes and other revenue, while local governments depend substantially on property taxes and sales taxes. That structure shapes debates over property-tax relief, business competitiveness, state spending, and how revenue changes during economic cycles.",
    sections: [
      { heading: "No income tax does not mean no taxes", body: ["The useful comparison is the full tax structure rather than a single tax. Texans can face state and local sales taxes, property taxes, motor-fuel taxes, fees, and other levies even though wages are not subject to a state individual income tax."] },
      { heading: "Energy revenue matters", body: ["Oil and natural-gas activity can generate severance-tax revenue and influence broader sales, business, and local tax collections. That makes commodity cycles relevant to state budgeting and to transfers into constitutionally structured funds."] },
      { heading: "The spending side matters too", body: ["Tax competitiveness depends partly on how fast government spending grows and what taxpayers receive in return. One recurring conservative benchmark compares spending growth with population growth plus inflation; KTR's companion calculator lets readers test that benchmark with their own inputs."] },
      { heading: "Interstate comparisons need care", body: ["Comparisons with California, New York, Florida, or other states can be useful, but they should use equivalent measures and distinguish state taxes from local taxes. A headline marginal rate is not the same thing as a household's total effective tax burden." ] },
    ],
    sources: [
      { label: "Texas Comptroller — Revenue and Spending", url: "https://comptroller.texas.gov/transparency/revenue/" },
      { label: "Texas Constitution, Article VIII", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.8.htm" },
      { label: "Texas Tax Code", url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.1.htm" },
    ],
    relatedSlugs: ["texas-property-tax-relief", "texas-oil-gas-federal-regulation", "rural-texas"],
    toolLinks: [{ label: "Texas spending-growth calculator", href: "/tools/texas-spending-growth-cap" }],
  },
  {
    slug: "texas-dei-higher-education",
    category: "Education & Parental Rights",
    title: "Texas DEI Law at Public Universities: What SB 17 Prohibits and Requires",
    dek: "A primary-source guide to Texas's restrictions on DEI offices and practices at public institutions of higher education.",
    quickAnswer: "SB 17 from the 88th Legislature added Education Code Section 51.3525 and restricted DEI offices and certain DEI-related practices at Texas public institutions of higher education. The law is specific to covered institutions and defined practices; it is not a general ban on discussing race, discrimination, or diversity in every university context.",
    sections: [
      { heading: "What the statute targets", body: ["The enrolled law addresses DEI offices, certain employment and training practices, required DEI statements, preferences, and institutional responsibilities. Coverage should quote or link the statutory definition rather than using 'DEI ban' as if every activity involving diversity were identical."] },
      { heading: "Who must comply", body: ["The law applies to public institutions of higher education covered by the statute. Private universities and K-12 schools operate under different legal frameworks, so stories should avoid extending SB 17 beyond its actual scope."] },
      { heading: "Implementation and oversight", body: ["The most useful ongoing reporting tracks how institutions changed offices, staffing, training, hiring procedures, student services, and compliance policies, as well as any subsequent legislative changes or court rulings."] },
      { heading: "Free speech remains a separate question", body: ["Restrictions on university administration are not automatically the same as restrictions on student or faculty speech. Campus free-speech disputes should be analyzed under the law and policy that governs the specific conduct." ] },
    ],
    sources: [
      { label: "SB 17, 88th Legislature (2023) — enrolled text", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/SB00017F.htm" },
      { label: "Texas Education Code § 51.3525", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.51.htm" },
    ],
    relatedSlugs: ["parental-rights-texas-schools", "texas-state-federal-power", "texas-school-choice-esas"],
  },
  {
    slug: "texas-medical-transition-minors-law",
    category: "Healthcare, Social Issues & Rural Life",
    title: "Texas Law on Gender-Transition Procedures for Minors: What SB 14 Says",
    dek: "A source-first explanation of the 2023 Texas statute restricting specified gender-transition procedures and treatments for minors, including statutory exceptions.",
    quickAnswer: "SB 14 from the 88th Legislature restricts specified surgeries and prescription treatments for the purpose of transitioning a minor's biological sex or affirming a perception inconsistent with biological sex, while the statute also contains defined exceptions. Legal challenges and later legislation can affect application, so KTR links directly to the enacted text and current code.",
    sections: [
      { heading: "Read the operative language", body: ["This subject is frequently summarized with broader political terminology than the statute uses. KTR's standard is to identify the procedure or treatment at issue and compare it with the operative Health and Safety Code language."] },
      { heading: "Exceptions matter", body: ["The statute includes exceptions for specified medical circumstances. Those exceptions should be included whenever a story claims that a particular treatment is categorically prohibited."] },
      { heading: "Separate law from policy argument", body: ["Supporters and opponents sharply disagree about the medical, parental-rights, and constitutional implications of the law. An evergreen explainer should first establish what the statute says, then distinguish policy arguments and litigation from the text itself."] },
      { heading: "Keep the page current", body: ["Because health regulation is frequently litigated, KTR should update this guide when controlling court rulings, agency guidance, or later statutes materially change how the law operates." ] },
    ],
    sources: [
      { label: "SB 14, 88th Legislature (2023) — enrolled text", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/SB00014F.HTM" },
      { label: "Texas Health and Safety Code", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.161.htm" },
    ],
    relatedSlugs: ["parental-rights-texas-schools", "texas-state-federal-power"],
  },
  {
    slug: "texas-abortion-law-pro-life-policy",
    category: "Healthcare, Social Issues & Rural Life",
    title: "Texas Abortion Law & Pro-Life Policy: Current Law, Exceptions and Enforcement",
    dek: "A source-first guide to Texas abortion law after Dobbs, including the Chapter 170A prohibition, medical exceptions, related statutes, enforcement, funding debates, and the difference between current law and proposed changes.",
    quickAnswer: "Texas Health and Safety Code Chapter 170A generally prohibits knowingly performing, inducing, or attempting an abortion, while providing a statutory exception when a licensed physician, using reasonable medical judgment, determines that a pregnancy creates a life-threatening physical condition posing a risk of death or serious risk of substantial impairment of a major bodily function. Other Texas statutes also govern abortion-related conduct, so claims about the law should identify the exact provision and any applicable exception.",
    sections: [
      { heading: "Start with the current code, not an old trigger-law summary", body: ["Texas abortion law now operates through multiple statutes and has been amended since the original 2021 trigger-law enactment. Chapter 170A is a central starting point, but readers should also check related Health and Safety Code provisions, later amendments, agency guidance, and controlling court decisions before treating a past summary as current law.", "The highest-value KTR coverage should distinguish enacted law from bills that were filed but did not become law, and distinguish statutory text from political descriptions such as 'total ban' or 'exception-free' when those labels omit operative language."] },
      { heading: "Medical exceptions require precise language", body: ["Chapter 170A's exception turns on a licensed physician's reasonable medical judgment and a qualifying life-threatening physical condition tied to pregnancy. A story about emergency care should identify the statutory standard actually being applied rather than substituting a generalized political phrase.", "When later legislation changes definitions, procedures, or physician protections, this evergreen guide should be refreshed from the current code and enrolled bill text before KTR changes its summary."] },
      { heading: "Enforcement and funding are separate policy questions", body: ["Criminal, civil, professional-licensing, funding, insurance, and local-government questions can arise under different provisions. A dispute over taxpayer funding for abortion-related services is not necessarily governed by the same section as a physician's criminal exposure, and KTR should link each claim to the controlling source."] },
      { heading: "Where the continuing debate sits", body: ["Texas policy fights continue over medical-emergency standards, enforcement, interstate activity, abortion-inducing drugs, public funding, pregnancy-support programs, adoption and foster care, maternal health, and federal-state authority. The narrower Life & Abortion policy tracker should carry fast-changing implementation and litigation status; this page supplies the durable legal framework."] },
    ],
    sources: [
      { label: "Texas Health and Safety Code, Chapter 170A — Performance of Abortion", url: "https://tcss.legis.texas.gov/Docs/HS/htm/HS.170a.htm", note: "Current statutory prohibition and exception language." },
      { label: "Texas Health and Safety Code, Chapter 171", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.171.htm", note: "Additional abortion-related definitions and requirements." },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/", note: "Use enrolled bill text to verify later statutory amendments." },
    ],
    relatedSlugs: ["texas-medical-transition-minors-law", "texas-state-federal-power", "rural-texas", "texas-rural-healthcare"],
  },
  {
    slug: "texas-bail-criminal-justice",
    category: "Constitutional Rights & Law Enforcement",
    title: "Texas Bail & Criminal Justice: Public Safety, Due Process and Pretrial Release",
    dek: "How the Texas Constitution and Code of Criminal Procedure govern bail, personal bonds, conditions of release, public-safety considerations, detention, and the recurring debate over bail reform.",
    quickAnswer: "Texas bail decisions are governed by the Texas Constitution and Code of Criminal Procedure Chapter 17. Bail is intended to secure a defendant's appearance while protecting constitutional rights, and current law requires individualized consideration of statutory factors rather than treating every defendant or charge the same. Texas law also restricts personal bonds and authorizes denial of bail in specified circumstances.",
    sections: [
      { heading: "Bail is security for appearance, not a sentence", body: ["Chapter 17 defines bail as security given by an accused person to ensure appearance before the proper court. Because a defendant awaiting trial has not been convicted of the pending charge, pretrial rules operate within constitutional due-process limits even when lawmakers and judges place greater weight on public safety.", "That distinction is essential when evaluating proposals described as 'tougher bail.' The useful questions are which defendants are affected, whether the change concerns eligibility, amount, conditions, personal bonds, detention, or appellate review, and which constitutional provision authorizes the change."] },
      { heading: "Texas law requires individualized factors", body: ["Article 17.15 directs the decision-maker to follow constitutional and statutory rules when setting bail and conditions. The law requires sufficient assurance of compliance and says bail may not be used as an instrument of oppression, while also directing consideration of the nature and circumstances of the offense and other statutory factors.", "Recent sessions have continued to amend Chapter 17. Because publication of some amendments can lag a legislative session, KTR should check current statute notes and the enrolled bill whenever reporting on a newly enacted bail change."] },
      { heading: "Personal bonds, cash and surety bonds are different", body: ["A personal bond, a surety bond, and a cash deposit are different mechanisms. Political arguments often collapse them into the single phrase 'cash bail,' which can obscure what a bill or court order actually changes. KTR should name the release mechanism and the affected class of defendants."] },
      { heading: "Public safety and local accountability", body: ["Bail policy connects state constitutional rules with county jails, magistrates, prosecutors, defense counsel, court backlogs, mental-health systems, and local budgets. The narrower criminal-justice trackers should carry fast-changing legislative and implementation details, while this guide remains the constitutional and procedural background page."] },
    ],
    sources: [
      { label: "Texas Code of Criminal Procedure, Chapter 17 — Bail", url: "https://statutes.capitol.texas.gov/Docs/CR/htm/CR.17.htm", note: "Current bail definitions, eligibility rules, conditions and setting factors." },
      { label: "Texas Constitution, Article I", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.1.htm", note: "Includes constitutional bail and due-process provisions." },
      { label: "Texas Office of Court Administration", url: "https://www.txcourts.gov/", note: "Court administration and judicial-system resources." },
    ],
    relatedSlugs: ["texas-gun-laws", "texas-state-federal-power", "texas-election-law"],
  },
  {
    slug: "texas-rural-healthcare",
    category: "Healthcare, Social Issues & Rural Life",
    title: "Rural Healthcare in Texas: Hospitals, Workforce, Telemedicine and Access",
    dek: "A permanent guide to the state rules and programs shaping rural hospitals, emergency access, workforce shortages, telemedicine, limited-services rural hospitals, and rural healthcare finance.",
    quickAnswer: "Rural Texas healthcare depends on more than whether a county has a hospital. Emergency coverage, workforce, reimbursement, specialty access, telemedicine, transportation, broadband, facility licensing, and state and federal funding all affect whether care is realistically available. Texas HHSC regulates rural hospital facility categories and administers programs intended to support access, infrastructure, training, and financial stability.",
    sections: [
      { heading: "Access is a network, not a building count", body: ["A rural community can have a licensed facility and still lack obstetrics, trauma capability, behavioral-health capacity, specialty care, or enough clinicians to provide continuous coverage. KTR should therefore distinguish hospital closure from service-line reduction, staffing shortages, EMS travel time, and loss of specialty access.", "The policy question is often regional: what care can be stabilized locally, what must be transferred, how far patients travel, and whether communications and transportation systems make that transfer reliable."] },
      { heading: "Texas has a limited-services rural hospital framework", body: ["Texas maintains a specific licensing framework for limited services rural hospitals. HHSC rules define operational requirements for those facilities and have continued to receive updates, including rules effective in 2026. That framework is distinct from ordinary acute-care hospital licensing and should be named accurately when a facility converts or operates under the rural model."] },
      { heading: "Workforce, telemedicine and infrastructure interact", body: ["Recruiting physicians, nurses, therapists, technicians, and emergency personnel can be as important as capital spending. Telemedicine can extend specialist access, but it depends on workforce at the originating site, broadband, reimbursement, equipment, and a plan for patients who ultimately need in-person care.", "State rural-health initiatives should be evaluated by their eligibility rules, award documents, provider participation and measurable access outcomes rather than by the announced grant total alone."] },
      { heading: "Keep funding claims tied to the program", body: ["Rural hospital finance can include Medicare, Medicaid, private insurance, local hospital-district taxes, state grants, federal programs, uncompensated care and other sources. KTR should identify the exact program and funding period when reporting that Texas is 'spending' or 'cutting' a rural-health amount, because temporary grants and recurring reimbursement are not interchangeable."] },
    ],
    sources: [
      { label: "Texas Health and Human Services", url: "https://www.hhs.texas.gov/", note: "State health-facility regulation and rural-health programs." },
      { label: "Texas Register — Limited Services Rural Hospitals rules", url: "https://www.sos.texas.gov/texreg/archive/March62026/Adopted%20Rules/26.HEALTH%20AND%20HUMAN%20SERVICES.html", note: "2026 adopted HHSC rule for Chapter 511 facilities." },
      { label: "Texas Health and Safety Code", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.241.htm", note: "Hospital licensing statutes, including limited-services rural hospital authority." },
    ],
    relatedSlugs: ["rural-texas", "texas-water-policy", "texas-economy-no-income-tax", "texas-abortion-law-pro-life-policy"],
  },
  {
    slug: "texas-local-preemption-home-rule",
    category: "Election Integrity & Governance",
    title: "Texas vs. City Hall: Home Rule, State Preemption and Local Government Power",
    dek: "A source-first guide to when Texas cities and counties can regulate locally, when state law overrides them, and how the Texas Regulatory Consistency Act changed the preemption landscape.",
    quickAnswer: "Texas home-rule cities possess broad local authority, but that authority remains subject to the Texas Constitution and state law. HB 2127, the Texas Regulatory Consistency Act effective September 1, 2023, added express preemption provisions across several state codes and limited municipal and county regulation in fields occupied by those codes unless another statute expressly authorizes the local rule.",
    sections: [
      { heading: "Home rule is broad, not unlimited", body: ["Texas home-rule municipalities generally begin with broad local governing authority rather than needing a separate state statute for every action. But state constitutional and statutory preemption can limit that authority. Counties operate under a different legal structure and generally depend more directly on powers granted by state law.", "That makes 'local control' an incomplete legal answer. A disputed ordinance must be compared with the constitutional provision, state statute, and field of regulation at issue."] },
      { heading: "What HB 2127 changed", body: ["The 88th Legislature enacted HB 2127 as the Texas Regulatory Consistency Act. The enrolled act added preemption provisions across specified codes and stated that, unless another statute expressly authorizes the local action, municipalities and counties may not regulate conduct in a field occupied by provisions of those codes. The act also added a Local Government Code rule limiting municipal ordinances or rules to those consistent with state law.", "The act contains exceptions and savings provisions. KTR should not describe every city ordinance as automatically invalid; the relevant code, express statutory authorization and any controlling court ruling still matter."] },
      { heading: "Why preemption appears across policy areas", body: ["Employment rules, business regulation, natural resources, property, agriculture, finance, insurance, occupations and other subjects can trigger state-local conflicts. Other Texas statutes separately preempt local regulation in particular fields, so HB 2127 is not the only preemption law readers may encounter."] },
      { heading: "How KTR should cover local-state fights", body: ["Every preemption story should identify the local ordinance, the state provision alleged to control, the government body enforcing each rule, and whether litigation has produced a binding decision. This guide provides durable context while current-status policy trackers handle new ordinances, lawsuits and legislative amendments."] },
    ],
    sources: [
      { label: "HB 2127, 88th Legislature (2023) — enrolled text", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/HB02127F.htm", note: "Texas Regulatory Consistency Act." },
      { label: "HB 2127 — enrolled bill summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=HB2127&LegSess=88R", note: "Official Texas Legislature summary and effective date." },
      { label: "Texas Constitution, Article XI", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.11.htm", note: "Municipal corporations and home-rule constitutional framework." },
      { label: "Texas Local Government Code", url: "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.51.htm", note: "Municipal ordinance authority and state-law consistency provisions." },
    ],
    relatedSlugs: ["texas-state-federal-power", "texas-property-tax-relief", "texas-water-policy", "parental-rights-texas-schools"],
  },
];

export const issueGuideBySlug = Object.fromEntries(issueGuides.map((guide) => [guide.slug, guide])) as Record<string, IssueGuide>;

export function getGuidesByCategory(category: string) {
  return issueGuides.filter((guide) => guide.category === category);
}
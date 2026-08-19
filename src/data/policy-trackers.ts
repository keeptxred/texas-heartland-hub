export type PolicyTrackerSource = {
  label: string;
  url: string;
  primary?: boolean;
};

export type PolicyTrackerLink = {
  label: string;
  href: string;
  kind?: "editorial" | "facts" | "government" | "law" | "bill" | "tool" | "reference";
};

export type PolicyTracker = {
  slug: string;
  shortTitle: string;
  title: string;
  description: string;
  updated: string;
  quickAnswer: string;
  currentStatus: string;
  keyFacts: string[];
  context: string[];
  watchFor: string[];
  sources: PolicyTrackerSource[];
  related: PolicyTrackerLink[];
  keywords: string[];
};

const reviewed = "2026-08-19";

export const POLICY_TRACKERS: PolicyTracker[] = [
  {
    slug: "property-taxes",
    shortTitle: "Property Taxes",
    title: "Texas Property Tax Policy Tracker",
    description: "Track Texas property-tax relief, appraisal rules, school-tax compression, exemptions, local tax rates, legislation, and the debate over eliminating property taxes.",
    updated: reviewed,
    quickAnswer: "Texas has no state property tax. Local taxing units levy property taxes under state law, which means major relief proposals usually work through exemptions, school-tax compression, rate limits, appraisal rules, or replacing local revenue with another source.",
    currentStatus: "Property-tax relief remains one of the state's highest-profile fiscal issues. KTR tracks both short-term relief measures and the larger question of whether Texas can structurally reduce or ultimately eliminate major categories of property tax without disguising the replacement cost.",
    keyFacts: [
      "The Texas Comptroller does not set local property-tax rates or collect local property taxes; local taxing units do.",
      "School districts, counties, cities, community colleges, and special districts can all contribute to a property owner's total bill.",
      "Appraised value, exemptions, tax rates, voter-approval rules, state school-finance policy, and local debt can all affect the final burden.",
      "Any serious elimination plan has to identify which local services and school obligations remain, what revenue replaces the tax, and how the transition prevents a hidden tax shift.",
    ],
    context: [
      "KTR separates three questions that are often blended together: how property is appraised, how taxable value is calculated, and which elected taxing units set rates. A homeowner can receive appraisal relief and still see a bill rise if rates, debt service, or other taxing-unit decisions move in the opposite direction.",
      "The permanent policy question is bigger than any single legislative package. Texas can provide recurring relief while still leaving homeowners exposed to a tax that never disappears after a mortgage is paid. That is why this tracker connects current bills and relief measures to KTR's longer-term editorial case for eliminating property taxes.",
    ],
    watchFor: ["New homestead-exemption or compression proposals", "Changes to appraisal, protest, or truth-in-taxation rules", "Local bond elections and voter-approval tax-rate elections", "Plans that claim elimination and the revenue source proposed to replace the tax"],
    sources: [
      { label: "Texas Comptroller — Property Tax Assistance", url: "https://comptroller.texas.gov/taxes/property-tax/", primary: true },
      { label: "Texas Property Tax Code", url: "https://statutes.capitol.texas.gov/?link=TX", primary: true },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/", primary: true },
    ],
    related: [
      { label: "The Texas Case for Eliminating Property Taxes", href: "/texas-case/eliminate-property-taxes", kind: "editorial" },
      { label: "Property-tax facts & framework", href: "/texas-case/facts/eliminate-property-taxes", kind: "facts" },
      { label: "Texas property-tax laws explained", href: "/news/texas-property-tax-laws-explained", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Texas Comptroller", href: "/texas-government/comptroller", kind: "government" },
    ],
    keywords: ["property tax", "property taxes", "homestead exemption", "appraisal", "appraisal district", "tax relief", "school taxes", "tax compression", "tax rate"],
  },
  {
    slug: "border-security",
    shortTitle: "Border Security",
    title: "Texas Border Security Policy Tracker",
    description: "Track Operation Lone Star, Texas border enforcement, federal-state disputes, border spending, litigation, and legislation affecting the Texas-Mexico border.",
    updated: reviewed,
    quickAnswer: "Texas border policy sits at the intersection of state police powers, federal immigration authority, state spending, litigation, and local impacts. KTR tracks what Texas is doing, what Washington controls, and where the legal boundary is being tested.",
    currentStatus: "Border enforcement remains a recurring Texas policy fight even when migration numbers change. The durable questions are who has legal authority, what Texas programs cost, which state laws survive court review, and whether enforcement policies measurably improve security for border communities and the state as a whole.",
    keyFacts: ["Immigration admission and removal are primarily federal responsibilities, while Texas retains broad state criminal-law, public-safety, land, and emergency powers.", "Operation Lone Star uses state personnel and resources for border-related enforcement and support.", "State border laws can trigger federal preemption and constitutional litigation.", "Border policy should be evaluated using official enforcement data, court orders, appropriations, and program outcomes rather than slogans alone."],
    context: ["KTR's permanent border coverage distinguishes immigration status from state crimes such as smuggling, trafficking, trespass, organized criminal activity, and violence. That distinction matters when evaluating what Texas can enforce directly.", "The policy tracker also connects border news to appropriations, DPS and National Guard activity, court cases, legislative changes, and KTR's editorial position that Texas should use lawful state authority aggressively to protect the border and its communities."],
    watchFor: ["Federal-state litigation over Texas enforcement laws", "Operation Lone Star appropriations and deployment changes", "DPS and federal border-security data", "Legislation involving smuggling, trafficking, border barriers, or state enforcement authority"],
    sources: [
      { label: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/", primary: true },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/", primary: true },
      { label: "Texas statutes", url: "https://statutes.capitol.texas.gov/", primary: true },
    ],
    related: [
      { label: "The Texas Case for a Secure Border", href: "/texas-case/secure-border", kind: "editorial" },
      { label: "Border facts & framework", href: "/texas-case/facts/secure-border", kind: "facts" },
      { label: "Texas border policy explained", href: "/news/texas-border-policy-full-guide", kind: "reference" },
      { label: "Texas Border Security hub", href: "/texas-border-security", kind: "reference" },
      { label: "Texas Legislature", href: "/texas-legislature", kind: "government" },
    ],
    keywords: ["border", "border security", "operation lone star", "immigration", "migrant", "smuggling", "trafficking", "rio grande", "border wall"],
  },
  {
    slug: "public-education",
    shortTitle: "Public Education",
    title: "Texas Public Education Policy Tracker",
    description: "Track Texas school funding, accountability, curriculum, teacher policy, parental rights, local school governance, and legislation affecting public education.",
    updated: reviewed,
    quickAnswer: "Texas public education is governed through a mix of state law, Texas Education Agency administration, State Board of Education authority, and locally elected school boards. Funding and accountability policy are inseparable from property-tax and school-choice debates.",
    currentStatus: "KTR tracks public education as both a taxpayer issue and a parental-rights issue: what schools cost, how funding is distributed, what students are taught, what outcomes taxpayers receive, and how much authority parents and local voters retain.",
    keyFacts: ["The Legislature writes the Education Code and appropriates state education funding.", "The Texas Education Agency administers major state education programs and accountability systems.", "Local school districts levy taxes and govern campuses subject to state and federal law.", "Curriculum, accountability, teacher compensation, special education, school safety, and parental rights are separate policy questions that often get bundled together."],
    context: ["A serious education tracker should not reduce school performance to one statewide number. Texas has large differences among districts, student populations, tax bases, staffing models, and local governance decisions.", "KTR's editorial emphasis is that families should have meaningful authority and transparent information, while the factual layer tracks funding formulas, state rules, district obligations, and measurable outcomes."],
    watchFor: ["School-finance legislation and state appropriations", "TEA accountability and intervention actions", "Curriculum and parental-notification changes", "School safety, teacher-pay, and special-education legislation"],
    sources: [
      { label: "Texas Education Agency", url: "https://tea.texas.gov/", primary: true },
      { label: "Texas Education Code", url: "https://statutes.capitol.texas.gov/?link=ED", primary: true },
      { label: "Legislative Budget Board — Public Education", url: "https://www.lbb.texas.gov/", primary: true },
    ],
    related: [
      { label: "The Texas Case for Parental Rights and School Choice", href: "/texas-case/parental-rights-school-choice", kind: "editorial" },
      { label: "Education facts & framework", href: "/texas-case/facts/parental-rights-school-choice", kind: "facts" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Texas Legislature", href: "/texas-legislature", kind: "government" },
    ],
    keywords: ["public education", "school funding", "education", "teacher", "curriculum", "school district", "TEA", "education code", "school board"],
  },
  {
    slug: "school-choice",
    shortTitle: "School Choice",
    title: "Texas School Choice Policy Tracker",
    description: "Track Texas education savings accounts, vouchers, charter schools, parental rights, eligibility rules, funding, implementation, and political fights over school choice.",
    updated: reviewed,
    quickAnswer: "School-choice policy asks whether public education funding should follow a student beyond a traditional district campus and under what eligibility, accountability, and fiscal rules. KTR tracks both implementation details and the broader parental-rights argument.",
    currentStatus: "The durable policy questions are who qualifies, what expenses are permitted, how providers are approved, how fraud is prevented, what happens to district finance, and whether parents receive meaningful choices rather than a program that exists mostly on paper.",
    keyFacts: ["School choice can include open enrollment, charter schools, private-school programs, education savings accounts, homeschooling protections, and specialized public options.", "Different programs impose different eligibility, funding, testing, and provider rules.", "Program cost should be compared with the funding obligations that remain in traditional districts.", "Implementation details can matter as much as the headline authorization."],
    context: ["KTR supports giving parents greater control over education, but a credible tracker must still show program rules, appropriations, participation, administrative costs, and any documented implementation problems.", "This page connects school-choice legislation to the broader public-education system rather than pretending the two operate independently."],
    watchFor: ["Eligibility and application rules", "Appropriations and participation caps", "Provider standards and anti-fraud controls", "Effects on district finance and enrollment"],
    sources: [
      { label: "Texas Education Agency", url: "https://tea.texas.gov/", primary: true },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/", primary: true },
      { label: "Texas Education Code", url: "https://statutes.capitol.texas.gov/?link=ED", primary: true },
    ],
    related: [
      { label: "The Texas Case for Parental Rights and School Choice", href: "/texas-case/parental-rights-school-choice", kind: "editorial" },
      { label: "School-choice facts & framework", href: "/texas-case/facts/parental-rights-school-choice", kind: "facts" },
      { label: "Public Education tracker", href: "/policy/public-education", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["school choice", "voucher", "vouchers", "education savings account", "ESA", "parental rights", "charter school", "private school"],
  },
  {
    slug: "energy-ercot",
    shortTitle: "Energy & ERCOT",
    title: "Texas Energy and ERCOT Policy Tracker",
    description: "Track ERCOT reliability, power-market reforms, generation, transmission, oil and gas policy, electricity costs, and energy legislation in Texas.",
    updated: reviewed,
    quickAnswer: "Texas energy policy spans the ERCOT electric market, Public Utility Commission oversight, transmission and generation investment, and the oil-and-gas economy regulated in part by the Railroad Commission. Reliability, affordability, and growth are the core measures KTR follows.",
    currentStatus: "Rapid demand growth, extreme-weather performance, generation adequacy, transmission buildout, fuel reliability, and the cost of market reforms remain central Texas energy questions.",
    keyFacts: ["ERCOT operates the grid and wholesale market for most of Texas but does not itself own power plants or transmission lines.", "The Public Utility Commission regulates key parts of the electric market and oversees ERCOT.", "The Railroad Commission regulates the state's oil and gas industry, pipelines, and related activities under state law.", "Consumer cost includes generation, transmission, distribution, market design, local utility charges, and other components—not just the fuel source."],
    context: ["KTR's policy position favors abundant, reliable energy and rejects treating any technology label as a substitute for performance. The factual tracker therefore follows dependable capacity, transmission constraints, fuel security, system demand, and total consumer cost.", "Texas also has a national economic stake in oil and gas production, refining, petrochemicals, LNG, and energy-intensive manufacturing, making energy policy much broader than household electric bills."],
    watchFor: ["ERCOT reliability assessments and peak-demand records", "PUC market-design changes", "Transmission and dispatchable-generation investment", "Federal rules affecting Texas oil, gas, refining, or power generation"],
    sources: [
      { label: "ERCOT", url: "https://www.ercot.com/", primary: true },
      { label: "Public Utility Commission of Texas", url: "https://www.puc.texas.gov/", primary: true },
      { label: "Railroad Commission of Texas", url: "https://www.rrc.texas.gov/", primary: true },
    ],
    related: [
      { label: "The Texas Case for Reliable, Affordable Energy", href: "/texas-case/reliable-affordable-energy", kind: "editorial" },
      { label: "Energy facts & framework", href: "/texas-case/facts/reliable-affordable-energy", kind: "facts" },
      { label: "Texas Energy hub", href: "/texas-energy", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["energy", "ERCOT", "grid", "electricity", "power", "oil", "gas", "natural gas", "PUC", "Railroad Commission", "renewable", "nuclear"],
  },
  {
    slug: "water",
    shortTitle: "Water",
    title: "Texas Water Policy Tracker",
    description: "Track Texas water supply, reservoirs, groundwater, drought planning, infrastructure, desalination, flood control, and state water-finance policy.",
    updated: reviewed,
    quickAnswer: "Texas water policy is fragmented across state planning, river authorities, groundwater districts, cities, utilities, and private rights. Population growth makes supply, storage, conveyance, conservation, and drought resilience permanent statewide issues.",
    currentStatus: "The central long-term question is whether Texas can build and finance enough water infrastructure while respecting existing water rights, local control, property rights, and regional differences.",
    keyFacts: ["The Texas Water Development Board leads statewide water planning and administers major financing programs.", "Surface-water and groundwater rights operate under different legal structures.", "Regional water plans feed into the State Water Plan.", "Water policy intersects with agriculture, cities, industry, energy, flood control, and property rights."],
    context: ["Unlike a one-session political issue, water is a decades-long infrastructure problem. New reservoirs, pipelines, reuse systems, aquifer projects, and desalination can take years of permitting, financing, construction, and litigation.", "KTR's permanent coverage should show Texans where water comes from, which entity controls it, what projects cost, and whether projected supply keeps up with growth."],
    watchFor: ["State Water Plan updates", "New infrastructure financing and constitutional funds", "Groundwater and surface-water litigation", "Drought restrictions, reservoir levels, and major project approvals"],
    sources: [
      { label: "Texas Water Development Board", url: "https://www.twdb.texas.gov/", primary: true },
      { label: "Texas Commission on Environmental Quality — Water", url: "https://www.tceq.texas.gov/", primary: true },
      { label: "Texas statutes", url: "https://statutes.capitol.texas.gov/", primary: true },
    ],
    related: [
      { label: "Texas Legislature", href: "/texas-legislature", kind: "government" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Property Rights tracker", href: "/policy/housing", kind: "reference" },
    ],
    keywords: ["water", "drought", "reservoir", "groundwater", "aquifer", "water supply", "flood", "desalination", "TWDB"],
  },
  {
    slug: "housing",
    shortTitle: "Housing & Property Rights",
    title: "Texas Housing and Property Rights Policy Tracker",
    description: "Track Texas housing supply, local land-use rules, property rights, eminent domain, development regulation, affordability, and housing legislation.",
    updated: reviewed,
    quickAnswer: "Texas housing affordability is shaped by land costs, construction costs, interest rates, insurance, taxes, infrastructure, and local regulation. State policy increasingly intersects with local zoning and permitting when housing supply cannot keep up with growth.",
    currentStatus: "KTR tracks housing primarily through property rights, cost, and local-government power: what rules limit new supply, when the state preempts local regulation, and whether reforms reduce costs without shifting infrastructure burdens unfairly.",
    keyFacts: ["Most zoning and development regulation is local, but the Legislature can preempt or limit local authority.", "Property taxes and insurance costs can make ownership less affordable even when home prices stabilize.", "Eminent-domain rules involve both public necessity and constitutional property protections.", "Housing policy differs sharply among fast-growing suburbs, central cities, rural counties, and border communities."],
    context: ["A statewide housing debate should not assume every Texas community has the same problem. Some areas struggle with supply constraints; others face infrastructure, insurance, title, flood, or economic-development issues.", "KTR's editorial preference is for strong property rights and fewer unnecessary barriers to building, while this tracker follows the actual statutes, local powers, court decisions, and measurable cost pressures."],
    watchFor: ["State preemption of local zoning or permitting rules", "Eminent-domain legislation and court decisions", "Property-tax and insurance-cost changes", "Infrastructure and development-fee policy"],
    sources: [
      { label: "Texas Department of Housing and Community Affairs", url: "https://www.tdhca.texas.gov/", primary: true },
      { label: "Texas statutes", url: "https://statutes.capitol.texas.gov/", primary: true },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/", primary: true },
    ],
    related: [
      { label: "The Texas Case for Strong Property Rights", href: "/texas-case/property-rights", kind: "editorial" },
      { label: "Property-rights facts & framework", href: "/texas-case/facts/property-rights", kind: "facts" },
      { label: "Property Taxes tracker", href: "/policy/property-taxes", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["housing", "property rights", "zoning", "eminent domain", "land use", "home prices", "affordability", "development", "permitting"],
  },
  {
    slug: "immigration",
    shortTitle: "Immigration",
    title: "Texas Immigration Policy Tracker",
    description: "Track the federal-state immigration fight, Texas enforcement laws, employment and public-service issues, litigation, and policy affecting immigrants and Texas communities.",
    updated: reviewed,
    quickAnswer: "Federal law controls admission, immigration status, and removal, but Texas policy can affect policing, licensing, benefits, employment enforcement, public services, and state crimes connected to unlawful border activity.",
    currentStatus: "Immigration policy remains tightly connected to the border but is not identical to border security. KTR tracks which actions are federal, which are state or local, and where courts draw the preemption line.",
    keyFacts: ["Immigration status is principally a federal legal framework.", "States retain authority in many adjacent fields but cannot simply replace the federal immigration system.", "Texas immigration-related laws are frequently tested in federal court.", "Public cost, labor-market effects, crime, humanitarian concerns, and legal status should be analyzed with separate datasets rather than collapsed into one claim."],
    context: ["KTR's editorial view favors enforcement of immigration law and secure borders. The permanent factual layer should still distinguish illegal entry, unlawful presence, asylum claims, lawful permanent residence, temporary status, citizenship, and state criminal offenses.", "That precision makes the site's argument stronger because it prevents a policy dispute from being built on legally inaccurate categories."],
    watchFor: ["Federal court rulings on Texas immigration statutes", "Changes in federal enforcement and removal policy", "Texas legislation involving employers, benefits, or state enforcement", "Local-government cooperation and litigation"],
    sources: [
      { label: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/", primary: true },
      { label: "Texas statutes", url: "https://statutes.capitol.texas.gov/", primary: true },
      { label: "U.S. Department of Homeland Security", url: "https://www.dhs.gov/", primary: true },
    ],
    related: [
      { label: "The Texas Case for a Secure Border", href: "/texas-case/secure-border", kind: "editorial" },
      { label: "Border Security tracker", href: "/policy/border-security", kind: "reference" },
      { label: "Texas Political Reference", href: "/texas-political-reference", kind: "reference" },
    ],
    keywords: ["immigration", "immigrant", "illegal immigration", "asylum", "deportation", "removal", "migrant", "citizenship", "sanctuary"],
  },
  {
    slug: "gun-rights",
    shortTitle: "Gun Rights",
    title: "Texas Gun Rights and Gun-Control Policy Tracker",
    description: "Track Texas gun laws, constitutional carry, prohibited places, federal-state firearms disputes, court rulings, and proposed gun-control legislation.",
    updated: reviewed,
    quickAnswer: "Texas generally protects broad lawful firearm ownership and carry, but state and federal restrictions still govern prohibited persons, certain locations, weapon categories, sales, and criminal use. KTR tracks both new restrictions and expansions of lawful gun rights.",
    currentStatus: "The permanent Texas gun-policy debate centers on self-defense, due process, prohibited persons, sensitive locations, school safety, federal regulation, and whether proposed restrictions target criminal misuse or primarily burden lawful owners.",
    keyFacts: ["Texas permitless carry does not eliminate all eligibility or location restrictions.", "Federal firearms law remains applicable in Texas.", "Court decisions can alter the constitutional boundaries of state and federal regulation.", "Policy claims should distinguish violent-crime enforcement from restrictions imposed on otherwise lawful possession or carry."],
    context: ["KTR's editorial position is explicitly pro-Second Amendment and skeptical of gun-control proposals that burden lawful citizens without strong evidence of public-safety benefit.", "The factual tracker gives that argument a legal backbone by following statutes, court rulings, prohibited-place rules, licensing requirements that remain relevant, and proposed legislation."],
    watchFor: ["Texas firearm bills and preemption disputes", "Federal firearms rules and litigation", "Court decisions applying the Second Amendment", "School-security and prohibited-location legislation"],
    sources: [
      { label: "Texas statutes", url: "https://statutes.capitol.texas.gov/", primary: true },
      { label: "Texas DPS — Handgun Licensing", url: "https://www.dps.texas.gov/section/handgun-licensing", primary: true },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/", primary: true },
    ],
    related: [
      { label: "The Texas Case for Gun Rights", href: "/texas-case/gun-rights", kind: "editorial" },
      { label: "Gun-rights facts & framework", href: "/texas-case/facts/gun-rights", kind: "facts" },
      { label: "Texas gun laws explained", href: "/laws/texas-gun-laws-explained", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["gun", "guns", "firearm", "firearms", "second amendment", "constitutional carry", "gun control", "red flag", "self defense"],
  },
  {
    slug: "elections",
    shortTitle: "Elections",
    title: "Texas Election Law and Integrity Policy Tracker",
    description: "Track Texas voter ID, registration, mail voting, ballot security, election administration, audits, litigation, and election-law legislation.",
    updated: reviewed,
    quickAnswer: "Texas election policy covers both voter access and election security: registration, identification, early voting, mail ballots, polling places, observers, counting, reconciliation, audits, and court challenges.",
    currentStatus: "KTR treats election integrity as a permanent institutional issue, not a claim that every close election is suspect. The tracker follows actual law, official procedures, documented failures, litigation, and evidence-based reforms.",
    keyFacts: ["The Texas Secretary of State is the state's chief election officer.", "Counties administer most elections under the Texas Election Code and state guidance.", "Election-law changes can be challenged under federal and state law.", "Polls and campaign claims are not substitutes for certified election results."],
    context: ["The strongest election system is one in which lawful voters can understand how to participate and losing candidates cannot plausibly attack ordinary procedures merely because the result was unfavorable.", "KTR supports voter identification, accurate rolls, transparent ballot handling, observation, and auditing while also insisting that fraud claims be supported by evidence."],
    watchFor: ["Election Code amendments", "Secretary of State guidance and audit activity", "Voting-rights and election-administration litigation", "County-level procedural failures and corrective actions"],
    sources: [
      { label: "Texas Secretary of State — Elections", url: "https://www.sos.state.tx.us/elections/index.shtml", primary: true },
      { label: "Texas Election Code", url: "https://statutes.capitol.texas.gov/?link=EL", primary: true },
      { label: "VoteTexas.gov", url: "https://www.votetexas.gov/", primary: true },
    ],
    related: [
      { label: "The Texas Case for Election Integrity", href: "/texas-case/election-integrity", kind: "editorial" },
      { label: "Election-integrity facts & framework", href: "/texas-case/facts/election-integrity", kind: "facts" },
      { label: "Election Central", href: "/elections/2026", kind: "reference" },
      { label: "Texas Political Reference", href: "/texas-political-reference", kind: "reference" },
    ],
    keywords: ["election", "elections", "voter id", "voter registration", "mail ballot", "ballot", "election integrity", "poll watcher", "audit"],
  },
  {
    slug: "criminal-justice",
    shortTitle: "Criminal Justice",
    title: "Texas Crime and Criminal Justice Policy Tracker",
    description: "Track Texas bail, prosecution, policing, violent crime, fentanyl, organized crime, prisons, juvenile justice, victims' rights, and criminal-law legislation.",
    updated: reviewed,
    quickAnswer: "Texas criminal-justice policy spans local police and prosecutors, state criminal law, courts, county jails, prisons, juvenile systems, and state public-safety agencies. KTR focuses on public safety, victims, due process, and consequences for serious repeat offending.",
    currentStatus: "The durable policy questions include bail risk, violent repeat offenders, prosecutor discretion, police staffing and accountability, fentanyl and organized crime, prison capacity, juvenile justice, and whether reforms improve or weaken public safety.",
    keyFacts: ["Most ordinary criminal prosecutions are local even though the Penal Code and Code of Criminal Procedure are state law.", "Bail decisions occur before conviction and must account for constitutional protections as well as lawful public-safety considerations.", "Crime trends should be based on comparable official data, not selected anecdotes.", "Victims' rights and defendant due process are both part of the legal system."],
    context: ["KTR's law-and-order position is strongest when it distinguishes violent and habitual offending from lower-level conduct rather than treating every defendant as equally dangerous.", "The tracker connects crime stories to statutes, court procedures, agency data, legislative proposals, and the measurable outcomes that should decide whether a reform worked."],
    watchFor: ["Bail and repeat-offender legislation", "Crime and recidivism data", "Fentanyl, cartel, trafficking, and organized-crime enforcement", "Prison, jail, juvenile-justice, and prosecutor-policy changes"],
    sources: [
      { label: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/", primary: true },
      { label: "Texas Judicial Branch", url: "https://www.txcourts.gov/", primary: true },
      { label: "Texas statutes", url: "https://statutes.capitol.texas.gov/", primary: true },
    ],
    related: [
      { label: "The Texas Case for Law, Order, and Consequences", href: "/texas-case/law-order-public-safety", kind: "editorial" },
      { label: "Public-safety facts & framework", href: "/texas-case/facts/law-order-public-safety", kind: "facts" },
      { label: "Texas Law Enforcement hub", href: "/texas-law-enforcement", kind: "reference" },
      { label: "Texas laws", href: "/laws", kind: "law" },
    ],
    keywords: ["crime", "criminal justice", "bail", "police", "prosecutor", "fentanyl", "cartel", "prison", "jail", "violent crime", "public safety"],
  },
  {
    slug: "transportation",
    shortTitle: "Transportation",
    title: "Texas Transportation Policy Tracker",
    description: "Track Texas highways, toll roads, transit, freight, road funding, congestion, vehicle policy, and transportation infrastructure legislation.",
    updated: reviewed,
    quickAnswer: "Texas transportation policy is dominated by rapid growth: highways, freight, local roads, toll facilities, transit, ports, and maintenance all compete for long-term capital while drivers face congestion and rising project costs.",
    currentStatus: "KTR tracks whether transportation spending expands useful capacity, maintains existing infrastructure, reduces bottlenecks, and respects taxpayers and property owners rather than measuring success by spending alone.",
    keyFacts: ["TxDOT plans and delivers major state highway projects under legislative appropriations and state law.", "Transportation funding comes from multiple dedicated and general revenue sources.", "Local governments and regional mobility authorities can play major roles in roads and toll projects.", "Eminent domain, land use, freight, ports, and economic growth all intersect with transportation decisions."],
    context: ["Texas cannot preserve a low-cost growth model if infrastructure fails to keep pace with population and freight. But building more is not enough; projects should be evaluated by congestion relief, safety, maintenance needs, economic value, and total taxpayer cost.", "Permanent coverage should connect large project announcements to funding sources, timelines, right-of-way impacts, and measurable performance."],
    watchFor: ["TxDOT Unified Transportation Program changes", "Major highway and toll-project approvals", "Transportation appropriations and dedicated-fund changes", "Freight, port, autonomous-vehicle, and road-safety legislation"],
    sources: [
      { label: "Texas Department of Transportation", url: "https://www.txdot.gov/", primary: true },
      { label: "Legislative Budget Board", url: "https://www.lbb.texas.gov/", primary: true },
      { label: "Texas statutes", url: "https://statutes.capitol.texas.gov/", primary: true },
    ],
    related: [
      { label: "Property Rights tracker", href: "/policy/housing", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Texas Legislature", href: "/texas-legislature", kind: "government" },
    ],
    keywords: ["transportation", "TxDOT", "highway", "roads", "toll", "transit", "traffic", "congestion", "freight", "infrastructure"],
  },
  {
    slug: "life-abortion",
    shortTitle: "Life & Abortion",
    title: "Texas Pro-Life and Abortion Policy Tracker",
    description: "Track Texas abortion law, pro-life policy, litigation, medical-emergency rules, pregnancy support, maternal health, adoption, and legislation involving unborn life.",
    updated: reviewed,
    quickAnswer: "Texas abortion policy combines criminal, civil, medical, licensing, and constitutional questions. KTR is explicitly pro-life, while this tracker separates the editorial argument from the controlling statutes, court decisions, health guidance, and support programs.",
    currentStatus: "The most important continuing questions involve the scope of Texas abortion restrictions, medical-emergency standards, litigation, enforcement authority, pregnancy and maternal-health support, and how state policy treats both unborn children and mothers facing difficult pregnancies.",
    keyFacts: ["Texas abortion law is governed by multiple statutes rather than one single provision.", "Federal constitutional doctrine changed substantially after Dobbs, returning broad abortion-policy authority to elected governments subject to remaining constitutional limits.", "Medical-emergency disputes turn on specific statutory language and medical facts.", "A complete pro-life policy agenda also includes maternal health, adoption, foster care, pregnancy resources, and family support."],
    context: ["KTR's editorial position is that unborn human life deserves legal protection. The factual layer must therefore be especially careful not to overstate what a statute says, minimize a medical exception, or confuse political rhetoric with controlling law.", "This tracker is designed to connect KTR's pro-life cornerstone to statutes, litigation, agency guidance, health data, and concrete support policies for mothers and families."],
    watchFor: ["Texas Supreme Court and federal court decisions", "Legislative changes to abortion or medical-emergency language", "HHSC guidance and maternal-health data", "Pregnancy-support, adoption, and family-policy appropriations"],
    sources: [
      { label: "Texas statutes", url: "https://statutes.capitol.texas.gov/", primary: true },
      { label: "Texas Health and Human Services", url: "https://www.hhs.texas.gov/", primary: true },
      { label: "Texas Judicial Branch", url: "https://www.txcourts.gov/", primary: true },
    ],
    related: [
      { label: "The Texas Case for Protecting Unborn Life", href: "/texas-case/protecting-unborn-life", kind: "editorial" },
      { label: "Life-policy facts & framework", href: "/texas-case/facts/protecting-unborn-life", kind: "facts" },
      { label: "Texas laws", href: "/laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["abortion", "pro life", "pro-life", "unborn", "pregnancy", "maternal", "dobbs", "life", "adoption"],
  },
  {
    slug: "healthcare",
    shortTitle: "Healthcare",
    title: "Texas Healthcare Policy Tracker",
    description: "Track Texas Medicaid, rural hospitals, insurance regulation, healthcare workforce, maternal health, mental health, public-health powers, and healthcare legislation.",
    updated: reviewed,
    quickAnswer: "Texas healthcare policy spans Medicaid and human services, insurance regulation, professional licensing, hospitals, public health, mental health, and a large private market. Cost, access, workforce, federal funding, and state authority are recurring pressure points.",
    currentStatus: "KTR tracks healthcare with a focus on cost, access, state spending, rural capacity, individual choice, and whether programs deliver measurable outcomes rather than simply expanding administrative systems.",
    keyFacts: ["Texas Health and Human Services administers major Medicaid and human-service programs.", "The Texas Department of Insurance regulates many insurance-market functions under state law.", "Federal law and funding shape large parts of the healthcare system even when Texas administers the program.", "Rural access, workforce shortages, maternal health, mental health, and emergency care can present very different policy problems."],
    context: ["Healthcare debates often collapse insurance coverage, healthcare delivery, public-health regulation, and state welfare programs into one argument. KTR's tracker separates them so readers can see which agency, funding stream, and law actually controls the issue.", "That structure also allows editorial arguments about limited government and personal choice to be tested against concrete costs and outcomes."],
    watchFor: ["Medicaid budget and waiver changes", "Rural-hospital and workforce policy", "Insurance-market legislation", "Maternal-health, mental-health, and public-health authority changes"],
    sources: [
      { label: "Texas Health and Human Services", url: "https://www.hhs.texas.gov/", primary: true },
      { label: "Texas Department of Insurance", url: "https://www.tdi.texas.gov/", primary: true },
      { label: "Legislative Budget Board", url: "https://www.lbb.texas.gov/", primary: true },
    ],
    related: [
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Texas Legislature", href: "/texas-legislature", kind: "government" },
      { label: "State Budget tracker", href: "/policy/state-budget", kind: "reference" },
    ],
    keywords: ["healthcare", "health care", "Medicaid", "hospital", "insurance", "mental health", "maternal health", "HHSC", "public health"],
  },
  {
    slug: "state-budget",
    shortTitle: "State Budget",
    title: "Texas State Budget and Spending Policy Tracker",
    description: "Track the Texas state budget, appropriations, revenue estimates, agency spending, supplemental bills, debt, reserves, and fiscal policy.",
    updated: reviewed,
    quickAnswer: "Texas writes a two-year state budget under constitutional revenue and spending constraints. The Legislature appropriates money, the Comptroller estimates available revenue and certifies appropriations, and the Legislative Budget Board publishes detailed budget analysis and performance information.",
    currentStatus: "The 2026–27 budget is the current biennial framework. KTR tracks not just how much Texas spends, but where spending grows, which programs receive new money, what revenue assumptions support it, and whether taxpayers receive measurable value.",
    keyFacts: ["Texas budgets on a biennial cycle.", "The Comptroller's revenue estimate is central to determining available general revenue.", "The Legislative Budget Board provides budget, performance, and fiscal analysis for the Legislature.", "Supplemental appropriations, federal funds, dedicated accounts, constitutional funds, and local pass-throughs can make the true fiscal picture larger than one headline number."],
    context: ["KTR's fiscal position favors lower taxes and spending restraint. A credible fiscal watchdog therefore needs more than rhetoric about a 'big budget.' The permanent tracker should identify the baseline, population and inflation effects, one-time versus recurring spending, fund sources, and which agencies or programs drove the change.", "This tracker is the beginning of the Texas Money Watch concept discussed for KTR: budget decisions should eventually connect to agencies, contracts, bills, lawmakers, and measurable program outcomes."],
    watchFor: ["Comptroller revenue updates", "Supplemental appropriations", "Agency Legislative Appropriations Requests for the next cycle", "Spending growth, dedicated-fund changes, and major capital commitments"],
    sources: [
      { label: "Texas Legislative Budget Board", url: "https://www.lbb.texas.gov/", primary: true },
      { label: "Texas Comptroller — Transparency", url: "https://comptroller.texas.gov/transparency/", primary: true },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/", primary: true },
    ],
    related: [
      { label: "The Texas Case for Spending Restraint", href: "/texas-case/spending-restraint", kind: "editorial" },
      { label: "Spending facts & framework", href: "/texas-case/facts/spending-restraint", kind: "facts" },
      { label: "The Texas Case for Lower Taxes", href: "/texas-case/lower-taxes-limited-government", kind: "editorial" },
      { label: "Texas economy", href: "/texas-economy", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["state budget", "budget", "spending", "appropriations", "revenue", "LBB", "comptroller", "taxpayer", "state spending", "rainy day fund"],
  },
];

export const POLICY_TRACKER_SLUGS = POLICY_TRACKERS.map((tracker) => tracker.slug);

export function getPolicyTracker(slug: string): PolicyTracker | undefined {
  return POLICY_TRACKERS.find((tracker) => tracker.slug === slug);
}

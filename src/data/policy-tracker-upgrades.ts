import { POLICY_TRACKERS, type PolicyTracker } from "@/data/policy-trackers";

function requireBaseTracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing base policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-20";

const propertyTaxesBase = requireBaseTracker("property-taxes");
const borderSecurityBase = requireBaseTracker("border-security");
const energyBase = requireBaseTracker("energy-ercot");
const gunRightsBase = requireBaseTracker("gun-rights");
const lifeBase = requireBaseTracker("life-abortion");

const propertyTaxes: PolicyTracker = {
  ...propertyTaxesBase,
  updated: reviewed,
  quickAnswer: "Texas has no state property tax. Counties, school districts, cities, community colleges and special-purpose districts levy property taxes under authority granted by Texas law. A homeowner's final bill is shaped by appraised value, exemptions, taxable value, each taxing unit's adopted rate and debt obligations. That is why serious relief or elimination proposals must identify which local levy is being reduced, what services remain, how school finance is handled and whether another state or local revenue source replaces the tax.",
  currentStatus: "Property-tax relief remains a permanent Texas fiscal issue rather than a one-session story. Recent state policy has relied heavily on school-tax compression and larger homestead exemptions, while local appraisal, rate-setting, debt and voter-approval rules continue to determine what individual owners actually owe. KTR tracks immediate relief and the larger conservative objective of structurally reducing or eliminating property taxes, while separating that editorial goal from the accounting question every proposal must answer: who funds schools and local services after a levy is reduced or removed?",
  keyFacts: [
    "Texas has no state property tax. The Texas Comptroller provides statewide guidance and oversight functions, but local taxing units set rates and local officials administer appraisal and collection.",
    "County appraisal districts determine taxable property values and administer most exemption applications; they do not set the property-tax rates adopted by school districts, counties, cities or other taxing units.",
    "A market-value increase does not mechanically determine the final tax bill. Exemptions, appraisal limitations, taxable value, rate changes, school-tax compression, debt-service rates and the mix of taxing units all matter.",
    "Texas law distinguishes the no-new-revenue tax rate from the voter-approval tax rate. Those calculations are intended to make rate decisions and revenue growth more visible, but they are not a guarantee that an individual homeowner's bill will remain flat.",
    "Homestead exemptions reduce taxable value for qualifying residence homesteads. Some exemptions are constitutionally or statutorily required, while other local-option exemptions depend on the taxing unit and the owner's eligibility.",
    "School property taxes are intertwined with the state school-finance system. When the Legislature compresses school tax rates, the state generally has to replace part of the local revenue so districts can meet funding obligations.",
    "Local bonds can create debt-service obligations that remain relevant even when maintenance-and-operations tax rates fall. A credible elimination proposal must address outstanding debt and constitutional or contractual protections for bondholders.",
    "Appraisal protests and tax-rate decisions are different processes. Owners challenge value through appraisal-district and appraisal-review-board procedures, while elected taxing units adopt rates and budgets through separate public processes.",
  ],
  context: [
    "KTR treats the property-tax burden as a chain of decisions rather than one number. First, the appraisal district determines market and appraised value under state law. Second, exemptions and limitations determine taxable value. Third, each taxing unit adopts a budget and tax rate. Finally, the tax office applies those rates and collects the bill. That separation matters because reform aimed only at appraisal values can leave rate or debt pressures untouched, while rate compression can be offset by value growth elsewhere in the system.",
    "The conservative case for eliminating property taxes begins with a property-rights concern: a homeowner can finish paying a mortgage and still face a recurring government claim tied to ownership and rising assessed value. The factual policy challenge is that property taxes finance major local obligations, especially public schools, counties, cities and special districts. Eliminating a levy therefore requires either lower spending, replacement revenue, larger state funding, restructuring of local services, or some combination. A plan that does not identify the replacement is tax shifting rather than elimination.",
    "School finance deserves separate attention because it accounts for a large share of the statewide property-tax debate. Texas can use state revenue to compress school maintenance-and-operations rates, but a sustainable plan must specify how replacement funding behaves when enrollment, wages, special-education costs, facilities, inflation or the economy change. KTR will distinguish one-time surplus-funded relief from structural changes that continue through weaker revenue cycles.",
    "Local debt is another reason headline tax-rate comparisons can mislead. Voters may authorize bonds for schools, roads, public safety, water systems or other projects, and those obligations can be supported by debt-service taxes. KTR will connect bond elections, debt issuance and local tax-rate decisions so readers can see whether a proposed state relief package changes existing debt obligations or only one portion of the bill.",
    "Transparency rules matter because Texas property tax is decentralized. Truth-in-taxation notices, appraisal records, rate calculations, public hearings and election requirements give taxpayers multiple points to examine the process, but those records sit in different local systems. The KTR data and county architecture should increasingly make those official records easier to compare without pretending that the Comptroller or Legislature directly sets every local bill.",
    "For elimination proposals, KTR will ask the same questions regardless of sponsor: Which tax is eliminated—school M&O, school debt, county, city, special-district, or all property taxes? What happens to outstanding debt? What revenue replaces the levy? Does replacement funding grow automatically? Which government gains control over the replacement revenue? What limits prevent the old tax from returning? Those questions turn a slogan into a testable fiscal proposal.",
  ],
  watchFor: [
    "New homestead-exemption, appraisal-cap or school-tax-compression proposals and their effective dates",
    "Changes to no-new-revenue, voter-approval, appraisal protest or truth-in-taxation procedures",
    "Local bond elections, debt issuance and voter-approval tax-rate elections that affect recurring burdens",
    "State revenue forecasts and school-finance appropriations used to replace compressed local school taxes",
    "Proposals described as property-tax elimination and the specific revenue source, spending reduction or transition mechanism behind them",
    "Statewide Comptroller tax-rate, levy and appraisal data that allow relief claims to be tested against actual local trends",
  ],
  sources: [
    ...propertyTaxesBase.sources,
    { label: "Texas Comptroller — Property Tax Exemptions", url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/", primary: true },
    { label: "Texas Comptroller — Property Taxpayers' Bill of Rights", url: "https://comptroller.texas.gov/taxes/property-tax/bill-of-rights.php", primary: true },
    { label: "Texas Comptroller — Local Appraisal and Tax Directory", url: "https://comptroller.texas.gov/taxes/property-tax/county-directory/", primary: true },
  ],
};

const borderSecurity: PolicyTracker = {
  ...borderSecurityBase,
  updated: reviewed,
  quickAnswer: "Texas border policy sits at the boundary between federal immigration authority and state responsibility for public safety, criminal law, land, infrastructure and emergency operations. Texas can deploy state police and National Guard resources, prosecute state crimes such as smuggling or trafficking, spend state money on barriers and operations, and litigate with the federal government. It cannot simply convert a state policy preference into federal admission or removal authority. KTR tracks both aggressive lawful state action and the court decisions that define those limits.",
  currentStatus: "Operation Lone Star remains the central state border-security framework, combining DPS, Texas National Guard and other state or local resources. The durable policy questions are larger than any monthly encounter count: what missions state personnel are performing, what the program costs, which arrests involve independent state crimes, how state border statutes fare in federal court, what infrastructure Texas controls, and whether measured outcomes justify continued appropriations. KTR treats official operational data, appropriations and court orders as separate evidence streams rather than using one political talking point as a substitute for all three.",
  keyFacts: [
    "Federal law controls core immigration admission, removal and naturalization functions, while Texas retains state criminal-law, policing, property, emergency-management and spending powers that can affect border security.",
    "Operation Lone Star was launched in 2021 and uses Texas Department of Public Safety assets together with Texas National Guard and other partners for border-related missions.",
    "DPS can investigate and enforce Texas crimes including human smuggling, trafficking, organized criminal activity, drug offenses, evading, trespass and other state-law violations when the facts support those charges.",
    "Ports of entry are federal facilities and federal agencies control immigration inspection there. State operations often focus on state highways, private or state land, criminal investigations and areas between ports rather than replacing federal inspection authority.",
    "State laws aimed directly at unlawful entry or removal can trigger federal-preemption and constitutional litigation. A law enacted by Texas is not necessarily enforceable while a federal court has blocked or limited it.",
    "Border barriers, concertina wire, buoys, state land access and private-land agreements raise different legal and operational questions. They should not be treated as one interchangeable program.",
    "Operational statistics require definitions. Apprehensions or referrals, criminal arrests, felony charges, drug seizures and federal encounter data measure different events and should not be added together as if they were the same outcome.",
    "State border spending should be evaluated through appropriations, agency budgets and program records, then compared with measurable outputs and the opportunity cost of using personnel or capital for border missions instead of other state duties.",
  ],
  context: [
    "KTR supports Texas using lawful state authority aggressively to secure communities and disrupt cartels, smugglers and traffickers. The factual tracker therefore distinguishes immigration status from independent criminal conduct. A person may be the subject of federal immigration law without having committed a particular Texas felony, while a smuggler, trafficker or violent offender can be prosecuted under state law regardless of the broader federal-state political dispute. Clear categories make enforcement claims stronger, not weaker.",
    "Operation Lone Star is best understood as a portfolio of missions rather than a single program output. DPS troopers, Rangers, special agents, aircraft, tactical assets, National Guard personnel, barriers, transportation, local grants and criminal prosecutions can all appear under the broader border-security umbrella. KTR will tie claims to the responsible agency and funding stream so readers can tell whether a number comes from state arrests, federal encounters, state appropriations or a specific infrastructure project.",
    "Federal-state litigation is a permanent part of this beat. Texas can prevail on one question and lose on another because preemption, sovereign interests, property rights, federal supremacy, criminal procedure and immigration authority are distinct legal issues. A preliminary injunction also is not the same as a final Supreme Court judgment. Tracker updates should identify the court, procedural posture, operative order and practical effect on enforcement.",
    "Border communities experience policy differently from the rest of Texas. Ranchers and landowners may face trespass, property damage or requests for state access; cities and counties may handle detention, emergency or public-safety costs; commercial ports depend on lawful cross-border trade; and residents need ordinary roads, schools and services alongside enforcement. KTR will avoid treating the border as an abstract line on a national political map.",
    "Metrics need denominators and time periods. A large cumulative arrest or seizure figure may demonstrate scale but does not by itself establish whether conditions are improving, whether the same resources are still required, or whether another strategy would perform better. KTR will pair cumulative state figures with dated reporting periods, federal data where relevant, appropriations and court developments so readers can evaluate trend and effectiveness.",
    "The long-run policy test is whether Texas can sustain lawful deterrence and criminal enforcement without confusing state police power with federal immigration administration. That means strong state action where authority is clear, careful litigation where boundaries are contested, transparent accounting for taxpayer costs, and continued pressure on Washington to perform responsibilities assigned to the federal government.",
  ],
  watchFor: [
    "Federal and state appellate decisions affecting Texas border-enforcement statutes and operations",
    "Operation Lone Star appropriations, supplemental funding, personnel levels and mission changes",
    "DPS criminal-arrest, smuggling, trafficking and seizure data with clear reporting periods and definitions",
    "Federal CBP encounter and port-of-entry trends that provide context for state operational claims",
    "New Texas legislation involving border barriers, trespass, smuggling, trafficking or state enforcement authority",
    "Audits, contracts or local-grant records that show what border programs cost and which agencies or counties receive funds",
  ],
  sources: [
    ...borderSecurityBase.sources,
    { label: "Texas DPS — Operation Lone Star", url: "https://www.dps.texas.gov/operationlonestar", primary: true },
    { label: "U.S. Customs and Border Protection — Southwest Land Border Encounters", url: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters", primary: true },
    { label: "Legislative Budget Board", url: "https://www.lbb.texas.gov/", primary: true },
  ],
};

const energyErcot: PolicyTracker = {
  ...energyBase,
  updated: reviewed,
  quickAnswer: "Texas energy policy is a system of separate responsibilities. ERCOT operates the grid and wholesale market for most of Texas; the Public Utility Commission oversees ERCOT and regulates major electric-market functions; utilities own wires and distribution systems; generators own power plants; and the Railroad Commission regulates oil, gas and pipelines under state law. KTR evaluates policy through three linked outcomes—reliability, affordability and energy abundance—rather than assuming that any technology label by itself guarantees a resilient grid.",
  currentStatus: "Texas electricity demand is being pushed upward by population growth, industrial expansion, data centers, electrification and extreme weather, making resource adequacy and transmission a continuing policy issue. State reforms since Winter Storm Uri have changed weatherization, reliability oversight and market incentives, but the core challenge remains matching dependable supply and transmission with a rapidly changing load. KTR tracks ERCOT forecasts and operating conditions, PUC market decisions, generation additions and retirements, transmission projects, fuel infrastructure and the ultimate customer cost of reliability measures.",
  keyFacts: [
    "ERCOT manages grid operations and the wholesale electricity market for most of Texas but does not itself own the power plants or transmission facilities that produce and move electricity.",
    "The Public Utility Commission of Texas oversees ERCOT and regulates major electric utilities and market rules under authority granted by the Legislature.",
    "The Railroad Commission of Texas regulates oil and gas production, pipelines and related activities; despite its name, it is not the state electric-grid regulator.",
    "Reliability depends on more than installed nameplate capacity. Availability during peak conditions, forced outages, fuel supply, weather, transmission constraints, reserves, demand response and storage duration all affect whether resources can serve load when needed.",
    "Transmission can be a reliability and cost bottleneck even when generation exists elsewhere. New lines require planning, approvals, investment and time, and congestion can change which plants can economically serve a region.",
    "Retail electric bills can include wholesale energy costs, transmission and distribution charges, reliability or market-design costs, local utility charges and taxes or fees. A low fuel price does not automatically translate into a lower final bill.",
    "Natural gas is both a major Texas industry and an important electric-generation fuel, so pipeline deliverability, production, storage and weatherization can become electric-reliability issues during stressed conditions.",
    "Wind, solar, batteries, natural gas, coal and nuclear have different operating characteristics. KTR will compare their measured availability, costs and system value rather than treating political support or opposition as a substitute for performance data.",
  ],
  context: [
    "KTR's editorial position favors abundant, reliable and affordable energy and is skeptical of mandates that remove dependable capacity before replacements are proven. The tracker keeps that argument testable by following ERCOT reliability assessments, actual operating events, PUC decisions and consumer costs. If a favored resource underperforms, the data should say so; if a disfavored resource performs well, the data should say that too.",
    "Resource adequacy is a forward-looking planning problem. ERCOT must estimate future peak demand, the contribution of different resources, planned additions, retirements and transmission constraints. Forecasts can change rapidly when large industrial loads or data centers connect, so a single reserve-margin headline can become obsolete. KTR will preserve the date and assumptions behind projections rather than presenting an old forecast as a permanent fact.",
    "Dispatchability is important but not binary. Gas and coal units can experience forced outages or fuel constraints; nuclear plants are highly reliable but can be unavailable during refueling or outages; wind and solar output depends on weather and time; batteries can respond quickly but have duration limits. A resilient system uses portfolios, transmission and operating reserves to manage those differing risks.",
    "Market design determines who gets paid for what behavior. Texas policymakers have debated or implemented mechanisms intended to reward reliability, finance dispatchable generation, improve ancillary services or send stronger scarcity signals. KTR will separate a market rule's stated purpose from evidence about what it costs consumers and whether it actually produces new dependable capacity.",
    "The oil-and-gas economy also matters outside ERCOT. Texas production supports refining, petrochemicals, LNG, manufacturing, royalties, state tax revenue and jobs. Federal environmental rules, pipeline policy, export policy and permitting can therefore affect both the state economy and energy security even when the immediate rule is not written by ERCOT or the PUC.",
    "The long-term policy question is whether Texas can add generation and transmission faster than demand while keeping prices competitive. That requires attention to permitting, interconnection, capital cost, fuel supply, land, water, transmission corridors and the time needed to build large projects. KTR will track projects from announcement through actual operation so proposed megawatts are not confused with delivered reliability.",
  ],
  watchFor: [
    "ERCOT seasonal assessments, peak-demand records, conservation notices and resource-adequacy forecasts",
    "PUC market-design, reliability-standard and transmission decisions that change consumer or generator incentives",
    "New dispatchable generation, battery, nuclear, wind and solar projects that move from announcement to commercial operation",
    "Major transmission projects and congestion constraints in fast-growing or generation-heavy regions",
    "Natural-gas supply, pipeline, weatherization and storage issues that can affect electric generation during extreme conditions",
    "Federal rules affecting Texas generation, oil and gas production, refining, LNG, pipelines or industrial energy use",
  ],
  sources: [
    ...energyBase.sources,
    { label: "ERCOT — Grid Information", url: "https://www.ercot.com/gridinfo", primary: true },
    { label: "ERCOT — Resource Adequacy", url: "https://www.ercot.com/gridinfo/resource", primary: true },
    { label: "Public Utility Commission — Electric Market", url: "https://www.puc.texas.gov/industry/electric/", primary: true },
  ],
};

const gunRights: PolicyTracker = {
  ...gunRightsBase,
  updated: reviewed,
  quickAnswer: "Texas broadly protects lawful firearm ownership and allows many eligible adults to carry a handgun without a License to Carry, but 'constitutional carry' did not erase every restriction. State and federal prohibited-person rules, age and offense rules, prohibited locations, private-property notice, school rules and federal firearms law still matter. A Texas License to Carry also remains relevant for reciprocity and some legal circumstances. KTR's editorial position is strongly pro-Second Amendment; this tracker keeps that position connected to the actual statutes, court rulings and enforcement boundaries.",
  currentStatus: "The Texas firearms debate is now less about whether ordinary lawful carry exists and more about where government can restrict possession or carry, what due process is required before a person loses gun rights, how schools and sensitive locations are treated, whether local governments can regulate around state preemption, and how federal rules interact with Texas law. KTR tracks proposals to expand lawful self-defense as well as gun-control measures, with particular scrutiny for restrictions that burden compliant owners while leaving violent offenders or prohibited possessors comparatively untouched.",
  keyFacts: [
    "Texas law permits many people who are legally eligible to possess a handgun to carry without obtaining a Texas License to Carry, but eligibility and location restrictions still apply.",
    "A License to Carry remains a live Texas program. It can matter for reciprocity with other states, identification of licensed status and legal circumstances in which licensed carry is treated differently from unlicensed carry.",
    "Texas Penal Code contains location-specific firearm offenses and exceptions. A slogan such as 'permitless carry everywhere' is inaccurate because schools, polling places, courts, secure airport areas and other locations can carry special rules.",
    "Private property owners can control access to their property subject to Texas notice statutes and other law. Government restrictions and a private owner's decision to exclude firearms raise different legal questions.",
    "Federal firearms law remains applicable in Texas, including federal prohibited-person rules and regulation of certain firearms, dealers and transactions. State policy cannot erase federal law simply by declaring a state preference.",
    "Texas generally limits local firearm regulation through state preemption statutes, but the exact scope and exceptions depend on the subject, government entity and statutory text.",
    "Second Amendment litigation can change the constitutional boundary of firearm regulation. KTR will distinguish a trial-court order, an appellate decision and controlling U.S. Supreme Court precedent rather than treating every lawsuit as settled law.",
    "Policy debates over red-flag-style orders, domestic-violence restrictions or other disarmament mechanisms involve both public-safety claims and due-process questions such as notice, evidence, hearing rights, duration and restoration of rights.",
  ],
  context: [
    "KTR begins from the position that the right to keep and bear arms and the right of lawful self-defense deserve strong protection. That does not make the legal map simple. A responsible gun-rights tracker has to explain who may possess a firearm, where carry is prohibited, what notice is legally effective, what conduct becomes a separate crime and which rules come from federal rather than Texas law. Accuracy prevents law-abiding owners from relying on overbroad political slogans.",
    "Constitutional carry changed the role of licensing but did not make the License to Carry meaningless. Texans who travel may care about reciprocity, and license holders can encounter different statutory treatment in some situations. KTR will therefore track both unlicensed carry rules and the continuing LTC system instead of declaring that licensing disappeared.",
    "Prohibited-location policy is one of the most persistent sources of confusion. Schools, collegiate settings, government meetings, hospitals, businesses serving alcohol, sporting events and private premises can involve distinct rules, exceptions or notice requirements. The controlling statute and the facts of the location matter. KTR law guides should be linked whenever a news story risks turning a location-specific rule into a statewide generalization.",
    "State preemption matters because a right can become difficult to exercise if hundreds of local governments create conflicting rules. Texas has chosen to reserve substantial firearm-regulation authority to the state, while leaving limited local powers and ordinary property-management authority. KTR will track litigation or legislation that expands or narrows that line.",
    "Federal policy remains a separate layer. ATF rules, federal statutes and federal court decisions can affect Texans even when state officials oppose them. Texas may sue, decline to create additional state restrictions within lawful bounds, or protect state constitutional interests, but readers should know whether a challenged rule is currently effective and which court controls the dispute.",
    "For new gun-control proposals, KTR will ask whether the policy targets demonstrated criminal misuse, whether existing laws already cover the conduct, what due process exists, how compliance is imposed on lawful owners, what measurable safety outcome is expected and whether enforcement resources would be better focused on violent offenders, prohibited possessors or repeat criminals. That framework keeps the site's skeptical editorial stance tied to a concrete policy test.",
  ],
  watchFor: [
    "Texas bills affecting carry eligibility, prohibited locations, school security, preemption or firearm-related criminal penalties",
    "Federal firearms rules and litigation that change obligations for Texas owners, dealers or manufacturers",
    "U.S. Supreme Court and Fifth Circuit decisions applying the Second Amendment and historical-tradition tests",
    "Proposals for red-flag-style orders or other disarmament procedures and the notice, hearing and restoration protections attached to them",
    "Changes to Texas License to Carry rules, reciprocity or DPS guidance that remain relevant after permitless carry",
    "Public-safety data that distinguishes firearm misuse by prohibited or criminal actors from possession and carry by otherwise lawful citizens",
  ],
  sources: [
    ...gunRightsBase.sources,
    { label: "Texas Penal Code", url: "https://statutes.capitol.texas.gov/?link=PE", primary: true },
    { label: "Texas DPS — License to Carry Laws and Regulations", url: "https://www.dps.texas.gov/section/handgun-licensing/laws-regulations", primary: true },
    { label: "Bureau of Alcohol, Tobacco, Firearms and Explosives — Firearms", url: "https://www.atf.gov/firearms", primary: true },
  ],
};

const lifeAbortion: PolicyTracker = {
  ...lifeBase,
  updated: reviewed,
  quickAnswer: "Texas is a pro-life state whose current abortion law generally prohibits abortion while preserving statutory exceptions tied to the pregnant patient's life or serious risk of substantial impairment, as defined by state law. The legal framework also distinguishes abortion from treatment of ectopic pregnancy, miscarriage and removal of an unborn child who has already died. KTR supports protecting unborn life, while this factual tracker follows the exact statutes, medical-emergency language, court decisions, agency guidance, pregnancy-support programs and maternal-health policy that determine how the law operates in practice.",
  currentStatus: "The central Texas abortion-policy questions are now implementation and legal clarity as much as the existence of the prohibition itself. Lawmakers and courts have addressed how physicians apply the medical-emergency standard, what procedures fall outside the statutory definition of abortion, what civil or criminal enforcement provisions apply, and how women with high-risk pregnancies receive timely care. At the same time, pro-life policy increasingly includes pregnancy support, adoption, maternal health, infant care and family policy. KTR tracks those systems together so protecting unborn life is measured not only by legal prohibition but also by how Texas supports mothers and families.",
  keyFacts: [
    "Texas abortion law is spread across multiple statutes rather than one sentence. Health and Safety Code Chapters 170A and 171, related civil provisions, licensing law and court decisions can all matter depending on the issue.",
    "Texas law contains a medical-emergency framework tied to a physician's reasonable medical judgment and serious risk to the pregnant patient's life or major bodily function; the exact statutory language controls, not a political paraphrase.",
    "Texas statutes distinguish abortion from treatment of ectopic pregnancy and from removal of an unborn child who has already died. Miscarriage management and treatment after fetal death therefore should not automatically be described as prohibited abortion.",
    "A physician's legal obligations can involve both the abortion statutes and ordinary standards of medical care. Emergency facts, diagnosis, gestational circumstances and the procedure actually performed matter to legal analysis.",
    "Civil, criminal and professional enforcement mechanisms are not identical. A story about one enforcement path should not imply that every actor faces the same remedy or burden under every Texas abortion provision.",
    "Federal constitutional law changed substantially after Dobbs returned greater abortion-policy authority to elected governments, but federal statutes, federal courts and constitutional claims can still affect particular disputes involving Texas law.",
    "Texas funds or administers programs related to pregnancy, maternal health and family support. The performance, accessibility and outcomes of those programs are relevant to a serious pro-life policy agenda, not peripheral to it.",
    "Adoption, foster care, child support, maternal mortality, prenatal care and infant health are distinct systems, but each can affect whether Texas makes a credible long-term case that protecting unborn life includes practical support for women and children after birth.",
  ],
  context: [
    "KTR's editorial position is explicitly pro-life: unborn human life deserves legal protection, and Texas should defend that principle. The factual tracker exists to prevent that conviction from becoming an excuse for imprecision. When a hospital case, lawsuit or legislative proposal raises a medical exception, the relevant question is what the statute actually says, what physicians documented, what court order is operative and whether the disputed procedure falls inside the statutory definition of abortion.",
    "Medical-emergency language deserves especially careful treatment because real cases are fact-specific and emotionally charged. Texas has clarified parts of its law over time, including language concerning reasonable medical judgment and procedures involving ectopic pregnancy or an unborn child who has died. KTR should link directly to the current code and identify the effective law at the time of an event rather than relying on an older activist summary from either side.",
    "The legal status of miscarriage treatment is frequently confused in national debate. A miscarriage, incomplete miscarriage, ectopic pregnancy or removal after fetal death can involve medications or procedures that are also used in elective abortion care, but legal classification depends on the pregnancy and statutory definitions, not simply the name of a drug or procedure. Accurate reporting should describe the medical circumstance and cite the governing Texas provision.",
    "A durable pro-life policy cannot end at prohibition. Texas should be judged on whether pregnant women can find accurate information, prenatal and emergency care, material support, adoption services and help after birth. KTR can support pro-life law while also scrutinizing whether state-funded programs deliver promised services, whether money reaches families efficiently and whether maternal-health failures reveal a policy gap that deserves correction.",
    "Court decisions require procedural precision. Temporary restraining orders, trial-court judgments, appellate stays and final merits decisions have different legal effects. A dramatic filing does not itself change statewide law. KTR will identify the court and status of litigation so readers know whether a case is an allegation, a temporary order, a binding appellate decision or a final controlling precedent.",
    "Public opinion is relevant to elections but does not replace statutory analysis. Voters can simultaneously support broad protection for unborn life and demand clarity for medical emergencies or support services for mothers. KTR's permanent architecture should make those tradeoffs visible by connecting abortion legislation with maternal-health data, family policy, Texas Case editorial arguments and the underlying code.",
  ],
  watchFor: [
    "Texas legislation changing Chapter 170A, Chapter 171, medical-emergency definitions or enforcement procedures",
    "Texas Supreme Court, Fifth Circuit and federal-court decisions that affect the practical operation of state abortion law",
    "Official medical or agency guidance interpreting statutory exceptions, reporting duties or licensed-provider obligations",
    "Pregnancy-support, maternal-health, adoption and family-service appropriations and measurable program outcomes",
    "Cases in which ectopic pregnancy, miscarriage, fetal death or serious maternal complications are inaccurately conflated with elective abortion",
    "Election and public-opinion developments that could change Texas abortion policy while preserving a clear distinction between political preference and current law",
  ],
  sources: [
    ...lifeBase.sources,
    { label: "Texas Health and Safety Code — Chapter 170A", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.170A.htm", primary: true },
    { label: "Texas Health and Safety Code — Chapter 171", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.171.htm", primary: true },
    { label: "Texas Health and Human Services", url: "https://www.hhs.texas.gov/", primary: true },
  ],
};

export const POLICY_TRACKER_UPGRADES: Record<string, PolicyTracker> = {
  [propertyTaxes.slug]: propertyTaxes,
  [borderSecurity.slug]: borderSecurity,
  [energyErcot.slug]: energyErcot,
  [gunRights.slug]: gunRights,
  [lifeAbortion.slug]: lifeAbortion,
};

export const PRIORITY_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_UPGRADES);

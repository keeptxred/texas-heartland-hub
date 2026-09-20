import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE11 } from "@/data/policy-trackers-wave11";

function requireWave11Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE11.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave11 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const dataCentersBase = requireWave11Tracker("data-centers-large-loads");
const taxProtectionsBase = requireWave11Tracker("constitutional-tax-protections");
const criticalMineralsBase = requireWave11Tracker("critical-minerals-rare-earths");

const dataCentersLargeLoads: PolicyTracker = {
  ...dataCentersBase,
  updated: reviewed,
  keyFacts: [
    ...dataCentersBase.keyFacts,
    "A large-load interconnection request, a project accepted into an ERCOT study batch, a signed interconnection or transmission agreement, construction, energization, and sustained operating demand are different milestones; queue megawatts should not be reported as current load.",
    "Grid-cost allocation can involve study deposits, direct interconnection facilities, transmission upgrades, financial commitments, curtailment capability, and broader system costs, so a claim that a project 'pays for the grid' or shifts costs to customers requires the specific tariff and project facts.",
    "Electric demand, backup generation, water use, local tax incentives, employment, capital investment, and curtailment performance are separate project attributes; one favorable metric does not establish the overall public impact of a large data-center development.",
  ],
  context: [
    ...dataCentersBase.context,
    "The most important discipline in large-load reporting is queue maturity. ERCOT can receive requests representing enormous potential demand, but many projects will be early-stage, duplicated, speculative, delayed, downsized, or withdrawn. KTR will distinguish submitted requests, qualified study projects, Batch Zero participation, executed agreements, construction, energization, and actual metered load. That prevents a headline queue total from being presented as electricity Texas must serve today and also prevents a project announcement from being counted as delivered economic investment before it reaches operation.",
    "SB 6 creates a framework for balancing growth with reliability and cost responsibility. Large customers can require new substations, transmission, generation, reactive support, or operational controls depending on location and system conditions. The applicable cost-allocation rules determine which facilities a customer directly funds and which costs enter the wider transmission system. KTR will identify the tariff, study, deposit, or PUCT/ERCOT decision behind a cost claim rather than assuming either that ordinary customers automatically pay every upgrade or that a large-load developer necessarily covers every system consequence.",
    "Curtailment and flexible-load capability can affect reliability but should be measured through enforceable obligations and performance. A data center may propose backup generation, interruptible demand, phased load, or other operational flexibility. Those capabilities can reduce risk only if they are available when the grid needs them and if the governing agreements permit ERCOT to rely on them. The tracker will distinguish a developer's technical claim from a contractual reliability obligation and, where records exist, follow actual curtailment events and performance.",
    "Water deserves its own accounting because cooling design varies substantially. Some facilities can use large volumes of water, while others rely more heavily on air cooling, closed-loop systems, reclaimed water, or other designs. KTR will avoid assigning a generic water-use number to every data center and will instead use project permits, utility agreements, engineering disclosures, or local planning records. That same project-specific standard applies to backup generators, emissions, land area, and infrastructure requirements.",
    "Economic-development claims also require milestone tracking. Announced capital investment can include buildings, servers, electrical infrastructure, or later phases that may not all occur. Jobs can include temporary construction roles, permanent operations, contractors, or indirect employment. Local tax incentives can vary in duration and structure. KTR will show the public incentive separately from private investment and distinguish promised jobs from jobs documented after operation. This gives communities a way to judge whether unusually large grid commitments are accompanied by the economic benefits cited when the project was approved.",
    "The durable policy question is whether Texas can add large industrial and computing loads without degrading reliability or socializing avoidable speculative costs. ERCOT studies, PUCT rules, SB 6 implementation, Governor audit findings, transmission projects, financial-security requirements, local water and tax records, and actual operating load provide the evidence. KTR's position that growth should carry its fair infrastructure burden will therefore be tested against project-level facts rather than used as a reason either to reject every data center or approve every announced megawatt.",
  ],
  watchFor: [
    ...dataCentersBase.watchFor,
    "Project-level movement from queue request through study, agreement, construction, energization, and actual metered demand so speculative megawatts remain separate from operating load",
    "Enforceable curtailment, financial-security, transmission-cost, backup-generation, and infrastructure obligations rather than voluntary reliability claims alone",
  ],
};

const constitutionalTaxProtections: PolicyTracker = {
  ...taxProtectionsBase,
  updated: reviewed,
  keyFacts: [
    ...taxProtectionsBase.keyFacts,
    "Each 2025 amendment has its own taxpayer, transaction, tax type, and exceptions. Proposition 2, Proposition 6, and Proposition 8 should not be combined into a generic statement that Texas constitutionally prohibited all new taxes on investment or wealth.",
    "A future levy can turn on substance rather than political label: courts may need to determine whether the tax actually falls within a prohibited constitutional category or is a different tax preserved by the text.",
    "The Legislature can change ordinary tax statutes within constitutional limits, while changing the constitutional prohibitions themselves would generally require another constitutional-amendment process and voter approval.",
  ],
  context: [
    ...taxProtectionsBase.context,
    "The 2025 tax amendments should be tracked provision by provision. Proposition 2 concerns specified capital-gains taxation of individuals, families, estates, and trusts. Proposition 6 addresses certain occupation and securities-transaction taxes involving registered securities market operators. Proposition 8 addresses death, estate, inheritance, and specified transfer taxes. Their exceptions and preserved tax categories differ. KTR will identify the constitutional section and proposed levy before declaring a tax barred, because a political description such as 'investment tax' or 'death tax' is not enough to establish the legal classification.",
    "Existing Texas revenue sources remain an important baseline. The amendments were not drafted as a repeal of sales and use taxes, property taxes, mineral taxes, insurance taxes, franchise-tax structures, vehicle-related taxes, or every fee that can affect assets or businesses. Some amendment text expressly preserves categories. KTR will therefore distinguish a constitutionally prohibited new tax from an existing lawful tax that produces a similar economic complaint. That precision matters when evaluating fiscal proposals that shift revenue among tax bases rather than simply adding a new statewide levy.",
    "Future litigation may focus on definitions and economic substance. Lawmakers could create a charge that is labeled a fee, excise tax, occupation tax, transfer tax, or assessment, while challengers argue that its operation places it inside a constitutional prohibition. Courts may examine the text, taxpayer, taxable event, measure of the levy, exemptions, and statutory purpose. The tracker will report the actual legal theory and judicial holding rather than assuming the Legislature can evade the Constitution through nomenclature or that every tax touching an asset is automatically barred.",
    "Constitutional entrenchment changes the policy process. An ordinary statute can be amended by a later Legislature subject to other legal constraints, but voter-approved constitutional limits are harder to alter. That can create predictability for taxpayers and investors while also reducing future fiscal flexibility. KTR's editorial preference favors that predictability, but the factual tracker will separately follow whether a proposed budget problem leads lawmakers to adjust spending, broaden another tax base, create a fee, or propose another constitutional amendment.",
    "Economic claims should be tied to the relevant tax rather than attributed to the amendments as a package. Supporters can argue that preventing capital-gains, securities-transaction, or death taxes improves investment certainty and protects Texas's competitive position. Critics can argue that constitutional restrictions limit future revenue options or shift burdens elsewhere. Useful evidence includes migration, investment, market activity, state revenue composition, and the actual design of proposals in other states, but the tracker should not claim a 2025 amendment caused an economic change merely because the timing coincides.",
    "The durable value of this page is as a constitutional boundary map. Governor certification records establish adoption, enrolled joint resolutions establish the language submitted to voters, and later constitutional publications and court decisions establish the operative interpretation. KTR will preserve those primary materials and update any litigation or future amendment proposals. Readers should be able to answer two separate questions: whether a specific tax idea is politically consistent with Texas's low-tax model, and whether the current Constitution legally permits it.",
  ],
  watchFor: [
    ...taxProtectionsBase.watchFor,
    "Attorney General opinions or court decisions interpreting whether a newly structured levy falls within one of the voter-approved prohibitions or a preserved tax category",
    "Budget proposals that respond to the constitutional limits through spending changes, alternative tax bases, fees, or a new proposed constitutional amendment",
  ],
};

const criticalMineralsRareEarths: PolicyTracker = {
  ...criticalMineralsBase,
  updated: reviewed,
  keyFacts: [
    ...criticalMineralsBase.keyFacts,
    "Mineral resource estimates, a mine-development plan, permits, financing, construction, separation or processing capacity, magnet manufacturing, contracted offtake, and commercial output are different supply-chain milestones and should be tracked separately.",
    "State semiconductor or enterprise grants supporting a critical-mineral project are economic-development tools; they do not replace federal, state, or local environmental, water, land, mining, transportation, or construction requirements that may apply to the facility.",
    "Domestic supply-chain resilience depends on more than extraction. Processing, separation, refining, metal or alloy production, magnet manufacturing, skilled labor, equipment, customers, and dependable power can each be bottlenecks between a Texas mineral deposit and usable advanced-manufacturing inputs.",
  ],
  context: [
    ...criticalMineralsBase.context,
    "Critical-minerals reporting is clearest when the supply chain is broken into stages. A geological resource can be economically significant without being a permitted mine, and a permitted mine can still lack financing, processing capacity, customers, or downstream manufacturing. Rare-earth separation and magnet production are technically distinct from extraction. KTR will identify which stage a Texas project addresses and will not count an announced mineral resource as domestic finished-product capacity before the required facilities are operating.",
    "Round Top illustrates why project milestones matter. State support can accelerate engineering, permitting, infrastructure, processing, or construction, but each step has its own schedule and risk. KTR will follow official project records for financing, permits, site work, construction, commissioning, and production rather than allowing the original grant announcement to remain the current status. If the project scope, capital estimate, job estimate, or schedule changes, the tracker should retain the revised figure and date instead of silently carrying forward an older projection.",
    "Downstream magnet manufacturing creates a different accountability test. A facility such as the announced MP Materials campus can strengthen domestic capability even if the raw material comes from elsewhere in the company's supply chain. Useful evidence includes plant construction, equipment installation, hiring, customer qualification, contracted capacity, and actual magnet output. KTR will distinguish projected annual capacity from qualified commercial production and will show how a manufacturing grant differs from support for mining or processing.",
    "Public incentives should be compared with enforceable commitments. Texas announcements can identify grant amounts, projected private investment, and expected employment, but those categories should remain separate. The tracker will follow executed agreements or official updates where available for performance milestones, reporting duties, recapture provisions, or revised commitments. KTR's support for strategic domestic production does not make every targeted subsidy automatically efficient; taxpayers should be able to see what capability was purchased and whether the recipient delivered it.",
    "Infrastructure and environmental constraints also affect strategic value. Mining and materials processing can require water, power, transportation, waste management, specialized chemicals, and land access. Manufacturing can require reliable electricity and a trained workforce. A project that cannot secure required permits or infrastructure does not strengthen supply resilience merely because the resource exists. KTR will connect project development to the responsible permitting and utility records while avoiding generic claims that every critical-mineral operation has the same environmental footprint.",
    "The long-run policy test is diversification of usable supply rather than the number of announcements. State target-industry designations, TSIF awards, Texas Enterprise Fund grants, federal support, project financing, construction, production volumes, customer contracts, import dependence, and downstream Texas manufacturing all provide evidence. The tracker will show where Texas gains a genuinely functioning link in the supply chain and where a project remains aspirational. That makes the page a practical accountability record for both national-security arguments and the conservative debate over targeted industrial policy.",
  ],
  watchFor: [
    ...criticalMineralsBase.watchFor,
    "Executed incentive terms and project milestones separating projected investment, jobs, and production capacity from amounts actually delivered",
    "Processing, separation, alloy, magnet, power, water, permitting, and customer-qualification bottlenecks that determine whether mined material becomes usable domestic supply",
  ],
};

export const POLICY_TRACKER_WAVE11_UPGRADES: Record<string, PolicyTracker> = {
  [dataCentersLargeLoads.slug]: dataCentersLargeLoads,
  [constitutionalTaxProtections.slug]: constitutionalTaxProtections,
  [criticalMineralsRareEarths.slug]: criticalMineralsRareEarths,
};

export const WAVE11_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE11_UPGRADES);

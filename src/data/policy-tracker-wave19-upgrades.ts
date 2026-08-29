import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS } from "@/data/policy-trackers";

function requireBase(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing base policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const housingBase = requireBase("housing");
const immigrationBase = requireBase("immigration");
const electionsBase = requireBase("elections");

const housing: PolicyTracker = {
  ...housingBase,
  updated: reviewed,
  currentStatus:
    "Texas housing policy remains a state-and-local governance question involving supply, permitting, infrastructure, taxes, insurance, land-use authority, and property rights. KTR tracks whether reforms change actual building capacity and household costs, which government imposed the relevant rule, and whether infrastructure obligations or eminent-domain effects are shifted fairly rather than treating every affordability problem as a zoning issue.",
  keyFacts: [
    ...housingBase.keyFacts,
    "A zoning entitlement, plat approval, building permit, utility commitment, financing package, construction start, completed unit, and occupied home are separate development milestones; permitted or announced units should not be reported as delivered supply.",
    "Home price, monthly mortgage payment, property tax, insurance premium, homeowners-association charge, utility cost, and required commute are separate affordability components and can move in different directions.",
    "State preemption can limit a local rule without eliminating all local authority over infrastructure, health and safety, subdivision standards, floodplain management, utilities, or other powers preserved by law.",
  ],
  context: [
    ...housingBase.context,
    "Housing supply begins with the governing jurisdiction and development stage. A city can control zoning, subdivision, permitting, utilities, streets, and other development requirements subject to state-law limits, while counties generally operate with different land-use authority. Special districts, utility providers, flood-control entities, and transportation agencies can also affect whether land is buildable. KTR will identify which government or provider controls the disputed requirement before describing a project as blocked by 'local regulation,' because two nearby developments can face materially different legal and infrastructure conditions.",
    "State preemption should be tracked provision by provision. The Legislature may limit minimum lot sizes, parking mandates, permitting timelines, accessory-dwelling restrictions, or other local rules without abolishing every municipal power. A law can also apply only to certain cities, project types, transit areas, or circumstances. The tracker will preserve effective dates, thresholds, exceptions, litigation, and implementing ordinances so a statewide reform is not presented as universal when the enacted text is narrower.",
    "Development pipelines need milestone discipline. Land placed under contract or rezoned is not the same as a recorded subdivision, an issued building permit, a construction start, a completed unit, or a home available for occupancy. Infrastructure can delay projects after zoning is secured, and financing conditions can delay permitted projects. KTR will use consistent stages when evaluating whether a reform actually increased supply, which prevents announcement counts or theoretical capacity from being substituted for homes that reached the market.",
    "Affordability is broader than sale price or rent. Interest rates, insurance, property taxes, maintenance, utility costs, homeowners-association charges, commuting, and transaction costs can materially change a household's monthly burden. New supply can moderate price pressure without offsetting a large insurance increase, and a lower tax rate can coexist with higher taxable value. The tracker will identify the cost component and time period behind an affordability claim rather than combine unrelated household expenses into one unexplained number.",
    "Infrastructure costs create a legitimate allocation question. New housing can require roads, drainage, water, wastewater, schools, parks, public safety, and utility capacity. Cities can use taxes, utility rates, impact fees, developer-built infrastructure, special districts, or other financing structures depending on law. KTR's preference for fewer unnecessary barriers to construction does not mean existing residents should automatically absorb every marginal cost. The tracker will show who pays, when the infrastructure is delivered, whether the charge is authorized, and whether the requirement is proportionate to the development impact.",
    "Property rights and eminent domain require their own evidence. A public project can be legally authorized while still raising disputes over necessity, valuation, route selection, access, relocation, or procedure. Conversely, a private development dispute does not become eminent domain simply because regulation affects land value. KTR will identify whether the government is condemning property, regulating use, conditioning a permit, negotiating an easement, or enforcing an existing restriction so readers can see the legal mechanism rather than only the economic effect.",
    "The durable policy test is whether Texas maintains room to build while protecting lawful property rights and financing growth transparently. Useful evidence includes permit times, housing starts and completions, inventory, prices and rents, tax and insurance costs, infrastructure capacity, development fees, court rulings, and local implementation after state reforms. KTR will distinguish correlation from causation and will not claim that one zoning change solved affordability—or caused a price increase—without a time-consistent local record.",
  ],
  watchFor: [
    ...housingBase.watchFor,
    "Local implementation and litigation following state preemption changes, including whether permits, starts, completions, lot supply, or multifamily capacity actually change",
    "Comparable household-cost evidence separating prices or rents from financing, property tax, insurance, utilities, fees, and infrastructure-related charges",
  ],
};

const immigration: PolicyTracker = {
  ...immigrationBase,
  updated: reviewed,
  currentStatus:
    "Texas immigration policy continues to operate beside, not in place of, the federal immigration system. KTR tracks federal admission and removal authority separately from Texas criminal law, employment, benefits, licensing, public-safety cooperation, and litigation, preserving the procedural status of challenged state laws and distinguishing immigration status from separate conduct such as smuggling, trafficking, trespass, or document fraud.",
  keyFacts: [
    ...immigrationBase.keyFacts,
    "Admission, visa status, asylum, parole, lawful permanent residence, removal proceedings, removal orders, and citizenship are distinct federal legal categories; the term 'migrant' does not establish any one of them.",
    "An arrest by Texas authorities for a state offense, an immigration detainer, transfer to federal custody, initiation of removal proceedings, and actual removal are separate events and should not be counted as the same enforcement outcome.",
    "A filed lawsuit, preliminary injunction, appellate stay, merits decision, and final mandate can produce different periods of enforceability for a Texas immigration-related statute.",
  ],
  context: [
    ...immigrationBase.context,
    "The first reporting discipline is legal category. A person can be a U.S. citizen, lawful permanent resident, nonimmigrant visa holder, asylum applicant, parolee, person with another temporary status, individual in removal proceedings, or person unlawfully present, among other possibilities. Those categories carry different rights and consequences. KTR will use the status established by reliable records and will avoid treating nationality, border crossing, arrest, or the generic word 'migrant' as proof of a particular immigration status.",
    "Federal and state authority also need separation. The federal government controls core admission, status, and removal systems, while Texas can enforce generally applicable state criminal laws and legislate in adjacent fields within constitutional and preemption limits. Employers, licensing agencies, benefit programs, local law enforcement, and schools can encounter immigration-related rules without administering the federal immigration code. The tracker will identify the legal hook for a Texas action rather than describe every state measure as direct immigration enforcement.",
    "Border activity and interior immigration policy overlap but are not identical. Smuggling, trafficking, trespass, evading arrest, organized criminal activity, fraudulent documents, and other state offenses can involve migrants but are distinct from whether a person is removable under federal law. KTR will report the charged conduct and procedural stage separately from immigration status. This avoids both understating serious state crimes and implying that unlawful presence by itself proves conduct for which no state charge exists.",
    "Court posture matters because Texas immigration-related laws often generate fast-moving federal litigation. A district court can issue a temporary restraining order or preliminary injunction; an appellate court can stay, narrow, affirm, or vacate it; and later merits rulings can change the legal analysis again. The tracker will preserve the provision, parties, court, date, and operative order. A temporary stay permitting enforcement during appeal is not the same as a final judgment that the statute is valid, and an injunction against one provision does not automatically invalidate every related policy.",
    "Employment and public-benefit debates require program-specific rules. Work authorization is a federal concept, while Texas employers can also face state licensing, contracting, tax, or verification requirements. Public programs can use different eligibility standards tied to immigration category, residency, age, disability, emergency status, or federal funding rules. KTR will identify the program and governing statute before describing immigrants as eligible or ineligible, because a rule for one benefit does not necessarily apply to another.",
    "Enforcement data should preserve denominators and agencies. Border encounters, arrests, detainers, prosecutions, removals, returns, asylum filings, visa overstays, and population estimates measure different events and can include repeated encounters or different geographic scopes. A decline in one series does not automatically establish a decline in another. KTR will use the responsible agency's definitions and time periods and will avoid adding unlike datasets into one headline total.",
    "The durable policy question is whether Texas uses lawful state authority effectively while federal institutions carry out responsibilities the Constitution and federal statutes assign to them. Useful evidence includes court orders, DPS and local enforcement records, federal removal and status data, employer-compliance records, program eligibility rules, fiscal records, and documented community impacts. KTR's editorial preference for enforcement and secure borders will remain separate from the evidentiary burden for claims about status, crime, cost, or legal authority.",
  ],
  watchFor: [
    ...immigrationBase.watchFor,
    "Final federal court rulings and mandates identifying which Texas immigration-related provisions are preempted, constitutional, severable, or enforceable",
    "Agency data that distinguish state arrests and prosecutions from federal detainers, removal proceedings, actual removals, asylum decisions, and other immigration outcomes",
  ],
};

const elections: PolicyTracker = {
  ...electionsBase,
  updated: reviewed,
  currentStatus:
    "Texas election administration remains a county-run system operating under state law and Secretary of State guidance, with recurring changes involving registration, identification, mail voting, polling places, counting, reconciliation, audits, and litigation. KTR tracks each stage separately and treats certified results, verified procedural findings, court judgments, and substantiated fraud evidence differently from allegations, campaign claims, or ordinary administrative corrections.",
  keyFacts: [
    ...electionsBase.keyFacts,
    "Registration eligibility, registration-list maintenance, voter identification, ballot eligibility, ballot acceptance, tabulation, reconciliation, canvass, certification, audit, recount, and election contest are separate stages with different evidence and legal standards.",
    "A discrepancy discovered during reconciliation or audit is not automatically evidence of an unlawful vote, and an allegation of fraud is not a verified finding until supported by records, an investigation, or an adjudicated result.",
    "Unofficial election-night totals, county canvass results, state canvass or certification, recount totals, and court-ordered changes can occur at different times; reporting should identify which result is being cited.",
  ],
  context: [
    ...electionsBase.context,
    "Texas elections divide responsibility between state and local actors. The Secretary of State serves as chief election officer, issues guidance, maintains statewide systems, and performs duties assigned by the Election Code, while counties and other local authorities conduct most voting operations. Political parties can also administer primary functions under state law. KTR will identify the responsible authority for registration, equipment, polling places, ballot processing, canvass, or another disputed step rather than attributing every local error or policy choice to the state as a whole.",
    "Registration and voting are different stages. Eligibility rules determine who may register, list-maintenance processes address records over time, and a registered voter can still encounter identification or ballot-specific requirements. Citizenship verification, address changes, duplicate records, deceased-voter procedures, cancellation, and challenge processes each require their own statutory basis and notice protections. The tracker will distinguish a flagged record from a completed cancellation and a list-maintenance action from proof that an unlawful ballot was cast.",
    "Mail voting also has multiple checkpoints. Eligibility to request a ballot, application acceptance, ballot issuance, carrier-envelope requirements, signature or identification review, cure procedures, receipt deadlines, acceptance by the early-voting ballot board, and later counting are distinct. A rejected application is not a rejected ballot, and a cured ballot should not be counted again as an unresolved defect. KTR will identify the stage and official reason when reporting rejection or error rates so categories are not double-counted.",
    "Counting and reconciliation should be reported as controls, not as synonyms. Tabulation produces vote totals, while reconciliation compares voter participation, ballots, and related records to identify and explain differences. Canvassing formally reviews and adopts results under law. Audits, recounts, and election contests provide additional review through different procedures. The tracker will preserve the purpose and outcome of each process and will not treat routine reconciliation corrections as proof of fraud or treat a completed canvass as proof that no administrative mistake occurred.",
    "Fraud claims require an evidence ladder. A social-media allegation, voter complaint, referral, investigation, criminal charge, conviction, civil finding, audit discrepancy, and court judgment carry different weight. KTR supports strong safeguards and prosecution of actual election crimes, but that position requires accurate attribution. The page will identify the number of ballots or records actually affected, whether intent was established, and whether the issue could change an outcome rather than extrapolate statewide conclusions from an unverified anecdote.",
    "Access claims need similar precision. A polling-place change, equipment delay, registration problem, rejected ballot, wait time, language-assistance issue, or disability-access failure can affect voters differently and may have different legal remedies. Turnout alone does not prove either that access was adequate or that a rule suppressed votes. The tracker will use county records, state guidance, court findings, complaint data, and comparable election metrics to evaluate whether a policy created a measurable barrier or corrected a documented vulnerability.",
    "The durable institutional test is whether lawful voters can participate under understandable rules and whether ballots are handled through transparent, auditable procedures that support confidence in certified outcomes. Useful evidence includes registration and cancellation records, ballot-rejection and cure data, reconciliation reports, canvasses, audits, recounts, prosecutions, equipment testing, court decisions, and post-election corrective actions. KTR will preserve disagreements over policy while keeping factual claims anchored to official records and adjudicated evidence.",
  ],
  watchFor: [
    ...electionsBase.watchFor,
    "County and Secretary of State records that distinguish registration maintenance, ballot rejection or cure, reconciliation discrepancies, audit findings, and proven election-law violations",
    "Final court decisions or enacted Election Code changes affecting voter identification, mail voting, observers, polling administration, certification, audits, recounts, or election contests",
  ],
};

export const POLICY_TRACKER_WAVE19_UPGRADES: Record<string, PolicyTracker> = {
  [housing.slug]: housing,
  [immigration.slug]: immigration,
  [elections.slug]: elections,
};

export const WAVE19_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE19_UPGRADES);

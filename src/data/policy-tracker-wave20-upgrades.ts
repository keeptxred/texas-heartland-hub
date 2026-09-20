import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS } from "@/data/policy-trackers";

function requireBase(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing base policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const criminalJusticeBase = requireBase("criminal-justice");
const transportationBase = requireBase("transportation");
const healthcareBase = requireBase("healthcare");

const criminalJustice: PolicyTracker = {
  ...criminalJusticeBase,
  updated: reviewed,
  currentStatus:
    "Texas criminal-justice policy remains divided among local police and prosecutors, county courts and jails, statewide criminal statutes, appellate courts, DPS, prisons, and juvenile systems. KTR tracks arrest, charging, bail, adjudication, sentencing, supervision, incarceration, release, and recidivism as separate stages so public-safety claims are measured against comparable official records rather than anecdotes or unresolved accusations.",
  keyFacts: [
    ...criminalJusticeBase.keyFacts,
    "Arrest, criminal charge, indictment, conviction, dismissal, acquittal, plea, sentence, probation, parole, and later recidivism are separate stages; an arrest count should not be reported as a conviction count.",
    "County jail populations, state-prison populations, juvenile placements, community supervision, and pretrial detention involve different legal statuses and institutions, so capacity or cost figures are not interchangeable.",
    "Reported crime, calls for service, arrests, prosecutions, convictions, victimization estimates, and recidivism rates use different denominators and time periods; trend claims require consistent series and definitions.",
  ],
  context: [
    ...criminalJusticeBase.context,
    "Texas criminal justice is highly decentralized. State law defines offenses and procedures, but local law-enforcement agencies make many arrests, elected district and county attorneys decide many prosecutions, trial courts manage cases, counties operate jails, and TDCJ runs the state prison and supervision systems assigned to it. DPS and other state agencies have specialized roles. KTR will identify the institution responsible for the decision or data point instead of describing a local prosecution policy or jail problem as though it were one statewide operating system.",
    "Bail is a pretrial decision, not a sentence. Courts can consider lawful factors involving appearance, offense, safety, and statutory or constitutional requirements while the accused remains presumed innocent. A high bond, denial of release where authorized, electronic monitoring, personal bond, detention, later dismissal, and conviction answer different questions. The tracker will distinguish public-safety risk from guilt and will evaluate reforms using failure-to-appear, new-offense, detention, case-disposition, and due-process evidence rather than only the number of people held or released.",
    "Crime trends need comparable definitions. Police incident reports, UCR or NIBRS data, victimization surveys, emergency calls, arrest records, prosecutorial filings, and court convictions can all move differently. Reporting changes, agency participation, offense definitions, population growth, and time windows can affect totals. KTR will identify the dataset, geographic coverage, population denominator, and period behind a trend claim and will avoid combining unlike series into a single measure of whether Texas became safer or more dangerous.",
    "Prosecutorial discretion also needs case-level and jurisdictional context. Elected prosecutors can prioritize resources, offer pleas, divert eligible cases, decline charges, or adopt office policies within legal limits, while the Attorney General or other authorities have only the jurisdiction granted by law. A disagreement over prosecution policy does not establish that a crime was never investigated or that every referred case was dismissed. The tracker will use filing, disposition, policy, and court records to show what changed and what measurable effect followed.",
    "Corrections policy spans more than prison capacity. Sentence length, parole eligibility, time served, disciplinary rules, treatment, education, reentry, probation, parole supervision, technical violations, and revocations can affect both spending and public safety. A lower prison population can reflect fewer admissions, shorter stays, diversion, demographic changes, or crime trends. KTR will connect capacity claims to admissions, releases, supervision, recidivism, staffing, violence, and program results rather than treating bed counts alone as proof of success or failure.",
    "Juvenile justice requires separate treatment because youth cases use different statutes, facilities, courts, confidentiality rules, rehabilitation goals, and transfer mechanisms. A juvenile referral, detention placement, adjudication, commitment, certification for adult prosecution, and later outcome are not equivalent. The tracker will identify the youth-system stage and institution involved and will avoid mixing juvenile and adult incarceration statistics in ways that obscure the legal and developmental differences policymakers are trying to address.",
    "The durable accountability test is whether policy reduces victimization and repeat serious offending while preserving due process and using public resources effectively. Useful evidence includes comparable crime data, case dispositions, pretrial outcomes, recidivism, supervision results, prison and jail safety, staffing, treatment completion, victim services, and court decisions. KTR's law-and-order position will remain distinct from the evidentiary question of whether a particular reform actually improved safety or merely changed where people appear in the system.",
  ],
  watchFor: [
    ...criminalJusticeBase.watchFor,
    "Comparable jurisdiction-level data connecting bail, prosecution, supervision, incarceration, and release policies with failure-to-appear, new-offense, conviction, and recidivism outcomes",
    "Final court rulings or enacted laws affecting pretrial detention, prosecutor authority, sentencing, parole, juvenile transfer, victims' rights, or criminal-procedure safeguards",
  ],
};

const transportation: PolicyTracker = {
  ...transportationBase,
  updated: reviewed,
  currentStatus:
    "Texas transportation policy is dominated by growth, maintenance, freight, safety, and congestion, but project announcements are only the first step. KTR tracks planning, funding, environmental review, right-of-way, procurement, construction, opening, maintenance, and measurable performance separately so a large program dollar amount is not mistaken for completed capacity or proven congestion relief.",
  keyFacts: [
    ...transportationBase.keyFacts,
    "A project listed in a long-range plan, included in the Unified Transportation Program, environmentally cleared, funded, let for contract, under construction, substantially complete, and open to traffic has passed different milestones and should not be counted as completed at the planning stage.",
    "General-purpose highways, managed lanes, toll roads, local streets, transit, ports, rail, aviation, and freight projects can use different owners, funding sources, revenue models, and performance measures.",
    "Construction cost, total project cost, right-of-way cost, financing cost, maintenance obligation, toll revenue, and economic-impact estimates are different quantities and should not be combined without explaining the accounting basis.",
  ],
  context: [
    ...transportationBase.context,
    "Project status should be reported through a consistent delivery pipeline. A corridor study can identify a need years before a preferred alternative is selected; environmental clearance can precede final design; funding authorization can precede contract letting; and a construction contract can cover only one segment of a larger corridor. KTR will identify the project limits, responsible agency, phase, funding status, contract status, and expected opening rather than describing every programmed dollar as work already underway or every groundbreaking as completion of the full corridor.",
    "Funding comes from distinct sources with different restrictions. State highway funds, constitutional dedications, federal programs, local contributions, toll revenue, bonds, grants, and private participation can all support transportation infrastructure. A dollar in a ten-year program is not necessarily an immediately available construction dollar, and a federal grant can require state or local match. The tracker will separate programmed, obligated, contracted, and spent amounts and will identify repayment or toll obligations where financing extends beyond the construction period.",
    "Maintenance and expansion solve different problems. Resurfacing, bridge repair, safety work, drainage, and preservation can consume substantial budgets without adding a lane, while widening or a new facility can add capacity but also create future maintenance obligations. KTR will identify whether spending maintains existing assets, addresses safety, removes a bottleneck, or adds new capacity. That distinction prevents a large maintenance program from being sold as congestion expansion and prevents needed preservation work from being dismissed because it does not create visible new mileage.",
    "Congestion claims require location and time consistency. Average speeds, travel-time reliability, hours of delay, crash-related disruption, freight bottlenecks, and peak-period volume can each describe a different problem. A project can improve reliability without reducing total vehicle miles or can shift a queue to another interchange. The tracker will compare before-and-after measures using the same corridor and time periods and will avoid claiming success solely because capacity opened or because a model projected benefits before construction.",
    "Toll policy needs separate fiscal and governance evidence. A toll facility can be operated by TxDOT, a regional mobility authority, another public entity, or under a different arrangement; rates, debt, exemptions, enforcement, and revenue use can vary. KTR will identify the governing entity, debt or financing structure, rate policy, traffic and revenue record, and any non-toll alternative when evaluating whether a project shifts costs fairly. Opposition to unnecessary tolling does not make every user-funded facility fiscally equivalent.",
    "Right-of-way and eminent domain create project-specific property-rights questions. Route selection, environmental review, access changes, appraisal, relocation, partial taking, utility relocation, and condemnation procedure can affect landowners differently. KTR will distinguish voluntary acquisition from condemnation and will connect a claimed economic benefit to the specific project footprint rather than assuming regional benefits resolve every dispute over necessity, compensation, or access.",
    "The durable transportation test is whether projects improve safety, reliability, freight movement, access, and asset condition at a transparent lifecycle cost. Useful evidence includes project schedules, contract awards, change orders, cost growth, traffic counts, crash data, pavement and bridge condition, toll performance, freight measures, and before-and-after congestion. KTR will preserve delayed schedules and revised costs rather than leaving the original announcement as the permanent status after project conditions change.",
  ],
  watchFor: [
    ...transportationBase.watchFor,
    "Project-level movement through environmental clearance, right-of-way, funding, contract letting, construction, opening, and post-opening performance with revised cost and schedule data",
    "Comparable safety, congestion, freight, pavement, bridge, toll, and maintenance evidence showing whether major transportation investments delivered the claimed benefit",
  ],
};

const healthcare: PolicyTracker = {
  ...healthcareBase,
  updated: reviewed,
  currentStatus:
    "Texas healthcare policy spans coverage, delivery, insurance regulation, Medicaid, hospitals, professional licensing, public health, mental health, and workforce capacity under overlapping state and federal rules. KTR tracks eligibility, payment, provider availability, patient outcomes, program cost, and regulatory authority separately so more spending, more insured people, or more facilities are not treated automatically as proof of better access or care.",
  keyFacts: [
    ...healthcareBase.keyFacts,
    "Insurance coverage, eligibility for a public program, enrollment, provider participation, an appointment, treatment delivered, and a health outcome are separate stages; coverage statistics alone do not establish timely access to care.",
    "Medicaid eligibility, managed-care contracts, provider payment rates, federal matching funds, waivers, supplemental payments, and state appropriations are different components of the program and can change independently.",
    "Hospital financial condition, emergency access, maternity services, mental-health capacity, clinician supply, insurance networks, and patient travel distance measure different healthcare-access pressures, especially in rural areas.",
  ],
  context: [
    ...healthcareBase.context,
    "Healthcare policy becomes clearer when coverage is separated from delivery. A person can have private insurance, Medicaid, Medicare, another public program, or no coverage and still face provider shortages, network limits, scheduling delays, transportation problems, or high out-of-pocket costs. Conversely, a new facility or clinician does not determine whether every patient can afford or access that service. KTR will identify whether a policy changes eligibility, insurance rules, provider supply, payment, or actual service capacity rather than summarizing every proposal as simply expanding or reducing healthcare.",
    "Medicaid itself is a collection of financing and delivery mechanisms. Eligibility categories, federal matching funds, state appropriations, managed-care organizations, provider rates, waivers, supplemental payments, quality measures, and eligibility administration can each affect costs and access. A higher appropriation can reflect enrollment, rate changes, federal matching shifts, or service growth. The tracker will identify the driver and distinguish budgeted spending from claims paid and patient outcomes so fiscal growth is not mistaken automatically for either waste or improved care.",
    "Rural healthcare needs geography-specific evidence. A county can lose inpatient capacity while retaining a clinic, emergency service, telehealth option, or neighboring hospital access; another area may face clinician shortages even with a hospital building. Travel time, emergency capability, maternity care, specialty access, financial margins, staffing, payer mix, and population trends can all matter. KTR will use facility and workforce evidence rather than classify every rural community as having the same access problem or assume a grant resolves the underlying staffing and demand constraints.",
    "Insurance regulation is different from provider regulation. TDI can oversee many state-regulated insurance products, network adequacy, market conduct, rates or filings under applicable law, while professional boards regulate licensed practitioners and HHSC oversees other facilities and programs. Federal law can preempt or govern some employer plans and programs. The tracker will identify the regulator and plan or provider type before stating that Texas changed a coverage rule, because a requirement for one insurance market may not reach every Texan with employer coverage.",
    "Maternal health, mental health, emergency care, chronic disease, and public health require separate outcome measures. Maternal mortality, prenatal access, psychiatric bed availability, suicide or overdose indicators, emergency wait times, immunization, infectious disease, and chronic-condition management are not interchangeable indicators of system performance. KTR will connect spending or regulation to the outcome it is intended to affect and will avoid using one health statistic to characterize the entire Texas healthcare system.",
    "Workforce policy should distinguish licensed supply from usable capacity. Texas can increase medical-school slots, residency positions, licensing pathways, scope-of-practice authority, loan repayment, or recruitment incentives, yet shortages can persist by specialty or geography. Headcounts can also overstate full-time clinical availability. The tracker will follow active licenses, practice locations, training pipelines, vacancy data, retention, and patient access where available and will separate a statutory authorization from evidence that more appointments became available.",
    "The durable accountability test is whether Texans receive timely, effective care at a sustainable public and household cost. Useful evidence includes enrollment and disenrollment, network and provider participation, appointment and travel access, hospital finances, workforce distribution, Medicaid quality measures, insurance complaints, maternal and mental-health outcomes, emergency capacity, and program spending. KTR's preference for choice, competition, and limited government will remain distinct from the factual question of whether a specific reform improved access, affordability, or outcomes.",
  ],
  watchFor: [
    ...healthcareBase.watchFor,
    "Program-level evidence connecting Medicaid eligibility, managed-care contracts, provider rates, waivers, and appropriations to access, quality, enrollment stability, and per-person cost",
    "Rural, maternal, mental-health, insurance-network, and workforce data showing whether new funding or regulatory changes produced measurable patient access or outcome improvements",
  ],
};

export const POLICY_TRACKER_WAVE20_UPGRADES: Record<string, PolicyTracker> = {
  [criminalJustice.slug]: criminalJustice,
  [transportation.slug]: transportation,
  [healthcare.slug]: healthcare,
};

export const WAVE20_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE20_UPGRADES);

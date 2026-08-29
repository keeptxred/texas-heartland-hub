import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS } from "@/data/policy-trackers";

function requireBase(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing base policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const publicEducationBase = requireBase("public-education");
const schoolChoiceBase = requireBase("school-choice");
const waterBase = requireBase("water");

const publicEducation: PolicyTracker = {
  ...publicEducationBase,
  updated: reviewed,
  keyFacts: [
    ...publicEducationBase.keyFacts,
    "State funding formulas, local property-tax collections, federal funds, recapture or equalization mechanisms, and district reserves are separate fiscal components; a change in one does not by itself show whether a district gained or lost total resources.",
    "An accountability rating, campus intervention, curriculum standard, instructional-material decision, teacher-pay policy, and special-education compliance finding arise through different legal authorities and should be tracked separately.",
    "Enrollment, average daily attendance, student demographics, grade configuration, local tax base, staffing mix, and program obligations can materially affect district comparisons, so per-student or outcome claims need a consistent denominator and time period.",
  ],
  context: [
    ...publicEducationBase.context,
    "Texas public education begins with divided authority. The Legislature writes the Education Code, appropriates state money, and can create or limit district powers. TEA administers statewide programs, accountability, data collection, and certain interventions. The State Board of Education has defined curriculum and instructional-material responsibilities, while elected local boards govern districts within those state and federal boundaries. KTR will identify the actor and legal authority behind a policy change rather than describing every school decision as either a state mandate or a purely local choice.",
    "School finance needs component-level reporting. District revenue can include state formula aid, local maintenance-and-operations taxes, debt-service taxes, federal funds, grants, and other receipts, while state formulas can respond to enrollment, attendance, student characteristics, tax-base measures, and legislative adjustments. A larger state appropriation does not automatically mean every district receives the same increase, and a local tax-rate decline does not prove total resources fell. The tracker will show the funding stream, formula change, fiscal year, and district effect before drawing conclusions about spending or relief.",
    "Accountability is distinct from funding. State ratings and interventions can rely on academic outcomes, progress measures, graduation or readiness indicators, financial integrity, governance findings, or statutory triggers. A campus can face an academic problem while its district remains financially sound, and a governance intervention does not prove every campus performs poorly. KTR will preserve the metric, school year, affected campus or district, appeal or litigation status, and final agency action rather than using a single label as a substitute for the underlying record.",
    "Curriculum standards, instructional materials, classroom practice, and local library or supplemental-material decisions also require separation. State standards establish required learning expectations, but districts and teachers can make implementation choices within law, and later legislation may impose specific parental-notice, library, or instructional restrictions. The tracker will identify whether a dispute concerns the Texas Essential Knowledge and Skills, an adopted textbook, a local lesson, a library resource, or a statutory parental right. That prevents local controversies from being presented as statewide curriculum without evidence.",
    "Teacher policy should be measured through both compensation and workforce outcomes. Salary schedules, state allotments, district supplements, certification pathways, vacancies, turnover, class size, benefits, and working conditions can move independently. A pay increase can improve compensation without solving hard-to-staff subjects or rural recruitment, while a vacancy count can reflect growth as well as attrition. KTR will connect teacher-policy claims to the actual funding mechanism and workforce data instead of treating a single statewide average as the complete staffing picture.",
    "Special education and other federally connected programs add another layer of obligations. Eligibility, individualized services, procedural safeguards, funding, staffing, monitoring, and dispute resolution are not the same issue. Federal requirements can constrain state and local choices even when Texas controls the broader education system. KTR will distinguish a state policy preference from a binding federal obligation and will track corrective actions or compliance findings through the responsible agency record. The same discipline applies to English learners, civil-rights requirements, and other student groups with program-specific rules.",
    "The durable accountability question is whether students receive stronger outcomes for the resources and authority provided. Useful measures include academic growth, proficiency, graduation, college or career readiness, attendance, safety, special-program performance, staffing stability, and fiscal stewardship. KTR's editorial preference for parental authority and transparent local governance does not make every local decision effective, and support for public schools does not make every spending increase productive. The tracker will keep the policy judgment separate from the measurable evidence.",
  ],
  watchFor: [
    ...publicEducationBase.watchFor,
    "District-level evidence connecting new state funding or tax changes to compensation, staffing, instructional services, reserves, debt, and student outcomes",
    "Final TEA or court actions involving accountability interventions, special-education compliance, parental rights, curriculum authority, or local governance",
  ],
};

const schoolChoice: PolicyTracker = {
  ...schoolChoiceBase,
  updated: reviewed,
  keyFacts: [
    ...schoolChoiceBase.keyFacts,
    "Open enrollment, charter schools, education savings accounts, private-school scholarships, homeschooling, interdistrict transfers, and specialized public programs use different legal and funding structures and should not be grouped as one program.",
    "Program authorization, appropriation, rulemaking, application launch, approved provider participation, family enrollment, payment, audit, and renewal are separate implementation milestones.",
    "A statewide appropriation or maximum award does not equal actual program cost; participation, approved expenses, unused balances, administrative spending, and any offsets in other education funding determine realized fiscal effects.",
  ],
  context: [
    ...schoolChoiceBase.context,
    "School-choice reporting should start by naming the mechanism. A charter school remains a public school under a distinct authorization framework, homeschooling operates under its own legal baseline, an interdistrict transfer moves a student between public systems, and an education-account or scholarship program can finance approved non-district services. The policy arguments overlap, but the rules do not. KTR will identify the program, administrator, eligibility standard, funding source, and provider type before describing a change as an expansion or restriction of school choice.",
    "Implementation is a chain rather than a headline. Enacted authority can require agency or comptroller rules, vendor systems, application windows, eligibility verification, provider approval, payment controls, audits, appeals, and annual reporting before families actually use benefits. A bill signing or appropriation therefore should not be reported as though every eligible student immediately received funding. The tracker will preserve milestones and dates so readers can tell the difference between authorized capacity, applications, approved accounts, funded students, and completed purchases.",
    "Eligibility rules can shape access as much as the nominal benefit amount. Income priorities, disability status, prior public-school enrollment, sibling rules, application timing, geography, available private-school seats, transportation, and provider participation can all determine who can realistically use a program. KTR will separate legal eligibility from practical access. A family can qualify on paper but lack a participating school or service nearby, while a program can serve many families without reaching every applicant if appropriations or seats are limited.",
    "Accountability also has multiple layers. Public funds can require approved expense categories, vendor controls, receipts, audits, fraud remedies, provider standards, testing or reporting, and recapture of improper payments. Those safeguards should be evaluated by actual enforcement and error data rather than by assuming either that private providers need no oversight or that public participation makes them identical to district schools. KTR will show which conditions apply to families, providers, administrators, and the state and which educational choices remain outside the funded program.",
    "District fiscal effects require more than subtracting an award from a district's budget. School finance includes state and local formulas, enrollment and attendance changes, fixed and variable costs, facilities, staffing, debt, and funding protections or transition rules. A departing student can reduce some future costs while leaving others largely unchanged. The tracker will use official fiscal notes, appropriations, enrollment data, and district finance evidence rather than treating every program dollar as either a full taxpayer saving or a dollar removed one-for-one from a classroom.",
    "Outcome measurement should match the policy claim. If supporters argue that choice improves student fit, satisfaction, safety, academic performance, or competitive pressure, evidence should track those outcomes over time. If critics argue that a program drains resources, increases segregation, or lacks accountability, those claims also need comparable data. Participation counts alone show demand, not educational success. KTR's editorial support for greater parental control will remain distinct from the factual question of whether a particular program is implemented efficiently and produces the promised results.",
    "The durable tracker should also keep voluntary participation separate from the baseline law governing nonparticipants. Conditions attached to a publicly funded account do not automatically redefine independent homeschooling or private schooling outside the program, and a rule for charter schools does not automatically bind private schools. KTR will identify the legal hook for each requirement so families can see whether a rule applies because of general state law, receipt of public funds, provider participation, or enrollment in a particular education option.",
  ],
  watchFor: [
    ...schoolChoiceBase.watchFor,
    "Official implementation data separating applications, approved families, funded accounts, participating providers, actual expenditures, unused balances, audits, and improper payments",
    "Comparable student-outcome and district-finance evidence that tests claims about access, academic performance, fiscal effects, and program accountability",
  ],
};

const water: PolicyTracker = {
  ...waterBase,
  updated: reviewed,
  keyFacts: [
    ...waterBase.keyFacts,
    "A water right, groundwater authorization, regional-plan strategy, state-plan listing, financing commitment, environmental permit, construction contract, completed facility, and delivered firm supply are separate project milestones.",
    "Surface water and groundwater operate under different Texas legal frameworks, and local groundwater districts can have materially different rules; a statewide statement about 'Texas water rights' can therefore be misleading without identifying the source and jurisdiction.",
    "Reservoir storage, permitted diversion, modeled yield, contracted supply, treatment capacity, conveyance capacity, and actual customer demand are different quantities and should not be compared as though they measure the same available water.",
  ],
  context: [
    ...waterBase.context,
    "Texas water policy starts with the source. Surface water is generally administered through state water-right and permitting systems, while groundwater has historically reflected the rule of capture subject to statutory limits and groundwater-conservation-district regulation. Cities, river authorities, utilities, irrigation districts, industries, landowners, and rural systems can therefore operate under different legal authorities. KTR will identify the source, permit or local rule, basin or aquifer, and responsible entity before describing a dispute as a statewide shortage or property-rights conflict.",
    "Planning is also a staged process. Regional planning groups develop strategies and needs assessments that feed into the State Water Plan, but inclusion in a plan does not mean a project is financed, permitted, constructed, or delivering water. Some strategies depend on conservation, reuse, groundwater, new reservoirs, aquifer storage, desalination, transfers, or other infrastructure. The tracker will show whether a proposal is merely modeled, selected as a strategy, funded for planning, under design, permitted, under construction, or operating.",
    "Project capacity needs consistent units and assumptions. A reservoir's physical storage is not the same as dependable yield during drought, and a treatment plant's nameplate capacity is not the same as firm raw-water supply or distribution capacity. Population projections, drought-of-record assumptions, evaporation, conveyance losses, contractual rights, and operating constraints can change the amount available to customers. KTR will preserve the metric and planning horizon so large acre-foot or gallon figures are not used without explaining what they actually represent.",
    "Financing should be separated from water delivered. State funds, constitutional accounts, bonds, low-interest loans, local utility rates, federal grants, and private capital can all support projects. An announced financing package can fund planning or construction without guaranteeing completion, and debt service can affect ratepayers long after a facility opens. The tracker will identify grant versus loan amounts, borrower, repayment source, project phase, and expected capacity so readers can evaluate both infrastructure progress and taxpayer or ratepayer exposure.",
    "Drought management and long-term supply solve different problems. Temporary restrictions, emergency transfers, conservation stages, and reservoir operations can respond to near-term scarcity, while permanent supply projects may take a decade or more. A wet year does not eliminate a long-term planning deficit, and a drought declaration does not prove the state as a whole lacks water. KTR will use reservoir, aquifer, drought, demand, and project data at the appropriate geographic scale rather than converting local conditions into statewide claims.",
    "Water projects also interact with environmental, property, and local-government law. Reservoirs and pipelines can require land acquisition, easements, environmental reviews, water-quality permits, interbasin considerations, mitigation, and local infrastructure. Groundwater production can create disputes among neighboring landowners or districts, while reuse and desalination can raise treatment and disposal questions. KTR's support for building needed infrastructure will remain separate from whether a specific project has completed the legal, engineering, and fiscal steps required to operate responsibly.",
    "The durable accountability test is dependable supply delivered at a transparent cost. Useful evidence includes State Water Plan needs, regional strategies, financing commitments, permit status, construction progress, firm yield, treatment and conveyance capacity, customer demand, drought performance, and rate impacts. KTR will keep projected supply separate from operating supply and preserve changed schedules or budgets instead of allowing an old project announcement to remain the permanent status after conditions change.",
  ],
  watchFor: [
    ...waterBase.watchFor,
    "Project-level movement from planning and financing through permits, land acquisition, construction, commissioning, and dependable delivered supply",
    "Regional and statewide evidence comparing projected demand, firm supply, drought performance, financing costs, and customer-rate impacts using consistent units",
  ],
};

export const POLICY_TRACKER_WAVE18_UPGRADES: Record<string, PolicyTracker> = {
  [publicEducation.slug]: publicEducation,
  [schoolChoice.slug]: schoolChoice,
  [water.slug]: water,
};

export const WAVE18_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE18_UPGRADES);

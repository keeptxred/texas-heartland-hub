import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE13 } from "@/data/policy-trackers-wave13";

function requireWave13Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE13.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave13 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const assistedSuicideBase = requireWave13Tracker("assisted-suicide");
const charterSchoolsBase = requireWave13Tracker("charter-schools");
const hempBase = requireWave13Tracker("consumable-hemp-cannabis");

const assistedSuicide: PolicyTracker = {
  ...assistedSuicideBase,
  updated: reviewed,
  keyFacts: [
    ...assistedSuicideBase.keyFacts,
    "Criminal liability for intentionally aiding suicide, a patient's right to refuse treatment, advance-directive decisions, hospice care, palliative symptom control, and medical futility procedures arise under different legal rules and should not be treated as interchangeable conduct.",
    "A bill filing, committee hearing, advocacy campaign, court challenge, enacted amendment, and effective statutory change are separate stages; proposals to change assisted-suicide law should remain labeled as proposals until Texas law actually changes.",
    "End-of-life reporting should identify the actor, intent, legal authority, medical decision at issue, and procedural posture rather than infer criminal conduct from the fact that treatment was withheld, withdrawn, or focused on comfort.",
  ],
  context: [
    ...assistedSuicideBase.context,
    "The core Texas criminal rule is narrow enough that intent and conduct matter. Penal Code Section 22.08 addresses intentionally aiding or attempting to aid another person's suicide. That is analytically different from a patient declining treatment, a surrogate making a decision under an advance directive, a physician providing legally appropriate pain control, or a hospice team shifting goals toward comfort. KTR will identify which legal framework governs the event instead of using emotionally loaded end-of-life terminology as a substitute for the statutory elements.",
    "Advance directives create their own procedural structure. Texas law addresses written directives, medical powers of attorney, surrogate decision-making, treatment preferences, and disputes about medically inappropriate or ineffective treatment. Those questions can be controversial, but they do not become assisted suicide merely because life-sustaining treatment is not initiated or is later withdrawn. The tracker will cross-reference the controlling health-law provisions and preserve the distinction between allowing an underlying condition to take its course and intentionally helping a person cause death by suicide.",
    "Palliative care and hospice also need accurate treatment. Symptom relief can involve medications that carry risk, yet lawful medical care is evaluated through professional standards, intent, dosage, informed consent, and the patient's condition. This page will not provide treatment advice. Its job is to show the legal boundary and the public-policy record, including whether lawmakers, regulators, prosecutors, or courts have addressed a particular practice. That keeps a legal reference from becoming either a medical guide or a rhetorical claim about every end-of-life decision.",
    "Legislative tracking should be version-specific. A proposal might create an exception to criminal law, establish eligibility standards, require multiple requests or evaluations, create reporting duties, or instead increase penalties or oversight. Those design choices are materially different. KTR will preserve bill number, session, text version, committee action, vote status, governor action, and effective date so a failed or substantially amended proposal does not remain on the page as though it became current law.",
    "Enforcement evidence should be treated cautiously because the criminal statute can arise in fact-specific cases. An arrest, charge, indictment, plea, trial judgment, appellate opinion, and final disposition are different procedural stages. The tracker will avoid presenting an accusation as a final legal finding and will not infer statewide prevalence from a single case. If appellate courts interpret the elements of Section 22.08, the controlling opinion and its factual limits should be added to the page rather than generalized beyond the holding.",
    "The durable policy question is whether Texas changes the boundary between prohibited assistance and lawful end-of-life decision-making. KTR's editorial preference favors protecting vulnerable people while respecting lawful patient decisions, but the reference page should let readers verify exactly where the law draws that line. Statutory text, court opinions, agency materials, professional rules, and enacted amendments—not campaign descriptions—will determine when the page's current-status language changes.",
  ],
  watchFor: [
    ...assistedSuicideBase.watchFor,
    "Appellate opinions distinguishing intentional assistance under Penal Code Section 22.08 from lawful refusal, withdrawal, hospice, palliative, or advance-directive decisions",
    "Enacted changes to criminal penalties or Health and Safety Code end-of-life procedures, with effective dates and implementing guidance",
  ],
};

const charterSchools: PolicyTracker = {
  ...charterSchoolsBase,
  updated: reviewed,
  keyFacts: [
    ...charterSchoolsBase.keyFacts,
    "A new-charter application, commissioner proposal, State Board of Education review, executed charter, expansion amendment, campus opening, enrollment growth, and renewal decision are separate authorization milestones.",
    "Charter performance should be evaluated through academic results, financial integrity, governance, special-program compliance, enrollment demand, disciplinary action, renewal, closure, and student mobility rather than through seat growth alone.",
    "Open-enrollment charters are public schools but operate under a distinct statutory and authorizer framework; they should not be conflated with private-school scholarship programs, district innovation zones, or every virtual-learning model.",
  ],
  context: [
    ...charterSchoolsBase.context,
    "Texas charter authorization is a staged process, so an application announcement is not a school opening. Applicants move through completeness review, external evaluation, interviews or capacity review, commissioner action, State Board of Education involvement where applicable, contracting, pre-opening requirements, and eventual launch. KTR will preserve those stages and dates. That allows readers to distinguish a proposed charter from an awarded charter and an awarded charter from a campus that actually opens and enrolls students.",
    "Expansion amendments require similar precision. An existing charter holder may seek additional campuses, grade levels, sites, or enrollment authority, but an application does not guarantee approval and an approval does not guarantee every proposed seat is immediately available. Useful records include the amendment request, governing-board action, TEA decision, approved maximum enrollment, opening schedule, and later operating status. The tracker will connect growth claims to the authority actually granted and the capacity actually delivered.",
    "Accountability belongs on the same page as expansion. Public charter schools receive public funds and remain subject to academic, financial, governance, special-education, civil-rights, safety, and other applicable requirements. Authorizer interventions, corrective actions, renewals, revocations, nonrenewals, and closures are evidence of how the system polices performance. KTR's editorial support for school choice does not require describing every charter as successful; it requires making performance and enforcement visible so families can distinguish strong operators from weak ones.",
    "Student outcomes should be interpreted carefully. State accountability ratings, test results, graduation, college or career readiness, attendance, enrollment persistence, discipline, and subgroup performance each measure different dimensions. Comparisons with nearby district schools can be informative but should account for grade configuration, student population, program model, and time period. The tracker will avoid claiming that the charter sector as a whole succeeds or fails based on one network, one campus, or a single year's rating.",
    "Funding and facilities are separate policy questions. Charter schools can operate under different facilities, transportation, debt, and local-tax structures than traditional districts, and lawmakers periodically debate whether those differences create unfair advantages or disadvantages. KTR will identify the funding mechanism or facility policy actually at issue instead of treating every fiscal debate as proof that one school type receives more total support. Public records and enacted formulas should anchor the comparison.",
    "The durable policy test combines access with accountability. Families may value additional seats, specialized programs, virtual or hybrid options, or a different school culture, while taxpayers need evidence that authorizers close or correct failing operators and protect public assets. TEA application records, performance reports, financial filings, board actions, amendment decisions, renewal outcomes, and closure records can show whether Texas is expanding high-quality options rather than merely increasing the number of charter entities.",
  ],
  watchFor: [
    ...charterSchoolsBase.watchFor,
    "TEA decisions that convert proposed Generation 32 or later applicants into executed charters and campuses that actually open",
    "Academic, financial, governance, renewal, revocation, closure, and student-outcome evidence for expanding charter holders",
  ],
};

const consumableHempCannabis: PolicyTracker = {
  ...hempBase,
  updated: reviewed,
  keyFacts: [
    ...hempBase.keyFacts,
    "A vetoed bill, existing Chapter 443 statute, DSHS consumable-hemp rule, controlled-substance scheduling action, court injunction, retailer license, and Compassionate-Use authorization are separate legal authorities and should be reported separately.",
    "Delta-9 concentration rules, treatment of delta-8 or other cannabinoids, product manufacturing standards, retail licensing, age or marketing restrictions, and controlled-substance scheduling can change through different legal processes.",
    "The legal status of a product should be tied to its actual composition, source, regulatory category, current court orders, and effective rules rather than inferred from broad labels such as hemp, THC, CBD, cannabis, or marijuana.",
  ],
  context: [
    ...hempBase.context,
    "Texas hemp coverage needs strict version control because statutes, agency rules, scheduling actions, and court orders can operate at the same time. The veto of SB 3 means that bill's proposed restrictions did not become law, but the veto did not erase Chapter 443 or existing agency authority. KTR will identify the legal source for each claim—enacted statute, current DSHS rule, controlled-substance schedule, or court order—so readers are not told that a failed proposal governs the market or that existing regulation disappeared with the veto.",
    "Product categories require equally careful language. Delta-9 THC concentration, delta-8 or other cannabinoid content, intoxicating effect, manufacturing method, food or beverage format, inhalable products, and medical cannabis can trigger different questions. A package marketed as 'hemp' is not by itself proof of compliance, and the word 'cannabis' is too broad to establish which Texas program applies. The tracker will describe the product characteristic or regulatory classification actually used by the controlling source.",
    "Agency rulemaking and scheduling are different mechanisms. DSHS can administer the Consumable Hemp Program under statutory authority, while controlled-substance scheduling has its own legal consequences and procedures. A rule about manufacturing, testing, labeling, or retail practice does not necessarily answer whether a cannabinoid is scheduled, and a scheduling action does not automatically create the same licensing rules as Chapter 443. KTR will preserve effective dates and link the specific agency action so later changes can be compared against the correct baseline.",
    "Litigation can temporarily alter enforcement without rewriting the underlying statute. Temporary restraining orders, trial-court injunctions, appellate stays, merits judgments, and final appellate decisions can produce different practical rules during a case. The tracker will state the procedural posture and affected products or parties rather than summarizing every court development as a permanent statewide legalization or ban. When an order expires, is stayed, or is reversed, the current-status section should be updated accordingly.",
    "Medical cannabis belongs to a separate legal program. The Texas Compassionate-Use Program has its own eligibility, dispensing, physician, product, and regulatory rules. Retail consumable hemp should not be presented as medically equivalent to that program, and a change in one framework should not be assumed to amend the other. This page is a legal and regulatory reference, not individualized medical advice; health decisions belong with qualified clinicians and the applicable medical program.",
    "The durable accountability questions include product safety, legal clarity, enforcement consistency, retailer compliance, market effects, youth access, and whether lawmakers choose a different statutory framework in a future session. KTR will track enacted text, DSHS materials, scheduling actions, court records, licensing data, and final legislation. That evidence-based structure also preserves the genuine political disagreement within Texas over prohibition, regulation, medical access, intoxicating hemp products, and the scope of criminal enforcement.",
  ],
  watchFor: [
    ...hempBase.watchFor,
    "Effective DSHS rules, controlled-substance scheduling changes, and final court orders that alter the legal treatment of specific cannabinoids or product categories",
    "Enacted legislation that replaces the vetoed SB 3 approach and clearly defines licensing, age, product, testing, marketing, possession, or enforcement rules",
  ],
};

export const POLICY_TRACKER_WAVE13_UPGRADES: Record<string, PolicyTracker> = {
  [assistedSuicide.slug]: assistedSuicide,
  [charterSchools.slug]: charterSchools,
  [consumableHempCannabis.slug]: consumableHempCannabis,
};

export const WAVE13_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE13_UPGRADES);

import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE7 } from "@/data/policy-trackers-wave7";

function requireWave7Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE7.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave7 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-27";
const eVerifyBase = requireWave7Tracker("e-verify-employment");
const publicLaborBase = requireWave7Tracker("public-sector-labor");
const licensingBase = requireWave7Tracker("occupational-licensing-mobility");

const eVerifyEmployment: PolicyTracker = {
  ...eVerifyBase,
  updated: reviewed,
  keyFacts: [
    ...eVerifyBase.keyFacts,
    "Texas's Chapter 673 mandate applies to state agencies and new employees; extending E-Verify to contractors, political subdivisions, or private employers requires separate legal authority rather than inference from the existing state-agency rule.",
    "Form I-9 and E-Verify are related but distinct federal processes. Employers can have I-9 duties without a general E-Verify mandate, and improper document demands can create separate federal discrimination problems.",
    "A tentative E-Verify mismatch is not itself a final finding that a worker lacks authorization; federal procedures include notice and contest steps before a final result.",
  ],
  context: [
    ...eVerifyBase.context,
    "The first question in Texas E-Verify coverage is which employer is regulated. Government Code Chapter 673 applies to state agencies and requires participation for new employees, but that does not convert every business operating in Texas into a mandatory E-Verify participant. Contractors can face obligations through separate contract or federal rules, and future legislation could expand state coverage. KTR will identify the employer category and source of the mandate instead of presenting the state-agency law as a universal private-sector requirement.",
    "E-Verify also should not be confused with Form I-9. Federal law generally requires covered employers to complete employment-eligibility verification through the I-9 process, while E-Verify electronically checks information against government records for participating employers. The two systems interact but are not interchangeable. A policy proposal requiring E-Verify can therefore change the verification process without creating the underlying federal prohibition on knowingly employing unauthorized workers from scratch.",
    "Mismatch procedures matter because database verification is not infallible. A tentative nonconfirmation can result from data discrepancies and triggers federal notice and contest procedures. Employers should not treat a preliminary mismatch as a final determination or use it as a shortcut around required process. KTR will distinguish initial system responses, employee contest steps, final nonconfirmations, and actual employment actions so the tracker does not inflate administrative mismatches into unsupported claims about unlawful workers.",
    "Anti-discrimination rules are another implementation layer. Employment verification does not authorize employers to demand extra documents based on national origin, citizenship appearance, accent, or other unlawful criteria. The policy argument for stronger work-authorization enforcement can coexist with a requirement that verification be administered consistently. KTR will identify whether a dispute concerns failure to verify, improper document practices, retaliation, or discrimination rather than describing all verification litigation as opposition to enforcement.",
    "Expansion proposals should be evaluated through coverage and enforcement details. A bill can apply to all private employers, only employers above a size threshold, public contractors, political subdivisions, or particular industries. It can also define different penalties, cure periods, agency responsibilities, and safe harbors. Those choices determine both practical reach and compliance cost. KTR will preserve bill version and final status so a broad proposal that failed does not become part of the description of current Texas law.",
    "The durable policy test is whether verification rules measurably improve lawful hiring while keeping the process accurate and administrable. Useful evidence includes agency compliance, employer participation, final verification outcomes, enforcement actions, processing errors, and litigation. The tracker will not claim that E-Verify by itself resolves border security or the broader immigration system; it is an employment-specific mechanism that should be judged on that narrower job.",
  ],
  watchFor: [
    ...eVerifyBase.watchFor,
    "Official data or audits showing state-agency Chapter 673 compliance and documented verification outcomes",
    "Federal changes to mismatch, privacy, document, or employer-sanction procedures that alter how Texas mandates operate",
  ],
};

const publicSectorLabor: PolicyTracker = {
  ...publicLaborBase,
  updated: reviewed,
  keyFacts: [
    ...publicLaborBase.keyFacts,
    "Chapter 617's general rules and occupation-specific Local Government Code frameworks must be read together; an authorized police or firefighter system is not proof that collective bargaining is generally permitted for all Texas public employees.",
    "Collective bargaining, meet-and-confer, civil-service procedures, individual grievances, employee associations, and ordinary personnel policy are distinct mechanisms with different legal effects.",
    "A public employee's ability to join or be represented by an organization does not by itself establish a statutory right to strike or compel a governmental employer to enter a collective-bargaining agreement.",
  ],
  context: [
    ...publicLaborBase.context,
    "Texas public-sector labor law begins with a broad statewide rule but quickly becomes occupation- and locality-specific. Chapter 617 generally bars public officials from entering collective-bargaining contracts and restricts organized strikes, while other statutes authorize defined police or firefighter frameworks in qualifying jurisdictions. KTR will identify the public employer, employee category, local adoption status, and statutory chapter before saying bargaining is permitted or prohibited. That prevents one city's authorized agreement from being generalized to every state or local employee.",
    "Meet-and-confer systems also should not be described as identical to traditional collective bargaining. Statutes can define who represents employees, which subjects may be discussed, how an agreement is approved, whether voters have a role, and how the agreement interacts with local ordinances or civil-service law. The label matters less than the operative authority. KTR will link the actual statute and agreement so taxpayers can see what obligations a local government accepted and how the process was authorized.",
    "Grievance rights are a separate baseline. Chapter 617 preserves public employees' ability to present grievances individually or through representatives that do not claim a right to strike. A government refusing to recognize a collective-bargaining demand therefore does not necessarily eliminate every mechanism for an employee to contest discipline, pay, workplace conditions, or other issues. Civil-service systems, personnel policies, administrative appeals, and statutory grievance procedures can provide additional routes depending on the employee and employer.",
    "Taxpayer exposure should be measured through agreement terms rather than assumed from union presence alone. Compensation schedules, overtime, staffing, leave, discipline, pension effects, arbitration, release time, and contract duration can have different fiscal consequences. KTR's editorial skepticism toward expansive public-sector union power will remain separate from the factual accounting: what the agreement requires, what the local government estimates it costs, and what services or staffing outcomes change after adoption.",
    "Strike restrictions deserve precise language too. An organized work stoppage governed by Chapter 617 is different from an individual resignation, lawful political advocacy, grievance activity, or other protected conduct. When a dispute arises, the tracker should identify whether officials alleged an actual strike, sickout, slowdown, refusal of duty, or another action and what statutory consequence followed. Political rhetoric about a 'strike' should not substitute for the documented conduct and legal finding.",
    "The durable policy question is how Texas balances taxpayer control, public-service continuity, employee representation, and local flexibility. Legislative amendments, local elections, authorized agreements, arbitration decisions, fiscal records, and court opinions can show where that balance is moving. Keeping the legal frameworks distinct makes the tracker useful in future local disputes instead of reducing every controversy to a generic argument about unions.",
  ],
  watchFor: [
    ...publicLaborBase.watchFor,
    "New or amended local agreements with identifiable fiscal, staffing, grievance, or discipline provisions",
    "Court decisions clarifying when a special local labor statute displaces or coexists with Chapter 617's general rules",
  ],
};

const occupationalLicensingMobility: PolicyTracker = {
  ...licensingBase,
  updated: reviewed,
  keyFacts: [
    ...licensingBase.keyFacts,
    "HB 11 directs reciprocity work for licenses issued by TDLR; it should not be described as automatic recognition for professional licenses administered by unrelated Texas boards or agencies.",
    "Substantial equivalence is a standards comparison, so an out-of-state license can require review of education, training, examination, experience, scope, discipline, or other criteria before a reciprocity agreement is available.",
    "Reciprocity, interstate compacts, endorsement, temporary practice, and elimination of a license are different mobility reforms and can produce different obligations for workers and regulators.",
  ],
  context: [
    ...licensingBase.context,
    "HB 11 is a targeted reciprocity statute rather than universal license recognition. It instructs TDLR to maximize agreements for licenses the department issues when law and substantial-equivalence requirements permit. Texas has many occupational regulators outside TDLR, so a worker licensed by another state's medical, legal, education, or other professional board should not assume HB 11 alone creates Texas authorization. KTR will identify the Texas regulator and occupation before describing a mobility pathway.",
    "Substantial equivalence can be the practical bottleneck. States may regulate the same occupation with different education hours, examinations, experience requirements, continuing education, scopes of practice, insurance, background checks, or disciplinary systems. A reciprocity agreement must address enough of those differences to satisfy the Texas framework. The tracker will follow TDLR procedures and agreements so readers can see which occupations gained a usable route rather than treating the statutory directive itself as proof that all barriers disappeared immediately.",
    "Different reform models should remain distinct. Reciprocity generally involves mutual or qualifying recognition between jurisdictions. Endorsement can allow licensure based on an existing credential under state-defined conditions. Interstate compacts create multi-state legal frameworks for participating professions. Universal recognition proposals can accept out-of-state licenses more broadly, while deregulation can remove a licensing requirement entirely. KTR will identify which mechanism a bill actually uses because the worker mobility, consumer protection, and administrative consequences differ.",
    "Costs and delays provide useful outcome measures. Application fees, education duplication, testing, processing time, temporary-practice rules, and waiting periods can determine whether a nominal reciprocity agreement meaningfully improves mobility. TDLR reports and occupational data can show where agreements exist, but worker experience and processing metrics are necessary to test whether the reform functions in practice. KTR will avoid calling a statutory program successful solely because an agreement was signed.",
    "Public-safety arguments should also be occupation-specific. Licensing can protect consumers when competence is difficult to assess and mistakes create substantial risk, while unnecessarily burdensome licensing can protect incumbents and make it harder for experienced workers to move or enter a trade. KTR's editorial preference for reducing unnecessary barriers will be tested against concrete standards, complaint records, disciplinary data, and alternatives such as certification or bonding rather than treating every license as equally justified or equally harmful.",
    "The 2027 statutory report creates a built-in accountability point. TDLR can identify completed agreements, barriers created by Texas law, and recommendations for legislative change. KTR will compare that report with the original statutory objective and follow whether lawmakers act on identified obstacles. That turns licensing reform from a one-session announcement into a measurable implementation project centered on actual worker mobility.",
  ],
  watchFor: [
    ...licensingBase.watchFor,
    "Occupation-by-occupation reciprocity agreements with effective dates, eligibility standards, and actual processing procedures",
    "TDLR data or the 2027 statutory report identifying Texas requirements that prevent otherwise viable reciprocity agreements",
  ],
};

export const POLICY_TRACKER_WAVE7_UPGRADES: Record<string, PolicyTracker> = {
  [eVerifyEmployment.slug]: eVerifyEmployment,
  [publicSectorLabor.slug]: publicSectorLabor,
  [occupationalLicensingMobility.slug]: occupationalLicensingMobility,
};

export const WAVE7_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE7_UPGRADES);

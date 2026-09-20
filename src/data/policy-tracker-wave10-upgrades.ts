import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE10 } from "@/data/policy-trackers-wave10";

function requireWave10Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE10.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave10 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const schoolLibraryBase = requireWave10Tracker("school-library-materials");
const schoolSafetyBase = requireWave10Tracker("school-safety-security");
const violentBailBase = requireWave10Tracker("violent-offense-bail");

const schoolLibraryMaterials: PolicyTracker = {
  ...schoolLibraryBase,
  updated: reviewed,
  keyFacts: [
    ...schoolLibraryBase.keyFacts,
    "Library acquisition, a parent's restriction for that parent's child, a formal challenge to a title, board approval of proposed acquisitions, and classroom assignment are different actions governed by different procedures and should not be collapsed into a single claim that a book was 'banned.'",
    "TEA model policies and guidance assist districts with implementation, but the enacted Education Code controls when guidance, a local policy, or a public statement uses broader or narrower language than the statute.",
    "A district's compliance record can include catalog access, notices, board agendas, acquisition lists, challenge decisions, advisory-council records, and parental-control tools; the presence of one of those items does not establish compliance with every statutory requirement.",
  ],
  context: [
    ...schoolLibraryBase.context,
    "SB 13 creates a process-heavy framework, so the first reporting task is to identify what action actually occurred. A district can consider a proposed purchase, approve an acquisition list, let an individual parent restrict a child's access, receive a challenge to an existing title, or remove material after review. Those events have different legal and practical meanings. KTR will name the stage, decision maker, title or category involved, and governing policy instead of using 'ban' or 'censorship' as a substitute for the administrative record.",
    "Board approval is another point where chronology matters. The statute requires public-board involvement in proposed library acquisitions under defined procedures, while districts also operate catalogs and existing collections accumulated under older rules. A board vote on a proposed acquisition should not be described as a statewide judgment on a title, and a title already in a collection may enter a separate challenge or review process. The tracker will preserve meeting dates, agenda materials, vote results, and whether a decision concerns a new purchase or material already owned.",
    "Parental controls are individualized in important ways. A parent's ability to identify material that the parent's own child may not check out is different from a districtwide removal available to no students. KTR's editorial support for parental authority is strongest when the mechanism is described accurately: what information parents can see, how they submit restrictions, whether the system records them reliably, and what happens if a restricted item is nevertheless checked out. Those implementation details are more useful than assuming every parental objection must produce the same districtwide result.",
    "Formal challenges also require a documented process. District policy can define how a resident or parent raises an objection, which committee or administrator reviews the material, what standards apply, whether the material remains available during review, and how an appeal reaches the board. KTR will distinguish a submitted challenge from a final decision. A social-media complaint or public-comment statement can prompt review, but it is not itself proof that a title was removed or that the district violated the law.",
    "The distinction between library and instructional materials is essential. A voluntarily selected library book, a required classroom text, supplemental instructional material, and a teacher-created assignment can implicate different statutory or local rules. Reporting them as one category can misstate both parental rights and educator obligations. This tracker will remain centered on the school-library framework and cross-link broader public-education or parental-rights pages when a controversy is actually about curriculum or classroom instruction.",
    "The durable measure of SB 13 is transparent, usable implementation. TEA guidance, Texas State Library standards, district policies, catalog access, acquisition records, advisory-council activity, challenge outcomes, and litigation can show whether the system works as written. KTR will also preserve changes after court rulings or later legislation so an older model policy is not mistaken for the current rule. That evidence standard supports age-appropriate materials and parental oversight while still accurately recording local decisions and constitutional disputes.",
  ],
  watchFor: [
    ...schoolLibraryBase.watchFor,
    "District implementation records showing whether catalog access, individualized parental restrictions, acquisition approval, challenges, and appeals function as separate statutory processes",
    "Final court decisions distinguishing school-library acquisition or access rules from classroom instruction and clarifying any First Amendment or due-process limits",
  ],
};

const schoolSafetySecurity: PolicyTracker = {
  ...schoolSafetyBase,
  updated: reviewed,
  keyFacts: [
    ...schoolSafetyBase.keyFacts,
    "The statutory requirement focuses on board-determined armed-security coverage and includes a good-cause pathway; a district invoking that pathway remains responsible for adopting and reviewing an alternative standard rather than simply treating the requirement as optional.",
    "A commissioned peace officer, school resource officer, school marshal, qualified district employee, reserve officer, and honorably retired officer can have different legal authorities, training, employment relationships, and eligibility requirements under the broader Texas framework.",
    "Security staffing, emergency operations, physical access controls, communications, behavioral-threat processes, drills, audits, reunification, and law-enforcement coordination are separate preparedness layers; compliance with one does not establish overall campus safety.",
  ],
  context: [
    ...schoolSafetyBase.context,
    "Texas school-safety reporting should begin by separating the armed-security mandate from the larger emergency-management system. Section 37.0814 addresses armed personnel, while districts also maintain emergency operations plans, conduct audits, coordinate with law enforcement, train staff, manage facilities, and prepare for response and recovery. KTR will identify which obligation is at issue rather than treating the presence of an armed officer as proof that every state safety requirement has been satisfied.",
    "Good-cause exceptions deserve specific scrutiny because they are part of the statute rather than evidence that the law has no force. A district can face shortages of qualifying personnel or funding and adopt an alternative standard under the applicable rules. Useful reporting identifies the board action, stated reason, duration, alternative measures, review date, and whether the underlying staffing or funding obstacle changed. A district should not be labeled noncompliant solely because it uses a lawful exception, but an exception also should not become an unexplained permanent substitute for the statutory baseline.",
    "Personnel categories matter operationally. Different officers or authorized individuals can have different commissioning authorities, training standards, supervision, employment status, duty assignments, and powers. A district announcement that it has 'armed security' is therefore only a starting point. KTR will identify the category actually used and the legal authority supporting it, especially when later legislation expands eligibility. This lets readers distinguish a staffing innovation from a change in the minimum security obligation itself.",
    "Funding is another measurable implementation question. State grants or formula changes can support personnel, equipment, facility hardening, communications, or other safety measures, but announced funding does not show how a district spent it or whether it solved a stated deficiency. The tracker will follow award amounts, local allocations, board budgets, projects completed, and recurring personnel costs where public records are available. That helps separate one-time capital improvements from ongoing staffing commitments that districts must sustain after a grant period ends.",
    "Audits and incident reviews should be treated as evidence sources rather than scorecards that guarantee safety. A safety audit can identify doors, procedures, communications, training, or planning deficiencies, while a real incident can reveal failures that a checklist did not predict. KTR will report official findings and corrective actions without claiming that any policy can eliminate all risk. The useful question is whether identified weaknesses are corrected, deadlines are met, and lessons from incidents are incorporated into plans and training.",
    "The durable policy test is whether Texas requirements produce faster, more reliable prevention and response across campuses with different sizes and resources. TEA guidance, Texas School Safety Center material, board records, exception reviews, audits, grants, and post-incident reports can show implementation over time. KTR's support for strong campus security does not require overstating any single measure; it requires tracking whether the entire statutory system is funded, staffed, practiced, and corrected when evidence shows a weakness.",
  ],
  watchFor: [
    ...schoolSafetyBase.watchFor,
    "Board records documenting the reason, alternative standard, duration, and recurring review of good-cause exceptions rather than merely counting districts that invoke them",
    "Audit findings and corrective-action records showing whether staffing, access-control, communications, emergency-plan, or coordination deficiencies are actually resolved",
  ],
};

const violentOffenseBail: PolicyTracker = {
  ...violentBailBase,
  updated: reviewed,
  keyFacts: [
    ...violentBailBase.keyFacts,
    "The 2025 amendment changes eligibility for bail in defined cases, but a detention hearing remains a pretrial proceeding; an order denying bail is not a conviction and should not be described as a final finding that the accused committed the charged offense.",
    "Covered offense, evidentiary burden, notice, counsel, hearing timing, factual findings, written order, review, and later changed circumstances can be separate implementation questions under constitutional text, statutes, and court rules.",
    "County-level detention counts should distinguish people held under the new violent-offense constitutional authority from people held for other reasons such as existing no-bail provisions, other holds, inability to satisfy monetary bail, or post-conviction custody.",
  ],
  context: [
    ...violentBailBase.context,
    "The 2025 amendment is best tracked as a defined exception within a broader constitutional bail system. Texas law continues to recognize bail and due-process protections generally, while the new provision creates circumstances in which a judge or magistrate must deny bail after the required hearing and findings for listed offenses. KTR will identify the charged offense and constitutional pathway rather than using 'no bail' as though every serious felony now produces automatic detention.",
    "A detention hearing is a distinct procedural event. The state can be required to present evidence and satisfy a specified standard, the accused can have procedural rights, and the judicial officer must make the findings required by the operative law. Those findings concern pretrial detention, not final criminal guilt. KTR's law-and-order editorial perspective will remain separate from this distinction so coverage of a dangerousness determination does not erase the presumption of innocence or misstate the result of the underlying criminal case.",
    "Implementation statutes and court rules can determine how the constitutional language works day to day. Filing deadlines, notice, counsel, admissible evidence, continuances, written findings, appellate review, and reconsideration can shape whether hearings are prompt and consistent. The tracker will cite enacted implementing law and binding court rules rather than assuming the constitutional amendment answers every procedural detail. If counties use different local forms or scheduling practices, those administrative differences should not be confused with different constitutional standards.",
    "Outcome data require careful categorization. A jail population includes defendants held under many legal authorities, including other constitutional no-bail provisions, warrants, federal or immigration holds, probation matters, inability to post monetary bail, and sentences after conviction. To evaluate Proposition 3, KTR will look for records that specifically identify hearings and orders under the new provision. A general increase or decrease in jail population cannot by itself establish that the amendment caused the change.",
    "Public-safety evaluation also needs a comparison period and defined outcome. Supporters can argue that detention prevents violent reoffending or witness intimidation in high-risk cases, while critics can focus on due process, detention errors, jail costs, case delays, or unequal application. Useful evidence includes hearing counts, grant and denial rates, subsequent case outcomes, release-related offenses where measurable, detention length, appellate reversals, and county resource impacts. The tracker will preserve the limits of any dataset rather than treating one county's experience as a statewide result.",
    "The durable legal questions will emerge through appellate interpretation. Courts may address which charges qualify, what evidence is sufficient, how findings must be stated, whether a later change in circumstances permits reconsideration, and how the amendment interacts with federal constitutional protections. KTR will distinguish trial-court practices from binding appellate rules and date each development. That gives readers a current map of the no-bail framework while keeping the political debate anchored to actual hearings and judicial decisions.",
  ],
  watchFor: [
    ...violentBailBase.watchFor,
    "Published county or statewide data that specifically identify hearings and detention orders under the 2025 violent-offense constitutional provision rather than general jail populations",
    "Binding appellate decisions defining qualifying offenses, evidentiary requirements, written findings, review standards, reconsideration, or due-process safeguards",
  ],
};

export const POLICY_TRACKER_WAVE10_UPGRADES: Record<string, PolicyTracker> = {
  [schoolLibraryMaterials.slug]: schoolLibraryMaterials,
  [schoolSafetySecurity.slug]: schoolSafetySecurity,
  [violentOffenseBail.slug]: violentOffenseBail,
};

export const WAVE10_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE10_UPGRADES);

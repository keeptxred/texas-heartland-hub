import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE6 } from "@/data/policy-trackers-wave6";

function requireWave6Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE6.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave6 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-27";
const higherEdDeiBase = requireWave6Tracker("higher-education-dei");
const foreignPropertyBase = requireWave6Tracker("foreign-adversary-property");
const chinaInvestmentBase = requireWave6Tracker("china-investment-restrictions");

const higherEducationDei: PolicyTracker = {
  ...higherEdDeiBase,
  updated: reviewed,
  keyFacts: [
    ...higherEdDeiBase.keyFacts,
    "Section 51.3525 regulates specified institutional offices and practices; it should not be treated as a prohibition on every academic discussion, research project, historical subject, student expression, or compliance activity involving race, sex, ethnicity, or discrimination.",
    "Institutional compliance, governing-board oversight, state reporting, accreditation concerns, federal civil-rights obligations, and individual speech rights are different legal layers that may overlap in a university dispute.",
    "SB 37's 2025 governance changes are separate from the original SB 17 DEI restrictions, so curriculum, faculty-senate, ombudsman, and governing-board changes should be attributed to the correct statute.",
  ],
  context: [
    ...higherEdDeiBase.context,
    "The central reporting task is to define what Section 51.3525 actually regulates. Texas targeted specified DEI offices, required statements, employment practices, training, and differential treatment at public institutions, while the statute contains definitions and exceptions that matter to its scope. KTR will distinguish an administrative DEI program from classroom teaching, research, student organizations, federal compliance, or ordinary discussion of discrimination. That prevents a broad political description such as 'Texas banned DEI' from being used as a substitute for the operative statutory text.",
    "Compliance is institutional as well as individual. University systems, governing boards, presidents, human-resources offices, academic units, and compliance personnel may each have duties under state law or institutional policy. A single controversial course or employee statement does not by itself establish a statutory violation. Useful evidence includes adopted policies, job descriptions, training materials, required statements, audit findings, governing-board records, and official compliance reports. KTR will tie a claim to the regulated practice rather than inferring noncompliance from terminology alone.",
    "Federal civil-rights law creates another layer. Public universities remain subject to federal constitutional and statutory duties even while Texas restricts particular DEI practices. A university may therefore need to prevent unlawful discrimination or respond to federal requirements without recreating a prohibited state-law program. Whether a specific practice is required by federal law, voluntarily adopted, or barred by Texas law is a legal question that depends on the source and facts. The tracker will identify the federal requirement actually invoked instead of assuming the words 'civil rights' automatically override or validate a disputed state policy.",
    "Speech and academic freedom should also be kept separate from institutional administration. Texas campus-free-speech law and the First Amendment protect expressive activity in ways that are not identical to the rules governing what a university administration may require employees to say or consider in hiring. A professor discussing race in a course, a student organization advocating a political theory, and an administrative office imposing a mandatory statement can present materially different legal questions. Cross-linking to the campus-speech tracker preserves that distinction rather than duplicating the analysis here.",
    "SB 37 adds a later governance layer involving governing boards, curriculum review, faculty structures, and ombudsman functions. Those changes may affect how universities make academic and administrative decisions, but they should not be retroactively attributed to SB 17. KTR will preserve bill numbers, effective dates, and implementation records so readers can tell whether a change came from the DEI statute, later governance legislation, a system policy, or an institution's voluntary response.",
    "The durable accountability question is measurable compliance. State audits, coordinating-board activity, governing-board certifications, lawsuits, and university policy revisions can show whether institutions changed the practices lawmakers targeted. KTR will report documented violations or corrective actions precisely and will also identify when a controversy concerns conduct outside the statute's scope. That evidence standard supports a merit-and-equal-treatment editorial position without inflating every campus disagreement into a proven violation of Texas DEI law.",
  ],
  watchFor: [
    ...higherEdDeiBase.watchFor,
    "Published audit findings, compliance certifications, and corrective actions tied to specific Section 51.3525 requirements",
    "Court decisions clarifying the boundary between state DEI restrictions, protected expression, academic activity, and federal civil-rights duties",
  ],
};

const foreignAdversaryProperty: PolicyTracker = {
  ...foreignPropertyBase,
  updated: reviewed,
  keyFacts: [
    ...foreignPropertyBase.keyFacts,
    "Citizenship, lawful permanent residence, entity ownership, control, domicile, designated-country status, and the type of property interest can affect coverage; nationality shorthand is not a reliable substitute for the statutory definitions.",
    "An Attorney General investigation, notice, filed enforcement action, trial-court finding, and completed divestiture are distinct stages and should not be reported as if a prohibited acquisition has been finally established at the first step.",
    "The Texas statute concerns acquisition of covered real-property interests and is analytically separate from federal national-security review, sanctions, immigration status, or Texas investment-divestment laws aimed at securities holdings.",
  ],
  context: [
    ...foreignPropertyBase.context,
    "SB 17 should be read through its categories and exceptions rather than through ethnic or nationality labels. The statute identifies governments, entities, and individuals connected to designated countries while expressly exempting U.S. citizens and lawful permanent residents and creating other defined exceptions. A person's birthplace or surname is therefore not evidence that a transaction is prohibited. KTR will identify the statutory category, ownership or control relationship, residency or immigration status when legally relevant, and property interest before describing a transaction as covered.",
    "Property type matters because the law's definition reaches more than a conventional house or farm. Agricultural, commercial, industrial, residential, mineral, groundwater, timber, and water-right interests can fall within the framework. That breadth makes title records, entity structures, lease terms, mineral interests, and transaction documents important evidence. The tracker will state what interest was actually acquired rather than treating every connection to Texas land as fee-simple ownership of acreage.",
    "Enforcement also has a process. Attorney General investigative authority can lead to civil proceedings, and a court can order divestiture after the legal requirements are met. An investigation is not a final adjudication. Likewise, a lawsuit may raise constitutional, federal-preemption, due-process, equal-protection, property-rights, or statutory-interpretation defenses that remain unresolved while the case proceeds. KTR will preserve the procedural posture so a press release announcing enforcement does not become a claim that a court has already found a violation.",
    "The designated-country mechanism is time-sensitive. If the governor or another legally authorized process changes which countries or entities are covered under the statutory framework, the practical reach of the law can change without rewriting every section of the Property Code. Reporting should therefore date the designation source used for a claim. An old article naming a country should not be treated as proof that the same designation remains operative indefinitely.",
    "Property rights and national security are both part of the policy debate. Supporters can argue that Texas should keep strategic land and resources away from hostile governments or controlled entities, while critics can question breadth, discrimination, due process, or economic effects. The tracker can make that debate concrete by showing who is covered, what transactions are restricted, what exceptions protect ordinary lawful residents, how enforcement works, and what courts decide rather than relying on generalized fear or reassurance.",
    "This policy should remain separate from Texas securities-divestment rules. A pension fund holding shares in a restricted company, a foreign-controlled entity buying Texas mineral rights, and federal review of a transaction involving critical infrastructure may all raise national-security concerns, but they arise under different legal systems. KTR will cross-link those topics while keeping each URL's controlling law and evidence distinct.",
  ],
  watchFor: [
    ...foreignPropertyBase.watchFor,
    "Dated designation records that alter which countries, governments, organizations, or entities fall within the statutory framework",
    "Final court orders or appellate decisions defining coverage, exceptions, constitutional limits, or the divestiture remedy",
  ],
};

const chinaInvestmentRestrictions: PolicyTracker = {
  ...chinaInvestmentBase,
  updated: reviewed,
  keyFacts: [
    ...chinaInvestmentBase.keyFacts,
    "Chapter 809A regulates specified Texas governmental investment entities rather than private investors generally; a company appearing on a restricted list does not itself make private ownership of its securities unlawful under this Texas chapter.",
    "The restricted-list date, the covered entity's actual direct or indirect exposure, the divestment timetable, and any statutory financial-harm exception are separate facts needed to evaluate compliance.",
    "Texas securities-divestment rules and Texas real-property acquisition restrictions address different assets and regulated actors even when both policies are justified by concerns about foreign-adversary influence.",
  ],
  context: [
    ...chinaInvestmentBase.context,
    "Chapter 809A is a public-funds rule, so the first question is whether the investor is one of the governmental entities covered by the statute. Major retirement systems and the Permanent School Fund can fall within that framework, while an ordinary Texas resident's brokerage account is not governed by Chapter 809A merely because it contains a security associated with China. KTR will identify the covered fund and statutory duty before describing a holding as prohibited.",
    "List mechanics are central to implementation. The Comptroller's restricted-entity list can incorporate statutory criteria and referenced federal lists, and its contents can change. A company name found in an old report is therefore not enough to establish current status. The tracker will preserve the list date, category, and underlying official record, then distinguish publication of the list from the later steps a covered fund must take to identify exposure, communicate with managers, restrict purchases, or divest.",
    "Direct and indirect holdings can require different analysis. A retirement system may own a security directly, invest through an external manager, or hold a pooled fund containing many underlying assets. Statutory definitions and procedures determine how those structures are treated. KTR will avoid presenting a headline gross exposure number as if every dollar represents a directly controlled prohibited position unless the official report supports that characterization.",
    "Fiduciary exceptions also need precise reporting. A statutory mechanism designed to avoid material financial harm does not erase the divestment policy, but neither should it be described as proof that a fund is ignoring the law. If an exception is used, the useful questions are who invoked it, what statutory standard applies, what documentation was produced, how long the exception lasts, and what financial consequence the fund identified. Those records let readers evaluate whether the safeguard is narrow and evidence-based or has become a broad escape hatch.",
    "Performance claims require a counterfactual. Selling or avoiding a restricted security can affect returns, transaction costs, diversification, and manager choices, but a gain or loss cannot be attributed to the policy without a defined benchmark and time period. KTR will distinguish the value of divested holdings, realized transaction costs, subsequent market performance, and total fund returns. That prevents both supporters and critics from claiming financial success or failure based on a single stock's movement after a divestment decision.",
    "The durable policy test is whether Texas can reduce strategic exposure while maintaining transparent stewardship of beneficiary assets. Annual reports, Comptroller lists, fund board records, audited financial statements, attorney-general enforcement, and legislative amendments provide the evidence. KTR's editorial preference for limiting hostile-government financial exposure does not change the obligation to show taxpayers and beneficiaries what was sold, why it was covered, what exceptions were used, and what measurable costs or benefits followed.",
  ],
  watchFor: [
    ...chinaInvestmentBase.watchFor,
    "Dated fund reports identifying restricted holdings, completed divestments, indirect exposure, and any invoked financial-harm exceptions",
    "Changes to incorporated federal restricted-entity lists that alter Texas coverage without a new state statute",
  ],
};

export const POLICY_TRACKER_WAVE6_UPGRADES: Record<string, PolicyTracker> = {
  [higherEducationDei.slug]: higherEducationDei,
  [foreignAdversaryProperty.slug]: foreignAdversaryProperty,
  [chinaInvestmentRestrictions.slug]: chinaInvestmentRestrictions,
};

export const WAVE6_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE6_UPGRADES);

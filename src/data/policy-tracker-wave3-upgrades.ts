import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE3 } from "@/data/policy-trackers-wave3";

function requireWave3Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE3.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave3 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-27";

const medicalFreedomBase = requireWave3Tracker("medical-freedom");
const esgEnergyBoycottsBase = requireWave3Tracker("esg-energy-boycotts");
const agricultureFamilyFarmsBase = requireWave3Tracker("agriculture-family-farms");

const medicalFreedom: PolicyTracker = {
  ...medicalFreedomBase,
  updated: reviewed,
  keyFacts: [
    ...medicalFreedomBase.keyFacts,
    "Texas medical-freedom protections are distributed across subject-specific statutes. A protection written for organ-transplant eligibility does not automatically govern school vaccination rules, employment policies, public-health powers, insurance, or treatment of minors.",
    "For enacted bills, the effective date and implementing agency matter separately from the governor's signature date. Rules, licensing guidance, forms, and enforcement procedures can determine how a statutory protection operates in practice.",
    "A failed bill can still reveal the policy questions legislators are debating, but it should remain labeled as failed or unenacted and must not be described as part of current Texas law.",
  ],
  context: [
    ...medicalFreedomBase.context,
    "The central reporting discipline for medical-freedom coverage is scope. Texas law contains different consent, licensing, vaccination, privacy, emergency, professional-discipline, and public-health provisions for different settings. A rule that governs a hospital is not automatically the rule that governs a school district, employer, pharmacy, long-term-care facility, transplant program, or physician office. KTR will identify the regulated actor, the patient or employee population, the exact statutory section, and the relevant agency before drawing a statewide conclusion. That prevents a narrow protection from being inflated into a blanket right that the text does not actually create.",
    "HB 4076 is a good example of why that precision matters. The enacted measure addresses adverse organ-transplant decisions based solely on vaccination status while preserving individualized medical judgment when a physician determines vaccination status is medically significant. Those two parts should be read together. The law creates a protection against categorical exclusion while still recognizing that transplant medicine involves patient-specific risk assessment. Reporting that mentions only the protection or only the medical exception would give readers an incomplete picture of what the statute actually does.",
    "Implementation also deserves separate attention from enactment. When a bill instructs HHSC or another licensing body to adopt rules or update procedures, a signed statute establishes the legal duty but does not by itself show how every regulated facility is complying. The useful follow-up record includes agency rulemaking, provider guidance, licensing materials, complaint procedures, enforcement actions, and court decisions. KTR will preserve that chain so readers can see whether a right exists only on paper, has clear administrative procedures behind it, or has generated disputes over its practical scope.",
    "Proposed legislation belongs in a different evidence category. SB 407 illustrates the problem: it advanced in one chamber but did not become law. Political messaging can continue citing a bill long after the session ends, so the tracker will retain the final legislative status and distinguish proposals from enacted protections. That rule applies regardless of whether KTR supports the proposal. A bill number, committee hearing, or chamber vote is evidence of legislative activity; only completion of the constitutional enactment process creates a statute.",
    "Medical-freedom debates often overlap with professional standards and informed consent. A patient may have a statutory protection against one form of coercion while a clinician still has duties involving disclosure, standard of care, contraindications, documentation, or emergency treatment. Those concepts are not mutually exclusive. KTR will separate the policy question—how much coercive authority government or institutions should have—from the factual legal question of what duties remain after a new protection is enacted. That makes it possible to advocate limited government without misdescribing professional or regulatory obligations.",
    "The strongest long-term tracker will measure whether enacted protections produce observable changes. That can include agency complaints, licensing guidance, litigation, institutional policy revisions, or subsequent legislative amendments. It should also identify when no public implementation evidence exists rather than filling the gap with assumptions. A source-first approach is especially important in health policy because anecdotes can be emotionally compelling while still failing to establish what a statewide law requires or how often a problem occurs.",
  ],
  watchFor: [
    ...medicalFreedomBase.watchFor,
    "Agency rules, licensing guidance, complaint data, or enforcement actions showing how enacted protections are implemented",
    "Court opinions distinguishing statutory medical-freedom protections from professional, emergency, or federal obligations",
  ],
};

const esgEnergyBoycotts: PolicyTracker = {
  ...esgEnergyBoycottsBase,
  updated: reviewed,
  keyFacts: [
    ...esgEnergyBoycottsBase.keyFacts,
    "The Comptroller's statutory lists are administrative determinations under Texas law and should be reported with their publication date because companies and investment funds can be added, removed, or reclassified over time.",
    "Divestment rules, state-contract restrictions, and ordinary fiduciary investment decisions are distinct mechanisms. A company affected by one Texas statute is not automatically barred from every state transaction or public investment relationship.",
    "Financial performance claims require a defined benchmark, time period, fees, and asset mix. Neither inclusion on nor removal from an anti-boycott list proves by itself that a public fund gained or lost money.",
  ],
  context: [
    ...esgEnergyBoycottsBase.context,
    "Texas anti-ESG policy is easiest to understand when the legal mechanism is identified before the political label. Chapter 809 establishes a process involving Comptroller identification, notice, clarification, covered governmental entities, divestment duties, exceptions, reporting, and enforcement. Other Texas statutes can address contracts or other boycott-related conduct through different definitions and thresholds. KTR will therefore name the statute and covered transaction rather than treating 'anti-ESG law' as one universal prohibition that reaches every bank, fund, contract, pension, or corporate policy in the same way.",
    "The Comptroller's lists are important evidence, but they are also time-sensitive administrative records. A company may respond to the statutory process, change policies, be removed from a list, or appear differently across updates. When KTR cites a list, the tracker should preserve the date and identify whether the source refers to a financial company, an investment fund, or another statutory category. That keeps an old screenshot or press release from being presented as the current legal status months or years later.",
    "Fiduciary duty is a separate analytical layer. Public pension trustees and other covered entities can have obligations to beneficiaries while also being subject to state divestment statutes. The existence of an anti-boycott rule does not eliminate the need to measure investment results, fees, liquidity, risk, and statutory exceptions. Conversely, invoking fiduciary duty does not automatically defeat a state policy choice written into law. KTR will track court decisions, attorney-general interpretations, agency guidance, and actual fund records when those questions collide.",
    "Performance arguments should be tested with comparable numbers. A claim that anti-ESG policy cost taxpayers money needs a defined counterfactual: which transaction, which benchmark, which period, which financing structure, and which fees changed? A claim that the policy saved money needs the same discipline. Bond underwriting costs, investment returns, management fees, market access, and procurement competition are different measures. KTR will avoid collapsing them into one headline number unless the underlying analysis genuinely supports that aggregation.",
    "Energy policy and financial policy also should not be confused. Texas can defend oil and gas producers from discriminatory financial practices while still evaluating whether a particular producer, lender, or investment strategy is financially sound. The state's policy objective concerns access and discrimination; public fiduciaries still need to assess risk and return. Keeping those questions separate strengthens the argument for viewpoint-neutral capital markets because it does not require pretending every energy company or every anti-ESG investment choice is automatically a good investment.",
    "The durable test is whether Texas rules are transparent, legally defensible, and measurably connected to the conduct lawmakers intended to address. KTR will watch list changes, litigation, statutory amendments, fund responses, contracting effects, and documented financial outcomes. It will also distinguish political branding from operative text: a company can market itself with ESG language without necessarily satisfying the statute's definition of an energy boycott, and the controlling record is the Texas legal process rather than a slogan from either side.",
  ],
  watchFor: [
    ...esgEnergyBoycottsBase.watchFor,
    "Dated Comptroller list revisions and company responses that change a firm's statutory status",
    "Audited or independently documented financing, return, fee, or market-access effects tied to a specific Texas anti-boycott rule",
  ],
};

const agricultureFamilyFarms: PolicyTracker = {
  ...agricultureFamilyFarmsBase,
  updated: reviewed,
  keyFacts: [
    ...agricultureFamilyFarmsBase.keyFacts,
    "Texas agricultural appraisal is a valuation framework governed by statutory eligibility and use requirements; it is not simply a blanket tax exemption available to every parcel outside a city.",
    "Right-to-farm protections and eminent-domain rules answer different questions. Protection from certain regulatory burdens does not by itself prevent a qualifying public-use acquisition under separate constitutional and statutory procedures.",
    "Water law can affect farms and ranches through different institutions depending on whether the issue involves groundwater, surface water, drought planning, irrigation infrastructure, conservation, or a particular district or river authority.",
  ],
  context: [
    ...agricultureFamilyFarmsBase.context,
    "Agriculture policy in Texas is unusually dependent on legal category. A working ranch can be affected by constitutional right-to-farm protections, county or municipal regulation, groundwater-district rules, surface-water rights, appraisal standards, transportation projects, utility easements, animal-health rules, environmental permits, and federal farm programs at the same time. KTR will identify which authority controls each dispute instead of treating 'agriculture' as a single regulatory system. That approach is especially important for family operations that may not have legal staff to separate overlapping state, local, and federal requirements.",
    "The constitutional right-to-farm provision protects generally accepted agricultural practices but contains specified areas in which government authority remains relevant. The useful reporting question is therefore not whether Texas has a right to farm—it does—but whether the challenged action falls inside the protected practice, an authorized exception, or another body of law entirely. Court opinions and local enforcement records will become increasingly important as the constitutional language is applied to specific disputes. KTR will avoid presenting the amendment as an unlimited immunity from every health, safety, resource, or public-use rule.",
    "Agricultural appraisal also needs precise language because taxpayers often call it an 'ag exemption.' In practice, Texas law provides special appraisal methods for qualifying agricultural, timber, and wildlife-management land based on statutory criteria. Eligibility, degree of intensity, prior use, rollback or change-of-use consequences, and county appraisal administration can matter. The Comptroller supplies statewide manuals and guidance, while local appraisal districts apply the law to parcels. KTR will distinguish the appraisal method from separate sales-tax exemptions, residence-homestead rules, or other tax benefits that use different eligibility standards.",
    "Land and infrastructure disputes deserve a property-rights lens without losing the legal details. Pipelines, transmission lines, highways, reservoirs, municipal expansion, and other projects can affect productive acreage through easements or acquisition. Right-to-farm protections do not automatically decide eminent-domain authority, compensation, route approval, or utility regulation. The tracker should connect those disputes to the correct condemning authority, statutory power, appraisal or compensation process, and court record so readers can see where private-property protections actually operate.",
    "Water can be the decisive production constraint, but Texas does not govern every drop through one system. Groundwater management can involve local groundwater conservation districts and property-based doctrines, while surface-water rights and state permitting use another framework. Drought plans, reservoirs, irrigation districts, environmental flows, and municipal growth add still more layers. KTR will tie a farm-water story to the responsible institution and water source rather than presenting statewide drought conditions as proof that every producer faces the same legal or physical supply problem.",
    "The policy debate over subsidies and assistance should remain explicit rather than being smuggled into the broader property-rights argument. Conservatives can agree on protecting productive land and limiting unnecessary regulation while disagreeing about crop supports, disaster assistance, tax preferences, insurance subsidies, conservation incentives, or targeted grants. KTR will label those fiscal choices and measure their costs separately from constitutional protections. That gives readers a clearer picture of which policies protect private rights, which provide government financial support, and which attempt to manage market or disaster risk.",
    "A durable agriculture tracker should ultimately show whether Texas is preserving the conditions that allow working land to remain productive across generations: predictable property rules, defensible water access, transparent appraisal standards, infrastructure that respects compensation rights, practical animal and crop health protections, and a regulatory environment that does not make ordinary agricultural activity impossible. Those outcomes can be followed through statutes, Comptroller guidance, agency records, local decisions, court cases, land-use trends, and documented costs rather than nostalgia alone.",
  ],
  watchFor: [
    ...agricultureFamilyFarmsBase.watchFor,
    "Court opinions and local disputes interpreting the constitutional right-to-farm provision",
    "Comptroller guidance, appraisal-district practices, or statutory changes affecting agricultural, timber, or wildlife-management valuation",
  ],
};

export const POLICY_TRACKER_WAVE3_UPGRADES: Record<string, PolicyTracker> = {
  [medicalFreedom.slug]: medicalFreedom,
  [esgEnergyBoycotts.slug]: esgEnergyBoycotts,
  [agricultureFamilyFarms.slug]: agricultureFamilyFarms,
};

export const WAVE3_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE3_UPGRADES);

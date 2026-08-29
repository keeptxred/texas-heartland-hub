import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE9 } from "@/data/policy-trackers-wave9";

function requireWave9Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE9.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave9 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const localPreemptionBase = requireWave9Tracker("local-preemption-regulatory-consistency");
const minorTreatmentLawBase = requireWave9Tracker("minor-gender-transition-medical-law");

const localPreemptionRegulatoryConsistency: PolicyTracker = {
  ...localPreemptionBase,
  updated: reviewed,
  keyFacts: [
    ...localPreemptionBase.keyFacts,
    "Preemption under HB 2127 is field- and statute-specific. A city ordinance is not invalid merely because the state regulates a related subject, and a local government does not retain authority merely because it is home-rule; the controlling code language and any express authorization matter.",
    "A lawsuit challenging a local ordinance can raise statutory preemption, Texas constitutional home-rule, standing, jurisdiction, severability, and remedy questions at different stages, so a temporary ruling should not be presented as the final statewide scope of HB 2127.",
    "Statewide regulatory consistency and local discretion are policy objectives rather than self-executing legal tests. The enforceable boundary comes from enacted statutes, constitutional provisions, and court interpretations of the particular ordinance and field involved.",
  ],
  context: [
    ...localPreemptionBase.context,
    "Texas has long balanced home-rule authority against legislative preemption, and HB 2127 adds a broad statutory framework to that existing structure rather than erasing it. The practical reporting question is whether the disputed ordinance regulates a field the Legislature occupied through one of the covered codes and whether another statute expressly authorizes the local action. KTR will identify the ordinance text, the state code provision, any claimed express authorization, and the effective dates instead of treating every state-local disagreement as proof that cities either possess unlimited home-rule power or have no independent authority.",
    "The covered-code structure makes categorization important. Employment terms, agriculture, occupations, property, insurance, finance, natural resources, and business regulation can be governed by different parts of HB 2127 and by different preexisting statutes. A city rule about employee scheduling therefore should not be analyzed from the same code section as a local rule affecting an occupation or agricultural activity. The tracker will name the statutory field and the specific local requirement so readers can verify whether the state's preemption theory actually matches the ordinance being challenged.",
    "Express authorization is another key distinction. The Legislature can reserve a field to statewide control while separately granting local governments authority over a particular subject. Roads, taxation, zoning-related powers, public safety functions, animal regulation, and other local responsibilities can have their own statutory foundations or exceptions. KTR will avoid describing HB 2127 as a categorical elimination of local government and will instead show where the Legislature preserved, restored, or later created local authority. That makes amendments especially important because a later statute can change the answer without repealing the entire Regulatory Consistency Act.",
    "Litigation posture needs to remain visible. A city may challenge the act facially, defend a specific ordinance, contest standing, or argue that the state misread the field-preemption language. Trial-court orders, interlocutory appeals, appellate opinions, stays, and final judgments can produce different practical rules while litigation continues. The tracker will identify whether an ordinance is currently enforceable, whether an injunction is temporary, and whether an appellate mandate has issued. A political statement that a court 'struck down' or 'upheld' the law should not replace the actual scope of the order.",
    "Regulatory consistency also has measurable economic and governance effects. Businesses operating across multiple Texas cities may face lower compliance costs when rules are uniform, while local officials may argue that city-specific conditions justify tailored regulation. Those claims can be tested through concrete requirements, compliance costs, enforcement records, and evidence of local conditions rather than assumed from ideology alone. KTR's editorial preference for predictable statewide rules will remain distinct from the factual question of whether a particular preemption produces lower costs or removes a locally valuable protection.",
    "The durable tracker should therefore follow both judicial interpretation and legislative maintenance. Appellate decisions can clarify the meaning of 'field,' express authorization, standing, or available remedies; lawmakers can add exceptions or new grants of local authority; cities can rewrite ordinances to fit within surviving powers. KTR will preserve superseded ordinance versions and bill amendments so readers can see why an older dispute may no longer describe the current boundary. The goal is a practical map of which level of Texas government controls which regulatory choice at the time a reader checks the page.",
  ],
  watchFor: [
    ...localPreemptionBase.watchFor,
    "Final appellate mandates defining specific HB 2127 fields, express-authority exceptions, standing rules, or remedies rather than preliminary trial-court outcomes",
    "Local ordinance rewrites and later state statutes that change the practical preemption boundary without repealing HB 2127 as a whole",
  ],
};

const minorGenderTransitionMedicalLaw: PolicyTracker = {
  ...minorTreatmentLawBase,
  updated: reviewed,
  keyFacts: [
    ...minorTreatmentLawBase.keyFacts,
    "The statute regulates specified treatments for defined statutory purposes; the same medication or procedure can have uses outside those purposes, which is why the exceptions and definitions must be read before describing the law's scope.",
    "A court ruling about constitutionality or enforcement status answers a legal question, not an individualized medical question. This tracker reports statutes, orders, licensing, funding, and litigation and does not recommend treatment for any person.",
    "Licensing discipline, Medicaid or CHIP coverage, state or local public funding, private insurance, civil litigation, and criminal law are separate legal mechanisms; a change in one does not automatically change every other part of the Texas framework.",
  ],
  context: [
    ...minorTreatmentLawBase.context,
    "SB 14 should be described through the definitions and operative provisions enacted by the Legislature. Subchapter X identifies specified procedures, puberty-suppression or hormone treatment, and other covered conduct when provided for statutory purposes connected to gender transition, reassignment, or gender dysphoria. The law also contains exceptions. That structure means a headline such as 'Texas bans these medications for minors' can be overbroad if it ignores lawful uses for other medical conditions. KTR will identify the treatment category, statutory purpose, age rule, and relevant exception before describing conduct as prohibited.",
    "The legal framework extends beyond a single prohibition section. SB 14 included related provisions involving professional licensing, Medicaid and CHIP, and public funding. Those mechanisms can operate differently. A licensing board can address professional conduct, a public program can determine whether state funds may be used, and a court can evaluate constitutional claims. The tracker will identify which mechanism is actually at issue so an enforcement announcement by one institution is not presented as though every legal consequence has already occurred.",
    "State v. Loe illustrates why procedural posture matters. Litigation over SB 14 included a temporary injunction before the Texas Supreme Court reversed and vacated that injunction in June 2024. That ruling affected the enforceability of the state statute, but it should not be summarized as a medical determination about an individual patient or as a permanent answer to every possible federal constitutional claim. KTR will preserve later appeals, federal cases, statutory amendments, and new court orders if they alter the legal baseline.",
    "Medical-policy terminology also requires precision. Political debate can use broad labels that do not map exactly onto statutory language. The useful reference point is the enacted definition and the treatment actually regulated. KTR will avoid inferring a patient's diagnosis, treatment history, motives, or expected outcome from a legal filing unless the public record establishes those facts and they are necessary to explain the case. This page is designed to help readers understand Texas law, not to adjudicate private medical decisions from incomplete public information.",
    "Enforcement records should distinguish allegation from final action. A complaint to a licensing board, an investigation, a notice of violation, an administrative hearing, a final disciplinary order, and judicial review are separate stages. Likewise, a funding restriction can affect reimbursement without proving that a provider violated a licensing rule. KTR will date each stage and link the responsible agency or court record where available so readers can see what has actually been decided and what remains contested.",
    "The durable policy tracker should remain useful even as political terminology changes. The stable elements are the Health and Safety Code text, enacted amendments, effective dates, agency rules, funding provisions, licensing actions, and binding court decisions. Supporters and opponents of SB 14 make broader claims about parental rights, child welfare, medical autonomy, and constitutional rights; those arguments can be summarized where relevant, but the page's factual core is narrower. Readers seeking personal medical decisions should use qualified clinicians, while readers seeking the current Texas legal rule should be able to verify it here from primary sources.",
  ],
  watchFor: [
    ...minorTreatmentLawBase.watchFor,
    "Final licensing or administrative orders that show how Texas agencies apply the statute's definitions, exceptions, and professional-discipline provisions in practice",
    "Enacted amendments or binding appellate decisions that change the scope, funding consequences, enforcement mechanisms, or operative status of Subchapter X",
  ],
};

export const POLICY_TRACKER_WAVE9_UPGRADES: Record<string, PolicyTracker> = {
  [localPreemptionRegulatoryConsistency.slug]: localPreemptionRegulatoryConsistency,
  [minorGenderTransitionMedicalLaw.slug]: minorGenderTransitionMedicalLaw,
};

export const WAVE9_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE9_UPGRADES);

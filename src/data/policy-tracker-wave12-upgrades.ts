import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE12 } from "@/data/policy-trackers-wave12";

function requireWave12Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE12.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave12 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const homeschoolBase = requireWave12Tracker("homeschool-autonomy");
const faithWelfareBase = requireWave12Tracker("faith-based-child-welfare");
const tanfBase = requireWave12Tracker("tanf-work-participation");

const homeschoolAutonomy: PolicyTracker = {
  ...homeschoolBase,
  updated: reviewed,
  keyFacts: [
    ...homeschoolBase.keyFacts,
    "A parent's decision to withdraw a child for bona fide home schooling, a district's attendance-enforcement inquiry, transfer-credit evaluation, and participation in a voluntary state-funded education program are separate processes with different legal questions.",
    "Texas's low-regulation baseline does not mean every education-related rule is irrelevant to homeschool families; athletics, dual credit, special education, college admission, driver education, and voluntary public programs can each operate under separate eligibility rules.",
    "A proposal to provide public funds or services to participating homeschool families should be evaluated separately from the rules governing families that remain entirely outside the voluntary program, because participation conditions do not automatically redefine baseline homeschool law.",
  ],
  context: [
    ...homeschoolBase.context,
    "Texas homeschool coverage should begin with the baseline legal status rather than with a particular school-choice program. TEA states that it does not approve, register, accredit, or routinely monitor home schools, and the Leeper framework recognizes bona fide home education within the compulsory-attendance system. That baseline matters because later programs may offer funds, courses, testing, extracurricular access, or other benefits under their own conditions. KTR will distinguish the legal right to home school from optional participation in a government-funded program so readers can tell which requirements apply to every family and which arise only after a voluntary choice.",
    "Withdrawal disputes require procedural precision. A district may need to determine whether a formerly enrolled student remains subject to compulsory attendance, but TEA guidance does not make curriculum submission or in-person approval a general condition of lawful withdrawal for home schooling. The useful record includes the parent's notice or assurance, district communications, attendance status, and any later enforcement action. A district request for information should not be described as statewide homeschool registration unless the law actually creates such a system, and a parent's assertion should not prevent ordinary enforcement if evidence shows the student is not receiving a bona fide education.",
    "Curriculum requirements are narrow enough that reporting should quote them accurately. Texas does not prescribe a detailed state homeschool curriculum, yet the recognized framework requires a bona fide written curriculum covering specified subjects. That is different from saying there are no educational requirements at all. KTR will avoid converting the absence of state curriculum approval into a claim that compulsory-attendance law has no standards, while also avoiding the opposite error of importing public-school curriculum mandates into independent home education without legal authority.",
    "Reentry into public school is another separate stage. A district can evaluate placement or credit when a home-schooled student transfers into the public system, and assessment of prior learning does not retroactively turn the home school into a district-regulated program. Families may encounter local procedures involving transcripts, testing, grade placement, course credit, athletics, or graduation requirements. The tracker will identify which rule governs the transition instead of treating a reentry decision as evidence that the state supervises day-to-day homeschool instruction.",
    "Optional services can create policy tradeoffs. Families may seek dual credit, extracurricular participation, special-education services, career programs, or education-account benefits while valuing independence from broader public-school regulation. Legislators can attach eligibility, auditing, testing, vendor, or spending rules to a funded program without necessarily changing the rights of nonparticipants. KTR's editorial preference favors parental control and minimal unnecessary regulation, but the factual page will show the exact condition attached to each benefit so families can compare autonomy with voluntary program participation.",
    "The durable accountability test is legal clarity. Changes should be tracked through enacted statutes, TEA guidance, court decisions, program rules, and district procedures rather than through anecdotes suggesting either that Texas is completely unregulated or that home schools operate as miniature public schools. The page should preserve effective dates and distinguish proposals from enacted law, especially when school-choice debates produce bills that affect only a subset of families. That structure makes the tracker useful to parents deciding what rules actually apply today.",
  ],
  watchFor: [
    ...homeschoolBase.watchFor,
    "Program rules that distinguish conditions for voluntary state-funded homeschool participation from the baseline law governing nonparticipating families",
    "District or court disputes clarifying withdrawal assurance, attendance enforcement, transfer credit, placement, or extracurricular eligibility",
  ],
};

const faithBasedChildWelfare: PolicyTracker = {
  ...faithWelfareBase,
  updated: reviewed,
  keyFacts: [
    ...faithWelfareBase.keyFacts,
    "A provider's protected decision to decline a service, the state's duty to ensure access through another provider, a best-interest placement decision, and a licensing or contracting action are distinct steps and should not be collapsed into a single conscience claim.",
    "Chapter 45 protects qualifying private providers against specified governmental adverse action; it does not create a general exemption from every federal funding condition, child-safety requirement, contract term, or law outside the chapter's scope.",
    "Foster placement, adoption assistance, home studies, counseling, family services, and medical-care questions can involve different actors and statutory duties even when they arise in the same child-welfare case.",
  ],
  context: [
    ...faithWelfareBase.context,
    "Chapter 45 reporting should identify the government action and provider service at issue. A faith-based organization may perform foster placement, adoption services, home studies, counseling, family preservation work, or other contracted services, and the statutory protection applies within a defined child-welfare framework. KTR will state whether the dispute involves licensing, contract eligibility, a particular referral, placement, funding, or another governmental action rather than using 'religious adoption agency' as a catch-all description for every provider and every service.",
    "The alternate-provider mechanism is central to understanding the statute. Protecting a provider from specified adverse action does not mean Texas can simply leave a legally required child-welfare service unavailable. The law includes routes for access through another provider in defined situations. Coverage should therefore ask both whether the conscience protection applies and how the child or family receives the requested service. That dual inquiry is more informative than presenting religious liberty and service access as though the statute recognizes only one of them.",
    "Child best-interest authority remains another separate layer. Texas, acting as managing conservator or through its child-welfare system, retains duties concerning safety, placement, permanency, and legally required care. A provider's protected belief does not convert every preferred placement into a guaranteed outcome. KTR will distinguish the provider's right to decline conduct from the state's independent decision about the child's best interest, which can depend on facts, court orders, case plans, family relationships, safety findings, and other statutory factors.",
    "Federal funding and constitutional litigation can alter implementation without silently repealing Chapter 45. Child-welfare programs may receive federal money or operate under federal nondiscrimination rules, and litigants can raise constitutional claims involving religion, equal protection, due process, or government contracting. The tracker will identify the authority actually controlling a dispute and preserve procedural posture—guidance, contract term, complaint, injunction, appellate ruling, or final judgment—rather than treating a preliminary controversy as settled statewide law.",
    "Contracting evidence is important because many services are delivered through private organizations under state or community-based-care arrangements. Useful records include requests for proposals, executed contracts, provider networks, referral procedures, performance measures, complaints, corrective actions, and service-availability data. KTR's editorial support for conscience protections does not remove the accountability question: taxpayers and children should be able to see whether the state maintains adequate access, enforces safety standards, and administers contracts according to law.",
    "The durable page should also preserve statutory limits. Chapter 45 does not authorize race, ethnicity, or national-origin discrimination and does not erase specified medical-care rights or the state's best-interest authority. Those limits are not side notes; they define what the conscience protection does and does not do. Keeping both protection and limits visible makes the tracker more useful when future litigation or legislation tests whether a particular action falls inside the chapter rather than relying on broad claims that Texas either grants unlimited exemptions or provides none.",
  ],
  watchFor: [
    ...faithWelfareBase.watchFor,
    "Provider-network and contracting records showing whether alternate-service access remains available when a protected provider declines a service",
    "Final court decisions distinguishing Chapter 45 conscience protection from federal funding, constitutional, licensing, safety, and child-best-interest requirements",
  ],
};

const tanfWorkParticipation: PolicyTracker = {
  ...tanfBase,
  updated: reviewed,
  keyFacts: [
    ...tanfBase.keyFacts,
    "Applicant orientation, eligibility determination, exemption status, employment planning, assigned participation activities, good-cause findings, support services, sanctions, and employment outcomes are separate stages in the TANF/Choices process.",
    "Participation-hour standards can vary with family composition and program rules, so a statewide shorthand such as 'everyone must work 30 hours' can be inaccurate for exempt recipients, two-parent families, good-cause situations, or other rule-specific circumstances.",
    "A sanction count measures enforcement activity, not by itself successful movement into work; program performance should also track employment, earnings, retention, case closure, recurrence, and use of child-care or transportation supports.",
  ],
  context: [
    ...tanfBase.context,
    "Texas TANF employment policy operates through multiple agencies and local workforce boards, which makes the sequence important. HHSC handles major eligibility and exemption functions, while TWC and Workforce Solutions administer Choices employment services for many applicants and recipients. Orientation can occur before final approval, and an approved recipient can then receive an individualized employment plan. KTR will identify where a person is in that process instead of describing every TANF applicant as already subject to the same final work assignment.",
    "Exemptions and good cause are different concepts. An exemption can remove or alter the ordinary participation requirement because the person or family meets a defined rule, while good cause can address a barrier affecting a person who would otherwise be expected to participate. Child care, transportation, health, family circumstances, domestic violence, local service availability, or other recognized factors may affect administration under applicable rules. The tracker will rely on current program materials for the actual standard rather than assuming any hardship automatically excuses participation or that no exceptions exist.",
    "Allowable activities are broader than immediate unsubsidized employment. Job search, education, vocational training, work experience, on-the-job training, community service, and other approved activities can be part of the employment plan. The policy goal is movement toward self-sufficiency, so the page should distinguish activity hours from outcomes. A participant can satisfy an assigned activity without securing durable employment, while another participant may move rapidly into a job and need less time in a training program. Both should be measured against the program's actual objectives.",
    "Support services are part of the work strategy rather than unrelated benefits. Child care, transportation, testing fees, uniforms, tools, or other work-related assistance can determine whether a participant can attend training or maintain employment. KTR's editorial preference favors work expectations for able adults, but a credible accountability framework should show whether Texas removes practical barriers efficiently enough for those expectations to be achievable. Spending on support services should be connected to participation and employment outcomes rather than treated as success or failure merely because the amount changed.",
    "Sanctions require process and context. A failure to participate can lead to consequences under program rules, but the record should show notice, the assigned requirement, any good-cause review, and the actual sanction imposed. High sanction counts can reflect strict enforcement, poor communication, inadequate service availability, participant noncompliance, or several factors at once. KTR will not use sanctions as a proxy for fraud or unwillingness to work without evidence, and it will not treat the existence of good-cause protections as proof that requirements are optional.",
    "The durable performance question is whether families achieve sustained economic improvement. Useful measures include job entry, earnings, retention, advancement, credential completion, reduced reliance on cash assistance, repeat applications, and family stability. Federal participation metrics remain legally important, but they do not answer every state policy question. The tracker will follow both compliance measures and real-world outcomes so lawmakers can distinguish a program that generates required activity from one that helps families move into stable employment.",
  ],
  watchFor: [
    ...tanfBase.watchFor,
    "Outcome reporting that connects Choices participation and support services with employment, earnings, retention, case closure, and repeat assistance",
    "Changes to exemption, good-cause, sanction, participation-hour, or allowable-activity rules in Texas or federal TANF policy",
  ],
};

export const POLICY_TRACKER_WAVE12_UPGRADES: Record<string, PolicyTracker> = {
  [homeschoolAutonomy.slug]: homeschoolAutonomy,
  [faithBasedChildWelfare.slug]: faithBasedChildWelfare,
  [tanfWorkParticipation.slug]: tanfWorkParticipation,
};

export const WAVE12_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE12_UPGRADES);

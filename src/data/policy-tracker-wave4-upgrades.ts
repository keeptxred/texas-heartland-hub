import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE4 } from "@/data/policy-trackers-wave4";

function requireWave4Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE4.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave4 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-27";

const religiousLibertyBase = requireWave4Tracker("religious-liberty");
const stateFederalPowerBase = requireWave4Tracker("state-federal-power");
const rightToWorkBase = requireWave4Tracker("right-to-work");

const religiousLiberty: PolicyTracker = {
  ...religiousLibertyBase,
  updated: reviewed,
  keyFacts: [
    ...religiousLibertyBase.keyFacts,
    "Texas constitutional protections, the Texas Religious Freedom Restoration Act, and federal free-exercise protections are separate legal authorities. A claimant may rely on more than one, but the elements and remedies should not be collapsed into a single generic religious-liberty rule.",
    "Chapter 110 focuses on burdens imposed by government agencies and includes procedural provisions, defenses, and remedies; whether a private employer, private school, or private business is covered can depend on a different body of law.",
    "The legal analysis generally turns on the challenged government action, the asserted religious exercise, the nature of the burden, and any applicable statutory or constitutional test rather than on whether officials agree with the religious belief itself.",
  ],
  context: [
    ...religiousLibertyBase.context,
    "Texas religious-liberty coverage needs to identify the source of the claimed protection before describing the outcome. Article I, Section 6 of the Texas Constitution protects worship and conscience, Section 6-a addresses government measures that prohibit or limit qualifying religious services, and Chapter 110 creates a statutory framework for certain substantial burdens imposed by government. Federal constitutional and statutory protections can apply as well. These authorities overlap, but they are not interchangeable. KTR will name the provision actually invoked in a dispute and distinguish a state-law claim from a federal claim or a purely political argument about religious freedom.",
    "The government-action requirement is especially important. Chapter 110 regulates governmental burdens on religious exercise; it is not a universal code governing every disagreement involving religion. Private employment, private contracts, religious organizations' internal decisions, public accommodations, education, licensing, and government benefits can bring different statutes and constitutional doctrines into play. A story that simply says a person's 'religious liberty was violated' without identifying the actor and legal mechanism leaves readers unable to verify the claim. The tracker will instead identify who acted, under what authority, and which remedy the claimant seeks.",
    "Substantial-burden analysis also requires more precision than a disagreement with a rule. The statutory framework asks whether government substantially burdened a person's free exercise and, if so, whether the government can satisfy the applicable compelling-interest and least-restrictive-means requirements. Courts determine how those standards apply to specific facts. That means KTR should not treat the mere existence of a sincere religious objection as automatic victory, nor should it assume a generally applicable policy automatically defeats the claim. The operative court record, statutory text, and procedural posture matter.",
    "Places of worship receive particular attention under Texas law, including constitutional protection adopted after disputes over emergency restrictions. But even here, reporting should distinguish a direct prohibition or limitation on religious services from neutral rules involving building safety, criminal law, property, contracts, or other matters that may raise different questions. The tracker will identify the actual order, ordinance, statute, or enforcement action rather than using an emergency-era political analogy where the legal facts do not match.",
    "Religious-liberty disputes can also overlap with other civil-rights and conscience questions. Schools, adoption and foster-care providers, health-care professionals, public employees, contractors, and religious organizations can operate under distinct statutory regimes. The useful reporting task is not to declare one value categorically superior in the abstract, but to show which rights and duties the law recognizes in the specific setting and how a court or agency has reconciled them. KTR's editorial support for strong conscience protections remains separate from that factual legal analysis.",
    "A durable tracker should preserve procedural posture. A demand letter, attorney-general opinion, trial-court injunction, appellate ruling, settlement, and final judgment carry different legal weight. Likewise, proposed legislation can expand or narrow protections without changing current law until enacted. KTR will date material developments, link the controlling primary record when available, and state whether a decision is temporary, appealed, or final. That prevents a politically important preliminary ruling from being presented as a permanent statewide rule.",
  ],
  watchFor: [
    ...religiousLibertyBase.watchFor,
    "Court decisions clarifying how Chapter 110's substantial-burden and least-restrictive-means standards apply in specific Texas settings",
    "Statutory changes that create, expand, narrow, or procedurally alter conscience protections for defined institutions or professions",
  ],
};

const stateFederalPower: PolicyTracker = {
  ...stateFederalPowerBase,
  updated: reviewed,
  keyFacts: [
    ...stateFederalPowerBase.keyFacts,
    "A dispute about federalism should identify the claimed source of federal authority and the claimed source of Texas authority. Saying an issue is traditionally regulated by states does not by itself answer whether a particular federal statute or constitutional provision controls.",
    "Preemption and anti-commandeering are different doctrines. Federal law can sometimes preempt conflicting state law, while the federal government is separately limited in when it may require state governments or officers to administer a federal regulatory program.",
    "Procedural posture matters in Texas-versus-federal litigation: a complaint, temporary restraining order, preliminary injunction, appellate stay, merits judgment, and Supreme Court disposition can produce very different practical effects.",
  ],
  context: [
    ...stateFederalPowerBase.context,
    "Federalism stories become clearer when they begin with enumerated authority rather than slogans. The United States government possesses powers granted by the federal Constitution, while states retain broad authority within the constitutional structure. Texas also operates under its own constitution and statutes. When the two governments regulate the same subject, the legal question is not simply which government acted first or which policy Texans prefer. KTR will identify the federal constitutional provision, statute, regulation, or executive action at issue and the Texas constitutional or statutory authority asserted in response.",
    "Preemption is one recurring mechanism, but it is not one rule with one outcome. Congress can expressly preempt state law, courts can find that federal regulation occupies a field, or a state rule can conflict with valid federal law in a way that makes simultaneous compliance impossible or frustrates the federal scheme. The precise theory matters because a Texas law can survive one preemption argument and still fail another. KTR will distinguish the court's actual reasoning from a broader political claim that Washington either controls everything or has no role at all.",
    "Anti-commandeering belongs in a separate category. The federal government can regulate individuals and entities within its constitutional authority and can preempt conflicting state rules, but Supreme Court doctrine also limits federal attempts to require states or state officers to administer federal programs. That distinction can matter in disputes over immigration cooperation, firearms, elections, environmental enforcement, health policy, and other areas. A state refusal to administer a federal program is not automatically the same as a state power to nullify federal law that validly applies to private conduct.",
    "Texas litigation against federal agencies also requires attention to administrative law and procedure. A state may challenge whether an agency exceeded statutory authority, violated required rulemaking procedures, acted arbitrarily, or imposed an unconstitutional burden. Those claims differ from a direct argument that Congress lacked constitutional power. The remedy can differ as well. KTR will identify whether a court blocked a rule nationwide, only as to particular plaintiffs, temporarily, or after a final merits judgment instead of translating every injunction into a permanent defeat of federal authority.",
    "Border disputes demonstrate why categories matter. The federal government has central authority over immigration admission and removal, while Texas retains criminal-law, policing, property, spending, and emergency powers. Litigation can therefore turn on whether a state measure regulates an independent state crime, conflicts with federal immigration machinery, affects federal property or officers, or rests on another state power. KTR's tracker will connect the political argument for vigorous Texas action to the narrower question actually before the court rather than treating every border case as a referendum on sovereignty in the abstract.",
    "The same discipline applies when Texas wins. A favorable ruling can establish that a particular federal agency exceeded its authority without creating a general rule that Texas may disregard all federal regulation in that field. Likewise, an adverse ruling can invalidate one state mechanism without eliminating every lawful state option. The durable value of this tracker is to map the boundary after each decision: what Texas may still do, what the federal government may do, what remains unresolved on appeal, and which source of authority controls the next dispute.",
  ],
  watchFor: [
    ...stateFederalPowerBase.watchFor,
    "Supreme Court or Fifth Circuit decisions distinguishing preemption, anti-commandeering, administrative-law, and constitutional-authority theories in Texas cases",
    "Changes in federal statutes or regulations that alter the legal baseline underlying an existing Texas challenge",
  ],
};

const rightToWork: PolicyTracker = {
  ...rightToWorkBase,
  updated: reviewed,
  keyFacts: [
    ...rightToWorkBase.keyFacts,
    "Right-to-work and at-will employment answer different questions: right-to-work concerns compulsory union membership or nonmembership as a condition of employment, while at-will doctrine concerns when an employment relationship may generally be ended subject to legal exceptions.",
    "Texas public employees are governed by state-specific statutory rules, and some categories or local systems may operate under expressly authorized meet-and-confer or collective-bargaining frameworks. Those exceptions should be identified rather than generalized to every public employee.",
    "Federal labor law can govern organizing, representation, bargaining duties, and protected concerted activity for many private-sector workers even though Texas law separately protects against compulsory union membership as a condition of employment.",
  ],
  context: [
    ...rightToWorkBase.context,
    "Right-to-work is often confused with employment at will because both phrases concern workplace freedom, but the doctrines address different legal relationships. Texas right-to-work provisions focus on whether employment may be conditioned on union membership or nonmembership. At-will employment generally concerns the ability of an employer or employee to end the employment relationship absent a contract or legal restriction. A worker can be employed at will in a right-to-work state while still having statutory protections against discrimination, retaliation, wage violations, or unlawful interference with protected labor activity. KTR will keep those categories separate.",
    "Federal labor law is another essential layer. For many private-sector employers and employees, the National Labor Relations Act governs organizing, representation elections, collective bargaining, and protected concerted activity. Texas right-to-work law does not erase those federal rights and duties. Instead, state law addresses compulsory membership or affiliation within the space federal law leaves to states. Reporting a union organizing drive therefore requires different sources from reporting whether a contract or workplace rule unlawfully conditions employment on union status.",
    "Public-sector labor relations in Texas operate under a different framework. Government Code Chapter 617 contains broad rules for public employees, while the Legislature has authorized particular collective-bargaining or meet-and-confer systems for certain public-safety employees and local jurisdictions. Those statutory authorizations are specific. KTR will identify the occupation, governmental employer, local adoption mechanism, and applicable chapter before saying a Texas public employee has or lacks bargaining authority. A rule governing firefighters in one city should not be described as the statewide rule for teachers, state employees, or every municipal worker.",
    "Voluntary association is the policy principle behind KTR's support for right-to-work, but factual analysis still has to account for representation law. In a unionized workplace, federal or applicable state law can establish representation duties and bargaining structures even for workers who are not union members. Questions about dues, fees, membership, representation, contract coverage, and political spending can therefore involve different legal rules. The tracker will identify which payment or obligation is actually disputed rather than treating every deduction or representation arrangement as compulsory union membership.",
    "Employment disputes also require a remedy-focused approach. A complaint may belong before the National Labor Relations Board, Texas Workforce Commission, a civil-service body, a local labor-relations process, arbitration, or a court depending on the claim. The agency named in a political press release may not have jurisdiction over the underlying dispute. KTR will connect workers and readers to the controlling statute and responsible institution so a right-to-work story remains useful beyond the headline.",
    "The long-term policy question is whether Texas can preserve voluntary union membership while maintaining clear rules for lawful organizing, bargaining, public accountability, and worker protections. Evidence should include enacted statutes, federal labor decisions, local agreements authorized by law, and documented disputes—not assumptions that low union membership proves legal coercion is absent or that union presence proves coercion exists. That evidence standard allows KTR to advocate labor freedom while accurately describing the rights of workers who choose to organize as well as those who choose not to join.",
  ],
  watchFor: [
    ...rightToWorkBase.watchFor,
    "Changes in federal labor doctrine that affect organizing or representation while leaving Texas right-to-work protections in place",
    "Local adoption, amendment, expiration, or litigation involving statutorily authorized public-sector meet-and-confer or collective-bargaining systems",
  ],
};

export const POLICY_TRACKER_WAVE4_UPGRADES: Record<string, PolicyTracker> = {
  [religiousLiberty.slug]: religiousLiberty,
  [stateFederalPower.slug]: stateFederalPower,
  [rightToWork.slug]: rightToWork,
};

export const WAVE4_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE4_UPGRADES);

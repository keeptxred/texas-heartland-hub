import type { IssueGuide } from "@/data/issue-guides";

type IssueSection = IssueGuide["sections"][number];

const WAVE2_EXTRA_SECTIONS: Record<string, IssueSection[]> = {
  "texas-oil-gas-federal-regulation": [
    {
      heading: "Start by identifying the regulator and the activity",
      body: [
        "Texas oil-and-gas regulation is divided by subject rather than assigned to one all-purpose energy agency. The Railroad Commission of Texas regulates core upstream activities such as drilling, production, well integrity, plugging, oil-and-gas waste and important pipeline functions. The Texas Commission on Environmental Quality administers major environmental programs that can apply to emissions, water and waste. Federal agencies enter when a federal statute, interstate activity, federal land, federal permit or other federal jurisdiction is involved.",
        "That division makes precise reporting essential. A dispute over a drilling permit is not the same legal question as an air permit, pipeline certificate, mineral lease, surface-use disagreement or federal endangered-species consultation. Before evaluating a claim of overregulation or regulatory failure, readers should be able to identify the regulated activity, the agency with authority over it, the governing statute or rule, and the remedy available if the agency or operator is challenged."
      ]
    },
    {
      heading: "Mineral ownership and surface ownership can be separate",
      body: [
        "Texas property law allows mineral interests to be severed from the surface estate, so the person who owns the land at the surface may not own all of the oil and gas beneath it. Leases, royalty interests, easements, pooling arrangements and contractual clauses can therefore shape a project independently of a state drilling permit. Regulatory approval does not settle every private-property dispute, and a private contract does not eliminate public-law permitting requirements.",
        "For landowners, the practical questions often include who owns the mineral interest, what rights were granted by lease, how access will occur, what compensation or royalty language applies, and whether an accommodation or surface-use issue is present. KTR should distinguish those private-law questions from agency enforcement so readers are not told that a regulator can resolve a title or contract dispute simply because the dispute involves an oil well."
      ]
    },
    {
      heading: "Permitting and enforcement are different stages",
      body: [
        "A permit generally establishes that an applicant has satisfied the requirements for a defined regulated activity; it is not a permanent finding that every future operation will comply with every law. After authorization, agencies can inspect, receive complaints, review reports, require corrective action and pursue enforcement when the governing law allows. Operators also have procedural rights to contest agency determinations and penalties.",
        "That distinction matters when a problem occurs at a permitted facility. The relevant accountability questions are whether the permit covered the activity, what operating conditions applied, whether the operator complied, when the agency learned of the problem, what enforcement authority existed and what corrective action followed. A headline that says only that a facility was 'permitted' or 'unregulated' can obscure the much more useful question of whether the applicable rules were followed and enforced."
      ]
    },
    {
      heading: "Pipelines involve several legal layers",
      body: [
        "Texas pipelines can fall under different regulatory regimes depending on what they carry, where they operate and whether federal interstate jurisdiction applies. Safety regulation, economic regulation, routing, easements, eminent-domain questions and environmental review are not necessarily decided by the same institution. A pipeline crossing private property can therefore generate legal questions that are separate from the rules governing the well that produced the commodity.",
        "When covering a pipeline controversy, KTR should identify whether the dispute concerns safety standards, common-carrier status, a private easement, condemnation authority, a federal certificate, an environmental permit or a commercial contract. That approach lets readers evaluate the actual government power being exercised instead of treating every pipeline dispute as proof either that private property has no protection or that infrastructure projects have no public-law obligations."
      ]
    },
    {
      heading: "Federal environmental rules often depend on delegated programs",
      body: [
        "Federal environmental statutes can authorize national standards while allowing a state agency to administer important permitting or enforcement functions under an approved state program. That arrangement means a rule may originate in federal law but be implemented through a Texas permit or Texas agency process. Litigation can then focus on the federal standard, the state's implementation, or both, depending on the claim.",
        "For federalism analysis, the key questions are whether Congress enacted the governing statute, what authority the federal agency claims under that statute, whether Texas has delegated or approved implementation authority, and whether a court has stayed or limited the rule. This framework is more useful than describing every environmental requirement as purely federal or purely state, because many real-world programs intentionally combine both levels of government."
      ]
    },
    {
      heading: "Production, prices and tax revenue should be kept distinct",
      body: [
        "Texas oil-and-gas policy affects production, employment, royalties, severance-tax collections, local tax bases, infrastructure demand and state revenue, but those measures do not move together in a fixed ratio. Commodity prices can increase tax receipts even when production growth slows, and production can rise while individual operators or communities face different economic conditions. Global supply and demand also influence prices beyond the control of any Texas regulator.",
        "A strong policy story should therefore say which economic measure is changing and over what period. Production volumes, rig counts, employment, company earnings, royalty income and state tax collections answer different questions. KTR can make the policy debate more useful by tying fiscal claims to Comptroller data, production claims to official records, and regulatory claims to the actual rule rather than assuming that one favorable or unfavorable number proves the effect of an entire regulatory system."
      ]
    }
  ],
  "texas-election-law": [
    {
      heading: "Election administration is distributed across state and local officials",
      body: [
        "Texas election law creates statewide rules, but elections are administered through a network of state and local officials. The Secretary of State is the state's chief election officer and issues official guidance, while counties and other political subdivisions perform many operational duties such as maintaining local records, staffing polling places, handling ballots and reporting results. The precise responsibility depends on the election and the Election Code provision involved.",
        "That division matters when something goes wrong. A polling-place staffing issue, voter-registration record, voting-system certification question, ballot application, county tabulation problem and statewide legal interpretation may belong to different officials. Before assigning blame or proposing a remedy, KTR should identify which official had the statutory duty, what deadline or procedure applied and whether the dispute concerns local execution or the statewide rule itself."
      ]
    },
    {
      heading: "Voter identification rules include defined alternatives and procedures",
      body: [
        "Texas requires voters to establish identity under the Election Code, but the legal framework is more specific than the shorthand phrase 'photo ID law.' The Code and official election guidance identify accepted forms of identification and procedures that may apply when a voter does not possess an accepted photo ID and meets the statutory requirements for an alternative process. The correct explanation therefore starts with the current official list and the voter's actual circumstances.",
        "This is an area where outdated summaries can mislead voters. Accepted documents, expiration rules, disability-related procedures and reasonable-impediment requirements should be checked against current Secretary of State guidance rather than copied from an old campaign handout. KTR's election pages should help readers find the governing rule while avoiding language that either exaggerates the burden or implies that identification requirements can simply be ignored."
      ]
    },
    {
      heading: "Voting by mail begins with statutory eligibility",
      body: [
        "Texas does not operate universal no-excuse voting by mail. Eligibility is defined by statute, and the process includes an application, deadlines, identification-related information, ballot handling and return requirements. Different rules can apply to military and overseas voters under federal and state law. A useful guide should separate the question of who may vote by mail from the later question of whether a particular ballot was completed and returned according to law.",
        "Mail-ballot disputes are especially sensitive to dates and document details. KTR should avoid turning one rejected application or ballot into a statewide conclusion without identifying the reason code, governing requirement and available cure or review procedure. Likewise, a legislative proposal to change mail voting should be described by the specific eligibility, application, verification, assistance or return rule it would amend rather than by a generic label such as 'expands voting' or 'restricts voting.'"
      ]
    },
    {
      heading: "Poll watchers observe under rules; they do not run the polling place",
      body: [
        "Texas law authorizes poll watchers in specified circumstances and gives them rights intended to support observation of election activity. Election judges and other election officers, however, remain responsible for administering the polling place and enforcing applicable procedures. Watcher access, conduct, training, appointment and removal questions are governed by the Election Code rather than by a campaign's preferred interpretation of what a watcher should be allowed to do.",
        "Reporting should distinguish observation from administration. A watcher can raise a legal issue without acquiring authority to direct voters or replace an election officer, and an election official cannot disregard statutory watcher rights merely because observation is inconvenient. KTR should anchor disputes in the current Code and official guidance, identify what conduct occurred, and avoid implying that every disagreement at a polling place establishes either fraud or suppression."
      ]
    },
    {
      heading: "Voting systems are only one part of election security",
      body: [
        "Election security includes voting-system certification, physical controls, access management, ballot custody, logic and accuracy procedures, reconciliation, records retention, cybersecurity and post-election review. Focusing only on the brand of voting machine can miss process failures that occur elsewhere, while treating every administrative error as proof of machine manipulation can overstate what the evidence shows.",
        "For a technical claim, readers should be told which system, county, election and security control are involved. Official certification records, county procedures, audit documentation and court filings are stronger evidence than screenshots or generalized claims circulated without provenance. The permanent role of this guide is to explain the control framework; time-sensitive allegations belong in current reporting where evidence can be updated as officials, litigants and courts develop the record."
      ]
    },
    {
      heading: "Recounts, contests and audits answer different questions",
      body: [
        "A close or disputed election can trigger several distinct legal processes. A recount re-tabulates votes under the procedures authorized by law. An election contest is a judicial proceeding governed by statutory standards. Audits and other post-election reviews examine records or processes under separate authority. None of those mechanisms should be described as interchangeable, and the existence of one does not itself prove that the reported result was wrong.",
        "KTR should describe the procedural posture precisely: who requested the action, what statute authorizes it, which ballots or records are covered, what standard applies and whether the result is final. That discipline is particularly important in election coverage because preliminary claims can spread faster than the official record. Confidence in elections is strengthened by showing readers the lawful review mechanisms and reporting their outcomes rather than treating uncertainty as evidence for a predetermined conclusion."
      ]
    }
  ],
  "texas-school-choice-esas": [
    {
      heading: "Texas created an administered account program, not an unrestricted cash benefit",
      body: [
        "Senate Bill 2 from the 89th Legislature established an education savings account program in state law. The program is structured around accounts used for approved education-related expenses and administered under statutory rules; it is not simply a check that a parent may spend for any purpose. The law assigns administrative responsibilities, defines eligibility and approved uses, and creates controls for participating providers and organizations.",
        "That distinction is important in both supportive and critical analysis. Supporters should not oversell the program as if every family receives unrestricted state money, and opponents should not describe every authorized education purchase as an untraceable cash transfer. The durable policy question is whether the rules give families meaningful educational choices while maintaining transparent eligibility, payment, oversight and anti-fraud controls."
      ]
    },
    {
      heading: "Eligibility and priority rules determine who can actually participate",
      body: [
        "A statewide program can be legally available without guaranteeing that every eligible applicant receives an account in every funding period. Statutory eligibility establishes who may apply, while appropriations, capacity and any priority rules determine how limited program resources are allocated. Those mechanics matter more to families than a headline that simply says school choice is 'universal' or 'limited.'",
        "KTR should track participation using administrative records: number of applications, number approved, geographic distribution, student characteristics when lawfully reported, account funding and unused or returned funds. Those measures can show whether the enacted program reaches the families lawmakers said it would serve. They also allow rural and urban participation to be compared without assuming in advance that provider availability or family demand is the same across Texas."
      ]
    },
    {
      heading: "Approved expenses define the practical value of an ESA",
      body: [
        "The usefulness of an education savings account depends on what the governing law and program rules permit families to purchase. Tuition is only one possible education cost; depending on the statutory category, a program can address instructional materials, tutoring, assessments, therapies, transportation-related services or other approved education expenses. The administrator must distinguish authorized transactions from purchases outside the program.",
        "That makes expense data a central accountability tool. Aggregate spending by category can show whether families are primarily using accounts for private-school tuition or for a broader mix of educational services. KTR should compare those actual patterns with the statutory purposes of the program, and any story about alleged misuse should identify the applicable expense rule and documented transaction rather than implying that an unusual purchase is automatically unlawful."
      ]
    },
    {
      heading: "Provider participation is not the same as state operation of a private school",
      body: [
        "A private school or education provider that accepts program-funded payments can be subject to conditions attached to participation without becoming a public school. The exact obligations depend on the statute and program rules. This distinction is central to debates over autonomy: lawmakers can require financial, eligibility or anti-fraud controls while still preserving differences between private education and the public-school regulatory system.",
        "The accountability question is therefore not whether participating providers are regulated in exactly the same way as school districts. It is whether the requirements chosen for the ESA program are sufficient for the public funds and student services at issue. KTR should identify which standards actually apply, who can suspend or remove a provider, what review process exists and which matters remain governed by private-school policies or other generally applicable law."
      ]
    },
    {
      heading: "The public-school funding debate should use the actual finance mechanism",
      body: [
        "Arguments about whether ESAs 'take money from public schools' can become imprecise if they ignore how the Legislature appropriates ESA funds and how the Foundation School Program finances districts. A state appropriation for education savings accounts is a real budget choice, but its effect should be measured through the enacted appropriation, school-finance formulas, enrollment changes and district revenue rather than assumed from a slogan.",
        "District costs also vary in how quickly they change when enrollment changes. Some expenses move with student counts while facilities, transportation and staffing commitments can be less flexible in the short run. Conversely, a student who leaves a district can reduce future service obligations. KTR should examine both the state fiscal commitment and local operational effects, especially in rural districts where small enrollment changes can have different consequences than in large metropolitan systems."
      ]
    },
    {
      heading: "Implementation data is the test of the policy",
      body: [
        "Once a school-choice program is enacted, the most useful debate moves from predictions to measurable implementation. Application demand, account awards, payment timing, provider availability, administrative cost, fraud findings, parent satisfaction and student outcomes can all inform whether the system is functioning as designed. No single measure is sufficient: rapid enrollment can show demand without proving academic effectiveness, while a low fraud rate does not by itself establish educational value.",
        "KTR should maintain a clear separation between the statute and the program's performance. This guide explains the enduring legal architecture, while current articles can track appropriations, administrative rules, enrollment and controversies as they change. That approach gives supporters and critics a common factual baseline and makes it harder for either side to rely indefinitely on forecasts that can now be tested against real Texas data."
      ]
    }
  ],
  "parental-rights-texas-schools": [
    {
      heading: "Chapter 26 is a starting point, not the entire body of parental-rights law",
      body: [
        "Chapter 26 of the Texas Education Code contains important parental rights involving a child's public education, and the Legislature amended that framework again in 2025. But school-related parental rights can also arise from other Education Code provisions, federal student-records law, disability law, health law, district policy and court orders. A broad statement that 'parents have the right' is therefore incomplete until the specific decision and legal source are identified.",
        "The same is true of limits. A parent may have a right to inspect specified materials or receive notice without having unilateral authority to rewrite curriculum, direct another student's education or override every neutral school rule. KTR should explain both the right and its legal boundary, because accurate scope makes parental-rights protections more useful and avoids creating expectations that the governing statute does not support."
      ]
    },
    {
      heading: "Access to records is different from control over the record",
      body: [
        "Parents generally have significant rights to access education records for their minor children, subject to applicable law and circumstances, but access does not mean every school record can be altered on demand. Federal and state rules govern who may inspect records, how schools respond to requests, when information about other students must be protected, and what procedures exist to challenge information a parent believes is inaccurate.",
        "For practical guidance, KTR should tell readers what record they are seeking, which law or policy governs access, where to send the request and what review or complaint process exists. That is more useful than treating every records dispute as a transparency crisis. It also protects student privacy by recognizing that a parent's right to information about one child does not automatically authorize disclosure of confidential information about classmates or school employees."
      ]
    },
    {
      heading: "Curriculum, instructional materials and library materials are separate categories",
      body: [
        "School-content controversies often combine classroom curriculum, assigned instructional materials, supplementary resources and library collections into one debate. Texas law and local policy can treat those categories differently, with different approval, access, reconsideration and complaint procedures. A parent objecting to a required classroom assignment may therefore use a different process from a parent challenging a book available in a school library.",
        "Clear categorization improves accountability. KTR should identify whether material is required, optional, teacher-selected, district-adopted or library-accessible; what grade or course is involved; what policy governs review; and whether the complaint has completed the local process. That gives parents actionable information while avoiding the common mistake of reporting that a district 'teaches' every title that happens to be present somewhere in a campus collection."
      ]
    },
    {
      heading: "Health and consent questions require the specific service and statute",
      body: [
        "Parental consent can be required for particular school-related health services, but the answer depends on the service, the student's circumstances and the governing state or federal rule. Emergency care, routine school health activities, counseling, screenings, disability services and outside medical treatment are not one legal category. A durable guide should not promise that one consent rule resolves all of them.",
        "When legislation changes health-related parental rights, KTR should state exactly what notice, consent, opt-out or record provision changed and when it became effective. That method is particularly important when political debate moves faster than district implementation. Parents need the enacted requirement and the district process that carries it out, while schools need clarity about duties that are mandatory rather than preferences asserted in advocacy material."
      ]
    },
    {
      heading: "Complaints usually begin locally before they become state disputes",
      body: [
        "Texas public schools operate through local districts and charter systems subject to state and federal law. Many disputes therefore begin with a teacher, principal, campus administrator, superintendent or local board process before a state agency or court becomes involved. The available appeal path depends on the subject; not every disagreement is within the Texas Education Agency's jurisdiction, and not every local policy question creates a court claim.",
        "Parents are better served by knowing the decision-maker and record they need to build. A written complaint that identifies the policy, requested remedy and relevant facts is generally more useful than assuming a social-media post automatically triggers legal review. KTR should link readers to official district and state procedures where appropriate and distinguish administrative complaints, board governance, statutory appeals and litigation rather than presenting them as interchangeable escalation steps."
      ]
    },
    {
      heading: "School boards remain a direct accountability channel",
      body: [
        "Locally elected school boards adopt budgets, policies and governance decisions within authority granted by law. Parents can participate through elections, public meetings, policy processes and formal complaints, but individual trustees generally act through the board rather than exercising unilateral executive authority. Open-government rules, meeting procedures and district policies shape how public participation occurs.",
        "This governance structure matters when assigning responsibility. A classroom decision may belong first to campus administration; a districtwide policy may belong to the board; a state curriculum requirement may come from the Legislature or State Board of Education; and a federal obligation may constrain all of them. KTR's parental-rights coverage should map that chain so readers can direct pressure to the institution that can actually change the rule."
      ]
    }
  ],
  "texas-state-federal-power": [
    {
      heading: "Federalism begins with divided powers, not automatic supremacy in every dispute",
      body: [
        "The United States Constitution gives the federal government enumerated powers while states retain broad authority over matters not assigned to the federal government, subject to constitutional limits. The Supremacy Clause makes valid federal law controlling when it conflicts with state law, but that principle does not mean a federal agency can act without statutory or constitutional authority. The legal fight often concerns whether Congress authorized the federal action and whether the federal rule actually preempts the Texas measure at issue.",
        "That is why political shorthand such as 'states' rights' or 'federal supremacy' does not resolve a case. Courts examine the specific constitutional provision, federal statute, agency action and Texas law. KTR should tell readers what source of authority each side invokes and what relief is requested before describing a lawsuit as a final victory for either state sovereignty or national power."
      ]
    },
    {
      heading: "Preemption can be express, structural or based on a direct conflict",
      body: [
        "Congress can expressly state that federal law displaces certain state rules, and courts can also find preemption from the structure of a federal statutory scheme or from an actual conflict that makes simultaneous compliance impossible or frustrates the federal rule under governing doctrine. The category matters because the evidence and legal analysis differ. A federal statute regulating a subject does not automatically erase every related Texas law.",
        "For readers, the practical test is narrower: identify the Texas requirement, the federal provision said to displace it, and the court's explanation of the conflict. KTR should avoid announcing that an entire field belongs exclusively to Washington unless the controlling law supports that conclusion. Likewise, a state policy preference cannot preserve a Texas rule that a controlling court has held preempted by valid federal law."
      ]
    },
    {
      heading: "Federal agencies depend on authority Congress actually delegated",
      body: [
        "Much modern federalism litigation is about agency power rather than a direct conflict between Congress and the Texas Legislature. Agencies administer statutes enacted by Congress, and their rules must fit within the authority those statutes provide as interpreted by the courts. Texas frequently challenges federal regulations by arguing that an agency exceeded statutory authority, violated required procedure or infringed constitutional limits.",
        "Those cases should be reported through the administrative record and the court's actual holding. A policy may be expensive or unpopular in Texas without being unlawful, and a rule may pursue a national objective without being authorized in the form an agency chose. KTR can make federal-overreach coverage stronger by distinguishing policy criticism from the legal defect alleged and by tracking whether a ruling is preliminary, final, stayed or under appeal."
      ]
    },
    {
      heading: "Texas can refuse some forms of federal commandeering without nullifying federal law",
      body: [
        "Constitutional doctrine limits the federal government's ability in some circumstances to require state governments or state officers to administer a federal regulatory program. That anti-commandeering principle is different from a state power to nullify federal law. Where federal law validly regulates private conduct or federal institutions, Texas cannot make the federal rule disappear simply by declaring opposition to it.",
        "This distinction is important in debates over immigration, firearms, environmental regulation and other contested fields. A Texas law limiting state participation in a federal program raises a different question from a Texas law that affirmatively authorizes conduct federal law prohibits. KTR should identify whether the dispute concerns state cooperation, direct federal regulation, funding conditions or preemption before invoking broad constitutional slogans."
      ]
    },
    {
      heading: "Federal funding can create leverage without transferring unlimited power",
      body: [
        "Congress often supports state programs through grants that come with conditions. Texas may choose to participate and accept obligations tied to the funds, but constitutional and statutory limits can still govern the conditions Congress or an agency imposes. Disputes can arise over whether a condition was authorized, clearly stated, related to the funded program or changed after a state relied on the original arrangement.",
        "For fiscal reporting, readers should know how much federal money is involved, what program receives it, what condition is disputed and what would happen if Texas declined the funds or lost them. Calling federal grants 'free money' ignores taxpayer cost and program conditions, while saying Texas can reject every federal requirement without consequence ignores the choices built into cooperative programs. The actual grant statute and implementing rule provide the useful baseline."
      ]
    },
    {
      heading: "Court orders have geographic and procedural limits",
      body: [
        "A federal district court ruling can be extremely important without necessarily being the final word nationwide. Injunctions can vary in scope, appellate courts can stay or narrow orders, and the Supreme Court may ultimately resolve a disputed constitutional or statutory question. State-court litigation can proceed on different claims. Readers therefore need both the holding and the procedural posture.",
        "KTR should use precise verbs: a complaint alleges, a trial court holds, an injunction blocks specified action, an appellate court stays or affirms, and a final mandate determines what takes effect after review. That chronology prevents temporary litigation developments from becoming permanent evergreen claims. The issue guide can explain the federalism framework while current articles carry the latest case status and link back to the controlling opinions."
      ]
    }
  ]
};

export function applyWave2IssueGuideUpgrade(guide: IssueGuide): IssueGuide {
  const additions = WAVE2_EXTRA_SECTIONS[guide.slug];
  if (!additions) return guide;
  return { ...guide, sections: [...guide.sections, ...additions] };
}

export const WAVE2_ISSUE_GUIDE_SLUGS = Object.freeze(Object.keys(WAVE2_EXTRA_SECTIONS));

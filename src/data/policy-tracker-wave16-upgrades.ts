import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE16 } from "@/data/policy-trackers-wave16";

function requireWave16Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE16.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave16 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const scopeActBase = requireWave16Tracker("scope-act-online-minors");
const cyberCommandBase = requireWave16Tracker("texas-cyber-command");

const scopeActOnlineMinors: PolicyTracker = {
  ...scopeActBase,
  updated: reviewed,
  keyFacts: [
    ...scopeActBase.keyFacts,
    "The Fifth Circuit's July 24, 2026 consolidated decision addressed different provisions and different plaintiffs through different doctrines; the Section 230 holding, standing rulings, age-registration analysis, and remand posture should not be compressed into a single statement that the SCOPE Act was either wholly upheld or wholly invalidated.",
    "A preliminary injunction, appellate affirmance, appellate vacatur, remand for further proceedings, and final merits judgment have different legal effects. Coverage should identify the provision and plaintiff set affected by each ruling before describing what can currently be enforced.",
    "Chapter 509's parental-management, targeted-advertising, harmful-content, age-related, data-handling, and provider-duty provisions are separate compliance layers, so a court ruling about one does not automatically resolve all remaining duties.",
  ],
  context: [
    ...scopeActBase.context,
    "The July 2026 Fifth Circuit opinion makes provision-by-provision reporting essential. The consolidated appeal involved separate plaintiff groups and several challenged requirements. The panel left the monitoring-and-filtering preliminary injunction in place for the CCIA plaintiffs on federal Section 230 preemption grounds, while its treatment of the SEAT plaintiffs involved standing and later Supreme Court precedent for particular claims. KTR will name the plaintiff group, statutory provision, doctrine, and procedural result instead of translating a mixed appellate opinion into an all-or-nothing description of HB 18.",
    "Preemption and First Amendment analysis should remain separate. A requirement can be blocked because federal law preempts it without a court reaching every constitutional argument, while another provision can survive a particular preliminary challenge because the plaintiff lacks standing or controlling precedent forecloses the asserted theory. Those outcomes answer different questions. The tracker will preserve the court's actual reasoning and avoid implying that a procedural loss or preemption ruling is a final merits judgment on every policy concern raised by the statute.",
    "Enforceability also changes with procedural posture. A district-court preliminary injunction can prevent enforcement while litigation continues; an appellate court can affirm, narrow, vacate, or remand that order; later district proceedings can produce a new injunction or final judgment; and another appeal can change the result again. KTR will identify whether a provision is presently subject to an operative injunction and which parties or applications are covered rather than relying on an older headline after the procedural posture changes.",
    "The SCOPE Act's regulatory layers should stay distinct even outside litigation. Parental account tools, restrictions involving known minors, targeted advertising, harmful-material duties, age registration or verification, provider notices, and data practices can impose different obligations on different services. A platform can therefore face a compliance issue under one section while another section is enjoined or inapplicable. The tracker will link the current codified provision and explain the service or feature involved instead of describing Chapter 509 as one indivisible mandate.",
    "Technical implementation creates measurable privacy and usability questions. Determining whether a user is a minor can require account information, age assurance, parental linkage, or other data flows. Parental controls can be meaningful only if parents can understand and use them, while overcollection can create privacy or security risk. KTR's editorial support for parental authority and child protection will remain separate from the factual evaluation of what data services collect, how controls work, whether minors can circumvent them, and what enforcement records show.",
    "The durable tracker should follow the remand as closely as the appellate headline. District-court filings can clarify which claims remain live, what factual record is developed, whether plaintiffs renew requests for injunctive relief, and how the court applies the Fifth Circuit's instructions. Later legislation can also amend Chapter 509 in response to litigation or technological change. KTR will preserve bill text, court orders, mandates, and effective dates so readers can determine the current rule without assuming the 2023 enrolled act or a single 2026 opinion is the last word.",
  ],
  watchFor: [
    ...scopeActBase.watchFor,
    "Western District of Texas rulings on remand that identify which SCOPE Act provisions remain challenged, enjoined, enforceable, or factually unsupported after the July 2026 Fifth Circuit decision",
    "Any later Fifth Circuit or Supreme Court action that changes the Section 230, standing, age-registration, First Amendment, or remedial posture for a specific Chapter 509 provision",
  ],
};

const texasCyberCommand: PolicyTracker = {
  ...cyberCommandBase,
  updated: reviewed,
  keyFacts: [
    ...cyberCommandBase.keyFacts,
    "Statutory creation, transfer of a function from DIR, operational assumption of that function, staffing and asset transfer, service continuity, incident-response performance, and completion of the December 31, 2026 transfer deadline are separate implementation milestones.",
    "A centralized cybersecurity authority can set standards or provide services without every state or local system becoming part of one network; the affected entity, service, authority, agreement, and reporting obligation should be identified for each implementation claim.",
    "Cyber incident counts, vulnerability findings, response times, forensic activity, training participation, and avoided losses measure different aspects of cybersecurity performance and should not be collapsed into a single claim that the new command has made Texas 'secure.'",
  ],
  context: [
    ...cyberCommandBase.context,
    "Texas Cyber Command should be judged as an operational transition, not just as a newly named agency. HB 150 establishes the legal authority and transfer framework, while DIR's April 2026 announcement shows that major cybersecurity functions had transitioned and services continued. The statute also provides an outer deadline for specified staff, assets, contracts, functions, and responsibilities. KTR will distinguish legal creation, early operational transition, and final completion of the statutory transfer so readers can see what work remains before the reorganization is fully implemented.",
    "Service continuity is an important implementation measure because agencies and local partners cannot pause incident reporting or defensive services while governance changes. DIR stated that existing services, reporting procedures, service levels, and access remained in place during the transition. KTR will follow later notices that change those procedures and identify which organization operates each service. A successful administrative transfer should reduce confusion for users rather than create duplicate reporting channels or unclear responsibility during an incident.",
    "Centralization also needs authority-specific reporting. Texas Cyber Command can lead statewide standards, threat intelligence, incident response, digital forensics, network-security services, training, and coordination, but state agencies, universities, local governments, schools, utilities, and private critical-infrastructure operators can have different legal relationships with the command. A service agreement or voluntary coordination arrangement is not the same as direct regulatory control. The tracker will identify the participating entity and statutory or contractual basis for each program.",
    "Cybersecurity outcomes are difficult to reduce to one metric. A rise in reported incidents can mean worsening attacks, better detection, stronger reporting compliance, or all three. Faster response times do not by themselves show that vulnerabilities were fixed, and a lack of public incidents does not prove an organization was not compromised. KTR will use multiple indicators where available: incident severity, detection and response time, recurring vulnerabilities, forensic findings, training, remediation, audit results, service adoption, and documented operational disruption.",
    "Appropriations and procurement should remain visible because centralization can create both economies of scale and concentration risk. Staffing levels, major contracts, managed-security services, regional operations, threat-intelligence tools, laboratories, and network programs can require substantial recurring spending. KTR's editorial support for stronger state cyber defense will be paired with taxpayer accountability: what was purchased, under what authority, which entities use it, what service level is promised, and what evidence shows that the investment improved resilience.",
    "The durable policy test is whether the new command creates clearer responsibility and stronger measurable defense while preserving privacy and lawful oversight. HB 150, transition documents, incident guidance, state standards, legislative reports, audit findings, appropriations, and post-incident reviews can show whether the organization matures as intended. The page should also preserve problems—missed deadlines, service disruptions, audit findings, or major incidents—rather than allowing the agency's creation announcement to remain the permanent description of performance.",
  ],
  watchFor: [
    ...cyberCommandBase.watchFor,
    "Formal confirmation of the remaining staff, asset, contract, network-security, reporting, and program transfers required by the December 31, 2026 statutory deadline",
    "Public performance evidence such as incident-response timelines, audit findings, remediation results, service adoption, threat-intelligence outputs, training participation, and after-action reports",
  ],
};

export const POLICY_TRACKER_WAVE16_UPGRADES: Record<string, PolicyTracker> = {
  [scopeActOnlineMinors.slug]: scopeActOnlineMinors,
  [texasCyberCommand.slug]: texasCyberCommand,
};

export const WAVE16_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE16_UPGRADES);

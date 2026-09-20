import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE15 } from "@/data/policy-trackers-wave15";

function requireWave15Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE15.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave15 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const aiGovernanceBase = requireWave15Tracker("ai-governance");
const dataBrokersBase = requireWave15Tracker("data-brokers");
const biometricPrivacyBase = requireWave15Tracker("biometric-privacy");

const aiGovernance: PolicyTracker = {
  ...aiGovernanceBase,
  updated: reviewed,
  keyFacts: [
    ...aiGovernanceBase.keyFacts,
    "TRAIGA uses targeted duties, prohibitions, exemptions, enforcement, a sandbox, and an advisory council rather than one universal licensing or preapproval regime for every AI system used in Texas.",
    "An AI developer, deployer, government agency, health-care provider, data controller, and third-party vendor can have different responsibilities; the actor and use case should be identified before a legal conclusion is drawn.",
    "A prohibited intentional use, required disclosure, Attorney General complaint, sandbox participation, council recommendation, and final enforcement order are different legal events and should be tracked separately.",
  ],
  context: [
    ...aiGovernanceBase.context,
    "Texas AI governance should be reported from the specific statutory use case outward rather than from the label 'AI' inward. HB 149 does not treat every model, recommendation system, automated tool, and government deployment identically. Some provisions address prohibited conduct, some require disclosures in defined settings, and others create exemptions or institutional mechanisms. KTR will identify the system, actor, decision or content at issue, and statutory provision before describing conduct as regulated, exempt, prohibited, or merely politically controversial.",
    "Intent and purpose can matter for prohibited-use provisions. A system being capable of generating harmful output is not necessarily the same legal question as intentionally developing or deploying it for a prohibited purpose. Enforcement should therefore be tied to evidence about the use, instructions, design, deployment context, and statutory standard. The tracker will distinguish an allegation, consumer complaint, investigation, notice, settlement, and final court or administrative outcome rather than treating the filing of a complaint as proof of a TRAIGA violation.",
    "Disclosure duties should remain separate from substantive outcome rules. A government agency or covered health-care setting can have an obligation to tell a person that AI is being used even where the underlying use is lawful. Conversely, disclosure does not legalize conduct that another provision prohibits. KTR will track whether the duty concerns notice, automated interaction, a health-care service, decision support, or another covered use and will identify the responsible actor instead of presenting transparency as a blanket safe harbor.",
    "The regulatory sandbox is another distinct policy instrument. Participation can offer a supervised environment for testing qualifying innovation under defined terms, but entry into a sandbox is not a statewide certification that a product is safe, constitutional, accurate, or commercially successful. The tracker will record eligibility, approved participants, conditions, duration, reporting, consumer protections, and exit outcomes so the sandbox can be judged by the projects it actually advances and the risks it surfaces.",
    "The Texas Artificial Intelligence Council has an advisory and oversight role that should not be confused with Attorney General enforcement or agency rulemaking. Reports and recommendations can influence later legislation or executive policy without changing private legal duties on their own. KTR will preserve the difference between a council recommendation, a bill, an enacted amendment, an agency action, and a binding court interpretation. That prevents advisory documents from being presented as current law.",
    "The durable policy test is whether Texas can encourage useful AI deployment while preventing clearly defined harms and preserving privacy, constitutional rights, and accountability. Evidence should include enforcement records, sandbox results, disclosed government uses, health-care implementation, council reports, court decisions, and measurable effects on innovation or compliance. KTR's editorial preference for innovation will not substitute for proof that a particular system works or that a claimed harm occurred; the tracker will keep technical capability, legal compliance, and policy judgment distinct.",
  ],
  watchFor: [
    ...aiGovernanceBase.watchFor,
    "Published Attorney General matters identifying the specific AI use, actor, statutory theory, procedural stage, and final outcome",
    "Sandbox participant records and AI Council reports that show measurable implementation results rather than only program creation or recommendations",
  ],
};

const dataBrokers: PolicyTracker = {
  ...dataBrokersBase,
  updated: reviewed,
  keyFacts: [
    ...dataBrokersBase.keyFacts,
    "Registration status, statutory coverage, consumer-facing notice, information-security program, Chapter 541 privacy rights, Secretary of State filing administration, and Attorney General enforcement are separate parts of the Texas data-broker framework.",
    "A business that handles third-party personal data is not automatically a covered data broker; definitions, thresholds, exemptions, revenue or data-volume criteria, and the nature of the business relationship matter.",
    "A registry filing shows that an entity represented itself as subject to the registration regime; it does not by itself establish that the broker complies with every notice, security, privacy, or downstream-use duty.",
  ],
  context: [
    ...dataBrokersBase.context,
    "Coverage should begin with the statutory definition rather than with a broad description of a company's business model. Many companies receive data from vendors, advertising partners, affiliates, public sources, or customers, but Texas law applies its own criteria to determine who qualifies as a data broker. KTR will identify the relevant threshold, relationship to the individuals whose data is handled, and any exemption before describing an entity as required to register. That avoids turning the registry into an informal label for every company that uses third-party information.",
    "Secretary of State administration and Attorney General enforcement should remain separate. The Secretary of State accepts registrations, maintains the public registry, and administers filing requirements, but the agency's FAQ materials make clear that it is not the general investigator of data-broker business-practice violations. KTR will distinguish a missing or expired registration from an alleged privacy or security violation and identify which authority can act on each issue.",
    "The public notice requirement creates its own accountability surface. A covered broker with a website or mobile application may have to provide conspicuous information that helps consumers understand the business and exercise applicable privacy rights. A notice can be present but incomplete, difficult to find, or inconsistent with actual practices. The tracker will compare required notice elements with the public-facing page and any Attorney General action rather than equating the existence of a privacy link with full compliance.",
    "Information security is another distinct obligation. A broker may hold large volumes of personal data obtained without a direct customer relationship, which increases the importance of access control, retention, vendor management, incident response, and reasonable security practices. The statutory requirement for a comprehensive information-security program should be evaluated through enforcement records, reported incidents, official filings, or other reliable evidence. KTR will not infer that registration alone proves data is secure or that a breach automatically proves every security duty was violated.",
    "The 2025 changes make code-version control important. Enrolled bills can refer to a chapter number that later appears differently in current codification after harmonization or renumbering. A reader using an older bill PDF and a current statute should be able to understand that they refer to the same evolving framework. KTR will preserve bill numbers, effective dates, and current codified citations rather than treating numbering differences as conflicting laws.",
    "The durable policy question is whether registration and notice make opaque data markets meaningfully more transparent. Useful measures include the number of registered brokers, renewal compliance, consumer-rights pathways, enforcement actions, security incidents, changes in statutory coverage, and whether consumers can identify who holds their information and how to exercise rights. KTR's editorial preference for privacy and transparency will remain separate from the evidence needed to show that the registry actually changes broker behavior.",
  ],
  watchFor: [
    ...dataBrokersBase.watchFor,
    "Registry records showing new registrations, expirations, renewals, or material changes in the covered broker population after the 2025 amendments",
    "Attorney General matters clarifying coverage, notice, security, consumer-rights, or enforcement obligations distinct from Secretary of State filing administration",
  ],
};

const biometricPrivacy: PolicyTracker = {
  ...biometricPrivacyBase,
  updated: reviewed,
  keyFacts: [
    ...biometricPrivacyBase.keyFacts,
    "Capture, possession, commercial purpose, notice, consent, sale or disclosure, security, retention, destruction, AI-related exceptions, and Attorney General enforcement are separate elements of CUBI analysis.",
    "A photograph or audio recording can contain information from which biometric identifiers might be derived without every use of the media automatically constituting statutory capture of face geometry, a voiceprint, or another covered identifier.",
    "Public availability of an image or recording should not be treated as blanket biometric consent, particularly after the 2026 AI-related amendments; the actual statutory exception and use must be identified.",
  ],
  context: [
    ...biometricPrivacyBase.context,
    "CUBI coverage depends on what information is actually captured and how it is used. Texas defines specific biometric identifiers such as fingerprints, voiceprints, and records of hand or face geometry. A company using a camera, photograph, microphone, or ordinary account image is not automatically engaged in the same regulated conduct as a system that extracts or stores a covered biometric template. KTR will identify the technology and data representation before describing a practice as biometric capture.",
    "Commercial purpose and consent are also separate questions. Where the statute requires notice and consent before capture, reporting should identify what the person was told, when consent was obtained, what identifier was captured, and the purpose for which it was used. A general terms-of-service agreement may raise different factual questions from a clear biometric notice. The tracker will rely on the statutory standard and public evidence rather than assume that any user agreement is sufficient or that no consent existed simply because a controversy arose.",
    "Disclosure and sale rules deserve independent treatment. A business can lawfully capture an identifier under one theory and still face a separate question about sharing it with a vendor, affiliate, law-enforcement request, or other recipient. The statute contains exceptions that should be tied to the actual transaction. KTR will distinguish capture, internal use, storage, sale, lease, and disclosure so a claim about one stage does not automatically become a claim about all handling of the data.",
    "Retention and destruction are especially important because biometric identifiers are difficult or impossible to replace like a password. The statutory framework generally requires destruction within a defined period after the purpose for collection expires unless an exception applies. The tracker will identify the stated purpose, when that purpose ended, the retention period, and any documented deletion or exception. A privacy policy promising eventual deletion should not be treated as proof that the statutory timeline was met.",
    "The 2026 AI amendments require careful reading rather than a blanket claim that AI either is exempt from CUBI or newly prohibited. HB 149 addresses how certain AI development, security, and publicly available media circumstances interact with Section 503.001. KTR will cite the specific exception or limitation invoked and preserve the difference between model development, biometric identification, security, fraud prevention, and ordinary commercial profiling. Publicly available media does not automatically settle the consent question for every downstream biometric use.",
    "The durable accountability record comes from Attorney General enforcement, settlements, court filings, statutory amendments, and documented business practices. Texas does not create a general private cause of action under CUBI, so a consumer allegation and a state enforcement action are procedurally different. KTR's editorial support for strong biometric privacy will be measured against evidence of capture, consent, sharing, security, retention, and actual remedies rather than by the size or reputation of the technology company involved.",
  ],
  watchFor: [
    ...biometricPrivacyBase.watchFor,
    "Attorney General cases that clarify what constitutes biometric capture, valid consent, prohibited disclosure, reasonable protection, or timely destruction",
    "Implementation of the HB 149 AI amendments in enforcement or litigation involving publicly available media, model development, security, or biometric identification",
  ],
};

export const POLICY_TRACKER_WAVE15_UPGRADES: Record<string, PolicyTracker> = {
  [aiGovernance.slug]: aiGovernance,
  [dataBrokers.slug]: dataBrokers,
  [biometricPrivacy.slug]: biometricPrivacy,
};

export const WAVE15_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE15_UPGRADES);

import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE14 } from "@/data/policy-trackers-wave14";

function requireWave14Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE14.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave14 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const consumerPrivacyBase = requireWave14Tracker("consumer-data-privacy");
const onlineAgeVerificationBase = requireWave14Tracker("online-age-verification");
const appStoreControlsBase = requireWave14Tracker("app-store-parental-controls");

const consumerDataPrivacy: PolicyTracker = {
  ...consumerPrivacyBase,
  updated: reviewed,
  keyFacts: [
    ...consumerPrivacyBase.keyFacts,
    "Consumer access, correction, deletion, portability, opt-out rights, sensitive-data consent, controller duties, processor contracts, statutory exemptions, and Attorney General enforcement are distinct parts of Chapter 541 and should not be summarized as one generic privacy rule.",
    "A business can be exempt as an entity or for a category of data while still having other privacy or security obligations under Texas or federal law, so an exemption from Chapter 541 should not be described as an exemption from privacy law generally.",
    "A targeted-advertising opt-out, data-sale opt-out, profiling opt-out, deletion request, and universal opt-out signal address different processing activities and should be evaluated against the right the consumer actually invoked.",
  ],
  context: [
    ...consumerPrivacyBase.context,
    "The Texas Data Privacy and Security Act is easiest to understand when coverage is separated from rights. Before asking whether a company honored an access or deletion request, the tracker should identify whether the company is a covered controller, whether the consumer and data fall within the statute, and whether an entity or data-specific exemption applies. Health, financial, employment, education, or other regulated data can be treated differently depending on the statutory exemption. KTR will show the coverage rule first so a denial of a request is not automatically described as unlawful when the data is outside Chapter 541.",
    "Consumer rights should also remain discrete. Access tells a person whether and how personal data is processed, correction addresses inaccuracies, deletion concerns data provided by or obtained about the consumer, portability provides usable data, and opt-outs address specified targeted advertising, sale, or profiling. A company can comply with one right and fail another. The tracker will identify the request type, response deadline, authentication process, appeal process, and any statutory exception rather than using the broad phrase 'privacy request' for every dispute.",
    "Sensitive data carries additional obligations. The statute addresses categories such as precise geolocation and other defined sensitive information, and consent requirements can differ from ordinary processing. The small-business rule concerning sale of sensitive personal data is another example of why the general small-business exemption should not be described as complete immunity. KTR will identify the data category and processing activity before stating whether consent or another duty applies.",
    "Controller and processor responsibilities are different layers of the same system. Controllers determine purposes and means of processing and carry consumer-facing duties, while processors act under contracts and instructions with specified obligations. Vendor use does not automatically shift every legal duty away from the controller. The tracker will identify which company is acting in which role and whether the dispute involves a privacy notice, data-security practice, processing contract, consumer request, assessment, or downstream data use.",
    "Enforcement is centralized in the Texas Attorney General rather than a private cause of action under Chapter 541. That means an AG investigation, notice, cure opportunity where applicable, civil action, settlement, assurance of voluntary compliance, and final judgment are different stages. KTR will preserve procedural posture and avoid describing a consumer complaint as a proven violation. If the Legislature changes cure procedures, penalties, or enforcement authority, the page should preserve the effective date because those changes affect how older cases are interpreted.",
    "The durable test is whether Texas privacy rights produce measurable control without creating misleading compliance theater. Useful evidence includes privacy notices, opt-out mechanisms, request-response data, enforcement actions, security incidents, universal opt-out implementation, and changes in data practices. KTR's editorial preference for strong personal privacy can coexist with skepticism toward rules that create paperwork without reducing unnecessary collection or sale. The tracker will therefore distinguish substantive privacy outcomes from the mere existence of policies and consent banners.",
  ],
  watchFor: [
    ...consumerPrivacyBase.watchFor,
    "Attorney General matters that clarify controller coverage, sensitive-data consent, consumer-request handling, opt-out obligations, or the scope of statutory exemptions",
    "Implementation evidence showing whether universal opt-out mechanisms and consumer rights produce measurable changes in data collection, sale, profiling, or targeted advertising",
  ],
};

const onlineAgeVerification: PolicyTracker = {
  ...onlineAgeVerificationBase,
  updated: reviewed,
  keyFacts: [
    ...onlineAgeVerificationBase.keyFacts,
    "Chapter 129B's content threshold, knowledge and intent elements, age-verification method, identifying-data retention restriction, civil penalties, and constitutional litigation are separate questions that should be reported independently.",
    "The Supreme Court's 2025 ruling addressed the challenged Texas age-verification requirement; it does not convert every age-assurance system, every website, or every future child-safety mandate into an automatically constitutional rule.",
    "Age estimation, government-ID verification, third-party transactional-data verification, anonymous credential systems, and other age-assurance methods can create materially different privacy, accuracy, and security tradeoffs even when they satisfy a legal age-check objective.",
  ],
  context: [
    ...onlineAgeVerificationBase.context,
    "The first scope question is whether Chapter 129B applies to the site at all. The statute uses a defined threshold involving commercial publication or distribution and the proportion of material considered harmful to minors. That is narrower than a general requirement that every website identify the age of every Texas visitor. KTR will identify the site's alleged content mix, commercial status, and statutory trigger before describing an entity as covered, and will distinguish the legal threshold from broader political arguments about online pornography or child safety.",
    "Verification method and privacy protection belong in the same analysis. A system can verify age through government identification, third-party data, or another commercially reasonable process, but the privacy risk depends on what information is collected, who receives it, how long it is retained, whether it can be linked to browsing activity, and what happens after verification. Chapter 129B includes restrictions on retention of identifying information. KTR will treat compliance with the age threshold and compliance with data-handling limits as separate factual questions.",
    "Accuracy matters as well. Any age-assurance system can produce false positives, false negatives, failed matches, or barriers for users lacking a particular credential. The constitutional and policy debate therefore involves both protecting minors and avoiding unnecessary burdens on lawful adult access. The tracker will rely on court records, enforcement materials, technical implementation evidence, and statutory text rather than assuming a system is either perfectly accurate or inherently unusable because it checks age.",
    "The 2025 Supreme Court decision establishes an important legal baseline for the challenged Texas requirement, but future cases can still concern different provisions, implementation methods, privacy practices, or factual records. A ruling that upholds one statutory framework does not answer whether a separate app-store law, social-media restriction, or differently designed state mandate satisfies the Constitution. KTR will preserve the holding's actual scope and cross-link related laws without treating them as legally interchangeable.",
    "Attorney General enforcement should be documented through procedural stages. A demand, investigation, filed complaint, temporary order, settlement, penalty, and final judgment carry different weight. The tracker will identify the covered site, alleged violation, statutory theory, and outcome instead of using enforcement announcements as proof that every similarly situated service violates the law. If an operator changes its Texas access policy or verification method in response, that implementation evidence should be recorded separately from the legal result.",
    "The durable policy question is whether Texas can reduce minors' access to covered material while minimizing collection of adult identity data. KTR's editorial position supports protecting children and parental authority, but that does not eliminate the privacy and cybersecurity consequences of verification systems. The strongest evidence will show actual compliance methods, data-retention practices, enforcement outcomes, circumvention patterns, and whether newer privacy-preserving credentials can satisfy the law with less exposure of identifying information.",
  ],
  watchFor: [
    ...onlineAgeVerificationBase.watchFor,
    "Enforcement records that identify the verification method, privacy practice, statutory threshold, and final outcome rather than only the existence of an Attorney General action",
    "Technical adoption of privacy-preserving age credentials or assurance methods that reduce retention of government-ID or transactional data while meeting statutory requirements",
  ],
};

const appStoreParentalControls: PolicyTracker = {
  ...appStoreControlsBase,
  updated: reviewed,
  keyFacts: [
    ...appStoreControlsBase.keyFacts,
    "The Fifth Circuit stay concerns whether the preliminary injunction remains in force during appeal; it is procedurally different from a final merits judgment resolving every constitutional challenge to Chapter 121.",
    "App-store age categorization, parent-account linkage, approval of a minor's download or purchase, developer age-rating duties, data use, and privacy safeguards are separate compliance layers and can produce different legal disputes.",
    "A user-age system can affect adults as well as minors because the platform must determine an age category before it knows whether parental approval applies, making minimization and retention practices relevant to the privacy analysis.",
  ],
  context: [
    ...appStoreControlsBase.context,
    "SB 2420 operates at the platform transaction layer, which distinguishes it from a website law triggered by harmful-to-minors content. Covered app stores must identify age categories and, for minors, connect the account to a parent or guardian process for specified downloads or purchases. Developers can have separate duties connected to ratings, material changes, or information supplied through the platform. KTR will identify whether a dispute concerns the app store, developer, parent-approval workflow, or data practice instead of treating the entire ecosystem as one actor.",
    "The litigation posture remains essential. A district court's preliminary injunction, the Fifth Circuit's stay of that injunction pending appeal, the Supreme Court's decision not to disturb the stay on an emergency application, oral argument, and a later merits opinion are different procedural events. The stay means enforcement can proceed while the appeal continues; it does not by itself resolve every merits issue. KTR will keep that distinction in the current-status language until a binding later decision changes the legal baseline.",
    "Age identification creates a privacy question before parental consent even begins. A platform needs enough information to place a user into a statutory age category, which can involve account data, verification vendors, device signals, identification, or other commercially reasonable methods depending on implementation. The tracker will follow what data is collected, whether it is retained, whether it can be repurposed, and what the law or court orders require. Protecting minors should not be reported as if it makes privacy architecture irrelevant.",
    "Parental approval is also more specific than a generic parental-control feature. The statute can govern downloads, purchases, or other covered transactions under defined conditions. A platform may already offer family-account tools that do not exactly match the statutory workflow. KTR will distinguish voluntary product controls from legal compliance and will identify when a company changes its Texas-specific process because of Chapter 121 rather than assuming every preexisting family feature satisfies the statute.",
    "Developer obligations deserve their own evidence. App stores depend on developer-supplied information about content, age ratings, and material changes, while developers depend on platform tools to obtain or transmit age-related signals and approvals. A compliance failure can therefore arise from inaccurate developer information, platform implementation, account configuration, or data handling. The tracker will identify the alleged failure and responsible actor rather than describing every problem as an 'app store violation.'",
    "The durable policy test is whether the system gives parents meaningful control without creating excessive identity collection, security risk, or unconstitutional burdens on speech and lawful adult access. KTR's editorial preference favors strong parental authority, but the factual page will track court decisions, enforcement, implementation costs, privacy practices, developer compliance, false age classifications, and user experience. That allows the policy to be judged by outcomes rather than by the existence of an age-verification mandate alone.",
  ],
  watchFor: [
    ...appStoreControlsBase.watchFor,
    "A Fifth Circuit merits opinion or later Supreme Court action that changes the current stay posture or resolves specific constitutional challenges to Chapter 121",
    "Implementation records showing age-categorization methods, parent-approval workflows, developer duties, privacy safeguards, false classifications, and data-retention practices",
  ],
};

export const POLICY_TRACKER_WAVE14_UPGRADES: Record<string, PolicyTracker> = {
  [consumerDataPrivacy.slug]: consumerDataPrivacy,
  [onlineAgeVerification.slug]: onlineAgeVerification,
  [appStoreParentalControls.slug]: appStoreParentalControls,
};

export const WAVE14_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE14_UPGRADES);

import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE5 } from "@/data/policy-trackers-wave5";

function requireWave5Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE5.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave5 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-27";

const womensSportsBase = requireWave5Tracker("womens-sports");
const campusFreeSpeechBase = requireWave5Tracker("campus-free-speech");
const advancedNuclearBase = requireWave5Tracker("advanced-nuclear-energy");

const womensSports: PolicyTracker = {
  ...womensSportsBase,
  updated: reviewed,
  keyFacts: [
    ...womensSportsBase.keyFacts,
    "Texas K-12 and public-higher-education athletic statutes use separate sections of the Education Code, so the covered institutions, administrative processes, and litigation posture should be checked independently.",
    "A change in federal Title IX regulations or federal-court interpretation can affect compliance obligations for Texas institutions without automatically repealing or amending the text of Texas law.",
    "Eligibility rules, recordkeeping, enforcement remedies, association competition rules, and school-district or university procedures are different implementation layers and should not be treated as a single statewide administrative act.",
  ],
  context: [
    ...womensSportsBase.context,
    "The first reporting distinction is between the K-12 framework and the public-college framework. HB 25 and SB 15 were enacted in different sessions and govern different institutional settings. A district athletics dispute should therefore be tied to the K-12 statutory provision and any relevant UIL or district procedure, while a university dispute should be checked against the higher-education statute, institutional policy, conference or association rules, and applicable federal law. Using one statute as shorthand for every Texas athletic program can obscure differences in who administers the rule and what remedy is available.",
    "Federal-state interaction is another separate layer. Title IX and federal constitutional law can affect educational institutions, while Texas has enacted its own sex-based athletic requirements. A new federal regulation, agency interpretation, injunction, or appellate decision can change what institutions are told they must do even if the Texas Legislature has not amended state law. KTR will preserve the date and procedural status of those federal developments and distinguish a proposed rule, final rule, nationwide injunction, circuit-specific order, and final Supreme Court disposition rather than treating every announcement as settled law.",
    "Implementation evidence should identify the decision maker. School districts, charter schools, universities, athletic departments, the UIL, conferences, national associations, and state officials can each play different roles. An eligibility decision by one institution does not necessarily show that another institution applies the law the same way. When an enforcement dispute occurs, the tracker should identify the policy relied upon, the appeal or review procedure, and whether the decision rests on Texas statute, association rules, federal requirements, or a combination of them.",
    "Definitions also matter. Political debate often uses broad terms such as biological sex, gender identity, transgender athlete, women's division, or girls' sports, while enacted statutes use defined language that controls the legal analysis. KTR will quote or accurately summarize the operative statutory definition and avoid substituting a campaign slogan for the text. If the Legislature changes a definition, documentation rule, exception, or enforcement mechanism, the tracker will preserve the effective date so older disputes are not judged under a later version of the law.",
    "KTR's editorial position favors preserving sex-based competitive categories for women and girls, but the factual tracker still needs measurable implementation evidence. Participation data, litigation records, institutional policies, enforcement decisions, and statutory amendments can show how the framework operates. Anecdotes may illustrate a dispute but should not be generalized into statewide prevalence claims without broader evidence. The same standard applies to claims about competitive advantage, scholarships, roster effects, or administrative burden: identify what the cited source actually measures.",
    "A durable tracker should also distinguish athletic eligibility from other school policies concerning facilities, student records, health information, discipline, or classroom rules. Those issues can involve different statutes and privacy obligations even when they arise in the same political debate. Keeping the page centered on athletic competition gives the URL a clear job and lets related parental-rights, public-education, and constitutional-law pages handle adjacent questions without duplicating or blurring legal standards.",
  ],
  watchFor: [
    ...womensSportsBase.watchFor,
    "Dated institutional or athletic-association policies showing how Texas statutory eligibility rules are implemented in practice",
    "Final appellate rulings that clarify the interaction between Texas athletics statutes and federal constitutional or Title IX requirements",
  ],
};

const campusFreeSpeech: PolicyTracker = {
  ...campusFreeSpeechBase,
  updated: reviewed,
  keyFacts: [
    ...campusFreeSpeechBase.keyFacts,
    "Public universities are government actors for constitutional purposes, but the First Amendment and Section 51.9315 do not convert every campus location or activity into an unrestricted forum; the legal classification of the space and the nature of the rule matter.",
    "A content-neutral time, place, and manner rule is analytically different from viewpoint discrimination. The wording, enforcement pattern, exceptions, and administrative record can determine which issue a dispute actually presents.",
    "Student discipline, trespass, threats, property damage, classroom disruption, amplified sound, encampments, and protected advocacy can involve overlapping rules, so the disputed conduct should be identified before a free-speech conclusion is drawn.",
  ],
  context: [
    ...campusFreeSpeechBase.context,
    "Texas campus-speech law combines the federal First Amendment with a detailed state statutory framework for public institutions. Section 51.9315 is therefore more than a general statement that speech is protected: it sets expectations for expressive activity, institutional policies, outdoor areas, student organizations, and permissible restrictions. KTR will cite the current statutory text and the institution's adopted policy when evaluating a dispute, because a campus may comply with one requirement while violating another and because amendments can change the state-law baseline over time.",
    "Forum analysis and location are important. A traditional or designated public forum, a reserved room, a classroom, an administrative office, a residence hall, and a restricted operational space can carry different legal expectations. Political coverage often compresses those distinctions into 'speech was banned on campus,' but the useful question is what space was involved and what rule applied there. KTR will identify whether access was denied altogether, conditioned on advance reservation, restricted by neutral operational rules, or limited because of the content or viewpoint of the expression.",
    "Viewpoint discrimination deserves separate scrutiny from ordinary event regulation. A university can have legitimate interests in safety, scheduling, noise, building access, and continued instruction, but a facially neutral policy can still raise constitutional concerns if officials enforce it differently because they favor or disfavor the speaker's message. Evidence can include policy text, emails, reservation records, disciplinary notices, comparable events, and court findings. KTR will avoid assuming discriminatory motive from the existence of a restriction while also refusing to treat neutral wording as proof of neutral enforcement.",
    "Protest and disruption cases require the conduct to be described precisely. Peaceful leafleting, a scheduled rally, an occupied building, an encampment, amplified sound during instruction, threats, property damage, and refusal to leave a closed facility are not legally interchangeable. A university may regulate conduct that materially disrupts operations while remaining bound not to suppress protected expression because it is unpopular. The tracker will separate the speech content from the conduct rule and show which facts a university, court, or disciplinary body relied on.",
    "Student organizations and faculty raise additional questions. Recognition, funding, access to facilities, invited speakers, academic responsibilities, employee speech, and classroom instruction can involve different constitutional tests or institutional rules. Section 51.9315 may provide state-law protections alongside those federal doctrines. KTR will keep the category narrow enough that a dispute over student-organization recognition is not automatically described as identical to a faculty-employment dispute merely because both involve political expression.",
    "The 2025 amendments make version control essential. When lawmakers revise expressive-activity statutes, universities may need to update policies, training, disciplinary procedures, or facility rules. A current tracker should therefore show the enacted amendment, effective date, subsequent institutional policy changes, and litigation interpreting the new text. This gives readers a way to distinguish a complaint based on an outdated campus rule from a dispute over the current statute and prevents an older court case from being presented as if it interpreted language adopted later.",
  ],
  watchFor: [
    ...campusFreeSpeechBase.watchFor,
    "Public-university policy revisions and training materials implementing the latest version of Section 51.9315",
    "Court opinions distinguishing protected expression from materially disruptive or unlawful conduct under Texas and federal law",
  ],
};

const advancedNuclear: PolicyTracker = {
  ...advancedNuclearBase,
  updated: reviewed,
  keyFacts: [
    ...advancedNuclearBase.keyFacts,
    "Texas economic-development support cannot substitute for a required federal NRC license. State grants, coordination, workforce programs, and site support are distinct from federal reactor-safety authorization.",
    "A project announcement, memorandum of understanding, grant award, construction commitment, NRC application, accepted docket, license, and operating reactor are different milestones and should be reported separately.",
    "Grid value depends on more than reactor nameplate capacity: project timing, interconnection, transmission, outage assumptions, fuel availability, financing, construction risk, and actual commercial operation all affect reliability and customer cost.",
  ],
  context: [
    ...advancedNuclearBase.context,
    "HB 14 gives Texas a state-level framework for developing an advanced nuclear industry, but it does not transfer federal reactor-safety licensing to Austin. The NRC remains the central federal licensing authority for covered nuclear facilities. Texas can coordinate economic development, workforce, infrastructure, state permitting, grants, and agency support while a developer separately works through federal licensing. KTR will keep those tracks visible so a state announcement is not mistaken for federal approval and a federal pre-application meeting is not described as a construction authorization.",
    "Project maturity should be reported through milestones. Advanced-nuclear announcements can occur years before commercial operation, and the word 'project' can describe anything from an early feasibility study to a licensed facility under construction. The tracker will identify whether a proposal has a named site, developer, reactor technology, customer or offtake arrangement, financing plan, interconnection request, NRC interaction, state support, construction schedule, and binding investment decision. That framework helps separate a serious project pipeline from aspirational announcements without dismissing early-stage development that may later mature.",
    "Cost comparisons require equally careful definitions. Overnight construction cost, financed project cost, federal tax support, state grants, fuel cost, operating cost, transmission upgrades, decommissioning obligations, and the price paid by an electricity customer are different measures. A reactor can offer high capacity-factor or reliability value while still facing financing and construction risks. KTR will avoid comparing one technology's unsubsidized operating cost with another technology's all-in financed project cost and calling the result a complete consumer-price comparison.",
    "Reliability value also depends on system conditions. A nuclear unit can provide sustained output and fuel-security characteristics, but ERCOT still needs transmission, reserves, maintenance planning, and a portfolio capable of handling outages and rapid load changes. Small modular reactors or microreactors may have different siting and deployment characteristics from large conventional units, yet those claimed advantages should be tested against actual licensing, construction, and operating experience as projects advance. The broader Energy & ERCOT tracker remains the place for system-wide resource adequacy.",
    "Water, land, fuel-cycle services, and workforce can become practical constraints even after policy support exists. Different reactor designs may have different cooling or siting requirements, but every specific project should be evaluated using the developer's design and regulatory filings rather than generic assumptions about 'nuclear.' Texas workforce programs, universities, industrial suppliers, and existing energy expertise may reduce some development barriers, while specialized nuclear construction and regulatory skills can still require deliberate investment. The new state office provides a place to track whether coordination produces measurable project progress.",
    "The long-run test of HB 14 is implementation rather than branding. KTR will follow appropriations, office staffing, grants, contracts, reports, project milestones, NRC dockets, interconnection progress, construction decisions, and eventual operating performance. If state money is awarded, readers should be able to see the recipient, purpose, conditions, and outcome. If a project is delayed or canceled, the tracker should preserve that outcome rather than leaving an old announcement as the apparent current status. That evidence standard lets an energy-abundance editorial position remain grounded in real project execution.",
  ],
  watchFor: [
    ...advancedNuclearBase.watchFor,
    "NRC pre-application, application, docketing, licensing, construction, and operating milestones for named Texas projects",
    "State-office reports showing grant recipients, program spending, workforce initiatives, and measurable project-development outcomes",
  ],
};

export const POLICY_TRACKER_WAVE5_UPGRADES: Record<string, PolicyTracker> = {
  [womensSports.slug]: womensSports,
  [campusFreeSpeech.slug]: campusFreeSpeech,
  [advancedNuclear.slug]: advancedNuclear,
};

export const WAVE5_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE5_UPGRADES);

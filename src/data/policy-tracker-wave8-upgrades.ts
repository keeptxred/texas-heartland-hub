import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE8 } from "@/data/policy-trackers-wave8";

function requireWave8Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE8.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave8 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-29";
const regulatoryReformBase = requireWave8Tracker("regulatory-reform-treo");
const careerTechnicalBase = requireWave8Tracker("career-technical-workforce");
const semiconductorBase = requireWave8Tracker("semiconductor-manufacturing");

const regulatoryReformTreo: PolicyTracker = {
  ...regulatoryReformBase,
  updated: reviewed,
  keyFacts: [
    ...regulatoryReformBase.keyFacts,
    "Creating TREO, publishing a portal, recommending a rule change, an agency proposing an amendment, and a final rule becoming effective are separate implementation stages and should be reported separately.",
    "A claimed regulatory-cost reduction should identify the methodology, baseline, affected population, time period, and whether the figure represents recurring savings, one-time savings, avoided costs, or an estimate attached to a proposed change.",
    "Chapter 465 review does not eliminate the ordinary legal authority of each agency; a durable tracker should identify which agency owns a rule, what statutory authority supports it, and what formal action actually changes the requirement.",
  ],
  context: [
    ...regulatoryReformBase.context,
    "Texas regulatory reform is easiest to evaluate when the tracker separates institutional creation from measurable rule changes. SB 14 created TREO and gave the office a statewide review and coordination role, but the existence of a new office does not itself prove that a particular permit became faster, a fee disappeared, or a rule was repealed. KTR will identify the agency, rule or process at issue, the formal vehicle used to change it, and the effective date. That prevents statewide reform branding from being substituted for the legal record that actually controls a regulated business or professional.",
    "Rule inventories and recommendations need the same discipline. An office can identify a rule as duplicative, obsolete, unnecessarily costly, or a candidate for simplification, while the responsible agency may still need notice, public comment, statutory authority, board approval, or another procedure before the change becomes law. A recommendation, proposed rule, adopted rule, repealed rule, and updated guidance document carry different legal weight. The tracker will preserve those stages so readers can tell whether a burden has been removed or is merely under review.",
    "Cost-savings claims should be auditable rather than rhetorical. Regulatory-impact estimates can depend on assumptions about the number of regulated entities, staff hours, capital costs, compliance frequency, discount rates, or the alternative rule that would otherwise apply. KTR will report the source's stated methodology where available and distinguish recurring annual savings from one-time transition savings or avoided future costs. If TREO or an agency publishes an aggregate reduction figure, the tracker should link the underlying report and avoid presenting the headline number as independently verified economic output.",
    "The public portal creates a separate usability test. A centralized website can reduce search costs even when the substantive permit or license requirements remain unchanged. Useful measures include whether users can find the responsible agency, determine required forms, identify fees and deadlines, complete a filing electronically, track status, and understand appeal or correction procedures. KTR will treat navigation improvement as a legitimate administrative outcome while keeping it separate from deregulation, because making an existing rule easier to comply with is not the same as repealing the rule.",
    "Regulatory efficiency also has a public-protection side. Rules can address health, safety, financial integrity, environmental risk, consumer protection, or reliable administration, and the cheapest rule is not automatically the best rule. KTR's editorial preference favors eliminating unnecessary burdens, but the factual test should ask whether a reform preserves the statutory purpose and whether measurable adverse outcomes appear after a change. That means tracking enforcement, complaints, processing times, accidents or other domain-specific indicators where relevant instead of defining success solely by the number of words or rules removed.",
    "The long-run measure of Chapter 465 is institutional follow-through. TREO reports, agency rulemaking dockets, Texas Register notices, final adopted rules, portal changes, cost analyses, and legislative oversight can show whether the program produces durable simplification. The tracker should also preserve cases where a review concludes that a rule remains necessary, because an evidence-based review system can legitimately retain a requirement. This approach makes the page useful to businesses and citizens who need to know what changed today, not merely what state leaders promised to review.",
  ],
  watchFor: [
    ...regulatoryReformBase.watchFor,
    "Texas Register notices and final agency actions that convert TREO recommendations into actual rule amendments or repeals",
    "Published methodologies behind aggregate regulatory-savings claims, including baseline, time period, and recurring versus one-time estimates",
  ],
};

const careerTechnicalWorkforce: PolicyTracker = {
  ...careerTechnicalBase,
  updated: reviewed,
  keyFacts: [
    ...careerTechnicalBase.keyFacts,
    "Program enrollment, course completion, industry credential attainment, postsecondary continuation, employment placement, wages, and employer demand are different outcome measures; no single one should stand in for the entire CTE pipeline.",
    "Regional labor-demand alignment is time-sensitive because occupations, wages, vacancies, technology, and local industry investment change, so the biennial assessment should be treated as a dated planning input rather than a permanent list of favored programs.",
    "A credential can be state-approved or industry-recognized without automatically producing a wage premium; outcome reporting should connect the specific credential to completion, employment, and wage evidence where those data are available.",
  ],
  context: [
    ...careerTechnicalBase.context,
    "Texas CTE policy spans multiple institutions, which makes agency roles important. TEA governs the public-school side, THECB oversees major postsecondary policy functions, and TWC supplies workforce and labor-market functions. HB 120 and SB 1786 connect pieces of that system, but a grant administered by one agency, a high-school program approved by another, and an employer credential recognized in a local labor market are not the same intervention. KTR will identify the responsible institution and funding stream so readers can see where accountability belongs.",
    "The strongest measure of CTE is progression rather than enrollment alone. A student can enroll in a pathway but never complete it, complete coursework without earning a credential, earn a credential without entering the related occupation, or use the program as a bridge to additional education. The tracker will therefore separate participation, completion, credential attainment, dual-credit success, postsecondary enrollment, employment placement, retention, and wages. Enrollment growth is useful evidence of access, but it should not be reported as proof of labor-market success by itself.",
    "Credential quality also varies by occupation and region. An industry credential can signal useful skills, satisfy a legal prerequisite, improve hiring prospects, or have little independent labor-market value depending on employer demand and how the credential is designed. KTR will identify the specific credential or program rather than relying on an aggregate count of credentials earned. Where state data permit, the tracker should compare completion and employment outcomes so policymakers can distinguish pathways that produce durable value from programs that mainly generate activity metrics.",
    "Regional labor-demand assessments create a planning tool, not a command economy. Employers can expand, automate, relocate, or change skill requirements faster than a multi-year education program can adjust. Rural and smaller communities may also need programs that serve local strategic employers even when statewide demand looks modest. KTR will date each labor-market assessment and compare it with actual job openings, wage trends, major project announcements, and program outcomes rather than assuming a statewide occupation ranking fits every region.",
    "Access and cost should be measured alongside outcomes. Rural students may face transportation, instructor, equipment, broadband, and employer-partnership constraints that a metropolitan program does not. Dual-credit and work-based learning can reduce time to a credential, but participation can still depend on local course availability and qualified faculty. The tracker will follow whether funding expands usable seats and pathways, not just whether a new grant program exists on paper. A program that cannot enroll students in the communities it targets has not solved the access problem.",
    "The durable policy question is whether Texas can connect education spending to real opportunity without narrowing students prematurely. Strong CTE can coexist with academic preparation and later postsecondary options. KTR's editorial preference for practical workforce routes does not require treating every student as a fixed labor-market input. The factual page will follow student choice, credential portability, completion, employer demand, earnings, and further education so the state can be judged on whether pathways expand options rather than simply redirect students into programs with attractive labels.",
  ],
  watchFor: [
    ...careerTechnicalBase.watchFor,
    "Program-level evidence connecting state-approved credentials to employment, wage, and postsecondary outcomes rather than enrollment alone",
    "Regional access indicators showing whether rural and smaller districts can offer funded pathways, dual credit, equipment, instructors, and work-based learning",
  ],
};

const semiconductorManufacturing: PolicyTracker = {
  ...semiconductorBase,
  updated: reviewed,
  keyFacts: [
    ...semiconductorBase.keyFacts,
    "A TSIF award, company announcement, executed incentive agreement, construction start, equipment installation, production qualification, and commercial output are distinct milestones; grant announcements should not be counted as completed manufacturing capacity.",
    "Public support should be evaluated against the specific commitments attached to an award, including eligible spending, capital investment, jobs, research or supply-chain objectives, reporting duties, and any clawback or performance provisions disclosed in official records.",
    "Semiconductor projects can create major electricity, water, workforce, transportation, and supplier demands, so state economic-development success should be evaluated alongside the infrastructure required to operate the project reliably.",
  ],
  context: [
    ...semiconductorBase.context,
    "Texas semiconductor policy has moved beyond enabling legislation into project execution, which makes milestone discipline essential. HB 5174 created the statutory institutions and fund, but each company or research award has its own timeline. KTR will distinguish a grant announcement from a signed agreement, site preparation, construction, tool installation, qualification, hiring, and commercial production. This keeps a project on the tracker even if it is delayed, resized, or canceled rather than allowing the original announcement to remain the apparent current status indefinitely.",
    "Incentive accounting should show both sides of the transaction. The public record may identify a grant amount or matching commitment while the recipient promises capital investment, research capacity, jobs, supply-chain expansion, or another public benefit. Those figures should not be mixed. KTR will report state support separately from company investment and will distinguish projected jobs from positions actually created and retained. If an agreement includes performance milestones, reporting requirements, or remedies for nonperformance, those terms are important evidence for judging whether the program protects taxpayers.",
    "Semiconductor manufacturing is not one uniform activity. Leading-edge fabrication, mature-node production, packaging, materials, equipment, design, research, and specialty components can have different capital needs and strategic value. A project that strengthens a Texas supplier or packaging capability should not be described as equivalent to building a new high-volume fabrication plant. The tracker will identify what the facility or award actually does and where it sits in the supply chain, which makes statewide capacity claims more meaningful.",
    "Infrastructure can determine whether announced capacity becomes reliable output. Large semiconductor facilities may require substantial electric service, water treatment and supply, transportation access, specialized construction, clean-room systems, and a deep technical workforce. KTR will cross-link ERCOT and workforce policy where those constraints matter and will distinguish infrastructure commitments from finished capacity. An economic-development award can be justified in part by strategic supply-chain goals, but it still has to operate within local resource and permitting realities.",
    "Federal policy is another layer rather than a substitute for the Texas program. A company can receive or pursue federal semiconductor support while also qualifying for Texas incentives, and export controls or national-security rules can affect market strategy and equipment access. KTR will identify which government supplied each incentive and avoid adding federal and state figures together as though they were one program. When a company changes a project after a federal decision, the tracker should show the causal evidence rather than assuming every schedule change comes from government policy.",
    "The durable test is delivered strategic capacity per public dollar. Useful evidence includes executed awards, private capital actually invested, facilities completed, production started, workers hired, research milestones, suppliers added, and any state recovery of funds after missed obligations. KTR's editorial support for domestic manufacturing can coexist with scrutiny of targeted corporate incentives. That combination makes the tracker useful in the conservative debate over whether a specific subsidy produced a strategic capability Texas could not have obtained as efficiently through broader tax, regulatory, infrastructure, or workforce policy.",
  ],
  watchFor: [
    ...semiconductorBase.watchFor,
    "Award agreements and project updates that distinguish announced private investment and jobs from capital actually deployed and positions actually created",
    "Infrastructure and production milestones showing whether funded projects obtain power, water, workforce, equipment, qualification, and commercial output on schedule",
  ],
};

export const POLICY_TRACKER_WAVE8_UPGRADES: Record<string, PolicyTracker> = {
  [regulatoryReformTreo.slug]: regulatoryReformTreo,
  [careerTechnicalWorkforce.slug]: careerTechnicalWorkforce,
  [semiconductorManufacturing.slug]: semiconductorManufacturing,
};

export const WAVE8_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE8_UPGRADES);

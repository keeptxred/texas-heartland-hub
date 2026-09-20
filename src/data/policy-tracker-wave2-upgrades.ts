import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE2 } from "@/data/policy-trackers-wave2";

function requireWave2Tracker(slug: string): PolicyTracker {
  const tracker = POLICY_TRACKERS_WAVE2.find((item) => item.slug === slug);
  if (!tracker) throw new Error(`Missing wave2 policy tracker: ${slug}`);
  return tracker;
}

const reviewed = "2026-08-27";

const parentalRightsBase = requireWave2Tracker("parental-rights");
const electionIntegrityBase = requireWave2Tracker("election-integrity");
const bitcoinReserveBase = requireWave2Tracker("bitcoin-reserve");
const cbdcBase = requireWave2Tracker("central-bank-digital-currency");

const parentalRights: PolicyTracker = {
  ...parentalRightsBase,
  updated: reviewed,
  keyFacts: [
    ...parentalRightsBase.keyFacts,
    "A constitutional parental-rights provision and an Education Code requirement answer different questions. The constitution supplies a higher-level legal protection; statutes, agency rules, district procedures, and court decisions determine how particular school disputes are handled in practice.",
    "A school-policy dispute should identify the specific decision at issue—records, instruction, health-related services, consent, clubs, curriculum, grievance procedures, or another subject—because the governing rule and available remedy can differ by topic.",
    "Local school boards retain governance responsibilities, but district policies operate within state constitutional and statutory limits and any applicable federal requirements. A local policy is not a substitute for checking the controlling law.",
  ],
  context: [
    ...parentalRightsBase.context,
    "The 2025 constitutional amendment is best understood as a durable legal framework, not as a self-executing answer to every disagreement between a family and a school. Constitutional text can influence how courts evaluate government action, but day-to-day disputes usually begin with a more specific rule: an Education Code provision, a Texas Education Agency requirement, a district policy, a student-records rule, a consent provision, or a grievance process. KTR therefore links a broad parental-rights principle to the narrower legal authority that controls the particular decision instead of presenting the amendment as an unlimited veto over every school action.",
    "Implementation matters because Texas has more than a thousand school systems with their own boards, administrators, handbooks, forms, and complaint procedures. State law can create a right to information or notice while leaving districts responsible for the operational process used to deliver it. That means two useful questions often come before the political argument: what did state law require on the date of the dispute, and what procedure did the local district actually use? Board agendas, adopted policies, parent handbooks, notices, and grievance records can be as important as a statewide press release when testing whether a requirement was followed.",
    "Parental rights also overlap with other legal systems. Student records, disability services, child-protection duties, health and safety rules, court orders, and federal education requirements can affect what a school may disclose or must do. The existence of those overlapping duties does not erase parental authority, but it does make precise sourcing essential. KTR will distinguish a genuine conflict of laws from a situation in which different rules govern different parts of the same event. Readers should be able to see whether a claim comes from the Texas Constitution, the Education Code, agency guidance, local policy, or federal law.",
    "The 2025 education legislation added another reason to preserve dates and versions. Major school-policy bills can contain separate effective dates, agency implementation tasks, forms, training requirements, and local compliance deadlines. A headline saying a parental-rights measure 'passed' is only the first step. The tracker should show when the relevant provision became effective, whether TEA issued implementation guidance, whether a district had to adopt or revise a policy, and whether litigation or later legislation changed the operative rule. That chronology keeps campaign rhetoric from being mistaken for the current legal requirement.",
    "KTR's editorial preference for strong parental authority does not change the evidence standard used on this page. Claims of noncompliance should be tied to the exact text and a documented action by the responsible school system. Likewise, a district should not be treated as compliant merely because it invokes a broad policy goal. The useful record is concrete: the notice sent, the consent requested, the material provided, the policy adopted, the grievance decided, and the statutory provision governing each step. This makes the tracker useful to parents who agree with KTR and to readers who simply want to verify what Texas law requires.",
    "The durable measure of this policy is whether legal rights become usable in ordinary interactions. A right that exists only in abstract constitutional language is less useful than one paired with clear notice, accessible records, understandable consent procedures, meaningful review, and enforceable remedies. KTR will therefore watch not only new legislation but implementation evidence: TEA guidance, district policy revisions, court interpretations, complaint patterns, and any official material that clarifies how families can exercise a right without having to infer the process from political messaging.",
  ],
  watchFor: [
    ...parentalRightsBase.watchFor,
    "Court opinions distinguishing the constitutional parental-rights provision from more specific statutory or federal school obligations",
    "State or district forms, training, grievance procedures, and policy revisions that determine whether new rights are usable in practice",
  ],
  sources: [
    ...parentalRightsBase.sources,
    { label: "Texas Secretary of State — 2025 constitutional amendment explanatory statements", url: "https://www.sos.state.tx.us/elections/forms/2025-explanatory-statements.pdf", primary: true },
  ],
};

const electionIntegrity: PolicyTracker = {
  ...electionIntegrityBase,
  updated: reviewed,
  keyFacts: [
    ...electionIntegrityBase.keyFacts,
    "The citizenship amendment addresses voter eligibility, while registration maintenance, identification, voting methods, ballot handling, tabulation, canvassing, audits, recounts, and election contests remain separate processes governed by their own statutes and procedures.",
    "Texas counties administer many election functions under state law, while the Secretary of State provides statewide guidance, maintains statewide systems, and performs duties assigned by the Election Code. A local administrative error and a statewide policy dispute are not automatically the same issue.",
    "Federal law can constrain the timing and method of systematic voter-list maintenance before federal elections, so a claim that an ineligible record should have been removed immediately must still be tested against the applicable state and federal procedure.",
  ],
  context: [
    ...electionIntegrityBase.context,
    "Election integrity is strongest as a reporting category when each allegation is assigned to the correct stage of the election system. Eligibility asks who may vote. Registration asks whether an eligible person is properly entered on the rolls. Identification concerns what a voter must present or complete. Mail voting adds application, carrier-envelope, signature, assistance, cure, and deadline rules. Tabulation, canvassing, audits, recounts, and election contests occur later and answer different questions. Combining all of those stages into a single claim about a 'ballot' can make both genuine problems and ordinary administrative events harder to evaluate.",
    "The 2025 citizenship amendment reinforces a constitutional eligibility rule but does not by itself describe every administrative step used to verify or maintain voter records. The Election Code assigns procedures to registrars and election officials, while federal law can impose timing and notice constraints. KTR will therefore distinguish the legal standard—citizenship is required—from the evidence and process used to act on a particular registration record. Official notices, responses, database records, cancellation reports, and court orders are more probative than an unsupported claim that a name appearing in a data match proves an illegal vote occurred.",
    "List maintenance deserves especially careful language because records can represent different statuses. A registration record flagged for review, a notice mailed by a registrar, a cancellation after statutory procedure, and an actual ballot cast are four different events. Texas Secretary of State reporting can show how many registrations were canceled under a defined procedure, but that number should not be converted into a claim about fraudulent ballots without separate evidence. KTR will preserve the official category and reporting period instead of multiplying a politically useful number into a broader allegation the source does not establish.",
    "Audits, recounts, and election contests also serve different purposes. A post-election audit tests defined procedures or tabulation samples under law. A recount re-tabulates votes according to the applicable recount process. An election contest is litigation with pleadings, evidence, legal standards, and judicial remedies. None of those mechanisms is interchangeable with an unofficial social-media review of precinct data. When a dispute reaches one of these formal processes, the tracker should identify the county or office involved, the legal authority, the scope of review, and the final official result.",
    "Texas election administration is decentralized enough that statewide conclusions require care. Counties can use different equipment configurations, staffing models, polling-place arrangements, and local procedures while remaining subject to statewide law and certification requirements. That makes county records essential when a story concerns a specific polling location or local count. Conversely, a Secretary of State advisory or statewide statutory change can affect every county. KTR will identify which layer controls the disputed action so readers do not blame a county for a state mandate or treat one county's mistake as proof of a statewide condition.",
    "Secure elections and transparent elections reinforce each other when records are available in forms readers can test. KTR will favor canvassed totals, official audit reports, voter-registration reports, statutory text, court filings, and documented chain-of-custody or ballot procedures over anonymous claims. The editorial goal is confidence grounded in evidence rather than confidence demanded by authority. That means legitimate defects should be reported precisely and corrected, while claims that exceed the available record should remain labeled as allegations until an official record or verifiable evidence supports them.",
  ],
  watchFor: [
    ...electionIntegrityBase.watchFor,
    "Secretary of State reports on citizenship-related registration review, cancellations, audits, and election administration",
    "Court rulings or federal guidance affecting the timing, notice, or evidentiary requirements for voter-list maintenance",
  ],
  sources: [
    ...electionIntegrityBase.sources,
    { label: "Texas Secretary of State — 2025 voter-registration cancellations relating to non-U.S. citizenship", url: "https://www.sos.state.tx.us/elections/laws/report-tx-leg-tx-elec-code-relating-voter-reg-cancellations-due-non-us-citizenship.shtml", primary: true },
    { label: "Texas Secretary of State — 2025 constitutional amendment explanatory statements", url: "https://www.sos.state.tx.us/elections/forms/2025-explanatory-statements.pdf", primary: true },
  ],
};

const bitcoinReserve: PolicyTracker = {
  ...bitcoinReserveBase,
  updated: reviewed,
  keyFacts: [
    ...bitcoinReserveBase.keyFacts,
    "Creating the statutory reserve and placing assets into the reserve are separate events. The existence of Government Code authority should not be reported as proof that a particular appropriation, purchase, donation, or holding occurred unless an official record documents it.",
    "SB 21 provides for an advisory committee, custody and management authority, audits, and biennial reporting. Those governance records are central to evaluating implementation after the enabling law took effect.",
    "The Legislative Budget Board stated during the 2025 process that the fiscal implications could not be determined because the amount and value of qualifying cryptocurrency that might be deposited were indeterminate.",
  ],
  context: [
    ...bitcoinReserveBase.context,
    "The first discipline for covering the reserve is to separate authorization from balance-sheet reality. SB 21 establishes a legal vehicle and gives the Comptroller powers to administer it, but the statute does not by itself tell readers how much cash has been appropriated, which assets have actually been acquired, their purchase price, the custody arrangement, or the current market value. Those are implementation facts that must come from appropriations, Comptroller reports, contracts, audited statements, or other official records. KTR will not convert the phrase 'Texas created a Bitcoin reserve' into an unsupported claim that Texas holds a particular quantity of bitcoin.",
    "Asset eligibility is another place where shorthand can mislead. The law is branded around bitcoin, but the enrolled text describes a statutory framework for qualifying cryptocurrency and sets conditions for reserve investments. Readers should therefore distinguish bitcoin—the named and politically salient asset—from the broader investment authority written into law. If eligibility thresholds, market capitalization, custody standards, or investment rules change, the tracker should quote or summarize the current statutory requirement and identify which official decision actually changed it.",
    "Custody and operational security are public-finance questions, not merely cryptocurrency-technology questions. Private keys can be lost or compromised; third-party custodians can create counterparty and operational risk; market liquidity can change; and valuation can move sharply between reporting dates. SB 21 gives the Comptroller authority to use qualified custodians and other management tools, so KTR will follow procurement, custody standards, audit findings, insurance or risk controls when publicly available, and the separation of duties used to protect public assets. Political support for bitcoin is not a substitute for ordinary treasury controls.",
    "Performance should be measured against a documented cost basis and time period. A reserve can show a large unrealized gain after a market rally or a large paper loss after a decline without either figure alone proving the policy succeeded or failed. Useful reporting identifies assets, acquisition dates or accounting basis where disclosed, administrative costs, realized versus unrealized results, and any benchmark the state itself uses. It should also distinguish assets donated to the reserve from assets purchased with appropriated public money because the taxpayer exposure and opportunity cost can differ.",
    "The reserve sits outside the state treasury as a special fund, but that phrase should not be read as 'outside government oversight.' The enabling law assigns administration to the Comptroller and includes reporting, advisory, audit, and management provisions. Legislative appropriations and later statutory amendments remain important because lawmakers can change the amount of public money exposed to the strategy or modify the rules. KTR will use those institutional records to evaluate governance instead of treating a cryptocurrency wallet address or market rumor as sufficient evidence of official state ownership.",
    "The policy debate ultimately has two dimensions that can be evaluated separately. Supporters argue that scarce digital assets can diversify or strengthen long-term state finances and signal Texas support for cryptocurrency innovation. Critics can question volatility, opportunity cost, custody risk, or whether a state government should speculate in such assets. The tracker does not need to resolve that philosophical argument to be useful. It can make the debate measurable by showing what the Legislature authorized, what the Comptroller actually did, what taxpayers funded, how the assets performed, and what independent audits reported.",
  ],
  watchFor: [
    ...bitcoinReserveBase.watchFor,
    "Biennial reserve reports, advisory-committee records, audits, custody contracts, and official disclosures of actual holdings",
    "Appropriations or asset transfers that change taxpayer exposure separately from market-value changes in existing holdings",
  ],
  sources: [
    ...bitcoinReserveBase.sources,
    { label: "Texas Legislature Online — SB 21 enrolled bill summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=SB21&LegSess=89R", primary: true },
    { label: "Legislative Budget Board — SB 21 conference committee fiscal note", url: "https://capitol.texas.gov/tlodocs/89R/fiscalnotes/html/SB00021C.htm", primary: true },
  ],
};

const centralBankDigitalCurrency: PolicyTracker = {
  ...cbdcBase,
  updated: reviewed,
  keyFacts: [
    ...cbdcBase.keyFacts,
    "The Federal Reserve states that it has made no decision to issue a U.S. central bank digital currency and would only proceed with issuance with authorizing law. That federal status is separate from Texas's political opposition expressed through SCR 8.",
    "FedNow is an interbank instant-payment service, not a central bank digital currency. Treating FedNow, a retail CBDC, commercial-bank deposits, stablecoins, and decentralized cryptocurrency as interchangeable obscures the policy choices Texas is debating.",
    "A concurrent resolution records the Legislature's position but does not amend the Federal Reserve Act, create a Texas criminal prohibition, or independently bind Congress or the Federal Reserve.",
  ],
  context: [
    ...cbdcBase.context,
    "The most important distinction on this page is between a political position and operative law. SCR 8 is meaningful evidence of the Texas Legislature's opposition to a federal CBDC, but it is a concurrent resolution rather than a statute that rewrites federal monetary authority. KTR will describe it as an official state legislative position and then separately track any Texas bill that creates an enforceable rule for state agencies, state funds, contracts, payment acceptance, privacy, or financial institutions. That separation prevents readers from being told Texas has legally 'banned' something when the cited document only expresses opposition.",
    "Federal status must be sourced independently because Texas does not control whether Congress authorizes a Federal Reserve retail CBDC. The Federal Reserve's public material says it has made no decision to issue one and that issuance would require authorizing law. If that federal position changes, an old Texas resolution will not be enough to describe the new legal environment. KTR will therefore pair Texas legislative records with current Federal Reserve and congressional sources instead of using state political rhetoric as a proxy for federal policy.",
    "Payment terminology is another recurring source of misinformation. FedNow moves payments between participating financial institutions; it is not a new form of retail currency and does not give the Federal Reserve direct access to a person's bank account. Commercial-bank deposits are private-bank liabilities. Stablecoins are privately issued digital assets designed to maintain a reference value. Bitcoin is a decentralized cryptocurrency. A hypothetical retail CBDC would be a central-bank liability available in digital form. Readers need those distinctions before they can evaluate privacy, surveillance, competition, or financial-stability claims.",
    "Privacy concerns can also depend on design rather than the label alone. A system could vary in whether it uses intermediaries, what identity checks apply, which transaction records are retained, what legal process is required for government access, and whether offline or low-value transactions receive different treatment. Opponents can reasonably focus on the risk of centralized transaction visibility, but a factual tracker should identify the actual proposed architecture before asserting what officials could see or control. The Federal Reserve's research materials are useful precisely because they distinguish design questions from a final issuance decision.",
    "Texas still has policy levers even though monetary issuance is federal. State lawmakers can debate whether agencies may accept a hypothetical CBDC, how state contracts treat digital payments, whether state law protects the use of cash or decentralized assets, how state-chartered entities are regulated within federal limits, and how public funds may hold digital assets. Each lever needs its own statute or constitutional authority. KTR will track concrete Texas measures as they are filed or enacted instead of assuming SCR 8 automatically creates all of those restrictions.",
    "The durable reporting test is simple: identify what exists today, what has merely been proposed, and which government has authority over each decision. Today a Texas resolution opposing CBDC, federal research, ordinary electronic bank money, FedNow, stablecoins, and cryptocurrency can all appear in the same political conversation even though they are legally and technically different. Keeping those categories separate makes the conservative privacy argument more credible because it directs criticism at an actual policy proposal rather than a mislabeled payment technology.",
  ],
  watchFor: [
    ...cbdcBase.watchFor,
    "Federal legislation or Federal Reserve announcements that change the current no-issuance-decision status",
    "Texas bills that create enforceable agency, contracting, privacy, cash, or digital-asset rules beyond the Legislature's SCR 8 policy statement",
  ],
  sources: [
    ...cbdcBase.sources,
    { label: "Federal Reserve — Central Bank Digital Currency", url: "https://www.federalreserve.gov/newsevents/central-bank-digital-currency.htm", primary: true },
    { label: "Federal Reserve — FedNow is not a central bank digital currency", url: "https://www.federalreserve.gov/faqs/is-fednow-replacing-cash-is-it-a-central-bank-digital-currency.htm", primary: true },
  ],
};

export const POLICY_TRACKER_WAVE2_UPGRADES: Record<string, PolicyTracker> = {
  [parentalRights.slug]: parentalRights,
  [electionIntegrity.slug]: electionIntegrity,
  [bitcoinReserve.slug]: bitcoinReserve,
  [centralBankDigitalCurrency.slug]: centralBankDigitalCurrency,
};

export const WAVE2_INDEXABLE_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE2_UPGRADES);

import type { TexasDataSet } from "@/data/texas-data-catalog";

const updated = "2026-08-19";

export const ACCOUNTABILITY_DATA_SETS: TexasDataSet[] = [
  {
    slug: "contracts",
    title: "Texas Contract Watch",
    dek: "Official Texas contract, procurement, bid, and vendor-performance sources for tracking how state agencies award and manage public contracts.",
    updated,
    quickAnswer: "Start with the Legislative Budget Board contracts database for reported state contracts, then use Comptroller procurement and vendor-performance records plus DIR for statewide technology contracts. Contract value is not the same as money actually paid, and a large award is not evidence of wrongdoing by itself.",
    whatAvailable: [
      "Awarded state contracts reported to the Legislative Budget Board",
      "Contract and solicitation documents where agencies provide them",
      "Statewide procurement contracts and bid opportunities",
      "Vendor performance reports and grades",
      "Statewide information-technology contracts",
    ],
    methodology: [
      "The LBB's current 2026–27 reporting framework says contracts greater than $50,000 are generally reportable within 30 calendar days of award. Verify the current rule and any applicable exception before treating a missing record as a reporting failure.",
      "Separate awarded contract value from actual expenditures, invoices, amendments, renewals, and final payments. They answer different questions.",
      "For large-contract reporting, verify whether the procurement was competitive or noncompetitive and whether amendment, attestation, emergency, or vendor-performance requirements apply.",
      "Use contract records as leads for accountability reporting, not as proof of misconduct. Corroborate concerns with performance records, amendments, audit findings, payment data, agency explanations, or other primary evidence.",
    ],
    useCases: [
      "Track major awards and contract amendments by agency and vendor",
      "Connect procurement stories to state spending and agency authority",
      "Identify repeat vendors and vendor-performance concerns for further reporting",
      "Follow major solicitations before an award is finalized",
    ],
    sources: [
      { label: "LBB Contracts Database", url: "https://contracts.lbb.texas.gov/", publisher: "Texas Legislative Budget Board", scope: "Reported state contracts searchable by agency, vendor, subject, award date, contract ID, and related documents" },
      { label: "LBB Contract Reporting and Oversight", url: "https://www.lbb.texas.gov/Contract_Reporting.aspx", publisher: "Texas Legislative Budget Board", scope: "Current reporting thresholds, amendment notices, oversight requirements, and contract reporting guidance" },
      { label: "Texas Comptroller Contracts Open Data", url: "https://comptroller.texas.gov/transparency/open-data/contracts.php", publisher: "Texas Comptroller", scope: "State contract-source directory, statewide procurement records, and contract transparency resources" },
      { label: "Vendor Performance Tracking System", url: "https://comptroller.texas.gov/purchasing/programs/vendor-performance-tracking/", publisher: "Texas Comptroller", scope: "Vendor performance reporting requirements, grades, and published performance records" },
      { label: "Electronic State Business Daily", url: "https://esbd.cpa.state.tx.us/", publisher: "Texas Comptroller", scope: "State and local procurement notices and bid opportunities" },
      { label: "DIR Contract Search", url: "https://dir.texas.gov/contracts", publisher: "Texas Department of Information Resources", scope: "Statewide technology contracts, products, services, and vendors" },
    ],
    related: [
      { label: "Texas State Budget and Spending Data", href: "/data/state-budget-spending" },
      { label: "Texas Government", href: "/texas-government" },
      { label: "Texas Legislature", href: "/texas-legislature" },
    ],
  },
  {
    slug: "rules",
    title: "Texas Rule Watch",
    dek: "Official Texas Register and Administrative Code sources for tracking proposed, adopted, emergency, withdrawn, and reviewed state agency rules.",
    updated,
    quickAnswer: "The Texas Register is the weekly record of Texas agency rulemaking and notices; the Texas Administrative Code is the current compilation of adopted agency rules. A proposal is not a final rule, and the promulgating agency—not the Secretary of State—is the controlling source for interpretation and enforcement questions.",
    whatAvailable: [
      "Proposed agency rules and public-comment instructions",
      "Adopted rules and stated effective dates",
      "Emergency and withdrawn rule notices",
      "Agency rule reviews and related notices",
      "Current codified Texas Administrative Code text",
    ],
    methodology: [
      "Classify every item by lifecycle stage before reporting it. Proposed, adopted, emergency, withdrawn, and rule-review notices have different legal significance.",
      "For proposed rules, verify the agency, TAC citation, statutory authority, fiscal or public-benefit analysis, and the comment instructions and deadline stated in the actual notice.",
      "For adopted rules, compare the final text with the proposal, note the effective date, and review the agency's responses to comments where published.",
      "Do not infer that every proposal becomes final or that a rule applies immediately. Use the Register notice, current TAC, and promulgating agency records together when timing or applicability matters.",
    ],
    useCases: [
      "Catch consequential agency policy changes before they become final",
      "Connect rulemaking to the statute that grants the agency authority",
      "Track costs, regulated parties, comment periods, and effective dates",
      "Link agency actions to lawmakers, policy trackers, and later enforcement stories",
    ],
    sources: [
      { label: "Texas Register", url: "https://www.sos.state.tx.us/texreg/index.shtml", publisher: "Texas Secretary of State", scope: "Weekly state agency rulemaking, notices, proposed and adopted rules, withdrawals, emergency rules, and rule reviews" },
      { label: "Texas Administrative Code", url: "https://www.sos.state.tx.us/tac/index.shtml", publisher: "Texas Secretary of State", scope: "Current codified Texas state agency rules" },
      { label: "Search the Texas Register", url: "https://texreg.sos.state.tx.us/public/regviewctx.search", publisher: "Texas Secretary of State", scope: "Searchable Texas Register material from January 28, 2000 forward" },
      { label: "Texas Register Back Issues", url: "https://www.sos.state.tx.us/texreg/backview/index.shtml", publisher: "Texas Secretary of State", scope: "Historical Register issues for reconstructing a rule's lifecycle" },
    ],
    related: [
      { label: "Texas Agency Authority", href: "/texas-government/agencies" },
      { label: "Texas Law Library", href: "/laws/topics" },
      { label: "Texas Legislature", href: "/texas-legislature" },
    ],
  },
  {
    slug: "border-security",
    title: "Texas Border Security Spending Data",
    dek: "A permanent, primary-source map of Texas border-security appropriations, agency funding, reported expenditures, reimbursement treatment, and the accounting distinctions needed to track Operation Lone Star and related state programs without confusing budget authority with cash already spent.",
    updated: "2026-09-06",
    quickAnswer: "The 2026–27 General Appropriations Act identifies about $3.3517 billion in border-security funding across 13 Texas agencies, down from the $6.5717 billion budgeted for 2024–25. Those figures are appropriations, not a running cash-spending total; agencies report actual border-security expenditures to the Legislative Budget Board separately, and any federal reimbursement must be tracked as a distinct receipt rather than silently netted against state appropriations.",
    whatAvailable: [
      "The complete Article IX list of 13 agencies receiving identified border-security funding in the 2026–27 General Appropriations Act and the corresponding 2024–25 agency amounts for a like-form comparison.",
      "The current biennial totals for Texas Military Department, Department of Public Safety, Trusteed Programs within the Office of the Governor, courts, corrections, health, parks, motor vehicles, and other participating agencies.",
      "Legislative Budget Board reporting requirements that require agencies to identify expended amounts, methods of finance, objects of expense, performance indicators, and whether activity occurred in border or non-border regions.",
      "Historical LBB comparisons between headline appropriations and agency-reported expenditures, useful for showing why an appropriation total and a reported expenditure total may not reconcile one-for-one.",
      "Comptroller revenue-certification treatment for possible federal reimbursement of Texas border-security costs, including the distinction between a request, an award, a receivable, and cash actually received by the state.",
      "Downloadable KTR-derived tables that preserve the official agency figures and source labels while making biennial comparisons easier to audit and reuse.",
    ],
    methodology: [
      "Start with the enacted General Appropriations Act when describing current border-security budget authority. Article IX, Section 7.10 provides the statewide informational total and the agency-by-agency amounts. Those amounts identify money appropriated elsewhere in the Act for activities meeting the Legislature's border-security definition. They do not, by themselves, prove that the entire amount has been obligated, encumbered, invoiced, paid, or consumed during the biennium. KTR therefore labels these values as appropriations or budgeted amounts and reserves the word 'spent' for expenditure records that actually support that description.",
      "Treat agency expenditure reports as a separate accounting layer. Article IX requires participating agencies to report expended amounts and performance indicators to the Legislative Budget Board for reporting periods ending February 28 and August 31. The reports must include object of expense and method of finance and can distinguish border-region activity, non-border activity, headquarters support, grants, interagency arrangements, and other implementation details. A useful accountability comparison should preserve those categories instead of subtracting one statewide headline from another and calling the difference waste or savings.",
      "Use the 2024–25 and 2026–27 Article IX tables for the cleanest agency-level biennial comparison because both are legislative budget tables built around the same border-security reporting concept. Even then, read the footnotes and riders. Supplemental bills, transfers, unexpended-balance authority, one-time construction costs, interagency contracts, and amounts carried from a prior fiscal year can change what an agency has available without changing the meaning of every other row. The KTR table therefore presents the enacted totals but links readers back to the controlling GAA documents for the legal detail.",
      "Keep Operation Lone Star narrower than the full Article IX total when a story requires that distinction. Texas border-security appropriations can support National Guard deployment, DPS operations, local grants, prosecution, courts, corrections, public health, game warden activity, motor-vehicle programs, anti-gang work, barriers, processing facilities, and other activities that meet the statutory or rider definition. Some are directly associated with Operation Lone Star and some are broader border-security functions. KTR should name the program, agency, rider, or strategy rather than using 'Operation Lone Star' as an automatic synonym for every dollar in the statewide table.",
      "Separate state appropriations from federal reimbursement. The Comptroller's 2026–27 Certification Revenue Estimate explicitly did not include possible federal reimbursement for state border-security costs because the amount and timing were uncertain. A reimbursement request or political announcement is not the same as an award, and an award is not necessarily the same as cash received in a particular fiscal period. KTR should add federal reimbursement to the record when official federal or state accounting shows it, identify the fiscal treatment, and avoid retroactively rewriting historical appropriations as though Texas never financed the original costs.",
      "Do not assume an agency-reported expenditure greater than the headline appropriation is automatically an overrun. LBB's historical reporting materials explain that reported expenditures can include funds not identified in the headline border-security appropriation, pass-through grants, interagency arrangements, prior-period timing, or other financing distinctions. The 2020–21 LBB comparison is useful precisely because it demonstrates this accounting problem: the statewide reported expenditure figure exceeded the listed appropriation, and the accompanying notes explain why a superficial percentage comparison can mislead.",
      "When comparing biennia, distinguish recurring operating support from one-time items. Border barriers, facilities, equipment purchases, vehicle fleets, construction, and special grants can create large temporary changes even when ongoing staffing or operational policies continue. The 2026–27 Fiscal Size-Up is the preferred interpretive companion to the GAA because LBB explains the major policy and financing drivers behind the agency totals instead of leaving the reader with a raw percentage change alone.",
      "For accountability reporting, connect a disputed number to the government entity that controls it. TMD deployment costs should be checked against TMD and LBB records; DPS overtime or equipment should be checked against DPS appropriations and expenditure reports; Governor trusteed grants should be traced through the applicable grant program and award records; wall or barrier spending should be tied to the responsible program and contracts. A statewide total is a map for investigation, not evidence about the performance of a particular vendor, grant recipient, officer, soldier, county, or project.",
    ],
    useCases: [
      "Compare the 2024–25 and 2026–27 border-security budgets by agency and identify where the Legislature increased, reduced, or maintained funding without mislabeling appropriations as expenditures.",
      "Track semiannual agency expenditure reports against the enacted appropriation table and surface meaningful differences in method of finance, object of expense, geographic region, or program performance.",
      "Connect border-security spending stories to Texas Military Department, DPS, Governor grant programs, courts, corrections, and other permanent government authority pages so news strengthens durable KTR infrastructure.",
      "Evaluate reimbursement announcements by distinguishing requested federal repayment, approved reimbursement, accounting recognition, and cash received, then show what the reimbursement actually changes in state finances.",
      "Support reporting on border walls, barriers, local grants, prosecution, detention, National Guard deployment, trooper operations, and related programs with a consistent primary-source budget baseline.",
      "Create future charts and downloadable datasets that add agency-reported actual expenditures as new reporting periods become available while retaining the original appropriation and source date for auditability.",
    ],
    sources: [
      { label: "2026–27 General Appropriations Act — Article IX Border Security", url: "https://www.lbb.texas.gov/Documents/GAA/General_Appropriations_Act_2026_2027.pdf", publisher: "Texas Legislative Budget Board", scope: "Controlling current biennial border-security appropriation table, 13-agency funding list, statutory reporting definition, expenditure-reporting schedule, methods-of-finance requirements, and performance-reporting requirements." },
      { label: "Fiscal Size-Up 2026–27 Biennium", url: "https://lbb.texas.gov/Documents/Publications/Fiscal_SizeUp/9046_Fiscal_Size-up_26-27_Biennium.pdf", publisher: "Texas Legislative Budget Board", scope: "LBB explanation of the $3.3517 billion current border-security budget, concentration at TMD and DPS, Governor trusteed funding, and major policy purposes behind the enacted amounts." },
      { label: "2024–25 General Appropriations Act — Article IX Border Security", url: "https://www.lbb.texas.gov/Documents/GAA/General_Appropriations_Act_2024_2025.pdf", publisher: "Texas Legislative Budget Board", scope: "Prior-biennium 13-agency border-security table and $6.5717 billion budgeted baseline used for the like-form historical comparison." },
      { label: "Texas Border Security Reporting", url: "https://www.lbb.texas.gov/Documents/Publications/Presentation/Texas_Border_Security_Reporting.pdf", publisher: "Texas Legislative Budget Board", scope: "Historical appropriation-versus-agency-reported expenditure comparison and notes demonstrating why reported expenditures can differ from the headline appropriation." },
      { label: "2026–27 Certification Revenue Estimate", url: "https://comptroller.texas.gov/transparency/reports/certification-revenue-estimate/2026-27/", publisher: "Texas Comptroller", scope: "Certified state revenue context, including the Comptroller's explicit treatment of uncertain federal reimbursement for Texas border-security-related costs." },
    ],
    related: [
      { label: "Border Security Policy Tracker", href: "/policy/border-security" },
      { label: "Texas State Budget and Spending Data", href: "/data/state-budget-spending" },
      { label: "Texas Military Department", href: "/texas-government/texas-military-department" },
      { label: "Texas Department of Public Safety", href: "/texas-government/department-of-public-safety" },
    ],
  },
];

export function getAccountabilityDataSet(slug: string): TexasDataSet | undefined {
  return ACCOUNTABILITY_DATA_SETS.find((dataset) => dataset.slug === slug);
}
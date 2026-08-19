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
];

export function getAccountabilityDataSet(slug: string): TexasDataSet | undefined {
  return ACCOUNTABILITY_DATA_SETS.find((dataset) => dataset.slug === slug);
}

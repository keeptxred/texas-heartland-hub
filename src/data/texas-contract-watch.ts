export type ContractWatchTool = {
  label: string;
  url: string;
  publisher: string;
  purpose: string;
  searchBy: string[];
};

export type ContractWatchRule = {
  label: string;
  threshold: string;
  detail: string;
  sourceUrl: string;
};

export const CONTRACT_WATCH_REVIEWED_AT = "2026-08-19";

export const CONTRACT_WATCH_TOOLS: ContractWatchTool[] = [
  {
    label: "LBB Contracts Database Search Tool",
    url: "https://contracts.lbb.texas.gov/",
    publisher: "Texas Legislative Budget Board",
    purpose: "Search reported awarded state contracts and open agency-provided contract documents.",
    searchBy: ["Agency", "Vendor", "Subject", "Award date", "Contract ID"],
  },
  {
    label: "LBB Contract Reporting and Oversight",
    url: "https://www.lbb.texas.gov/Contract_Reporting.aspx",
    publisher: "Texas Legislative Budget Board",
    purpose: "Review reporting thresholds, amendment notices, oversight reports, and current General Appropriations Act contract requirements.",
    searchBy: ["Reporting rules", "10% amendments", "Oversight reports", "Long-running contracts"],
  },
  {
    label: "Texas Comptroller Contracts Open Data",
    url: "https://comptroller.texas.gov/transparency/open-data/contracts.php",
    publisher: "Texas Comptroller",
    purpose: "Use the state's contract-source map for LBB-reported contracts, statewide procurement contracts, DIR technology contracts, and Comptroller public contract listings.",
    searchBy: ["Statewide contracts", "DIR contracts", "Comptroller contracts", "Open-data sources"],
  },
  {
    label: "Search Statewide Contracts",
    url: "https://comptroller.texas.gov/purchasing/contracts/search.php",
    publisher: "Texas Comptroller — Statewide Procurement Division",
    purpose: "Search or browse statewide non-IT commodity and service contracts used by Texas agencies and other eligible government entities.",
    searchBy: ["Commodity", "Service", "Contract", "Vendor"],
  },
  {
    label: "Vendor Performance Tracking System",
    url: "https://comptroller.texas.gov/purchasing/programs/vendor-performance-tracking/",
    publisher: "Texas Comptroller — Statewide Procurement Division",
    purpose: "Investigate published vendor performance reports and the state's A–F vendor performance framework.",
    searchBy: ["Vendor performance", "Grades", "Agency reports", "Contract performance"],
  },
  {
    label: "Electronic State Business Daily",
    url: "https://esbd.cpa.state.tx.us/",
    publisher: "Texas Comptroller",
    purpose: "Search state and local bid opportunities and procurement notices before contracts are awarded.",
    searchBy: ["Agency", "Bid opportunity", "Solicitation", "Commodity or service"],
  },
  {
    label: "DIR IT Contract Search",
    url: "https://dir.texas.gov/contracts",
    publisher: "Texas Department of Information Resources",
    purpose: "Search statewide contracts and vendors for technology products and services.",
    searchBy: ["IT contract", "Vendor", "Product", "Service"],
  },
];

export const CONTRACT_WATCH_RULES: ContractWatchRule[] = [
  {
    label: "General LBB contract reporting",
    threshold: "> $50,000",
    detail: "The LBB's current 2026–27 reporting page states that contracts greater than $50,000 must be reported within 30 calendar days of award, including required contract and solicitation documentation.",
    sourceUrl: "https://www.lbb.texas.gov/Contract_Reporting.aspx",
  },
  {
    label: "Large-award attestation notice",
    threshold: "$1M noncompetitive / $10M competitive",
    detail: "The 2026–27 General Appropriations Act reporting framework requires notice for noncompetitive contracts over $1 million and competitive contracts over $10 million, with a shorter deadline for emergency contracts.",
    sourceUrl: "https://www.lbb.texas.gov/Contract_Reporting.aspx",
  },
  {
    label: "10% amendment reporting",
    threshold: "> $1M contract + ≥10% increase",
    detail: "Contracts over $1 million that increase in value by 10 percent or more trigger amendment or renewal reporting requirements.",
    sourceUrl: "https://www.lbb.texas.gov/Contract_Reporting.aspx",
  },
  {
    label: "Vendor performance reporting",
    threshold: "> $25,000 purchase",
    detail: "State agencies are required to report vendor performance for purchases of goods or services exceeding $25,000; contracts over $5 million also carry milestone and annual reporting requirements.",
    sourceUrl: "https://comptroller.texas.gov/purchasing/programs/vendor-performance-tracking/",
  },
];

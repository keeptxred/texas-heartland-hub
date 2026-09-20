export type StateBudgetMetric = {
  label: string;
  value: string;
  note: string;
  sourceUrl: string;
};

export type StateBudgetOfficialResource = {
  label: string;
  url: string;
  publisher: string;
  scope: string;
};

export const STATE_BUDGET_DATA_REVIEWED_AT = "2026-08-19";

export const STATE_BUDGET_METRICS: StateBudgetMetric[] = [
  {
    label: "2026–27 appropriations — all funds",
    value: "$337.94B",
    note: "General Appropriations Act funding by article, excluding interagency contracts.",
    sourceUrl: "https://lbb.texas.gov/Documents/Appropriations_Bills/89/Final/9306_2026-27_Biennium_Funding_by_Article_All_Funds.pdf",
  },
  {
    label: "2026–27 appropriations — General Revenue funds",
    value: "$149.10B",
    note: "General Revenue funding by article in the enacted 2026–27 budget.",
    sourceUrl: "https://lbb.texas.gov/Documents/Appropriations_Bills/89/Final/9306_2026-27_Biennium_Funding_by_Article_General_Revenue_Funds.pdf",
  },
  {
    label: "Certified GR-related revenue available",
    value: "$203.63B",
    note: "Post-session Certification Revenue Estimate for the 2026–27 biennium after statutory transfers, balances, and expected collections and adjustments.",
    sourceUrl: "https://comptroller.texas.gov/transparency/reports/certification-revenue-estimate/2026-27/",
  },
  {
    label: "Certified general-purpose spending",
    value: "$198.97B",
    note: "General-purpose spending supported by the 2026–27 Certification Revenue Estimate.",
    sourceUrl: "https://comptroller.texas.gov/transparency/reports/certification-revenue-estimate/2026-27/",
  },
  {
    label: "Expected ending GR-related certification balance",
    value: "$4.66B",
    note: "Projected certification balance after general-purpose spending in the 2026–27 biennium.",
    sourceUrl: "https://comptroller.texas.gov/transparency/reports/certification-revenue-estimate/2026-27/",
  },
  {
    label: "Projected Rainy Day Fund balance, end of FY 2027",
    value: "$28.48B",
    note: "Projected Economic Stabilization Fund balance including investment earnings, absent additional legislative appropriations.",
    sourceUrl: "https://comptroller.texas.gov/transparency/reports/certification-revenue-estimate/2026-27/",
  },
];

export const STATE_BUDGET_OFFICIAL_RESOURCES: StateBudgetOfficialResource[] = [
  {
    label: "2026–27 General Appropriations Act and summaries",
    url: "https://lbb.texas.gov/Legislative_Session.aspx",
    publisher: "Texas Legislative Budget Board",
    scope: "Final budget, funding-by-article summaries, program listing, conference documents, and supplemental appropriations materials for the 89th Legislature.",
  },
  {
    label: "Fiscal Size-Up 2026–27",
    url: "https://fsu.lbb.texas.gov/",
    publisher: "Texas Legislative Budget Board",
    scope: "Interactive statewide, article, and agency budget context for fiscal actions of the 89th Legislature.",
  },
  {
    label: "2026–27 Certification Revenue Estimate",
    url: "https://comptroller.texas.gov/transparency/reports/certification-revenue-estimate/2026-27/",
    publisher: "Texas Comptroller",
    scope: "Post-session certified revenue available, expected spending, balances, transfers, and current economic assumptions.",
  },
  {
    label: "Texas Transparency — Revenue and Spending",
    url: "https://comptroller.texas.gov/transparency/",
    publisher: "Texas Comptroller",
    scope: "State revenue, spending, contracts, finance reports, dashboards, and open-data tools used to move from appropriations to actual financial activity.",
  },
];

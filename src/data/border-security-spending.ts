export type BorderSecurityAgencyFunding = {
  agency: string;
  biennium2024_25Millions: number;
  biennium2026_27Millions: number;
};

export const BORDER_SECURITY_DATA_REVIEWED_AT = "2026-09-06";
export const BORDER_SECURITY_GAA_2026_27_URL = "https://www.lbb.texas.gov/Documents/GAA/General_Appropriations_Act_2026_2027.pdf";
export const BORDER_SECURITY_GAA_2024_25_URL = "https://www.lbb.texas.gov/Documents/GAA/General_Appropriations_Act_2024_2025.pdf";
export const BORDER_SECURITY_FISCAL_SIZEUP_2026_27_URL = "https://lbb.texas.gov/Documents/Publications/Fiscal_SizeUp/9046_Fiscal_Size-up_26-27_Biennium.pdf";
export const BORDER_SECURITY_HISTORICAL_EXPENDITURE_URL = "https://www.lbb.texas.gov/Documents/Publications/Presentation/Texas_Border_Security_Reporting.pdf";
export const BORDER_SECURITY_REIMBURSEMENT_CONTEXT_URL = "https://comptroller.texas.gov/transparency/reports/certification-revenue-estimate/2026-27/";

export const BORDER_SECURITY_TOTALS = {
  biennium2024_25Millions: 6_571.7,
  biennium2026_27Millions: 3_351.7,
} as const;

export const BORDER_SECURITY_AGENCY_FUNDING: BorderSecurityAgencyFunding[] = [
  { agency: "Office of the Attorney General", biennium2024_25Millions: 38.6, biennium2026_27Millions: 2.6 },
  { agency: "Trusteed Programs within the Office of the Governor", biennium2024_25Millions: 2_888.7, biennium2026_27Millions: 228.5 },
  { agency: "Department of State Health Services", biennium2024_25Millions: 16.4, biennium2026_27Millions: 16.4 },
  { agency: "Office of Court Administration, Texas Judicial Council", biennium2024_25Millions: 44.8, biennium2026_27Millions: 44.8 },
  { agency: "Texas Alcoholic Beverage Commission", biennium2024_25Millions: 6.9, biennium2026_27Millions: 6.9 },
  { agency: "Texas Department of Criminal Justice", biennium2024_25Millions: 25.9, biennium2026_27Millions: 25.9 },
  { agency: "Commission on Jail Standards", biennium2024_25Millions: 0.4, biennium2026_27Millions: 0.4 },
  { agency: "Texas Commission on Law Enforcement", biennium2024_25Millions: 0.3, biennium2026_27Millions: 0.3 },
  { agency: "Texas Military Department", biennium2024_25Millions: 2_265.5, biennium2026_27Millions: 1_765.5 },
  { agency: "Department of Public Safety", biennium2024_25Millions: 1_234.6, biennium2026_27Millions: 1_194.6 },
  { agency: "Texas Parks and Wildlife Department", biennium2024_25Millions: 33.6, biennium2026_27Millions: 33.6 },
  { agency: "Texas Soil and Water Conservation Board", biennium2024_25Millions: 7.2, biennium2026_27Millions: 7.2 },
  { agency: "Department of Motor Vehicles", biennium2024_25Millions: 8.8, biennium2026_27Millions: 25.1 },
];

export const BORDER_SECURITY_HISTORICAL_REPORTED_EXPENDITURE = {
  biennium: "2020–21",
  appropriatedMillions: 800.6,
  agencyReportedExpendedMillions: 820.1,
  percentExpended: 102.4,
  note: "LBB's March 31, 2022 border-security reporting presentation compares the 2020–21 appropriation with agency-reported expenditures. The presentation notes that some reported expenditures can reflect funding sources or timing outside the headline appropriation, so this figure should not be treated as a simple over-budget calculation.",
} as const;

export const BORDER_SECURITY_REIMBURSEMENT_CONTEXT = {
  description: "The Comptroller's 2026–27 Certification Revenue Estimate does not include potential federal reimbursement for Texas border-security costs because the amount and timing were unknown when the estimate was certified.",
  treatment: "KTR should record any reimbursement as a separate federal receipt when it is awarded or received rather than subtracting an announced or requested amount from historical state appropriations.",
} as const;

export function borderSecurityFundingChangePercent(): number {
  return ((BORDER_SECURITY_TOTALS.biennium2026_27Millions / BORDER_SECURITY_TOTALS.biennium2024_25Millions) - 1) * 100;
}

export function borderSecurityFundingCsv(rows: BorderSecurityAgencyFunding[] = BORDER_SECURITY_AGENCY_FUNDING): string {
  const header = "agency,2024_25_millions,2026_27_millions";
  const lines = rows.map((row) => `"${row.agency.replaceAll('"', '""')}",${row.biennium2024_25Millions},${row.biennium2026_27Millions}`);
  return [header, ...lines].join("\n");
}

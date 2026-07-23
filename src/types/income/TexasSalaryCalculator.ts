export type FilingStatus = "single" | "married" | "head_of_household";
export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

export interface TexasSalaryInput {
  annualSalary: number;
  filingStatus: FilingStatus;
  payFrequency: PayFrequency;
  dependents: number;
  retirementContribution: number;
  healthInsurance: number;
  otherDeductions: number;
  city?: string;
}

export interface TaxBreakdown {
  grossIncome: number;
  federalIncomeTax: number;
  socialSecurity: number;
  medicare: number;
  totalTaxes: number;
  effectiveTaxRate: number;
}

export interface DeductionBreakdown {
  retirement: number;
  healthInsurance: number;
  other: number;
  totalDeductions: number;
}

export interface PaycheckAnalysis {
  grossPay: number;
  taxes: number;
  deductions: number;
  takeHomePay: number;
  monthlyTakeHomePay: number;
}

export interface SalaryAffordability {
  annualIncome: number;
  monthlyIncome: number;
  recommendedHousingBudget: number;
  recommendedSavings: number;
  lifestyleScore: number;
}

export interface RequiredSalaryResult {
  targetLifestyle: string;
  requiredAnnualSalary: number;
  requiredMonthlyIncome: number;
  reason: string;
}

export interface TexasSalaryResult {
  input: TexasSalaryInput;
  taxes: TaxBreakdown;
  deductions: DeductionBreakdown;
  paycheck: PaycheckAnalysis;
  affordability: SalaryAffordability;
  requiredSalary?: RequiredSalaryResult;
}

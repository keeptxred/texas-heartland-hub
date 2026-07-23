import type { TexasSalaryInput, TexasSalaryResult } from "@/types/income/TexasSalaryCalculator";

const federal = (income: number) =>
  income <= 50000 ? income * 0.1 : income <= 100000 ? income * 0.15 : income <= 200000 ? income * 0.22 : income * 0.28;

export function calculateRequiredSalary(monthlyNeed: number) {
  return monthlyNeed * 12 / 0.75;
}

export function analyzeTexasSalary(input: TexasSalaryInput): TexasSalaryResult {
  const federalIncomeTax = federal(input.annualSalary);
  const socialSecurity = input.annualSalary * 0.062;
  const medicare = input.annualSalary * 0.0145;
  const totalTaxes = federalIncomeTax + socialSecurity + medicare;
  const retirement = input.annualSalary * input.retirementContribution;
  const healthInsurance = input.healthInsurance * 12;
  const totalDeductions = retirement + healthInsurance + input.otherDeductions;
  const takeHomePay = input.annualSalary - totalTaxes - totalDeductions;
  const monthlyTakeHomePay = takeHomePay / 12;
  const lifestyleScore = Math.min(
    100,
    50 +
      (monthlyTakeHomePay >= 8000 ? 25 : monthlyTakeHomePay >= 5000 ? 15 : 0) +
      (monthlyTakeHomePay * 0.28 >= 2000 ? 15 : 0),
  );

  return {
    input,
    taxes: {
      grossIncome: input.annualSalary,
      federalIncomeTax,
      socialSecurity,
      medicare,
      totalTaxes,
      effectiveTaxRate: input.annualSalary ? totalTaxes / input.annualSalary : 0,
    },
    deductions: {
      retirement,
      healthInsurance,
      other: input.otherDeductions,
      totalDeductions,
    },
    paycheck: {
      grossPay: input.annualSalary,
      taxes: totalTaxes,
      deductions: totalDeductions,
      takeHomePay,
      monthlyTakeHomePay,
    },
    affordability: {
      annualIncome: takeHomePay,
      monthlyIncome: monthlyTakeHomePay,
      recommendedHousingBudget: monthlyTakeHomePay * 0.28,
      recommendedSavings: monthlyTakeHomePay * 0.2,
      lifestyleScore,
    },
  };
}

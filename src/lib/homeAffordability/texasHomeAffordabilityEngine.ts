import type { TexasHomeAffordabilityInput, TexasHomeAffordabilityResult } from "@/types/homeAffordability/TexasHomeAffordability";
import { affordabilityDTIDefaults } from "@/data/homeAffordability/texasHomeAffordabilityDefaults";

function loanFromPayment(payment: number, annualRatePercent: number, years: number) {
  const monthlyRate = annualRatePercent / 100 / 12;
  const months = Math.max(1, years * 12);
  return monthlyRate === 0
    ? payment * months
    : payment * (Math.pow(1 + monthlyRate, months) - 1) /
        (monthlyRate * Math.pow(1 + monthlyRate, months));
}

export function analyzeTexasHomeAffordability(input: TexasHomeAffordabilityInput): TexasHomeAffordabilityResult {
  const income = input.buyer.annualIncome / 12;
  const maxPay = income * affordabilityDTIDefaults.lenderHousingRatio;
  const comfortablePay = income * affordabilityDTIDefaults.comfortableHousingRatio;
  const currentDebtRatio = income ? input.buyer.monthlyDebtPayments / income : 0;
  const futureDebtRatio = income ? (input.buyer.monthlyDebtPayments + maxPay) / income : 0;
  const loanAmount = loanFromPayment(maxPay, input.buyer.interestRate, input.buyer.loanTermYears);
  const comfortableLoan = loanFromPayment(comfortablePay, input.buyer.interestRate, input.buyer.loanTermYears);
  const maximumHomePrice = loanAmount + input.buyer.downPayment;
  const comfortableHomePrice = comfortableLoan + input.buyer.downPayment;
  let score = 100;
  if (futureDebtRatio > 0.43) score -= 25;
  if (futureDebtRatio > 0.5) score -= 25;
  if (currentDebtRatio > 0.2) score -= 10;
  const rating = score >= 85 ? "excellent" : score >= 70 ? "comfortable" : score >= 50 ? "stretch" : "high_risk";

  return {
    input,
    paymentAnalysis: {
      grossMonthlyIncome: income,
      maximumHousingPayment: maxPay,
      comfortableHousingPayment: comfortablePay,
      currentDebtRatio,
      futureDebtRatio,
    },
    homePriceAnalysis: {
      maximumHomePrice,
      comfortableHomePrice,
      loanAmount,
      downPayment: input.buyer.downPayment,
    },
    score: { score, rating },
    recommendation: `Estimated comfortable home price: $${Math.round(comfortableHomePrice).toLocaleString("en-US")}.`,
  };
}

import type { TexasRefinanceInput, TexasRefinanceResult } from "@/types/mortgage/TexasRefinance";

function payment(principal: number, annualRatePercent: number, years: number) {
  const monthlyRate = annualRatePercent / 100 / 12;
  const months = Math.max(1, years * 12);
  return monthlyRate === 0
    ? principal / months
    : principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
        (Math.pow(1 + monthlyRate, months) - 1);
}

export function analyzeTexasRefinance(input: TexasRefinanceInput): TexasRefinanceResult {
  const currentMonthly = payment(input.currentLoanBalance, input.currentInterestRate, input.currentLoanTermYears);
  const remainingPayments = input.currentYearsRemaining * 12;
  const remainingInterest = currentMonthly * remainingPayments - input.currentLoanBalance;
  const newBalance = input.currentLoanBalance + input.cashOutAmount;
  const newMonthly = payment(newBalance, input.newInterestRate, input.newLoanTermYears);
  const totalPayments = newMonthly * input.newLoanTermYears * 12;
  const totalInterest = totalPayments - newBalance;
  const monthlySavings = currentMonthly - newMonthly;
  const annualSavings = monthlySavings * 12;
  const totalInterestSavings = remainingInterest - totalInterest;
  const netSavingsAfterCosts = totalInterestSavings - input.closingCosts;
  const monthsToBreakEven = monthlySavings > 0 ? Math.ceil(input.closingCosts / monthlySavings) : 0;
  const yearsToBreakEven = Number((monthsToBreakEven / 12).toFixed(1));
  let score = 50;
  if (netSavingsAfterCosts > 50000) score += 35;
  else if (netSavingsAfterCosts > 25000) score += 20;
  else if (netSavingsAfterCosts > 10000) score += 10;
  if (monthsToBreakEven > 0 && monthsToBreakEven <= 24) score += 15;
  if (monthsToBreakEven > 60) score -= 20;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    input,
    currentMortgage: { monthlyPayment: currentMonthly, remainingInterest, remainingPayments },
    newMortgage: { monthlyPayment: newMonthly, totalInterest, totalPayments },
    savings: { monthlySavings, annualSavings, totalInterestSavings, netSavingsAfterCosts },
    breakEven: {
      monthsToBreakEven,
      yearsToBreakEven,
      message: monthlySavings > 0
        ? `Closing costs are recovered after approximately ${monthsToBreakEven} months.`
        : "Refinancing does not reduce the monthly payment.",
    },
    decisionScore: score,
    recommendation: score >= 80
      ? "Refinancing appears financially attractive."
      : score >= 60
        ? "Refinancing may be worth considering depending on your expected time in the home."
        : "Keeping the current mortgage may be preferable.",
  };
}

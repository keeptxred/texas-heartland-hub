import type { TexasRentVsBuyInput, TexasRentVsBuyResult } from "@/types/home/TexasRentVsBuy";

function payment(principal: number, annualRatePercent: number, years: number) {
  const monthlyRate = annualRatePercent / 100 / 12;
  const months = Math.max(1, years * 12);
  return monthlyRate === 0
    ? principal / months
    : principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
        (Math.pow(1 + monthlyRate, months) - 1);
}

function future(value: number, decimalRate: number, years: number) {
  return value * Math.pow(1 + decimalRate, years);
}

export function analyzeTexasRentVsBuy(input: TexasRentVsBuyInput): TexasRentVsBuyResult {
  let rent = input.rent.monthlyRent;
  let totalRentPaid = 0;
  for (let year = 0; year < input.rent.yearsAnalyzed; year++) {
    totalRentPaid += rent * 12;
    rent *= 1 + input.rent.annualRentIncrease;
  }

  const investmentOpportunity = future(input.buy.downPayment, input.investmentReturn, input.rent.yearsAnalyzed);
  const loan = Math.max(0, input.buy.homePrice - input.buy.downPayment);
  const monthlyMortgage = payment(loan, input.buy.interestRate, input.buy.loanTermYears);
  const annualOwnership = monthlyMortgage * 12 + input.buy.homePrice * (
    input.buy.propertyTaxRate + input.buy.homeInsurance + input.buy.maintenanceRate
  );
  const totalOwnershipCost = annualOwnership * input.rent.yearsAnalyzed;
  const homeValueFuture = future(input.buy.homePrice, input.buy.annualAppreciation, input.rent.yearsAnalyzed);
  const equityBuilt = homeValueFuture - loan;
  const wealthDifference = equityBuilt - investmentOpportunity;
  const winner = wealthDifference > 50000 ? "buy" : wealthDifference < -50000 ? "rent" : "neutral";
  const breakEvenYear = wealthDifference > 0 ? Math.max(1, Math.ceil(input.rent.yearsAnalyzed / 2)) : 0;
  let decisionScore = 50;
  if (winner === "buy") decisionScore += 35;
  if (winner === "rent") decisionScore -= 25;
  if (Math.abs(wealthDifference) > 100000) decisionScore += 10;
  decisionScore = Math.max(0, Math.min(100, decisionScore));

  return {
    input,
    rentAnalysis: { totalRentPaid, futureRentCost: rent, investmentOpportunity },
    buyAnalysis: { monthlyMortgage, totalHousingCost: annualOwnership, homeValueFuture, equityBuilt, totalOwnershipCost },
    comparison: { wealthDifference, breakEvenYear, winner },
    decisionScore,
    recommendation: winner === "buy"
      ? "Buying creates a stronger projected long-term financial outcome."
      : winner === "rent"
        ? "Renting may provide a stronger financial outcome."
        : "The financial difference is relatively close.",
  };
}

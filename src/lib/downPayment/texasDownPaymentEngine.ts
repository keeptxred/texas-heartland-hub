import type { TexasDownPaymentInput, TexasDownPaymentResult } from "@/types/downPayment/TexasDownPayment";
import { downPaymentProgramDefaults } from "@/data/downPayment/texasDownPaymentDefaults";

function payment(principal: number, annualRatePercent: number, years: number) {
  const monthlyRate = annualRatePercent / 100 / 12;
  const months = Math.max(1, years * 12);
  return monthlyRate === 0
    ? principal / months
    : principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
        (Math.pow(1 + monthlyRate, months) - 1);
}

export function analyzeTexasDownPayment(input: TexasDownPaymentInput): TexasDownPaymentResult {
  const rules = downPaymentProgramDefaults[input.loanProgram];
  const downPaymentAmount = input.homePrice * input.downPaymentPercent;
  const closingCosts = input.homePrice * input.closingCostPercent;
  const totalCashNeeded = downPaymentAmount + closingCosts;
  const cashShortfall = Math.max(0, totalCashNeeded - input.currentSavings);
  const loanAmount = Math.max(0, input.homePrice - downPaymentAmount);
  const minimumDownPayment = input.homePrice * rules.minimumDownPayment;
  const recommendedDownPayment = input.homePrice * rules.recommendedDownPayment;
  const requiresPMI = input.downPaymentPercent < rules.pmiThreshold;
  const currentPayment = payment(loanAmount, input.interestRate, input.loanTermYears);
  const higherDown = Math.min(input.homePrice * 0.2, input.homePrice);
  const higherPayment = payment(input.homePrice - higherDown, input.interestRate, input.loanTermYears);
  const monthsNeeded = cashShortfall <= 0
    ? 0
    : input.monthlySavings > 0
      ? Math.ceil(cashShortfall / input.monthlySavings)
      : Infinity;

  return {
    input,
    program: { minimumDownPayment, recommendedDownPayment, requiresPMI, loanAmount },
    cash: { downPaymentAmount, closingCosts, totalCashNeeded, cashShortfall },
    payment: {
      monthlyPayment: currentPayment,
      paymentWithHigherDownPayment: higherPayment,
      monthlySavings: currentPayment - higherPayment,
    },
    timeline: { monthsNeeded, yearsNeeded: monthsNeeded / 12 },
    recommendation: cashShortfall > 0
      ? `You may need approximately ${monthsNeeded} months to reach your target cash requirement.`
      : "Your current savings may cover the estimated purchase costs.",
  };
}

import type { TexasMortgageInput, TexasMortgageResult } from "@/types/mortgage/TexasMortgageCalculator";

export function calculateTexasMortgage(input: TexasMortgageInput): TexasMortgageResult {
  const loanAmount = Math.max(0, input.homePrice - input.downPayment);
  const months = Math.max(1, input.termYears * 12);
  const monthlyRate = input.annualInterestRate / 100 / 12;
  const principalAndInterest = monthlyRate === 0
    ? loanAmount / months
    : loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const monthlyPropertyTax = input.annualPropertyTax / 12;
  const monthlyInsurance = input.annualHomeInsurance / 12;
  const totalMonthlyPayment = principalAndInterest + monthlyPropertyTax + monthlyInsurance + input.monthlyHoa + input.monthlyPmi;
  const totalPaid = principalAndInterest * months;
  return {
    loanAmount,
    principalAndInterest,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHoa: input.monthlyHoa,
    monthlyPmi: input.monthlyPmi,
    totalMonthlyPayment,
    totalInterest: Math.max(0, totalPaid - loanAmount),
    totalPaid,
  };
}

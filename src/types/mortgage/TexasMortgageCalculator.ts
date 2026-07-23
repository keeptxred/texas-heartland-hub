export interface TexasMortgageInput {
  homePrice: number;
  downPayment: number;
  annualInterestRate: number;
  termYears: number;
  annualPropertyTax: number;
  annualHomeInsurance: number;
  monthlyHoa: number;
  monthlyPmi: number;
}

export interface TexasMortgageResult {
  loanAmount: number;
  principalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyPmi: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
}

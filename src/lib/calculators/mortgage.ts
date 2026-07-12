export interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;

  propertyTaxRate?: number;
  insuranceAnnual?: number;
  hoaMonthly?: number;

  pmiRate?: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface MortgageResults {
  loanAmount: number;

  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;

  totalMonthlyPayment: number;

  totalInterest: number;
  totalPayments: number;

  amortization: AmortizationRow[];
}

export function calculateMortgage(
  inputs: MortgageInputs
): MortgageResults {

  const {
    homePrice,
    downPayment,
    interestRate,
    loanTermYears,

    propertyTaxRate = 0,
    insuranceAnnual = 0,
    hoaMonthly = 0,

    pmiRate = 0.005,
  } = inputs;


  const loanAmount =
    Math.max(homePrice - downPayment, 0);


  const monthlyRate =
    interestRate / 100 / 12;


  const totalPayments =
    loanTermYears * 12;


  const monthlyPrincipalInterest =
    monthlyRate === 0
      ? loanAmount / totalPayments
      :
      loanAmount *
      (
        monthlyRate *
        Math.pow(1 + monthlyRate, totalPayments)
      )
      /
      (
        Math.pow(1 + monthlyRate, totalPayments) - 1
      );


  const monthlyPropertyTax =
    (homePrice * (propertyTaxRate / 100)) / 12;


  const monthlyInsurance =
    insuranceAnnual / 12;


  const downPaymentPercent =
    downPayment / homePrice;


  const monthlyPMI =
    downPaymentPercent < 0.20
      ? (loanAmount * pmiRate) / 12
      : 0;


  const totalMonthlyPayment =
    monthlyPrincipalInterest +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyPMI +
    hoaMonthly;


  const totalPaymentsAmount =
    monthlyPrincipalInterest *
    totalPayments;


  const totalInterest =
    totalPaymentsAmount - loanAmount;


  const amortization: AmortizationRow[] = [];

  let balance = loanAmount;


  for (let month = 1; month <= totalPayments; month++) {

    const interest =
      monthlyRate === 0
        ? 0
        : balance * monthlyRate;


    const principal =
      monthlyPrincipalInterest - interest;


    balance =
      Math.max(balance - principal, 0);


    amortization.push({
      month,
      payment: monthlyPrincipalInterest,
      principal,
      interest,
      remainingBalance: balance,
    });

  }


  return {
    loanAmount,

    monthlyPrincipalInterest,

    monthlyPropertyTax,

    monthlyInsurance,

    monthlyPMI,

    monthlyHOA: hoaMonthly,

    totalMonthlyPayment,

    totalInterest,

    totalPayments: totalPaymentsAmount,

    amortization,
  };

}
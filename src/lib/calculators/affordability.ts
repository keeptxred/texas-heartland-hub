export interface AffordabilityInputs {
  annualIncome: number;

  monthlyDebts?: number;

  downPaymentPercent?: number;

  interestRate: number;

  loanTermYears?: number;

  propertyTaxRate?: number;

  insuranceAnnual?: number;

  targetDTI?: number;
}

export interface AffordabilityResults {
  monthlyIncome: number;

  maxMonthlyHousingPayment: number;

  estimatedLoanAmount: number;

  estimatedHomePrice: number;

  monthlyMortgagePayment: number;

  monthlyPropertyTax: number;

  monthlyInsurance: number;

  totalMonthlyHousingCost: number;

  debtToIncomeRatio: number;
}


export function calculateAffordability(
  inputs: AffordabilityInputs
): AffordabilityResults {

  const {
    annualIncome,

    monthlyDebts = 0,

    downPaymentPercent = 20,

    interestRate,

    loanTermYears = 30,

    propertyTaxRate = 2,

    insuranceAnnual = 2400,

    targetDTI = 36,

  } = inputs;


  const monthlyIncome =
    annualIncome / 12;


  const maxTotalDebtPayment =
    monthlyIncome *
    (targetDTI / 100);


  const maxMonthlyHousingPayment =
    Math.max(
      maxTotalDebtPayment - monthlyDebts,
      0
    );


  const monthlyRate =
    interestRate / 100 / 12;


  const numberOfPayments =
    loanTermYears * 12;


  /*
    Estimate loan amount by
    reversing mortgage formula.
  */

  const estimatedLoanAmount =
    monthlyRate === 0
      ? maxMonthlyHousingPayment *
        numberOfPayments
      :
        maxMonthlyHousingPayment *
        (
          (Math.pow(
            1 + monthlyRate,
            numberOfPayments
          ) - 1)
          /
          (
            monthlyRate *
            Math.pow(
              1 + monthlyRate,
              numberOfPayments
            )
          )
        );


  const downPaymentDecimal =
    downPaymentPercent / 100;


  const estimatedHomePrice =
    estimatedLoanAmount /
    (1 - downPaymentDecimal);


  const monthlyPropertyTax =
    (
      estimatedHomePrice *
      (propertyTaxRate / 100)
    ) / 12;


  const monthlyInsurance =
    insuranceAnnual / 12;


  const monthlyMortgagePayment =
    maxMonthlyHousingPayment -
    monthlyPropertyTax -
    monthlyInsurance;


  const totalMonthlyHousingCost =
    monthlyMortgagePayment +
    monthlyPropertyTax +
    monthlyInsurance;


  const debtToIncomeRatio =
    (
      monthlyDebts +
      totalMonthlyHousingCost
    )
    /
    monthlyIncome *
    100;


  return {

    monthlyIncome,

    maxMonthlyHousingPayment,

    estimatedLoanAmount,

    estimatedHomePrice,

    monthlyMortgagePayment,

    monthlyPropertyTax,

    monthlyInsurance,

    totalMonthlyHousingCost,

    debtToIncomeRatio,

  };

}
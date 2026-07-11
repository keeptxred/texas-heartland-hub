export interface ClosingCostInputs {
  purchasePrice: number;

  downPaymentPercent?: number;

  loanAmount?: number;

  lenderFees?: number;

  titleInsuranceRate?: number;

  recordingFees?: number;

  appraisalFee?: number;

  inspectionFee?: number;

  prepaidPropertyTaxMonths?: number;

  annualPropertyTaxRate?: number;

  annualInsurance?: number;
}

export interface ClosingCostBreakdown {
  label: string;
  amount: number;
}

export interface ClosingCostResults {
  downPayment: number;

  loanAmount: number;

  totalClosingCosts: number;

  totalCashNeeded: number;

  breakdown: ClosingCostBreakdown[];
}


export function calculateClosingCosts(
  inputs: ClosingCostInputs
): ClosingCostResults {

  const {

    purchasePrice,

    downPaymentPercent = 20,

    loanAmount,

    lenderFees = 1500,

    titleInsuranceRate = 0.005,

    recordingFees = 250,

    appraisalFee = 600,

    inspectionFee = 500,

    prepaidPropertyTaxMonths = 3,

    annualPropertyTaxRate = 2,

    annualInsurance = 2400,

  } = inputs;


  const downPayment =
    purchasePrice *
    (downPaymentPercent / 100);


  const calculatedLoanAmount =
    loanAmount ??
    Math.max(
      purchasePrice - downPayment,
      0
    );


  const titleInsurance =
    calculatedLoanAmount *
    titleInsuranceRate;


  const prepaidTaxes =
    (
      purchasePrice *
      (annualPropertyTaxRate / 100)
    )
    /
    12 *
    prepaidPropertyTaxMonths;


  const prepaidInsurance =
    annualInsurance /
    12;


  const breakdown: ClosingCostBreakdown[] = [

    {
      label: "Lender Fees",
      amount: lenderFees,
    },

    {
      label: "Title Insurance",
      amount: titleInsurance,
    },

    {
      label: "Recording Fees",
      amount: recordingFees,
    },

    {
      label: "Appraisal",
      amount: appraisalFee,
    },

    {
      label: "Home Inspection",
      amount: inspectionFee,
    },

    {
      label: "Prepaid Property Taxes",
      amount: prepaidTaxes,
    },

    {
      label: "Prepaid Insurance",
      amount: prepaidInsurance,
    },

  ];


  const totalClosingCosts =
    breakdown.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );


  const totalCashNeeded =
    downPayment +
    totalClosingCosts;


  return {

    downPayment,

    loanAmount:
      calculatedLoanAmount,

    totalClosingCosts,

    totalCashNeeded,

    breakdown,

  };

}
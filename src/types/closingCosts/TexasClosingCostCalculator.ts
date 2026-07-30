export interface TexasClosingCostInput {
  homePrice: number;
  downPayment: number;
  loanType: "conventional" | "fha" | "va" | "cash";
  lenderFeeRate: number;
  titleRate: number;
  appraisalFee: number;
  inspectionFee: number;
  surveyFee: number;
  prepaidTaxes: number;
  prepaidInsurance: number;
  sellerCredit: number;
}

export interface TexasClosingCostResult {
  loanAmount: number;
  lenderFees: number;
  titleFees: number;
  thirdPartyFees: number;
  prepaidCosts: number;
  grossClosingCosts: number;
  netClosingCosts: number;
  cashToClose: number;
  closingCostRate: number;
}

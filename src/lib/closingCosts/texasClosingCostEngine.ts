import type { TexasClosingCostInput, TexasClosingCostResult } from "@/types/closingCosts/TexasClosingCostCalculator";

export function calculateTexasClosingCosts(input: TexasClosingCostInput): TexasClosingCostResult {
  const loanAmount = Math.max(0, input.homePrice - input.downPayment);
  const lenderFees = input.loanType === "cash" ? 0 : loanAmount * (input.lenderFeeRate / 100);
  const titleFees = input.homePrice * (input.titleRate / 100);
  const thirdPartyFees = input.appraisalFee + input.inspectionFee + input.surveyFee;
  const prepaidCosts = input.prepaidTaxes + input.prepaidInsurance;
  const grossClosingCosts = lenderFees + titleFees + thirdPartyFees + prepaidCosts;
  const netClosingCosts = Math.max(0, grossClosingCosts - input.sellerCredit);
  return {
    loanAmount,
    lenderFees,
    titleFees,
    thirdPartyFees,
    prepaidCosts,
    grossClosingCosts,
    netClosingCosts,
    cashToClose: input.downPayment + netClosingCosts,
    closingCostRate: input.homePrice > 0 ? netClosingCosts / input.homePrice : 0,
  };
}

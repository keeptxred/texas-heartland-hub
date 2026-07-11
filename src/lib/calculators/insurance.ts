export interface InsuranceInputs {
  homeValue: number;

  coveragePercent?: number;

  baseRatePerThousand?: number;

  deductible?: number;

  riskMultiplier?: number;
}

export interface InsuranceResults {
  dwellingCoverage: number;

  baseAnnualPremium: number;

  deductibleAdjustment: number;

  riskAdjustment: number;

  annualPremium: number;

  monthlyPremium: number;
}


export function calculateHomeInsurance(
  inputs: InsuranceInputs
): InsuranceResults {

  const {
    homeValue,

    coveragePercent = 100,

    baseRatePerThousand = 5,

    deductible = 2500,

    riskMultiplier = 1,
  } = inputs;


  const dwellingCoverage =
    homeValue *
    (coveragePercent / 100);


  /*
    Base calculation:
    Example:
    $400,000 home
    $5 per $1,000 coverage
    = $2,000 annual premium
  */

  const baseAnnualPremium =
    (dwellingCoverage / 1000) *
    baseRatePerThousand;


  /*
    Higher deductibles generally
    reduce premiums.

    Baseline deductible:
    $2,500
  */

  const deductibleAdjustment =
    deductible <= 1000
      ? 1.15
      : deductible >= 5000
        ? 0.85
        : 1;


  /*
    Allows future Texas risk modeling:
    - Coastal wind
    - Hail zones
    - Flood risk
    - Wildfire
  */

  const riskAdjustment =
    riskMultiplier;


  const annualPremium =
    baseAnnualPremium *
    deductibleAdjustment *
    riskAdjustment;


  return {

    dwellingCoverage,

    baseAnnualPremium,

    deductibleAdjustment,

    riskAdjustment,

    annualPremium,

    monthlyPremium:
      annualPremium / 12,

  };

}
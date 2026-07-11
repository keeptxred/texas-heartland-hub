export const CALCULATOR_DEFAULTS = {


  mortgage: {

    defaultInterestRate:
      6.5,

    defaultLoanTermYears:
      30,

    defaultDownPaymentPercent:
      20,

    defaultPMIRate:
      0.005,

  },



  texasTaxes: {

    defaultPropertyTaxRate:
      2.0,

    defaultHomesteadExemption:
      140000,

  },



  insurance: {

    defaultAnnualPremium:
      2400,

    defaultCoveragePercent:
      100,

    defaultDeductible:
      2500,

    defaultRiskMultiplier:
      1,

  },



  affordability: {

    recommendedFrontEndRatio:
      28,

    recommendedBackEndRatio:
      36,

    maximumBackEndRatio:
      43,

  },



  closingCosts: {

    lenderFeesPercent:
      0.01,

    titleFeesPercent:
      0.005,

    inspectionCost:
      500,

    appraisalCost:
      600,

    prepaidMonths:
      3,

  },



  utilities: {

    electricityPerSqFt:
      0.18,

    averageWater:
      90,

    averageGas:
      45,

    averageTrash:
      25,

    averageInternet:
      70,

    poolAdjustment:
      50,

  },


};



export const TEXAS_REGIONS = [

  {
    id:
      "houston",

    name:
      "Houston",

    averagePropertyTaxRate:
      2.2,

    averageInsuranceMultiplier:
      1.1,

  },


  {
    id:
      "dallas",

    name:
      "Dallas-Fort Worth",

    averagePropertyTaxRate:
      2.0,

    averageInsuranceMultiplier:
      1,

  },


  {
    id:
      "austin",

    name:
      "Austin",

    averagePropertyTaxRate:
      1.8,

    averageInsuranceMultiplier:
      0.95,

  },


  {
    id:
      "san-antonio",

    name:
      "San Antonio",

    averagePropertyTaxRate:
      2.1,

    averageInsuranceMultiplier:
      1,

  },


  {
    id:
      "texas-coast",

    name:
      "Texas Gulf Coast",

    averagePropertyTaxRate:
      2.2,

    averageInsuranceMultiplier:
      1.35,

  },

];



export function getTexasRegion(
  id: string
) {

  return TEXAS_REGIONS.find(

    (region) =>
      region.id === id

  );

}
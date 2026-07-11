export interface CalculatorDefaultSet {

  [key: string]:
    number | string | boolean;

}



export const mortgageDefaults: CalculatorDefaultSet = {

  homePrice:
    350000,

  downPayment:
    20,

  interestRate:
    6.5,

  loanTerm:
    30,

  propertyTaxRate:
    2,

  annualInsurance:
    2400,

  hoaMonthly:
    0,

};



export const propertyTaxDefaults: CalculatorDefaultSet = {

  homeValue:
    350000,

  taxRate:
    2,

  homesteadExemption:
    140000,

};



export const insuranceDefaults: CalculatorDefaultSet = {

  homeValue:
    350000,

  coveragePercent:
    100,

  deductible:
    2500,

  annualPremium:
    2400,

};



export const affordabilityDefaults: CalculatorDefaultSet = {

  annualIncome:
    100000,

  monthlyDebt:
    500,

  interestRate:
    6.5,

  downPaymentPercent:
    20,

  propertyTaxRate:
    2,

  insuranceRate:
    2400,

};



export const closingCostDefaults: CalculatorDefaultSet = {

  homePrice:
    350000,

  downPaymentPercent:
    20,

  inspection:
    500,

  appraisal:
    600,

};



export const utilitiesDefaults: CalculatorDefaultSet = {

  squareFeet:
    2200,

  occupants:
    4,

  electricity:
    250,

  water:
    90,

  gas:
    45,

  internet:
    70,

  trash:
    25,

  pool:
    false,

};
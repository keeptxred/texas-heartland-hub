export interface HousingCostInput { rent:number; mortgage:number; propertyTaxes:number; homeInsurance:number; maintenance:number; }
export interface UtilityCostInput { electricity:number; water:number; internet:number; cellPhone:number; gas:number; }
export interface TransportationCostInput { vehiclePayment:number; fuel:number; insurance:number; maintenance:number; publicTransit:number; }
export interface LifestyleCostInput { groceries:number; restaurants:number; entertainment:number; healthcare:number; childcare:number; other:number; }
export interface TexasCostOfLivingInput { city:string; householdSize:number; annualIncome:number; housing:HousingCostInput; utilities:UtilityCostInput; transportation:TransportationCostInput; lifestyle:LifestyleCostInput; }
export interface MonthlyCostSummary { housing:number; utilities:number; transportation:number; lifestyle:number; totalMonthlyCost:number; }
export interface AffordabilityAnalysis { annualExpenses:number; incomeAfterExpenses:number; housingRatio:number; savingsRate:number; affordabilityScore:number; }
export interface CityCostComparison { city:string; monthlyCost:number; annualCost:number; differenceFromAverage:number; ranking:number; }
export interface TexasCostOfLivingResult { input:TexasCostOfLivingInput; summary:MonthlyCostSummary; analysis:AffordabilityAnalysis; comparison?:CityCostComparison; recommendation:string; }

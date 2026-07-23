export type OwnershipExpenseCategory="mortgage"|"property_tax"|"insurance"|"hoa"|"maintenance"|"utilities"|"repairs"|"other";
export interface TexasHomeOwnershipCostInput{homeValue:number;downPayment:number;loanAmount:number;interestRate:number;loanTermYears:number;propertyTaxRate:number;insuranceAnnual:number;hoaMonthly:number;maintenanceRate:number;utilitiesMonthly:number;repairReserveMonthly:number;}
export interface OwnershipCostBreakdown{mortgageMonthly:number;propertyTaxMonthly:number;insuranceMonthly:number;hoaMonthly:number;maintenanceMonthly:number;utilitiesMonthly:number;repairsMonthly:number;otherMonthly:number;totalMonthlyCost:number;}
export interface AnnualOwnershipCost{mortgageAnnual:number;taxAnnual:number;insuranceAnnual:number;hoaAnnual:number;maintenanceAnnual:number;utilitiesAnnual:number;repairsAnnual:number;totalAnnualCost:number;}
export interface OwnershipAffordabilityAnalysis{monthlyIncomeNeeded:number;housingExpenseRatio:number;affordabilityScore:number;status:string;}
export interface OwnershipCostComparison{mortgageOnlyCost:number;trueOwnershipCost:number;additionalOwnershipCost:number;}
export interface TexasHomeOwnershipCostResult{input:TexasHomeOwnershipCostInput;monthlyCosts:OwnershipCostBreakdown;annualCosts:AnnualOwnershipCost;affordability:OwnershipAffordabilityAnalysis;comparison:OwnershipCostComparison;recommendation:string;}

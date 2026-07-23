export type HousingDecision="buy"|"rent"|"neutral";
export interface RentScenarioInput{monthlyRent:number;annualRentIncrease:number;rentersInsurance:number;yearsAnalyzed:number;}
export interface BuyScenarioInput{homePrice:number;downPayment:number;interestRate:number;loanTermYears:number;propertyTaxRate:number;homeInsurance:number;maintenanceRate:number;annualAppreciation:number;}
export interface TexasRentVsBuyInput{rent:RentScenarioInput;buy:BuyScenarioInput;investmentReturn:number;}
export interface RentAnalysis{totalRentPaid:number;futureRentCost:number;investmentOpportunity:number;}
export interface BuyAnalysis{monthlyMortgage:number;totalHousingCost:number;homeValueFuture:number;equityBuilt:number;totalOwnershipCost:number;}
export interface RentVsBuyComparison{wealthDifference:number;breakEvenYear:number;winner:HousingDecision;}
export interface TexasRentVsBuyResult{input:TexasRentVsBuyInput;rentAnalysis:RentAnalysis;buyAnalysis:BuyAnalysis;comparison:RentVsBuyComparison;decisionScore:number;recommendation:string;}

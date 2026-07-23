export type LoanProgram="conventional"|"fha"|"va"|"usda";
export interface TexasDownPaymentInput{homePrice:number;loanProgram:LoanProgram;downPaymentPercent:number;closingCostPercent:number;currentSavings:number;monthlySavings:number;interestRate:number;loanTermYears:number;}
export interface LoanProgramAnalysis{minimumDownPayment:number;recommendedDownPayment:number;requiresPMI:boolean;loanAmount:number;}
export interface CashRequirementAnalysis{downPaymentAmount:number;closingCosts:number;totalCashNeeded:number;cashShortfall:number;}
export interface PaymentImpactAnalysis{monthlyPayment:number;paymentWithHigherDownPayment:number;monthlySavings:number;}
export interface SavingsTimeline{monthsNeeded:number;yearsNeeded:number;}
export interface TexasDownPaymentResult{input:TexasDownPaymentInput;program:LoanProgramAnalysis;cash:CashRequirementAnalysis;payment:PaymentImpactAnalysis;timeline:SavingsTimeline;recommendation:string;}

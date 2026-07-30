import type { TexasMortgageResult } from "@/types/mortgage/TexasMortgageCalculator";

export const formatMortgageCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
export const explainMortgagePayment = (result: TexasMortgageResult) => `Estimated monthly housing payment: ${formatMortgageCurrency(result.totalMonthlyPayment)}.`;
export const explainMortgageInterest = (result: TexasMortgageResult) => `Estimated total interest over the loan term: ${formatMortgageCurrency(result.totalInterest)}.`;
export const generateMortgageSEODescription = () => "Estimate a Texas mortgage payment including principal, interest, property taxes, insurance, HOA dues, and PMI.";

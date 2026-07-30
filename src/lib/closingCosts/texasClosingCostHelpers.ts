import type { TexasClosingCostResult } from "@/types/closingCosts/TexasClosingCostCalculator";

export const formatClosingCostCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
export const explainClosingCosts = (result: TexasClosingCostResult) => `Estimated net closing costs: ${formatClosingCostCurrency(result.netClosingCosts)}.`;
export const explainCashToClose = (result: TexasClosingCostResult) => `Estimated total cash to close: ${formatClosingCostCurrency(result.cashToClose)}.`;
export const generateClosingCostSEODescription = () => "Estimate buyer closing costs and total cash needed to purchase a home in Texas.";

import { STATE_BUDGET_METRICS } from "@/data/state-budget-data";

function parseBillions(value: string) {
  const match = value.replace(/[$,]/g, "").match(/^(-?\d+(?:\.\d+)?)B$/i);
  if (!match) throw new Error(`Expected a billions-formatted state budget value, received: ${value}`);
  return Number(match[1]);
}

function metricBillions(labelPrefix: string) {
  const metric = STATE_BUDGET_METRICS.find((item) => item.label.startsWith(labelPrefix));
  if (!metric) throw new Error(`Missing state budget metric: ${labelPrefix}`);
  return parseBillions(metric.value);
}

export const CERTIFIED_GR_RELATED_REVENUE_BILLIONS = metricBillions("Certified GR-related revenue available");
export const CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS = metricBillions("Certified general-purpose spending");
export const CERTIFIED_ENDING_GR_BALANCE_BILLIONS = metricBillions("Expected ending GR-related certification balance");

export type BudgetHeadroomScenario = {
  revenueChangePercent: number;
  spendingChangePercent: number;
  additionalOneTimeSpendingBillions: number;
};

export function calculateBudgetHeadroomScenario(input: BudgetHeadroomScenario) {
  const revenueChangePercent = Number.isFinite(input.revenueChangePercent) ? input.revenueChangePercent : 0;
  const spendingChangePercent = Number.isFinite(input.spendingChangePercent) ? input.spendingChangePercent : 0;
  const additionalOneTimeSpendingBillions = Number.isFinite(input.additionalOneTimeSpendingBillions)
    ? Math.max(0, input.additionalOneTimeSpendingBillions)
    : 0;

  const projectedRevenueBillions = CERTIFIED_GR_RELATED_REVENUE_BILLIONS * (1 + revenueChangePercent / 100);
  const projectedRecurringSpendingBillions = CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS * (1 + spendingChangePercent / 100);
  const projectedSpendingBillions = projectedRecurringSpendingBillions + additionalOneTimeSpendingBillions;
  const projectedEndingBalanceBillions = projectedRevenueBillions - projectedSpendingBillions;
  const changeFromCertifiedBalanceBillions = projectedEndingBalanceBillions - CERTIFIED_ENDING_GR_BALANCE_BILLIONS;

  return {
    projectedRevenueBillions,
    projectedRecurringSpendingBillions,
    projectedSpendingBillions,
    projectedEndingBalanceBillions,
    changeFromCertifiedBalanceBillions,
    shortfallBillions: Math.max(0, -projectedEndingBalanceBillions),
    remainingHeadroomBillions: Math.max(0, projectedEndingBalanceBillions),
  };
}

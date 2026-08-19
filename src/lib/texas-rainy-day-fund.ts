import { STATE_BUDGET_METRICS } from "@/data/state-budget-data";

function parseBillions(value: string): number {
  const normalized = value.trim().replace(/[$,]/g, "").toUpperCase();
  const match = normalized.match(/^(-?\d+(?:\.\d+)?)B$/);
  if (!match) throw new Error(`Expected a budget value in billions, received: ${value}`);
  return Number(match[1]);
}

function metricValue(labelPrefix: string): number {
  const metric = STATE_BUDGET_METRICS.find((item) => item.label.startsWith(labelPrefix));
  if (!metric) throw new Error(`Missing state budget metric: ${labelPrefix}`);
  return parseBillions(metric.value);
}

export const PROJECTED_ESF_BALANCE_BILLIONS = metricValue("Projected Rainy Day Fund balance");
export const CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS = metricValue("Certified general-purpose spending");

export type RainyDayFundScenario = {
  openingBalanceBillions: number;
  requestedWithdrawalBillions: number;
  remainingBalanceBillions: number;
  percentOfFundUsed: number;
  withdrawalAsPercentOfGeneralPurposeSpending: number;
  overdrawnByBillions: number;
};

export function calculateRainyDayFundScenario(requestedWithdrawalBillions: number): RainyDayFundScenario {
  const requested = Number.isFinite(requestedWithdrawalBillions) ? Math.max(0, requestedWithdrawalBillions) : 0;
  const remaining = PROJECTED_ESF_BALANCE_BILLIONS - requested;
  return {
    openingBalanceBillions: PROJECTED_ESF_BALANCE_BILLIONS,
    requestedWithdrawalBillions: requested,
    remainingBalanceBillions: Math.max(0, remaining),
    percentOfFundUsed: PROJECTED_ESF_BALANCE_BILLIONS > 0 ? (requested / PROJECTED_ESF_BALANCE_BILLIONS) * 100 : 0,
    withdrawalAsPercentOfGeneralPurposeSpending: CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS > 0
      ? (requested / CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS) * 100
      : 0,
    overdrawnByBillions: Math.max(0, -remaining),
  };
}

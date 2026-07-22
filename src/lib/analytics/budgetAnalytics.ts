export interface BudgetEvent {
  action: string;
  city?: string;
  monthlyIncome?: number;
  financialScore?: number;
  expenseTotal?: number;
}

export function trackBudgetEvent(event: BudgetEvent) {
  if (typeof window === "undefined") return;
  const payload = { tool: "texas_budget_planner", ...event };
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", event.action, payload);
  window.dispatchEvent(new CustomEvent("budget_planner_event", { detail: payload }));
}

export interface ClosingCostEvent { action: string; homePrice?: number; closingCosts?: number; cashToClose?: number; }
export function trackClosingCostEvent(event: ClosingCostEvent) {
  if (typeof window === "undefined") return;
  const payload = { tool: "texas_closing_cost_calculator", ...event };
  if ("gtag" in window) (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", event.action, payload);
  window.dispatchEvent(new CustomEvent("closing_cost_event", { detail: payload }));
}

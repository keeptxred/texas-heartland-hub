export interface EquityGrowthEvent {
  action: string;
  homeValue?: number;
  projectedEquity?: number;
  years?: number;
}

export function trackEquityGrowthEvent(event: EquityGrowthEvent) {
  if (typeof window === "undefined") return;
  const payload = { tool: "texas_equity_growth", ...event };
  if ("gtag" in window) {
    (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", event.action, payload);
  }
  window.dispatchEvent(new CustomEvent("equity_growth_event", { detail: payload }));
}

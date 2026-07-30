export interface MortgageCalculatorEvent { action: string; homePrice?: number; monthlyPayment?: number; }
export function trackMortgageCalculatorEvent(event: MortgageCalculatorEvent) {
  if (typeof window === "undefined") return;
  const payload = { tool: "texas_mortgage_calculator", ...event };
  if ("gtag" in window) (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", event.action, payload);
  window.dispatchEvent(new CustomEvent("mortgage_calculator_event", { detail: payload }));
}

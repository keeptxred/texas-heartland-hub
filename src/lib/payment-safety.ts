export type PaymentEnvironment = "sandbox" | "live";

export function allowsRealFulfillment(environment: PaymentEnvironment): boolean {
  return environment === "live";
}

export function assertSandboxCannotFulfill(environment: PaymentEnvironment): void {
  if (allowsRealFulfillment(environment)) {
    throw new Error("Sandbox-only payment path cannot run with live fulfillment enabled.");
  }
}

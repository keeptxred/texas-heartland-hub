import { describe, expect, it } from "vitest";
import { allowsRealFulfillment, assertSandboxCannotFulfill } from "@/lib/payment-safety";

describe("payment fulfillment safety", () => {
  it("allows real fulfillment only for live payments", () => {
    expect(allowsRealFulfillment("live")).toBe(true);
    expect(allowsRealFulfillment("sandbox")).toBe(false);
  });

  it("keeps the sandbox-only path fail-closed", () => {
    expect(() => assertSandboxCannotFulfill("sandbox")).not.toThrow();
    expect(() => assertSandboxCannotFulfill("live")).toThrow(
      "Sandbox-only payment path cannot run with live fulfillment enabled.",
    );
  });
});

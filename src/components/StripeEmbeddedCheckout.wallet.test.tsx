import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import type { ExpressCheckoutElementProps } from "@stripe/react-stripe-js/checkout";

const mocks = vi.hoisted(() => ({ confirm: vi.fn(), onConfirm: undefined as ExpressCheckoutElementProps["onConfirm"] | undefined }));
vi.mock("@stripe/react-stripe-js/checkout", () => ({
  CheckoutElementsProvider: () => null,
  useCheckout: () => ({ type: "success", checkout: { confirm: mocks.confirm, canConfirm: true } }),
  ExpressCheckoutElement: (props: ExpressCheckoutElementProps) => { mocks.onConfirm = props.onConfirm; return null; },
  PaymentElement: () => createElement("div", { "data-card-fallback": true }),
}));
vi.mock("@/lib/stripe", () => ({ getStripe: vi.fn() }));
vi.mock("@/lib/checkout.functions", () => ({ createCartCheckoutSession: vi.fn() }));
import { PaymentStep } from "./StripeEmbeddedCheckout";

describe("wallet checkout confirmation", () => {
  beforeEach(() => { mocks.confirm.mockReset(); mocks.onConfirm = undefined; });
  function mount() {
    return renderToString(createElement(PaymentStep, {
      checkout: { clientSecret: "test", sessionId: "cs_test", subtotalCents: 1000, shippingCents: 699, totalCents: 1699, shippingLabel: "Standard" },
      returnUrl: "https://keeptxred.com/checkout-return?session_id={CHECKOUT_SESSION_ID}",
    }));
  }
  function walletEvent() { return { paymentFailed: vi.fn() } as unknown as StripeExpressCheckoutElementConfirmEvent; }
  it("passes wallet authorization to the existing session and keeps card checkout", async () => {
    mocks.confirm.mockResolvedValue({ type: "success" });
    expect(mount()).toContain("data-card-fallback");
    const event = walletEvent();
    await mocks.onConfirm?.(event);
    expect(mocks.confirm).toHaveBeenCalledWith({ expressCheckoutConfirmEvent: event, returnUrl: "https://keeptxred.com/checkout-return?session_id=cs_test" });
    expect(event.paymentFailed).not.toHaveBeenCalled();
  });
  it("signals a failed wallet attempt when confirmation transport throws", async () => {
    mocks.confirm.mockRejectedValue(new Error("Transport unavailable"));
    mount();
    const event = walletEvent();
    await mocks.onConfirm?.(event);
    expect(event.paymentFailed).toHaveBeenCalledWith({ reason: "fail" });
  });
  it("does not confirm a session twice while a wallet authorization is in flight", async () => {
    let finish: ((value: { type: string }) => void) | undefined;
    mocks.confirm.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    mount();
    const first = mocks.onConfirm?.(walletEvent());
    await mocks.onConfirm?.(walletEvent());
    expect(mocks.confirm).toHaveBeenCalledTimes(1);
    finish?.({ type: "success" });
    await first;
  });
});

import { describe, expect, it } from "vitest";
import {
  checkoutClientKind,
  texasDefinedShippingCents,
  TEXASDEFINED_FREE_SHIPPING_THRESHOLD_CENTS,
  TEXASDEFINED_STANDARD_SHIPPING_CENTS,
} from "./texasdefined-shop-shipping";

describe("Texas Defined shipping matches its public merchant policy", () => {
  it("charges the advertised standard shipping below and at $35", () => {
    expect(TEXASDEFINED_STANDARD_SHIPPING_CENTS).toBe(699);
    expect(TEXASDEFINED_FREE_SHIPPING_THRESHOLD_CENTS).toBe(3500);
    expect(texasDefinedShippingCents(50)).toBe(699);
    expect(texasDefinedShippingCents(599)).toBe(699);
    expect(texasDefinedShippingCents(2399)).toBe(699);
    expect(texasDefinedShippingCents(3500)).toBe(699);
  });

  it("offers free standard shipping for orders over $35", () => {
    expect(texasDefinedShippingCents(3501)).toBe(0);
    expect(texasDefinedShippingCents(8500)).toBe(0);
  });

  it("fails closed on invalid subtotals", () => {
    for (const amount of [-1, 0, 19.99, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => texasDefinedShippingCents(amount)).toThrow("Invalid merchandise subtotal");
    }
  });
});

describe("checkout diagnostic labels do not block customer traffic", () => {
  it("recognizes common automation and real-browser user agents", () => {
    expect(checkoutClientKind("Mozilla/5.0 HeadlessChrome/125.0")).toBe("automation");
    expect(checkoutClientKind("Mozilla/5.0 TexasDefined-Checkout-Smoke")).toBe("automation");
    expect(checkoutClientKind("Googlebot/2.1")).toBe("crawler");
    expect(checkoutClientKind("Mozilla/5.0 Chrome/125.0 Safari/537.36")).toBe("browser");
    expect(checkoutClientKind(null)).toBe("unknown");
  });
});

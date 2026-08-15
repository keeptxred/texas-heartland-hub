import { describe, expect, it } from "vitest";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  getStandardShippingCents,
  qualifiesForFreeShipping,
} from "@/lib/checkout.functions";

describe("checkout shipping policy", () => {
  it("charges shipping at exactly $35", () => {
    expect(FREE_SHIPPING_THRESHOLD_CENTS).toBe(3500);
    expect(qualifiesForFreeShipping(3500)).toBe(false);
  });

  it("makes shipping free only above $35", () => {
    expect(qualifiesForFreeShipping(3501)).toBe(true);
    expect(qualifiesForFreeShipping(5000)).toBe(true);
  });

  it("uses Printify's standard quote in cents", () => {
    expect(getStandardShippingCents({ standard: 699 })).toBe(699);
    expect(getStandardShippingCents({ standard: 0 })).toBe(0);
  });

  it("rejects a missing or malformed Printify standard quote", () => {
    expect(() => getStandardShippingCents({})).toThrow(
      "Printify did not return a valid standard shipping rate.",
    );
    expect(() => getStandardShippingCents({ standard: -1 })).toThrow();
    expect(() => getStandardShippingCents({ standard: 4.5 })).toThrow();
  });
});

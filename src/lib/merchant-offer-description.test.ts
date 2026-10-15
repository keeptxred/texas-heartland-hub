import { expect, test } from "vitest";
import { merchantOfferDescription } from "./merchant-offer-description";
test("describes the purchased variant using catalog facts and retained supplier text", () => {
  expect(merchantOfferDescription("100% cotton. Botanical graphic.", "Natural", "M")).toBe("Color: Natural. Size: M. 100% cotton. Botanical graphic.");
});
test("does not infer unspecified facts and retains the Merchant size limit", () => {
  expect(merchantOfferDescription("Graphic tee")).toBe("Graphic tee");
  const result = merchantOfferDescription("supplier detail ".repeat(500), "Blue", "XL");
  expect(result.length).toBeLessThanOrEqual(5000);
  expect(result.startsWith("Color: Blue. Size: XL.")).toBe(true);
});

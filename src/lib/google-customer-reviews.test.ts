import { test } from "vitest";
import assert from "node:assert/strict";
import { reviewOrderForPaidSession, estimatedDeliveryDate } from "./google-customer-reviews";
const paid = {
  id: "cs_live_receipt", livemode: true, status: "complete", payment_status: "paid",
  created: Date.parse("2026-10-16T12:00:00Z") / 1000,
  metadata: { source: "keeptxred_shop", fulfillment: JSON.stringify({ co: "US" }) },
  customer_details: { email: "buyer@example.test" },
};
test("only completed, paid, live orders belonging to the merchant are eligible", () => {
  for (const change of [{ livemode: false }, { status: "open" }, { payment_status: "unpaid" }, { metadata: { source: "texasdefined_shop" } }]) {
    assert.equal(reviewOrderForPaidSession({ ...paid, ...change }, "keeptxred"), null);
  }
});
test("exports only approved fields with the matching merchant and fixed delivery estimate", () => {
  const result = reviewOrderForPaidSession(paid, "keeptxred");
  assert.deepEqual(result, { merchant_id: 5829731270, order_id: paid.id, email: "buyer@example.test", delivery_country: "US", estimated_delivery_date: "2026-11-03" });
  assert.equal(paid.metadata.source, "keeptxred_shop");
});
test("TexasDefined uses verified shipping country and its own merchant account", () => {
  const session = { ...paid, metadata: { source: "texasdefined_shop" }, collected_information: { shipping_details: { address: { country: "US" } } } };
  assert.equal(reviewOrderForPaidSession(session, "texasdefined")?.merchant_id, 5843243953);
  assert.equal(reviewOrderForPaidSession(session, "keeptxred"), null);
  assert.equal(reviewOrderForPaidSession({ ...session, collected_information: { shipping_details: { address: { country: "CA" } } } }, "texasdefined"), null);
});
test("missing or malformed customer and fulfillment data never reaches Google", () => {
  for (const change of [{ customer_details: null }, { customer_details: { email: "invalid" } }, { created: NaN }, { metadata: { source: "keeptxred_shop", fulfillment: "invalid" } }]) {
    assert.equal(reviewOrderForPaidSession({ ...paid, ...change }, "keeptxred"), null);
  }
});
test("delivery estimate counts weekdays across year boundaries in UTC", () => {
  assert.equal(estimatedDeliveryDate(Date.parse("2026-12-31T23:59:00Z") / 1000), "2027-01-18");
});

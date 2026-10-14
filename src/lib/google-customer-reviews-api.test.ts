import { beforeEach, expect, test, vi } from "vitest";
const { retrieve } = vi.hoisted(() => ({ retrieve: vi.fn() }));
vi.mock("@/lib/stripe.server", () => ({ createStripeClient: () => ({ checkout: { sessions: { retrieve } } }) }));
vi.mock("@tanstack/react-router", () => ({ createFileRoute: () => (options: unknown) => ({ options }) }));
import { Route } from "@/routes/api/public/shop-checkout-status";
const get = (Route.options as unknown as { server: { handlers: { GET: (context: { request: Request }) => Promise<Response> } } }).server.handlers.GET;
const session = { id: "cs_live_receipt", livemode: true, status: "complete", payment_status: "paid", created: 1792152000, metadata: { source: "keeptxred_shop", fulfillment: '{"co":"US"}' }, customer_details: { email: "buyer@example.test", phone: "DO_NOT_EXPORT" } };
beforeEach(() => { retrieve.mockReset(); retrieve.mockResolvedValue(session); });
test("malformed and sandbox sessions never call live Stripe", async () => {
  for (const id of ["", "cs_test_example", "invalid"]) expect((await get({ request: new Request(`https://keeptxred.com/api/public/shop-checkout-status?session_id=${id}`) })).status).toBe(400);
  expect(retrieve).not.toHaveBeenCalled();
});
test("a paid receipt exports only the approved review fields and cannot be cached", async () => {
  const response = await get({ request: new Request("https://keeptxred.com/api/public/shop-checkout-status?session_id=cs_live_receipt") });
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  const body = await response.json();
  expect(body.paid).toBe(true);
  expect(Object.keys(body.review).sort()).toEqual(["delivery_country", "email", "estimated_delivery_date", "merchant_id", "order_id"]);
  expect(JSON.stringify(body)).not.toContain("DO_NOT_EXPORT");
});
test("unpaid orders do not disclose review information", async () => {
  retrieve.mockResolvedValue({ ...session, payment_status: "unpaid" });
  const response = await get({ request: new Request("https://keeptxred.com/api/public/shop-checkout-status?session_id=cs_live_receipt") });
  expect(await response.json()).toEqual({ ok: true, paid: false, review: null });
});
test("another merchant's paid order is not a KTR receipt", async () => {
  retrieve.mockResolvedValue({ ...session, metadata: { source: "texasdefined_shop" } });
  expect((await get({ request: new Request("https://keeptxred.com/api/public/shop-checkout-status?session_id=cs_live_receipt") })).status).toBe(404);
});

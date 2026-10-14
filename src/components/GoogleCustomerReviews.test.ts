import { afterEach, beforeEach, expect, test, vi } from "vitest";
const lifecycle = vi.hoisted(() => ({ cleanups: [] as Array<() => void> }));
vi.mock("react", () => ({ useEffect: (effect: () => (() => void)) => { lifecycle.cleanups.push(effect()); } }));
const order = { merchant_id: 5829731270, order_id: "cs_live_receipt", email: "buyer@example.test", delivery_country: "US", estimated_delivery_date: "2026-11-03" };
let script: { src?: string; onerror?: () => void; remove: () => void };
let reviewWindow: { googleCustomerReviewsReady?: () => void; gapi: { load: ReturnType<typeof vi.fn>; surveyoptin: { render: ReturnType<typeof vi.fn> } } };
beforeEach(() => {
  vi.resetModules(); lifecycle.cleanups = [];
  script = { remove: vi.fn() };
  reviewWindow = { gapi: { load: vi.fn((_module, ready: () => void) => ready()), surveyoptin: { render: vi.fn() } } };
  vi.stubGlobal("window", reviewWindow);
  vi.stubGlobal("document", { createElement: () => script, body: { appendChild: vi.fn() } });
});
afterEach(() => { lifecycle.cleanups.forEach(cleanup => cleanup()); vi.unstubAllGlobals(); });
test("uses Google's ready callback and native survey choice, once per receipt", async () => {
  const { GoogleCustomerReviews } = await import("./GoogleCustomerReviews");
  GoogleCustomerReviews({ order }); GoogleCustomerReviews({ order });
  expect(script.src).toBe("https://apis.google.com/js/platform.js?onload=googleCustomerReviewsReady");
  reviewWindow.googleCustomerReviewsReady?.();
  await Promise.resolve(); await Promise.resolve();
  expect(reviewWindow.gapi.load).toHaveBeenCalledWith("surveyoptin", expect.any(Function));
  expect(reviewWindow.gapi.surveyoptin.render).toHaveBeenCalledExactlyOnceWith(order);
});
test("navigation before Google loads does not render an orphan consent dialog", async () => {
  const { GoogleCustomerReviews } = await import("./GoogleCustomerReviews");
  GoogleCustomerReviews({ order }); lifecycle.cleanups.forEach(cleanup => cleanup());
  reviewWindow.googleCustomerReviewsReady?.();
  await Promise.resolve(); await Promise.resolve();
  expect(reviewWindow.gapi.surveyoptin.render).not.toHaveBeenCalled();
});
test("a blocked review script fails independently of the order receipt", async () => {
  const { GoogleCustomerReviews } = await import("./GoogleCustomerReviews");
  expect(GoogleCustomerReviews({ order })).toBeNull(); script.onerror?.();
  await Promise.resolve(); await Promise.resolve();
  expect(reviewWindow.gapi.surveyoptin.render).not.toHaveBeenCalled();
});

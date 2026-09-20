import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const route = readFileSync(
  "src/routes/api/public/ops/replay-live-payment-diagnostic.ts",
  "utf8",
);
const workflow = readFileSync(
  ".github/workflows/deploy-cloudflare-after-verify.yml",
  "utf8",
);
const marker = readFileSync(
  ".github/replay-texasdefined-live-payment-once",
  "utf8",
).trim();

describe("one-time TexasDefined live payment replay", () => {
  it("is authenticated and pinned to the exact diagnostic run", () => {
    expect(route).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(route).toContain('const LIVE_TEST_RUN = "td-20260920-8c2e41"');
    expect(route).toContain('const LIVE_TEST_SOURCE = "texasdefined_live_payment_test"');
    expect(route).toContain('diagnostic_only === "true"');
  });

  it("refuses to replay anything except the known paid 50-cent USD session", () => {
    expect(route).toContain('session.status !== "complete"');
    expect(route).toContain('session.payment_status !== "paid"');
    expect(route).toContain('session.amount_total !== EXPECTED_AMOUNT');
    expect(route).toContain('session.currency !== "usd"');
    expect(route).toContain("const EXPECTED_AMOUNT = 50");
  });

  it("replays only the matching live checkout completion event", () => {
    expect(route).toContain('"checkout.session.completed"');
    expect(route).toContain('"checkout.session.async_payment_succeeded"');
    expect(route).toContain("object?.id === session.id");
    expect(route).toContain("event_livemode: event.livemode");
  });

  it("requires the production webhook to mark the session before success", () => {
    expect(route).toContain('live_test_webhook_received === "true"');
    expect(route).toContain("ok: replay.ok && marker");
    expect(route).toContain("status: replay.ok && marker ? 200 : 502");
  });

  it("runs once during verified deployment and before unrelated law-route checks", () => {
    expect(marker).toBe("replay-td-2026-09-20-a");
    expect(workflow).toContain("Replay TexasDefined live diagnostic event");
    expect(workflow).toContain("replay-live-payment-diagnostic");
    expect(workflow.indexOf("Replay TexasDefined live diagnostic event")).toBeGreaterThan(
      workflow.indexOf("Verify live payment runtime"),
    );
    expect(workflow.indexOf("Replay TexasDefined live diagnostic event")).toBeLessThan(
      workflow.indexOf("Verify deployed law route ownership"),
    );
  });
});

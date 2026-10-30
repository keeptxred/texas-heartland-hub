import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const smoke = readFileSync("scripts/news/smoke-live-newsroom.mjs", "utf8");

test("reports the source-specific DPS result using only already-received ingestion diagnostics", () => {
  assert.ok(smoke.includes('source.source === "Texas DPS — Direct Press Releases"'));
  assert.ok(smoke.includes("INFO dps-firstparty-ingest status="));
  assert.ok(smoke.includes("WARN dps-firstparty-ingest not present"));
  assert.ok(smoke.includes("Array.isArray(payload.diag)"));
  assert.ok(smoke.includes("Number(dps.count ?? 0)"));
  assert.ok(smoke.includes('safeError = String(dps.error ?? "").slice(0, 160)'));
  const start = smoke.indexOf("// DPS was added as an original first-party source.");
  const end = smoke.indexOf("\n}\n\nconst failures", start);
  const inserted = smoke.slice(start, end);
  assert.equal(inserted.includes("await fetch"), false);
  assert.equal(inserted.includes("fetchWithTimeout("), false);
  assert.equal(inserted.includes("POST"), true); // comment explicitly records no new POST.
});

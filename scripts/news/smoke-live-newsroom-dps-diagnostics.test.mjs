import { readFileSync } from "node:fs";
import { test, expect } from "vitest";

const smoke = readFileSync("scripts/news/smoke-live-newsroom.mjs", "utf8");

test("reports the source-specific DPS result using only already-received ingestion diagnostics", () => {
  expect(smoke.includes('source.source === "Texas DPS — Direct Press Releases"')).toBe(true);
  expect(smoke.includes("INFO dps-firstparty-ingest status=")).toBe(true);
  expect(smoke.includes("WARN dps-firstparty-ingest not present")).toBe(true);
  expect(smoke.includes("Array.isArray(payload.diag)")).toBe(true);
  expect(smoke.includes("Number(dps.count ?? 0)")).toBe(true);
  expect(smoke.includes('safeError = String(dps.error ?? "").slice(0, 160)')).toBe(true);
  const start = smoke.indexOf("// DPS was added as an original first-party source.");
  const end = smoke.indexOf("\n}\n\nconst failures", start);
  const inserted = smoke.slice(start, end);
  expect(inserted.includes("await fetch")).toBe(false);
  expect(inserted.includes("fetchWithTimeout(")).toBe(false);
  expect(inserted.includes("POST")).toBe(true); // comment explicitly records no new POST.
});

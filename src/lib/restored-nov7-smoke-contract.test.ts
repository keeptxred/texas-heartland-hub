import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const smoke = readFileSync(new URL("../../scripts/news/smoke-live-newsroom.mjs", import.meta.url), "utf8");

describe("restored November 7 newsroom production evidence", () => {
  it("checks both exact restored article routes, editorial text and canonical image provenance", () => {
    expect(smoke).toContain("async function checkNov7NewsEditorialRestoration()");
    expect(smoke).toContain("2026-11-07-thompson-claims-votes-to-become-texas-house-speaker");
    expect(smoke).toContain("2026-11-07-tx-dems-sweep-statewide-races-for-first-time-in-generation");
    expect(smoke).toContain("Gina_Hinojosa_at_the_AFL-CIO_COPE_convention_in_2024.jpg");
    expect(smoke).toContain("Senfronia_Thompson_2757_");
    expect(smoke).toContain("ending 24 years");
    expect(smoke).toContain("0 primary or official records");
    expect(smoke).toContain('"Cache-Control": "no-cache"');
    expect(smoke).toContain("const visible = html.replace");
    expect(smoke).toContain("const canonical = extractCanonical(html)");
    expect(smoke).toContain(
      '["restored November 7 editorial accuracy and approved imagery", checkNov7NewsEditorialRestoration]',
    );
  });
});

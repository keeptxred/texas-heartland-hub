import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const smoke = readFileSync(new URL("../../scripts/news/smoke-live-newsroom.mjs", import.meta.url), "utf8");

describe("restored and newly published newsroom production evidence", () => {
  it("checks all three original published article routes, editorial text and verified image provenance", () => {
    expect(smoke).toContain("async function checkRecentNewsEditorialRestoration()");
    expect(smoke).toContain("2026-11-07-thompson-claims-votes-to-become-texas-house-speaker");
    expect(smoke).toContain("2026-11-07-tx-dems-sweep-statewide-races-for-first-time-in-generation");
    expect(smoke).toContain("2026-11-08-hinojosa-names-transition-team-featuring-anti-voucher-republican-and-labor-allie");
    expect(smoke).toContain("not a photograph of her November 2026 transition-team announcement");
    expect(smoke).toContain('"/elections/candidates/"');
    expect(smoke).toContain("Gina_Hinojosa_at_the_AFL-CIO_COPE_convention_in_2024.jpg");
    expect(smoke).toContain("Senfronia_Thompson_2757_");
    expect(smoke).toContain("ending 24 years");
    expect(smoke).toContain("0 primary or official records");
    expect(smoke).toContain('"Cache-Control": "no-cache"');
    expect(smoke).toContain("const visible = html.replace");
    expect(smoke).toContain("const canonical = extractCanonical(html)");
    expect(smoke).toContain(
      '["recent news editorial accuracy, verified images and retired-route links", checkRecentNewsEditorialRestoration]',
    );
  });
});

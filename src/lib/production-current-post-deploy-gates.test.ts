import fs from "node:fs";
import { describe, expect, it } from "vitest";

const controller = fs.readFileSync(
  new URL("../../.github/workflows/ensure-cloudflare-production-current.yml", import.meta.url),
  "utf8",
);
const policing = fs.readFileSync(
  new URL("../../scripts/production/verify-policing-comparison-live.py", import.meta.url),
  "utf8",
);
const adsTxt = fs.readFileSync(
  new URL("../../scripts/production/verify-adsense-ads-txt.py", import.meta.url),
  "utf8",
);

describe("production-current post-deploy gates", () => {
  it("does not publish production-current success until the complete live smoke suite passes", () => {
    const requiredCommands = [
      "python3 scripts/authority/smoke-production.py",
      "python3 scripts/authority/smoke-production.py --city-migration-only",
      "python3 scripts/authority/verify-political-profiles-production.py",
      "python3 scripts/authority/verify-political-geography-production.py",
      "python3 scripts/production/verify-policing-comparison-live.py",
      "python3 scripts/production/verify-adsense-ads-txt.py",
    ];

    for (const command of requiredCommands) {
      expect(controller).toContain(command);
    }

    const publishIndex = controller.indexOf("- name: Publish production-current success");
    expect(publishIndex).toBeGreaterThan(0);
    for (const command of requiredCommands) {
      expect(controller.indexOf(command)).toBeLessThan(publishIndex);
    }
    expect(controller).toContain("full production smoke validation");
  });

  it("keeps the policing hero identity and social metadata assertions exact", () => {
    expect(policing).toContain("Texas Law Enforcement");
    expect(policing).toContain("texas-policing-agencies-compared-seven-role-0c284fef115e.webp");
    expect(policing).toContain("og:image");
    expect(policing).toContain("twitter:image");
    expect(policing).toContain("EXPECTED_BYTES = 59616");
    expect(policing).toContain(
      'EXPECTED_SHA256 = "0c284fef115ecc633eeae984a79fbbacac6e80f2f0a3526c3a1a5c8e6396814a"',
    );
  });

  it("requires the exact AdSense publisher declaration on a plain-text response", () => {
    expect(adsTxt).toContain(
      'EXPECTED = "google.com, pub-1891256141359926, DIRECT, f08c47fec0942fa0"',
    );
    expect(adsTxt).toContain('content_type.startswith("text/plain")');
    expect(adsTxt).toContain('body != EXPECTED');
  });
});

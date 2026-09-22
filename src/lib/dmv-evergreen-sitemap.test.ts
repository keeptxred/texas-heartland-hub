import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const rootSitemap = readFileSync(new URL("../routes/sitemap[.]xml.ts", import.meta.url), "utf8");
const indexabilityGuard = readFileSync(new URL("../../scripts/seo/validate-indexability.mjs", import.meta.url), "utf8");
const dmvRoute = readFileSync(new URL("../routes/dmv.tsx", import.meta.url), "utf8");
const vehicleRegistrationRoute = readFileSync(new URL("../routes/vehicles.registration.tsx", import.meta.url), "utf8");
const vehicleNewResidentsRoute = readFileSync(new URL("../routes/vehicles.new-residents.tsx", import.meta.url), "utf8");
const vehicleRenewalRoute = readFileSync(new URL("../routes/vehicles.renewal.tsx", import.meta.url), "utf8");
const vehicleFeesRoute = readFileSync(new URL("../routes/vehicles.registration-fees-taxes.tsx", import.meta.url), "utf8");

describe("DMV and vehicle sitemap ownership", () => {
  it("retires the empty KTR DMV sitemap and treats /dmv as a redirect alias", () => {
    expect(rootSitemap).not.toContain('"sitemap-dmv.xml"');
    expect(indexabilityGuard).toContain('const ALWAYS_LIVE_CHECK_SITEMAPS = new Set(["/sitemap-pages.xml"]);');
    expect(indexabilityGuard).toContain('  "/dmv",');
    expect(indexabilityGuard).not.toContain('"/sitemap-dmv.xml"');
  });

  it("permanently consolidates the retired KTR DMV tree on TexasDefined", () => {
    expect(dmvRoute).toContain('href: `https://texasdefined.com/texas-dmv${location.searchStr || ""}`');
    expect(dmvRoute).toContain("statusCode: 301");
  });

  it("hands the vehicle registration authority page to TexasDefined", () => {
    expect(vehicleRegistrationRoute).toContain(
      'href: `https://texasdefined.com/texas-vehicle-registration${location.searchStr || ""}`',
    );
    expect(vehicleRegistrationRoute).toContain("statusCode: 301");
  });

  it("hands the new-resident vehicle guide to the exact TexasDefined newcomer owner", () => {
    expect(vehicleNewResidentsRoute).toContain(
      'href: `https://texasdefined.com/find-my-dmv${location.searchStr || ""}`',
    );
    expect(vehicleNewResidentsRoute).toContain("statusCode: 308");
  });

  it("hands registration renewal and fees/taxes to their exact TexasDefined owners", () => {
    expect(vehicleRenewalRoute).toContain(
      'href: `https://texasdefined.com/texas-vehicle-registration-renewal${location.searchStr || ""}`',
    );
    expect(vehicleFeesRoute).toContain(
      'href: `https://texasdefined.com/texas-vehicle-registration-fees-taxes${location.searchStr || ""}`',
    );
    expect(vehicleRenewalRoute).toContain("statusCode: 301");
    expect(vehicleFeesRoute).toContain("statusCode: 301");
  });
});

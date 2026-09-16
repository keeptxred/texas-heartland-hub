import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DMV_EVERGREEN_SITEMAP_PATHS } from "@/data/dmv-evergreen-sitemap-paths";

const rootSitemap = readFileSync(new URL("../routes/sitemap[.]xml.ts", import.meta.url), "utf8");
const dmvSitemap = readFileSync(new URL("../routes/sitemap-dmv[.]xml.ts", import.meta.url), "utf8");
const dmvRoute = readFileSync(new URL("../routes/dmv.tsx", import.meta.url), "utf8");
const vehicleRegistrationRoute = readFileSync(new URL("../routes/vehicles.registration.tsx", import.meta.url), "utf8");
const vehicleRenewalRoute = readFileSync(new URL("../routes/vehicles.renewal.tsx", import.meta.url), "utf8");
const vehicleFeesRoute = readFileSync(new URL("../routes/vehicles.registration-fees-taxes.tsx", import.meta.url), "utf8");

function routeSourcePath(path: string): URL {
  const [section, slug] = path.slice(1).split("/");
  return new URL(`../routes/${section}.${slug}.tsx`, import.meta.url);
}

describe("DMV and vehicle sitemap ownership", () => {
  it("keeps the legacy dedicated sitemap wired while excluding retired KTR DMV paths", () => {
    expect(rootSitemap).toContain('\"sitemap-dmv.xml\"');
    expect(dmvSitemap).toContain("DMV_EVERGREEN_SITEMAP_PATHS");
    expect(DMV_EVERGREEN_SITEMAP_PATHS.every((path) => !path.startsWith("/dmv"))).toBe(true);
  });

  it("permanently consolidates the retired KTR DMV tree on TexasDefined", () => {
    expect(dmvRoute).toContain('href: `https://texasdefined.com/texas-dmv${location.searchStr || ""}`');
    expect(dmvRoute).toContain("statusCode: 301");
  });

  it("hands the vehicle registration authority page to TexasDefined", () => {
    expect(new Set<string>(DMV_EVERGREEN_SITEMAP_PATHS).has("/vehicles/registration")).toBe(false);
    expect(vehicleRegistrationRoute).toContain(
      'href: `https://texasdefined.com/texas-vehicle-registration${location.searchStr || ""}`',
    );
    expect(vehicleRegistrationRoute).toContain("statusCode: 301");
  });

  it("hands registration renewal and fees/taxes to their exact TexasDefined owners", () => {
    const advertised = new Set<string>(DMV_EVERGREEN_SITEMAP_PATHS);
    expect(advertised.has("/vehicles/renewal")).toBe(false);
    expect(advertised.has("/vehicles/registration-fees-taxes")).toBe(false);
    expect(vehicleRenewalRoute).toContain(
      'href: `https://texasdefined.com/texas-vehicle-registration-renewal${location.searchStr || ""}`',
    );
    expect(vehicleFeesRoute).toContain(
      'href: `https://texasdefined.com/texas-vehicle-registration-fees-taxes${location.searchStr || ""}`',
    );
    expect(vehicleRenewalRoute).toContain("statusCode: 301");
    expect(vehicleFeesRoute).toContain("statusCode: 301");
  });

  it("keeps the remaining vehicle guides canonical on KeepTXRed until separately adjudicated", () => {
    expect(DMV_EVERGREEN_SITEMAP_PATHS).toHaveLength(20);
    expect(new Set(DMV_EVERGREEN_SITEMAP_PATHS).size).toBe(DMV_EVERGREEN_SITEMAP_PATHS.length);

    for (const path of DMV_EVERGREEN_SITEMAP_PATHS) {
      expect(path.startsWith("/vehicles/")).toBe(true);
      const sourcePath = routeSourcePath(path);
      expect(existsSync(sourcePath), `${path} route source must exist`).toBe(true);
      const source = readFileSync(sourcePath, "utf8");
      expect(source, `${path} must keep its canonical route`).toContain(`createFileRoute("${path}")`);
      expect(source, `${path} must not become a redirect while advertised`).not.toContain("throw redirect");
    }
  });
});

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DMV_EVERGREEN_SITEMAP_PATHS } from "@/data/dmv-evergreen-sitemap-paths";

const RETIRED_INTERNAL_HREFS = [
  'href="/dmv"',
  'href="/vehicles/registration"',
  'href="/vehicles/renewal"',
  'href="/vehicles/registration-fees-taxes"',
] as const;

const RETIRED_INTERNAL_SCHEMA_TARGETS = [
  "${SITE_URL}/dmv",
  "${SITE_URL}/vehicles/registration",
  "${SITE_URL}/vehicles/renewal",
  "${SITE_URL}/vehicles/registration-fees-taxes",
] as const;

const HANDOFFS = [
  ["vehicles.registration.tsx", "https://texasdefined.com/texas-vehicle-registration"],
  ["vehicles.renewal.tsx", "https://texasdefined.com/texas-vehicle-registration-renewal"],
  ["vehicles.registration-fees-taxes.tsx", "https://texasdefined.com/texas-vehicle-registration-fees-taxes"],
] as const;

describe("retired vehicle authority handoffs", () => {
  it.each(DMV_EVERGREEN_SITEMAP_PATHS)("keeps active route %s free of retired internal vehicle/DMV targets", (routePath) => {
    const routeFile = `${routePath.slice(1).replaceAll("/", ".")}.tsx`;
    const source = readFileSync(new URL(`./${routeFile}`, import.meta.url), "utf8");

    for (const retiredHref of RETIRED_INTERNAL_HREFS) {
      expect(source, `${routeFile} still links to ${retiredHref}`).not.toContain(retiredHref);
    }

    for (const retiredSchemaTarget of RETIRED_INTERNAL_SCHEMA_TARGETS) {
      expect(source, `${routeFile} still declares ${retiredSchemaTarget}`).not.toContain(retiredSchemaTarget);
    }
  });

  it.each(HANDOFFS)("keeps %s as a permanent query-preserving exact-owner handoff", (file, destination) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(destination);
    expect(source).toContain("location.searchStr");
    expect(source).toContain("statusCode: 301");
  });
});

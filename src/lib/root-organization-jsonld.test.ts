import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { organizationJsonLd } from "@/lib/seo";
import { rootOrganizationJsonLd } from "@/lib/root-organization-jsonld";

describe("shared root organization schema isolation", () => {
  it("emits identical NewsMediaOrganization structured data", () => {
    expect(rootOrganizationJsonLd()).toEqual(organizationJsonLd());
  });

  it("keeps large route SEO dependencies out of the root's direct module imports", () => {
    const root = readFileSync("src/routes/__root.tsx", "utf8");
    const pure = readFileSync("src/lib/root-organization-jsonld.ts", "utf8");
    expect(root).toContain('import { rootOrganizationJsonLd } from "../lib/root-organization-jsonld"');
    expect(root).not.toContain('import { organizationJsonLd } from "../lib/seo"');
    expect(root).toContain("...rootOrganizationJsonLd()");
    expect(pure).not.toMatch(/from ["']@\/data\/articles/);
    expect(pure).not.toContain("exploreDestinations");
  });
});

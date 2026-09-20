import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(new URL("../../.github/workflows/geo-readiness-production-smoke.yml", import.meta.url), "utf8");

describe("production GEO smoke transport", () => {
  it("fetches deployed content through the Worker while preserving canonical identity", () => {
    expect(workflow).toContain("SITE_URL: https://keeptxred.com");
    expect(workflow).toContain("FETCH_ORIGIN: https://keeptxred-site.freddy-coppola.workers.dev");
    expect(workflow).toContain("-H 'X-Forwarded-Host: keeptxred.com'");
    expect(workflow).toContain('"${FETCH_ORIGIN%/}/sitemap.xml"');
    expect(workflow).toContain('"${FETCH_ORIGIN%/}/robots.txt"');
  });

  it("continues to require canonical public sitemap URLs", () => {
    for (const path of ["sitemap-pages.xml", "sitemap-news.xml", "sitemap-evergreen.xml", "sitemap-elections.xml"]) {
      expect(workflow).toContain(`https://keeptxred.com/${path}`);
    }
    expect(workflow).toContain('Sitemap: https://keeptxred.com/sitemap.xml');
  });

  it("does not downgrade unreachable HTML into a skipped GEO assertion", () => {
    expect(workflow).not.toContain("page-level GEO assertions were not evaluated");
    expect(workflow).toContain("Deployed Worker did not return HTTP 200 for the required HTML GEO checks.");
  });
});

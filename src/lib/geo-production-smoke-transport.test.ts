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
    expect(workflow).toContain("Deployed Worker home GEO check did not return HTTP 200.");
    expect(workflow).toContain("Election Central returned unexpected HTTP $election_status.");
    expect(workflow).toContain('if [[ "$election_status" != "200" && "$election_status" != "404" ]]');
    expect(workflow).toContain('if status == "404":');
    expect(workflow).toContain("election central is temporarily unavailable between election cycles.");
    expect(workflow).toContain("Live retired Election Central lacks noindex,nofollow header");
    expect(workflow).toContain('else:');
    expect(workflow).toContain("Active Election Central is missing its required H1");
    expect(workflow).toContain("Live home HTML is missing FAQPage JSON-LD");
  });
});

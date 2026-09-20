import { describe, expect, it } from "vitest";
import { TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures";
import { POLITICAL_FIGURE_AUTHORITY_SOURCES } from "@/data/texas-political-figure-authority-sources";

const ALLOWED_HOSTS = new Set([
  "www.reaganlibrary.gov",
  "www.bush41library.gov",
  "www.georgewbushlibrary.gov",
  "www.cruz.senate.gov",
  "www.cornyn.senate.gov",
  "www.senate.gov",
  "gov.texas.gov",
  "www.ltgov.texas.gov",
  "senate.texas.gov",
  "www.texasattorneygeneral.gov",
  "cemetery.texas.gov",
  "www.energy.gov",
]);

describe("Texas political figure authority sources", () => {
  it("covers every original evergreen political figure", () => {
    expect(Object.keys(POLITICAL_FIGURE_AUTHORITY_SOURCES)).toHaveLength(TEXAS_POLITICAL_FIGURES.length);
    for (const figure of TEXAS_POLITICAL_FIGURES) {
      expect(POLITICAL_FIGURE_AUTHORITY_SOURCES[figure.slug]?.length, figure.slug).toBeGreaterThanOrEqual(2);
    }
  });

  it("uses unique HTTPS sources from approved authoritative hosts", () => {
    for (const [slug, sources] of Object.entries(POLITICAL_FIGURE_AUTHORITY_SOURCES)) {
      const seen = new Set<string>();
      for (const source of sources) {
        const url = new URL(source.href);
        expect(url.protocol, slug).toBe("https:");
        expect(ALLOWED_HOSTS.has(url.hostname), `${slug}: ${url.hostname}`).toBe(true);
        expect(source.label.trim().length, slug).toBeGreaterThan(12);
        expect(seen.has(source.href), `${slug}: duplicate source`).toBe(false);
        seen.add(source.href);
      }
    }
  });
});

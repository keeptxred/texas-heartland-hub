import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const billsRoute = readFileSync(new URL("../routes/bills/index.tsx", import.meta.url), "utf8");

describe("Texas bills search-intent authority", () => {
  it("matches the bill lookup and Legislature bill search intent surfaced in Search Console", () => {
    expect(billsRoute).toContain("Texas Bill Lookup & Legislature Bill Search | KeepTXRed");
    expect(billsRoute).toContain("Texas Bill Lookup and Legislature Bill Search");
    expect(billsRoute).toContain("Search HB 1, SB 21, caption or subject");
    expect(billsRoute).toContain("How to find a Texas Legislature bill");
  });

  it("keeps official-source verification and canonical authority cross-links visible", () => {
    expect(billsRoute).toContain("https://capitol.texas.gov/billlookup/billnumber.aspx");
    for (const path of ["/texas-legislature", "/laws", "/committees", "/representatives"]) {
      expect(billsRoute).toContain(`to=\"${path}\"`);
    }
  });

  it("keeps filtered search-result combinations out of the index while preserving the canonical hub", () => {
    expect(billsRoute).toContain("filtered ?");
    expect(billsRoute).toContain("noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    expect(billsRoute).toContain("index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    expect(billsRoute).toContain("`${SITE_URL}/bills`");
  });
});

import fs from "node:fs";
import { describe, expect, it } from "vitest";

const handbook = fs.readFileSync("src/routes/issues/texas-policy-handbook.tsx", "utf8");
const hub = fs.readFileSync("src/routes/issues/index.tsx", "utf8");
const sitemap = fs.readFileSync("src/routes/sitemap-pages[.]xml.ts", "utf8");

const REQUIRED_CHAPTERS = [
  "Texas government: who actually controls what?",
  "Taxes and spending: Texas has no personal state income tax, but government still has a price tag",
  "Energy: the grid, oil and gas, and the difference between operations and policy",
  "Border security and immigration: overlapping governments, distinct legal powers",
  "Education and parental rights: school choice, local districts and state rules",
  "Public safety, bail and constitutional rights",
  "Elections: rules, administration, candidates and results belong in different layers",
  "Healthcare and rural Texas: access is more than a hospital count",
  "Local government and preemption: city hall does not exist outside state law",
  "How to read Texas political claims without getting trapped by the headline",
] as const;

describe("Texas Policy Handbook authority layer", () => {
  it("retains all ten substantive policy chapters and primary-source navigation", () => {
    for (const chapter of REQUIRED_CHAPTERS) expect(handbook).toContain(chapter);
    expect((handbook.match(/title:/g) ?? []).length).toBeGreaterThanOrEqual(10);
    expect(handbook).toContain("Texas Constitution and statutes");
    expect(handbook).toContain("Texas Legislature Online");
    expect(handbook).toContain("Texas Legislative Budget Board");
    expect(handbook).toContain("Texas courts");
    expect(handbook).toContain('"@type": "Article"');
  });

  it("keeps the handbook discoverable from the Issues hub", () => {
    expect(hub).toContain('/issues/texas-policy-handbook');
    expect(hub).toContain('Texas Policy Handbook');
    expect(hub).toContain('Start here');
  });

  it("keeps the handbook in the static sitemap with a current lastmod", () => {
    expect(sitemap).toContain('"/issues/texas-policy-handbook"');
    expect(sitemap).toContain('HANDBOOK_REFRESH');
    expect(sitemap).toContain('2026-08-22T10:11:00-05:00');
  });
});

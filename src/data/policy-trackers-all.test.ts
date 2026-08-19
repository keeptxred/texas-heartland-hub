import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all";
import { POLICY_TRACKERS } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE2 } from "@/data/policy-trackers-wave2";
import { POLICY_TRACKERS_WAVE3 } from "@/data/policy-trackers-wave3";
import { POLICY_TRACKERS_WAVE4 } from "@/data/policy-trackers-wave4";
import { POLICY_TRACKERS_WAVE5 } from "@/data/policy-trackers-wave5";
import { POLICY_TRACKERS_WAVE6 } from "@/data/policy-trackers-wave6";
import { POLICY_TRACKERS_WAVE7 } from "@/data/policy-trackers-wave7";
import { POLICY_TRACKERS_WAVE8 } from "@/data/policy-trackers-wave8";
import { POLICY_TRACKERS_WAVE9 } from "@/data/policy-trackers-wave9";
import { POLICY_TRACKERS_WAVE10 } from "@/data/policy-trackers-wave10";

const expectedCount = [
  POLICY_TRACKERS,
  POLICY_TRACKERS_WAVE2,
  POLICY_TRACKERS_WAVE3,
  POLICY_TRACKERS_WAVE4,
  POLICY_TRACKERS_WAVE5,
  POLICY_TRACKERS_WAVE6,
  POLICY_TRACKERS_WAVE7,
  POLICY_TRACKERS_WAVE8,
  POLICY_TRACKERS_WAVE9,
  POLICY_TRACKERS_WAVE10,
].reduce((sum, wave) => sum + wave.length, 0);

describe("unified policy tracker registry", () => {
  it("contains every tracker exactly once", () => {
    expect(ALL_POLICY_TRACKERS).toHaveLength(expectedCount);
    const slugs = ALL_POLICY_TRACKERS.map((tracker) => tracker.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("is the source of truth for both the policy hub and sitemap", () => {
    const hubSource = readFileSync(new URL("../routes/policy.tsx", import.meta.url), "utf8");
    const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

    expect(hubSource).toContain('import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all"');
    expect(sitemapSource).toContain('import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all"');
    expect(sitemapSource).toContain("...ALL_POLICY_TRACKERS.map((tracker)=>`/policy/${tracker.slug}`)");
  });
});

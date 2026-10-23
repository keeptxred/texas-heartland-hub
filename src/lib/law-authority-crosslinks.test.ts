import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";
import { getLawGuideMeta } from "@/lib/law-guides";
import {
  authorityForSupportingGuideTopic,
  publicSupportingGuidesForAuthority,
} from "@/lib/law-authority-crosslinks";

describe("reciprocal Texas legal authority network", () => {
  it.each([
    ["driving", "driving-traffic-insurance-law"],
    ["landlord-tenant", "landlord-tenant-rentals-law"],
    ["employment", "employment-wages-workplace-rights-law"],
    ["family", "family-custody-child-support-law"],
    ["probate", "wills-probate-inheritance-law"],
    ["consumer", "consumer-protection-deceptive-trade-law"],
    ["elections", "election-law"],
    ["open-government", "open-records-public-information"],
  ] as const)("connects supporting %s guides to %s", (category, slug) => {
    expect(authorityForSupportingGuideTopic(category)?.slug).toBe(slug);
  });
  it("avoids inventing unrelated legal parent pages", () => {
    expect(authorityForSupportingGuideTopic("alcohol")).toBeNull();
    expect(authorityForSupportingGuideTopic("animals")).toBeNull();
  });
  it.each([
    "driving-traffic-insurance-law",
    "landlord-tenant-rentals-law",
    "employment-wages-workplace-rights-law",
    "family-custody-child-support-law",
    "wills-probate-inheritance-law",
    "consumer-protection-deceptive-trade-law",
  ])("only surfaces verified, public, canonically linked guides under %s", (slug) => {
    const guides = publicSupportingGuidesForAuthority(slug);
    expect(guides.length).toBeLessThanOrEqual(8);
    for (const guide of guides) {
      expect(guide.href.startsWith("/")).toBe(true);
      expect(guide.href).not.toContain("undefined");
      expect(ALL_GUIDES[guide.slug]).toBeDefined();
      expect(isSupportingGuideIndexable(ALL_GUIDES[guide.slug])).toBe(true);
      expect(getLawGuideMeta(guide.slug)?.status).toBe("verified");
    }
  });
  it("uses the same shared navigation in law frameworks and supporting guides", () => {
    const topic = readFileSync(new URL("../components/law-topic-page.tsx", import.meta.url), "utf8");
    const guide = readFileSync(new URL("../components/cornerstone-guide-page.tsx", import.meta.url), "utf8");
    expect(topic).toContain("publicSupportingGuidesForAuthority(topic.slug)");
    expect(topic).toContain("Explore detailed guides on this law");
    expect(guide).toContain("authorityForSupportingGuideTopic(lawMeta.topic)");
    expect(guide).toContain("Parent Texas law framework");
  });
});

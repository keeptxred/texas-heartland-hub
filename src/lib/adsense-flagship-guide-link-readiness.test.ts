import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

const FLAGSHIP_GUIDE_SLUGS = [
  "texas-agriculture-rural-guide",
  "texas-veterans-military-guide",
  "texas-law-enforcement-public-safety-guide",
] as const;

describe("AdSense flagship pillar guide link readiness", () => {
  it.each(FLAGSHIP_GUIDE_SLUGS)("keeps hard-coded pillar target %s index-ready", (slug) => {
    const guide = ALL_GUIDES[slug];
    expect(guide, `${slug}: missing guide content`).toBeDefined();
    expect(isSupportingGuideIndexable(guide), `${slug}: hard-coded pillar link points at an unready guide`).toBe(true);
  });
});

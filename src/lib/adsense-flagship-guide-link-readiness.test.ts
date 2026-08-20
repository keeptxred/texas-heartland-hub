import { describe, expect, it } from "vitest";
import { SUPPORTING_GUIDES } from "@/data/all-guides";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

const FLAGSHIP_GUIDE_SLUGS = [
  "texas-agriculture-rural-guide",
  "texas-veterans-military-guide",
  "texas-law-enforcement-public-safety-guide",
] as const;

describe("AdSense flagship pillar guide link readiness", () => {
  it.each(FLAGSHIP_GUIDE_SLUGS)("keeps hard-coded pillar target %s index-ready", (slug) => {
    const guide = SUPPORTING_GUIDES[slug];
    expect(guide, `${slug}: missing supporting-guide content`).toBeDefined();
    expect(isSupportingGuideIndexable(guide), `${slug}: hard-coded pillar link points at an unready guide`).toBe(true);
  });
});

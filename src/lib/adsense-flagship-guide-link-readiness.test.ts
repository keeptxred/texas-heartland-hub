import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

const READY_FLAGSHIP_GUIDE_SLUGS = ["texas-agriculture-rural-guide"] as const;

const UNREADY_FLAGSHIP_LINKS = [
  {
    slug: "texas-veterans-military-guide",
    route: "../routes/texas-veterans.tsx",
  },
  {
    slug: "texas-law-enforcement-public-safety-guide",
    route: "../routes/texas-law-enforcement.tsx",
  },
] as const;

describe("AdSense flagship pillar guide link readiness", () => {
  it.each(READY_FLAGSHIP_GUIDE_SLUGS)("keeps hard-coded pillar target %s index-ready", (slug) => {
    const guide = ALL_GUIDES[slug];
    expect(guide, `${slug}: missing guide content`).toBeDefined();
    expect(isSupportingGuideIndexable(guide), `${slug}: hard-coded pillar link points at an unready guide`).toBe(true);
  });

  it.each(UNREADY_FLAGSHIP_LINKS)("does not promote unready flagship $slug", ({ slug, route }) => {
    const guide = ALL_GUIDES[slug];
    expect(guide, `${slug}: missing guide content`).toBeDefined();
    expect(isSupportingGuideIndexable(guide), `${slug}: expected guide to remain below readiness`).toBe(false);

    const routeSource = fs.readFileSync(new URL(route, import.meta.url), "utf8");
    expect(routeSource).not.toContain(`/guides/${slug}`);
  });
});

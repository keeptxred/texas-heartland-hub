import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ALL_GUIDES, supportingGuidesForPillar } from "@/data/all-guides";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

const READY_FLAGSHIPS = [
  { slug: "texas-agriculture-rural-guide", pillarHref: "/texas-agriculture" },
  { slug: "texas-veterans-military-guide", pillarHref: "/texas-veterans" },
  { slug: "texas-law-enforcement-public-safety-guide", pillarHref: "/texas-law-enforcement" },
] as const;

describe("AdSense flagship pillar guide link readiness", () => {
  it.each(READY_FLAGSHIPS)("keeps ready flagship $slug index-ready", ({ slug }) => {
    const guide = ALL_GUIDES[slug];
    expect(guide, `${slug}: missing guide content`).toBeDefined();
    expect(isSupportingGuideIndexable(guide), `${slug}: flagship must satisfy the canonical readiness gate`).toBe(true);
  });

  it.each(READY_FLAGSHIPS.slice(1))(
    "promotes upgraded flagship $slug only through the readiness-aware pillar collection",
    ({ slug, pillarHref }) => {
      const readyPillarGuides = supportingGuidesForPillar(pillarHref).filter(isSupportingGuideIndexable);
      expect(readyPillarGuides.some((guide) => guide.slug === slug)).toBe(true);

      const routeFile = pillarHref === "/texas-veterans"
        ? "../routes/texas-veterans.tsx"
        : "../routes/texas-law-enforcement.tsx";
      const routeSource = fs.readFileSync(new URL(routeFile, import.meta.url), "utf8");
      expect(routeSource).not.toContain(`/guides/${slug}`);
    },
  );

  it("keeps the existing agriculture hard-coded flagship safe", () => {
    const routeSource = fs.readFileSync(new URL("../routes/texas-agriculture.tsx", import.meta.url), "utf8");
    expect(routeSource).toContain("/guides/texas-agriculture-rural-guide");
  });
});

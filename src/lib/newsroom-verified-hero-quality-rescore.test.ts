import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { scoreQuality } from "./content-quality";

const readiness = readFileSync("src/routes/api/public/hooks/article-hero-readiness-audit.ts", "utf8");

describe("regrade news article only after verified image acceptance", () => {
  it("updates the actual content score for all three licensed/verified hero acceptance paths", () => {
    expect(readiness).toContain('import { scoreQuality } from "@/lib/content-quality"');
    expect(readiness).toContain('content_quality_score: quality.score');
    expect(readiness).toContain('const quality = scoreQuality({ ...article, image_url: candidate });');
    expect(readiness.match(/await acceptApprovedHeroUpdate\(db, row, candidate, \{/g)).toHaveLength(3);
    expect(readiness).toContain('if (commonsFileTitle(candidate) && !commonsAudit.licenseVerified)');
    expect(readiness).toContain('if (verdict.matches && (verdict.visualClass === "exact_subject" || verdict.visualClass === "representative_scene"))');
    expect(readiness).toContain('if (isAuthoritativeOfficialGraphic(candidate))');
    expect(readiness).toContain('if (isGovernedExactEntityGraphic(row.slug, candidate))');
  });

  it("adds image score only for accepted image, never a failed candidate", () => {
    const article = {
      slug: "2026-11-07-valid-reporting",
      kind: "news",
      title: "Sourced report on Texas government decision",
      dek: "A timely reporting summary grounded in verified, publicly accessible state documents and clearly attributed evidence.",
      author: "Keep TX Red Newsroom",
      published_at: "2026-11-07T12:00:00Z",
      body: "Why This Matters: Texans can read the official record.",
      body_json: {
        intro: ["News about Texas government decisions."],
        sections: [{ heading: "Why This Matters", paragraphs: [("Sourced Texas government reporting. ").repeat(250)] }],
      },
    };
    const before = scoreQuality({ ...article, image_url: null });
    const after = scoreQuality({ ...article, image_url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Approved.jpg" });
    expect(after.score).toBe(before.score + 10);
    expect(before.flags).toContain("missing_image");
    expect(after.flags).not.toContain("missing_image");
  });
});

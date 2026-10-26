import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { newsroomOriginalReportKey } from "./newsroom-publication-preflight";

describe("KTR newsroom independent original-report and symbolic-email image safeguards", () => {
  it("normalizes syndicated long headlines despite punctuation and apostrophe differences", () => {
    const a = newsroomOriginalReportKey("As early voting begins in Texas, Gov. Abbott’s challenger Gina Hinojosa sues over Musk emails");
    const b = newsroomOriginalReportKey("As early voting begins in Texas, Gov Abbott's challenger Gina Hinojosa sues over Musk emails");
    expect(a).toBeTruthy();
    expect(a).toBe(b);
    expect(newsroomOriginalReportKey("Texas election news")).toBeNull();
  });

  it("provides an article-specific representative correspondence subject without impersonating actual records or candidates", () => {
    const code = readFileSync("src/lib/featured-image.functions.ts", "utf8");
    expect(code).toContain("const publicRecordsEmailsSuit");
    expect(code).toContain("photocopied email correspondence pages");
    expect(code).toContain("physical black redaction bars");
    expect(code).toContain("not courthouse architecture");
    expect(code).toContain("NO actual Hinojosa, Abbott, Musk");
    expect(code).toContain("?? publicRecordsEmailsSuit");
    expect(code).toContain('imageGroundingMode: "verified_symbolic"');
    expect(code).toContain("validateImageMatchesArticle(bytes, subject)");
    expect(code).toContain("if (!verdict.matches) throw new Error");
  });

  it("does not weaken the post-validation hold or allow a saved draft to publish without an image", () => {
    const server = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
    expect(server).toContain("newsroomHasPublisherDiversity(sources)");
    expect(server).toContain("await prepareFeaturedImageForUnpublishedNewsroomArticle");
    expect(server).toContain("if (!preparedImage.ok || !preparedImage.url || !preparedImage.imageValidationNote)");
    expect(server).toContain("newsroom_image_publication_hold:");
    expect(server).toContain('image_generation_status: "ready"');
  });
});

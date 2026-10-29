import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { canTrySecondVerifiedReserveImage } from "./reserve-image-recovery";
import { buildGenerationOnlyImagePrompt, buildRepeatedFailureRecoverySubject, newsroomAbstractPolicyVisualSubject } from "./featured-image.functions";
import { buildFlux2ImagePrompt } from "./featured-image-cloudflare";
import type { SubjectExtract } from "./featured-image-core";

describe("bounded second curated reserve on image story mismatch", () => {
  const publisher = readFileSync("src/routes/api/public/hooks/publishing-safety-net.ts", "utf8");
  const workflow = readFileSync(".github/workflows/run-daily-news-now.yml", "utf8");

  it("only permits a second source-backed article for a genuine image mismatch", () => {
    expect(canTrySecondVerifiedReserveImage("Generated image failed Cloudflare story-match/photorealism validation: wrong physical subject")).toBe(true);
    for (const error of [
      "Cloudflare Workers AI @cf/black-forest-labs/flux-2-klein-9b 500: Internal server error",
      "429 daily free allocation used up",
      "Generated image request blocked by moderation",
      "missing_image_provenance",
      "Storage upload failed",
      "Cloudflare Workers AI recovery failed after 500: 503",
    ]) expect(canTrySecondVerifiedReserveImage(error)).toBe(false);
  });

  it("tries at most two distinct prewritten stories and never skips image validation", () => {
    expect(publisher).toContain("RESERVE_ARTICLES.filter((article) => !publishedKeys.has(article.key)).slice(0, 2)");
    expect(publisher).toContain("canTrySecondVerifiedReserveImage(failure)");
    expect(publisher).toContain("await prepareFeaturedImageForUnpublishedNewsroomArticle");
    expect(publisher).toContain("if (!preparedImage.ok || !preparedImage.url || !preparedImage.imageValidationNote)");
    expect(publisher).toContain("reserve_newsroom_image_publication_hold:");
    expect(publisher).toContain('image_generation_status: "ready"');
    expect(publisher).toContain("Never publish more than one reserve article per stalled run");
    expect(workflow).toContain("--max-time 480");
    expect(workflow.match(/\/api\/public\/hooks\/publishing-safety-net/g)).toHaveLength(1);
  });

  it("preserves the Texas rulemaking hearing subject after actual Flux prompt truncation", () => {
    const subject: SubjectExtract = {
      title: "How Texas state agencies make rules",
      firstParagraph: "Texas state agencies publish proposed rules and accept comments.",
      entities: ["Texas"],
      locations: ["Texas"],
      domain: "politics",
      concreteSubject: "A public participation hearing and proposed-rule review.",
    };
    const row = { slug: "2026-10-29-how-texas-state-agencies-make-rules", title: subject.title };
    const verifiedScene = newsroomAbstractPolicyVisualSubject(row, subject);
    const retryScene = buildRepeatedFailureRecoverySubject(row, verifiedScene);
    const generatedPrompt = buildFlux2ImagePrompt(buildGenerationOnlyImagePrompt(retryScene));
    expect(verifiedScene.imageGroundingMode).toBe("verified_symbolic");
    expect(retryScene.concreteSubject).toBe(verifiedScene.concreteSubject);
    expect(generatedPrompt).toMatch(/PUBLIC-COMMENT TABLE/);
    expect(generatedPrompt).toMatch(/GOOSENECK MICROPHONES/);
    expect(generatedPrompt).toMatch(/OPEN BINDER/);
    expect(generatedPrompt).toMatch(/SUBMISSION FORM/);
    expect(generatedPrompt).toMatch(/EMPTY VISITOR CHAIRS/);
    expect(generatedPrompt).not.toMatch(/reading-room reference volume|generic office desk with a laptop/i);
    // The validator still uses the original verifiedScene; no image quality gate is bypassed.
    const publisher = readFileSync("src/lib/featured-image.functions.ts", "utf8");
    expect(publisher).toContain("validateImageMatchesArticle(bytes, subject)");
  });

  it("uses a source-matched, non-deceptive physical scene for the alternate Open Meetings guide", () => {
    const images = readFileSync("src/lib/featured-image.functions.ts", "utf8");
    expect(images).toContain('row.slug.endsWith("-texas-open-meetings-act-practical-guide")');
    expect(images).toContain("a physical bulletin board displaying several plainly formatted meeting-notice sheets");
    expect(images).toContain("It is NOT a photograph or reconstruction of any actual meeting or legal notice");
    expect(images).toContain("reserveRulemaking ?? reserveOpenMeetings");
  });
});

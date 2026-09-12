import { describe, expect, it } from "vitest";
import { lawGuideSeoTitle } from "@/lib/law-guide-seo";

describe("law guide SEO titles", () => {
  it("uses the shared branded fallback for an empty title", () => {
    expect(lawGuideSeoTitle("   ")).toBe("Texas Laws Explained | Keep TX Red");
  });

  it("adds the KTR brand to a short unbranded title", () => {
    expect(lawGuideSeoTitle("Texas HOA Laws")).toBe(
      "Texas HOA Laws | Keep TX Red",
    );
  });

  it("does not duplicate an existing KTR suffix", () => {
    expect(lawGuideSeoTitle("Texas HOA Laws | Keep TX Red")).toBe(
      "Texas HOA Laws | Keep TX Red",
    );
  });

  it("clamps long law guide titles at a word boundary", () => {
    const title = lawGuideSeoTitle(
      "Texas Homeowners Association Records, Meetings, Elections and Enforcement Laws",
    );

    expect(title).toBe("Texas Homeowners Association Records | Keep TX Red");
    expect(title.length).toBeLessThanOrEqual(60);
  });
});

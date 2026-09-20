import { describe, expect, it } from "vitest";
import { imageValidationDomainGuidance } from "./featured-image-cloudflare";
import type { SubjectExtract } from "./featured-image-core";

describe("general editorial image location guidance", () => {
  it("does not require generated representative scenes to prove a named city with signage or landmarks", () => {
    const subject: SubjectExtract = {
      title: "Denton wildlife shipment inspection",
      firstParagraph: "",
      entities: [],
      locations: ["Denton, Texas"],
      domain: "general",
      concreteSubject: "A parcel-shipping inspection workspace with reptile transport carriers and shipping cartons.",
    };

    const guidance = imageValidationDomainGuidance(subject);
    expect(guidance).toContain("Do not require visible city names, landmarks, logos, signage, or other geographic proof");
    expect(guidance).toContain("Continue to reject images that omit the assignment's defining physical objects or activity");
  });
});

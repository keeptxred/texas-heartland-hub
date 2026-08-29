import { describe, expect, it } from "vitest";
import { buildFlux2ImageRequest, buildFluxImagePrompt } from "./featured-image-cloudflare";

describe("FLUX validator-feedback sanitization", () => {
  it("keeps categorical exclusions but strips free-form rejected visual motif prose", () => {
    const finalPrompt = buildFluxImagePrompt(
      "A real Texas data-center campus with cooling equipment and electrical infrastructure.",
      "illustration, cartoon, politician, governor, readable text, rejected visual motif: The image is a graphic design showing Gov. Abbott beside a stylized data center, with a Texas-shaped poster",
    );

    expect(finalPrompt).toContain("HARD EXCLUSIONS: illustration, cartoon, politician, governor, readable text");
    expect(finalPrompt).not.toContain("rejected visual motif");
    expect(finalPrompt).not.toContain("Gov. Abbott");
    expect(finalPrompt).not.toContain("stylized data center");
  });

  it("keeps categorical negative prompts out of the single-field FLUX.2 request", () => {
    const form = buildFlux2ImageRequest(
      "A real Fort Worth interstate location photograph.",
      "people, victim, weapon, illustration, cartoon, poster, text",
    );
    const finalPrompt = String(form.get("prompt"));

    expect(finalPrompt).toContain("A real Fort Worth interstate location photograph.");
    expect(finalPrompt).not.toContain("HARD EXCLUSIONS");
    expect(finalPrompt).not.toMatch(/people, victim|weapon|illustration|cartoon|poster/i);
  });
});

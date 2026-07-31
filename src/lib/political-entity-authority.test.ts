import { describe, expect, it } from "vitest";
import { validatePoliticalEntityClaims } from "./political-entity-authority";

describe("validatePoliticalEntityClaims", () => {
  it("blocks the known state-district misclassification", () => {
    expect(
      validatePoliticalEntityClaims(
        "Ken Paxton and James Talarico battle for Texas Senate District 8",
      ).valid,
    ).toBe(false);
  });

  it("accepts the correctly identified federal race", () => {
    expect(
      validatePoliticalEntityClaims(
        "Ken Paxton and James Talarico compete in the 2026 Texas U.S. Senate race",
      ),
    ).toEqual({ valid: true, errors: [] });
  });
});

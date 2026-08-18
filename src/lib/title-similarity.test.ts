import { describe, expect, it } from "vitest";
import { isDuplicateTitle } from "./title-similarity";

describe("title similarity", () => {
  it("catches same-event rewrites with extra framing words", () => {
    expect(isDuplicateTitle(
      "Harris County Approves $2.5 Million for Local Investigation Into Fatal Houston ICE Shooting",
      "Harris County Approves $2.5 Million Local Investigation Into Fatal ICE Shooting",
    )).toBe(true);
  });

  it("catches the same campaign event when one headline adds office framing", () => {
    expect(isDuplicateTitle(
      "James Talarico Senate Campaign Moves to Houston for Major Campaign Event",
      "State Representative James Talarico Targets Federal Seat in Houston Campaign Event",
    )).toBe(true);
  });

  it("does not collapse merely topical Texas political stories", () => {
    expect(isDuplicateTitle(
      "Texas Senate advances property tax relief package",
      "Texas House committee debates school choice funding",
    )).toBe(false);
  });
});

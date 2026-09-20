import { describe, expect, it } from "vitest";
import { LAW_ENFORCEMENT_SECTIONS } from "./texas-law-enforcement";

describe("Texas law enforcement hub", () => {
  it("features the policing agencies comparison", () => {
    expect(LAW_ENFORCEMENT_SECTIONS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Texas Policing Agencies Compared",
          href: "/news/texas-policing-agencies-compared",
        }),
      ]),
    );
  });
});

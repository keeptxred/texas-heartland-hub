import { describe, expect, it } from "vitest";
import { applyGunLawsCurrentUpgrade } from "@/lib/static-gun-laws-current-upgrade";

describe("current Texas gun-law static upgrade", () => {
  it("replaces superseded age guidance and adds current official sources", () => {
    const body = {
      updated: "2026-07-15",
      sections: [
        {
          heading: "Age rules",
          paragraphs: [
            "Federal law sets the floor: 18 to purchase a long gun from an FFL, 21 to purchase a handgun from an FFL. Private long-gun sales to those 18 and over are permitted; private handgun sales to those under 21 are federally prohibited.",
            "Texas layers on the carry age: constitutional carry and the License to Carry both require you to be 21, with a narrow exception for active-duty and honorably discharged military members who may qualify at 18.",
          ],
        },
      ],
      sources: [],
    };

    const upgraded = applyGunLawsCurrentUpgrade(body);
    const text = upgraded.sections?.flatMap((section) => section.paragraphs ?? []).join(" ") ?? "";

    expect(upgraded).not.toBe(body);
    expect(upgraded.updated).toBe("2026-09-02");
    expect(text).toContain("18 to 20");
    expect(text).toContain("unlicensed resident of the same state");
    expect(text).not.toContain("private handgun sales to those under 21 are federally prohibited");
    expect(text).not.toContain("both require you to be 21");
    expect(upgraded.sources?.some((source) => source.url?.includes("dps.texas.gov"))).toBe(true);
    expect(upgraded.sources?.some((source) => source.url?.includes("sll.texas.gov"))).toBe(true);
    expect(upgraded.sources?.some((source) => source.url?.includes("atf.gov"))).toBe(true);
  });

  it("leaves unrelated article bodies untouched", () => {
    const body = { updated: "2026-09-01", sections: [{ heading: "Other", paragraphs: ["Unrelated text."] }] };
    expect(applyGunLawsCurrentUpgrade(body)).toBe(body);
  });
});

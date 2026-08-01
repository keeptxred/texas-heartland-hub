import { describe, expect, it } from "vitest";
import { billMentionSegments } from "./bill-mentions";

const bills = [
  { bill_identifier: "HB 12", legislature_number: 89, bill_type: "hb", bill_number: 12 },
];

describe("billMentionSegments", () => {
  it("links verified bill identifiers with flexible spacing", () => {
    expect(billMentionSegments("Lawmakers debated HB-12 today.", bills)).toEqual([
      { text: "Lawmakers debated " },
      { text: "HB-12", href: "/bills/texas/89/hb/12" },
      { text: " today." },
    ]);
  });
  it("does not link an identifier without a verified relationship", () => {
    expect(billMentionSegments("Lawmakers debated SB 4 today.", bills)).toEqual([
      { text: "Lawmakers debated SB 4 today." },
    ]);
  });
});

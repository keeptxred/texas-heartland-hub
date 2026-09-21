import { describe, expect, it } from "vitest";
import { normalizeHouseCommitteePayload } from "./normalize-house-committees.mjs";

describe("Texas House committee payload normalization", () => {
  it("preserves the legacy array payload", () => {
    expect(normalizeHouseCommitteePayload([
      { committeeName: "Calendars", position: "Member" },
      { committeeName: "Natural Resources", position: "Chair" },
    ])).toEqual([
      { committeeName: "Calendars", position: "Member" },
      { committeeName: "Natural Resources", position: "Chair" },
    ]);
  });

  it("accepts wrapper payloads and normalizes common field aliases", () => {
    expect(normalizeHouseCommitteePayload({
      data: {
        memberCommittees: [
          { name: "State Affairs", role: "Vice Chair" },
          { committee: "Ways & Means", memberPosition: "Member" },
        ],
      },
    })).toEqual([
      { committeeName: "State Affairs", position: "Vice Chair" },
      { committeeName: "Ways & Means", position: "Member" },
    ]);
  });

  it("fails closed on an unknown payload instead of publishing empty assignments", () => {
    expect(() => normalizeHouseCommitteePayload({ status: "ok", member: { id: 1 } }))
      .toThrow(/unsupported payload shape/i);
  });
});

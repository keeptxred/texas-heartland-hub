import { describe, expect, it } from "vitest";
import {
  classifyFacebookTopic,
  isRoutineGovernmentAppointment,
  rankFacebookCandidates,
} from "@/lib/facebook-editorial-selection";

describe("Facebook editorial selection", () => {
  it("blocks routine appointment headlines from automation", () => {
    expect(isRoutineGovernmentAppointment("Gov. Abbott Appoints Three Judges to Texas Courts")).toBe(true);
    expect(isRoutineGovernmentAppointment("Abbott Names New Members to State Commission")).toBe(true);
    expect(isRoutineGovernmentAppointment("Abbott Reappoints Two Members to an Advisory Board")).toBe(true);
  });

  it("does not treat a controversial appointment story as routine", () => {
    expect(isRoutineGovernmentAppointment("Abbott Appointment Draws Ethics Scrutiny and Lawsuit")).toBe(false);
  });

  it("recognizes different reader-interest topics", () => {
    expect(classifyFacebookTopic({ title: "Texas Puts New Data Center Grid Requests Under Audit", category: "Energy", kind: "news" })).toBe("energy");
    expect(classifyFacebookTopic({ title: "Paxton and Talarico Clash in Senate Race", category: "Elections", kind: "news" })).toBe("elections");
    expect(classifyFacebookTopic({ title: "Buc-ee’s Trademark Fight Goes National", category: "Non-Political", kind: "news" })).toBe("texas-culture");
  });

  it("prefers an interesting diverse story over another repeated election story", () => {
    const now = new Date("2026-08-18T12:00:00Z");
    const ranked = rankFacebookCandidates(
      [
        {
          title: "Another Texas Senate Campaign Poll Reshapes the Race",
          category: "Elections",
          kind: "news",
          is_breaking: false,
          score: 45,
          published_at: "2026-08-18T10:00:00Z",
        },
        {
          title: "Texas Data Center Power Requests Surge as Grid Scrutiny Intensifies",
          category: "Energy",
          kind: "news",
          is_breaking: false,
          score: 38,
          published_at: "2026-08-18T09:00:00Z",
        },
      ],
      [
        { title: "Paxton and Talarico Clash in Texas Senate Race", published_at: "2026-08-18T08:00:00Z" },
        { title: "Texas Court Upholds Election Integrity Law", published_at: "2026-08-18T06:00:00Z" },
      ],
      now,
    );

    expect(ranked[0].topic).toBe("energy");
    expect(ranked[0].candidate.title).toContain("Data Center");
  });

  it("never returns a routine appointment even when its raw score is high", () => {
    const ranked = rankFacebookCandidates(
      [
        {
          title: "Abbott Appoints Five Judges Across Texas",
          category: "Government",
          kind: "news",
          is_breaking: false,
          score: 100,
          published_at: "2026-08-18T10:00:00Z",
        },
        {
          title: "Buc-ee’s Trademark Fight Goes National After Legal Threat",
          category: "Non-Political",
          kind: "news",
          is_breaking: false,
          score: 30,
          published_at: "2026-08-18T09:00:00Z",
        },
      ],
      [],
      new Date("2026-08-18T12:00:00Z"),
    );

    expect(ranked).toHaveLength(1);
    expect(ranked[0].candidate.title).toContain("Buc-ee");
  });
});

import { describe, expect, it } from "vitest";
import { verifiedIssueGuideReviewDate } from "@/lib/issue-guide-review-evidence";

const now = new Date("2026-10-14T12:00:00.000Z");
const base = {
  sources: [{ label: "Texas Legislature", url: "https://capitol.texas.gov/" }],
  reviewSourceUrls: ["https://capitol.texas.gov/"],
  reviewedAt: "2026-10-13",
};

describe("issue guide review provenance", () => {
  it("accepts a documented date with matching cited HTTPS source", () => {
    expect(verifiedIssueGuideReviewDate(base, now)).toBe("2026-10-13");
  });
  it.each(["2026-10-15", "2026-02-30", "2026-13-01", "yesterday", "2026-10-14T00:00:00Z"])(
    "rejects invalid or future review date %s",
    (reviewedAt) => expect(verifiedIssueGuideReviewDate({ ...base, reviewedAt }, now)).toBeNull(),
  );
  it("rejects dates without documented checked sources", () => {
    expect(verifiedIssueGuideReviewDate({ ...base, reviewSourceUrls: [] }, now)).toBeNull();
  });
  it("rejects checked URLs not cited by the guide", () => {
    expect(verifiedIssueGuideReviewDate({ ...base, reviewSourceUrls: ["https://example.com/"] }, now)).toBeNull();
  });
  it("rejects insecure checked source URLs", () => {
    const url = "http://capitol.texas.gov/";
    expect(verifiedIssueGuideReviewDate({ ...base, sources: [{ label: "Source", url }], reviewSourceUrls: [url] }, now)).toBeNull();
  });
});

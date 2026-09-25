import { describe, expect, it } from "vitest";
import {
  electionSchedulePrimaryRecordNote,
  verifiedElectionSchedulePrimaryRecord,
} from "@/lib/election-schedule-primary-record";
import type { ClusterableFeedItem } from "@/lib/story-clustering";

function item(overrides: Partial<ClusterableFeedItem> = {}): ClusterableFeedItem {
  return {
    id: 3745344,
    title: "Texans have less than 3 weeks to register to vote for November 2026 midterm election",
    link: "https://www.houstonpublicmedia.org/elections/registration-deadline",
    source: "Houston Public Media",
    description: "Texas voters must register by Oct. 5 for the Nov. 3, 2026 general election.",
    pub_date: "2026-09-17T19:03:31Z",
    extracted_body: "",
    internal_slug: null,
    ...overrides,
  };
}

describe("verified election schedule primary record", () => {
  it("resolves the 2026 Texas registration schedule to the verified SOS record", () => {
    const record = verifiedElectionSchedulePrimaryRecord(item());
    expect(record).not.toBeNull();
    expect(record?.sourceName).toBe("Texas Secretary of State");
    expect(record?.sourceUrl).toContain("sos.texas.gov");
    expect(record?.registrationDeadline).toBe("2026-10-05");
    expect(record?.generalElectionDate).toBe("2026-11-03");

    const note = record
      ? electionSchedulePrimaryRecordNote(record, "Texas voter registration deadline for the November general election")
      : null;
    expect(note).toContain("October 5, 2026");
    expect(note).toContain("November 3, 2026");
  });

  it("does not attach the election calendar to a generic campaign story", () => {
    expect(verifiedElectionSchedulePrimaryRecord(item({
      title: "Texas gubernatorial candidates campaign in Houston",
      description: "The candidates appeared at separate campaign events across Texas.",
    }))).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { summarizeRepresentativeLegislativeActivity } from "@/components/representative-legislative-intelligence";

describe("representative legislative activity summary", () => {
  it("deduplicates bill records and reports enacted and latest-action counts", () => {
    const activity = summarizeRepresentativeLegislativeActivity([
      {
        id: "bill-1",
        bill_identifier: "HB 1",
        current_status_label: "Signed by governor",
        last_action_date: "2026-06-20",
        became_law: true,
      },
      {
        id: "bill-1",
        bill_identifier: "HB 1",
        current_status_label: "Signed by governor",
        last_action_date: "2026-06-20",
        became_law: true,
      },
      {
        id: "bill-2",
        bill_identifier: "HB 2",
        current_status_label: "Referred to committee",
        last_action_date: "2026-07-01",
        became_law: false,
      },
      {
        id: "bill-3",
        bill_identifier: "HB 3",
        current_status_label: "Referred to committee",
        last_action_date: null,
        became_law: false,
      },
    ]);

    expect(activity.billCount).toBe(3);
    expect(activity.becameLawCount).toBe(1);
    expect(activity.latestActionDate).toBe("2026-07-01");
    expect(activity.statusCounts).toEqual([
      { label: "Referred to committee", count: 2 },
      { label: "Signed by governor", count: 1 },
    ]);
  });

  it("does not invent activity when no sponsor-linked bills exist", () => {
    expect(summarizeRepresentativeLegislativeActivity([])).toEqual({
      billCount: 0,
      becameLawCount: 0,
      latestActionDate: null,
      statusCounts: [],
    });
  });
});

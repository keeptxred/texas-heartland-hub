import { describe, expect, it } from "vitest";
import { dailyBriefSelectionDefaults, selectDailyBriefItems, type DailyBriefCandidate } from "./newsroom-daily-brief";

function candidate(id: string, score: number, overrides: Partial<DailyBriefCandidate> = {}): DailyBriefCandidate {
  return {
    id,
    clusterId: `cluster-${id}`,
    editorialScore: score,
    recommendedFormat: "SINGLE",
    status: "PENDING",
    firstSeenAt: `2026-08-15T${String(10 + Number(id.replace(/\D/g, "") || 0) % 10).padStart(2, "0")}:00:00Z`,
    hasResearchPacket: true,
    ...overrides,
  };
}

describe("Texas Daily Brief deterministic selection", () => {
  it("reserves the strongest standalone slots and then selects the next strongest developments globally", () => {
    const rows = Array.from({ length: 15 }, (_, index) => candidate(String(index + 1), 100 - index));
    const selected = selectDailyBriefItems(rows);
    expect(selected.map((row) => row.editorialScore)).toEqual([92, 91, 90, 89, 88, 87, 86]);
  });

  it("does not use pillar quotas or require a particular daily mix", () => {
    const rows = Array.from({ length: 12 }, (_, index) => candidate(String(index + 1), 90 - index));
    const selected = selectDailyBriefItems(rows, { reservedStandaloneSlots: 2, maxItems: 5 });
    expect(selected).toHaveLength(5);
    expect(selected.map((row) => row.editorialScore)).toEqual([88, 87, 86, 85, 84]);
  });

  it("excludes items already selected, published, rejected, skipped, or lacking a packet", () => {
    const rows = [
      candidate("1", 90, { status: "SELECTED" }),
      candidate("2", 89, { status: "PUBLISHED" }),
      candidate("3", 88, { status: "REJECTED" }),
      candidate("4", 87, { recommendedFormat: "SKIP" }),
      candidate("5", 86, { hasResearchPacket: false }),
      candidate("6", 85),
    ];
    const selected = selectDailyBriefItems(rows, { reservedStandaloneSlots: 0 });
    expect(selected.map((row) => row.id)).toEqual(["6"]);
  });

  it("deduplicates clusters and applies a minimum editorial score", () => {
    const rows = [
      candidate("1", 60, { clusterId: "same" }),
      candidate("2", 59, { clusterId: "same" }),
      candidate("3", 34),
      candidate("4", 58),
    ];
    const selected = selectDailyBriefItems(rows, { reservedStandaloneSlots: 0 });
    expect(selected.map((row) => row.id)).toEqual(["1", "4"]);
  });

  it("keeps one briefing bounded and aligns standalone reserve with the eight normal daily slots", () => {
    expect(dailyBriefSelectionDefaults()).toEqual({ maxItems: 7, reservedStandaloneSlots: 8, minimumScore: 35 });
    const rows = Array.from({ length: 30 }, (_, index) => candidate(String(index + 1), 100 - index));
    expect(selectDailyBriefItems(rows)).toHaveLength(7);
  });
});

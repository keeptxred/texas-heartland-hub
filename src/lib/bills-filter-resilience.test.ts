import { describe, expect, it, vi } from "vitest";
import { loadOptionalBillFilterOptions } from "./bills-filter-resilience";

describe("bill directory optional filter fault isolation", () => {
  it("preserves valid filter options when the RPC succeeds", async () => {
    const value = { legislatures: [{ value: 89, label: "89th" }], billTypes: ["hb"], chambers: ["house"] };
    expect(await loadOptionalBillFilterOptions(async () => value)).toEqual(value);
  });
  it("returns empty optional filters rather than aborting successful bill page rendering", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(await loadOptionalBillFilterOptions(async () => { throw new Error("statement timeout"); })).toEqual({ legislatures: [], billTypes: [], chambers: [] });
      expect(log).toHaveBeenCalledTimes(1);
    } finally { log.mockRestore(); }
  });
});

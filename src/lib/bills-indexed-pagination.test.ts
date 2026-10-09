import { beforeEach, describe, expect, it, vi } from "vitest";

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: fromMock } }));

import { listBills } from "./bills";

type QueryResult = { data: unknown[] | null; count?: number | null; error?: Error | null };
type Call = { method: string; args: unknown[] };

function mockQuery(result: QueryResult) {
  const calls: Call[] = [];
  const builder: Record<string, any> = {};
  for (const method of ["select", "eq", "order", "range", "in", "or"]) {
    builder[method] = (...args: unknown[]) => {
      calls.push({ method, args });
      return builder;
    };
  }
  builder.then = (resolve: (result: QueryResult) => unknown, reject: (error: unknown) => unknown) =>
    Promise.resolve(result).then(resolve, reject);
  return { builder, calls };
}

describe("bill directory pagination under the public API timeout", () => {
  beforeEach(() => fromMock.mockReset());

  it("keeps first-page requests as one query with exact totals", async () => {
    const first = mockQuery({ data: [{ id: "a", caption: "First bill" }], count: 12786 });
    fromMock.mockReturnValueOnce(first.builder);
    const result = await listBills({ limit: 24, offset: 0 });
    expect(result).toEqual({ bills: [{ id: "a", caption: "First bill" }], count: 12786 });
    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(first.calls.find((call) => call.method === "select")?.args[0]).toContain("caption");
    expect(first.calls.find((call) => call.method === "select")?.args[1]).toEqual({ count: "exact" });
  });

  it("uses the indexed IDs before hydrating deep Senate pages and restores exact sorting", async () => {
    const first = mockQuery({ data: [{ id: "b" }, { id: "a" }], count: 4260 });
    const second = mockQuery({ data: [{ id: "a", caption: "Alpha" }, { id: "b", caption: "Bravo" }] });
    fromMock.mockReturnValueOnce(first.builder).mockReturnValueOnce(second.builder);
    const result = await listBills({ chamber: "senate", limit: 24, offset: 3936 });
    expect(result).toEqual({
      bills: [{ id: "b", caption: "Bravo" }, { id: "a", caption: "Alpha" }],
      count: 4260,
    });
    expect(fromMock).toHaveBeenCalledTimes(2);
    expect(first.calls.find((call) => call.method === "select")?.args).toEqual(["id", { count: "exact" }]);
    expect(first.calls.find((call) => call.method === "range")?.args).toEqual([3936, 3959]);
    expect(first.calls).toContainEqual({ method: "eq", args: ["is_active", true] });
    expect(first.calls).toContainEqual({ method: "eq", args: ["chamber", "senate"] });
    expect(second.calls.find((call) => call.method === "select")?.args[0]).toContain("caption");
    expect(second.calls).toContainEqual({ method: "in", args: ["id", ["b", "a"]] });
  });

  it("hydrates deep Legislature 89 results via indexed IDs without losing exact count or order", async () => {
    const first = mockQuery({ data: [{ id: "b" }, { id: "a" }], count: 12786 });
    const hydration = mockQuery({ data: [{ id: "a", caption: "A" }, { id: "b", caption: "B" }] });
    fromMock.mockReturnValueOnce(first.builder).mockReturnValueOnce(hydration.builder);
    const result = await listBills({ legislature: 89, limit: 24, offset: 12336 });
    expect(result).toEqual({ bills: [{ id: "b", caption: "B" }, { id: "a", caption: "A" }], count: 12786 });
    expect(fromMock).toHaveBeenCalledTimes(2);
    expect(first.calls.find((call) => call.method === "select")?.args).toEqual(["id", { count: "exact" }]);
    expect(first.calls).toContainEqual({ method: "eq", args: ["legislature_number", 89] });
    expect(first.calls).toContainEqual({ method: "range", args: [12336, 12359] });
    expect(hydration.calls).toContainEqual({ method: "in", args: ["id", ["b", "a"]] });
  });

  it("hydrates deep House committee-status results using existing status and chamber indexes", async () => {
    const first = mockQuery({ data: [{ id: "z" }, { id: "y" }], count: 5285 });
    const hydration = mockQuery({ data: [{ id: "y", caption: "Y" }, { id: "z", caption: "Z" }] });
    fromMock.mockReturnValueOnce(first.builder).mockReturnValueOnce(hydration.builder);
    const result = await listBills({ chamber: "house", status: "in-committee", limit: 24, offset: 4944 });
    expect(result).toEqual({ bills: [{ id: "z", caption: "Z" }, { id: "y", caption: "Y" }], count: 5285 });
    expect(fromMock).toHaveBeenCalledTimes(2);
    expect(first.calls.find((call) => call.method === "select")?.args).toEqual(["id", { count: "exact" }]);
    expect(first.calls).toContainEqual({ method: "eq", args: ["chamber", "house"] });
    expect(first.calls).toContainEqual({ method: "in", args: [
      "current_status_code", ["in-committee", "referred-to-committee", "scheduled-for-hearing", "reported-from-committee"],
    ] });
    expect(first.calls).toContainEqual({ method: "range", args: [4944, 4967] });
    expect(hydration.calls).toContainEqual({ method: "in", args: ["id", ["z", "y"]] });
  });

  it("uses the status index for deep status-only pages and preserves order, count and mapped status codes", async () => {
    const first = mockQuery({ data: [{ id: "b" }, { id: "a" }], count: 7458 });
    const hydration = mockQuery({ data: [{ id: "a", caption: "A" }, { id: "b", caption: "B" }] });
    fromMock.mockReturnValueOnce(first.builder).mockReturnValueOnce(hydration.builder);
    const result = await listBills({ status: "in-committee", limit: 24, offset: 6912 });
    expect(result).toEqual({ bills: [{ id: "b", caption: "B" }, { id: "a", caption: "A" }], count: 7458 });
    expect(fromMock).toHaveBeenCalledTimes(2);
    expect(first.calls.find((call) => call.method === "select")?.args).toEqual(["id", { count: "exact" }]);
    expect(first.calls).toContainEqual({ method: "in", args: [
      "current_status_code", ["in-committee", "referred-to-committee", "scheduled-for-hearing", "reported-from-committee"],
    ] });
    expect(first.calls).toContainEqual({ method: "range", args: [6912, 6935] });
    expect(hydration.calls).toContainEqual({ method: "in", args: ["id", ["b", "a"]] });
  });

  it("keeps short status-only pages as a single query", async () => {
    const first = mockQuery({ data: [{ id: "x", caption: "X" }], count: 7458 });
    fromMock.mockReturnValueOnce(first.builder);
    expect(await listBills({ status: "in-committee", offset: 24 })).toEqual({
      bills: [{ id: "x", caption: "X" }], count: 7458,
    });
    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(first.calls.find((call) => call.method === "select")?.args[0]).toContain("caption");
  });

  it("keeps unprofiled combined and bill-type filters as one query", async () => {
    for (const filters of [{ chamber: "house", billType: "hb" }, { legislature: 89, chamber: "senate" },
      { status: "in-committee", legislature: 89 }, { status: "signed", billType: "hb" }]) {
      fromMock.mockReset();
      const first = mockQuery({ data: [{ id: "original" }], count: 1 });
      fromMock.mockReturnValueOnce(first.builder);
      const result = await listBills({ ...filters, offset: 800 });
      expect(result).toEqual({ bills: [{ id: "original" }], count: 1 });
      expect(fromMock).toHaveBeenCalledTimes(1);
      expect(first.calls.find((call) => call.method === "select")?.args[0]).toContain("caption");
    }
  });

  it("does not issue a hydration query for an out-of-range deep page", async () => {
    const first = mockQuery({ data: [], count: 4260 });
    fromMock.mockReturnValueOnce(first.builder);
    expect(await listBills({ offset: 999999, chamber: "senate" })).toEqual({ bills: [], count: 4260 });
    expect(fromMock).toHaveBeenCalledTimes(1);
  });

  it("preserves existing one-query filtered-search behavior", async () => {
    const first = mockQuery({ data: [{ id: "match" }], count: 1 });
    fromMock.mockReturnValueOnce(first.builder);
    expect(await listBills({ offset: 800, search: "water" })).toEqual({ bills: [{ id: "match" }], count: 1 });
    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(first.calls.find((call) => call.method === "select")?.args[0]).toContain("caption");
    expect(first.calls.some((call) => call.method === "or")).toBe(true);
  });

  it("surfaces failures from either stage instead of inventing a partial bill list", async () => {
    const failingIndex = mockQuery({ data: null, error: new Error("index lookup failed") });
    fromMock.mockReturnValueOnce(failingIndex.builder);
    await expect(listBills({ offset: 999 })).rejects.toThrow("index lookup failed");
    expect(fromMock).toHaveBeenCalledTimes(1);

    fromMock.mockReset();
    const first = mockQuery({ data: [{ id: "a" }], count: 1 });
    const failingHydration = mockQuery({ data: null, error: new Error("hydration failed") });
    fromMock.mockReturnValueOnce(first.builder).mockReturnValueOnce(failingHydration.builder);
    await expect(listBills({ offset: 999 })).rejects.toThrow("hydration failed");
  });
});

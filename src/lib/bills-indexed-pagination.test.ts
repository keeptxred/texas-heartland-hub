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

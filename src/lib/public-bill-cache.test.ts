import { beforeEach, describe, expect, it, vi } from "vitest";
import { cachedPublicBill, clearPublicBillCache } from "./public-bill-cache";

beforeEach(() => { clearPublicBillCache(); vi.restoreAllMocks(); });

describe("bounded public bill cache", () => {
  it("shares in-flight queries and serves a short TTL hit", async () => {
    const loader = vi.fn().mockResolvedValue({ id: "hb-1" });
    const [a, b] = await Promise.all([
      cachedPublicBill("bill:1", loader, 60_000),
      cachedPublicBill("bill:1", loader, 60_000),
    ]);
    expect(a).toEqual(b);
    expect(await cachedPublicBill("bill:1", loader, 60_000)).toEqual(a);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("expires entries to reflect updated legislative records", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1000);
    const loader = vi.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(2);
    expect(await cachedPublicBill("bill:2", loader, 10_000)).toBe(1);
    now.mockReturnValue(11_001);
    expect(await cachedPublicBill("bill:2", loader, 10_000)).toBe(2);
  });

  it("does not cache failed or partial requests", async () => {
    const loader = vi.fn().mockRejectedValueOnce(new Error("statement timeout"))
      .mockResolvedValueOnce({ ready: false }).mockResolvedValueOnce({ ready: true });
    await expect(cachedPublicBill("bill:3", loader)).rejects.toThrow("statement timeout");
    expect(await cachedPublicBill("bill:3", loader, 60_000, (value) => (value as { ready: boolean }).ready)).toEqual({ ready: false });
    expect(await cachedPublicBill("bill:3", loader, 60_000, (value) => (value as { ready: boolean }).ready)).toEqual({ ready: true });
    expect(loader).toHaveBeenCalledTimes(3);
  });
});

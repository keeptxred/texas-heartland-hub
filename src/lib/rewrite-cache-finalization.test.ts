import { describe, expect, it } from "vitest";
import {
  failPendingRewriteClaimsForFeedItem,
  type RewriteCacheFinalizationClient,
} from "./rewrite-cache-finalization";

function makeClient(error: { message: string } | null = null) {
  const calls: Array<{ kind: string; args: unknown[] }> = [];
  const client: RewriteCacheFinalizationClient = {
    from(table) {
      calls.push({ kind: "from", args: [table] });
      return {
        update(values) {
          calls.push({ kind: "update", args: [values] });
          return {
            eq(column, value) {
              calls.push({ kind: "eq", args: [column, value] });
              return {
                eq(secondColumn, secondValue) {
                  calls.push({ kind: "eq", args: [secondColumn, secondValue] });
                  return Promise.resolve({ error });
                },
              };
            },
          };
        },
      };
    },
  };
  return { client, calls };
}

describe("rewrite cache crash finalization", () => {
  it("marks only pending claims for the crashed feed item as failed", async () => {
    const { client, calls } = makeClient();
    const result = await failPendingRewriteClaimsForFeedItem(client, 148913, "provider timeout");

    expect(result).toEqual({ ok: true });
    expect(calls).toContainEqual({ kind: "from", args: ["ai_rewrite_cache"] });
    expect(calls).toContainEqual({ kind: "eq", args: ["feed_item_id", 148913] });
    expect(calls).toContainEqual({ kind: "eq", args: ["status", "pending"] });
    const update = calls.find((call) => call.kind === "update")?.args[0] as Record<string, unknown>;
    expect(update.status).toBe("failed");
    expect(update.result_json).toBeNull();
    expect(update.failure_reason).toContain("provider timeout");
  });

  it("surfaces a database finalization error without masking it", async () => {
    const { client } = makeClient({ message: "write failed" });
    await expect(failPendingRewriteClaimsForFeedItem(client, 7, "boom")).resolves.toEqual({
      ok: false,
      error: "write failed",
    });
  });
});

import fs from "node:fs";
import { describe, expect, it } from "vitest";

const route = fs.readFileSync(
  new URL("../routes/api/public/hooks/build-newsroom-research-packets.ts", import.meta.url),
  "utf8",
);

describe("newsroom research packet capacity", () => {
  it("matches the 500-candidate scoring and decision pipeline", () => {
    expect(route).toContain("const CANDIDATE_LIMIT = 500");
    expect(route).toContain(".limit(CANDIDATE_LIMIT)");
  });

  it("remains zero-AI while increasing packet throughput", () => {
    expect(route).toContain("aiCalls: 0");
    expect(route).not.toContain("runCloudflareJson");
    expect(route).not.toContain("newsroom_reserve_ai_generation");
  });
  it("bounds feed hydration reads to avoid oversized PostgREST IN requests", () => {
    expect(route).toContain("const HYDRATION_ID_BATCH_SIZE = 100");
    expect(route).toContain("const HYDRATION_READ_CONCURRENCY = 2");
    expect(route).toContain("const feedIdBatches = chunkValues(feedIds, HYDRATION_ID_BATCH_SIZE)");
    expect(route).toContain("mapWithConcurrency(feedIdBatches, HYDRATION_READ_CONCURRENCY");
    expect(route).not.toContain('.in("id", feedIds)');
    expect(route).not.toContain('.in("feed_item_id", feedIds)');
  });

});

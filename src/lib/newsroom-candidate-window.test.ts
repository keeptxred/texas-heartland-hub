import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NEWSROOM_NEW_STORY_MAX_AGE_HOURS, newsroomNewStoryCutoff } from "@/lib/newsroom-candidate-window";

describe("new newsroom story selection window", () => {
  it("does not automatically re-spend AI calls on an editorially held candidate", () => {
    const generator = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
    expect(generator).toContain('.eq("status", "PENDING")');
    expect(generator).not.toContain('.in("status", ["PENDING", "HELD"])');
    expect(generator).toContain('.gte("created_at", newsroomNewStoryCutoff())');
  });

  it("bounds new candidate discovery to the previous 72 hours", () => {
    expect(NEWSROOM_NEW_STORY_MAX_AGE_HOURS).toBe(72);
    expect(newsroomNewStoryCutoff(new Date("2026-10-14T18:00:00Z"))).toBe("2026-10-11T18:00:00.000Z");
  });
});

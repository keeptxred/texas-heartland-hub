import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const route = readFileSync(
  "src/routes/api/public/hooks/cluster-newsroom-stories.ts",
  "utf8",
);

describe("newsroom cluster membership schema compatibility", () => {
  it("keeps membership weights inside the database 0..1 constraint", () => {
    expect(route).toContain("weight: 1");
    expect(route).not.toContain("weight: 1.2");
  });
});

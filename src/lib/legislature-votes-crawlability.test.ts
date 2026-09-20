import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../routes/texas-legislature.votes.tsx", import.meta.url), "utf8");

describe("legislature vote crawlability", () => {
  it("keeps vote pages crawlable when normalized data is unavailable", () => {
    expect(source).toContain("dataUnavailable: true");
    expect(source).toContain("Live normalized vote records are temporarily unavailable.");
    expect(source).not.toContain("throw voteError");
    expect(source).not.toContain("throw billError");
  });
});

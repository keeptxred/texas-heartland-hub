import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("published Texas law authority editorial quality", () => {
  it("uses reader-facing legal analysis instead of internal newsroom instructions", () => {
    const dir = "src/data";
    const authorityFiles = readdirSync(dir).filter((name) => /^law-topic-[a-z0-9-]+-authority\.ts$/.test(name));
    expect(authorityFiles.length).toBeGreaterThanOrEqual(18);
    const offenders = authorityFiles.filter((file) =>
      /\b(?:KTR|Keep TX Red) should\b/i.test(readFileSync(join(dir, file), "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});

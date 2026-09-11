import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import part1 from "./kimmel-talarico-fcc.webp.part1";
import part2 from "./kimmel-talarico-fcc.webp.part2";

describe("Kimmel-Talarico manual article image", () => {
  it("reassembles the expected WebP asset", () => {
    const bytes = Buffer.from(part1 + part2, "base64");

    expect(bytes.byteLength).toBe(12_920);
    expect(bytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(bytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(
      "ea969606f50cb87c85e51af1a48e547b1b93a894608d1febce29b9c1c5611df5",
    );
  });
});

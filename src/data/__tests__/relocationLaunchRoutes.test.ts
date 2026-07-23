import { describe, expect, test } from "bun:test";
import {
  LAUNCH_COUNTIES,
  LAUNCH_GUIDES,
  RELOCATION_LAUNCH_PATH,
} from "../relocationLaunch";

const countyPaths = LAUNCH_COUNTIES.map(
  (county) => `${RELOCATION_LAUNCH_PATH}/${county.slug}`,
);
const guidePaths = LAUNCH_GUIDES.map(
  (guide) => `${RELOCATION_LAUNCH_PATH}/guides/${guide.slug}`,
);

describe("Milestone 2 public route integrity", () => {
  test("builds unique, absolute county and guide routes", () => {
    const publicPaths = [RELOCATION_LAUNCH_PATH, ...countyPaths, ...guidePaths];

    expect(new Set(publicPaths).size).toBe(publicPaths.length);
    for (const path of publicPaths) {
      expect(path).toMatch(/^\/texas-relocation(?:\/|$)/);
      expect(path).not.toContain("//");
      expect(path).not.toMatch(/\s/);
    }
  });

  test("creates one county route for every launch county", () => {
    expect(countyPaths).toHaveLength(LAUNCH_COUNTIES.length);
    expect(countyPaths).toContain("/texas-relocation/harris");
    expect(countyPaths).toContain("/texas-relocation/fort-bend");
    expect(countyPaths).toContain("/texas-relocation/el-paso");
  });

  test("creates one guide route for every launch guide", () => {
    expect(guidePaths).toHaveLength(LAUNCH_GUIDES.length);
    expect(guidePaths).toContain(
      "/texas-relocation/guides/texas-property-tax-guide",
    );
    expect(guidePaths).toContain(
      "/texas-relocation/guides/moving-to-texas-guide",
    );
    expect(guidePaths).toContain(
      "/texas-relocation/guides/texas-cost-of-living-guide",
    );
    expect(guidePaths).toContain(
      "/texas-relocation/guides/choosing-a-texas-county",
    );
  });

  test("prevents county slugs from colliding with reserved route segments", () => {
    const reservedSegments = new Set(["guides", "tools", "api"]);
    for (const county of LAUNCH_COUNTIES) {
      expect(reservedSegments.has(county.slug)).toBe(false);
    }
  });
});

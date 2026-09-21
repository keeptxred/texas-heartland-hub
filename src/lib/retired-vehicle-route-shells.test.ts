import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { RETIRED_VEHICLE_EVERGREEN_PATHS } from "./vehicle-handoff-redirect";

function routeFileFor(path: string) {
  return `src/routes/vehicles.${path.slice("/vehicles/".length)}.tsx`;
}

describe("retired vehicle route shells", () => {
  it("keeps every retired vehicle route as a redirect-only shell", () => {
    for (const path of RETIRED_VEHICLE_EVERGREEN_PATHS) {
      const file = routeFileFor(path);
      const source = readFileSync(file, "utf8");

      expect(source).toContain(`createFileRoute("${path}")`);
      expect(source).toContain("The parent /vehicles route permanently hands off to TexasDefined");
      expect(source).not.toContain("buildSeo(");
      expect(source).not.toContain("component:");
      expect(source).not.toContain("<main");
      expect(source.length).toBeLessThan(500);
    }
  });
});

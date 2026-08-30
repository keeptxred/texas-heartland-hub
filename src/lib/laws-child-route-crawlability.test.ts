import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routes = [
  {
    file: "src/routes/laws_.constitutional-amendments.tsx",
    legacy: "src/routes/laws.constitutional-amendments.tsx",
    route: "/laws/constitutional-amendments",
    heading: "Texas Constitutional Amendments Tracker",
  },
  {
    file: "src/routes/laws_.effective-dates.tsx",
    legacy: "src/routes/laws.effective-dates.tsx",
    route: "/laws/effective-dates",
    heading: "Texas Laws Taking Effect in 2026",
  },
  {
    file: "src/routes/laws_.topics.tsx",
    legacy: "src/routes/laws.topics.tsx",
    route: "/laws/topics",
    heading: "Texas Law Library",
  },
] as const;

describe("Texas law child-route crawlability", () => {
  it("keeps substantive /laws children outside the /laws hub component hierarchy", () => {
    for (const entry of routes) {
      expect(existsSync(entry.file)).toBe(true);
      expect(existsSync(entry.legacy)).toBe(false);
    }
  });

  it("preserves the public URLs and unique page bodies", () => {
    for (const entry of routes) {
      const source = readFileSync(entry.file, "utf8");
      expect(source).toMatch(
        new RegExp(`createFileRoute\\([\\"']${entry.route.replaceAll("/", "\\/")}[\\"']\\)`),
      );
      expect(source).toContain(entry.heading);
    }
  });
});

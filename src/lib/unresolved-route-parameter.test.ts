import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hasUnresolvedPublicRouteParameter } from "./unresolved-route-parameter";

describe("unresolved public route parameters", () => {
  it.each([
    "/texas-sports/team/$team",
    "/texas-business/$topic",
    "/shop/$productId",
    "/authors/$slug",
    "/news/$slug",
    "/news/%24slug",
    "/representatives/$slug/",
  ])("rejects the literal template %s", (path) => {
    expect(hasUnresolvedPublicRouteParameter(path)).toBe(true);
  });

  it.each([
    "/news/how-a-bill-becomes-texas-law",
    "/texas-sports/team/aggies",
    "/shop/abc-123",
    "/representatives/angela-paxton",
    "/api/$metadata",
    "/news/price-$100",
  ])("preserves concrete and operational paths %s", (path) => {
    expect(hasUnresolvedPublicRouteParameter(path)).toBe(false);
  });

  it("runs before redirects so templates cannot become soft-404 destinations", () => {
    const source = readFileSync(new URL("../start.ts", import.meta.url), "utf8");
    const guard = source.indexOf("hasUnresolvedPublicRouteParameter(url.pathname)");
    expect(guard).toBeGreaterThan(0);
    expect(guard).toBeLessThan(source.indexOf("if (canRedirect && !excludedPath)"));
    expect(source.slice(guard, guard + 400)).toContain("status: 404");
  });
});

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function staticRedirects(): Map<string, { target: string; file: string }> {
  const redirects = new Map<string, { target: string; file: string }>();
  for (const file of walk("src/routes")) {
    if (!file.endsWith(".tsx")) continue;
    const source = readFileSync(file, "utf8");
    const routeMatch = source.match(/createFileRoute\(["']([^"']+)["']\)/);
    if (!routeMatch) continue;
    const route = routeMatch[1];
    if (route.includes("$") || route.includes("*")) continue;

    const redirectMatch = source.match(/\bredirect\s*\(\s*\{[\s\S]{0,320}?(?:href|to):\s*["'](\/[^"']*)["']/);
    if (!redirectMatch) continue;
    const target = redirectMatch[1].split(/[?#]/, 1)[0];
    if (!target || target.includes("$") || target.includes("*")) continue;
    redirects.set(route, { target, file });
  }
  return redirects;
}

describe("static redirect crawl health", () => {
  it("keeps internal static redirects one-hop and loop-free", () => {
    const redirects = staticRedirects();
    for (const [route, { target, file }] of redirects) {
      expect(target, `${file}: redirect must not point to itself (${route})`).not.toBe(route);
      const next = redirects.get(target);
      expect(
        next,
        `${file}: redirect chain detected: ${route} -> ${target} -> ${next?.target ?? ""}; point directly to the canonical destination`,
      ).toBeUndefined();
    }
  });
});

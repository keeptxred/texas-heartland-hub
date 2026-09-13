import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function walkTsx(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) files.push(...walkTsx(path));
    else if (path.endsWith(".tsx")) files.push(path);
  }
  return files;
}

const publicElectionFiles = [
  ...walkTsx(join(process.cwd(), "src/pages/elections")),
  ...walkTsx(join(process.cwd(), "src/components/elections")),
  ...readdirSync(join(process.cwd(), "src/routes"))
    .filter((name) => name.startsWith("elections") && name.endsWith(".tsx"))
    .map((name) => join(process.cwd(), "src/routes", name)),
  join(process.cwd(), "src/lib/elections/config.ts"),
  join(process.cwd(), "src/lib/elections/pollingSources.ts"),
];

describe("Election Central public brand contract", () => {
  it("uses Keep TX Red on public election surfaces while preserving social handles and machine IDs", () => {
    for (const path of publicElectionFiles) {
      const source = readFileSync(path, "utf8");
      expect(source, path).not.toMatch(/(^|[^@])\bKeepTXRed\b(?!-)/m);
    }
  });
});

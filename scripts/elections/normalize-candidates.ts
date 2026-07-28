import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FILE = path.join(ROOT, "src/data/elections/2026/candidates.json");
const records = JSON.parse(await readFile(FILE, "utf8"));
let changed = 0;

const output = records.map((candidate) => {
  const next = { ...candidate };
  if (next.incumbencyType === "unknown" && !next.currentOfficeId) {
    next.incumbencyType = "none";
  }
  if (next.profileDepth === "basic") next.profileDepth = "standard";
  if (JSON.stringify(next) !== JSON.stringify(candidate)) changed += 1;
  return next;
});

await writeFile(FILE, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Normalized ${changed} candidate record(s).`);

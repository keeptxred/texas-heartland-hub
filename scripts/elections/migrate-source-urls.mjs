import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const COLLECTIONS = ["cycle", "races", "candidates", "polls", "forecasts", "results"];
const URL_MIGRATIONS = new Map([
  [
    "https://electionresults.sos.state.tx.us/results.html",
    "https://goelect.txelections.civixapps.com/ivis-enr-ui/races",
  ],
]);

let replacements = 0;
for (const collection of COLLECTIONS) {
  const file = path.join(DATA_DIR, `${collection}.json`);
  const records = JSON.parse(await readFile(file, "utf8"));
  const migrated = migrate(records);
  await writeFile(file, `${JSON.stringify(migrated, null, 2)}\n`);
}

console.log(`Migrated ${replacements} retired election source URL reference(s).`);

function migrate(value) {
  if (Array.isArray(value)) return value.map(migrate);
  if (!value || typeof value !== "object") {
    if (typeof value === "string" && URL_MIGRATIONS.has(value)) {
      replacements += 1;
      return URL_MIGRATIONS.get(value);
    }
    return value;
  }
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, migrate(child)]));
}

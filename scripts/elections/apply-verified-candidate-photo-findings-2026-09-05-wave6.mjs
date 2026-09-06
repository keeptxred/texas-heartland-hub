#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));

const findings = [
  {
    candidateId: "candidate-stephen-samuelson-other-race-2026-lieutenant-governor",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/593f5909d482e9b762b70759/c1b7318a-2196-4579-b5ee-34acfecf86ca/ssamuelson.png",
    sourceUrl: "https://www.amarillopioneer.com/2026-primary-voter-guide/ssamuelson",
    altText: "Stephen Samuelson, 2026 Texas Lieutenant Governor write-in candidate",
    credit: "Stephen Samuelson campaign via The Amarillo Pioneer",
    license: null,
    permissionBasis: "The Amarillo Pioneer's 2026 candidate questionnaire identifies the exact candidate image as 'Samuelson/Photo via campaign' and publishes the candidate's complete submitted questionnaire. A September 1, 2026 Amarillo Pioneer election update independently confirms Stephen Samuelson as an accepted Texas Lieutenant Governor write-in candidate. Used only for narrow editorial candidate identification with exact campaign/newsroom attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "candidate-submitted-voter-guide-campaign-photo",
    discoveredAt: "2026-09-05T21:27:00.000-05:00"
  }
];

let applied = 0;
for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, finding);
  applied += 1;
}

await writeFile(
  manifestPath,
  JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
);
console.log(`Applied ${applied} verified campaign-supplied portrait(s).`);

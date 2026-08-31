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
    candidateId: "candidate-theodis-daniel-republican-race-2026-texas-house-147",
    imageUrl: "https://www.prlog.org/13108374-theodis-daniel-united-states-navy-veteran.jpg",
    sourceUrl: "https://www.prlog.org/13108374-statement-from-the-campaign-of-theodis-daniel-republican-for-us-congress-tx-18.html",
    altText: "Theodis Daniel, Republican candidate for Texas House District 147",
    credit: "Theodis Daniel campaign / Noble Marketing press materials via PRLog",
    license: null,
    permissionBasis: "The candidate campaign's October 31, 2025 press release identifies Theodis Daniel, provides a campaign media contact, and explicitly publishes a numbered Photos section including this candidate-specific portrait labeled 'Theodis Daniel United States Navy Veteran'. The same candidate now campaigns at theodisfortexas.com for Texas House District 147. Used narrowly for editorial candidate identification with exact campaign-press attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "campaign-press-release-media",
    discoveredAt: "2026-08-31T12:48:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from August 31 wave 17.`);

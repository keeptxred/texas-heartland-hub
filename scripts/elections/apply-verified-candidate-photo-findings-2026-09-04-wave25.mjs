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
    candidateId: "candidate-howard-olsen-republican-race-2026-texas-house-50",
    imageUrl: "https://i.imgur.com/TeyrSuX.jpeg",
    sourceUrl: "https://www.howardolsen4texas.com/",
    altText: "Howard Olsen, Republican candidate for Texas House District 50",
    credit: "Howard Olsen for HD50 campaign",
    license: null,
    permissionBasis: "Howard Olsen's official campaign homepage identifies him as the Republican candidate for Texas House District 50 and directly embeds this candidate-specific portrait with alt text 'Howard Olsen' in both the campaign hero and biography/record-of-service sections. The footer identifies the site as paid for by Howard Olsen for HD50. Used only for editorial candidate identification with exact official-campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-09-04T10:06:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 4 wave 25.`);

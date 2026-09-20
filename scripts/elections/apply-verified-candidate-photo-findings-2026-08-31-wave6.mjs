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
    candidateId: "candidate-fatima-la-juan-muse-democratic-race-2026-texas-house-2",
    imageUrl: "https://i0.wp.com/tx3dnews.com/wp-content/uploads/2026/08/fatima-headshot.webp?ssl=1&w=1110",
    sourceUrl: "https://tx3dnews.com/candidate-profile-fatima-lajuan-muse-texas-hd2/",
    altText: "Campaign headshot of Dr. Fatima La'Juan Muse, Democratic candidate for Texas House District 2",
    credit: "Dr. Fatima La'Juan Muse campaign via TX3DNews",
    license: null,
    permissionBasis: "TX3DNews's August 24, 2026 candidate profile identifies Dr. Fatima La'Juan Muse as the Democratic candidate for Texas House District 2, labels this exact image as a campaign headshot, and states 'Photo: Submitted by the campaign.' The page further states that the candidate-submitted information was provided to TX3DNews for its 2025–2026 election coverage. Used only for narrow editorial candidate identification with exact newsroom attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "candidate-supplied-newsroom-profile",
    discoveredAt: "2026-08-31T22:45:00.000-05:00"
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
console.log(`Applied ${applied} verified candidate portrait from August 31 wave 6.`);

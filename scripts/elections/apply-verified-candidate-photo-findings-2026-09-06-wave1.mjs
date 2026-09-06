#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Replay marker 2026-09-06 17:31 CT: re-run enrichment from current main after BallotReady source expansion.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));

const findings = [
  {
    candidateId: "candidate-jasmine-henderson-democratic-race-2026-texas-house-68",
    imageUrl: "https://img1.wsimg.com/isteam/ip/95e0fee8-005a-4d67-aa31-041281eda568/DSC02025.jpeg/:/rs=h:1000,cg:true,m",
    sourceUrl: "https://hendersonforhd68.com/",
    altText: "Jasmine Henderson, Democratic candidate for Texas House District 68",
    credit: "Jasmine Henderson for House District 68 campaign",
    license: null,
    permissionBasis: "Jasmine Henderson's official Texas House District 68 campaign website identifies her as the candidate and directly publishes this candidate-specific portrait on the campaign-controlled site. Used only for narrow editorial candidate identification with exact campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-site-portrait",
    discoveredAt: "2026-09-06T20:41:00.000Z"
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
console.log(`Applied ${applied} verified official campaign portrait(s).`);

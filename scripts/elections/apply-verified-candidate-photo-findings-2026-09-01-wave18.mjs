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
    candidateId: "candidate-gary-groves-republican-race-2026-texas-house-41",
    imageUrl: "https://img1.wsimg.com/isteam/ip/ee2951a2-9b5e-4066-ac2d-cc2266e50e6d/GOP%20Oath.jpg/%3A/cr%3Dt%3A18.91%25%2Cl%3A0%25%2Cw%3A100%25%2Ch%3A50%25/rs%3Dw%3A600%2Ch%3A300%2Ccg%3Atrue",
    sourceUrl: "https://garyfortexas.com/f/another-day-on-the-trail",
    altText: "Gary Groves, Republican candidate for Texas House District 41",
    credit: "Gary Groves Campaign",
    license: null,
    permissionBasis: "Gary Groves's official campaign biography identifies him as the Texas House District 41 candidate and publishes this candidate-specific photograph in the Meet Gary Groves biography section. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-09-01T12:44:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 1 wave 18.`);

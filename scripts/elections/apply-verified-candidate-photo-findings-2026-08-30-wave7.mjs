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
    candidateId: "candidate-krissy-guess-democratic-race-2026-texas-house-60",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/697916c7fa777e755b7bce96/7a9e0e37-7d83-48cb-9b0a-cc3ec905c694/Campaign%2BPhoto%2B2.jpg",
    sourceUrl: "https://www.krissyguessfortx.com/",
    altText: "Krissy Guess, Democratic candidate for Texas House District 60",
    credit: "Krissy Guess for Texas campaign",
    license: null,
    permissionBasis: "Krissy Guess's official campaign site identifies her as running in Texas House District 60 and publishes the candidate-specific asset named 'Campaign Photo 2.jpg' within the Meet Krissy section. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T18:26:00.000Z"
  },
  {
    candidateId: "candidate-chris-oldham-democratic-race-2026-texas-house-58",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/692f8a33068b2303fa76e803/41705e38-a97e-4ac8-b8e9-9683e63e3481/P1030503.JPG",
    sourceUrl: "https://www.oldham4texas.com/",
    altText: "Chris Oldham, Democratic candidate for Texas House District 58",
    credit: "Oldham for Texas Campaign",
    license: null,
    permissionBasis: "Chris Oldham's official campaign homepage identifies him as the Democratic candidate for Texas House District 58 and publishes this image directly with the alt text 'Photo of Chris Oldham'. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:26:00.000Z"
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
console.log(`Applied ${applied} verified candidate portraits from August 30 wave 7.`);

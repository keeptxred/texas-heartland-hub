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
    candidateId: "candidate-nathaniel-moran-republican-race-2026-us-house-1",
    imageUrl: "https://moran.house.gov/uploadedphotos/highresolution/88691a90-eaa4-4698-b3fa-0a8f6a3e970f.jpg",
    sourceUrl: "https://moran.house.gov/about/",
    altText: "Nathaniel Moran, Republican candidate for U.S. House Texas District 1",
    credit: "Office of U.S. Representative Nathaniel Moran",
    license: null,
    permissionBasis: "Official high-resolution congressional headshot published for download on the member's U.S. House website; used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-downloadable-headshot"
  },
  {
    candidateId: "candidate-august-pfluger-republican-race-2026-us-house-11",
    imageUrl: "https://pfluger.house.gov/uploadedphotos/highresolution/7af8ae14-2d20-4e15-9b8d-541cfff11571.jpg",
    sourceUrl: "https://pfluger.house.gov/about/about-august.htm",
    altText: "August Pfluger, Republican candidate for U.S. House Texas District 11",
    credit: "Office of U.S. Representative August Pfluger",
    license: null,
    permissionBasis: "Official high-resolution congressional headshot explicitly offered from the member's U.S. House biography page; used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-downloadable-headshot"
  },
  {
    candidateId: "candidate-jimmy-blacklock-republican-race-2026-texas-supreme-court-place-1",
    imageUrl: "https://www.txcourts.gov/media/1460030/chief-justice-jimmy-blacklock-web.jpg",
    sourceUrl: "https://www.txcourts.gov/supreme/about-the-court/justices/chief-justice-jimmy-blacklock/",
    altText: "Jimmy Blacklock, Republican candidate for Texas Supreme Court Place 1",
    credit: "Texas Judicial Branch",
    license: null,
    permissionBasis: "Official judicial portrait published on the Texas Judicial Branch biography page; used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-judicial-portrait"
  },
  {
    candidateId: "candidate-james-p-sullivan-republican-race-2026-texas-supreme-court-place-2",
    imageUrl: "https://www.txcourts.gov/media/1460010/justice-james-p-sullivan-2025-web.jpg",
    sourceUrl: "https://www.txcourts.gov/supreme/about-the-court/justices/justice-james-p-sullivan/",
    altText: "James P. Sullivan, Republican candidate for Texas Supreme Court Place 2",
    credit: "Texas Judicial Branch",
    license: null,
    permissionBasis: "Official judicial portrait published on the Texas Judicial Branch biography page; used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-judicial-portrait"
  },
  {
    candidateId: "candidate-kyle-hawkins-republican-race-2026-texas-supreme-court-place-7",
    imageUrl: "https://www.txcourts.gov/media/1461570/justice-kyle-hawkins.jpg",
    sourceUrl: "https://www.txcourts.gov/supreme/about-the-court/justices/justice-kyle-d-hawkins/",
    altText: "Kyle Hawkins, Republican candidate for Texas Supreme Court Place 7",
    credit: "Texas Judicial Branch",
    license: null,
    permissionBasis: "Official judicial portrait published on the Texas Judicial Branch biography page; used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-judicial-portrait"
  },
  {
    candidateId: "candidate-brett-busby-republican-race-2026-texas-supreme-court-place-8",
    imageUrl: "https://www.txcourts.gov/media/1461169/brett-busby.png",
    sourceUrl: "https://www.txcourts.gov/supreme/about-the-court/justices/justice-brett-busby/",
    altText: "Brett Busby, Republican candidate for Texas Supreme Court Place 8",
    credit: "Texas Judicial Branch",
    license: null,
    permissionBasis: "Official judicial portrait published on the Texas Judicial Branch biography page; used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-judicial-portrait"
  }
];

let applied = 0;
for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, { ...finding, discoveredAt: new Date().toISOString() });
  applied += 1;
}

await writeFile(
  manifestPath,
  JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
);
console.log(`Applied ${applied} verified official-government candidate portraits.`);

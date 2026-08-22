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
    candidateId: "candidate-keith-self-republican-race-2026-us-house-3",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rep._Keith_Self_official_photo%2C_118th_Congress.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Rep._Keith_Self_official_photo,_118th_Congress.jpg",
    altText: "Official congressional portrait of U.S. Representative Keith Self of Texas",
    credit: "United States Congress via Wikimedia Commons",
    license: "Public domain — U.S. Congress",
    permissionBasis: "Wikimedia Commons file page identifies the image as an official U.S. Congress portrait and public-domain federal government work.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-public-domain-us-congress"
  },
  {
    candidateId: "candidate-pat-fallon-republican-race-2026-us-house-4",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pat_Fallon%2C_official_portrait%2C_117th_Congress_%28cropped%29.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pat_Fallon,_official_portrait,_117th_Congress_(cropped).jpg",
    altText: "Official congressional portrait of U.S. Representative Pat Fallon of Texas",
    credit: "Office of U.S. Representative Pat Fallon via Wikimedia Commons",
    license: "Public domain — U.S. Congress",
    permissionBasis: "Wikimedia Commons file page identifies the portrait as a public-domain U.S. Congress image with House Creative Services metadata.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-public-domain-us-congress"
  },
  {
    candidateId: "candidate-lance-gooden-republican-race-2026-us-house-5",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lance_Gooden%2C_official_portrait%2C_116th_Congress.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lance_Gooden,_official_portrait,_116th_Congress.jpg",
    altText: "Official congressional portrait of U.S. Representative Lance Gooden of Texas",
    credit: "United States Congress via Wikimedia Commons",
    license: "Public domain — U.S. Congress",
    permissionBasis: "Wikimedia Commons file page identifies the image as the official congressional headshot and a public-domain U.S. Congress work.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-public-domain-us-congress"
  },
  {
    candidateId: "candidate-lizzie-pannill-fletcher-democratic-race-2026-us-house-7",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lizzie_Fletcher.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lizzie_Fletcher.jpg",
    altText: "Official congressional portrait of U.S. Representative Lizzie Fletcher of Texas",
    credit: "U.S. House of Representatives via Wikimedia Commons",
    license: "Public domain — U.S. federal government",
    permissionBasis: "Wikimedia Commons file page identifies the source as the official U.S. House portrait and the work as public domain under 17 U.S.C. § 105.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-public-domain-us-congress"
  },
  {
    candidateId: "candidate-sylvia-garcia-democratic-race-2026-us-house-29",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sylvia_Garcia%2C_official_portrait%2C_116th_Congress_%28cropped%29.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sylvia_Garcia,_official_portrait,_116th_Congress_(cropped).jpg",
    altText: "Official congressional portrait of U.S. Representative Sylvia Garcia of Texas",
    credit: "United States Congress via Wikimedia Commons",
    license: "Public domain — U.S. Congress",
    permissionBasis: "Wikimedia Commons file page marks the official congressional portrait as a public-domain U.S. Congress image.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-public-domain-us-congress"
  },
  {
    candidateId: "candidate-greg-casar-democratic-race-2026-us-house-37",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rep._Greg_Casar_-_118th_Congress.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Rep._Greg_Casar_-_118th_Congress.jpg",
    altText: "Official congressional portrait of U.S. Representative Greg Casar of Texas",
    credit: "U.S. House of Representatives via Wikimedia Commons",
    license: "Public domain — U.S. Congress",
    permissionBasis: "Wikimedia Commons file page identifies the image as an official U.S. House portrait and public-domain federal government work.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-public-domain-us-congress"
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
console.log(`Applied ${applied} verified public-domain congressional portraits.`);

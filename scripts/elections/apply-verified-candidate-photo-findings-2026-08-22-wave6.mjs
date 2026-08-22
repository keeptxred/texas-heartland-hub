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
    candidateId: "candidate-ken-paxton-republican-race-2026-us-senate",
    imageUrl: "https://www.texasattorneygeneral.gov/sites/default/files/inline-images/ken_paxton_bio_thumb.jpg",
    sourceUrl: "https://www.texasattorneygeneral.gov/about-office",
    altText: "Official portrait of Texas Attorney General Ken Paxton",
    credit: "Office of the Attorney General of Texas",
    license: null,
    permissionBasis: "Official Texas government biography portrait used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-texas-attorney-general-profile"
  },
  {
    candidateId: "candidate-allison-bush-democratic-race-2026-state-board-of-education-5",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6855b5e8df6e7f51f6ee6cfd/fedcb696-eea5-49c5-a94c-770ea4c9980f/IMG_8859.jpeg",
    sourceUrl: "https://www.allisonfortx.com/",
    altText: "Allison Bush, Democratic candidate for Texas State Board of Education District 5",
    credit: "Allison Bush campaign",
    license: null,
    permissionBasis: "Candidate portrait published on the official campaign homepage and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-tiffany-nelson-republican-race-2026-state-board-of-education-6",
    imageUrl: "https://static.wixstatic.com/media/130645_442aa3b8dfa94c10a6d1edabcd42d02b~mv2.jpeg/v1/fill/w_980%2Ch_653%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/image3%20%281%29.jpeg",
    sourceUrl: "https://www.tiffanynelsonfortexas.com/",
    altText: "Tiffany Nelson, Republican candidate for Texas State Board of Education District 6",
    credit: "Tiffany Nelson campaign",
    license: null,
    permissionBasis: "Candidate image published on the official campaign homepage in the campaign biography section and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-ericka-ledferd-democratic-race-2026-state-board-of-education-9",
    imageUrl: "https://static.wixstatic.com/media/nsplsh_909f297f020d4cd899ae0b4957273d0e~mv2.jpg/v1/fill/w_980%2Ch_1470%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/Image%20by%20Adam%20Thomas.jpg",
    sourceUrl: "https://www.ledferd4texas.com/",
    altText: "Ericka Ledferd, Democratic candidate for Texas State Board of Education District 9",
    credit: "Ledferd for SBOE 9 campaign; photograph credited on the campaign page to Adam Thomas",
    license: null,
    permissionBasis: "Candidate portrait published on the official campaign homepage directly under the candidate biography heading and used for editorial candidate identification with campaign attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
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
console.log(`Applied ${applied} verified statewide/SBOE candidate portrait(s) from wave 6.`);

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
    candidateId: "candidate-clayton-tucker-democratic-race-2026-agriculture-commissioner",
    imageUrl: "https://cdn.hihello.me/v/22317c2f-7102-437d-b5a8-18a472c39b85.png-small-preserve-ratio",
    sourceUrl: "https://hihello.com/hi/claytontuckertx",
    altText: "Clayton Tucker, Democratic candidate for Texas Agriculture Commissioner",
    credit: "Clayton Tucker campaign",
    license: null,
    permissionBasis: "Candidate campaign portrait published on the campaign's public digital business card, used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "direct-public-web-search"
  },
  {
    candidateId: "candidate-alfred-molison-jr-green-race-2026-agriculture-commissioner",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1784299947/alfred.jpg?1784299947=",
    sourceUrl: "https://www.txgreens.org/2026_nominated_candidates",
    altText: "Alfred Molison Jr., Green Party candidate for Texas Agriculture Commissioner",
    credit: "Green Party of Texas",
    license: null,
    permissionBasis: "Official party candidate-slate portrait used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "direct-public-web-search"
  },
  {
    candidateId: "candidate-nate-sheets-republican-race-2026-agriculture-commissioner",
    imageUrl: "https://www.texastribune.org/wp-content/uploads/2026/01/AgCo-Nate-Sheets-Campaign.jpg",
    sourceUrl: "https://www.texastribune.org/2026/01/27/texas-agriculture-commissioner-primary/",
    altText: "Nate Sheets, Republican candidate for Texas Agriculture Commissioner",
    credit: "Nate Sheets campaign via The Texas Tribune",
    license: null,
    permissionBasis: "Campaign-supplied candidate portrait published by The Texas Tribune, used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "direct-public-web-search"
  },
  {
    candidateId: "candidate-shehla-faizi-green-race-2026-comptroller",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6940b3b801659d28f153ab75/7f56185a-2012-4392-86ed-61f1c118f5fc/MomentsbyManar.Headshot-Shehla-2026-08.jpg",
    sourceUrl: "https://www.faizifortexas.com/",
    altText: "Shehla Faizi, Green Party candidate for Texas Comptroller",
    credit: "Shehla Faizi campaign / Moments by Manar",
    license: null,
    permissionBasis: "Candidate headshot published on the official campaign website, used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "direct-public-web-search"
  },
  {
    candidateId: "candidate-kevin-patrick-yeary-republican-race-2026-court-of-criminal-appeals-place-4",
    imageUrl: "https://www.txcourts.gov/media/1462538/yeary.jpg",
    sourceUrl: "https://www.txcourts.gov/cca/about-the-court/judges/judge-kevin-yeary/",
    altText: "Judge Kevin Patrick Yeary, Republican candidate for Texas Court of Criminal Appeals Place 4",
    credit: "Texas Judicial Branch",
    license: null,
    permissionBasis: "Official government portrait published by the Texas Judicial Branch, used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-profile"
  },
  {
    candidateId: "candidate-julie-pickren-republican-race-2026-state-board-of-education-7",
    imageUrl: "https://sboe.texas.gov/sites/default/files/2023-j-pickren-sboe7.jpg",
    sourceUrl: "https://sboe.texas.gov/state-board-of-education/sboe-board-members/sboe-member-district-7",
    altText: "Julie Pickren, Republican candidate for Texas State Board of Education District 7",
    credit: "Texas State Board of Education",
    license: null,
    permissionBasis: "Official government portrait published by the Texas State Board of Education, used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-profile"
  },
  {
    candidateId: "candidate-audrey-g-young-republican-race-2026-state-board-of-education-8",
    imageUrl: "https://sboe.texas.gov/sites/default/files/District%208-A%20Young.jpg",
    sourceUrl: "https://sboe.texas.gov/state-board-of-education/sboe-board-members/sboe-member-district-8",
    altText: "Audrey G. Young, Republican candidate for Texas State Board of Education District 8",
    credit: "Texas State Board of Education",
    license: null,
    permissionBasis: "Official government portrait published by the Texas State Board of Education, used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-profile"
  },
  {
    candidateId: "candidate-tiffany-clark-democratic-race-2026-state-board-of-education-13",
    imageUrl: "https://sboe.texas.gov/sites/default/files/clark-sboe-district-13.jpg",
    sourceUrl: "https://sboe.texas.gov/state-board-of-education/sboe-board-members/sboe-member-district-13",
    altText: "Tiffany Clark, Democratic candidate for Texas State Board of Education District 13",
    credit: "Texas State Board of Education",
    license: null,
    permissionBasis: "Official government portrait published by the Texas State Board of Education, used for editorial candidate identification with attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-profile"
  }
];

let applied = 0;
for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, { ...finding, discoveredAt: new Date().toISOString() });
  applied += 1;
}

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await writeFile(manifestPath, JSON.stringify(merged, null, 2) + "\n");
console.log(`Applied ${applied} direct web photo findings.`);

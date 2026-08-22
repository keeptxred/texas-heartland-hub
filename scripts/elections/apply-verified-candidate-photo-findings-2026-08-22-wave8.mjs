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
    candidateId: "candidate-vicente-gonzalez-democratic-race-2026-us-house-34",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Vicente_Gonzalez%2C_official_portrait%2C_118th_Congress_%28cropped%29.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vicente_Gonzalez,_official_portrait,_118th_Congress_(cropped).jpg",
    altText: "Official congressional portrait of U.S. Representative Vicente Gonzalez of Texas",
    credit: "U.S. House of Representatives via Wikimedia Commons",
    license: "Public domain — U.S. Congress",
    permissionBasis: "Wikimedia Commons identifies the image as an official U.S. House portrait by the U.S. House of Representatives and marks it public domain as a U.S. federal government work.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-public-domain-us-congress"
  },
  {
    candidateId: "candidate-colin-allred-democratic-race-2026-us-house-33",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Colin_Allred%2C_official_portrait%2C_117th_Congress_%283x4%29.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Colin_Allred,_official_portrait,_117th_Congress_(3x4).jpg",
    altText: "Official congressional portrait of former U.S. Representative Colin Allred of Texas",
    credit: "Ike Hayman, House Creative Services via Wikimedia Commons",
    license: "Public domain — U.S. Congress",
    permissionBasis: "Wikimedia Commons identifies the source as Representative Allred's official House biography, credits House Creative Services photographer Ike Hayman, and marks the image public domain as a U.S. Congress work.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-public-domain-us-congress"
  },
  {
    candidateId: "candidate-kevin-mccormick-green-race-2026-lieutenant-governor",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1784300285/kevin_M.jpg?1784300285=",
    sourceUrl: "https://www.txgreens.org/2026_nominated_candidates",
    altText: "Kevin McCormick, Green Party candidate for Lieutenant Governor of Texas",
    credit: "Green Party of Texas",
    license: null,
    permissionBasis: "Official Green Party of Texas 2026 nominated-candidate slate portrait used for editorial candidate identification with party attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-state-party-candidate-slate"
  },
  {
    candidateId: "candidate-espoir-ngabo-green-race-2026-us-house-7",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1768310337/d057fc31-03b2-4242-b289-b2528bece4a7.jpg?1768310337=",
    sourceUrl: "https://www.txgreens.org/2026_nominated_candidates",
    altText: "Espoir Ngabo, Green Party candidate for U.S. House District 7 in Texas",
    credit: "Green Party of Texas",
    license: null,
    permissionBasis: "Official Green Party of Texas 2026 nominated-candidate slate portrait used for editorial candidate identification with party attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-state-party-candidate-slate"
  },
  {
    candidateId: "candidate-alex-mcmenemy-green-race-2026-us-house-38",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1768313717/1a2e2914-7c7a-4edf-9b93-451ad78f23dc.jpg?1768313717=",
    sourceUrl: "https://www.txgreens.org/2026_nominated_candidates",
    altText: "Alex McMenemy, Green Party candidate for U.S. House District 38 in Texas",
    credit: "Green Party of Texas",
    license: null,
    permissionBasis: "Official Green Party of Texas 2026 nominated-candidate slate portrait used for editorial candidate identification with party attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-state-party-candidate-slate"
  },
  {
    candidateId: "candidate-greg-stoker-green-race-2026-us-house-31",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1768581805/Stoker_headshot.jpg?1768581805=",
    sourceUrl: "https://www.txgreens.org/2026_nominated_candidates",
    altText: "Greg Stoker, Green Party candidate for U.S. House District 31 in Texas",
    credit: "Green Party of Texas",
    license: null,
    permissionBasis: "Official Green Party of Texas 2026 nominated-candidate slate portrait used for editorial candidate identification with party attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-state-party-candidate-slate"
  },
  {
    candidateId: "candidate-arshia-papari-green-race-2026-texas-house-49",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1769540626/square_2.jpg?1769540626=",
    sourceUrl: "https://www.txgreens.org/2026_nominated_candidates",
    altText: "Arshia Papari, Green Party candidate for Texas House District 49",
    credit: "Green Party of Texas",
    license: null,
    permissionBasis: "Official Green Party of Texas 2026 nominated-candidate slate portrait used for editorial candidate identification with party attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-state-party-candidate-slate"
  },
  {
    candidateId: "candidate-julian-villarreal-green-race-2026-texas-senate-26",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1784300332/julian_v.jpg?1784300332=",
    sourceUrl: "https://www.txgreens.org/2026_nominated_candidates",
    altText: "Julian Villarreal, Green Party candidate for Texas Senate District 26",
    credit: "Green Party of Texas",
    license: null,
    permissionBasis: "Official Green Party of Texas 2026 nominated-candidate slate portrait used for editorial candidate identification with party attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-state-party-candidate-slate"
  },
  {
    candidateId: "candidate-marlon-duran-green-race-2026-us-house-28",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1768311357/IMG_8310.jpg?1768311357=",
    sourceUrl: "https://www.txgreens.org/2026_nominated_candidates",
    altText: "Marlon Duran, Green Party candidate for U.S. House District 28 in Texas",
    credit: "Green Party of Texas",
    license: null,
    permissionBasis: "Official Green Party of Texas 2026 nominated-candidate slate portrait used for editorial candidate identification with party attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-state-party-candidate-slate"
  },
  {
    candidateId: "candidate-eddie-espinoza-green-race-2026-us-house-34",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1767969290/EspinozaCampaignPhoto.jpg?1767969290=",
    sourceUrl: "https://www.txgreens.org/2026_nominated_candidates",
    altText: "Eddie Espinoza, Green Party candidate for U.S. House District 34 in Texas",
    credit: "Green Party of Texas",
    license: null,
    permissionBasis: "Official Green Party of Texas 2026 nominated-candidate slate portrait used for editorial candidate identification with party attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-state-party-candidate-slate"
  },
  {
    candidateId: "candidate-anissa-chilmeran-green-race-2026-texas-house-61",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1769363904/WhatsApp_Image_2026-01-25_at_11.50.04_AM.jpg?1769363904=",
    sourceUrl: "https://www.txgreens.org/2026_nominated_candidates",
    altText: "Anissa Chilmeran, Green Party candidate for Texas House District 61",
    credit: "Green Party of Texas",
    license: null,
    permissionBasis: "Official Green Party of Texas 2026 nominated-candidate slate portrait used for editorial candidate identification with party attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-state-party-candidate-slate"
  },
  {
    candidateId: "candidate-amy-taylor-democratic-race-2026-state-board-of-education-14",
    imageUrl: "https://i0.wp.com/amytaylortexas.com/wp-content/uploads/2026/04/AmyTaylor-Headshot-Circle-1.webp?resize=1024%2C1024&ssl=1",
    sourceUrl: "https://amytaylortexas.com/",
    altText: "Amy Taylor, Democratic candidate for Texas State Board of Education District 14",
    credit: "Amy Taylor for State Board of Education District 14 campaign",
    license: null,
    permissionBasis: "Candidate headshot published directly beside the official campaign site's Meet Amy Taylor biography and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-april-williams-moore-republican-race-2026-state-board-of-education-13",
    imageUrl: "https://aprilfortexas.com/_next/image?q=75&url=https%3A%2F%2Fcdn.durable.co%2Fblocks%2F2dDtMzXmsUx4c3jJrsDYkKXtWnMzZgsQfRXVMHnQwjZj3WnuzDJ9MN5lK7HIld9B.jpg&w=1920",
    sourceUrl: "https://aprilfortexas.com/meet-april-williams-moore",
    altText: "April Williams Moore, Republican candidate for Texas State Board of Education District 13",
    credit: "April Williams Moore campaign",
    license: null,
    permissionBasis: "Candidate image published on the official campaign's Meet April biography page and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-kason-huddleston-republican-race-2026-state-board-of-education-9",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68dc133a82d9d77b237c29c0/d49c04b5-d087-44ba-b3c7-43160ad05ed7/Dad%2Bheadshot.png",
    sourceUrl: "https://huddlestonfortexas.com/",
    altText: "Kason Huddleston, Republican candidate for Texas State Board of Education District 9",
    credit: "Kason Huddleston for Texas campaign",
    license: null,
    permissionBasis: "Candidate headshot published prominently on the official campaign homepage beside the campaign message and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-dana-van-de-walker-democratic-race-2026-state-board-of-education-8",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6907828b5a9d2d481a907164/bf841149-c1d1-4943-9c69-07c304143158/Untitled%2Bdesign%2B%2815%29.png",
    sourceUrl: "https://www.dana4txsboe8.com/about",
    altText: "Dana Van De Walker, Democratic candidate for Texas State Board of Education District 8",
    credit: "Dana for TX State Board of Education, District 8 campaign",
    license: null,
    permissionBasis: "Candidate image published on the official campaign's Meet Dana biography page and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-mica-arellano-republican-race-2026-state-board-of-education-5",
    imageUrl: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https%3A//assets.cdn.filesafe.space/ggxeWPIAhnIsXRqvLmwz/media/69f5774d8831cb2c6c9d2582.png",
    sourceUrl: "https://micatx.com/",
    altText: "Mica Arellano, Republican candidate for Texas State Board of Education District 5",
    credit: "Mica Arellano campaign",
    license: null,
    permissionBasis: "Candidate image published at the top of the official campaign homepage immediately with the Meet Mica Arellano introduction and used for editorial candidate identification with attribution and a source link.",
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 8.`);

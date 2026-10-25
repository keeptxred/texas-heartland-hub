/**
 * One-time owner-approved repair of the six TexasDefined fishing shirts.
 * This is an allowlisted tag-only update to existing Printify/Etsy IDs,
 * NOT a create/publish-products job. Do not expand without new approval.
 * Source of truth: TexasDefined docs/merchandising/texasdefined-fishing-launch-2026.json
 */
export const approvedFishingTagRepairs: ReadonlyArray<{
  job: string; printify: string; etsy: string; tags: string[];
}> = [
  {
    "job": "TDFISH2026P1_01",
    "printify": "6add2977878131e6ba0c3b39",
    "etsy": "4602532203",
    "tags": [
      "texas bass shirt",
      "bass fishing tee",
      "largemouth bass",
      "fishing t shirt",
      "texas angler",
      "fishing gift",
      "bass fisherman",
      "lake life shirt",
      "outdoor graphic tee",
      "freshwater fishing",
      "bass fishing gift",
      "fisherman apparel",
      "texas fishing"
    ]
  },
  {
    "job": "TDFISH2026P1_02",
    "printify": "6add29fdafea5e4b0809386a",
    "etsy": "4602533233",
    "tags": [
      "chasing largemouth",
      "largemouth shirt",
      "bass fishing shirt",
      "bass fishing gift",
      "fishing lure tee",
      "freshwater angler",
      "fisherman tee",
      "lake day shirt",
      "trophy bass",
      "texas fishing",
      "outdoor apparel",
      "angler gift",
      "fishing graphic"
    ]
  },
  {
    "job": "TDFISH2026P1_03",
    "printify": "6add29cfafea5e4b0809383b",
    "etsy": "4602558658",
    "tags": [
      "lake weekend tee",
      "lake life shirt",
      "texas lake shirt",
      "fishing boat tee",
      "lake cabin gift",
      "weekend fishing",
      "outdoors tee",
      "sunset lake",
      "lake trip shirt",
      "camping lake shirt",
      "fishing gift",
      "texas weekend",
      "boating shirt"
    ]
  },
  {
    "job": "TDFISH2026P1_04",
    "printify": "6add29d86437b9edf205a8bb",
    "etsy": "4602558740",
    "tags": [
      "texas tackle club",
      "fishing tackle tee",
      "vintage lures",
      "topwater lure",
      "fishing gear shirt",
      "crankbait shirt",
      "angler shirt",
      "lure collector",
      "tackle box gift",
      "texas fishing",
      "outdoor tee",
      "fisherman gift",
      "fishing club"
    ]
  },
  {
    "job": "TDFISH2026P1_05",
    "printify": "6add29de2f0d45364d02c4a6",
    "etsy": "4602558790",
    "tags": [
      "sunrise cast shirt",
      "fishing at sunrise",
      "angler graphic tee",
      "sunrise fishing",
      "morning fishing",
      "texas lake shirt",
      "boat fishing",
      "lake morning",
      "fisherman gift",
      "outdoor lifestyle",
      "fishing shirt",
      "fishing weekend",
      "quiet lake"
    ]
  },
  {
    "job": "TDFISH2026P1_06",
    "printify": "6add29e5c8a72b0cae01896a",
    "etsy": "4602533093",
    "tags": [
      "texas coastal tee",
      "redfish shirt",
      "saltwater fishing",
      "gulf coast tee",
      "red drum fishing",
      "coastal angler",
      "texas redfish",
      "fishing gift",
      "marsh fishing",
      "flats fishing",
      "shoreline tee",
      "inshore fishing",
      "saltwater angler"
    ]
  }
];

export function approvedFishingRepair(job: string, productId: string, shopId: string, kind: string, website: string) {
  if (shopId !== "28098650" || kind !== "shirt" || website !== "texasdefined") return null;
  return approvedFishingTagRepairs.find((plan) => plan.job === job && plan.printify === productId) ?? null;
}

export function matchesTags(actual: readonly string[] | undefined, desired: readonly string[]) {
  return Array.isArray(actual) && actual.length === desired.length && desired.every((tag, i) => actual[i] === tag);
}

// Lightweight, dependency-free entity/topic extractor tuned for Texas news.
// Deterministic keyword matcher — no AI call, safe to run on every ingest.

const ENTITY_DICT: Record<string, string[]> = {
  // People
  "Greg Abbott": ["greg abbott", "governor abbott", "gov. abbott"],
  "Dan Patrick": ["dan patrick", "lt. gov patrick", "lt gov patrick"],
  "Ken Paxton": ["ken paxton", "attorney general paxton", "ag paxton"],
  "Ted Cruz": ["ted cruz", "senator cruz", "sen. cruz"],
  "John Cornyn": ["john cornyn", "senator cornyn", "sen. cornyn"],
  // Places
  "Houston": ["houston", "harris county"],
  "Dallas": ["dallas", "dallas county"],
  "Austin": ["austin", "travis county"],
  "San Antonio": ["san antonio", "bexar county"],
  "Fort Worth": ["fort worth", "tarrant county"],
  "El Paso": ["el paso"],
  "Rio Grande Valley": ["rgv", "rio grande valley", "mcallen", "brownsville"],
  // Institutions
  "Texas Legislature": ["legislature", "capitol", "state senate", "state house", "house bill", "senate bill", " hb ", " sb "],
  "ERCOT": ["ercot", "power grid"],
  "TxDOT": ["txdot"],
  // Topics
  "Border": ["border", "migrant", "immigration", "cartel"],
  "Energy": ["oil", "gas", "permian", "energy", "grid"],
  "Elections": ["election", "ballot", "campaign", "voter", "primary"],
  "Taxes": ["property tax", "tax cut", "appraisal", "school tax"],
  "Education": ["school", "isd", "curriculum", "teacher", "student"],
};

export type ExtractedEntities = string[];

export function extractEntities(text: string): ExtractedEntities {
  const hay = ` ${text.toLowerCase()} `;
  const hits = new Set<string>();
  for (const [canonical, aliases] of Object.entries(ENTITY_DICT)) {
    if (aliases.some((a) => hay.includes(a))) hits.add(canonical);
  }
  return Array.from(hits);
}

export function inferCategory(entities: ExtractedEntities): string {
  if (entities.includes("Border")) return "Border";
  if (entities.includes("Elections")) return "Elections";
  if (entities.includes("Energy")) return "Energy";
  if (entities.includes("Taxes")) return "Tax & Spending";
  if (entities.includes("Education")) return "Education";
  if (entities.includes("Texas Legislature")) return "Legislature";
  return "Non-Political";
}

// Lifestyle classifier. Returns the DISPLAY name used by
// `CATEGORY_SLUG_TO_NAME` so rows land in the correct /texas-news filter
// when queried by `daily_articles.category`. Always returns a non-empty
// value so the NOT NULL column accepts the insert.
export type TexasNewsCategory =
  | "Economy"
  | "Housing"
  | "Growth & Migration"
  | "Education"
  | "Sports Culture"
  | "Culture & Identity";

export function classifyStory(text: string): TexasNewsCategory {
  const t = text.toLowerCase();
  if (t.includes("economy") || t.includes("job")) return "Economy";
  if (t.includes("rent") || t.includes("housing")) return "Housing";
  if (t.includes("border") || t.includes("immigration")) return "Growth & Migration";
  if (t.includes("school")) return "Education";
  if (t.includes("football") || t.includes("sports")) return "Sports Culture";
  return "Culture & Identity";
}
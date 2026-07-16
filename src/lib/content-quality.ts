// Content growth optimization helpers.
// Pure, deterministic post-processors that run inside the existing
// generation hooks. No new AI calls, no new automation pipelines.
//
// Every helper is safe to call on a partially populated row; missing
// input simply produces a lower score / empty output.

import { articleMainWordCount, requiredMainWordCountForKind } from "@/lib/article-length";

export type QualityRow = {
  slug: string;
  title?: string | null;
  dek?: string | null;
  body?: string | null;
  body_json?: unknown;
  category?: string | null;
  author?: string | null;
  image_url?: string | null;
  image_hash?: string | null;
  keywords?: string[] | null;
  seo_headline?: string | null;
  headline_variants?: { a?: string; b?: string } | null;
  published_at?: string | null;
  kind?: string | null;
};

// ─────────────────────────────────────────────────────────────
// Image quality scoring (0–100)
// ─────────────────────────────────────────────────────────────
const TEXAS_IMAGE_HINTS = [
  "texas", "tx-", "-tx", "houston", "dallas", "austin", "san-antonio",
  "fort-worth", "el-paso", "capitol", "alamo", "ercot", "border",
];
const STOCK_PENALTY_HOSTS = [
  "images.unsplash.com/photo-placeholder",
  "via.placeholder.com",
  "placehold.co",
  "picsum.photos",
];
const RELEVANT_HINTS = [
  "government", "capitol", "senate", "house", "election", "vote",
  "oil", "energy", "grid", "school", "map", "chart", "stadium",
];

export function scoreImage(input: {
  url?: string | null;
  title?: string | null;
  category?: string | null;
  imageHash?: string | null;
}): number {
  const url = (input.url ?? "").toLowerCase();
  if (!url) return 0;
  let score = 40; // baseline for having any image
  if (STOCK_PENALTY_HOSTS.some((h) => url.includes(h))) return 10;
  if (TEXAS_IMAGE_HINTS.some((h) => url.includes(h))) score += 25;
  if (RELEVANT_HINTS.some((h) => url.includes(h))) score += 15;
  const title = (input.title ?? "").toLowerCase();
  if (title && TEXAS_IMAGE_HINTS.some((h) => url.includes(h) && title.includes(h.replace(/[-]/g, " ")))) {
    score += 10;
  }
  // Local site-hosted images (own CDN) are trusted.
  if (url.includes("keeptxred.com/")) score += 10;
  return Math.max(0, Math.min(100, score));
}

// ─────────────────────────────────────────────────────────────
// Internal link picker (max 5)
// ─────────────────────────────────────────────────────────────
export type InternalLink = { label: string; href: string; kind: "hub" | "resource" | "evergreen" | "glossary" };

const CATEGORY_HUB: Record<string, InternalLink[]> = {
  "Tax & Spending": [
    { label: "Texas Property Tax Calculator", href: "/tax-calculator", kind: "resource" },
    { label: "Property Taxes in Texas (2026)", href: "/texas/property-taxes-2026", kind: "evergreen" },
  ],
  Elections: [
    { label: "Register to Vote in Texas", href: "/register-to-vote", kind: "resource" },
    { label: "Texas Candidate Guides", href: "/candidate-guides", kind: "resource" },
    { label: "Elections Hub", href: "/elections", kind: "hub" },
  ],
  Legislature: [
    { label: "Texas Politics", href: "/texas-politics", kind: "hub" },
    { label: "Legislative Updates", href: "/legislative-updates", kind: "resource" },
  ],
  Border: [
    { label: "Texas Politics", href: "/texas-politics", kind: "hub" },
  ],
  Energy: [
    { label: "Texas Business", href: "/texas-business", kind: "hub" },
    { label: "Texas Economy", href: "/texas-economy", kind: "hub" },
  ],
  Business: [
    { label: "Texas Business", href: "/texas-business", kind: "hub" },
    { label: "Texas Economy", href: "/texas-economy", kind: "hub" },
  ],
  Economy: [
    { label: "Texas Economy", href: "/texas-economy", kind: "hub" },
  ],
  Housing: [
    { label: "Moving to Texas (2026)", href: "/texas/moving-to-texas-2026", kind: "evergreen" },
  ],
  "Growth & Migration": [
    { label: "Moving to Texas (2026)", href: "/texas/moving-to-texas-2026", kind: "evergreen" },
  ],
  Education: [
    { label: "Laws to Know", href: "/laws-to-know", kind: "resource" },
  ],
  Politics: [
    { label: "Texas Politics", href: "/texas-politics", kind: "hub" },
  ],
  Laws: [
    { label: "Texas Laws", href: "/texas-laws", kind: "hub" },
    { label: "Laws to Know", href: "/laws-to-know", kind: "resource" },
  ],
  Sports: [
    { label: "Texas Sports", href: "/texas-sports", kind: "hub" },
  ],
  NFL: [{ label: "Texas Sports", href: "/texas-sports", kind: "hub" }],
  MLB: [{ label: "Texas Sports", href: "/texas-sports", kind: "hub" }],
  NBA: [{ label: "Texas Sports", href: "/texas-sports", kind: "hub" }],
  "Non-Political": [
    { label: "Texas News", href: "/texas-news", kind: "hub" },
  ],
};

const ALWAYS_AVAILABLE: InternalLink[] = [
  { label: "Glossary", href: "/glossary", kind: "glossary" },
  { label: "Latest Texas News", href: "/news", kind: "hub" },
];

export function pickInternalLinks(input: {
  category?: string | null;
  title?: string | null;
  keywords?: string[] | null;
}): InternalLink[] {
  const out: InternalLink[] = [];
  const seen = new Set<string>();
  const push = (l: InternalLink) => {
    if (seen.has(l.href) || out.length >= 5) return;
    seen.add(l.href);
    out.push(l);
  };
  const cat = input.category ?? "";
  (CATEGORY_HUB[cat] ?? []).forEach(push);

  // Keyword-driven additions
  const hay = `${input.title ?? ""} ${(input.keywords ?? []).join(" ")}`.toLowerCase();
  if (/property tax|appraisal|homestead/.test(hay)) {
    push({ label: "Texas Property Tax Calculator", href: "/tax-calculator", kind: "resource" });
    push({ label: "Property Taxes in Texas (2026)", href: "/texas/property-taxes-2026", kind: "evergreen" });
  }
  if (/vote|ballot|election|primary/.test(hay)) {
    push({ label: "Register to Vote in Texas", href: "/register-to-vote", kind: "resource" });
  }
  if (/moving|relocat|newcomer/.test(hay)) {
    push({ label: "Moving to Texas (2026)", href: "/texas/moving-to-texas-2026", kind: "evergreen" });
  }

  ALWAYS_AVAILABLE.forEach(push);
  return out.slice(0, 5);
}

// ─────────────────────────────────────────────────────────────
// Texas-specific analysis layer
// ─────────────────────────────────────────────────────────────
export type Region = "statewide" | "houston" | "dfw" | "austin" | "san-antonio" | "rural";

const REGION_KEYWORDS: Record<Region, RegExp> = {
  statewide: /\btexas|statewide|the state|austin capitol\b/i,
  houston: /\bhouston|harris county|katy|sugar land|cypress|the woodlands|galveston\b/i,
  dfw: /\bdallas|fort worth|arlington|plano|tarrant|collin county|dfw\b/i,
  austin: /\baustin|travis county|round rock|hays county\b/i,
  "san-antonio": /\bsan antonio|bexar county\b/i,
  rural: /\brural|small town|farm|ranch|county seat|permian\b/i,
};

export function classifyRegions(text: string): Region[] {
  const out: Region[] = [];
  for (const [region, re] of Object.entries(REGION_KEYWORDS) as [Region, RegExp][]) {
    if (re.test(text)) out.push(region);
  }
  return out;
}

export function buildTexasImpactSummary(text: string, regions: Region[]): string {
  if (regions.length === 0) return "";
  const readable: Record<Region, string> = {
    statewide: "statewide",
    houston: "the Houston metro",
    dfw: "Dallas–Fort Worth",
    austin: "the Austin area",
    "san-antonio": "San Antonio",
    rural: "rural Texas",
  };
  const names = regions.map((r) => readable[r]);
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  // Very light templated sentence; keeps schema populated without inventing facts.
  return `Impact is most direct across ${list}. Local officials and residents there are most likely to see effects in policy, cost, or day-to-day life.`;
}

// ─────────────────────────────────────────────────────────────
// Content quality score (0–100) + flags
// ─────────────────────────────────────────────────────────────
export type QualityResult = { score: number; flags: string[] };

function bodyToText(row: QualityRow): string {
  if (typeof row.body === "string" && row.body.length > 0) return row.body;
  try {
    const b = row.body_json as
      | { intro?: string[]; sections?: { heading?: string; paragraphs?: string[]; bullets?: string[] }[] }
      | null
      | undefined;
    const parts: string[] = [];
    (b?.intro ?? []).forEach((p) => parts.push(p));
    (b?.sections ?? []).forEach((s) => {
      if (s.heading) parts.push(s.heading);
      (s.paragraphs ?? []).forEach((p) => parts.push(p));
      (s.bullets ?? []).forEach((p) => parts.push(p));
    });
    return parts.join(" ");
  } catch {
    return "";
  }
}

export function scoreQuality(row: QualityRow): QualityResult {
  const flags: string[] = [];
  let score = 0;
  const text = bodyToText(row);
  const wc = articleMainWordCount(row.body_json as never) || text.trim().split(/\s+/).filter(Boolean).length;
  const requiredWords = requiredMainWordCountForKind(row.kind);

  // Structural fields
  if (row.title && row.title.trim().length >= 20) score += 10; else flags.push("weak_title");
  if (row.dek && row.dek.trim().length >= 80) score += 10; else flags.push("weak_dek");
  if (row.author && row.author.trim().length > 0) score += 10; else flags.push("missing_author");
  if (row.published_at) score += 5; else flags.push("missing_publish_date");
  if (row.image_url) score += 10; else flags.push("missing_image");

  // Body substance
  if (wc >= Math.floor(requiredWords / 2)) score += 10;
  if (wc >= requiredWords) score += 15;
  if (wc < requiredWords) flags.push("thin_body");

  // Required editorial sections (heuristic match on rendered text)
  const has = (needle: RegExp) => needle.test(text);
  if (has(/why this matters/i)) score += 8; else flags.push("missing_why_this_matters");
  if (has(/impact on texans|texas angle|for texans/i)) score += 8;
  if (has(/faq|frequently asked|reader question/i)) score += 4;
  if (has(/key takeaway|takeaways/i)) score += 5;

  // Texas relevance
  if (has(/texas|houston|dallas|austin|san antonio|fort worth|lone star/i)) score += 5;
  else flags.push("missing_texas_context");

  return { score: Math.max(0, Math.min(100, score)), flags };
}

// ─────────────────────────────────────────────────────────────
// Affiliate opportunity tagging
// ─────────────────────────────────────────────────────────────
export type AffiliateCategory =
  | "moving" | "homes" | "insurance" | "energy" | "business" | "travel" | "products" | "services";

export function detectAffiliateCategory(text: string): AffiliateCategory | null {
  const t = text.toLowerCase();
  if (/moving to texas|relocat|newcomer|move here/.test(t)) return "moving";
  if (/mortgage|home ?buyer|realtor|housing market|first-time buyer/.test(t)) return "homes";
  if (/insurance|home insurance|auto insurance|health plan/.test(t)) return "insurance";
  if (/electricity|power plan|utility|solar|wind|energy provider/.test(t)) return "energy";
  if (/business|startup|small business|entrepreneur|llc/.test(t)) return "business";
  if (/travel|vacation|visit texas|road trip|state park/.test(t)) return "travel";
  if (/product review|best (of|for)|buying guide|gift guide/.test(t)) return "products";
  if (/service|contractor|hiring|professional/.test(t)) return "services";
  return null;
}

// ─────────────────────────────────────────────────────────────
// One-shot enrichment: mutates a row in place with the new columns.
// Called from every generation hook right before .upsert().
// ─────────────────────────────────────────────────────────────
export function enrichArticleRow<T extends QualityRow>(row: T): T {
  const text = `${row.title ?? ""} ${row.dek ?? ""} ${bodyToText(row)}`;

  const regions = classifyRegions(text);
  const impact = buildTexasImpactSummary(text, regions);
  const affiliate = detectAffiliateCategory(text);
  const links = pickInternalLinks({
    category: row.category ?? null,
    title: row.title ?? null,
    keywords: row.keywords ?? null,
  });
  const imageScore = scoreImage({
    url: row.image_url ?? null,
    title: row.title ?? null,
    category: row.category ?? null,
    imageHash: row.image_hash ?? null,
  });
  const quality = scoreQuality(row);

  const bag = row as unknown as Record<string, unknown>;
  bag.affected_regions = regions.length > 0 ? regions : null;
  bag.texas_impact_summary = impact || null;
  bag.affiliate_category = affiliate;
  bag.internal_links = links;
  bag.image_score = imageScore;
  bag.content_quality_score = quality.score;
  bag.quality_flags = quality.flags.length > 0 ? quality.flags : null;

  return row;
}
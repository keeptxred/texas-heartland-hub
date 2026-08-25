const SITE_URL = "https://texasdefined.com";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const MERCHANT_FEED_URL = `${SITE_URL}/google-merchant-feed.xml`;
const FETCH_TIMEOUT_MS = 8_000;
const MAX_CHILD_SITEMAPS = 8;
const MAX_PAGE_METADATA_FETCHES = 16;

export type TexasDefinedFacebookImageKind =
  | "engagement"
  | "fact"
  | "seasonal"
  | "shop"
  | "lake_level"
  | string;

export type ResolvedTexasDefinedFacebookImage = {
  imageUrl: string;
  sourcePageUrl: string;
  sourceTitle: string;
  strategy: "merchant-product" | "site-content";
};

type PageMetadata = {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
};

type MerchantProduct = {
  title: string;
  link: string;
  imageUrl: string;
};

const STOP_WORDS = new Set([
  "a",
  "about",
  "actually",
  "all",
  "and",
  "are",
  "around",
  "at",
  "be",
  "been",
  "best",
  "but",
  "can",
  "could",
  "do",
  "does",
  "every",
  "favorite",
  "first",
  "for",
  "from",
  "get",
  "have",
  "how",
  "if",
  "in",
  "is",
  "it",
  "like",
  "make",
  "most",
  "of",
  "on",
  "one",
  "or",
  "our",
  "right",
  "see",
  "should",
  "something",
  "that",
  "the",
  "their",
  "them",
  "there",
  "they",
  "this",
  "to",
  "today",
  "too",
  "up",
  "was",
  "we",
  "what",
  "when",
  "where",
  "which",
  "who",
  "with",
  "would",
  "you",
  "your",
  "texas",
  "texan",
  "texans",
]);

function hash32(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function decodeSocialImageEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, digits: string) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .trim();
}

function normalizeSearchText(value: string): string {
  return decodeSocialImageEntities(value)
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function addTerms(target: Set<string>, ...values: string[]): void {
  for (const value of values) {
    const normalized = normalizeSearchText(value);
    if (normalized.length >= 3) target.add(normalized);
  }
}

export function texasDefinedImageTopicTerms(message: string, kind: TexasDefinedFacebookImageKind): string[] {
  const normalized = normalizeSearchText(message);
  const terms = new Set<string>();

  for (const token of normalized.split(" ")) {
    if (token.length >= 4 && !STOP_WORDS.has(token)) terms.add(token);
  }

  if (/drive|road|route|highway|scenic/.test(normalized)) {
    addTerms(terms, "road trip", "scenic drive", "highway", "hill country", "roadside");
  }
  if (/lake|river|swim|water|spring|gulf|coast|beach|cool off|reservoir/.test(normalized) || kind === "lake_level") {
    addTerms(terms, "lake", "river", "swimming hole", "water", "reservoir", "outdoors", "gulf coast");
  }
  if (/small town|hometown|downtown|square|county|city|main street/.test(normalized)) {
    addTerms(terms, "small town", "downtown", "courthouse", "county", "main street", "town");
  }
  if (/bbq|barbecue|food|restaurant|taco|kolache|cook|pecan/.test(normalized)) {
    addTerms(terms, "food", "barbecue", "bbq", "restaurant", "tacos", "texas food");
  }
  if (/history|historic|republic|chapter/.test(normalized)) {
    addTerms(terms, "history", "historic", "texas history");
  }
  if (/wildlife|bird|mockingbird|animal/.test(normalized)) {
    addTerms(terms, "wildlife", "birds", "nature", "outdoors");
  }
  if (/park|camp|outdoor|mountain|peak|overlook/.test(normalized)) {
    addTerms(terms, "state park", "camping", "outdoors", "mountain", "hiking");
  }
  if (/bluebonnet|wildflower|flower|spring/.test(normalized)) {
    addTerms(terms, "bluebonnet", "wildflowers", "spring", "hill country");
  }
  if (/winter|cold|freeze|temperature/.test(normalized)) {
    addTerms(terms, "winter", "weather", "cold", "outdoors");
  }
  if (/summer|heat|hot/.test(normalized)) {
    addTerms(terms, "summer", "lake", "river", "outdoors", "gulf coast");
  }
  if (/fall|football|state fair|festival/.test(normalized)) {
    addTerms(terms, "fall", "state fair", "festival", "football", "road trip");
  }
  if (/tradition|culture|know you re in texas|defines your town/.test(normalized)) {
    addTerms(terms, "culture", "tradition", "history", "small town");
  }
  if (/day trip|weekend|destination|visit|place|attraction|three day/.test(normalized)) {
    addTerms(terms, "day trip", "weekend", "travel", "places", "road trip");
  }

  if (kind === "engagement") addTerms(terms, "travel", "places", "culture", "outdoors");
  if (kind === "fact") addTerms(terms, "history", "nature", "outdoors");
  if (kind === "seasonal") addTerms(terms, "season", "outdoors", "travel", "road trip");
  if (kind === "lake_level") addTerms(terms, "lake", "reservoir", "water", "outdoors");

  return [...terms];
}

export function scoreTexasDefinedImageText(value: string, terms: readonly string[]): number {
  const normalized = ` ${normalizeSearchText(value)} `;
  let score = 0;
  for (const term of terms) {
    const normalizedTerm = normalizeSearchText(term);
    if (!normalizedTerm) continue;
    if (normalized.includes(` ${normalizedTerm} `)) score += normalizedTerm.includes(" ") ? 10 : 6;
    else if (normalized.includes(normalizedTerm)) score += normalizedTerm.includes(" ") ? 6 : 3;
  }
  return score;
}

function tagAttributes(tag: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gis)) {
    attributes[match[1].toLowerCase()] = decodeSocialImageEntities(match[3]);
  }
  return attributes;
}

function metaContent(html: string, key: string): string | null {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = tagAttributes(tag);
    if ((attrs.property ?? attrs.name)?.toLowerCase() === key.toLowerCase() && attrs.content) {
      return attrs.content.trim();
    }
  }
  return null;
}

function titleTag(html: string): string | null {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1]
    ? decodeSocialImageEntities(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " "))
    : null;
}

function canonicalHref(html: string): string | null {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const attrs = tagAttributes(tag);
    if ((attrs.rel ?? "").toLowerCase().split(/\s+/).includes("canonical") && attrs.href) return attrs.href.trim();
  }
  return null;
}

function normalizeTexasDefinedPageUrl(raw: string, base = SITE_URL): string | null {
  try {
    const url = new URL(decodeSocialImageEntities(raw), base);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (host !== "texasdefined.com" && host !== "www.texasdefined.com") return null;
    url.hostname = "texasdefined.com";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function eligibleContentPage(raw: string): string | null {
  const normalized = normalizeTexasDefinedPageUrl(raw);
  if (!normalized) return null;
  const url = new URL(normalized);
  const path = url.pathname.toLowerCase();
  if (
    path === "/" ||
    path.startsWith("/admin") ||
    path.startsWith("/api/") ||
    path.startsWith("/auth") ||
    path.includes("sitemap") ||
    path.includes("merchant") ||
    /\.(?:xml|json|txt|jpg|jpeg|png|webp|gif|svg|pdf)$/i.test(path)
  ) {
    return null;
  }
  return normalized;
}

function extractLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeSocialImageEntities(match[1]))
    .filter(Boolean);
}

async function fetchText(url: string, accept: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        accept,
        "user-agent": "TexasDefined-Facebook-Image-Resolver/1.0",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

async function loadSitemapPages(): Promise<string[]> {
  const root = await fetchText(SITEMAP_URL, "application/xml,text/xml;q=0.9,text/plain;q=0.5");
  if (!root) return [];

  const rootLocs = extractLocs(root);
  const childSitemaps = rootLocs.filter((loc) => /\.xml(?:\?|$)/i.test(loc)).slice(0, MAX_CHILD_SITEMAPS);
  const pageLocs = rootLocs.filter((loc) => !/\.xml(?:\?|$)/i.test(loc));

  if (childSitemaps.length > 0) {
    const children = await Promise.all(
      childSitemaps.map((url) => fetchText(url, "application/xml,text/xml;q=0.9,text/plain;q=0.5")),
    );
    for (const child of children) {
      if (child) pageLocs.push(...extractLocs(child));
    }
  }

  return [...new Set(pageLocs.map(eligibleContentPage).filter((url): url is string => Boolean(url)))];
}

function isUsableImageUrl(raw: string, base: string): string | null {
  try {
    const url = new URL(decodeSocialImageEntities(raw), base);
    if (url.protocol !== "https:") return null;
    if (/\.svg(?:\?|$)/i.test(url.toString())) return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function loadPageMetadata(url: string): Promise<PageMetadata | null> {
  const html = await fetchText(url, "text/html,application/xhtml+xml;q=0.9");
  if (!html) return null;
  const title = metaContent(html, "og:title") ?? titleTag(html);
  const description = metaContent(html, "og:description") ?? metaContent(html, "description") ?? "";
  const imageRaw = metaContent(html, "og:image") ?? metaContent(html, "twitter:image");
  if (!title || !imageRaw) return null;
  const imageUrl = isUsableImageUrl(imageRaw, url);
  if (!imageUrl) return null;
  const canonical = normalizeTexasDefinedPageUrl(canonicalHref(html) ?? url, url) ?? url;
  return { url: canonical, title: title.trim(), description: description.trim(), imageUrl };
}

async function remoteImageIsUsable(imageUrl: string): Promise<boolean> {
  if (!isUsableImageUrl(imageUrl, imageUrl)) return false;
  try {
    const head = await fetch(imageUrl, {
      method: "HEAD",
      cache: "no-store",
      headers: { "user-agent": "TexasDefined-Facebook-Image-Resolver/1.0" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const type = head.headers.get("content-type")?.toLowerCase() ?? "";
    if (head.ok && type.startsWith("image/") && type !== "image/svg+xml") return true;
  } catch {
    // Some CDNs reject HEAD requests. Try a small GET below.
  }

  try {
    const response = await fetch(imageUrl, {
      cache: "no-store",
      headers: {
        range: "bytes=0-2047",
        "user-agent": "TexasDefined-Facebook-Image-Resolver/1.0",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const type = response.headers.get("content-type")?.toLowerCase() ?? "";
    return response.ok && type.startsWith("image/") && type !== "image/svg+xml";
  } catch {
    return false;
  }
}

function extractXmlTag(block: string, names: readonly string[]): string | null {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "i"));
    if (match?.[1]) return decodeSocialImageEntities(match[1]);
  }
  return null;
}

export function parseTexasDefinedMerchantProducts(xml: string): MerchantProduct[] {
  const products: MerchantProduct[] = [];
  for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)) {
    const block = match[1];
    const title = extractXmlTag(block, ["title", "g:title"]);
    const link = extractXmlTag(block, ["link", "g:link"]);
    const imageRaw = extractXmlTag(block, ["g:image_link", "image_link"]);
    if (!title || !link || !imageRaw) continue;
    const normalizedLink = normalizeTexasDefinedPageUrl(link);
    const imageUrl = isUsableImageUrl(imageRaw, link);
    if (!normalizedLink || !imageUrl) continue;
    products.push({ title, link: normalizedLink, imageUrl });
  }
  return products;
}

async function resolveShopImage(message: string): Promise<ResolvedTexasDefinedFacebookImage | null> {
  const xml = await fetchText(MERCHANT_FEED_URL, "application/xml,text/xml;q=0.9,text/plain;q=0.5");
  if (!xml) return null;
  const products = parseTexasDefinedMerchantProducts(xml);
  if (products.length === 0) return null;

  const start = hash32(message) % products.length;
  for (let offset = 0; offset < products.length; offset += 1) {
    const product = products[(start + offset) % products.length];
    if (!(await remoteImageIsUsable(product.imageUrl))) continue;
    return {
      imageUrl: product.imageUrl,
      sourcePageUrl: product.link,
      sourceTitle: product.title,
      strategy: "merchant-product",
    };
  }
  return null;
}

async function resolveContentImage(
  message: string,
  kind: TexasDefinedFacebookImageKind,
): Promise<ResolvedTexasDefinedFacebookImage | null> {
  const terms = texasDefinedImageTopicTerms(message, kind);
  const pages = await loadSitemapPages();
  if (pages.length === 0 || terms.length === 0) return null;

  const rankedPaths = pages
    .map((url) => ({
      url,
      score: scoreTexasDefinedImageText(new URL(url).pathname.replace(/[-_/]+/g, " "), terms),
      tie: hash32(`${message}:${url}`),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.tie - b.tie)
    .slice(0, MAX_PAGE_METADATA_FETCHES);

  if (rankedPaths.length === 0) return null;
  const metadata = (await Promise.all(rankedPaths.map((candidate) => loadPageMetadata(candidate.url)))).filter(
    (value): value is PageMetadata => Boolean(value),
  );

  const rankedMetadata = metadata
    .map((page) => ({
      page,
      score:
        scoreTexasDefinedImageText(page.title, terms) * 3 +
        scoreTexasDefinedImageText(page.description, terms) +
        scoreTexasDefinedImageText(new URL(page.url).pathname.replace(/[-_/]+/g, " "), terms) * 2,
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score);

  for (const candidate of rankedMetadata) {
    if (!(await remoteImageIsUsable(candidate.page.imageUrl))) continue;
    return {
      imageUrl: candidate.page.imageUrl,
      sourcePageUrl: candidate.page.url,
      sourceTitle: candidate.page.title,
      strategy: "site-content",
    };
  }
  return null;
}

export async function resolveTexasDefinedFacebookImage(args: {
  message: string;
  kind: TexasDefinedFacebookImageKind;
}): Promise<ResolvedTexasDefinedFacebookImage | null> {
  if (args.kind === "shop") {
    const shop = await resolveShopImage(args.message);
    if (shop) return shop;
  }
  return resolveContentImage(args.message, args.kind);
}

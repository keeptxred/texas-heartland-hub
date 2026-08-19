const GRAPH_VERSION = "v21.0";

export type FacebookPagePost = {
  id?: string;
  message?: string;
  permalink_url?: string;
  created_time?: string;
};

export type FacebookArticleIdentity = {
  title: string;
  url: string;
  alternateUrls?: string[];
};

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeFacebookHeadline(value: string): string {
  return normalizeWhitespace(
    value
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9]+/g, " "),
  );
}

export function canonicalArticleUrlKey(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const path = (url.pathname.replace(/\/+$/, "") || "/").toLowerCase();
    return `${host}${path}`;
  } catch {
    return null;
  }
}

export function canonicalKtrArticlePath(raw: string): string | null {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== "keeptxred.com") return null;
    return url.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  } catch {
    return null;
  }
}

function extractMessageUrlKeys(message: string): Set<string> {
  const keys = new Set<string>();
  const matches = message.match(/https?:\/\/[^\s<>()]+/gi) ?? [];
  for (const raw of matches) {
    const cleaned = raw.replace(/[.,!?;:'"\])}]+$/g, "");
    const key = canonicalArticleUrlKey(cleaned);
    if (key) keys.add(key);
  }
  return keys;
}

function meaningfulTokens(value: string): Set<string> {
  const stop = new Set([
    "the", "a", "an", "and", "or", "but", "to", "of", "in", "on", "for", "at", "as", "by", "from", "with",
    "after", "new", "texas", "says", "say", "amid", "over", "into", "across",
  ]);
  return new Set(
    normalizeFacebookHeadline(value)
      .split(" ")
      .filter((token) => token.length >= 3 && !stop.has(token)),
  );
}

export function facebookHeadlineSimilarity(a: string, b: string): number {
  const left = meaningfulTokens(a);
  const right = meaningfulTokens(b);
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  if (shared < 5) return 0;
  return shared / Math.max(left.size, right.size);
}

export function facebookPostMatchesArticle(
  post: FacebookPagePost,
  article: FacebookArticleIdentity,
): boolean {
  const message = post.message ?? "";
  const messageUrlKeys = extractMessageUrlKeys(message);
  for (const rawUrl of [article.url, ...(article.alternateUrls ?? [])]) {
    const key = canonicalArticleUrlKey(rawUrl);
    if (key && messageUrlKeys.has(key)) return true;
  }

  const articlePath = canonicalKtrArticlePath(article.url);
  if (articlePath && message.toLowerCase().includes(articlePath)) return true;

  const normalizedTitle = normalizeFacebookHeadline(article.title);
  const normalizedMessage = normalizeFacebookHeadline(message);
  if (normalizedTitle && normalizedMessage.includes(normalizedTitle)) return true;

  const firstLine = message.split(/\r?\n/, 1)[0] ?? "";
  return facebookHeadlineSimilarity(firstLine, article.title) >= 0.86;
}

export async function fetchRecentFacebookPagePosts(options: {
  pageId: string;
  pageToken: string;
  fetchImpl?: typeof fetch;
  limit?: number;
}): Promise<FacebookPagePost[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const limit = Math.max(1, Math.min(options.limit ?? 100, 100));
  const endpoint = new URL(
    `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(options.pageId)}/published_posts`,
  );
  endpoint.searchParams.set("fields", "id,message,permalink_url,created_time");
  endpoint.searchParams.set("limit", String(limit));

  const response = await fetchImpl(endpoint.toString(), {
    headers: { Authorization: `Bearer ${options.pageToken}` },
  });
  const text = await response.text();
  let payload: { data?: FacebookPagePost[]; error?: { message?: string } } = {};
  try {
    payload = JSON.parse(text) as typeof payload;
  } catch {
    throw new Error(`Facebook published_posts returned invalid JSON (HTTP ${response.status})`);
  }

  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message ?? `Facebook published_posts failed (HTTP ${response.status})`);
  }
  return Array.isArray(payload.data) ? payload.data : [];
}

const CANONICAL_ORIGIN = 'https://keeptxred.com';
const ALLOWED_HOSTS = new Set(['keeptxred.com', 'www.keeptxred.com']);

export function normalizeSiteUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    return null;
  }
  if (!ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) return null;
  let path = parsed.pathname.replace(/\/{2,}/g, '/');
  if (path.length > 1) path = path.replace(/\/+$/, '');
  if (!path.startsWith('/')) path = `/${path}`;
  return { url: `${CANONICAL_ORIGIN}${path}`, path };
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function extractSitemapLocs(xml) {
  if (typeof xml !== 'string') return [];
  const locations = [];
  const pattern = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let match;
  while ((match = pattern.exec(xml)) !== null) {
    const decoded = decodeXml(match[1].trim());
    if (decoded) locations.push(decoded);
  }
  return locations;
}

function topLevelPathBucket(url) {
  try {
    const segment = new URL(url).pathname.split('/').filter(Boolean)[0];
    return segment || '~root';
  } catch {
    return '~invalid';
  }
}

export function selectInspectionUrls({ sitemapUrls, priorityUrls, limit, metricDate }) {
  const cappedLimit = Math.max(1, Math.min(500, Number(limit) || 200));
  const priority = [];
  const seen = new Set();
  for (const value of priorityUrls ?? []) {
    const normalized = normalizeSiteUrl(value);
    if (!normalized || seen.has(normalized.url)) continue;
    seen.add(normalized.url);
    priority.push(normalized.url);
    if (priority.length >= Math.min(25, cappedLimit)) break;
  }

  const remaining = [...new Set((sitemapUrls ?? [])
    .map((value) => normalizeSiteUrl(value)?.url)
    .filter(Boolean))]
    .filter((url) => !seen.has(url))
    .sort();

  const slots = Math.max(0, cappedLimit - priority.length);
  if (slots === 0 || remaining.length === 0) return priority.slice(0, cappedLimit);

  const dateMs = Date.parse(`${metricDate}T00:00:00Z`);
  const dayNumber = Number.isFinite(dateMs) ? Math.floor(dateMs / 86_400_000) : 0;

  // Avoid taking one large lexicographic slice of the sitemap. That can make a
  // daily 200-URL inspection sample overwhelmingly represent a single route
  // family (for example /texas-politics/figures). Group by top-level path,
  // rotate each group daily, and round-robin across groups so each snapshot is
  // useful for sitewide indexing decisions while remaining deterministic.
  const buckets = new Map();
  for (const url of remaining) {
    const key = topLevelPathBucket(url);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(url);
  }

  const bucketKeys = [...buckets.keys()].sort();
  const bucketStart = bucketKeys.length > 0 ? dayNumber % bucketKeys.length : 0;
  const rotatedKeys = bucketKeys.map((_, index) => bucketKeys[(bucketStart + index) % bucketKeys.length]);
  const queues = new Map();
  for (const key of rotatedKeys) {
    const values = buckets.get(key) ?? [];
    const start = values.length > 0 ? dayNumber % values.length : 0;
    queues.set(key, values.map((_, index) => values[(start + index) % values.length]));
  }

  const rotated = [];
  let cursor = 0;
  while (rotated.length < Math.min(slots, remaining.length)) {
    let added = false;
    for (const key of rotatedKeys) {
      const queue = queues.get(key) ?? [];
      if (cursor >= queue.length) continue;
      rotated.push(queue[cursor]);
      added = true;
      if (rotated.length >= Math.min(slots, remaining.length)) break;
    }
    if (!added) break;
    cursor += 1;
  }

  return [...priority, ...rotated];
}

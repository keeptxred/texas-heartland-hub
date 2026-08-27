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
  const start = (dayNumber * slots) % remaining.length;
  const rotated = [];
  for (let index = 0; index < Math.min(slots, remaining.length); index += 1) {
    rotated.push(remaining[(start + index) % remaining.length]);
  }
  return [...priority, ...rotated];
}

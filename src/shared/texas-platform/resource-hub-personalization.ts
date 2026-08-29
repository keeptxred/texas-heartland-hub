export type ResourceHubOwner = 'shared' | 'keeptxred' | 'texasdefined';

export type ResourceHubLink = {
  label: string;
  href: string;
};

export type ResourceView = ResourceHubLink & {
  count: number;
  date: string;
};

function isResourceLink(value: unknown): value is ResourceHubLink {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<ResourceHubLink>;
  return typeof item.label === 'string'
    && item.label.trim().length > 0
    && typeof item.href === 'string'
    && item.href.startsWith('/');
}

export function normalizeRecentlyViewed(
  value: unknown,
  limit = 8,
): ResourceHubLink[] {
  if (!Number.isInteger(limit) || limit < 0) {
    throw new Error('Recently viewed limit must be a non-negative integer.');
  }
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const normalized: ResourceHubLink[] = [];
  for (const item of value) {
    if (!isResourceLink(item) || seen.has(item.href)) continue;
    seen.add(item.href);
    normalized.push({ label: item.label.trim(), href: item.href });
    if (normalized.length >= limit) break;
  }
  return normalized;
}

export function recordRecentlyViewed(
  previous: ReadonlyArray<ResourceHubLink>,
  resource: ResourceHubLink,
  limit = 8,
): ResourceHubLink[] {
  if (!isResourceLink(resource)) return [...previous];
  return normalizeRecentlyViewed([resource, ...previous], limit);
}

export function normalizeDailyResourceViews(value: unknown): ResourceView[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isResourceLink(item) || typeof item !== 'object' || item === null) return [];
    const candidate = item as Partial<ResourceView>;
    if (typeof candidate.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(candidate.date)) return [];
    if (!Number.isInteger(candidate.count) || (candidate.count ?? 0) <= 0) return [];
    return [{
      label: candidate.label!.trim(),
      href: candidate.href!,
      date: candidate.date,
      count: candidate.count!,
    }];
  });
}

export function recordDailyResourceView(
  previous: ReadonlyArray<ResourceView>,
  resource: ResourceHubLink,
  date: string,
): ResourceView[] {
  if (!isResourceLink(resource) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return [...previous];
  const current = normalizeDailyResourceViews(previous).filter((item) => item.date === date);
  const existing = current.find((item) => item.href === resource.href);
  if (!existing) return [...current, { ...resource, label: resource.label.trim(), date, count: 1 }];
  return current.map((item) => item.href === resource.href
    ? { ...item, label: resource.label.trim(), count: item.count + 1 }
    : item);
}

export function popularResourcesForDate(
  views: ReadonlyArray<ResourceView>,
  date: string,
  fallback: ReadonlyArray<ResourceHubLink> = [],
  limit = 3,
): ResourceHubLink[] {
  if (!Number.isInteger(limit) || limit < 0) {
    throw new Error('Popular resource limit must be a non-negative integer.');
  }
  const popular = normalizeDailyResourceViews(views)
    .filter((item) => item.date === date)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit)
    .map(({ label, href }) => ({ label, href }));
  return popular.length ? popular : fallback.slice(0, limit).map((item) => ({ ...item }));
}

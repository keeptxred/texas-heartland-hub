import {
  normalizeDailyResourceViews,
  normalizeRecentlyViewed,
  popularResourcesForDate,
  recordDailyResourceView,
  recordRecentlyViewed,
  type ResourceHubLink,
  type ResourceHubOwner,
  type ResourceView,
} from './resource-hub-personalization';

export type ResourcePersonalizationStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type ResourcePersonalizationSnapshot = {
  recentlyViewed: ResourceHubLink[];
  dailyViews: ResourceView[];
};

const KEY_PREFIX = 'texas-resource-personalization';

function ownerKey(owner: Exclude<ResourceHubOwner, 'shared'>, suffix: 'recent' | 'daily') {
  return `${KEY_PREFIX}:${owner}:${suffix}`;
}

function parseStoredJson(storage: ResourcePersonalizationStorage, key: string): unknown {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStoredJson(storage: ResourcePersonalizationStorage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function readResourcePersonalization(
  storage: ResourcePersonalizationStorage,
  owner: Exclude<ResourceHubOwner, 'shared'>,
  recentLimit = 8,
): ResourcePersonalizationSnapshot {
  return {
    recentlyViewed: normalizeRecentlyViewed(parseStoredJson(storage, ownerKey(owner, 'recent')), recentLimit),
    dailyViews: normalizeDailyResourceViews(parseStoredJson(storage, ownerKey(owner, 'daily'))),
  };
}

export function recordResourceOpen(
  storage: ResourcePersonalizationStorage,
  owner: Exclude<ResourceHubOwner, 'shared'>,
  resource: ResourceHubLink,
  date: string,
  recentLimit = 8,
): ResourcePersonalizationSnapshot {
  const previous = readResourcePersonalization(storage, owner, recentLimit);
  const recentlyViewed = recordRecentlyViewed(previous.recentlyViewed, resource, recentLimit);
  const dailyViews = recordDailyResourceView(previous.dailyViews, resource, date);

  writeStoredJson(storage, ownerKey(owner, 'recent'), recentlyViewed);
  writeStoredJson(storage, ownerKey(owner, 'daily'), dailyViews);

  return { recentlyViewed, dailyViews };
}

export function popularResourcesFromStorage(
  storage: ResourcePersonalizationStorage,
  owner: Exclude<ResourceHubOwner, 'shared'>,
  date: string,
  fallback: ReadonlyArray<ResourceHubLink> = [],
  limit = 3,
) {
  const snapshot = readResourcePersonalization(storage, owner);
  return popularResourcesForDate(snapshot.dailyViews, date, fallback, limit);
}

export function clearResourcePersonalization(
  storage: ResourcePersonalizationStorage,
  owner: Exclude<ResourceHubOwner, 'shared'>,
) {
  try {
    storage.removeItem(ownerKey(owner, 'recent'));
    storage.removeItem(ownerKey(owner, 'daily'));
    return true;
  } catch {
    return false;
  }
}

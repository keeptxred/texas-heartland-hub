export type TexasLifeSite = 'keeptxred' | 'texasdefined';

export type TexasLifeChecklistProgress = {
  checklistId: string;
  completedItemIds: string[];
  updatedAt: string;
};

export type TexasLifeJourneyProgress = {
  journeyId: string;
  completedStepIds: string[];
  currentStepId?: string;
  updatedAt: string;
};

export type TexasLifeProgressState = {
  checklists: TexasLifeChecklistProgress[];
  journeys: TexasLifeJourneyProgress[];
};

export type TexasLifeStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const EMPTY_STATE: TexasLifeProgressState = { checklists: [], journeys: [] };

export function texasLifeProgressStorageKey(site: TexasLifeSite) {
  return `texas-life-progress:${site}`;
}

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).map((item) => item.trim()))];
}

export function normalizeTexasLifeProgress(value: unknown): TexasLifeProgressState {
  if (!value || typeof value !== 'object') return { ...EMPTY_STATE };
  const candidate = value as Partial<TexasLifeProgressState>;
  const checklists = Array.isArray(candidate.checklists)
    ? candidate.checklists.flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const record = item as Partial<TexasLifeChecklistProgress>;
        if (typeof record.checklistId !== 'string' || !record.checklistId.trim()) return [];
        if (typeof record.updatedAt !== 'string' || Number.isNaN(Date.parse(record.updatedAt))) return [];
        return [{ checklistId: record.checklistId.trim(), completedItemIds: uniqueStrings(record.completedItemIds), updatedAt: record.updatedAt }];
      })
    : [];
  const journeys = Array.isArray(candidate.journeys)
    ? candidate.journeys.flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const record = item as Partial<TexasLifeJourneyProgress>;
        if (typeof record.journeyId !== 'string' || !record.journeyId.trim()) return [];
        if (typeof record.updatedAt !== 'string' || Number.isNaN(Date.parse(record.updatedAt))) return [];
        return [{
          journeyId: record.journeyId.trim(),
          completedStepIds: uniqueStrings(record.completedStepIds),
          currentStepId: typeof record.currentStepId === 'string' && record.currentStepId.trim() ? record.currentStepId.trim() : undefined,
          updatedAt: record.updatedAt,
        }];
      })
    : [];
  return { checklists, journeys };
}

export function readTexasLifeProgress(storage: TexasLifeStorage | undefined, site: TexasLifeSite): TexasLifeProgressState {
  if (!storage) return { ...EMPTY_STATE };
  try {
    return normalizeTexasLifeProgress(JSON.parse(storage.getItem(texasLifeProgressStorageKey(site)) ?? 'null'));
  } catch {
    return { ...EMPTY_STATE };
  }
}

export function writeTexasLifeProgress(storage: TexasLifeStorage | undefined, site: TexasLifeSite, state: TexasLifeProgressState) {
  if (!storage) return false;
  try {
    storage.setItem(texasLifeProgressStorageKey(site), JSON.stringify(normalizeTexasLifeProgress(state)));
    return true;
  } catch {
    return false;
  }
}

export function updateChecklistProgress(state: TexasLifeProgressState, checklistId: string, completedItemIds: readonly string[], updatedAt = new Date().toISOString()): TexasLifeProgressState {
  const next = { checklistId: checklistId.trim(), completedItemIds: uniqueStrings(completedItemIds), updatedAt };
  return { ...state, checklists: [next, ...state.checklists.filter((item) => item.checklistId !== next.checklistId)] };
}

export function updateJourneyProgress(state: TexasLifeProgressState, progress: Omit<TexasLifeJourneyProgress, 'updatedAt'>, updatedAt = new Date().toISOString()): TexasLifeProgressState {
  const next: TexasLifeJourneyProgress = {
    journeyId: progress.journeyId.trim(),
    completedStepIds: uniqueStrings(progress.completedStepIds),
    currentStepId: progress.currentStepId?.trim() || undefined,
    updatedAt,
  };
  return { ...state, journeys: [next, ...state.journeys.filter((item) => item.journeyId !== next.journeyId)] };
}

export function clearTexasLifeProgress(storage: TexasLifeStorage | undefined, site: TexasLifeSite) {
  if (!storage) return false;
  try {
    storage.removeItem(texasLifeProgressStorageKey(site));
    return true;
  } catch {
    return false;
  }
}

import { describe, expect, it } from 'vitest';
import {
  clearTexasLifeProgress,
  normalizeTexasLifeProgress,
  readTexasLifeProgress,
  texasLifeProgressStorageKey,
  updateChecklistProgress,
  updateJourneyProgress,
  writeTexasLifeProgress,
} from './texas-life-progress';

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
  };
}

describe('Texas Life progress', () => {
  it('keeps each site isolated', () => {
    expect(texasLifeProgressStorageKey('keeptxred')).not.toBe(texasLifeProgressStorageKey('texasdefined'));
  });

  it('normalizes malformed records and duplicate completed IDs', () => {
    const state = normalizeTexasLifeProgress({
      checklists: [{ checklistId: ' move ', completedItemIds: ['license', 'license', ''], updatedAt: '2026-08-03T12:00:00Z' }, null],
      journeys: [{ journeyId: 'home', completedStepIds: ['mortgage'], currentStepId: ' tax ', updatedAt: '2026-08-03T12:00:00Z' }],
    });
    expect(state.checklists[0]).toMatchObject({ checklistId: 'move', completedItemIds: ['license'] });
    expect(state.journeys[0]).toMatchObject({ journeyId: 'home', currentStepId: 'tax' });
  });

  it('updates checklist and journey progress without mutating prior state', () => {
    const initial = { checklists: [], journeys: [] };
    const withChecklist = updateChecklistProgress(initial, 'move', ['license']);
    const withJourney = updateJourneyProgress(withChecklist, { journeyId: 'moving', completedStepIds: ['cost'], currentStepId: 'city' });
    expect(initial).toEqual({ checklists: [], journeys: [] });
    expect(withJourney.checklists[0].completedItemIds).toEqual(['license']);
    expect(withJourney.journeys[0].currentStepId).toBe('city');
  });

  it('writes, reads, and clears progress safely', () => {
    const storage = memoryStorage();
    const state = updateChecklistProgress({ checklists: [], journeys: [] }, 'business', ['llc']);
    expect(writeTexasLifeProgress(storage, 'texasdefined', state)).toBe(true);
    expect(readTexasLifeProgress(storage, 'texasdefined').checklists[0].checklistId).toBe('business');
    expect(clearTexasLifeProgress(storage, 'texasdefined')).toBe(true);
    expect(readTexasLifeProgress(storage, 'texasdefined')).toEqual({ checklists: [], journeys: [] });
  });

  it('recovers from unavailable or corrupt storage', () => {
    expect(readTexasLifeProgress(undefined, 'texasdefined')).toEqual({ checklists: [], journeys: [] });
    const storage = memoryStorage();
    storage.setItem(texasLifeProgressStorageKey('texasdefined'), '{bad json');
    expect(readTexasLifeProgress(storage, 'texasdefined')).toEqual({ checklists: [], journeys: [] });
  });
});

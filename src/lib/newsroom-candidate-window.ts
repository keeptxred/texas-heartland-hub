/**
 * Newsroom publication must consider newly discovered events before an older
 * high-scoring backlog. Long-running published stories have a separate
 * source-backed refresh path; this window governs *new* article selection.
 */
export const NEWSROOM_NEW_STORY_MAX_AGE_HOURS = 72;

export function newsroomNewStoryCutoff(now: Date = new Date()): string {
  return new Date(now.getTime() - NEWSROOM_NEW_STORY_MAX_AGE_HOURS * 60 * 60 * 1000).toISOString();
}

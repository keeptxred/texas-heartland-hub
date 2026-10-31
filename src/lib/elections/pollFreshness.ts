/** A recent public poll is one whose fieldwork ended within 35 UTC calendar days. */
export const RECENT_ELECTION_POLL_DAYS = 35;
export function isRecentElectionPoll(fieldEndDate: string, now: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fieldEndDate)) return false;
  const end = Date.parse(`${fieldEndDate}T00:00:00Z`);
  const today = Date.parse(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
  if (!Number.isFinite(end) || !Number.isFinite(today)) return false;
  const ageDays = (today - end) / 86_400_000;
  return ageDays >= 0 && ageDays <= RECENT_ELECTION_POLL_DAYS;
}

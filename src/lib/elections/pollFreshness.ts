/** A recent public poll is one whose fieldwork ended within 35 days. */
export const RECENT_ELECTION_POLL_DAYS = 35;
export function isRecentElectionPoll(fieldEndDate: string, now: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fieldEndDate)) return false;
  const end = new Date(`${fieldEndDate}T23:59:59Z`);
  if (!Number.isFinite(end.getTime())) return false;
  const ageDays = (now.getTime() - end.getTime()) / 86_400_000;
  return ageDays >= 0 && ageDays <= RECENT_ELECTION_POLL_DAYS;
}

// Client-safe low-value / filler headline detector for admin surfaces.
// Mirrors isPuzzleTitle() from ingest-feeds.ts (server-only module) and
// adds a few known daily-filler variants that slip past ingestion but
// should never rank as editorial opportunities.
export function isLowValueTitle(title: string | null | undefined): boolean {
  if (!title) return true;
  const t = title.toLowerCase();
  return (
    // puzzle / word-game filler (mirrors isPuzzleTitle)
    /\bcrossword\b/.test(t) ||
    /\bsudoku\b/.test(t) ||
    /\bword\s*(game|search|jumble|wrangler)\b/.test(t) ||
    /\b(daily|weekly)\s+puzzle\b/.test(t) ||
    /\bpuzzle\s+(for|of\s+the\s+day)\b/.test(t) ||
    /\bmini\s+puzzle\b/.test(t) ||
    // recurring daily-column filler
    /\bword\s+wrangler\b/.test(t) ||
    /\bhoroscope(s)?\b/.test(t) ||
    /\bquiz\s+of\s+the\s+(day|week)\b/.test(t) ||
    /\bcartoon\s+of\s+the\s+day\b/.test(t) ||
    /\bnewsletter\b/.test(t)
  );
}
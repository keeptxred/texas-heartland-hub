// Client-safe low-value / filler headline detector for admin surfaces.
// Mirrors isPuzzleTitle() from ingest-feeds.ts (server-only module) and
// adds known filler/navigation variants that should never rank as editorial
// opportunities. Keep utility-page rules intentionally narrow so legitimate
// headlines containing words such as "map" or "cameras" still pass.
export function isLowValueTitle(title: string | null | undefined): boolean {
  if (!title) return true;
  const t = title.toLowerCase().trim();
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
    /\bnewsletter\b/.test(t) ||
    // podcast/video episode landing pages are not written source articles
    /\btribcast\b/.test(t) ||
    /\bpodcast\s*(episode)?\b/.test(t) ||
    /\bvideo:\s*/.test(t) ||
    /\bwatch:\s*/.test(t) ||
    // Government/search-index utility pages observed in primary-source feeds.
    // Exact/boilerplate matches only; real news headlines remain eligible.
    /^(map|cameras?|incidents?)$/.test(t) ||
    /^file viewing information$/.test(t) ||
    /^contracting opportunities$/.test(t) ||
    /^workforce policy letters?\s*&\s*guidance$/.test(t) ||
    /^workbook:\s*bidder'?s list$/.test(t) ||
    /^texas transportation commission$/.test(t) ||
    /^-\s*texas workforce commission$/.test(t)
  );
}

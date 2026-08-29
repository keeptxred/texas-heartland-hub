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
    // Individual obituary/death-notice listings are not newsroom stories.
    // Keep this narrow: reporting about an obituary remains eligible unless
    // the headline itself is an obituary/death-notice landing page.
    /\bobituary\b/.test(t) ||
    /^death notice\b/.test(t) ||
    // podcast/video episode landing pages are not written source articles
    /\btribcast\b/.test(t) ||
    /\bpodcast\s*(episode)?\b/.test(t) ||
    /\bvideo:\s*/.test(t) ||
    /\bwatch:\s*/.test(t) ||
    // Sports affiliate/spam pages are not newsroom stories. Keep official
    // team viewing guides eligible by targeting the observed affiliate forms.
    /\blive@?streams?\b/.test(t) ||
    /\bwhere to watch,?\s*stream info,?\s*tv channel\b/.test(t) ||
    /\bhow to watch\b.*\blive stream info\b/.test(t) ||
    /\bodds,?\s*spread,?\s*(and\s*)?totals?\b/.test(t) ||
    /\bprediction,?\s*picks?\s*&\s*odds\b/.test(t) ||
    // Publisher self-promotion / utility pages.
    /^our next\b.*\bmeetup\b/.test(t) ||
    /^power outage maps?\b.*\bcheck for outages\b/.test(t) ||
    // Government/search-index utility pages observed in primary-source feeds.
    // Exact/boilerplate matches only; real news headlines remain eligible.
    /^(map|cameras?|incidents?)$/.test(t) ||
    /^file viewing information$/.test(t) ||
    /^contracting opportunities$/.test(t) ||
    /^workforce policy letters?\s*&\s*guidance$/.test(t) ||
    /^workbook:\s*bidder'?s list$/.test(t) ||
    /^texas transportation commission$/.test(t) ||
    /^-\s*texas workforce commission$/.test(t) ||
    // Static Texas Education Agency/reporting landing pages that can surface
    // through primary-source Google discovery but are not newsroom stories.
    /^tea$/.test(t) ||
    /^(?:\d{4}-\d{2}\s+)?texas performance reporting system\s*\(tprs\)$/.test(t)
  );
}

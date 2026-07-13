// Detects near-duplicate article titles (same story, different wording).
// Used at ingest time (block insert) and at render time (drop from breaking).

const STOP = new Set([
  "about","after","again","against","along","among","around","before","behind","below","between","during",
  "these","those","their","there","which","while","would","could","should","being","above","under","other",
  "texas","texan","texans","today","update","report","reports","reported","local","state","news","story",
  "breaking","exclusive","first","weekly","daily","following","across","near","from","into","over","this",
  "that","with","says","said","will","have","been","were","what","when","where","some","more","most",
]);

export function titleTokens(title: string): Set<string> {
  const tokens = (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 5 && !STOP.has(w));
  return new Set(tokens);
}

export function isDuplicateTitle(a: string, b: string): boolean {
  const ta = titleTokens(a);
  const tb = titleTokens(b);
  if (ta.size === 0 || tb.size === 0) return false;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared++;
  const union = ta.size + tb.size - shared;
  const jaccard = union === 0 ? 0 : shared / union;
  // Same story if they share several distinctive tokens with meaningful overlap.
  return (shared >= 5 && jaccard >= 0.3) || (shared >= 4 && jaccard >= 0.5) || jaccard >= 0.7;
}

// Drops later items whose title is a near-duplicate of an earlier kept item.
export function dedupeByTitle<T extends { title: string }>(items: T[]): T[] {
  const kept: T[] = [];
  for (const it of items) {
    if (kept.some((k) => isDuplicateTitle(k.title, it.title))) continue;
    kept.push(it);
  }
  return kept;
}
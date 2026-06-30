// Article-wide duplicate-content scrubber. Removes duplicate paragraphs,
// repeated sentences within paragraphs, repeated headings, repeated bullets,
// and repeated FAQ questions. Pure function — no side effects.

export type Section = { heading?: string; paragraphs?: string[] };
export type FaqItem = { q?: string; a?: string };
export type ArticleBodyShape = {
  updated?: string;
  intro?: string[];
  sections?: Section[];
  faq?: FaqItem[];
  sources?: { label?: string; url?: string }[];
  keyTakeaways?: string[];
  [k: string]: unknown;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const splitSentences = (p: string) =>
  p.split(/(?<=[.!?])\s+(?=[A-Z0-9"'\u201c])/).map((s) => s.trim()).filter(Boolean);

function dedupeSentences(paragraph: string, seen: Set<string>): string {
  const out: string[] = [];
  for (const s of splitSentences(paragraph)) {
    const key = norm(s);
    if (key.length < 8) {
      out.push(s);
      continue;
    }
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out.join(" ");
}

function dedupeParagraphs(paragraphs: string[], seenPara: Set<string>, seenSent: Set<string>): string[] {
  const out: string[] = [];
  for (const raw of paragraphs) {
    const p = (raw ?? "").trim();
    if (!p) continue;
    const key = norm(p);
    if (key.length >= 30 && seenPara.has(key)) continue;
    if (key.length >= 30) seenPara.add(key);
    const cleaned = dedupeSentences(p, seenSent);
    if (cleaned.trim().length === 0) continue;
    out.push(cleaned);
  }
  return out;
}

function dedupeList(items: string[], seen: Set<string>): string[] {
  const out: string[] = [];
  for (const raw of items) {
    const v = (raw ?? "").trim();
    if (!v) continue;
    const key = norm(v);
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

export function dedupeArticleBody<T extends ArticleBodyShape>(body: T): T {
  if (!body || typeof body !== "object") return body;
  const seenPara = new Set<string>();
  const seenSent = new Set<string>();
  const seenHeading = new Set<string>();

  const intro = Array.isArray(body.intro) ? dedupeParagraphs(body.intro, seenPara, seenSent) : body.intro;

  let sections: Section[] | undefined;
  if (Array.isArray(body.sections)) {
    sections = [];
    for (const sec of body.sections) {
      if (!sec) continue;
      const h = (sec.heading ?? "").trim();
      const hKey = norm(h);
      if (hKey && seenHeading.has(hKey)) continue;
      if (hKey) seenHeading.add(hKey);
      const paragraphs = Array.isArray(sec.paragraphs)
        ? dedupeParagraphs(sec.paragraphs, seenPara, seenSent)
        : [];
      if (paragraphs.length === 0 && !h) continue;
      sections.push({ heading: h || undefined, paragraphs });
    }
  }

  const keyTakeaways = Array.isArray(body.keyTakeaways)
    ? dedupeList(body.keyTakeaways, new Set<string>())
    : body.keyTakeaways;

  let faq: FaqItem[] | undefined;
  if (Array.isArray(body.faq)) {
    const seenQ = new Set<string>();
    faq = [];
    for (const f of body.faq) {
      if (!f) continue;
      const q = (f.q ?? "").trim();
      const qKey = norm(q);
      if (!qKey || seenQ.has(qKey)) continue;
      seenQ.add(qKey);
      const a = (f.a ?? "").trim();
      faq.push({ q, a });
    }
  }

  return { ...body, intro, sections, keyTakeaways, faq } as T;
}

// True when the body still contains duplicate paragraphs/sentences after dedupe.
// Useful as a "block publish" gate.
export function hasDuplicateContent(body: ArticleBodyShape): boolean {
  const before = JSON.stringify(body ?? {});
  const after = JSON.stringify(dedupeArticleBody(body ?? {}));
  return before !== after;
}
// Article-wide duplicate-content scrubber. Removes duplicate paragraphs,
// repeated sentences within paragraphs, repeated headings, repeated bullets,
// repeated FAQ questions, repairs malformed paragraph structure, and keeps the
// article's "Official Sources" list limited to genuinely authoritative
// government / military sources.

import { applyReviewedStaticArticleBodyUpgrade } from "@/lib/static-article-body-upgrade-router";
import { canonicalizeMigratedToolMarkdownLinks } from "@/lib/migrated-tool-canonical";

export type Section = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: unknown;
  image?: unknown;
  [k: string]: unknown;
};
export type FaqItem = { q?: string; a?: string };
export type ArticleSource = { label?: string; url?: string };
export type ArticleBodyShape = {
  updated?: string;
  intro?: string[];
  sections?: Section[];
  faq?: FaqItem[];
  sources?: ArticleSource[];
  keyTakeaways?: string[];
  [k: string]: unknown;
};

const MAX_RENDER_PARAGRAPH_WORDS = 110;
const TARGET_RENDER_PARAGRAPH_WORDS = 75;

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const splitSentences = (p: string) =>
  p.split(/(?<=[.!?])\s+(?=[A-Z0-9"'\u201c])/).map((s) => s.trim()).filter(Boolean);

const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

/**
 * Published database rows can predate the editorial readability gate or arrive
 * through a legacy/import path that packed several visible paragraphs into one
 * string. Repair that shape before rendering so a malformed row can never turn
 * the article page into a wall of text.
 *
 * We first honor explicit line breaks, then split only oversized prose at
 * sentence boundaries. We never split a sentence in the middle, preserving
 * links, quotations, names, and meaning.
 */
export function repairParagraphStructure(value: string): string[] {
  const explicitParagraphs = (value ?? "")
    .split(/\r?\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const repaired: string[] = [];
  for (const paragraph of explicitParagraphs) {
    if (wordCount(paragraph) <= MAX_RENDER_PARAGRAPH_WORDS) {
      repaired.push(paragraph);
      continue;
    }

    const sentences = splitSentences(paragraph);
    if (sentences.length < 2) {
      repaired.push(paragraph);
      continue;
    }

    let current: string[] = [];
    let currentWords = 0;
    for (const sentence of sentences) {
      const sentenceWords = wordCount(sentence);
      if (current.length > 0 && currentWords + sentenceWords > TARGET_RENDER_PARAGRAPH_WORDS) {
        repaired.push(current.join(" "));
        current = [];
        currentWords = 0;
      }
      current.push(sentence);
      currentWords += sentenceWords;
    }
    if (current.length > 0) repaired.push(current.join(" "));
  }

  return repaired;
}

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
    for (const repaired of repairParagraphStructure(raw ?? "")) {
      const p = canonicalizeMigratedToolMarkdownLinks(repaired).trim();
      if (!p) continue;
      const key = norm(p);
      if (key.length >= 30 && seenPara.has(key)) continue;
      if (key.length >= 30) seenPara.add(key);
      const cleaned = dedupeSentences(p, seenSent);
      if (cleaned.trim().length === 0) continue;
      out.push(cleaned);
    }
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

/**
 * The article template labels body.sources as "Official Sources", so this gate
 * must be conservative. Community/social platforms, news outlets, blogs, and
 * aggregators are intentionally excluded from that list even when they were
 * useful during reporting. They may still be cited in article prose.
 */
export function isOfficialArticleSource(source: ArticleSource): boolean {
  const rawUrl = (source.url ?? "").trim();
  if (!rawUrl) return false;

  try {
    const hostname = new URL(rawUrl).hostname.toLowerCase().replace(/^www\./, "");
    return (
      hostname.endsWith(".gov") ||
      hostname === "gov" ||
      hostname.endsWith(".mil") ||
      hostname === "mil" ||
      hostname.endsWith(".state.tx.us") ||
      hostname === "state.tx.us" ||
      hostname.endsWith(".tx.us") ||
      hostname === "tx.us"
    );
  } catch {
    return false;
  }
}

function officialSourcesOnly(sources: ArticleSource[] | undefined): ArticleSource[] | undefined {
  if (!Array.isArray(sources)) return sources;
  const seen = new Set<string>();
  const out: ArticleSource[] = [];

  for (const source of sources) {
    if (!source || !isOfficialArticleSource(source)) continue;
    const url = (source.url ?? "").trim();
    const label = (source.label ?? "").trim();
    const key = url.toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ label, url });
  }

  return out;
}

export function dedupeArticleBody<T extends ArticleBodyShape>(body: T): T {
  if (!body || typeof body !== "object") return body;
  const sourceBody = applyReviewedStaticArticleBodyUpgrade(body);
  const seenPara = new Set<string>();
  const seenSent = new Set<string>();
  const seenHeading = new Set<string>();

  const intro = Array.isArray(sourceBody.intro)
    ? dedupeParagraphs(sourceBody.intro, seenPara, seenSent)
    : sourceBody.intro;

  let sections: Section[] | undefined;
  if (Array.isArray(sourceBody.sections)) {
    sections = [];
    for (const sec of sourceBody.sections) {
      if (!sec) continue;
      const h = (sec.heading ?? "").trim();
      const hKey = norm(h);
      if (hKey && seenHeading.has(hKey)) continue;
      if (hKey) seenHeading.add(hKey);
      const paragraphs = Array.isArray(sec.paragraphs)
        ? dedupeParagraphs(sec.paragraphs, seenPara, seenSent)
        : [];
      const bullets = Array.isArray(sec.bullets) ? dedupeList(sec.bullets, new Set<string>()) : sec.bullets;
      const hasTable = Boolean(sec.table);
      const hasImage = Boolean(sec.image);
      if (paragraphs.length === 0 && (!bullets || bullets.length === 0) && !hasTable && !hasImage && !h) continue;
      sections.push({ ...sec, heading: h || undefined, paragraphs, bullets });
    }
  }

  const keyTakeaways = Array.isArray(sourceBody.keyTakeaways)
    ? dedupeList(sourceBody.keyTakeaways, new Set<string>())
    : sourceBody.keyTakeaways;

  let faq: FaqItem[] | undefined;
  if (Array.isArray(sourceBody.faq)) {
    const seenQ = new Set<string>();
    faq = [];
    for (const f of sourceBody.faq) {
      if (!f) continue;
      const q = (f.q ?? "").trim();
      const qKey = norm(q);
      if (!qKey || seenQ.has(qKey)) continue;
      seenQ.add(qKey);
      const a = (f.a ?? "").trim();
      faq.push({ q, a });
    }
  }

  const sources = officialSourcesOnly(sourceBody.sources);

  return { ...sourceBody, intro, sections, keyTakeaways, faq, sources } as T;
}

// True when the body still contains duplicate paragraphs/sentences after dedupe.
// Useful as a "block publish" gate.
export function hasDuplicateContent(body: ArticleBodyShape): boolean {
  const before = JSON.stringify(body ?? {});
  const after = JSON.stringify(dedupeArticleBody(body ?? {}));
  return before !== after;
}

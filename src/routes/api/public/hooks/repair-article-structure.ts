// Idempotent maintenance hook for repairing legacy daily_articles body_json rows
// that stored multiple visible paragraphs inside a single paragraph string.
//
// This endpoint intentionally accepts no arbitrary article content or SQL. It can
// only normalize existing stored article bodies and apply the fixed editorial
// structure for the known Austin/Lockhart BBQ article. Repeated calls are safe.
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/public/hooks/repair-article-structure")({
  server: {
    handlers: {
      GET: async () => repairLegacyArticleStructure(),
      POST: async () => repairLegacyArticleStructure(),
    },
  },
});

type ArticleSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  [key: string]: unknown;
};

type ArticleBody = {
  updated?: string;
  intro?: string[];
  sections?: ArticleSection[];
  faq?: unknown[];
  sources?: unknown[];
  keyTakeaways?: string[];
  [key: string]: unknown;
};

const BBQ_SLUG = "2026-08-09-austin-lockhart-bbq-ranking";
const BBQ_HEADINGS = [
  "Why Austin ranked first and Lockhart second",
  "What the ranking actually measures",
  "Why the Austin-Lockhart rivalry helps Central Texas",
  "Competition keeps Texas barbecue evolving",
  "Why there is still no objective barbecue champion",
] as const;
const MAX_PARAGRAPH_WORDS = 110;
const TARGET_PARAGRAPH_WORDS = 75;

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function splitSentences(value: string) {
  return value
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'\u201c])/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function repairParagraph(value: string): string[] {
  const explicit = (value ?? "")
    .split(/\r?\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const out: string[] = [];
  for (const paragraph of explicit) {
    if (wordCount(paragraph) <= MAX_PARAGRAPH_WORDS) {
      out.push(paragraph);
      continue;
    }

    const sentences = splitSentences(paragraph);
    if (sentences.length < 2) {
      out.push(paragraph);
      continue;
    }

    let current: string[] = [];
    let currentWords = 0;
    for (const sentence of sentences) {
      const sentenceWords = wordCount(sentence);
      if (current.length > 0 && currentWords + sentenceWords > TARGET_PARAGRAPH_WORDS) {
        out.push(current.join(" "));
        current = [];
        currentWords = 0;
      }
      current.push(sentence);
      currentWords += sentenceWords;
    }
    if (current.length) out.push(current.join(" "));
  }

  return out;
}

function normalizeBody(body: ArticleBody): ArticleBody {
  const intro = Array.isArray(body.intro)
    ? body.intro.flatMap((paragraph) => repairParagraph(String(paragraph ?? "")))
    : [];

  const sections = Array.isArray(body.sections)
    ? body.sections.map((section) => ({
        ...section,
        paragraphs: Array.isArray(section.paragraphs)
          ? section.paragraphs.flatMap((paragraph) => repairParagraph(String(paragraph ?? "")))
          : section.paragraphs,
      }))
    : [];

  return { ...body, intro, sections };
}

function flattenBodyParagraphs(body: ArticleBody): string[] {
  const values: string[] = [];
  if (Array.isArray(body.intro)) values.push(...body.intro);
  if (Array.isArray(body.sections)) {
    for (const section of body.sections) {
      if (Array.isArray(section.paragraphs)) values.push(...section.paragraphs);
    }
  }

  const seen = new Set<string>();
  return values
    .map((value) => String(value ?? "").trim())
    .filter((value) => value.length > 0)
    .filter((value) => {
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
}

function buildBbqBody(existing: ArticleBody, rawBody: string | null): ArticleBody {
  const fromRaw = rawBody
    ? rawBody
        .split(/\r?\n\s*\r?\n+/)
        .map((part) => part.trim())
        .filter(Boolean)
    : [];

  const normalizedExisting = normalizeBody(existing);
  const source = fromRaw.length >= 10 ? fromRaw : flattenBodyParagraphs(normalizedExisting);
  if (source.length < 8) return normalizedExisting;

  const intro = source[0];
  const remaining = source.slice(1);
  const first = remaining.slice(0, 2);
  const second = remaining.slice(2, 3);
  const third = remaining.slice(3, 5);
  const fourth = remaining.slice(5, 7);
  const fifth = remaining.slice(7);

  return {
    ...normalizedExisting,
    intro: [intro],
    sections: [
      { heading: BBQ_HEADINGS[0], paragraphs: first },
      { heading: BBQ_HEADINGS[1], paragraphs: second },
      { heading: BBQ_HEADINGS[2], paragraphs: third },
      { heading: BBQ_HEADINGS[3], paragraphs: fourth },
      { heading: BBQ_HEADINGS[4], paragraphs: fifth },
    ].filter((section) => section.paragraphs.length > 0),
  };
}

function bbqStatus(body: ArticleBody | null | undefined) {
  const headings = Array.isArray(body?.sections)
    ? body.sections.map((section) => String(section.heading ?? "")).filter(Boolean)
    : [];
  const paragraphCount = flattenBodyParagraphs(body ?? {}).length;
  return {
    structured: BBQ_HEADINGS.every((heading) => headings.includes(heading)),
    headings,
    paragraphCount,
  };
}

async function repairLegacyArticleStructure() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return json({ ok: false, error: "server not configured" }, 500);

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("daily_articles")
    .select("slug,body,body_json")
    .not("body_json", "is", null)
    .limit(5000);

  if (error) return json({ ok: false, error: error.message }, 500);

  let scanned = 0;
  let repaired = 0;
  let bbqFound = false;
  let bbqStructured = false;
  let bbqHeadings: string[] = [];
  let bbqParagraphCount = 0;
  const failures: Array<{ slug: string; error: string }> = [];

  for (const row of data ?? []) {
    scanned += 1;
    const raw = (row as { body_json?: ArticleBody | null }).body_json;
    if (!raw || typeof raw !== "object") continue;

    const slug = String((row as { slug: string }).slug);
    const isBbq = slug === BBQ_SLUG;
    if (isBbq) bbqFound = true;

    const next = isBbq
      ? buildBbqBody(raw, (row as { body?: string | null }).body ?? null)
      : normalizeBody(raw);

    if (JSON.stringify(next) !== JSON.stringify(raw)) {
      const { error: updateError } = await supabase
        .from("daily_articles")
        .update({ body_json: next })
        .eq("slug", slug);

      if (updateError) {
        failures.push({ slug, error: updateError.message });
        continue;
      }
      repaired += 1;
    }

    if (isBbq) {
      const state = bbqStatus(next);
      bbqStructured = state.structured;
      bbqHeadings = state.headings;
      bbqParagraphCount = state.paragraphCount;
    }
  }

  return json({
    ok: failures.length === 0 && (!bbqFound || bbqStructured),
    scanned,
    repaired,
    bbqFound,
    bbqStructured,
    bbqHeadings,
    bbqParagraphCount,
    failures: failures.slice(0, 20),
  }, failures.length === 0 && (!bbqFound || bbqStructured) ? 200 : 207);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

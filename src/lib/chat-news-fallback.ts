import afternoonSql from "../../supabase/migrations/20260808174500_publish_daily_texas_news_afternoon_batch.sql?raw";
import eveningSql from "../../supabase/migrations/20260808215000_publish_daily_texas_news_evening_batch.sql?raw";
import nightSql from "../../supabase/migrations/20260809012500_publish_daily_texas_news_night_batch.sql?raw";

type ChatNewsFallback = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  author: string;
  image_url: string | null;
  image_category: string | null;
  featured_image_url: string | null;
  image_alt_text: string | null;
  seo_headline: string | null;
  discover_category: string | null;
  seo_keywords: string[] | null;
  ctr_score: number | null;
  headline_variants: { a: string; b: string } | null;
  published_at: string;
  kind: string;
  keywords: string[] | null;
  body: {
    updated: string;
    intro: string[];
    sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
    faq: { q: string; a: string }[];
    sources: { label: string; url: string }[];
    keyTakeaways?: string[];
  };
};

const SQL_BATCHES = [afternoonSql, eveningSql, nightSql];

function decodeSqlString(value: string): string {
  const trimmed = value.trim().replace(/::[a-z_]+$/i, "");
  if (!trimmed.startsWith("'")) return trimmed;
  const end = trimmed.lastIndexOf("'");
  return trimmed.slice(1, end).replace(/''/g, "'");
}

function splitSqlFields(tuple: string): string[] {
  const fields: string[] = [];
  let current = "";
  let quoted = false;
  let depth = 0;
  for (let i = 0; i < tuple.length; i += 1) {
    const ch = tuple[i];
    if (ch === "'") {
      if (quoted && tuple[i + 1] === "'") {
        current += "''";
        i += 1;
        continue;
      }
      quoted = !quoted;
      current += ch;
      continue;
    }
    if (!quoted) {
      if (ch === "(") depth += 1;
      if (ch === ")") depth -= 1;
      if (ch === "," && depth === 0) {
        fields.push(current.trim());
        current = "";
        continue;
      }
    }
    current += ch;
  }
  fields.push(current.trim());
  return fields;
}

function extractTuples(sql: string): string[][] {
  const header = /WITH\s+items\(([^)]+)\)\s+AS\s*\(VALUES\s*/i.exec(sql);
  if (!header || header.index == null) return [];
  const columns = header[1].split(",").map((column) => column.trim());
  const start = header.index + header[0].length;
  const marker = /\n\),\s*prepared\s+AS\s*\(/i.exec(sql.slice(start));
  if (!marker || marker.index == null) return [];
  const block = sql.slice(start, start + marker.index);
  const tuples: string[][] = [];
  let quoted = false;
  let depth = 0;
  let tupleStart = -1;
  for (let i = 0; i < block.length; i += 1) {
    const ch = block[i];
    if (ch === "'") {
      if (quoted && block[i + 1] === "'") {
        i += 1;
        continue;
      }
      quoted = !quoted;
      continue;
    }
    if (quoted) continue;
    if (ch === "(") {
      if (depth === 0) tupleStart = i + 1;
      depth += 1;
    } else if (ch === ")") {
      depth -= 1;
      if (depth === 0 && tupleStart >= 0) {
        const fields = splitSqlFields(block.slice(tupleStart, i));
        if (fields.length === columns.length) tuples.push(fields);
        tupleStart = -1;
      }
    }
  }
  return [columns, ...tuples];
}

function parseBatch(sql: string): ChatNewsFallback[] {
  const extracted = extractTuples(sql);
  if (extracted.length < 2) return [];
  const columns = extracted[0];
  return extracted.slice(1).map((fields) => {
    const row = Object.fromEntries(columns.map((column, index) => [column, fields[index]]));
    const slug = decodeSqlString(row.slug);
    const publishedAt = decodeSqlString(row.published_at);
    const bodyText = decodeSqlString(row.body).replace(/\\n/g, "\n").trim();
    const paragraphs = bodyText.split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean);
    const sourceName = decodeSqlString(row.source_name);
    const sourceUrl = decodeSqlString(row.source_url);
    const imageUrl = decodeSqlString(row.image_url);
    return {
      slug,
      category: decodeSqlString(row.category),
      title: decodeSqlString(row.title),
      dek: decodeSqlString(row.dek),
      author: "Keep TX Red Editorial Team",
      image_url: imageUrl || null,
      image_category: null,
      featured_image_url: imageUrl || null,
      image_alt_text: decodeSqlString(row.image_alt_text) || null,
      seo_headline: null,
      discover_category: null,
      seo_keywords: null,
      ctr_score: null,
      headline_variants: null,
      published_at: publishedAt,
      kind: "news",
      keywords: null,
      body: {
        updated: publishedAt,
        intro: paragraphs.slice(0, 1),
        sections: [{ heading: "The story", paragraphs }],
        faq: [],
        sources: sourceName && sourceUrl ? [{ label: `${sourceName} — original report`, url: sourceUrl }] : [],
        keyTakeaways: [decodeSqlString(row.dek)],
      },
    };
  });
}

const CHAT_NEWS = new Map(SQL_BATCHES.flatMap(parseBatch).map((article) => [article.slug, article]));

export function getChatNewsFallbackBySlug(slug: string): ChatNewsFallback | null {
  return CHAT_NEWS.get(slug) ?? null;
}

export function getChatNewsFallbackCount(): number {
  return CHAT_NEWS.size;
}

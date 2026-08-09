import morning0930Sql from "../../supabase/migrations/20260808093000_musk-terafab-grimes-county-texas.sql?raw";
import morning0931Sql from "../../supabase/migrations/20260808093100_kerr-county-federal-disaster-aid-delay.sql?raw";
import morning0932Sql from "../../supabase/migrations/20260808093200_texas-childrens-pavilion-women-expansion.sql?raw";
import morning0933Sql from "../../supabase/migrations/20260808093300_texas-measles-alert-montgomery-county.sql?raw";
import morning0934Sql from "../../supabase/migrations/20260808093400_texas-thc-ban-enforcement.sql?raw";
import morning0935Sql from "../../supabase/migrations/20260808093500_daniella-guzman-kprc-return-ticket-review.sql?raw";
import morning0936Sql from "../../supabase/migrations/20260808093600_victor-wembanyama-soccer-katy.sql?raw";
import morning0937Sql from "../../supabase/migrations/20260808093700_houston-anime-threat-governor-office.sql?raw";
import morning0938Sql from "../../supabase/migrations/20260808093800_fdr-grandson-rolling-r-ranch-sale.sql?raw";
import morning0939Sql from "../../supabase/migrations/20260808093900_the-hop-webster-closes-preslees.sql?raw";
import middaySql from "../../supabase/migrations/20260808133000_publish_daily_texas_news_batch.sql?raw";
import afternoonSql from "../../supabase/migrations/20260808174500_publish_daily_texas_news_afternoon_batch.sql?raw";
import eveningSql from "../../supabase/migrations/20260808215000_publish_daily_texas_news_evening_batch.sql?raw";
import nightSql from "../../supabase/migrations/20260809012500_publish_daily_texas_news_night_batch.sql?raw";

export type ChatNewsFallback = {
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

const VALUE_BATCHES = [middaySql, afternoonSql, eveningSql, nightSql];
const SINGLE_INSERTS = [
  morning0930Sql,
  morning0931Sql,
  morning0932Sql,
  morning0933Sql,
  morning0934Sql,
  morning0935Sql,
  morning0936Sql,
  morning0937Sql,
  morning0938Sql,
  morning0939Sql,
];

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

function extractBalancedTuple(block: string, openIndex: number): string | null {
  let quoted = false;
  let depth = 0;
  for (let i = openIndex; i < block.length; i += 1) {
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
    if (ch === "(") depth += 1;
    else if (ch === ")") {
      depth -= 1;
      if (depth === 0) return block.slice(openIndex + 1, i);
    }
  }
  return null;
}

function extractTuples(sql: string): { columns: string[]; rows: string[][] } {
  const header = /WITH\s+items\(([^)]+)\)\s+AS\s*\(VALUES\s*/i.exec(sql);
  if (!header || header.index == null) return { columns: [], rows: [] };
  const columns = header[1].split(",").map((column) => column.trim());
  const start = header.index + header[0].length;
  const marker = /\n\),\s*prepared\s+AS\s*\(/i.exec(sql.slice(start));
  if (!marker || marker.index == null) return { columns: [], rows: [] };
  const block = sql.slice(start, start + marker.index);
  const rows: string[][] = [];
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
        if (fields.length === columns.length) rows.push(fields);
        tupleStart = -1;
      }
    }
  }
  return { columns, rows };
}

function parseValueBatch(sql: string): ChatNewsFallback[] {
  const { columns, rows } = extractTuples(sql);
  return rows.map((fields) => {
    const row = Object.fromEntries(columns.map((column, index) => [column, fields[index]]));
    const publishedAt = decodeSqlString(row.published_at);
    const bodyText = decodeSqlString(row.body).replace(/\\n/g, "\n").trim();
    const paragraphs = bodyText.split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean);
    const sourceName = decodeSqlString(row.source_name);
    const sourceUrl = decodeSqlString(row.source_url);
    const imageUrl = decodeSqlString(row.image_url);
    return {
      slug: decodeSqlString(row.slug),
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

function parseSingleInsert(sql: string): ChatNewsFallback | null {
  const header = /INSERT\s+INTO\s+public\.daily_articles\s*\(([^)]+)\)\s*VALUES\s*/i.exec(sql);
  if (!header || header.index == null) return null;
  const columns = header[1].split(",").map((column) => column.trim());
  const tupleOpen = sql.indexOf("(", header.index + header[0].length);
  if (tupleOpen < 0) return null;
  const tuple = extractBalancedTuple(sql, tupleOpen);
  if (!tuple) return null;
  const fields = splitSqlFields(tuple);
  if (fields.length !== columns.length) return null;
  const row = Object.fromEntries(columns.map((column, index) => [column, fields[index]]));
  const publishedAt = decodeSqlString(row.published_at);
  const sourceName = decodeSqlString(row.source_name);
  const sourceUrl = decodeSqlString(row.source_url);
  const imageUrl = decodeSqlString(row.image_url);
  let body: ChatNewsFallback["body"] | null = null;
  try {
    body = JSON.parse(decodeSqlString(row.body_json)) as ChatNewsFallback["body"];
  } catch {
    body = null;
  }
  if (!body) return null;
  return {
    slug: decodeSqlString(row.slug),
    category: decodeSqlString(row.category),
    title: decodeSqlString(row.title),
    dek: decodeSqlString(row.dek),
    author: "Keep TX Red Editorial Team",
    image_url: imageUrl || null,
    image_category: null,
    featured_image_url: decodeSqlString(row.featured_image_url) || imageUrl || null,
    image_alt_text: decodeSqlString(row.image_alt_text) || null,
    seo_headline: null,
    discover_category: null,
    seo_keywords: null,
    ctr_score: null,
    headline_variants: null,
    published_at: publishedAt,
    kind: decodeSqlString(row.kind) || "news",
    keywords: null,
    body,
  };
}

const CHAT_NEWS = new Map(
  [
    ...SINGLE_INSERTS.map(parseSingleInsert).filter((article): article is ChatNewsFallback => Boolean(article)),
    ...VALUE_BATCHES.flatMap(parseValueBatch),
  ].map((article) => [article.slug, article]),
);

export function getChatNewsFallbackBySlug(slug: string): ChatNewsFallback | null {
  return CHAT_NEWS.get(slug) ?? null;
}

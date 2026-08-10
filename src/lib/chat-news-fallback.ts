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

const migrationSql = Object.values(
  import.meta.glob("../../supabase/migrations/*.sql", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
) as string[];

function decode(value: string | undefined): string {
  if (!value) return "";
  const trimmed = value.trim().replace(/::[a-z_]+$/i, "");
  if (!trimmed.startsWith("'")) return trimmed;
  const end = trimmed.lastIndexOf("'");
  return trimmed.slice(1, end).replace(/''/g, "'");
}

function splitFields(tuple: string): string[] {
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
      else if (ch === ")") depth -= 1;
      else if (ch === "," && depth === 0) {
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

function balancedTuple(text: string, open: number): string | null {
  let quoted = false;
  let depth = 0;
  for (let i = open; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "'") {
      if (quoted && text[i + 1] === "'") {
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
      if (depth === 0) return text.slice(open + 1, i);
    }
  }
  return null;
}

function rowsFromBatch(sql: string): Record<string, string>[] {
  const header = /WITH\s+items\(([^)]+)\)\s+AS\s*\(VALUES\s*/i.exec(sql);
  if (!header || header.index == null) return [];
  const columns = header[1].split(",").map((v) => v.trim());
  const start = header.index + header[0].length;
  const marker = /\n\),\s*prepared\s+AS\s*\(/i.exec(sql.slice(start));
  if (!marker || marker.index == null) return [];
  const block = sql.slice(start, start + marker.index);
  const rows: Record<string, string>[] = [];
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
        const fields = splitFields(block.slice(tupleStart, i));
        if (fields.length === columns.length) {
          rows.push(Object.fromEntries(columns.map((column, index) => [column, fields[index]])));
        }
        tupleStart = -1;
      }
    }
  }
  return rows;
}

function rowFromInsert(sql: string): Record<string, string> | null {
  const header = /INSERT\s+INTO\s+public\.daily_articles\s*\(([^)]+)\)\s*VALUES\s*/i.exec(sql);
  if (!header || header.index == null) return null;
  const columns = header[1].split(",").map((v) => v.trim());
  const open = sql.indexOf("(", header.index + header[0].length);
  if (open < 0) return null;
  const tuple = balancedTuple(sql, open);
  if (!tuple) return null;
  const fields = splitFields(tuple);
  if (fields.length !== columns.length) return null;
  return Object.fromEntries(columns.map((column, index) => [column, fields[index]]));
}

// The first ten Aug. 8 newsroom migrations use a third SQL shape:
// WITH seed AS (SELECT <value> alias, ...) ... INSERT ... SELECT FROM prepared.
// Parse the seed SELECT directly so those articles still render when the remote
// database has not applied the migration yet.
function rowFromSeedSelect(sql: string): Record<string, string> | null {
  const header = /WITH\s+seed\s+AS\s*\(\s*SELECT\s+/i.exec(sql);
  if (!header || header.index == null) return null;
  const open = sql.indexOf("(", header.index);
  if (open < 0) return null;
  const seed = balancedTuple(sql, open);
  if (!seed) return null;
  const selectBody = seed.replace(/^\s*SELECT\s+/i, "").trim();
  const fields = splitFields(selectBody);
  const row: Record<string, string> = {};

  for (const field of fields) {
    const aliasMatch = /\s+([a-z_][a-z0-9_]*)\s*$/i.exec(field);
    if (!aliasMatch) continue;
    const alias = aliasMatch[1];
    row[alias] = field.slice(0, aliasMatch.index).trim();
  }

  return row.slug && row.published_at ? row : null;
}

function articleFromRow(row: Record<string, string>): ChatNewsFallback | null {
  const slug = decode(row.slug);
  const publishedAt = decode(row.published_at);
  if (!slug || !publishedAt) return null;
  const sourceName = decode(row.source_name);
  const sourceUrl = decode(row.source_url);
  const imageUrl = decode(row.image_url);
  let body: ChatNewsFallback["body"] | null = null;

  if (row.body_json) {
    try {
      body = JSON.parse(decode(row.body_json)) as ChatNewsFallback["body"];
    } catch {
      body = null;
    }
  } else if (row.body) {
    const paragraphs = decode(row.body).replace(/\\n/g, "\n").trim().split(/\n\s*\n/).map((v) => v.trim()).filter(Boolean);
    body = {
      updated: publishedAt,
      intro: paragraphs.slice(0, 1),
      sections: [{ heading: "The story", paragraphs }],
      faq: [],
      sources: sourceName && sourceUrl ? [{ label: `${sourceName} — original report`, url: sourceUrl }] : [],
      keyTakeaways: [decode(row.dek)].filter(Boolean),
    };
  }

  if (!body) return null;
  return {
    slug,
    category: decode(row.category),
    title: decode(row.title),
    dek: decode(row.dek),
    author: decode(row.author) || "Keep TX Red Editorial Team",
    image_url: imageUrl || null,
    image_category: null,
    featured_image_url: decode(row.featured_image_url) || imageUrl || null,
    image_alt_text: decode(row.image_alt_text) || null,
    seo_headline: null,
    discover_category: null,
    seo_keywords: null,
    ctr_score: null,
    headline_variants: null,
    published_at: publishedAt,
    kind: decode(row.kind) || "news",
    keywords: null,
    body,
  };
}

const articles = migrationSql.flatMap((sql) => {
  const rows = rowsFromBatch(sql);
  const single = rowFromInsert(sql);
  if (single) rows.push(single);
  const seed = rowFromSeedSelect(sql);
  if (seed) rows.push(seed);
  return rows.map(articleFromRow).filter((article): article is ChatNewsFallback => Boolean(article));
});

const CHAT_NEWS = new Map(articles.map((article) => [article.slug, article]));

export function getChatNewsFallbackBySlug(slug: string): ChatNewsFallback | null {
  return CHAT_NEWS.get(slug) ?? null;
}

export type PublicArticleSource = {
  label: string;
  url: string;
  headline?: string | null;
  sourceFamily?: string | null;
  publishedAt?: string | null;
  relationshipType?: "primary" | "supporting" | "confirmation" | "background" | null;
  primaryRecord: boolean;
  independent: boolean;
};

export type ArticleSourceTransparency = {
  sourceCount: number;
  independentSourceCount: number;
  primaryRecordCount: number;
  singleSource: boolean;
  sources: PublicArticleSource[];
  provenanceMode: "durable_cluster" | "body_json_fallback";
};

export type DurableSourceRow = {
  source_name?: string | null;
  source_family?: string | null;
  source_url?: string | null;
  canonical_url?: string | null;
  headline?: string | null;
  published_at?: string | null;
  relationship_type?: string | null;
  is_primary_record?: boolean | null;
  is_independent_source?: boolean | null;
};

export type FallbackSource = { label?: string | null; url?: string | null };

function clean(value?: string | null): string {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

export function canonicalSourceUrl(value?: string | null): string | null {
  const raw = clean(value);
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    parsed.hash = "";
    for (const key of [...parsed.searchParams.keys()]) {
      if (/^utm_/i.test(key) || ["fbclid", "gclid", "mc_cid", "mc_eid"].includes(key.toLowerCase())) {
        parsed.searchParams.delete(key);
      }
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function relationship(value?: string | null): PublicArticleSource["relationshipType"] {
  return value === "primary" || value === "supporting" || value === "confirmation" || value === "background"
    ? value
    : null;
}

function sourceKey(source: PublicArticleSource): string {
  return canonicalSourceUrl(source.url) ?? source.url;
}

function sortSources(a: PublicArticleSource, b: PublicArticleSource): number {
  if (a.primaryRecord !== b.primaryRecord) return a.primaryRecord ? -1 : 1;
  if (a.independent !== b.independent) return a.independent ? -1 : 1;
  const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
  const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
  if (aTime !== bTime) return bTime - aTime;
  return a.label.localeCompare(b.label);
}

export function buildArticleSourceTransparency(input: {
  durableSources?: DurableSourceRow[] | null;
  fallbackSources?: FallbackSource[] | null;
  durableSourceCount?: number | null;
  durableIndependentSourceCount?: number | null;
}): ArticleSourceTransparency {
  const durable = (input.durableSources ?? [])
    .map((row): PublicArticleSource | null => {
      const url = canonicalSourceUrl(row.canonical_url) ?? canonicalSourceUrl(row.source_url);
      if (!url) return null;
      const label = clean(row.source_name) || clean(row.source_family) || "Source";
      return {
        label,
        url,
        headline: clean(row.headline) || null,
        sourceFamily: clean(row.source_family) || null,
        publishedAt: clean(row.published_at) || null,
        relationshipType: relationship(row.relationship_type),
        primaryRecord: row.is_primary_record === true,
        independent: row.is_independent_source !== false,
      };
    })
    .filter((source): source is PublicArticleSource => source !== null);

  const fallback = (input.fallbackSources ?? [])
    .map((row): PublicArticleSource | null => {
      const url = canonicalSourceUrl(row.url);
      if (!url) return null;
      const label = clean(row.label) || "Source";
      return {
        label,
        url,
        headline: null,
        sourceFamily: null,
        publishedAt: null,
        relationshipType: null,
        primaryRecord: false,
        independent: true,
      };
    })
    .filter((source): source is PublicArticleSource => source !== null);

  const selected = durable.length > 0 ? durable : fallback;
  const byUrl = new Map<string, PublicArticleSource>();
  for (const source of selected) {
    const key = sourceKey(source);
    const current = byUrl.get(key);
    if (!current || source.primaryRecord || (!current.independent && source.independent)) byUrl.set(key, source);
  }
  const sources = [...byUrl.values()].sort(sortSources);
  const durableMode = durable.length > 0;
  const sourceCount = durableMode
    ? Math.max(sources.length, input.durableSourceCount ?? 0)
    : sources.length;
  const calculatedIndependent = sources.filter((source) => source.independent).length;
  const independentSourceCount = durableMode
    ? Math.max(calculatedIndependent, input.durableIndependentSourceCount ?? 0)
    : calculatedIndependent;

  return {
    sourceCount,
    independentSourceCount,
    primaryRecordCount: sources.filter((source) => source.primaryRecord).length,
    singleSource: independentSourceCount <= 1,
    sources,
    provenanceMode: durableMode ? "durable_cluster" : "body_json_fallback",
  };
}

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function fallbackTitleFromBrief(value: JsonRecord): string | null {
  const currentTitle = typeof value.title === "string" ? value.title.trim() : "";
  if (currentTitle.length >= 10) return null;
  if (typeof value.summary !== "string" || !Array.isArray(value.sections) || !isRecord(value.brief)) {
    return null;
  }

  const primaryEvent =
    typeof value.brief.primaryEvent === "string" ? value.brief.primaryEvent.trim() : "";
  if (primaryEvent.length < 10) return null;

  const normalized = primaryEvent
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/g, "")
    .trim()
    .slice(0, 110)
    .trim();
  return normalized.length >= 10 ? normalized : null;
}

export function normalizeArticleJsonValue(value: unknown): unknown {
  if (!isRecord(value)) return value;
  const fallbackTitle = fallbackTitleFromBrief(value);
  return fallbackTitle ? { ...value, title: fallbackTitle } : value;
}

export function normalizeJsonContent(rawContent: unknown): string | null {
  if (rawContent && typeof rawContent === "object") {
    return JSON.stringify(normalizeArticleJsonValue(rawContent));
  }
  if (typeof rawContent !== "string") return null;
  const content = rawContent.trim();
  if (!content) return null;
  try {
    return JSON.stringify(normalizeArticleJsonValue(JSON.parse(content)));
  } catch {
    return null;
  }
}

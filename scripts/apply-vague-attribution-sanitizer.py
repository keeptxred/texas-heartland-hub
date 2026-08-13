from pathlib import Path

news_path = Path('src/routes/api/public/hooks/generate-news.ts')
news = news_path.read_text()
test_path = Path('src/routes/api/public/hooks/generate-news.word-budget.test.ts')
test = test_path.read_text()

anchor = '''function rewrittenMainWordCount(article: Pick<RewrittenArticle, "summary" | "sections">): number {'''
sanitizer = r'''const VAGUE_ATTRIBUTION_PATTERNS: RegExp[] = [
  /\banalysts (?:say|believe)\b/i,
  /\bobservers (?:say|believe|note)\b/i,
  /\bexperts (?:say|suggest|believe)\b/i,
  /\bconsultants (?:say|note|believe)\b/i,
  /\bsources close to\b/i,
];

function stripVagueAttributionSentences(value?: string): string | undefined {
  if (typeof value !== "string") return value;
  const sentences = value.match(/[^.!?]+(?:[.!?]+|$)/g) ?? [value];
  const kept = sentences
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .filter((sentence) => !VAGUE_ATTRIBUTION_PATTERNS.some((pattern) => pattern.test(sentence)));
  return kept.join(" ").trim();
}

function sanitizeVagueAttribution(article: RewrittenArticle): void {
  article.title = stripVagueAttributionSentences(article.title) || article.title;
  article.dek = stripVagueAttributionSentences(article.dek) || article.dek;
  article.summary = stripVagueAttributionSentences(article.summary);
  article.relevance = stripVagueAttributionSentences(article.relevance);
  if (Array.isArray(article.sections)) {
    article.sections = article.sections.map((section) => ({
      ...section,
      heading: stripVagueAttributionSentences(section.heading) || section.heading,
      paragraphs: (section.paragraphs ?? [])
        .map((paragraph) => stripVagueAttributionSentences(paragraph) || "")
        .filter(Boolean),
    }));
  }
}

'''
if sanitizer.strip() not in news:
    if anchor not in news:
        raise SystemExit('word count helper anchor not found')
    news = news.replace(anchor, sanitizer + anchor, 1)

old_validation = '''    a.summary = normalizeSummaryLength(a.summary, a.sections);\n    const source = items[a.source_index - 1];'''
new_validation = '''    sanitizeVagueAttribution(a);\n    a.summary = normalizeSummaryLength(a.summary, a.sections);\n    const source = items[a.source_index - 1];'''
if old_validation not in news:
    raise SystemExit('validation sanitizer anchor not found')
news = news.replace(old_validation, new_validation, 1)

old_rules = '''- Use ONLY facts supported by the supplied verified source material. Avoid repetition and filler. If the verified source material genuinely cannot support an original factual article of at least ${INGESTED_MIN_MAIN_WORDS} qualifying words without inventing or repeating material, set brief.hasClearNewsEvent=false and leave the article body empty instead of fabricating content.'''
new_rules = '''- Use ONLY facts supported by the supplied verified source material. Avoid repetition and filler. Never use vague unsupported attribution such as “analysts say,” “observers believe,” “experts say/suggest/believe,” “consultants say,” or “sources close to.” Attribute claims to a named person or organization only when the verified source supports that attribution. If the verified source material genuinely cannot support an original factual article of at least ${INGESTED_MIN_MAIN_WORDS} qualifying words without inventing or repeating material, set brief.hasClearNewsEvent=false and leave the article body empty instead of fabricating content.'''
if old_rules not in news:
    raise SystemExit('body rules anchor not found')
news = news.replace(old_rules, new_rules, 1)

old_test = '''  it("uses the stronger Cloudflare rewrite model and one bounded underlength correction", () => {\n    expect(source).toContain('model: "@cf/qwen/qwen3-30b-a3b-fp8"');\n    expect(source).toContain("CORRECTIVE LONG-FORM PASS");\n    expect(source).toContain("mainWords < INGESTED_MIN_MAIN_WORDS");\n    expect(source).toContain("EACH of the 18 section paragraphs must be 65–80 words");\n    expect(source).toContain("verified_source_words: sourceWordCount(story.sourceText || story.description)");\n    expect(source).toContain('typeof article.verified_source_words === "number"');\n  });\n});'''
new_test = '''  it("uses the stronger Cloudflare rewrite model and one bounded underlength correction", () => {\n    expect(source).toContain('model: "@cf/qwen/qwen3-30b-a3b-fp8"');\n    expect(source).toContain("CORRECTIVE LONG-FORM PASS");\n    expect(source).toContain("mainWords < INGESTED_MIN_MAIN_WORDS");\n    expect(source).toContain("EACH of the 18 section paragraphs must be 65–80 words");\n    expect(source).toContain("verified_source_words: sourceWordCount(story.sourceText || story.description)");\n    expect(source).toContain('typeof article.verified_source_words === "number"');\n  });\n\n  it("removes vague unsupported attribution before editorial validation without another AI call", () => {\n    expect(source).toContain("VAGUE_ATTRIBUTION_PATTERNS");\n    expect(source).toContain("stripVagueAttributionSentences");\n    expect(source).toContain("sanitizeVagueAttribution(a)");\n    expect(source).toContain('/\\bexperts (?:say|suggest|believe)\\b/i');\n    expect(source).toContain("Never use vague unsupported attribution");\n  });\n});'''
if old_test not in test:
    raise SystemExit('test anchor not found')
test = test.replace(old_test, new_test, 1)

news_path.write_text(news)
test_path.write_text(test)

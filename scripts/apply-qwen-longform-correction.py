from pathlib import Path

news_path = Path('src/routes/api/public/hooks/generate-news.ts')
news = news_path.read_text()
server_path = Path('src/server.ts')
server = server_path.read_text()
test_path = Path('src/routes/api/public/hooks/generate-news.word-budget.test.ts')
test = test_path.read_text()

# Route-specific Cloudflare model selection.
old_model = '      model: "google/gemini-3-flash-preview",'
new_model = '      model: "@cf/qwen/qwen3-30b-a3b-fp8",'
if old_model not in news:
    raise SystemExit('news model anchor not found')
news = news.replace(old_model, new_model, 1)

# Preserve the hydrated verified-source word count on the internal rewritten article.
old_type = '''  faq?: { q: string; a: string }[];\n};'''
new_type = '''  faq?: { q: string; a: string }[];\n  verified_source_words?: number;\n};'''
if old_type not in news:
    raise SystemExit('rewritten type anchor not found')
news = news.replace(old_type, new_type, 1)

# Use one shared qualifying draft counter before row construction.
parse_anchor = '''function normalizeSummaryLength(summary?: string, sections?: NewsSection[]): string | undefined {'''
helper = '''function rewrittenMainWordCount(article: Pick<RewrittenArticle, "summary" | "sections">): number {\n  const mainText = [\n    article.summary ?? "",\n    ...(article.sections ?? []).flatMap((section) => [\n      section.heading ?? "",\n      ...(section.paragraphs ?? []),\n    ]),\n  ].join(" ");\n  return mainText.trim().split(/\\s+/).filter(Boolean).length;\n}\n\n'''
if helper.strip() not in news:
    if parse_anchor not in news:
        raise SystemExit('summary normalizer anchor not found')
    news = news.replace(parse_anchor, helper + parse_anchor, 1)

# Allow a one-off corrective instruction on the second generation call.
old_sig = 'async function rewriteBatchWithAi(items: ScoredItem[], lovableApiKey: string) {'
new_sig = 'async function rewriteBatchWithAi(items: ScoredItem[], lovableApiKey: string, correctiveInstruction = "") {'
if old_sig not in news:
    raise SystemExit('rewrite batch signature anchor not found')
news = news.replace(old_sig, new_sig, 1)

old_batch_note = '''        { role: "system", content: system + EDITORIAL_SYSTEM_ADDENDUM + `\\n\\nBATCH NOTE: for a batch call, include the "brief" object INSIDE each articles[] entry, e.g. {"articles":[{"brief":{...}, "source_index":..., "title":..., ...}]}. Any article whose brief.hasClearNewsEvent is false will be discarded — leave that entry's body fields empty rather than fabricating.` },'''
new_batch_note = '''        { role: "system", content: system + EDITORIAL_SYSTEM_ADDENDUM + (correctiveInstruction ? `\\n\\n${correctiveInstruction}` : "") + `\\n\\nBATCH NOTE: for a batch call, include the "brief" object INSIDE each articles[] entry, e.g. {"articles":[{"brief":{...}, "source_index":..., "title":..., ...}]}. Any article whose brief.hasClearNewsEvent is false will be discarded — leave that entry's body fields empty rather than fabricating.` },'''
if old_batch_note not in news:
    raise SystemExit('batch note anchor not found')
news = news.replace(old_batch_note, new_batch_note, 1)

old_article_block = '''      const rewritten = await rewriteBatchWithAi([story], lovableApiKey);\n      const article = rewritten.find((candidate) => candidate.source_index === 1);\n      if (article) {\n        combined.push({ ...article, source_index: originalIndex + 1 });\n      } else {'''
new_article_block = '''      const rewritten = await rewriteBatchWithAi([story], lovableApiKey);\n      const firstArticle = rewritten.find((candidate) => candidate.source_index === 1);\n      if (firstArticle) {\n        let article = firstArticle;\n        let mainWords = rewrittenMainWordCount(article);\n\n        if (mainWords < INGESTED_MIN_MAIN_WORDS) {\n          const correctiveInstruction = `CORRECTIVE LONG-FORM PASS: The previous valid draft produced only ${mainWords} qualifying main-story words, below the ${INGESTED_MIN_MAIN_WORDS}-word publication floor. Regenerate the COMPLETE article from the same verified source. Keep exactly 6 sections with exactly 3 separate paragraphs each. EACH of the 18 section paragraphs must be 65–80 words, so section prose alone totals at least 1,170 words before the summary. Use all concrete chronology, named entities, figures, decisions, causes, effects, and context explicitly supported by the verified source. Do not repeat yourself and do not invent facts. If the verified source cannot support that length without invention or repetition, set brief.hasClearNewsEvent=false instead.`;\n          try {\n            const corrected = await rewriteBatchWithAi([story], lovableApiKey, correctiveInstruction);\n            const correctedArticle = corrected.find((candidate) => candidate.source_index === 1);\n            const correctedWords = correctedArticle ? rewrittenMainWordCount(correctedArticle) : 0;\n            if (correctedArticle && correctedWords > mainWords) {\n              article = correctedArticle;\n              mainWords = correctedWords;\n            }\n          } catch (correctiveError) {\n            if (isQuotaOrRateLimitError(correctiveError)) throw correctiveError;\n            console.warn("[generate-news] corrective long-form pass failed; retaining first valid draft for final hard gate", {\n              sourceIndex: originalIndex + 1,\n              title: story.title,\n              firstDraftWords: mainWords,\n              error: String(correctiveError),\n            });\n          }\n        }\n\n        combined.push({\n          ...article,\n          source_index: originalIndex + 1,\n          verified_source_words: sourceWordCount(story.sourceText || story.description),\n        });\n      } else {'''
if old_article_block not in news:
    raise SystemExit('article correction anchor not found')
news = news.replace(old_article_block, new_article_block, 1)

# Reuse the same draft counter and use the preserved hydrated-source count in diagnostics.
old_diag_counts = '''          const mainWordCounts = rewritten.map((article) => {\n            const mainText = [\n              article.summary ?? "",\n              ...(article.sections ?? []).flatMap((section) => [\n                section.heading ?? "",\n                ...(section.paragraphs ?? []),\n              ]),\n            ].join(" ");\n            return mainText.trim().split(/\\s+/).filter(Boolean).length;\n          });\n          const sourceWordCounts = rewritten.map((article) => {\n            const source = items[article.source_index - 1];\n            return sourceWordCount(source?.sourceText || source?.description);\n          });'''
new_diag_counts = '''          const mainWordCounts = rewritten.map(rewrittenMainWordCount);\n          const sourceWordCounts = rewritten.map((article) => {\n            if (typeof article.verified_source_words === "number") return article.verified_source_words;\n            const source = items[article.source_index - 1];\n            return sourceWordCount(source?.sourceText || source?.description);\n          });'''
if old_diag_counts not in news:
    raise SystemExit('diagnostic count anchor not found')
news = news.replace(old_diag_counts, new_diag_counts, 1)

# The compatibility adapter honors an explicit Cloudflare model requested by a caller.
old_server_model = '''  const model = process.env.AI_REWRITE_MODEL_CF || CLOUDFLARE_TEXT_MODEL;'''
new_server_model = '''  const requestedModel = body.model?.trim();\n  const model = requestedModel?.startsWith("@cf/")\n    ? requestedModel\n    : process.env.AI_REWRITE_MODEL_CF || CLOUDFLARE_TEXT_MODEL;'''
if old_server_model not in server:
    raise SystemExit('server model anchor not found')
server = server.replace(old_server_model, new_server_model, 1)

# Protect the route model, the single corrective pass, and hydrated diagnostic mapping.
old_test_end = '''  it("requires enough verified source material before spending AI quota", () => {\n    expect(source).toContain("const MIN_VERIFIED_SOURCE_WORDS = 900");\n    expect(source).toContain("sourceWords >= MIN_VERIFIED_SOURCE_WORDS");\n    expect(source).toContain("skipped thin verified source before AI rewrite");\n    expect(source).toContain('reason: "insufficient_verified_source"');\n    expect(source).toContain("min_verified_source_words: MIN_VERIFIED_SOURCE_WORDS");\n    expect(source).toContain("source_word_counts: sourceWordCounts.slice(0, 10)");\n  });\n});'''
new_test_end = '''  it("requires enough verified source material before spending AI quota", () => {\n    expect(source).toContain("const MIN_VERIFIED_SOURCE_WORDS = 900");\n    expect(source).toContain("sourceWords >= MIN_VERIFIED_SOURCE_WORDS");\n    expect(source).toContain("skipped thin verified source before AI rewrite");\n    expect(source).toContain('reason: "insufficient_verified_source"');\n    expect(source).toContain("min_verified_source_words: MIN_VERIFIED_SOURCE_WORDS");\n    expect(source).toContain("source_word_counts: sourceWordCounts.slice(0, 10)");\n  });\n\n  it("uses the stronger Cloudflare rewrite model and one bounded underlength correction", () => {\n    expect(source).toContain('model: "@cf/qwen/qwen3-30b-a3b-fp8"');\n    expect(source).toContain("CORRECTIVE LONG-FORM PASS");\n    expect(source).toContain("mainWords < INGESTED_MIN_MAIN_WORDS");\n    expect(source).toContain("EACH of the 18 section paragraphs must be 65–80 words");\n    expect(source).toContain("verified_source_words: sourceWordCount(story.sourceText || story.description)");\n    expect(source).toContain('typeof article.verified_source_words === "number"');\n  });\n});'''
if old_test_end not in test:
    raise SystemExit('word budget test anchor not found')
test = test.replace(old_test_end, new_test_end, 1)

news_path.write_text(news)
server_path.write_text(server)
test_path.write_text(test)

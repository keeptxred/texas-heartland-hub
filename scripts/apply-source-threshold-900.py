from pathlib import Path

path = Path('src/routes/api/public/hooks/generate-news.ts')
text = path.read_text()

old_threshold = 'const MIN_VERIFIED_SOURCE_WORDS = 600;'
new_threshold = 'const MIN_VERIFIED_SOURCE_WORDS = 900;'
if old_threshold not in text:
    raise SystemExit('source threshold anchor not found')
text = text.replace(old_threshold, new_threshold, 1)

old_diag = '''        if (rows.length === 0) {\n          const mainWordCounts = rewritten.map((article) => {\n            const mainText = [\n              article.summary ?? "",\n              ...(article.sections ?? []).flatMap((section) => [\n                section.heading ?? "",\n                ...(section.paragraphs ?? []),\n              ]),\n            ].join(" ");\n            return mainText.trim().split(/\\s+/).filter(Boolean).length;\n          });\n          return Response.json(\n            {\n              error: "No valid rewritten articles",\n              diagnostics: {\n                rewritten: rewritten.length,\n                min_main_words: INGESTED_MIN_MAIN_WORDS,\n                main_word_counts: mainWordCounts.slice(0, 10),\n              },\n            },\n            { status: 500 },\n          );\n        }\n'''
new_diag = '''        if (rows.length === 0) {\n          const mainWordCounts = rewritten.map((article) => {\n            const mainText = [\n              article.summary ?? "",\n              ...(article.sections ?? []).flatMap((section) => [\n                section.heading ?? "",\n                ...(section.paragraphs ?? []),\n              ]),\n            ].join(" ");\n            return mainText.trim().split(/\\s+/).filter(Boolean).length;\n          });\n          const sourceWordCounts = rewritten.map((article) => {\n            const source = items[article.source_index - 1];\n            return sourceWordCount(source?.sourceText || source?.description);\n          });\n          return Response.json(\n            {\n              error: "No valid rewritten articles",\n              diagnostics: {\n                rewritten: rewritten.length,\n                min_main_words: INGESTED_MIN_MAIN_WORDS,\n                min_verified_source_words: MIN_VERIFIED_SOURCE_WORDS,\n                main_word_counts: mainWordCounts.slice(0, 10),\n                source_word_counts: sourceWordCounts.slice(0, 10),\n              },\n            },\n            { status: 500 },\n          );\n        }\n'''
if old_diag not in text:
    raise SystemExit('diagnostics anchor not found')
text = text.replace(old_diag, new_diag, 1)

path.write_text(text)

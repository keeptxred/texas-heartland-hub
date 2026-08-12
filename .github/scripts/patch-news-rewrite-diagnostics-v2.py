from pathlib import Path

path = Path('src/routes/api/public/hooks/generate-news.ts')
s = path.read_text()

old = '''  const raw = parseAiArticles(content);
  const kept: RewrittenArticle[] = [];
  for (const a of raw) {
    if (a?.brief?.hasClearNewsEvent === false) continue;
    if (!Number.isInteger(a.source_index) || a.source_index < 1 || a.source_index > items.length) continue;
    const source = items[a.source_index - 1];
    const sourceText = source ? `${source.title} ${source.description}` : undefined;
    const v = validateArticle(
      {
        title: a.title,
        dek: a.dek,
        summary: a.summary,
        relevance: a.relevance,
        sections: a.sections,
        faq: a.faq,
        keyTakeaways: a.keyTakeaways,
      },
      a.brief,
      sourceText,
    );
    if (!v.ok) {
      console.warn("[generate-news] editorial validation dropped article", { title: a.title, reasons: v.reasons });
      continue;
    }
    kept.push(a);
  }
  return kept;'''
new = '''  const raw = parseAiArticles(content);
  const kept: RewrittenArticle[] = [];
  const rejectionReasons: string[] = [];
  for (const a of raw) {
    if (a?.brief?.hasClearNewsEvent === false) {
      rejectionReasons.push("brief_no_clear_news_event");
      continue;
    }
    if (!Number.isInteger(a.source_index) || a.source_index < 1 || a.source_index > items.length) {
      rejectionReasons.push("invalid_source_index");
      continue;
    }
    const source = items[a.source_index - 1];
    const sourceText = source ? `${source.title} ${source.description}` : undefined;
    const v = validateArticle(
      {
        title: a.title,
        dek: a.dek,
        summary: a.summary,
        relevance: a.relevance,
        sections: a.sections,
        faq: a.faq,
        keyTakeaways: a.keyTakeaways,
      },
      a.brief,
      sourceText,
    );
    if (!v.ok) {
      rejectionReasons.push(...v.reasons);
      console.warn("[generate-news] editorial validation dropped article", { title: a.title, reasons: v.reasons });
      continue;
    }
    kept.push(a);
  }
  if (kept.length === 0) {
    const reasons = [...new Set(rejectionReasons)].slice(0, 12);
    throw new Error(
      `AI response produced ${raw.length} article(s), none passed editorial validation: ${reasons.join(",") || "no_articles"}`,
    );
  }
  return kept;'''
if old not in s:
    raise SystemExit('rewriteBatch validation block not found')
s = s.replace(old, new, 1)

old2 = '''async function rewriteWithAi(items: ScoredItem[], lovableApiKey: string) {
  const selected = items.slice(0, 10);
  const combined: RewrittenArticle[] = [];

  // Free-tier Gemini is more reliable when each long-form story gets its own
  // structured-output request and full output-token budget.
  for (let index = 0; index < selected.length; index += 1) {
    const story = selected[index];
    try {
      const rewritten = await rewriteBatchWithAi([story], lovableApiKey);
      const article = rewritten.find((candidate) => candidate.source_index === 1);
      if (article) {
        combined.push({ ...article, source_index: index + 1 });
      } else {
        console.warn("[generate-news] individual story produced no editorially valid article", {
          sourceIndex: index + 1,
          title: story.title,
        });
      }
    } catch (storyError) {
      if (isQuotaOrRateLimitError(storyError)) throw storyError;
      console.warn("[generate-news] individual story rewrite skipped after one attempt", {
        sourceIndex: index + 1,
        title: story.title,
        error: String(storyError),
      });
    }

    if (index < selected.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return combined.slice(0, 10);
}'''
new2 = '''async function rewriteWithAi(items: ScoredItem[], lovableApiKey: string) {
  const selected = items.slice(0, 10);
  const combined: RewrittenArticle[] = [];
  const failures: string[] = [];

  // Free-tier Gemini is more reliable when each long-form story gets its own
  // structured-output request and full output-token budget.
  for (let index = 0; index < selected.length; index += 1) {
    const story = selected[index];
    try {
      const rewritten = await rewriteBatchWithAi([story], lovableApiKey);
      const article = rewritten.find((candidate) => candidate.source_index === 1);
      if (article) {
        combined.push({ ...article, source_index: index + 1 });
      } else {
        const message = `story ${index + 1} produced no editorially valid article`;
        failures.push(message);
        console.warn("[generate-news] individual story produced no editorially valid article", {
          sourceIndex: index + 1,
          title: story.title,
        });
      }
    } catch (storyError) {
      if (isQuotaOrRateLimitError(storyError)) throw storyError;
      failures.push(String(storyError));
      console.warn("[generate-news] individual story rewrite skipped after one attempt", {
        sourceIndex: index + 1,
        title: story.title,
        error: String(storyError),
      });
    }

    if (index < selected.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (combined.length === 0 && failures.length > 0) {
    throw new Error(`All selected rewrites failed: ${failures.slice(0, 3).join(" | ")}`);
  }

  return combined.slice(0, 10);
}'''
if old2 not in s:
    raise SystemExit('rewriteWithAi block not found')
s = s.replace(old2, new2, 1)

old3 = '''        if (rows.length === 0) {
          return Response.json({ error: "No valid rewritten articles" }, { status: 500 });
        }'''
new3 = '''        if (rows.length === 0) {
          const mainWordCounts = rewritten.map((article) => {
            const mainText = [
              article.summary ?? "",
              ...(article.sections ?? []).flatMap((section) => [
                section.heading ?? "",
                ...(section.paragraphs ?? []),
              ]),
            ].join(" ");
            return mainText.trim().split(/\\s+/).filter(Boolean).length;
          });
          return Response.json(
            {
              error: "No valid rewritten articles",
              diagnostics: {
                rewritten: rewritten.length,
                min_main_words: INGESTED_MIN_MAIN_WORDS,
                main_word_counts: mainWordCounts.slice(0, 10),
              },
            },
            { status: 500 },
          );
        }'''
if old3 not in s:
    raise SystemExit('rows.length diagnostics block not found')
s = s.replace(old3, new3, 1)

path.write_text(s)

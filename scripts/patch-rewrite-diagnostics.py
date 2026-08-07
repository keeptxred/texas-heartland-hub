from pathlib import Path
import re

path = Path("src/routes/api/public/hooks/ingest-feeds.ts")
text = path.read_text()


def sub(pattern: str, replacement: str) -> None:
    global text
    text, count = re.subn(pattern, replacement, text, count=1)
    if count != 1:
        raise SystemExit(f"Expected one replacement, got {count}: {pattern[:100]}")


sub(
    r'async function rewriteItem\(it: Item, lovableApiKey: string\): Promise<Rewrite \| null> \{',
    '''const rewriteFailureReasons = new WeakMap<Item, string>();

function setRewriteFailure(it: Item, reason: string): void {
  rewriteFailureReasons.set(it, `AI rewrite failed — ${reason}`);
}

function getRewriteFailure(it: Item): string {
  return rewriteFailureReasons.get(it) ?? "AI rewrite failed — unknown failure after AI generation";
}

async function rewriteItem(it: Item, lovableApiKey: string): Promise<Rewrite | null> {''',
)

start = text.index('  const result = await runEditorialRewrite<Rewrite>(async (addendum) => {')
end_marker = '  });\n\n  const parsed = result.article;'
end = text.index(end_marker, start)
replacement = '''  let gatewayFailureReason: string | null = null;
  const result = await runEditorialRewrite<Rewrite>(async (addendum, attempt) => {
    gatewayFailureReason = null;
    try {
      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: REWRITE_SYSTEM + addendum },
            { role: "user", content: userMessage },
          ],
          response_format: { type: "json_object" },
          max_tokens: 9000,
        }),
        signal: AbortSignal.timeout(90000),
      });
      if (!r.ok) {
        gatewayFailureReason = `AI gateway HTTP ${r.status} during ${attempt}`;
        return { raw: null };
      }

      let data: { choices?: { message?: { content?: string } }[] };
      try {
        data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
      } catch {
        gatewayFailureReason = `AI gateway returned invalid response JSON during ${attempt}`;
        return { raw: null };
      }

      const raw = data.choices?.[0]?.message?.content ?? null;
      if (!raw?.trim()) {
        gatewayFailureReason = `AI gateway returned an empty response during ${attempt}`;
        return { raw: null };
      }
      try {
        JSON.parse(raw);
      } catch {
        gatewayFailureReason = `AI gateway returned invalid article JSON during ${attempt}`;
      }
      return { raw };
    } catch (error) {
      const name = error instanceof Error ? error.name : "";
      gatewayFailureReason = name === "TimeoutError" || name === "AbortError"
        ? `AI gateway timed out during ${attempt}`
        : `AI gateway request failed during ${attempt}: ${error instanceof Error ? error.message : "unknown error"}`;
      return { raw: null };
    }
  });

  const parsed = result.article;'''
text = text[:start] + replacement + text[end + len(end_marker):]

sub(
    r'''    return null;\n  \}\n  if \(!parsed\.title \|\| !parsed\.summary \|\| !parsed\.dek\) return null;\n  if \(!parsed\.relevance \|\| parsed\.relevance\.trim\(\)\.length < 40\) return null;''',
    '''    const validationDetail = result.validation.reasons.length
      ? result.validation.reasons.join(", ")
      : result.droppedReason ?? "unknown editorial rejection";
    setRewriteFailure(
      it,
      gatewayFailureReason ??
        (result.droppedReason === "no_clear_news_event"
          ? "editorial analysis found no clear news event"
          : `editorial validation rejected the draft: ${validationDetail}`),
    );
    return null;
  }
  if (!parsed.title || !parsed.summary || !parsed.dek) {
    setRewriteFailure(it, "editorial output was missing title, summary, or dek");
    return null;
  }
  if (!parsed.relevance || parsed.relevance.trim().length < 40) {
    setRewriteFailure(it, "editorial output was missing a usable Texas relevance explanation");
    return null;
  }''',
)

sub(
    r'''\.select\("result_json,status"\)\n    \.eq\("content_fingerprint", fingerprint\)\n    \.maybeSingle\(\);\n  const cached = cachedRow as unknown as \{ result_json\?: Rewrite \| null; status\?: string \} \| null;\n  let rw = cached\?\.status === "completed" && cached\.result_json \? cached\.result_json : null;''',
    '''.select("result_json,status,failure_reason")
    .eq("content_fingerprint", fingerprint)
    .maybeSingle();
  const cached = cachedRow as unknown as {
    result_json?: Rewrite | null;
    status?: string;
    failure_reason?: string | null;
  } | null;
  let rw = cached?.status === "completed" && cached.result_json ? cached.result_json : null;
  let rewriteFailureReason = cached?.failure_reason ?? null;''',
)

sub(
    r'''\.select\("result_json"\)\n        \.eq\("content_fingerprint", fingerprint\)\n        \.maybeSingle\(\);\n      rw =\n        \(refreshedRow as unknown as \{ result_json\?: Rewrite \| null \} \| null\)\?\.result_json \?\? null;\n    \} else \{\n      rw = await rewriteItemWithRetry\(item, lovableApiKey\);\n      const cacheUpdate = rw''',
    '''.select("result_json,failure_reason")
        .eq("content_fingerprint", fingerprint)
        .maybeSingle();
      const refreshed = refreshedRow as unknown as {
        result_json?: Rewrite | null;
        failure_reason?: string | null;
      } | null;
      rw = refreshed?.result_json ?? null;
      rewriteFailureReason = refreshed?.failure_reason ?? rewriteFailureReason;
    } else {
      rw = await rewriteItemWithRetry(item, lovableApiKey);
      rewriteFailureReason = rw ? null : getRewriteFailure(item);
      const cacheUpdate = rw''',
)

sub(
    r'failure_reason: "AI rewrite failed",',
    'failure_reason: rewriteFailureReason ?? getRewriteFailure(item),',
)
sub(
    r'  if \(!rw\) return \{ ok: false, error: "AI rewrite failed" \};',
    '''  if (!rw) {
    return {
      ok: false,
      error: rewriteFailureReason ?? getRewriteFailure(item),
    };
  }''',
)

path.write_text(text)

type Rewrite = {
  title: string;
  dek: string;
  keywords?: string[];
  summary: string;
  relevance: string;
  analysis?: string;
  sections?: { heading: string; paragraphs: string[] }[];
  keyTakeaways?: string[];
  faq?: { q: string; a: string }[];
  category?: string;
};

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function mainProseWordCount(rewrite: Rewrite): number {
  return wordCount(
    [
      rewrite.summary,
      rewrite.analysis ?? "",
      ...(rewrite.sections ?? []).flatMap((section) => section.paragraphs ?? []),
    ].join(" "),
  );
}

function targetFor(rewrite: Rewrite): number {
  const category = (rewrite.category ?? "").toLowerCase();
  return ["non-political", "business", "education", "sports"].includes(category) ? 1200 : 800;
}

async function contentFingerprint(parts: string[]): Promise<string> {
  const normalized = parts.join("\n");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function expandCachedRewriteForFeedItem(
  feedItemId: number,
  requiredMinimum?: number,
): Promise<boolean> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: row } = await supabaseAdmin
    .from("texas_news_feed")
    .select("id,title,link,source,description,pub_date,extracted_body")
    .eq("id", feedItemId)
    .maybeSingle();

  if (!row) return false;

  const description = (row.extracted_body ?? row.description ?? "").trim();
  const fingerprint = await contentFingerprint([
    row.link.trim().toLowerCase(),
    row.title.trim().replace(/\s+/g, " ").toLowerCase(),
    row.pub_date.slice(0, 10),
    description.replace(/\s+/g, " "),
  ]);

  // Generated DB types may lag the migration that introduced this cache.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cacheClient = supabaseAdmin as any;
  const { data: cacheRow } = await cacheClient
    .from("ai_rewrite_cache")
    .select("result_json,status")
    .eq("content_fingerprint", fingerprint)
    .maybeSingle();

  const prior = cacheRow?.status === "completed" ? (cacheRow.result_json as Rewrite | null) : null;
  if (!prior) return false;

  // Manual publish passes the exact tier that rejected the draft. Fall back to
  // the cached rewrite's own category only for older callers that do not pass it.
  const target = Math.max(targetFor(prior), requiredMinimum ?? 0);
  let candidate = prior;
  let currentWords = mainProseWordCount(candidate);
  if (currentWords >= target) return true;

  const lovableApiKey = process.env.LOVABLE_API_KEY;
  if (!lovableApiKey) return false;

  // The server compatibility layer intercepts this legacy endpoint and routes
  // text-only requests to Cloudflare Workers AI. Try more than once because a
  // valid expansion can still be longer than the cached draft without yet
  // clearing the publishing tier.
  try {
    for (let attempt = 1; attempt <= 3 && currentWords < target; attempt += 1) {
      const needed = target - currentWords;
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content:
                "Expand an existing Keep TX Red article using only the supplied source and draft. Preserve every verified fact, do not invent quotations, numbers, events, or relationships, and return valid JSON in the same schema. The completed main-story prose MUST meet the requested minimum word count.",
            },
            {
              role: "user",
              content: `SOURCE: ${row.source}\nORIGINAL HEADLINE: ${row.title}\nSOURCE TEXT: ${description}\nLINK: ${row.link}\nDATE: ${row.pub_date}\n\nEXPANSION ATTEMPT ${attempt} OF 3. The generated article currently has ${currentWords} main-story words and MUST reach at least ${target}. It is short by ${needed} words. Add at least ${needed + 200} words of factual MAIN STORY PROSE across summary, analysis, and sections. Use omitted source-supported details, chronology, stakeholders, consequences, and reader context; do not pad with repetition or invented facts. Preserve the schema and all verified facts. Return JSON only.\n\nDRAFT JSON:\n${JSON.stringify(candidate)}`,
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 12000,
        }),
        signal: AbortSignal.timeout(120000),
      });

      if (!response.ok) return false;
      const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
      const expanded = JSON.parse(payload.choices?.[0]?.message?.content ?? "{}") as Rewrite;
      if (!expanded.title || !expanded.summary || !expanded.dek || !expanded.relevance) return false;

      expanded.dek = expanded.dek.slice(0, 155);
      expanded.keywords = (expanded.keywords ?? candidate.keywords ?? [])
        .slice(0, 10)
        .map((keyword) => String(keyword).toLowerCase());
      expanded.keyTakeaways = (expanded.keyTakeaways ?? candidate.keyTakeaways ?? []).slice(0, 5);
      expanded.sections = (expanded.sections ?? [])
        .filter((section) => section?.heading && Array.isArray(section.paragraphs) && section.paragraphs.length > 0)
        .slice(0, 12);

      const expandedWords = mainProseWordCount(expanded);
      if (expandedWords <= currentWords) continue;

      candidate = expanded;
      currentWords = expandedWords;
    }

    // Never report a successful repair unless the draft actually satisfies the
    // same minimum that blocked publication. This prevents the old behavior
    // where a 415-word draft could become, for example, 900 words and still be
    // treated as repaired against a 1,200-word gate.
    if (currentWords < target) return false;

    const { error } = await cacheClient
      .from("ai_rewrite_cache")
      .update({
        status: "completed",
        result_json: candidate,
        failure_reason: null,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("content_fingerprint", fingerprint);

    return !error;
  } catch (error) {
    console.error("[expandCachedRewriteForFeedItem] expansion failed", {
      feed_item_id: feedItemId,
      target,
      current_words: currentWords,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

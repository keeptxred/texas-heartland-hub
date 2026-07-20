import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  token: z.string().min(1),
  headline: z.string().min(1),
  source: z.string().default(""),
  description: z.string().default(""),
  category: z.string().default(""),
  publishedAt: z.string().default(""),
});

export type ContentAIResult = {
  facebookPost: { hook: string; body: string; callToAction: string; hashtags: string[] };
  instagramReel: { hook: string; script: string; caption: string; hashtags: string[] };
  seoPackage: { title: string; metaDescription: string; suggestedKeywords: string[] };
};

type OkResp = { ok: true; data: ContentAIResult };
type ErrResp = { ok: false; error: string };

const SYSTEM = `You are a Texas-focused conservative news social media editor for KeepTXRed.com.
Produce concise, factual, high-engagement copy. Do NOT invent facts. Keep tone confident and neutral-conservative.
Return ONLY valid JSON matching the requested schema. No prose outside JSON.`;

export const generateContentPackageFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }): Promise<OkResp | ErrResp> => {
    const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
    if (data.token !== expected) return { ok: false, error: "Unauthorized" };

    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { ok: false, error: "Missing LOVABLE_API_KEY" };

    const userPrompt = `Content item:
Headline: ${data.headline}
Source: ${data.source}
Category: ${data.category}
Published: ${data.publishedAt}
Description: ${data.description || "(none)"}

Generate a social + SEO package. Return JSON exactly in this shape.
Rules for facebookPost: Do NOT include the publisher name or any "Source:" line.
Do NOT write "Read more at KeepTXRed.com". Do NOT include any URL — Facebook attaches the article link automatically.
{
  "facebookPost": {
    "hook": "1 attention-grabbing opening line",
    "body": "2-4 sentence engagement summary grounded in the headline. No publisher name, no 'Source:' line, no URL.",
    "callToAction": "1 short engagement CTA (e.g. a question to readers). Do NOT write 'Read more at KeepTXRed.com'. No URL.",
    "hashtags": ["#KeepTexasRed", "..."]
  },
  "instagramReel": {
    "hook": "3-second spoken hook",
    "script": "30-45 second script with [0-3s], [3-15s], [15-35s], [35-45s] beats",
    "caption": "Caption under 200 chars",
    "hashtags": ["#KeepTexasRed", "..."]
  },
  "seoPackage": {
    "title": "SEO title under 60 chars",
    "metaDescription": "Meta description under 158 chars",
    "suggestedKeywords": ["5-8 short keyword phrases"]
  }
}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `AI gateway ${res.status}: ${body.slice(0, 200)}` };
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "{}";

    try {
      const parsed = JSON.parse(content) as Partial<ContentAIResult>;
      const fb = parsed.facebookPost ?? { hook: "", body: "", callToAction: "", hashtags: [] };
      const ig = parsed.instagramReel ?? { hook: "", script: "", caption: "", hashtags: [] };
      const seo = parsed.seoPackage ?? { title: "", metaDescription: "", suggestedKeywords: [] };
      return {
        ok: true,
        data: {
          facebookPost: {
            hook: String(fb.hook ?? ""),
            body: String(fb.body ?? ""),
            callToAction: String(fb.callToAction ?? ""),
            hashtags: Array.isArray(fb.hashtags) ? fb.hashtags.map(String) : [],
          },
          instagramReel: {
            hook: String(ig.hook ?? ""),
            script: String(ig.script ?? ""),
            caption: String(ig.caption ?? ""),
            hashtags: Array.isArray(ig.hashtags) ? ig.hashtags.map(String) : [],
          },
          seoPackage: {
            title: String(seo.title ?? ""),
            metaDescription: String(seo.metaDescription ?? ""),
            suggestedKeywords: Array.isArray(seo.suggestedKeywords)
              ? seo.suggestedKeywords.map(String)
              : [],
          },
        },
      };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Failed to parse AI response" };
    }
  });
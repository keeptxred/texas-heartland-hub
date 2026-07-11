// AI Featured Image System.
// Generates a unique, original editorial image per article via the
// Lovable AI Gateway (Nano Banana 2), uploads it to the private
// "article-images" Supabase bucket, and stores CDN-safe metadata
// on daily_articles. Never touches article slug, URL, body, or
// existing image_url — featured_image_url is a separate column
// that takes priority at render time.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractEntities } from "@/lib/nlp";

const MODEL = "google/gemini-3.1-flash-image";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/images/generations";
const CHAT_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const BUCKET = "article-images";

type ArticleRow = {
  slug: string;
  title: string;
  dek: string | null;
  category: string | null;
  keywords: string[] | null;
  seo_keywords: string[] | null;
  affected_regions: string[] | null;
  seo_headline: string | null;
  discover_category: string | null;
  texas_impact_summary: string | null;
  featured_image_url: string | null;
  image_generation_status: string | null;
  body_json: unknown;
};

function sanitizeFilename(slug: string): string {
  return (
    slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "article"
  );
}

/** Pull the first paragraph out of the article's body_json.intro (array of strings). */
function firstParagraph(bodyJson: unknown): string {
  if (!bodyJson || typeof bodyJson !== "object") return "";
  const bj = bodyJson as { intro?: unknown; sections?: unknown };
  if (Array.isArray(bj.intro) && bj.intro.length > 0 && typeof bj.intro[0] === "string") {
    return bj.intro[0].slice(0, 500);
  }
  if (Array.isArray(bj.sections) && bj.sections.length > 0) {
    const s = bj.sections[0] as { paragraphs?: unknown; body?: unknown };
    if (Array.isArray(s?.paragraphs) && typeof s.paragraphs[0] === "string") {
      return s.paragraphs[0].slice(0, 500);
    }
    if (typeof s?.body === "string") return s.body.slice(0, 500);
  }
  return "";
}

type Domain =
  | "wildlife"
  | "weather"
  | "energy"
  | "sports"
  | "business"
  | "military"
  | "education"
  | "health"
  | "transportation"
  | "housing"
  | "politics"
  | "border"
  | "culture"
  | "general";

const DOMAIN_KEYWORDS: Array<[Domain, RegExp]> = [
  ["wildlife", /\b(jellyfish|shark|whale|dolphin|bird|fish|species|wildlife|migration|reef|coral|deer|coyote|snake|alligator|manatee|turtle|habitat|ecosystem|marine|coastal wildlife)\b/i],
  ["weather", /\b(hurricane|tornado|flood|drought|storm|heat wave|freeze|blizzard|wildfire|rainfall|weather)\b/i],
  ["energy", /\b(oil|gas|permian|pipeline|refinery|ercot|grid|wind farm|solar farm|drilling|rig)\b/i],
  ["sports", /\b(cowboys|texans|rangers|astros|mavericks|spurs|rockets|stars|nfl|nba|mlb|football|basketball|baseball|playoff)\b/i],
  ["military", /\b(military|army|navy|air force|marines|fort hood|fort cavazos|base|installation|soldier|veteran)\b/i],
  ["education", /\b(school|isd|university|college|teacher|classroom|student|curriculum)\b/i],
  ["health", /\b(hospital|clinic|doctor|nurse|patient|disease|virus|outbreak|medicaid|healthcare)\b/i],
  ["transportation", /\b(highway|interstate|traffic|txdot|airport|rail|transit|bridge|road construction)\b/i],
  ["housing", /\b(housing|rent|home price|real estate|apartment|homebuyer|mortgage|property tax|appraisal)\b/i],
  ["border", /\b(border|migrant|immigration|cartel|rio grande|asylum)\b/i],
  ["business", /\b(company|corporation|factory|manufacturing|semiconductor|tech|film|festival|investment|economy|jobs|hiring)\b/i],
  ["politics", /\b(governor|senator|representative|legislature|capitol|abbott|patrick|paxton|cruz|cornyn|bill|law|policy|election|ballot)\b/i],
  ["culture", /\b(rodeo|barbecue|music|festival|art|museum|heritage|cultural)\b/i],
];

function inferDomain(text: string): Domain {
  for (const [d, re] of DOMAIN_KEYWORDS) if (re.test(text)) return d;
  return "general";
}

type SubjectExtract = {
  title: string;
  firstParagraph: string;
  entities: string[];
  locations: string[];
  domain: Domain;
  concreteSubject: string; // one-line description of the actual thing to depict
};

function extractImageSubject(row: ArticleRow): SubjectExtract {
  const title = row.seo_headline?.trim() || row.title;
  const intro = firstParagraph(row.body_json);
  const haystack = `${title} ${row.dek ?? ""} ${intro}`;
  const entities = extractEntities(haystack);
  const locations = [
    ...(row.affected_regions ?? []),
    ...entities.filter((e) =>
      /houston|dallas|austin|san antonio|fort worth|el paso|rio grande|texas/i.test(e),
    ),
  ].filter((v, i, a) => a.indexOf(v) === i);
  const domain = inferDomain(haystack);

  // First-pass concrete subject = the title itself, refined by the first
  // paragraph. The AI validator later gets a chance to catch drift.
  const concreteSubject = intro
    ? `${title}. Context: ${intro}`
    : title;

  return { title, firstParagraph: intro, entities, locations, domain, concreteSubject };
}

const DOMAIN_STEER: Record<Domain, string> = {
  wildlife:
    "Depict the actual species named in the article in its natural habitat. Correct anatomy, natural lighting, water/land environment appropriate to the animal. No zoos, no cartoons.",
  weather:
    "Depict the actual weather phenomenon and its effect on the Texas landscape (flooded street, cracked drought soil, storm-damaged neighborhood, etc.).",
  energy:
    "Depict the actual energy infrastructure (oil pump jack, refinery, wind turbines, transmission lines, drilling rig) in a Texas setting.",
  sports:
    "Depict a game-day sports scene — stadium, playing field, generic athletic action — with no identifiable player faces, jerseys with names, or team logos.",
  military:
    "Depict a military installation scene: hangars, training grounds, aircraft, or personnel in silhouette. No identifiable faces, no unit insignia.",
  education:
    "Depict a school setting: classroom, hallway, playground, or campus exterior. No identifiable children's faces.",
  health: "Depict a hospital or clinical setting relevant to the story. No identifiable patients or staff.",
  transportation: "Depict the actual road, highway, airport, or transit infrastructure described.",
  housing: "Depict Texas neighborhoods, homes, or construction — the real subject, not stock finance imagery.",
  border: "Depict the border landscape, river, or fence line. No identifiable faces.",
  business:
    "Depict the actual industry or facility described (factory floor, film set, storefront). No branded signage.",
  politics:
    "Depict the government setting the story is about only when the article is explicitly about the legislature, capitol, or a named official. Otherwise depict the policy's real-world effect.",
  culture: "Depict the cultural scene or event described.",
  general:
    "Depict a specific, believable real-world Texas scene tied directly to the article's subject.",
};

/** Build a detailed editorial image prompt from article context.
 *  Leads with the concrete subject (title + first paragraph), applies
 *  domain-specific steering, and hard-blocks generic newsroom imagery
 *  unless the article is literally about it. */
export function buildImagePrompt(
  subject: SubjectExtract,
  extraGuidance = "",
): string {
  const t = `${subject.title} ${subject.firstParagraph}`;
  const capitolAllowed =
    /capitol|legislature|governor|abbott|patrick|session|state house|state senate/i.test(t);
  const flagAllowed = /flag|patriot|independence|texas day/i.test(t);
  const newsroomAllowed =
    /newspaper|journalism|reporter|press freedom|media industry|newsroom/i.test(t);

  const avoid = [
    "no logos of any kind",
    "no brand names or trademarks",
    "no political party symbols (elephants, donkeys, MAGA, campaign signs)",
    "no copyrighted characters or celebrities",
    "no text, letters, watermarks, or captions anywhere in the image",
    "no AI hands with extra fingers, no distorted anatomy",
    !newsroomAllowed
      ? "absolutely no newspapers, no stacks of paper, no printing presses, no reporters, no microphones, no press conferences, no news anchor desks, no TV studios, no laptops or computers, no generic office or desk scenes, no 'breaking news' graphics"
      : "",
    !capitolAllowed
      ? "avoid the Texas State Capitol dome and generic government-building shots"
      : "",
    !flagAllowed ? "avoid generic Texas or American flag imagery" : "",
  ]
    .filter(Boolean)
    .join("; ");

  const style =
    "Professional editorial photography, natural lighting, realistic composition, cinematic depth of field, 16:9 landscape, muted editorial color palette with warm Texas tones.";

  const loc = subject.locations.slice(0, 2).join(", ");

  return [
    `PRIMARY SUBJECT (must be clearly the main focus of the image): ${subject.concreteSubject}`,
    loc ? `Location context: ${loc}, Texas.` : "",
    DOMAIN_STEER[subject.domain],
    `The image must visually depict the primary subject above — a viewer glancing at the image should immediately understand it is about this specific subject, not a generic news topic.`,
    `If people appear, show anonymous everyday Texans from behind or in silhouette, faces obscured or out of frame. Do not depict identifiable real politicians or celebrities.`,
    style,
    `Strict rules: ${avoid}.`,
    extraGuidance,
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildAltText(a: { title: string; category?: string | null }): string {
  const cat = a.category ? ` — ${a.category}` : "";
  return `Editorial illustration for Keep TX Red news article: ${a.title}${cat}`;
}

async function generateImageBytes(prompt: string): Promise<Uint8Array> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Image gateway ${res.status}: ${body.slice(0, 400)}`);
  }
  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("Gateway returned no image data");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** Ask a vision model: does this image actually match the article subject?
 *  Fails open (returns matches=true) if the validator call itself errors. */
async function validateImageMatchesArticle(
  bytes: Uint8Array,
  subject: SubjectExtract,
): Promise<{ matches: boolean; reason: string }> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) return { matches: true, reason: "validator skipped: no api key" };
  try {
    let b64 = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      b64 += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    b64 = btoa(b64);
    const res = await fetch(CHAT_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  `You are validating a featured image for a news article.\n` +
                  `Article title: "${subject.title}"\n` +
                  `Primary subject to depict: ${subject.concreteSubject}\n\n` +
                  `Look at the image and answer strict JSON only (no code fences):\n` +
                  `{"matches": boolean, "reason": "one short sentence"}\n\n` +
                  `matches=false if the image is generic news imagery (newspapers, reporters, microphones, laptops, offices, "breaking news" graphics) unless the article is literally about journalism.\n` +
                  `matches=false if the image does not clearly depict the primary subject above.\n` +
                  `matches=true only if a reader would immediately recognize the image is about the primary subject.`,
              },
              { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } },
            ],
          },
        ],
      }),
    });
    if (!res.ok) return { matches: true, reason: `validator http ${res.status}` };
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return { matches: true, reason: "validator returned no json" };
    const parsed = JSON.parse(m[0]) as { matches?: boolean; reason?: string };
    return {
      matches: parsed.matches !== false,
      reason: String(parsed.reason ?? "").slice(0, 300),
    };
  } catch (e) {
    return { matches: true, reason: `validator error: ${(e as Error).message}` };
  }
}

async function serviceClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function generateAndStore(
  row: ArticleRow,
  opts: { overwrite?: boolean } = {},
): Promise<{ ok: true; url: string; alt: string } | { ok: false; error: string }> {
  const supabase = await serviceClient();

  if (!opts.overwrite && row.featured_image_url) {
    return { ok: true, url: row.featured_image_url, alt: buildAltText(row) };
  }

  const subject = extractImageSubject(row);
  const prompt = buildImagePrompt(subject);
  const alt = buildAltText(row);
  const filename = `${sanitizeFilename(row.slug)}.png`;

  await supabase
    .from("daily_articles")
    .update({ image_generation_status: "generating", image_prompt: prompt })
    .eq("slug", row.slug);

  try {
    let bytes = await generateImageBytes(prompt);
    let verdict = await validateImageMatchesArticle(bytes, subject);
    let usedPrompt = prompt;
    if (!verdict.matches) {
      const stronger = buildImagePrompt(
        subject,
        `PREVIOUS ATTEMPT FAILED VALIDATION because: "${verdict.reason}". You MUST fix this. Depict the primary subject literally and specifically. Do not include anything the validator flagged.`,
      );
      usedPrompt = stronger;
      const retryBytes = await generateImageBytes(stronger);
      const retryVerdict = await validateImageMatchesArticle(retryBytes, subject);
      // Keep the better of the two attempts.
      if (retryVerdict.matches || !verdict.matches) {
        bytes = retryBytes;
        verdict = retryVerdict;
      }
    }
    const path = filename;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, {
        contentType: "image/png",
        cacheControl: "public, max-age=31536000, immutable",
        upsert: true,
      });
    if (upErr) throw upErr;

    // Public passthrough URL — private bucket served via our own route.
    const url = `/api/public/article-image/${filename}`;

    await supabase
      .from("daily_articles")
      .update({
        featured_image_url: url,
        image_alt_text: alt,
        image_generation_status: "ready",
        image_prompt: usedPrompt,
        image_validation_note: `${verdict.matches ? "ok" : "weak"}: ${verdict.reason}`,
      })
      .eq("slug", row.slug);

    return { ok: true, url, alt };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await supabase
      .from("daily_articles")
      .update({ image_generation_status: "failed" })
      .eq("slug", row.slug);
    return { ok: false, error: msg };
  }
}

const SELECT_COLS =
  "slug,title,dek,category,keywords,seo_keywords,affected_regions,seo_headline,discover_category,texas_impact_summary,featured_image_url,image_generation_status,body_json";

/** Generate featured image for one slug (idempotent unless overwrite=true). */
export const generateFeaturedImageForSlug = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({ slug: z.string().min(1).max(200), overwrite: z.boolean().optional() })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const supabase = await serviceClient();
    const { data: row, error } = await supabase
      .from("daily_articles")
      .select(SELECT_COLS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error || !row) return { ok: false as const, error: "Article not found" };
    return generateAndStore(row as ArticleRow, { overwrite: !!data.overwrite });
  });

/** Admin-gated regenerate (checks shared passcode header). */
export const regenerateFeaturedImage = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ slug: z.string().min(1).max(200), token: z.string().min(1) }).parse(d),
  )
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
    if (data.token !== expected) return { ok: false as const, error: "Unauthorized" };
    const supabase = await serviceClient();
    const { data: row, error } = await supabase
      .from("daily_articles")
      .select(SELECT_COLS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error || !row) return { ok: false as const, error: "Article not found" };
    return generateAndStore(row as ArticleRow, { overwrite: true });
  });

/** Backfill helper: pull N articles missing a featured image and generate them. */
export async function backfillBatch(limit = 5): Promise<{
  processed: number;
  ok: number;
  failed: number;
  results: { slug: string; ok: boolean; error?: string }[];
}> {
  const supabase = await serviceClient();
  const { data: rows } = await supabase
    .from("daily_articles")
    .select(SELECT_COLS)
    .is("featured_image_url", null)
    .neq("image_generation_status", "generating")
    .in("image_generation_status", ["pending", "failed"])
    .in("kind", ["evergreen", "ingested", "news", "sports-nfl", "sports-mlb", "sports-nba"])
    .order("published_at", { ascending: false })
    .limit(limit);

  const results: { slug: string; ok: boolean; error?: string }[] = [];
  for (const row of (rows ?? []) as ArticleRow[]) {
    const r = await generateAndStore(row, { overwrite: false });
    results.push({ slug: row.slug, ok: r.ok, error: r.ok ? undefined : r.error });
  }
  return {
    processed: results.length,
    ok: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  };
}
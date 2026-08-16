// AI Featured Image System.
// Generates a unique, original editorial image per article via Cloudflare
// Workers AI, uploads it to the private "article-images" Supabase bucket,
// and stores CDN-safe metadata on daily_articles. Never touches article
// slug, URL, body, or existing image_url — featured_image_url is a separate
// column that takes priority at render time.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractEntities } from "@/lib/nlp";

const CLOUDFLARE_IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";
const CLOUDFLARE_VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";
const BUCKET = "article-images";
const PURPLE_HEART_IMAGE_URL = "/images/military-honors/purple-heart.svg";

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

type BodySection = { heading?: string; paragraphs?: string[]; bullets?: string[] };

function bodyJsonText(bodyJson: unknown): string {
  if (!bodyJson || typeof bodyJson !== "object") return "";
  const bj = bodyJson as { intro?: unknown; sections?: unknown; faq?: unknown; keyTakeaways?: unknown };
  const parts: string[] = [];
  if (Array.isArray(bj.intro)) {
    for (const p of bj.intro) if (typeof p === "string") parts.push(p);
  }
  if (Array.isArray(bj.sections)) {
    for (const raw of bj.sections) {
      const s = raw as BodySection;
      if (typeof s.heading === "string") parts.push(s.heading);
      if (Array.isArray(s.paragraphs)) for (const p of s.paragraphs) if (typeof p === "string") parts.push(p);
      if (Array.isArray(s.bullets)) for (const p of s.bullets) if (typeof p === "string") parts.push(p);
    }
  }
  if (Array.isArray(bj.faq)) {
    for (const raw of bj.faq) {
      const f = raw as { q?: unknown; a?: unknown };
      if (typeof f.q === "string") parts.push(f.q);
      if (typeof f.a === "string") parts.push(f.a);
    }
  }
  if (Array.isArray(bj.keyTakeaways)) {
    for (const p of bj.keyTakeaways) if (typeof p === "string") parts.push(p);
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function topArticleTerms(text: string): string[] {
  const terms = new Set<string>();
  const titleCase = text.match(/\b(?:[A-Z][a-z]+(?:\s+|$)){1,5}/g) ?? [];
  for (const raw of titleCase) {
    const term = raw.trim().replace(/\s+/g, " ");
    if (term.length >= 4 && !/^(Texas|Keep TX Red|The|This|What|Why|How)$/i.test(term)) terms.add(term);
  }
  const species = text.match(/\b(?:Australian spotted jellyfish|jellyfish|alligator|sea turtle|turtle|dolphin|shark|whale|bird|fish|deer|coyote|snake|manatee|bat|oyster|coral|wildlife|species)\b/gi) ?? [];
  for (const s of species) terms.add(s.toLowerCase());
  return Array.from(terms).slice(0, 12);
}

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
  ["military", /\b(purple heart|medal of honor|military|army|navy|air force|marines|fort hood|fort cavazos|base|installation|soldier|veteran)\b/i],
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
  concreteSubject: string;
};

function extractImageSubject(row: ArticleRow): SubjectExtract {
  const title = row.seo_headline?.trim() || row.title;
  const intro = firstParagraph(row.body_json);
  const fullBody = bodyJsonText(row.body_json).slice(0, 2500);
  const haystack = `${title} ${row.dek ?? ""} ${intro} ${fullBody}`;
  const entities = extractEntities(haystack);
  const locations = [
    ...(row.affected_regions ?? []),
    ...entities.filter((e) => /houston|dallas|austin|san antonio|fort worth|el paso|rio grande|texas/i.test(e)),
  ].filter((v, i, a) => a.indexOf(v) === i);
  const domain = inferDomain(haystack);
  const terms = topArticleTerms(haystack);
  const concreteSubject = intro
    ? `${title}. Context: ${intro}. Concrete subjects to show if present: ${terms.join(", ") || "the specific event, place, animal, object, or people described"}.`
    : title;
  return { title, firstParagraph: intro, entities, locations, domain, concreteSubject };
}

const DOMAIN_STEER: Record<Domain, string> = {
  wildlife: "Depict the actual species named in the article in its natural habitat. Correct anatomy, natural lighting, water/land environment appropriate to the animal. No zoos, no cartoons.",
  weather: "Depict the actual weather phenomenon and its effect on the Texas landscape (flooded street, cracked drought soil, storm-damaged neighborhood, etc.).",
  energy: "Depict the actual energy infrastructure (oil pump jack, refinery, wind turbines, transmission lines, drilling rig) in a Texas setting.",
  sports: "Depict a game-day sports scene — stadium, playing field, generic athletic action — with no identifiable player faces, jerseys with names, or team logos.",
  military: "Depict the specific military honor, medal, installation, aircraft, personnel, or commemoration named by the story. When a medal or decoration is named, the medal itself must dominate the image. No identifiable faces, no unit insignia.",
  education: "Depict a school setting: classroom, hallway, playground, or campus exterior. No identifiable children's faces.",
  health: "Depict a believable hospital, campus, construction, or clinical-facility setting relevant to the story. No identifiable patients or staff and no generic medical-symbol placeholder.",
  transportation: "Depict the actual road, highway, airport, or transit infrastructure described.",
  housing: "Depict Texas neighborhoods, homes, or construction — the real subject, not stock finance imagery.",
  border: "Depict the border landscape, river, or fence line. No identifiable faces.",
  business: "Depict the actual industry or facility described (factory floor, film set, storefront). No branded signage.",
  politics: "Depict a realistic government setting only when the article is explicitly about that setting; otherwise depict the policy's real-world effect rather than abstract symbols.",
  culture: "Depict the cultural scene or event described.",
  general: "Depict a specific, believable real-world Texas scene tied directly to the article's subject.",
};

export function buildImagePrompt(subject: SubjectExtract, extraGuidance = ""): string {
  const t = `${subject.title} ${subject.firstParagraph}`;
  const capitolAllowed = /capitol|legislature|governor|abbott|patrick|session|state house|state senate/i.test(t);
  const flagAllowed = /flag|patriot|independence|texas day/i.test(t);
  const newsroomAllowed = /newspaper|journalism|reporter|press freedom|media industry|newsroom/i.test(t);

  const avoid = [
    "no illustration",
    "no vector art",
    "no infographic",
    "no collage",
    "no split screen",
    "no poster",
    "no headline text",
    "no captions",
    "no watermarks",
    "no decorative typography",
    "no fake UI",
    "no icons",
    "no clip art",
    "no simplified geometric shapes",
    "no generic symbolic placeholder image",
    "no logos of any kind",
    "no brand names or trademarks",
    "no political party symbols",
    "no copyrighted characters or celebrities",
    "no AI hands with extra fingers and no distorted anatomy",
    !newsroomAllowed ? "no generic newsroom, newspaper, microphone, TV studio, laptop, office, or breaking-news graphic" : "",
    !capitolAllowed ? "avoid the Texas State Capitol dome and generic government-building shots" : "",
    !flagAllowed ? "avoid generic Texas or American flag imagery" : "",
  ].filter(Boolean).join("; ");

  const loc = subject.locations.slice(0, 2).join(", ");
  return [
    "Create a single photorealistic 16:9 editorial news photograph for this exact article.",
    `PRIMARY SUBJECT (must be clearly the main focus of the image): ${subject.concreteSubject}`,
    loc ? `Location context: ${loc}, Texas.` : "Use believable Texas surroundings where relevant.",
    DOMAIN_STEER[subject.domain],
    "Require realistic professional news/editorial photography, natural lighting, realistic materials and textures, believable scale and perspective, and one coherent scene.",
    "The viewer should immediately understand the concrete subject of this specific story. Do not substitute abstract symbolism for a named place, object, event, facility, industry, weather condition, business, or issue.",
    "If people appear, use anonymous everyday Texans from behind, in silhouette, or with faces out of frame unless a properly licensed official photograph is deliberately being used. Do not fabricate a recognizable real person's face.",
    "Output a landscape JPEG in 16:9, sRGB, no transparency, approximately 1024 by 576 pixels, under 4 MB.",
    `Strict rules: ${avoid}.`,
    extraGuidance,
  ].filter(Boolean).join(" ");
}

export function buildAltText(a: { title: string; category?: string | null }): string {
  const cat = a.category ? ` — ${a.category}` : "";
  return `Editorial news photograph for Keep TX Red article: ${a.title}${cat}`;
}

function staticFeaturedImage(row: ArticleRow): { url: string; alt: string } | null {
  const subject = `${row.title} ${row.seo_headline ?? ""} ${row.dek ?? ""}`;
  if (/\bpurple heart\b/i.test(subject)) {
    return { url: PURPLE_HEART_IMAGE_URL, alt: `Purple Heart medal — ${row.title}` };
  }
  return null;
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function cloudflareEndpoint(accountId: string, model: string): string {
  return `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`;
}

async function generateImageBytes(prompt: string): Promise<Uint8Array> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) throw new Error("Missing Cloudflare Workers AI credentials: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required");

  const res = await fetch(cloudflareEndpoint(accountId, CLOUDFLARE_IMAGE_MODEL), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt.slice(0, 2048), steps: 4 }),
  });

  const raw = await res.text().catch(() => "");
  let json: { success?: boolean; result?: { image?: string }; image?: string; errors?: { message?: string }[]; error?: { message?: string } } = {};
  try { json = raw ? JSON.parse(raw) : {}; } catch { throw new Error(`Cloudflare Workers AI returned a non-JSON response: ${raw.slice(0, 400)}`); }
  if (!res.ok || json.success === false) {
    const detail = json.errors?.[0]?.message || json.error?.message || raw || `HTTP ${res.status}`;
    throw new Error(`Cloudflare Workers AI ${res.status}: ${String(detail).slice(0, 400)}`);
  }
  const b64 = json.result?.image || json.image;
  if (!b64) throw new Error("Cloudflare Workers AI returned no image data");
  return base64ToBytes(b64);
}

async function validateImageMatchesArticle(bytes: Uint8Array, subject: SubjectExtract): Promise<{ matches: boolean; reason: string }> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return { matches: false, reason: "Cloudflare vision validator unavailable: missing credentials" };
  try {
    const image = `data:image/jpeg;base64,${bytesToBase64(bytes)}`;
    const validationPrompt = [
      `Article title: "${subject.title}"`,
      `Primary subject: ${subject.concreteSubject}`,
      "Return strict JSON only: {\"matches\":boolean,\"photorealistic\":boolean,\"reason\":\"short sentence\"}.",
      "matches=false if the scene does not clearly depict the primary subject or is generic news symbolism.",
      "photorealistic=false if it looks illustrated, vector-like, cartoon-like, poster-like, icon-based, diagrammatic, collage-like, flat, synthetic-placeholder-like, or contains prominent generated text/signage.",
      "Both values should be true only for a believable professional editorial news photograph tied directly to this story.",
    ].join("\n");
    const res = await fetch(cloudflareEndpoint(accountId, CLOUDFLARE_VISION_MODEL), {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a strict editorial photo quality-control reviewer." },
          { role: "user", content: validationPrompt },
        ],
        image,
        max_tokens: 160,
        temperature: 0,
      }),
    });
    const raw = await res.text().catch(() => "");
    let json: { success?: boolean; result?: { response?: string } | string; errors?: { message?: string }[] } = {};
    try { json = raw ? JSON.parse(raw) : {}; } catch { return { matches: false, reason: `Cloudflare vision returned non-JSON HTTP payload ${res.status}` }; }
    if (!res.ok || json.success === false) {
      return { matches: false, reason: `Cloudflare vision HTTP ${res.status}: ${json.errors?.[0]?.message || raw.slice(0, 180)}` };
    }
    const output = typeof json.result === "string" ? json.result : json.result?.response ?? "";
    const m = output.match(/\{[\s\S]*\}/);
    if (!m) return { matches: false, reason: "Cloudflare vision validator returned no JSON verdict" };
    const parsed = JSON.parse(m[0]) as { matches?: boolean; photorealistic?: boolean; reason?: string };
    const ok = parsed.matches === true && parsed.photorealistic === true;
    return { matches: ok, reason: String(parsed.reason ?? (ok ? "story match and photorealism passed" : "quality gate failed")).slice(0, 300) };
  } catch (e) {
    return { matches: false, reason: `Cloudflare vision validator error: ${(e as Error).message}` };
  }
}

async function serviceClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function generateAndStore(row: ArticleRow, opts: { overwrite?: boolean } = {}): Promise<{ ok: true; url: string; alt: string } | { ok: false; error: string }> {
  const supabase = await serviceClient();
  const staticImage = staticFeaturedImage(row);
  if (staticImage) {
    await supabase.from("daily_articles").update({
      featured_image_url: staticImage.url,
      image_alt_text: staticImage.alt,
      image_generation_status: "ready",
      image_prompt: null,
      image_validation_note: "static military-honor asset",
    }).eq("slug", row.slug);
    return { ok: true, url: staticImage.url, alt: staticImage.alt };
  }
  if (!opts.overwrite && row.featured_image_url) return { ok: true, url: row.featured_image_url, alt: buildAltText(row) };

  const subject = extractImageSubject(row);
  const prompt = buildImagePrompt(subject);
  const alt = buildAltText(row);
  const filename = `${sanitizeFilename(row.slug)}.jpg`;
  await supabase.from("daily_articles").update({ image_generation_status: "generating", image_prompt: prompt }).eq("slug", row.slug);

  try {
    let bytes = await generateImageBytes(prompt);
    let verdict = await validateImageMatchesArticle(bytes, subject);
    let usedPrompt = prompt;
    for (let attempt = 1; !verdict.matches && attempt <= 2; attempt += 1) {
      const stronger = buildImagePrompt(subject, `PREVIOUS ATTEMPT FAILED CLOUDFLARE VISION VALIDATION because: "${verdict.reason}". Fix the failure. Depict the primary subject literally and specifically as a photorealistic editorial photograph.`);
      usedPrompt = stronger;
      bytes = await generateImageBytes(stronger);
      verdict = await validateImageMatchesArticle(bytes, subject);
    }
    if (!verdict.matches) throw new Error(`Generated image failed Cloudflare story-match/photorealism validation: ${verdict.reason}`);

    const { error: upErr } = await supabase.storage.from(BUCKET).upload(filename, bytes, {
      contentType: "image/jpeg",
      cacheControl: "public, max-age=31536000, immutable",
      upsert: true,
    });
    if (upErr) throw upErr;
    const url = `/api/public/article-image/${filename}`;
    await supabase.from("daily_articles").update({
      featured_image_url: url,
      image_alt_text: alt,
      image_generation_status: "ready",
      image_prompt: usedPrompt,
      image_validation_note: `cloudflare-vision ok: ${verdict.reason}`,
    }).eq("slug", row.slug);
    return { ok: true, url, alt };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await supabase.from("daily_articles").update({ image_generation_status: "failed" }).eq("slug", row.slug);
    return { ok: false, error: msg };
  }
}

const SELECT_COLS = "slug,title,dek,category,keywords,seo_keywords,affected_regions,seo_headline,discover_category,texas_impact_summary,featured_image_url,image_generation_status,body_json";

export const generateFeaturedImageForSlug = createServerFn({ method: "POST" })
  .validator((d) => z.object({ slug: z.string().min(1).max(200), overwrite: z.boolean().optional() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = await serviceClient();
    const { data: row, error } = await supabase.from("daily_articles").select(SELECT_COLS).eq("slug", data.slug).maybeSingle();
    if (error || !row) return { ok: false as const, error: "Article not found" };
    return generateAndStore(row as ArticleRow, { overwrite: !!data.overwrite });
  });

export async function generateFeaturedImageForSlugDirect(slug: string, overwrite = false): Promise<{ ok: true; url: string; alt: string } | { ok: false; error: string }> {
  const supabase = await serviceClient();
  const { data: row, error } = await supabase.from("daily_articles").select(SELECT_COLS).eq("slug", slug).maybeSingle();
  if (error || !row) return { ok: false, error: "Article not found" };
  return generateAndStore(row as ArticleRow, { overwrite });
}

export const regenerateFeaturedImage = createServerFn({ method: "POST" })
  .validator((d) => z.object({ slug: z.string().min(1).max(200), token: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
    if (data.token !== expected) return { ok: false as const, error: "Unauthorized" };
    const supabase = await serviceClient();
    const { data: row, error } = await supabase.from("daily_articles").select(SELECT_COLS).eq("slug", data.slug).maybeSingle();
    if (error || !row) return { ok: false as const, error: "Article not found" };
    return generateAndStore(row as ArticleRow, { overwrite: true });
  });

export async function backfillBatch(limit = 5, overwrite = false): Promise<{ processed: number; ok: number; failed: number; results: { slug: string; ok: boolean; error?: string }[] }> {
  const supabase = await serviceClient();
  let q = supabase.from("daily_articles").select(SELECT_COLS).neq("image_generation_status", "generating").in("kind", ["evergreen", "ingested", "news", "sports-nfl", "sports-mlb", "sports-nba"]).order("published_at", { ascending: false }).limit(limit);
  if (!overwrite) q = q.is("featured_image_url", null).in("image_generation_status", ["pending", "failed"]);
  const { data: rows } = await q;
  const results: { slug: string; ok: boolean; error?: string }[] = [];
  for (const row of (rows ?? []) as ArticleRow[]) {
    const r = await generateAndStore(row, { overwrite });
    results.push({ slug: row.slug, ok: r.ok, error: r.ok ? undefined : r.error });
  }
  return { processed: results.length, ok: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, results };
}

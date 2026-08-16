// AI Featured Image System.
// Generates a unique, original editorial image per article via Cloudflare
// Workers AI, uploads it to the private "article-images" Supabase bucket,
// and stores CDN-safe metadata on daily_articles. Never touches article
// slug, URL, body, or existing image_url — featured_image_url is a separate
// column that takes priority at render time.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractEntities } from "@/lib/nlp";

const CLOUDFLARE_IMAGE_MODEL = "@cf/bytedance/stable-diffusion-xl-lightning";
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

export type Domain =
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
  | "legal"
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
  ["legal", /\b(court|courthouse|judge|justice|lawsuit|ruling|appeal|appellate|injunction|litigation|plaintiff|defendant|judicial|legal challenge|supreme court|court of appeals)\b/i],
  ["politics", /\b(governor|senator|representative|legislature|capitol|abbott|patrick|paxton|cruz|cornyn|bill|law|policy|election|ballot)\b/i],
  ["culture", /\b(rodeo|barbecue|music|festival|art|museum|heritage|cultural)\b/i],
];

export function inferDomain(text: string): Domain {
  for (const [d, re] of DOMAIN_KEYWORDS) if (re.test(text)) return d;
  return "general";
}

export type SubjectExtract = {
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
  const concreteSubject = domain === "legal"
    ? `${title}. Show a real Texas courthouse or courtroom tied to this ruling. Context: ${intro || title}. Physical courthouse architecture, courtroom furniture, court files, or anonymous legal participants must dominate. Do not substitute a map, state outline, flag, politician, campaign scene, or election graphic.`
    : intro
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
  legal: "Depict the legal proceeding itself: a believable Texas courthouse exterior or courtroom interior with judicial bench, counsel tables, court files, or anonymous legal participants seen from behind. For an election-law case, keep voting context subtle and secondary. Do not use a politician, candidate, suited spokesperson, flagpole, rally, podium, capitol dome, Texas map, Texas outline, or state-shaped graphic as the primary subject.",
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
  const legalStory = subject.domain === "legal";

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
    legalStory ? "no posed politician, candidate, campaign surrogate, suited spokesperson, flagpole, rally, podium, capitol-dome composition, Texas-shaped outline, map of Texas, election iconography, or ceremonial government portrait" : "",
    !newsroomAllowed ? "no generic newsroom, newspaper, microphone, TV studio, laptop, office, or breaking-news graphic" : "",
    !capitolAllowed ? "avoid the Texas State Capitol dome and generic government-building shots" : "",
    !flagAllowed ? "avoid generic Texas or American flag imagery" : "",
  ].filter(Boolean).join("; ");

  const loc = subject.locations.slice(0, 2).join(", ");
  return [
    "Create a single photorealistic 16:9 editorial news photograph for this exact article.",
    extraGuidance ? `CORRECTION REQUIREMENT: ${extraGuidance}` : "",
    `PRIMARY SUBJECT (must be clearly the main focus of the image): ${subject.concreteSubject}`,
    loc ? `Location context: ${loc}, Texas.` : "Use believable Texas surroundings where relevant.",
    DOMAIN_STEER[subject.domain],
    legalStory ? "LEGAL COMPOSITION PRIORITY: make a real courthouse, courtroom, judicial bench, counsel area, or court-filing process visually dominant. Show physical architecture and materials such as stone, wood, desks, paper files, and courtroom seating. Never use a Texas-shaped graphic, map, seal, flag, or person in a suit as the hero subject." : "",
    "Require realistic professional news/editorial photography, natural lighting, realistic materials and textures, believable scale and perspective, and one coherent scene.",
    "The viewer should immediately understand the concrete subject of this specific story. Do not substitute abstract symbolism for a named place, object, event, facility, industry, weather condition, business, or issue.",
    "If people appear, use anonymous everyday Texans from behind, in silhouette, or with faces out of frame unless a properly licensed official photograph is deliberately being used. Do not fabricate a recognizable real person's face.",
    `Strict rules: ${avoid}.`,
    "Output a landscape JPEG in 16:9, sRGB, no transparency, approximately 1024 by 576 pixels, under 4 MB.",
  ].filter(Boolean).join(" ");
}

export function buildNegativeImagePrompt(subject: SubjectExtract, rejectedReason = ""): string {
  const legalStory = subject.domain === "legal";
  return [
    "illustration",
    "graphic design",
    "vector art",
    "infographic",
    "poster",
    "cartoon",
    "drawing",
    "painting",
    "digital art",
    "3D render",
    "clip art",
    "flat icon",
    "symbolic placeholder",
    "map graphic",
    "state outline graphic",
    "text",
    "headline",
    "caption",
    "watermark",
    "logo",
    "split screen",
    "collage",
    legalStory ? "Texas state silhouette, Texas-shaped graphic, map of Texas, politician, candidate, campaign rally, podium, flagpole, capitol dome, election icon, ballot illustration" : "",
    rejectedReason ? `rejected visual motif: ${rejectedReason.slice(0, 300)}` : "",
  ].filter(Boolean).join(", ").slice(0, 1500);
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

export type VisionVerdict = {
  matches: boolean;
  photorealistic: boolean;
  reason: string;
};

export function parseVisionVerdict(value: unknown): VisionVerdict | null {
  const normalize = (candidate: unknown): VisionVerdict | null => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;
    const v = candidate as { matches?: unknown; photorealistic?: unknown; reason?: unknown };
    if (typeof v.matches !== "boolean" || typeof v.photorealistic !== "boolean") return null;
    return {
      matches: v.matches,
      photorealistic: v.photorealistic,
      reason: typeof v.reason === "string" ? v.reason : "",
    };
  };

  const direct = normalize(value);
  if (direct) return direct;
  if (typeof value !== "string") return null;

  const cleaned = value.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const candidates = [cleaned];
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) candidates.push(cleaned.slice(start, end + 1));

  for (const candidate of candidates) {
    try {
      const parsed = normalize(JSON.parse(candidate));
      if (parsed) return parsed;
    } catch {
      // Try the next candidate; some model responses wrap JSON in prose/code fences.
    }
  }

  // Cloudflare documents JSON Mode as best-effort. The vision model can still
  // occasionally return a plain-English verdict, so preserve clear QC signals
  // instead of misclassifying a useful rejection as a parser failure.
  const prose = cleaned.replace(/\s+/g, " ").trim();
  const lower = prose.toLowerCase();
  const rejectsMatch =
    /\b(?:does not|doesn't|doesnt|fails? to|cannot|can't|cant)\s+(?:clearly\s+|directly\s+)?match\b/.test(lower) ||
    /\bnot (?:a )?(?:direct )?(?:story )?match\b/.test(lower) ||
    /\bunrelated to (?:the )?(?:article|story|subject)\b/.test(lower) ||
    /\bdoes not (?:clearly |directly )?depict\b/.test(lower) ||
    /\bgeneric (?:news )?(?:symbolism|imagery)\b/.test(lower);
  const acceptsMatch = !rejectsMatch && (
    /\b(?:image|scene|photograph|photo)\s+(?:clearly\s+|directly\s+|accurately\s+)?matches?\b/.test(lower) ||
    /\bmatches? (?:the )?(?:article|story|primary subject)\b/.test(lower) ||
    /\b(?:clearly|directly|accurately) depicts? (?:the )?(?:article|story|primary subject)\b/.test(lower) ||
    /\bdirect story match\b/.test(lower) ||
    /\brelevant to (?:the )?(?:article|story|primary subject)\b/.test(lower)
  );
  const rejectsPhoto =
    /\bnot photorealistic\b/.test(lower) ||
    /\bdoes not (?:look|appear|seem) photorealistic\b/.test(lower) ||
    /\b(?:looks?|appears?|seems?) (?:illustrated|cartoon(?:ish)?|vector(?:-like)?|poster(?:-like)?|icon(?:-based)?|diagrammatic|collage(?:-like)?|synthetic(?:-placeholder-like)?)\b/.test(lower);
  const acceptsPhoto = !rejectsPhoto && (
    /\bphotorealistic\b/.test(lower) ||
    /\brealistic (?:professional )?(?:editorial )?(?:photo|photograph)\b/.test(lower) ||
    /\bbelievable (?:professional )?(?:editorial )?(?:photo|photograph)\b/.test(lower)
  );

  if (rejectsMatch || rejectsPhoto) {
    return {
      matches: !rejectsMatch,
      photorealistic: !rejectsPhoto,
      reason: prose.slice(0, 300),
    };
  }
  if (acceptsMatch && acceptsPhoto) {
    return {
      matches: true,
      photorealistic: true,
      reason: prose.slice(0, 300) || "story match and photorealism passed",
    };
  }
  return null;
}

function cloudflareEndpoint(accountId: string, model: string): string {
  return `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`;
}

async function generateImageBytes(prompt: string, negativePrompt: string): Promise<Uint8Array> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) throw new Error("Missing Cloudflare Workers AI credentials: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required");

  const res = await fetch(cloudflareEndpoint(accountId, CLOUDFLARE_IMAGE_MODEL), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: prompt.slice(0, 3500),
      negative_prompt: negativePrompt.slice(0, 1500),
      width: 1024,
      height: 576,
      num_steps: 8,
      guidance: 9.5,
      seed: Math.floor(Math.random() * 2_147_483_646) + 1,
    }),
  });

  if (!res.ok) {
    const raw = await res.text().catch(() => "");
    let detail = raw || `HTTP ${res.status}`;
    try {
      const json = raw ? JSON.parse(raw) as { errors?: { message?: string }[]; error?: { message?: string } } : {};
      detail = json.errors?.[0]?.message || json.error?.message || detail;
    } catch {
      // Preserve the raw response when Cloudflare returns a non-JSON error body.
    }
    throw new Error(`Cloudflare Workers AI ${res.status}: ${String(detail).slice(0, 400)}`);
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  if (contentType.startsWith("image/") || contentType.includes("application/octet-stream")) {
    const buffer = await res.arrayBuffer();
    if (!buffer.byteLength) throw new Error("Cloudflare Workers AI returned an empty image body");
    return new Uint8Array(buffer);
  }

  const raw = await res.text().catch(() => "");
  let json: { success?: boolean; result?: { image?: string } | string; image?: string; errors?: { message?: string }[]; error?: { message?: string } } = {};
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(`Cloudflare Workers AI returned an unexpected non-image response: ${raw.slice(0, 400)}`);
  }
  if (json.success === false) {
    const detail = json.errors?.[0]?.message || json.error?.message || raw || `HTTP ${res.status}`;
    throw new Error(`Cloudflare Workers AI ${res.status}: ${String(detail).slice(0, 400)}`);
  }
  const b64 = (typeof json.result === "object" && json.result ? json.result.image : undefined) || json.image || (typeof json.result === "string" ? json.result : undefined);
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
      "Judge whether the supplied image is both a direct story match and a believable photorealistic editorial photograph.",
      "matches=false if the scene does not clearly depict the primary subject or is generic news symbolism.",
      "photorealistic=false if it looks illustrated, vector-like, cartoon-like, poster-like, icon-based, diagrammatic, collage-like, flat, synthetic-placeholder-like, or contains prominent generated text/signage.",
      "Both values should be true only for a believable professional editorial news photograph tied directly to this story.",
      "Return only the requested schema fields. Do not add prose outside the schema.",
    ].join("\n");
    const res = await fetch(cloudflareEndpoint(accountId, CLOUDFLARE_VISION_MODEL), {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a strict editorial photo quality-control reviewer. Follow the requested response schema exactly." },
          { role: "user", content: validationPrompt },
        ],
        image,
        response_format: {
          type: "json_schema",
          json_schema: {
            type: "object",
            properties: {
              matches: { type: "boolean" },
              photorealistic: { type: "boolean" },
              reason: { type: "string" },
            },
            required: ["matches", "photorealistic", "reason"],
          },
        },
        max_tokens: 160,
        temperature: 0,
      }),
    });
    const raw = await res.text().catch(() => "");
    let json: { success?: boolean; result?: { response?: unknown } | unknown; errors?: { message?: string }[] } = {};
    try { json = raw ? JSON.parse(raw) : {}; } catch { return { matches: false, reason: `Cloudflare vision returned non-JSON HTTP payload ${res.status}` }; }
    if (!res.ok || json.success === false) {
      return { matches: false, reason: `Cloudflare vision HTTP ${res.status}: ${json.errors?.[0]?.message || raw.slice(0, 180)}` };
    }

    const result = json.result;
    const output = result && typeof result === "object" && !Array.isArray(result) && "response" in result
      ? (result as { response?: unknown }).response
      : result;
    const parsed = parseVisionVerdict(output);
    if (!parsed) {
      const preview = typeof output === "string"
        ? output.replace(/\s+/g, " ").trim().slice(0, 180)
        : JSON.stringify(output ?? "").slice(0, 180);
      return { matches: false, reason: `Cloudflare vision validator returned no parseable verdict${preview ? `: ${preview}` : ""}` };
    }
    const ok = parsed.matches === true && parsed.photorealistic === true;
    return { matches: ok, reason: String(parsed.reason || (ok ? "story match and photorealism passed" : "quality gate failed")).slice(0, 300) };
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
    let negativePrompt = buildNegativeImagePrompt(subject);
    let bytes = await generateImageBytes(prompt, negativePrompt);
    let verdict = await validateImageMatchesArticle(bytes, subject);
    let usedPrompt = prompt;
    for (let attempt = 1; !verdict.matches && attempt <= 2; attempt += 1) {
      const stronger = buildImagePrompt(subject, `PREVIOUS ATTEMPT FAILED CLOUDFLARE VISION VALIDATION because: "${verdict.reason}". Fix the failure. Do not reproduce any rejected motif named in that reason. Depict the primary subject literally and specifically as a photorealistic editorial photograph.`);
      usedPrompt = stronger;
      negativePrompt = buildNegativeImagePrompt(subject, verdict.reason);
      bytes = await generateImageBytes(stronger, negativePrompt);
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

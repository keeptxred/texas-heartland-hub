import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractEntities } from "@/lib/nlp";
import {
  buildImagePrompt,
  buildNegativeImagePrompt,
  inferArticleImageDomain,
  inferDomain,
  parseVisionVerdict,
  type Domain,
  type SubjectExtract,
  type VisionVerdict,
} from "./featured-image-core";
import { CLOUDFLARE_CULTURE_IMAGE_MODEL, generateImageBytes, validateImageMatchesArticle } from "./featured-image-cloudflare";
import {
  buildMultiSourceImageGrounding,
  extractSelectedImageLead,
  type MultiSourceImageFact,
  type MultiSourceImageGrounding,
} from "./multisource-image-grounding";

export { buildImagePrompt, buildNegativeImagePrompt, inferDomain, parseVisionVerdict } from "./featured-image-core";
export type { Domain, SubjectExtract, VisionVerdict } from "./featured-image-core";

const BUCKET = "article-images";
const STALE_GENERATION_LEASE_MS = 20 * 60 * 1000;
const SENSITIVE_IMAGE_SUBJECT_RE = /\b(shooting|shot|gunfire|road rage|killed|dead|death|fatal|murder|homicide|victim|suspect|attack|assault)\b/i;
const DATA_CENTER_IMAGE_SUBJECT_RE = /\b(data center(?:s)?|data-center(?:s)?|server farm(?:s)?|hyperscale)\b/i;
const ADMINISTRATIVE_RULEMAKING_IMAGE_SUBJECT_RE = /\b(texas register|state agency rules?|rulemaking|proposed rules?|adopted rules?|administrative rules?)\b/i;

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
  image_validation_note: string | null;
  body_json: unknown;
};

type BodySection = { heading?: string; paragraphs?: string[]; bullets?: string[] };

function bodyJsonText(bodyJson: unknown): string {
  if (!bodyJson || typeof bodyJson !== "object") return "";
  const bj = bodyJson as { intro?: unknown; sections?: unknown; faq?: unknown; keyTakeaways?: unknown };
  const parts: string[] = [];
  if (Array.isArray(bj.intro)) for (const p of bj.intro) if (typeof p === "string") parts.push(p);
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
  if (Array.isArray(bj.keyTakeaways)) for (const p of bj.keyTakeaways) if (typeof p === "string") parts.push(p);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function firstParagraph(bodyJson: unknown): string {
  if (!bodyJson || typeof bodyJson !== "object") return "";
  const bj = bodyJson as { intro?: unknown; sections?: unknown };
  if (Array.isArray(bj.intro) && typeof bj.intro[0] === "string") return bj.intro[0].slice(0, 420);
  if (Array.isArray(bj.sections) && bj.sections.length) {
    const s = bj.sections[0] as { paragraphs?: unknown; body?: unknown };
    if (Array.isArray(s.paragraphs) && typeof s.paragraphs[0] === "string") return s.paragraphs[0].slice(0, 420);
    if (typeof s.body === "string") return s.body.slice(0, 420);
  }
  return "";
}

function sanitizeFilename(slug: string): string {
  return slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "article";
}

function extractImageSubject(row: ArticleRow, grounding: MultiSourceImageGrounding | null = null): SubjectExtract {
  const title = row.seo_headline?.trim() || row.title;
  if (grounding && grounding.mode !== "hold_image" && grounding.leadFact) {
    const evidenceText = [grounding.leadFact, ...grounding.verifiedFacts].join(" ");
    const entities = extractEntities(`${title} ${evidenceText}`);
    const locations = [...(row.affected_regions ?? []), ...entities.filter((e) => /houston|dallas|austin|san antonio|fort worth|el paso|rio grande|texas/i.test(e))]
      .filter((v, i, a) => a.indexOf(v) === i);
    const domain = inferDomain(evidenceText);
    const supporting = grounding.verifiedFacts.filter((fact) => fact !== grounding.leadFact).slice(0, 2).join(" ");
    const concreteSubject = grounding.mode === "verified_symbolic"
      ? `${grounding.leadFact} Neutral real Texas institutional setting representing only this verified action.`
      : `${grounding.leadFact}${supporting ? ` ${supporting}` : ""}`;
    return {
      title,
      firstParagraph: grounding.leadFact,
      entities,
      locations,
      domain,
      concreteSubject,
      evidenceGuidance: grounding.guidance,
      imageGroundingMode: grounding.mode,
    };
  }

  const intro = firstParagraph(row.body_json);
  const haystack = `${title} ${row.dek ?? ""} ${intro} ${bodyJsonText(row.body_json).slice(0, 1800)}`;
  const entities = extractEntities(haystack);
  const locations = [...(row.affected_regions ?? []), ...entities.filter((e) => /houston|dallas|austin|san antonio|fort worth|el paso|rio grande|texas/i.test(e))]
    .filter((v, i, a) => a.indexOf(v) === i);
  const domain = inferArticleImageDomain(`${title} ${row.dek ?? ""}`, haystack);
  const concreteSubject = domain === "legal"
    ? `${title}. A real Texas courthouse or courtroom representing the judicial ruling. ${intro}`.trim()
    : `${title}. ${intro}`.trim();
  return { title, firstParagraph: intro, entities, locations, domain, concreteSubject };
}

export function buildAltText(a: { title: string; category?: string | null }): string {
  return `Editorial news photograph for Keep TX Red article: ${a.title}${a.category ? ` — ${a.category}` : ""}`;
}

export function buildGenerationSafeSubject(subject: SubjectExtract): SubjectExtract {
  const storyText = `${subject.title} ${subject.firstParagraph} ${subject.concreteSubject}`;
  const location = subject.locations[0]?.trim();
  if (ADMINISTRATIVE_RULEMAKING_IMAGE_SUBJECT_RE.test(storyText)) {
    return {
      ...subject,
      domain: "general",
      title: "Public records reading-room reference volume",
      firstParagraph: "",
      locations: [],
      concreteSubject: "A close DSLR photograph of one adult hand turning a thick cream-colored page in a heavy clothbound reference volume at a plain wooden public-records reading-room desk. Printed lines on the page are deliberately out of focus and unreadable. A metal binder clip and a capped pen rest beside the volume, while shelves of matching hardbound reference volumes fall softly out of focus in the background. Natural window light, visible skin texture, paper fibers, wood grain, realistic lens blur, and an unposed documentary camera angle.",
    };
  }
  if (SENSITIVE_IMAGE_SUBJECT_RE.test(storyText)) {
    return {
      ...subject,
      title: `${location ? `${location} ` : "Texas "}interstate roadway infrastructure`.trim(),
      firstParagraph: "",
      concreteSubject: `An empty section of ${location ? `interstate roadway in ${location}` : "Texas interstate roadway"} in daylight, with asphalt travel lanes, concrete overpass, shoulder, guardrails, lane markings, and roadside traffic equipment clearly visible.`,
    };
  }
  if (subject.domain === "energy" && DATA_CENTER_IMAGE_SUBJECT_RE.test(storyText)) {
    return {
      ...subject,
      domain: "general",
      title: "Texas data-center and electrical infrastructure",
      firstParagraph: "",
      concreteSubject: "The exterior of a large Texas server facility in daylight, with cooling equipment, a utility substation, transmission lines, transformers, fenced industrial grounds, and electrical infrastructure clearly visible.",
    };
  }
  return subject;
}

type RepeatedFailureRecoveryScene = {
  domain: SubjectExtract["domain"];
  title: string;
  firstParagraph: string;
  locations: string[];
  concreteSubject: string;
};

export function repeatedFailureRecoveryScene(slug: string): RepeatedFailureRecoveryScene | null {
  switch (slug) {
    case "2026-09-18-top-texas-republicans-knew-bo-french-s-history-of-racist-comments-they-supported":
      return {
        domain: "politics",
        title: "Texas political endorsements and social-media controversy",
        firstParagraph: "",
        locations: ["Texas"],
        concreteSubject: "A physical-camera editorial photograph of an active Texas political campaign workspace focused on the controversy itself: a smartphone lying on a table with a social-media feed visibly open but all text unreadable, endorsement briefing folders, a generic campaign-event credential turned face-down, and a microphone stand and press riser in the background. Include a few anonymous adult campaign staff from behind reviewing the phone and paperwork. No identifiable public figure, party logo, candidate likeness, readable post, slogan, seal, or fabricated quotation.",
      };
    case "2026-09-17-more-young-people-are-getting-involved-with-south-texas-civil-rights-group-amid-":
      return {
        domain: "general",
        title: "Young South Texas community organizers meeting on immigration",
        firstParagraph: "",
        locations: ["Rio Grande Valley, Texas"],
        concreteSubject: "A documentary photograph inside a South Texas community center where a mixed group of young adult volunteers are actively organizing around immigration issues: folding tables, clipboards, voter-rights and know-your-rights handouts with writing deliberately unreadable, bottled water, name-tag stickers turned away, and a wall map of the Rio Grande Valley without labels. Show people from the side or back in a working meeting, not posing. No organization logo, no identifiable real person, no protest reenactment, and no readable political messaging.",
      };
    case "2026-09-14-paxton-talarico-affordability-plans-compared":
      return {
        domain: "politics",
        title: "Texas household affordability policy comparison",
        firstParagraph: "",
        locations: ["Texas"],
        concreteSubject: "A documentary household-cost scene showing the concrete policy targets of two competing affordability plans: a kitchen table with grocery staples, a calculator, utility bills with all names and numbers out of focus, a rent or mortgage statement turned partly away, a pharmacy receipt with unreadable text, and two plain unlabeled policy folders side by side. Natural home lighting, no politicians, no campaign branding, no logos, and no invented readable figures.",
      };
    case "2026-09-10-texas-stock-exchange-first-primary-listings":
      return {
        domain: "general",
        title: "New Texas stock exchange primary-listing launch",
        firstParagraph: "",
        locations: ["Dallas, Texas"],
        concreteSubject: "A physical-camera editorial photograph of a newly opened securities-exchange operations space in Dallas during a primary-listing launch: an exchange bell or podium in the foreground, professional market-operations staff viewed from behind, trading workstations, and large electronic market boards showing abstract charts and deliberately unreadable ticker text. The scene must clearly read as a stock-exchange listing operation rather than a generic office. No NYSE or Nasdaq branding, no company logos, and no fabricated readable ticker symbols.",
      };
    case "2026-08-09-sarah-acosta-ksat-farewell":
      return {
        domain: "general",
        title: "San Antonio morning-news farewell broadcast",
        firstParagraph: "",
        locations: ["San Antonio, Texas"],
        concreteSubject: "A documentary local-television studio during a morning anchor's final broadcast: one anonymous female anchor seen mostly in profile or from behind at a real news desk, studio cameras pointed toward the set, a small bouquet and farewell cards on the edge of the desk, and coworkers gathered off-camera-side in the background. Faces must be incidental and not identifiable as any real broadcaster. No station logo, no readable lower-third, no name text, and no fabricated likeness of Sarah Acosta.",
      };
    case "2026-08-09-san-antonio-frida-fest-record":
      return {
        domain: "culture",
        title: "San Antonio Frida-inspired festival record attempt",
        firstParagraph: "",
        locations: ["San Antonio, Texas"],
        concreteSubject: "A lively indoor community arts festival filled with anonymous adults of varied ages wearing Frida-Kahlo-inspired floral crowns, colorful dresses and jackets, and stylized connected-brow makeup while gathering for a group-count photograph. Show dozens of participants, vendor art tables and festive handmade decorations so the defining record-attempt activity is unmistakable. Do not depict Frida Kahlo herself, do not copy a specific painting, and include no readable event logo or signage.",
      };
    case "2026-08-08-texas-reserve-officer-mexico-homicides":
      return {
        domain: "legal",
        title: "Cross-border law-enforcement custody case",
        firstParagraph: "",
        locations: ["Texas-Mexico border"],
        concreteSubject: "A restrained documentary photograph of cross-border law-enforcement case processing after an arrest: an anonymous adult detainee seen only from behind while being escorted through a secure border-station corridor by two uniformed officers whose agency patches and faces are not readable, with a document intake desk and closed interview-room door visible. No weapons drawn, no blood, no crime-scene reenactment, no child, no victim depiction, and no recognizable likeness of Chad Eberle.",
      };
    case "2026-08-08-tamu-texarkana-athletics-complex":
      return {
        domain: "general",
        title: "College football stadium and athletics complex under construction",
        firstParagraph: "",
        locations: ["Texarkana, Texas"],
        concreteSubject: "A documentary construction photograph of a small-college athletics complex being built in northeast Texas: an unfinished football grandstand sized for a few thousand spectators, fresh synthetic-turf work, construction fencing, earth-moving equipment, partially completed locker or support buildings, and football goalposts or field markings being installed. The image must clearly show an athletics-complex construction project, not a finished generic stadium or an unrelated campus building. No university logo or claim that the pictured construction is the actual Texas A&M-Texarkana site.",
      };
    case "2026-08-08-the-hop-webster-closes-preslees":
      return {
        domain: "general",
        title: "Webster dance hall closing for restaurant conversion",
        firstParagraph: "",
        locations: ["Webster, Texas"],
        concreteSubject: "A documentary photograph of a long-running retro neighborhood dance hall in transition after closing: locked front doors, an unlit vintage marquee with no readable business name, workers carrying restaurant chairs and boxed fixtures through a side entrance, renovation materials near the doorway, and an older roadside commercial building that still retains dance-hall character. The image must communicate closure and restaurant conversion, not a generic empty nightclub. No fabricated The Hop or Preslee's logo and no claim that the building shown is the actual venue.",
      };
    case "2026-08-08-daniella-guzman-kprc-return-ticket-review":
      return {
        domain: "general",
        title: "Houston morning-news anchor returns to the studio",
        firstParagraph: "",
        locations: ["Houston, Texas"],
        concreteSubject: "A documentary morning-news studio as an anonymous female anchor returns to the desk after an internal review: the anchor is seen from the side or back preparing at the desk, a studio camera and teleprompter are aimed at the set, production staff work behind glass, and a neutral stack of compliance-review paperwork sits off to one side with all text unreadable. No station logo, concert or World Cup branding, free-ticket imagery, readable names, or fabricated likeness of Daniella Guzman.",
      };
    case "2026-09-04-denton-191-turtles-shipment":
      return {
        domain: "general",
        title: "Denton wildlife shipment inspection",
        firstParagraph: "",
        locations: ["Denton, Texas"],
        concreteSubject: "A real handheld DSLR documentary photograph inside an ordinary Texas parcel-shipping inspection workspace. Show a slightly cluttered examination table with scuffed cardboard shipping cartons, ventilated reptile transport carriers, a used digital parcel scale, disposable nitrile gloves, packing tape, paper labels turned away or unreadable, and inspection paperwork with writing out of focus. Include natural fluorescent-plus-window lighting, subtle sensor grain, imperfect shadows, minor wear on table surfaces, realistic cardboard fibers, plastic scratches, and uneven object spacing. The frame should read as an unposed local-news photograph made with a physical camera, with true material texture, small asymmetries, ordinary wear, natural optical depth, and believable environmental clutter. Keep the animals calm and safely contained, with the workspace empty of people and the inspection routine understated.",
      };
    case "2026-09-04-texas-food-insecurity-one-in-five":
      return {
        domain: "general",
        title: "Texas food bank grocery packing line",
        firstParagraph: "",
        locations: ["Texas"],
        concreteSubject: "A real documentary photograph taken inside a busy Texas food bank grocery-packing area. The foreground and middle of the frame must be dominated by unmistakable food-bank objects: open family food boxes being filled, rows of canned vegetables and soup, bags of rice or beans, boxed pasta and cereal, fresh produce crates, rolling warehouse carts, and pallet racks of groceries. Show several anonymous adult volunteers from the side or back actively sorting groceries into boxes with ordinary gloves and casual work clothes; faces remain incidental and package branding unreadable. Use natural warehouse lighting, realistic skin and cardboard texture, shelf clutter, imperfect box alignment, scuffed concrete floor, ordinary shadows, and true 35mm depth of field. The image should immediately read as ordinary food-bank distribution work observed by a local-news photographer, with active packing and grocery inventory unmistakable throughout the frame.",
      };
    case "2026-09-04-fort-worth-kindergartner-school-safety":
      return {
        domain: "general",
        title: "Fort Worth elementary school perimeter security",
        firstParagraph: "",
        locations: ["Fort Worth, Texas"],
        concreteSubject: "A documentary photograph of an elementary-school perimeter entrance in Fort Worth, Texas during daylight: closed pedestrian gate, school fence, visitor-entry intercom, exterior security camera, crosswalk markings, yellow school bus in the background, and the main school entrance beyond the fence. The entrance is empty, student identities are absent, school-name lettering is unreadable, and the physical security boundary is the unmistakable subject of the frame.",
      };
    default:
      return null;
  }
}

function buildRepeatedFailureRecoverySubject(row: ArticleRow, subject: SubjectExtract): SubjectExtract {
  const recovery = repeatedFailureRecoveryScene(row.slug);
  return recovery ? { ...subject, ...recovery } : subject;
}

export function buildGenerationOnlyImagePrompt(subject: SubjectExtract, extraGuidance = ""): string {
  const location = subject.locations.slice(0, 2).join(", ");
  const correction = extraGuidance ? `Correction from rejected attempt: ${extraGuidance}. ` : "";
  return [
    correction,
    "Physical-camera editorial news photograph, horizontal 16:9.",
    "Unstaged documentary photojournalism in natural daylight with true-to-life materials, realistic optics, photographic depth of field, small real-world imperfections, and ordinary environmental wear.",
    "Use believable camera texture, natural shadows, small asymmetries, ordinary surface wear, uneven object spacing, realistic materials, and true optical depth throughout the frame.",
    `Assignment: ${subject.title}.`,
    `Primary physical scene: ${subject.concreteSubject}`,
    location ? `Texas location context: ${location}.` : "",
    "Fill the frame with the named physical objects and ordinary environmental details in one coherent real-world scene.",
  ].filter(Boolean).join(" ").replace(/\s+/g, " ").trim().slice(0, 1800);
}

async function serviceClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function resetStaleFeaturedImageGenerationLeasesDirect(): Promise<{ reset: number; error?: string }> {
  const supabase = await serviceClient();
  const staleBefore = new Date(Date.now() - STALE_GENERATION_LEASE_MS).toISOString();
  // Generated Supabase types can lag internal image-generation audit fields.
  // Keep this maintenance write inside the existing registered image writer and
  // narrowly limit it to published rows with no stored image that have remained
  // in `generating` beyond twice the guarded workflow request timeout.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  const { data, error } = await db
    .from("daily_articles")
    .update({
      image_generation_status: "failed",
      image_validation_note: "Image generation lease expired before completion; returned to guarded recovery backlog.",
    })
    .is("featured_image_url", null)
    .eq("image_generation_status", "generating")
    .not("published_at", "is", null)
    .lt("updated_at", staleBefore)
    .select("slug");
  if (error) return { reset: 0, error: error.message };
  return { reset: data?.length ?? 0 };
}

async function loadMultiSourceImageGrounding(db: any, slug: string): Promise<MultiSourceImageGrounding | null> {
  const clusterResult = await db
    .from("news_event_clusters")
    .select("id,source_count,independent_source_count")
    .eq("published_slug", slug)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (clusterResult.error || !clusterResult.data) return null;
  if (Number(clusterResult.data.independent_source_count ?? 0) < 2) return null;

  const factsResult = await db
    .from("news_event_facts")
    .select("fact_text,fact_type,corroboration_count,primary_record_support,has_conflict")
    .eq("cluster_id", clusterResult.data.id);

  let selectedLeadFact: string | null = null;
  const sourcesResult = await db
    .from("news_event_cluster_sources")
    .select("feed_item_id,is_primary_record,relationship_type")
    .eq("cluster_id", clusterResult.data.id)
    .order("is_primary_record", { ascending: false })
    .limit(5);
  const feedIds = (sourcesResult.data ?? [])
    .map((source: { feed_item_id?: unknown }) => Number(source.feed_item_id))
    .filter((id: number) => Number.isInteger(id) && id > 0);
  if (feedIds.length) {
    const feedResult = await db
      .from("texas_news_feed")
      .select("id,cluster_json")
      .in("id", feedIds);
    for (const feed of feedResult.data ?? []) {
      selectedLeadFact = extractSelectedImageLead(feed.cluster_json);
      if (selectedLeadFact) break;
    }
  }

  return buildMultiSourceImageGrounding({
    facts: factsResult.error ? [] : (factsResult.data ?? []) as MultiSourceImageFact[],
    selectedLeadFact,
  });
}

async function generateAndStore(row: ArticleRow, opts: { overwrite?: boolean } = {}): Promise<{ ok: true; url: string; alt: string } | { ok: false; error: string }> {
  const supabase = await serviceClient();
  if (!opts.overwrite && row.featured_image_url) return { ok: true, url: row.featured_image_url, alt: buildAltText(row) };

  const grounding = await loadMultiSourceImageGrounding(supabase as any, row.slug);
  if (grounding?.mode === "hold_image") {
    const note = `multisource-image-hold: no safe verified visual fact; excluded_conflicts=${grounding.excludedConflictCount}`;
    await supabase.from("daily_articles").update({
      image_generation_status: "failed",
      image_prompt: null,
      image_validation_note: note,
    }).eq("slug", row.slug);
    return { ok: false, error: "Featured image held: the multi-source story has no safe corroborated or primary-record fact for visual generation." };
  }

  const subject = extractImageSubject(row, grounding);
  const generationSubject = buildRepeatedFailureRecoverySubject(row, buildGenerationSafeSubject(subject));
  const usesGenerationOnlyPrompt = generationSubject !== subject;
  const makeGenerationPrompt = (guidance = "") => usesGenerationOnlyPrompt
    ? buildGenerationOnlyImagePrompt(generationSubject, guidance)
    : buildImagePrompt(generationSubject, guidance);
  const previousFailure = row.image_generation_status === "failed" && row.image_validation_note?.trim()
    ? row.image_validation_note.trim().slice(0, 600)
    : "";
  const initialCorrection = previousFailure
    ? "Discard the prior composition entirely and start from a new physical-camera viewpoint centered on the concrete real-world subject."
    : "";
  const prompt = makeGenerationPrompt(initialCorrection);
  const alt = buildAltText(row);
  const filename = `${sanitizeFilename(row.slug)}.jpg`;
  await supabase.from("daily_articles").update({ image_generation_status: "generating", image_prompt: prompt }).eq("slug", row.slug);

  try {
    let negativePrompt = buildNegativeImagePrompt(generationSubject, previousFailure);
    const imageModel = subject.domain === "culture" ? CLOUDFLARE_CULTURE_IMAGE_MODEL : undefined;
    let bytes = await generateImageBytes(prompt, negativePrompt, imageModel);
    let verdict = await validateImageMatchesArticle(bytes, generationSubject);
    let usedPrompt = prompt;

    for (let attempt = 1; !verdict.matches && attempt <= 3; attempt += 1) {
      const correction = `Retry ${attempt}. Discard the prior composition completely. Create a new physical-camera news photograph from a different camera position, with the concrete physical subject filling the frame in a believable real-world setting.`;
      const stronger = makeGenerationPrompt(correction);
      usedPrompt = stronger;
      negativePrompt = buildNegativeImagePrompt(generationSubject, verdict.reason);
      bytes = await generateImageBytes(stronger, negativePrompt, imageModel);
      verdict = await validateImageMatchesArticle(bytes, generationSubject);
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
      image_url: url,
      image_alt_text: alt,
      image_generation_status: "ready",
      image_prompt: usedPrompt,
      image_validation_note: `${usesGenerationOnlyPrompt ? "representative-recovery-scene; " : ""}${grounding ? `multisource-${grounding.mode}; ` : ""}cloudflare-vision ok: ${verdict.reason}`,
    }).eq("slug", row.slug);
    return { ok: true, url, alt };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await supabase.from("daily_articles").update({
      image_generation_status: "failed",
      image_validation_note: msg.slice(0, 1000),
    }).eq("slug", row.slug);
    return { ok: false, error: msg };
  }
}

const SELECT_COLS = "slug,title,dek,category,keywords,seo_keywords,affected_regions,seo_headline,discover_category,texas_impact_summary,featured_image_url,image_generation_status,image_validation_note,body_json";

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

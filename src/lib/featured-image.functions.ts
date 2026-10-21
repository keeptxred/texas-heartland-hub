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
const SENSITIVE_ROADWAY_CONTEXT_RE = /\b(road rage|roadway|interstate|highway|traffic|vehicle|driver|crash|collision|shoulder|overpass)\b/i;
const SENSITIVE_COURT_CONTEXT_RE = /\b(court|courthouse|judge|appeal|appellate|ruling|lawsuit|trial|death row|inmate|prison|deportation|custody)\b/i;
const SENSITIVE_PROTEST_CONTEXT_RE = /\b(protest|protester|demonstration|capitol|rally)\b/i;
const SENSITIVE_INVESTIGATION_CONTEXT_RE = /\b(investigation|investigate|police|district attorney|prosecutor|\bda\b|oversight)\b/i;
const SENSITIVE_IMMIGRATION_CONTEXT_RE = /\b(ice|immigration|detainee|detention|deportation|removal)\b/i;
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
  return `Illustrative editorial image for Keep TX Red article: ${a.title}${a.category ? ` — ${a.category}` : ""}`;
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
    if (subject.domain === "transportation" || SENSITIVE_ROADWAY_CONTEXT_RE.test(storyText)) {
      return {
        ...subject,
        title: `${location ? `${location} ` : "Texas "}roadway aftermath setting`.trim(),
        firstParagraph: "",
        concreteSubject: `An empty section of ${location ? `roadway in ${location}` : "Texas roadway"} in daylight, with asphalt lanes, shoulder, traffic-control equipment, and ordinary roadside infrastructure visible.`,
      };
    }
    if (subject.domain === "legal" || SENSITIVE_COURT_CONTEXT_RE.test(storyText)) {
      return {
        ...subject,
        domain: "legal",
        title: `${location ? `${location} ` : "Texas "}judicial process setting`.trim(),
        firstParagraph: "",
        concreteSubject: `A real ${location ? `${location} ` : "Texas "}courthouse exterior or courtroom interior representing the judicial proceeding, with ordinary legal architecture, counsel tables, case folders, or courthouse entry infrastructure.`,
      };
    }
    if (SENSITIVE_PROTEST_CONTEXT_RE.test(storyText)) {
      return {
        ...subject,
        domain: "politics",
        title: `${location ? `${location} ` : "Texas "}civic gathering setting`.trim(),
        firstParagraph: "",
        concreteSubject: `A documentary view of a ${location ? `${location} ` : "Texas "}government or capitol public space prepared for a civic gathering, with plaza, barriers, microphones or ordinary event infrastructure and only distant anonymous figures if any.`,
      };
    }
    if (SENSITIVE_INVESTIGATION_CONTEXT_RE.test(storyText)) {
      return {
        ...subject,
        domain: "general",
        title: `${location ? `${location} ` : "Texas "}public-safety investigation setting`.trim(),
        firstParagraph: "",
        concreteSubject: `A real ${location ? `${location} ` : "Texas "}public-safety or local-government office exterior with ordinary administrative and investigative infrastructure and parked official vehicles.`,
      };
    }
    if (subject.domain === "border" || SENSITIVE_IMMIGRATION_CONTEXT_RE.test(storyText)) {
      return {
        ...subject,
        domain: "border",
        title: `${location ? `${location} ` : "Texas "}federal immigration-enforcement setting`.trim(),
        firstParagraph: "",
        concreteSubject: `A neutral ${location ? `${location} ` : "Texas "}federal immigration-enforcement or detention-administration setting, such as a secured government-facility exterior, controlled entry area, or official vehicle staging area.`,
      };
    }
    return {
      ...subject,
      domain: "general",
      title: `${location ? `${location} ` : "Texas "}public-safety institutional setting`.trim(),
      firstParagraph: "",
      concreteSubject: `A neutral ${location ? `${location} ` : "Texas "}institutional setting directly connected to the article's public-safety context, with ordinary government or administrative infrastructure.`,
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

/**
 * Four October newsroom image failures came from a mismatch between abstract
 * legal/policy headlines and generic photo prompts. Use story-specific visible
 * subjects without reenacting a lawsuit, creating fake government documents, or
 * claiming the photograph depicts the actual venue or event.
 *
 * Both generation AND validation must use the SAME verified representative
 * physical subject. The original title remains present for factual relevance.
 * These are strictly illustrative images, not documentary event photographs.
 */
export function newsroomAbstractPolicyVisualSubject(row: Pick<ArticleRow, "slug" | "title">, subject: SubjectExtract): SubjectExtract {
  const visualAssignments: Record<string, { domain: Domain; scene: string }> = {
    "2026-10-15-texas-appeals-order-requiring-prison-air-conditioning": {
      domain: "general",
      scene: "Interior ventilation and cooling infrastructure in an anonymous institutional correctional building: large visible wall-mounted air-conditioning supply vents, clearly recognizable metal cooling ducts, a thermostatic control box with no readable numbers, concrete-block walls and a secured metal doorway. The air-conditioning equipment must fill the composition. This is an illustrative prison-temperature-control setting, NOT a depiction of a specific Texas prison, the reported appeal hearing, or a claimed installed improvement. No inmates, officers, nameplates, fake court scene or readable text.",
    },
    "2026-09-29-austin-man-shot-by-ice-agent-charged-with-assault-resisting-arrest": {
      domain: "legal",
      scene: "Documentary-style interior of an anonymous Texas federal courthouse security and case-processing area: a walk-through metal detector, security stanchions, plain courthouse corridor doors, an empty public bench, and closed case folders with all labels unreadable. The courthouse process infrastructure must dominate the frame. This is an illustrative legal-process setting connected to the reported custody and assault case, NOT the actual court, the named defendant, the ICE agent, the shooting, or a reenactment of the reported incident. No identifiable people, badges, agency seals, fake evidence, blood, weapons or readable case text.",
    },
    "2026-10-14-san-antonio-files-federal-suit-over-ice-facility-environmental-review": {
      domain: "general",
      scene: "Exterior of an anonymous large existing commercial warehouse with a paved industrial access road, loading-bay doors, utility infrastructure and perimeter fencing; foreground contains a plain closed binder and survey clipboard on a portable site-inspection table, with every page blank or unreadable. This represents the warehouse-site environmental review disputed in litigation and does NOT claim to show the actual East Side site, any ICE operation, or the lawsuit filing.",
    },
    "2026-10-14-texas-sued-for-failing-to-process-over-500-000-voter-registrations": {
      domain: "politics",
      scene: "Close documentary-style view of a Texas election administration paperwork intake workspace: unmistakable stacks of unfilled paper voter-registration application forms with empty checkboxes and ruled fields, plain return envelopes, office inbox trays and a desktop document scanner. The registration-application paperwork is dominant, not ballots, voting machines or a courtroom. All lettering unreadable. This symbolizes administrative application processing and does NOT represent evidence of unprocessed actual voter applications, a specific office, or the filing of a lawsuit.",
    },
    "2026-10-14-texas-penalties-for-data-center-violations-are-light-despite-tough-talk-from-abb": {
      domain: "energy",
      scene: "A large real-world data-center exterior cooling-water and electricity infrastructure setting in Texas: multiple industrial cooling towers and chiller units with prominent metal pipework and water-flow control valves, adjacent high-voltage substation transformers and industrial service roads. Cooling-water infrastructure must dominate the frame; no generic indoor server-rack room. This is an illustrative view of the industry and water-use equipment subject to enforcement, not evidence of any named facility's violation or punishment.",
    },
  };
  // Reserve newsroom slugs carry a date prefix. A legislature-process guide
  // cannot pass a physical-subject image check with a generic Capitol exterior;
  // require a concrete committee-stage setting for both generation and vision.
  const reserveLegislativeProcess = row.slug.endsWith("-how-a-texas-bill-becomes-law")
    ? {
        domain: "politics" as Domain,
        scene: "A realistic documentary-style interior of an anonymous Texas legislative committee meeting room ready for a bill hearing: empty committee desks and microphones, an open stack of proposed-bill paper packets with all printed text deliberately unreadable, one clerk's organized document tray, empty chairs, and a clearly visible public-hearing dais. The central subject must unmistakably be the physical process of reviewing a bill in committee, NOT a generic Texas Capitol exterior or a governor signing a law. Natural indoor lighting and a believable unposed photographic composition. This is an illustrative government-process workspace, not documentation of a specific bill, session, vote, named lawmaker, historical event or venue. No readable signs, logos, false legal text, portraits, fake vote totals or campaign branding.",
      }
    : undefined;
  // Rulemaking reserve failed 2026-10-20 vision review because generic government
  // architecture does not explain a proposed rule or how residents comment.
  // A tangible reading/filing workflow illustrates what the guide actually covers.
  const reserveRulemaking = row.slug.endsWith("-how-texas-state-agencies-make-rules")
    ? {
        domain: "general" as Domain,
        scene: "Close documentary-style photograph of an anonymous Texas public-records reading-room table used to review a proposed agency rule. Foreground subject must clearly be a thick open rulemaking reference volume beside a stack of plain proposed-rule notice sheets, a simple public-comment submission form, blank return envelopes, a metal binder clip, and an uncapped pen. Include a public-access document scanner or file-index shelf softly out of focus in the background. Printed words, form fields, agency seals, labels and identifying dates must be completely unreadable, with no invented official documents or logos. The photo is an illustrative workspace for examining Texas Register notices and preparing comments, NOT an actual state agency hearing, an enacted rule, or a specific official record. NO building exterior, Capitol dome, politician, podium, ceremonial signing or generic government facade; paper-record review must fill the frame.",
      }
    : undefined;
  const assignment = visualAssignments[row.slug] ?? reserveLegislativeProcess ?? reserveRulemaking;
  if (!assignment) return subject;
  return {
    ...subject,
    title: row.title,
    domain: assignment.domain,
    firstParagraph: "",
    concreteSubject: assignment.scene,
    imageGroundingMode: "verified_symbolic",
    evidenceGuidance: "Truthful illustrative representative subject only. No fabricated named property, person, document wording or staged historical event. The photograph illustrates a physical object or infrastructure directly identified in the reported issue.",
  };
}

function buildRepeatedFailureRecoverySubject(row: ArticleRow, subject: SubjectExtract): SubjectExtract {
  if (row.slug === "2026-09-04-denton-191-turtles-shipment") {
    return {
      ...subject,
      domain: "general",
      title: "Denton wildlife shipment inspection",
      firstParagraph: "",
      locations: ["Denton, Texas"],
      concreteSubject: "A real handheld DSLR documentary photograph inside an ordinary Texas parcel-shipping inspection workspace. Show a slightly cluttered examination table with scuffed cardboard shipping cartons, ventilated reptile transport carriers, a used digital parcel scale, disposable nitrile gloves, packing tape, paper labels turned away or unreadable, and inspection paperwork with writing out of focus. Include natural fluorescent-plus-window lighting, subtle sensor grain, imperfect shadows, minor wear on table surfaces, realistic cardboard fibers, plastic scratches, and uneven object spacing. The frame should read as an unposed local-news photograph made with a physical camera, with true material texture, small asymmetries, ordinary wear, natural optical depth, and believable environmental clutter. Keep the animals calm and safely contained, with the workspace empty of people and the inspection routine understated.",
    };
  }
  if (row.slug === "2026-09-04-texas-food-insecurity-one-in-five") {
    return {
      ...subject,
      domain: "general",
      title: "Texas food bank grocery packing line",
      firstParagraph: "",
      locations: ["Texas"],
      concreteSubject: "A real documentary photograph taken inside a busy Texas food bank grocery-packing area. The foreground and middle of the frame must be dominated by unmistakable food-bank objects: open family food boxes being filled, rows of canned vegetables and soup, bags of rice or beans, boxed pasta and cereal, fresh produce crates, rolling warehouse carts, and pallet racks of groceries. Show several anonymous adult volunteers from the side or back actively sorting groceries into boxes with ordinary gloves and casual work clothes; faces remain incidental and package branding unreadable. Use natural warehouse lighting, realistic skin and cardboard texture, shelf clutter, imperfect box alignment, scuffed concrete floor, ordinary shadows, and true 35mm depth of field. The image should immediately read as ordinary food-bank distribution work observed by a local-news photographer, with active packing and grocery inventory unmistakable throughout the frame.",
    };
  }
  if (row.slug === "2026-09-04-fort-worth-kindergartner-school-safety") {
    return {
      ...subject,
      domain: "general",
      title: "Fort Worth elementary school perimeter security",
      firstParagraph: "",
      locations: ["Fort Worth, Texas"],
      concreteSubject: "A documentary photograph of an elementary-school perimeter entrance in Fort Worth, Texas during daylight: closed pedestrian gate, school fence, visitor-entry intercom, exterior security camera, crosswalk markings, yellow school bus in the background, and the main school entrance beyond the fence. The entrance is empty, student identities are absent, school-name lettering is unreadable, and the physical security boundary is the unmistakable subject of the frame.",
    };
  }
  return subject;
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
  // If the visual audit rejected a concrete Commons candidate before a slow
  // generation timed out, preserve its original v4 rejection. Overwriting the
  // note with a generic lease-expired message would make the same known-bad
  // candidate eligible for another hero audit, causing repeated expensive
  // image generations and another timeout. Reset only the status in this lane.
  const rejected = await db
    .from("daily_articles")
    .update({ image_generation_status: "failed" })
    .is("featured_image_url", null)
    .eq("image_generation_status", "generating")
    .not("published_at", "is", null)
    .not("image_candidate_url", "is", null)
    .like("image_validation_note", "stored-cloudflare-vision-v4 rejected:%")
    .lt("updated_at", staleBefore)
    .select("slug");
  if (rejected.error) return { reset: 0, error: rejected.error.message };

  // All other abandoned leases retain their original guarded recovery path.
  // Rows released above are already status=failed and cannot match again.
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
  if (error) return { reset: rejected.data?.length ?? 0, error: error.message };
  return { reset: (rejected.data?.length ?? 0) + (data?.length ?? 0) };
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

type GeneratedHero = { ok: true; url: string; alt: string; imagePrompt?: string; imageValidationNote?: string } | { ok: false; error: string };

async function generateAndStore(row: ArticleRow, opts: { overwrite?: boolean; beforePublish?: boolean } = {}): Promise<GeneratedHero> {
  const supabase = await serviceClient();
  if (!opts.overwrite && row.featured_image_url) return { ok: true, url: row.featured_image_url, alt: buildAltText(row) };

  const grounding = opts.beforePublish ? null : await loadMultiSourceImageGrounding(supabase as any, row.slug);
  if (grounding?.mode === "hold_image") {
    const note = `multisource-image-hold: no safe verified visual fact; excluded_conflicts=${grounding.excludedConflictCount}`;
    await supabase.from("daily_articles").update({
      image_generation_status: "failed",
      image_prompt: null,
      image_validation_note: note,
    }).eq("slug", row.slug);
    return { ok: false, error: "Featured image held: the multi-source story has no safe corroborated or primary-record fact for visual generation." };
  }

  const sourceSubject = extractImageSubject(row, grounding);
  const subject = newsroomAbstractPolicyVisualSubject(row, sourceSubject);
  // The four hand-scoped physical briefs already remove identifiable people,
  // fabricated text, and exact-event reenactments. Do not overwrite the specific
  // subject with the generic sensitive-news courthouse fallback.
  const safeSubject = subject !== sourceSubject ? subject : buildGenerationSafeSubject(subject);
  const generationSubject = buildRepeatedFailureRecoverySubject(row, safeSubject);
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
  // Pre-publication image generation runs before any live daily_articles row
  // exists, so image work must not rely on or mutate a published article.
  if (!opts.beforePublish) {
    const { error: leaseError } = await supabase.from("daily_articles")
      .update({ image_generation_status: "generating", image_prompt: prompt }).eq("slug", row.slug);
    if (leaseError) return { ok: false, error: leaseError.message };
  }

  try {
    let negativePrompt = buildNegativeImagePrompt(generationSubject, previousFailure);
    const imageModel = subject.domain === "culture" ? CLOUDFLARE_CULTURE_IMAGE_MODEL : undefined;
    let bytes = await generateImageBytes(prompt, negativePrompt, imageModel);
    // Safety sanitization may simplify the generation scene, but it must never
    // redefine the story that the validator judges. Validate against the original
    // article subject so a generic safe fallback cannot pass by changing topics.
    let verdict = await validateImageMatchesArticle(bytes, subject);
    let usedPrompt = prompt;

    for (let attempt = 1; !verdict.matches && attempt <= 3; attempt += 1) {
      const correction = `Retry ${attempt}. Discard the prior composition completely. Create a new physical-camera news photograph from a different camera position, with the concrete physical subject filling the frame in a believable real-world setting.`;
      const stronger = makeGenerationPrompt(correction);
      usedPrompt = stronger;
      negativePrompt = buildNegativeImagePrompt(generationSubject, verdict.reason);
      bytes = await generateImageBytes(stronger, negativePrompt, imageModel);
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
    const imageValidationNote = `${grounding ? `multisource-${grounding.mode}; ` : ""}cloudflare-vision ok: ${verdict.reason}`;
    if (!opts.beforePublish) {
      const { error: imageWriteError } = await supabase.from("daily_articles").update({
        featured_image_url: url,
        image_url: url,
        image_alt_text: alt,
        image_generation_status: "ready",
        image_prompt: usedPrompt,
        image_validation_note: imageValidationNote,
      }).eq("slug", row.slug);
      if (imageWriteError) throw imageWriteError;
    }
    return { ok: true, url, alt, imagePrompt: usedPrompt, imageValidationNote };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!opts.beforePublish) {
      await supabase.from("daily_articles").update({
        image_generation_status: "failed",
        image_validation_note: msg.slice(0, 1000),
      }).eq("slug", row.slug);
    }
    return { ok: false, error: msg };
  }
}

/**
 * Produces and validates the complete hero before publication. The story may
 * be committed as PUBLISHED only after this method returns ok with URL and
 * exact vision provenance. Failed images leave no public article behind.
 */
export async function prepareFeaturedImageForUnpublishedNewsroomArticle(
  article: Pick<ArticleRow, "slug" | "title" | "dek" | "category" | "body_json">,
): Promise<GeneratedHero> {
  const row: ArticleRow = {
    ...article, keywords: null, seo_keywords: null, affected_regions: null,
    seo_headline: null, discover_category: null, texas_impact_summary: null,
    featured_image_url: null, image_generation_status: "pending", image_validation_note: null,
  };
  return generateAndStore(row, { beforePublish: true });
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

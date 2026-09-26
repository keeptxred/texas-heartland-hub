import { extractEntities } from "@/lib/nlp";
import { inferArticleImageDomain, type SubjectExtract } from "./featured-image-core";

const DATA_CENTER_SUBJECT_RE = /\b(data center(?:s)?|data-center(?:s)?|server farm(?:s)?|hyperscale)\b/i;
const AUDITABLE_EXTERNAL_HOSTS = new Set([
  "commons.wikimedia.org",
  "upload.wikimedia.org",
  "thumb.wikimedia.org",
  "raw.githubusercontent.com",
  "keeptxred.com",
  "www.keeptxred.com",
]);

const GOVERNED_EXACT_ENTITY_GRAPHICS = new Map<string, string>([
  [
    "2026-09-17-more-young-people-are-getting-involved-with-south-texas-civil-rights-group-amid-",
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg",
  ],
  [
    "2026-09-10-texas-stock-exchange-first-primary-listings",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/TXSE_logo_Sep_2024.svg/1280px-TXSE_logo_Sep_2024.svg.png",
  ],
]);

export type ArticleHeroReadinessRow = {
  slug: string;
  title: string;
  dek?: string | null;
  category?: string | null;
  affected_regions?: string[] | null;
  seo_headline?: string | null;
  featured_image_url?: string | null;
  image_candidate_url?: string | null;
  image_candidate_alt_text?: string | null;
  image_alt_text?: string | null;
  image_generation_status?: string | null;
  image_validation_note?: string | null;
  quality_flags?: string[] | null;
  body_json?: unknown;
};

type BodySection = { heading?: string; paragraphs?: string[]; bullets?: string[] };

function bodyText(bodyJson: unknown): string {
  if (!bodyJson || typeof bodyJson !== "object") return "";
  const body = bodyJson as { intro?: unknown; sections?: unknown; keyTakeaways?: unknown };
  const parts: string[] = [];
  if (Array.isArray(body.intro)) for (const value of body.intro) if (typeof value === "string") parts.push(value);
  if (Array.isArray(body.sections)) {
    for (const raw of body.sections) {
      const section = raw as BodySection;
      if (typeof section.heading === "string") parts.push(section.heading);
      if (Array.isArray(section.paragraphs)) for (const value of section.paragraphs) if (typeof value === "string") parts.push(value);
      if (Array.isArray(section.bullets)) for (const value of section.bullets) if (typeof value === "string") parts.push(value);
    }
  }
  if (Array.isArray(body.keyTakeaways)) for (const value of body.keyTakeaways) if (typeof value === "string") parts.push(value);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function firstParagraph(bodyJson: unknown): string {
  if (!bodyJson || typeof bodyJson !== "object") return "";
  const body = bodyJson as { intro?: unknown; sections?: unknown };
  if (Array.isArray(body.intro) && typeof body.intro[0] === "string") return body.intro[0].slice(0, 420);
  if (Array.isArray(body.sections) && body.sections.length > 0) {
    const section = body.sections[0] as BodySection;
    if (Array.isArray(section.paragraphs) && typeof section.paragraphs[0] === "string") return section.paragraphs[0].slice(0, 420);
  }
  return "";
}

function normalizeReadinessDomain(
  row: ArticleHeroReadinessRow,
  inferred: SubjectExtract["domain"],
): SubjectExtract["domain"] {
  const category = (row.category ?? "").trim().toLowerCase();
  if (["sports", "nfl", "nba", "mlb", "mls", "wnba", "nhl", "college sports"].includes(category)) return "sports";
  if (category === "weather") return "weather";
  if (["politics", "government", "elections", "local government"].includes(category)) return "politics";
  if (["legal", "courts", "court"].includes(category)) return "legal";
  return inferred;
}

export function hasHeroVisualReadinessProvenance(
  note: string | null | undefined,
  heroUrl?: string | null,
  articleSlug?: string | null,
): boolean {
  const value = (note ?? "").trim().toLowerCase();
  if (value.includes("cloudflare-vision ok:") || /cloudflare-vision-v\d+\s+ok:/.test(value)) return true;
  if (
    value.startsWith("exact-entity-graphic-v1 ok:")
    && isGovernedExactEntityGraphic(articleSlug, heroUrl)
  ) return true;

  // Only tightly scoped official government graphics may bypass pixel validation.
  // Historical/manual Commons notes sometimes used the authoritative-image-exempt
  // prefix to record licensing provenance. Licensing provenance is not visual
  // story-match provenance, so those rows must still pass the stored-hero vision
  // gate before they are treated as ready.
  return value.startsWith("authoritative-image-exempt:")
    && isAuthoritativeOfficialGraphic(heroUrl);
}

export function buildExhaustedHeroRecoveryNote(
  policyVersion: string,
  rejectionReason: string,
  repairError: string,
): string {
  const version = policyVersion.trim().toLowerCase().replace(/[^a-z0-9.-]/g, "") || "v4";
  return `stored-cloudflare-vision-${version} rejected: ${rejectionReason.slice(0, 520)}; generated recovery failed: ${repairError.slice(0, 360)}`.slice(0, 1000);
}

export function isHeroReadinessQuarantined(row: Pick<ArticleHeroReadinessRow,
  "image_candidate_url" | "image_generation_status" | "image_validation_note" | "quality_flags"
>): boolean {
  const candidate = row.image_candidate_url?.trim();
  const status = (row.image_generation_status ?? "").trim().toLowerCase();
  const note = (row.image_validation_note ?? "").trim().toLowerCase();
  return Boolean(candidate)
    && status === "failed"
    && note.startsWith("stored-cloudflare-vision-v4 rejected:")
    && (row.quality_flags ?? []).includes("image_requires_visual_validation");
}

export function isGovernedExactEntityGraphic(
  articleSlug: string | null | undefined,
  value: string | null | undefined,
): boolean {
  const slug = (articleSlug ?? "").trim();
  const url = (value ?? "").trim();
  if (!slug || !url) return false;
  return GOVERNED_EXACT_ENTITY_GRAPHICS.get(slug) === url;
}

export function isAuthoritativeOfficialGraphic(value: string | null | undefined): boolean {
  const raw = (value ?? "").trim();
  if (!raw) return false;
  try {
    const url = new URL(raw, "https://keeptxred.com");
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();
    if (host === "www.nhc.noaa.gov" && path.startsWith("/storm_graphics/")) return true;
    return host === "www.aoml.noaa.gov" && path.includes("hurricane") && path.includes("outlook");
  } catch {
    return false;
  }
}

export function resolveAuditableHeroUrl(value: string, requestUrl: string): URL | null {
  try {
    const request = new URL(requestUrl);
    const resolved = new URL(value, request);
    if (resolved.protocol !== "https:") return null;
    if (resolved.origin === request.origin) return resolved;
    if (AUDITABLE_EXTERNAL_HOSTS.has(resolved.hostname.toLowerCase())) return resolved;
    if (resolved.hostname.toLowerCase().endsWith(".noaa.gov")) return resolved;
    return null;
  } catch {
    return null;
  }
}

export function buildHeroReadinessSubject(row: ArticleHeroReadinessRow): SubjectExtract {
  const title = row.seo_headline?.trim() || row.title;
  const intro = firstParagraph(row.body_json);
  const fullText = `${title} ${row.dek ?? ""} ${intro} ${bodyText(row.body_json).slice(0, 1800)}`.replace(/\s+/g, " ").trim();
  const entities = extractEntities(fullText);
  const locations = [...(row.affected_regions ?? []), ...entities.filter((entity) => /houston|dallas|austin|san antonio|fort worth|el paso|rio grande|texas/i.test(entity))]
    .filter((value, index, all) => Boolean(value) && all.indexOf(value) === index);
  const inferredDomain = inferArticleImageDomain(`${title} ${row.dek ?? ""}`, fullText);
  const domain = normalizeReadinessDomain(row, inferredDomain);
  const storyText = `${title} ${row.dek ?? ""} ${intro}`;

  if (DATA_CENTER_SUBJECT_RE.test(storyText)) {
    const baseSubject = `${title}. ${intro}`.trim();
    return {
      title,
      firstParagraph: intro,
      entities,
      locations,
      domain,
      concreteSubject: `${baseSubject} This is a data-center story. A stored editorial photo can be a truthful direct match in either of two ways: it can clearly depict a central named person, agency, institution, company, team, venue, or other concrete entity that the story is materially about, or it can visibly depict the data-center, grid, power, cooling, server, or utility infrastructure itself. When a facility or building is being used as visual evidence of a data center, the frame must show concrete cues such as industrial cooling equipment, server-facility structures, electrical substations, transformers, transmission equipment, generator or utility infrastructure, or clearly visible server-hall context. A plain brick, office-like, residential-looking, warehouse-like, or windowless building exterior with no visible data-center infrastructure does not qualify merely because a filename, caption, source page, or metadata identifies it as a data center.`.trim(),
    };
  }

  const baseSubject = domain === "legal"
    ? `${title}. A real Texas courthouse, courtroom, disputed object, institution, or concrete practice directly representing the judicial story. ${intro}`.trim()
    : `${title}. ${intro}`.trim();

  return {
    title,
    firstParagraph: intro,
    entities,
    locations,
    domain,
    concreteSubject: `${baseSubject} The defining subject or activity must be recognizable from visible image content alone without relying on the filename, source metadata, hidden caption, or an editor knowing what the image is supposed to depict.`.trim(),
  };
}
